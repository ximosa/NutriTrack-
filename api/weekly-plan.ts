import { GoogleGenAI } from '@google/genai';

type UserProfile = {
  goal: string;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  dietType: string;
  activityLevel: string;
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'Missing GEMINI_API_KEY in server environment' });
    return;
  }

  try {
    const profile = req.body?.profile as UserProfile | undefined;
    if (!profile) {
      res.status(400).json({ error: 'Missing profile in request body' });
      return;
    }

    const prompt = `
Genera un plan de nutricion semanal profesional para un usuario con el siguiente perfil:
- Objetivo: ${profile.goal}
- Calorias objetivo: ${profile.targetCalories} kcal
- Proteina objetivo: ${profile.targetProtein} g
- Carbohidratos objetivo: ${profile.targetCarbs} g
- Grasa objetivo: ${profile.targetFat} g
- Tipo de dieta: ${profile.dietType}
- Nivel de actividad: ${profile.activityLevel}

El plan debe estar optimizado para su objetivo.
IMPORTANTE: Los nombres de comidas y alimentos deben estar en espanol.
Devuelve SOLO JSON valido con estructura WeeklyPlan:
{
  "id": "string",
  "name": "string",
  "startDate": "YYYY-MM-DD",
  "days": {
    "Monday": { "meals": [{ "type": "Breakfast|Lunch|Dinner|Snack", "foodName": "string", "calories": 0, "macros": { "protein": 0, "carbs": 0, "fat": 0 } }] },
    "Tuesday": { "meals": [] },
    "Wednesday": { "meals": [] },
    "Thursday": { "meals": [] },
    "Friday": { "meals": [] },
    "Saturday": { "meals": [] },
    "Sunday": { "meals": [] }
  }
}
`;

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });

    const text = response.text?.trim() || '{}';
    const plan = JSON.parse(text);
    res.status(200).json(plan);
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to generate weekly plan',
      details: error?.message || 'Unknown error',
    });
  }
}
