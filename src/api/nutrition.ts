import { FoodItem } from '../types';

const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';
const OFF_BASE_URL = 'https://world.openfoodfacts.org/cgi';
const OFF_SEARCH_URL = 'https://world.openfoodfacts.org/api/v2';

const USDA_KEY = process.env.VITE_USDA_API_KEY || 'DEMO_KEY';

export async function searchFood(query: string): Promise<FoodItem[]> {
  try {
    const [usdaResults, offResults] = await Promise.all([
      searchUSDA(query),
      searchOFF(query)
    ]);
    return [...usdaResults, ...offResults];
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

async function searchUSDA(query: string): Promise<FoodItem[]> {
  try {
    const res = await fetch(`${USDA_BASE_URL}/foods/search?api_key=${USDA_KEY}&query=${encodeURIComponent(query)}&pageSize=10`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.foods.map((f: any) => ({
      id: `usda-${f.fdcId}`,
      name: f.description,
      brand: f.brandOwner,
      calories: getNutrient(f.foodNutrients, 1008),
      protein: getNutrient(f.foodNutrients, 1003),
      carbs: getNutrient(f.foodNutrients, 1005),
      fat: getNutrient(f.foodNutrients, 1004),
      servingSize: f.servingSize || 100,
      servingUnit: f.servingSizeUnit || 'g',
      source: 'usda'
    }));
  } catch {
    return [];
  }
}

async function searchOFF(query: string): Promise<FoodItem[]> {
  try {
    const res = await fetch(`${OFF_SEARCH_URL}/search?categories_tags_en=${encodeURIComponent(query)}&fields=code,product_name,brands,nutriments,image_url&page_size=10`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.products.map((p: any) => ({
      id: `off-${p.code}`,
      name: p.product_name || 'Unknown Item',
      brand: p.brands,
      calories: p.nutriments?.['energy-kcal_100g'] || 0,
      protein: p.nutriments?.proteins_100g || 0,
      carbs: p.nutriments?.carbohydrates_100g || 0,
      fat: p.nutriments?.fat_100g || 0,
      servingSize: 100,
      servingUnit: 'g',
      imageUrl: p.image_url,
      barcode: p.code,
      source: 'off'
    }));
  } catch {
    return [];
  }
}

function getNutrient(nutrients: any[], id: number): number {
  const n = nutrients.find(item => item.nutrientId === id || item.nutrientNumber === id.toString());
  return n ? n.value : 0;
}

export async function getOFFProduct(barcode: string): Promise<FoodItem | null> {
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
    const data = await res.json();
    if (data.status !== 1) return null;
    const p = data.product;
    return {
      id: `off-${p.code}`,
      name: p.product_name,
      brand: p.brands,
      calories: p.nutriments['energy-kcal_100g'] || 0,
      protein: p.nutriments.proteins_100g || 0,
      carbs: p.nutriments.carbohydrates_100g || 0,
      fat: p.nutriments.fat_100g || 0,
      servingSize: 100,
      servingUnit: 'g',
      imageUrl: p.image_url,
      barcode: p.code,
      source: 'off'
    };
  } catch {
    return null;
  }
}
