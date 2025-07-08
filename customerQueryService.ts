// services/customerQueryService.ts

export interface CustomerQuery {
  id: string;
  question: string;
  source: string;
  timestamp: string;
}

const mockQueries: CustomerQuery[] = [
  {
    id: 'q1',
    question: 'Ik wil mijn Ford Focus laten reinigen, interieur en exterieur. Wat kost dat?',
    source: 'Google Sheet',
    timestamp: '2024-05-23T10:30:00Z',
  },
  {
    id: 'q2',
    question: 'Hoe lang duurt een kleine beurt voor een Volkswagen Golf?',
    source: 'Google Sheet',
    timestamp: '2024-05-23T11:15:00Z',
  },
  {
    id: 'q3',
    question: 'Kan ik mijn auto laten ophalen voor een service?',
    source: 'Contact Form',
    timestamp: '2024-05-23T12:05:00Z',
  },
  {
    id: 'q4',
    question: 'Do you offer ceramic coatings and what is the price for a BMW 5 series?',
    source: 'Google Sheet',
    timestamp: '2024-05-23T14:00:00Z'
  },
];

export const customerQueryService = {
  getQueries: (): Promise<CustomerQuery[]> => {
    // Simulate API delay
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(mockQueries);
        }, 500);
    });
  },
};
