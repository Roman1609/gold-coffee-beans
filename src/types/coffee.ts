export type RoastLevel = 'light' | 'medium' | 'dark' | 'all';
export type GrindType = 'whole_bean' | 'espresso' | 'filter_v60' | 'french_press' | 'cezve';
export type WeightOption = '250g' | '500g' | '1000g';

export interface CoffeeProduct {
  id: string;
  name: string;
  tagline: string;
  origin: string;
  region: string;
  farm: string;
  altitude: string;
  process: string;
  variety: string;
  roastLevel: 'light' | 'medium' | 'dark';
  roastName: string;
  scaScore: number;
  flavorNotes: string[];
  flavorCategory: 'floral' | 'chocolate' | 'berry' | 'spicy';
  intensity: number; // 1-5
  acidity: number; // 1-5
  sweetness: number; // 1-5
  body: number; // 1-5
  description: string;
  recommendedBrew: string[];
  priceBase: number; // for 250g in UAH
  weights: {
    '250g': number;
    '500g': number;
    '1000g': number;
  };
  inStock: boolean;
  isBestseller?: boolean;
  isRare?: boolean;
}

export interface CartItem {
  id: string;
  product: CoffeeProduct;
  weight: WeightOption;
  grind: GrindType;
  quantity: number;
  pricePerUnit: number;
}

export interface BrewGuide {
  id: string;
  name: string;
  subtitle: string;
  iconName: string;
  defaultCoffeeGrams: number;
  defaultWaterMl: number;
  ratio: string;
  ratioMultiplier: number;
  waterTempC: number;
  grindSize: string;
  totalTimeSec: number;
  steps: {
    time: string;
    title: string;
    instruction: string;
  }[];
}
