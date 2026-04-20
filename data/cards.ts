export interface PaymentCard {
  id: string;
  type: 'uzcard' | 'humo' | 'visa' | 'mastercard';
  lastFour: string;
  holderName: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
  balance?: number; // in thousands of so'm (mock)
}

export const cards: PaymentCard[] = [
  {
    id: 'card1',
    type: 'uzcard',
    lastFour: '4521',
    holderName: 'FOYDALANUVCHI',
    expiryMonth: '08',
    expiryYear: '27',
    isDefault: true,
    balance: 1250,
  },
  {
    id: 'card2',
    type: 'humo',
    lastFour: '8834',
    holderName: 'FOYDALANUVCHI',
    expiryMonth: '03',
    expiryYear: '26',
    isDefault: false,
    balance: 430,
  },
];

export const CARD_THEMES = {
  uzcard: { bg: ['#1A1A2E', '#16213E'], label: 'UZCARD', textColor: '#FFFFFF', logo: '🇺🇿' },
  humo: { bg: ['#0F3460', '#533483'], label: 'HUMO', textColor: '#FFFFFF', logo: '💳' },
  visa: { bg: ['#1A1F71', '#1A1F71'], label: 'VISA', textColor: '#FFFFFF', logo: '💳' },
  mastercard: { bg: ['#EB001B', '#F79E1B'], label: 'MASTERCARD', textColor: '#FFFFFF', logo: '💳' },
};

export default cards;
