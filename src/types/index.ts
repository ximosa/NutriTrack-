export interface FoodItem {
  id: string;
  name: string;
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  servingSize: number;
  servingUnit: string;
  imageUrl?: string;
  barcode?: string;
  source: 'usda' | 'off' | 'custom';
}

export interface UserProfile {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number; // in kg
  height: number; // in cm
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'lose_weight' | 'maintain' | 'gain_muscle' | 'get_fit';
  dietType: 'balanced' | 'low_carb' | 'high_protein' | 'keto' | 'vegan';
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
}

export interface LogEntry {
  id: string;
  foodId: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  amount: number; // multiplier of servingSize
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  timestamp: number;
}

export interface DayLog {
  date: string; // YYYY-MM-DD
  entries: LogEntry[];
  waterIntake: number; // in glasses or ml
}

export interface WeeklyPlan {
  id: string;
  name: string;
  startDate: string;
  days: {
    [key: string]: { // Monday, Tuesday, etc.
      meals: {
        type: string;
        foodName: string;
        calories: number;
        macros: { protein: number; carbs: number; fat: number };
      }[];
    };
  };
}
