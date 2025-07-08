
import { GoogleGenAI } from "@google/genai";
import { DamageReport, ServicePackage, ServiceDetails, Locale, Issue } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
};

const localeToLanguageName = (locale: Locale): string => {
    switch (locale) {
        case 'nl': return 'Dutch';
        case 'fr': return 'French';
        case 'en':
        default: return 'English';
    }
};

export const analyzeVehicleImage = async (
  exteriorImageBase64: string,
  interiorImageBase64: string,
  licensePlate: string,
  servicePackages: ServicePackage[],
  locale: Locale
): Promise<DamageReport> => {
  const model = 'gemini-2.5-flash-preview-04-17';

  const suggestionKeys = servicePackages.map(p => p.key);
  const languageName = localeToLanguageName(locale);

  const prompt = `
    You are an expert car detailer and sales assistant. Analyze the two provided images of a vehicle with license plate ${licensePlate}. Image 1 is the EXTERIOR, Image 2 is the INTERIOR.
    Your task is to provide a detailed analysis in JSON format. The JSON object MUST strictly follow this structure:
    {
      "make": "string",
      "model": "string",
      "color": "string",
      "persuasiveSummary": "string (A friendly, expert summary for the customer, linking the observations to the benefits of the recommended service. Max 2-3 sentences.)",
      "exteriorIssues": [
        {
          "area": "string (e.g., 'Driver side door', 'Front bumper')",
          "observation": "string (e.g., 'Noticeable road tar and bug splatter')",
          "recommendation": "string (e.g., 'Requires chemical decontamination')"
        }
      ],
      "interiorIssues": [
        {
          "area": "string (e.g., 'Driver's seat', 'Center console')",
          "observation": "string (e.g., 'Light dust and fingerprints')",
          "recommendation": "string (e.g., 'Suggests interior wipe-down and protection')"
        }
      ],
      "bestSuggestionKey": "string (use ONE of the allowed Suggestion Keys)",
      "riskScore": "number (a score from 1-100)"
    }

    ALLOWED SUGGESTION KEYS: ${JSON.stringify(suggestionKeys)}

    IMPORTANT: The entire response, including all strings within the JSON object (make, model, color, summary, all fields in issues), must be in ${languageName}.

    YOUR TASKS:
    1.  From the EXTERIOR image, identify the vehicle's make, model, and primary color.
    2.  Carefully inspect both images. For each specific issue you find, create an issue object and add it to the appropriate 'exteriorIssues' or 'interiorIssues' array. Be specific about the area. If an area is clean, do not add an issue for it.
    3.  Based on the overall condition, determine the single most appropriate service package and provide its key in 'bestSuggestionKey'.
    4.  Write the 'persuasiveSummary'. This is crucial. It should be customer-facing. For example: "The analysis of your vehicle shows some typical buildup on the exterior and minor signs of use inside. Our '${suggestionKeys.length > 0 ? servicePackages.find(p => p.key === suggestionKeys[0])?.details['en'].name : 'recommended'}' package is perfectly suited to address these points, restoring the deep shine of the paintwork and refreshing the cabin for a like-new feel." (This example is in English, you must translate it and the full response to ${languageName}).
    5.  Calculate a 'riskScore' from 1 (low risk, clean, low-value car) to 100 (high risk, expensive car, severe damage). Consider the vehicle's perceived value (e.g., a Porsche is higher risk than a Toyota) and the severity/type of existing damages. A luxury car with deep scratches should have a very high score (e.g., 85-95). A clean economy car should have a very low score (e.g., 5-15).

    Return ONLY the raw JSON object, without any markdown formatting, comments, or explanations.
  `;

  try {
    const textPart = { text: prompt };
    const exteriorImagePart = fileToGenerativePart(exteriorImageBase64, 'image/jpeg');
    const interiorImagePart = fileToGenerativePart(interiorImageBase64, 'image/jpeg');

    const result = await ai.models.generateContent({
      model: model,
      contents: { parts: [textPart, exteriorImagePart, interiorImagePart] },
      config: {
        responseMimeType: "application/json",
      },
    });

    let jsonStr = result.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr) as DamageReport;

    if (!parsedData.make || !parsedData.model || !Array.isArray(parsedData.exteriorIssues) || !Array.isArray(parsedData.interiorIssues) || !parsedData.persuasiveSummary || !parsedData.bestSuggestionKey || typeof parsedData.riskScore !== 'number') {
        throw new Error("AI response is missing required fields or has an invalid structure.");
    }
    
    if (!suggestionKeys.includes(parsedData.bestSuggestionKey)) {
        console.warn(`AI suggested a key '${parsedData.bestSuggestionKey}' that is not in the allowed list. Defaulting to first available key.`);
        parsedData.bestSuggestionKey = suggestionKeys[0] || '';
    }

    return parsedData;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error && error.message.includes('SAFETY')) {
        throw new Error("errorSafety");
    }
    throw new Error("Failed to analyze vehicle image. The AI model may be temporarily unavailable or the response was invalid.");
  }
};


export const generateServicePackageFromPrompt = async (prompt: string): Promise<ServiceDetails> => {
    const model = 'gemini-2.5-flash-preview-04-17';
    const generationPrompt = `
      You are a service package creator for a car detailing web app. Based on the user's prompt, create a JSON object for a single service package. The JSON MUST strictly follow this structure:
      {
        "name": "string (the package name in English)",
        "price": "number (the price in euros, as a number, not a string)",
        "features": ["string", "string", ...] (a list of key features in English)
      }
      User Prompt: "${prompt}"

      IMPORTANT: Extract the name, price, and features from the prompt. Provide ONLY the raw JSON object. Do not add any markdown, comments, or explanations. If the prompt is unclear, create a sensible default package based on the words you can understand.
    `;

    try {
        const result = await ai.models.generateContent({
            model: model,
            contents: generationPrompt,
            config: {
                responseMimeType: "application/json",
            },
        });
        
        let jsonStr = result.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }
        const parsedData = JSON.parse(jsonStr) as ServiceDetails;

        if (!parsedData.name || typeof parsedData.price !== 'number' || !Array.isArray(parsedData.features)) {
            throw new Error("AI response for package generation is missing required fields or has an invalid structure.");
        }

        return parsedData;

    } catch (error) {
        console.error("Error generating service package:", error);
        throw new Error("Failed to generate service package from prompt.");
    }
};

export const translateServiceDetails = async (details: ServiceDetails, targetLocale: Locale): Promise<ServiceDetails> => {
    if (targetLocale === 'en') return details;
    
    const localeMap = {
        'nl': 'Dutch',
        'fr': 'French'
    };

    const model = 'gemini-2.5-flash-preview-04-17';
    const translationPrompt = `
      You are a translation assistant for a car detailing app. Translate the 'name' and each item in the 'features' array of the following JSON object into ${localeMap[targetLocale]}.
      Source JSON (English):
      ${JSON.stringify({ name: details.name, features: details.features })}

      Provide the translated data in a JSON object with the exact same structure as the source. Return ONLY the raw JSON object, without any markdown formatting.
    `;

    try {
        const result = await ai.models.generateContent({
            model: model,
            contents: translationPrompt,
            config: {
                responseMimeType: "application/json",
            },
        });
        
        let jsonStr = result.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }
        const parsedData = JSON.parse(jsonStr) as { name: string; features: string[] };

        if (!parsedData.name || !Array.isArray(parsedData.features)) {
            throw new Error(`AI response for translation to ${targetLocale} is invalid.`);
        }

        return {
            ...details,
            name: parsedData.name,
            features: parsedData.features,
        };

    } catch (error) {
        console.error(`Error translating service details to ${targetLocale}:`, error);
        throw new Error(`Failed to translate service details to ${targetLocale}.`);
    }
};

export const generateQueryAnswer = async (customerQuestion: string): Promise<string> => {
  const model = 'gemini-2.5-flash-preview-04-17';
  const systemInstruction = `JOUW ROL:
Jij bent een behulpzame, efficiënte en tekst-gebaseerde assistent voor onze app Wash&go PRO. Je taak is om vragen en verzoeken van klanten te verwerken en te beantwoorden op basis van de reeds ingegeven kennis.

INVOER:
Je ontvangt altijd platte tekst. Deze tekst is een vraag of een verzoek van een klant, direct afkomstig uit een cel van een spreadsheet. Er worden GEEN bestanden, codeblokken, of speciale formaten gestuurd, alleen pure, onopgemaakte tekst.

TAAK:
1. Lees de klantvraag zorgvuldig.
2. Beantwoord de vraag of voer het verzoek uit op een duidelijke en beknopte manier.
3. Als de vraag om specifieke informatie vraagt (bijv. een prijs, een procedure, een datum), geef deze dan direct.
4. Als je meer informatie nodig hebt om een accuraat antwoord te geven, stel dan een specifieke vervolgvraag.

UITVOERFORMAAT:
Jouw antwoord moet ALTIJD platte tekst zijn.
**Geef GEEN omkadering zoals "--- START OF FILE ---", "--- END OF FILE ---", of andere markers.**
**Geef GEEN codeblokken, JSON, XML, Markdown-tabellen of andere gestructureerde formaten, tenzij de vraag hier expliciet om vraagt.**
Concentreer je alleen op het pure, directe antwoord dat past in één cel van een spreadsheet.
Het antwoord moet direct en klaar zijn voor de klant.

---

VOORBEELDEN:
(Dit deel is cruciaal! Geef hier minstens 2-3 voorbeelden die laten zien hoe de invoer eruitziet en wat voor antwoord je van de AI verwacht, precies in het formaat dat je wilt.)

**Voorbeeld 1:**
Gebruikersvraag: Ik wil een kleine beurt voor mijn auto. Wat zijn de kosten?
Antwoord: Een kleine beurt kost gemiddeld €120. Dit omvat olie verversen, filters controleren en vloeistoffen bijvullen.

**Voorbeeld 2:**
Gebruikersvraag: Wat is de snelste manier om een auto te laten reinigen?
Antwoord: De snelste manier is onze express buitenreiniging, die ongeveer 30 minuten duurt.

**Voorbeeld 3:**
Gebruikersvraag: Wat zijn de openingstijden op zaterdag?
Antwoord: Op zaterdag zijn we geopend van 09:00 tot 17:00 uur.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: customerQuestion,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API for query answer:", error);
    throw new Error("Failed to generate answer. The AI model may be unavailable.");
  }
};
