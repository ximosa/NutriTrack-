import { UserProfile, WeeklyPlan } from '../types';

export async function generateWeeklyPlan(profile: UserProfile): Promise<WeeklyPlan> {
  const proxyUrl = (import.meta.env.VITE_AI_PROXY_URL as string | undefined) || '/api/weekly-plan';

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
