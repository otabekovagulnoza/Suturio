export interface Category {
  id: string;
  name: string;
  icon: string;
  ionicon: string;
  color: string;
  bgColor: string;
  count: number;
}

export const categories: Category[] = [
  { id: 'all', name: 'Barchasi', icon: '🌟', ionicon: 'apps', color: '#0A5C7A', bgColor: '#E8F4F8', count: 48 },
  { id: 'surgery', name: 'Jarrohlik', icon: '🔬', ionicon: 'cut-outline', color: '#00D4FF', bgColor: '#E0F9FF', count: 12 },
  { id: 'wound', name: 'Chok\nparvarishi', icon: '🩹', ionicon: 'bandage-outline', color: '#00C48C', bgColor: '#E0FBF3', count: 8 },
  { id: 'therapy', name: 'Terapevt', icon: '🏥', ionicon: 'medical-outline', color: '#9B59B6', bgColor: '#F5EEF8', count: 10 },
  { id: 'ortho', name: 'Ortoped', icon: '🦴', ionicon: 'body-outline', color: '#F39C12', bgColor: '#FEF9E7', count: 6 },
  { id: 'rehab', name: 'Reabilitolog', icon: '🏃', ionicon: 'fitness-outline', color: '#27AE60', bgColor: '#EAFAF1', count: 5 },
  { id: 'derma', name: 'Dermatolog', icon: '🧬', ionicon: 'scan-outline', color: '#E74C3C', bgColor: '#FDEDEC', count: 4 },
  { id: 'anesthesia', name: 'Anesteziolog', icon: '💉', ionicon: 'pulse-outline', color: '#2980B9', bgColor: '#EBF5FB', count: 3 },
];

export default categories;
