
import { ServicePackage } from '../types';

const PACKAGES_KEY = 'washgo_pro_packages';
const SURGE_MULTIPLIER_KEY = 'washgo_pro_surge_multiplier';

const defaultPackages: ServicePackage[] = [
    {
        key: 'pkg_1716301538352',
        details: {
            nl: { name: 'Exterieur Was & Decontaminatie', price: 49, features: ['Hogedruk voorwas', 'Twee-emmer handwas', 'Velgen en banden reiniging', 'Chemische decontaminatie (ijzer & teer)', 'Aanbrengen beschermende sealant'] },
            en: { name: 'Exterior Wash & Decontamination', price: 49, features: ['High-pressure pre-wash', 'Two-bucket hand wash', 'Wheel and tire cleaning', 'Chemical decontamination (iron & tar)', 'Protective sealant applied'] },
            fr: { name: 'Lavage & Décontamination Extérieur', price: 49, features: ['Prélavage haute pression', 'Lavage manuel à deux seaux', 'Nettoyage des jantes et pneus', 'Décontamination chimique (fer & goudron)', 'Application d\'un scellant protecteur'] }
        }
    },
    {
        key: 'pkg_1716301538353',
        details: {
            nl: { name: 'Dieptereiniging Interieur & Bekleding', price: 79, features: ['Volledig stofzuigen van het interieur', 'Dieptereiniging van stoffen/leren stoelen', 'Reiniging van tapijten en matten', 'Dashboard- en paneelreiniging', 'Ramen reinigen (binnenkant)'] },
            en: { name: 'Deep Interior Cleaning & Upholstery', price: 79, features: ['Complete interior vacuum', 'Deep cleaning of fabric/leather seats', 'Carpet and mat shampooing', 'Dashboard and panel cleaning', 'Interior window cleaning'] },
            fr: { name: 'Nettoyage en Profondeur Intérieur & Sellerie', price: 79, features: ['Aspiration complète de l\'intérieur', 'Nettoyage en profondeur des sièges en tissu/cuir', 'Nettoyage des moquettes et tapis', 'Nettoyage tableau de bord et panneaux', 'Nettoyage des vitres (intérieur)'] }
        }
    },
    {
        key: 'pkg_1716301538354',
        details: {
            nl: { name: 'Volledig Detailing Pakket', price: 119, features: ['Alle diensten van Exterieur Was', 'Alle diensten van Interieur Dieptereiniging', 'Kunststof exterieurdelen behandelen', 'Motorruimte reiniging (op verzoek)', 'Luxe interieurgeur'] },
            en: { name: 'Comprehensive Detailing Package', price: 119, features: ['All services from Exterior Wash', 'All services from Interior Deep Clean', 'Exterior plastic trim restored', 'Engine bay cleaning (on request)', 'Luxury interior fragrance'] },
            fr: { name: 'Forfait Detailing Complet', price: 119, features: ['Tous les services du Lavage Extérieur', 'Tous les services du Nettoyage en Profondeur Intérieur', 'Restauration des plastiques extérieurs', 'Nettoyage du compartiment moteur (sur demande)', 'Parfum d\'intérieur de luxe'] }
        }
    },
    {
        key: 'pkg_1716301538355',
        details: {
            nl: { name: 'Premium Wax & Polish', price: 89, features: ['Inclusief Exterieur Was & Decontaminatie', 'Lichte polijstbehandeling om glans te herstellen', 'Aanbrengen van hoogwaardige Carnauba wax', 'Verbetert de kleurdiepte', 'Biedt 3-6 maanden bescherming'] },
            en: { name: 'Premium Wax & Polish', price: 89, features: ['Includes Exterior Wash & Decontamination', 'Light polish to enhance gloss', 'Application of high-grade Carnauba wax', 'Improves color depth', 'Provides 3-6 months of protection'] },
            fr: { name: 'Cire & Lustrage Premium', price: 89, features: ['Inclut Lavage & Décontamination Extérieur', 'Polissage léger pour rehausser la brillance', 'Application d\'une cire Carnauba de haute qualité', 'Améliore la profondeur de la couleur', 'Offre 3-6 mois de protection'] }
        }
    },
    {
        key: 'pkg_1716301538356',
        details: {
            nl: { name: 'Lakcorrectie & Polijsten', price: 249, features: ['Inclusief Exterieur Was & Decontaminatie', 'Meer-staps polijstproces', 'Verwijdering van 70-90% van de krassen', 'Herstelt diepe glans en reflectie', 'Voorbereiding voor keramische coating'] },
            en: { name: 'Paint Correction & Polishing', price: 249, features: ['Includes Exterior Wash & Decontamination', 'Multi-stage machine polishing', 'Removes 70-90% of swirls and scratches', 'Restores deep gloss and reflection', 'Prepares surface for ceramic coating'] },
            fr: { name: 'Correction & Polissage de la Peinture', price: 249, features: ['Inclut Lavage & Décontamination Extérieur', 'Processus de polissage en plusieurs étapes', 'Élimination de 70-90% des rayures', 'Restaure une brillance et une réflexion profondes', 'Préparation pour un revêtement céramique'] }
        }
    }
];

export const packageService = {
  initializePackages: (): void => {
    try {
      const packagesJson = localStorage.getItem(PACKAGES_KEY);
      if (!packagesJson || JSON.parse(packagesJson).length === 0) {
        localStorage.setItem(PACKAGES_KEY, JSON.stringify(defaultPackages));
      }
    } catch (error) {
      console.error("Failed to initialize packages:", error);
      localStorage.setItem(PACKAGES_KEY, JSON.stringify(defaultPackages));
    }
  },
  
  getPackages: (): ServicePackage[] => {
    try {
      const packagesJson = localStorage.getItem(PACKAGES_KEY);
      return packagesJson ? JSON.parse(packagesJson) : [];
    } catch (error) {
      console.error("Failed to retrieve packages:", error);
      return [];
    }
  },

  savePackages: (packages: ServicePackage[]): void => {
    localStorage.setItem(PACKAGES_KEY, JSON.stringify(packages));
  },

  addPackage: (newPackage: ServicePackage): void => {
    const packages = packageService.getPackages();
    packages.push(newPackage);
    packageService.savePackages(packages);
  },

  updatePackage: (updatedPackage: ServicePackage): void => {
    const packages = packageService.getPackages();
    const index = packages.findIndex(p => p.key === updatedPackage.key);
    if (index !== -1) {
      packages[index] = updatedPackage;
      packageService.savePackages(packages);
    }
  },

  deletePackage: (key: string): void => {
    const packages = packageService.getPackages();
    const filteredPackages = packages.filter(p => p.key !== key);
    packageService.savePackages(filteredPackages);
  },
  
  getSurgeMultiplier: (): number => {
      const multiplier = localStorage.getItem(SURGE_MULTIPLIER_KEY);
      return multiplier ? parseFloat(multiplier) : 1;
  },

  setSurgeMultiplier: (multiplier: number): void => {
      localStorage.setItem(SURGE_MULTIPLIER_KEY, multiplier.toString());
  }
};
