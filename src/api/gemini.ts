import { UserProfile, WeeklyPlan } from '../types';

export async function generateWeeklyPlan(profile: UserProfile): Promise<WeeklyPlan> {
  const proxyUrl = import.meta.env.VITE_AI_PROXY_URL as string | undefined;
  if (!proxyUrl) {
    throw new Error('Falta VITE_AI_PROXY_URL. Configura un backend para generar planes IA de forma segura.');
  }

  try {
    const response = await fetch(proxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile }),
    });

    if (!response.ok) {
      throw new Error(`Error del backend IA: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Gemini Plan Error:', error);
    throw error;
  }
}
