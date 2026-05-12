import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, WeeklyPlan } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function generateWeeklyPlan(profile: UserProfile): Promise<WeeklyPlan> {
  const prompt = `
    Genera un plan de nutrición semanal profesional para un usuario con el siguiente perfil:
    - Objetivo: ${profile.goal}
    - Calorías objetivo: ${profile.targetCalories} kcal
    - Proteína objetivo: ${profile.targetProtein}g
    - Carbohidratos objetivo: ${profile.targetCarbs}g
    - Grasa objetivo: ${profile.targetFat}g
    - Tipo de dieta: ${profile.dietType}
    - Nivel de actividad: ${profile.activityLevel}

    El plan debe estar optimizado para su objetivo.
    IMPORTANTE: Los nombres de las comidas y alimentos DEBEN estar en ESPAÑOL.
    Devuelve un objeto JSON que represente un WeeklyPlan.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            startDate: { type: Type.STRING },
            days: {
              type: Type.OBJECT,
              properties: {
                Monday: daySchema(),
                Tuesday: daySchema(),
                Wednesday: daySchema(),
                Thursday: daySchema(),
                Friday: daySchema(),
                Saturday: daySchema(),
                Sunday: daySchema(),
              }
            }
          },
          required: ["id", "name", "days"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error('Gemini Plan Error:', error);
    throw error;
  }
}

function daySchema() {
  return {
    type: Type.OBJECT,
    properties: {
      meals: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, description: "Breakfast, Lunch, Dinner, o Snack (usa estos términos exactos como keys si es necesario, pero el contenido en español)" },
            foodName: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            macros: {
              type: Type.OBJECT,
              properties: {
                protein: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                fat: { type: Type.NUMBER }
              }
            }
          }
        }
      }
    }
  };
}
