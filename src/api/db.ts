import { openDB, IDBPDatabase } from 'idb';
import { UserProfile, DayLog, WeeklyPlan, FoodItem } from '../types';

const DB_NAME = 'NutriTrackDB';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase>;

export function initDB() {
  dbPromise = openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains('profile')) {
        db.createObjectStore('profile');
      }
      if (!db.objectStoreNames.contains('logs')) {
        db.createObjectStore('logs', { keyPath: 'date' });
      }
      if (!db.objectStoreNames.contains('weeklyPlans')) {
        db.createObjectStore('weeklyPlans', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('favorites')) {
        db.createObjectStore('favorites', { keyPath: 'id' });
      }
    },
  });
}

export async function saveProfile(profile: UserProfile) {
  const db = await dbPromise;
  await db.put('profile', profile, 'current');
}

export async function getProfile(): Promise<UserProfile | null> {
  const db = await dbPromise;
  return db.get('profile', 'current');
}

export async function saveLog(log: DayLog) {
  const db = await dbPromise;
  await db.put('logs', log);
}

export async function getLog(date: string): Promise<DayLog | null> {
  const db = await dbPromise;
  return db.get('logs', date);
}

export async function saveFavorite(item: FoodItem) {
  const db = await dbPromise;
  await db.put('favorites', item);
}

export async function getFavorites(): Promise<FoodItem[]> {
  const db = await dbPromise;
  return db.getAll('favorites');
}

export async function saveWeeklyPlan(plan: WeeklyPlan) {
  const db = await dbPromise;
  await db.put('weeklyPlans', plan);
}

export async function getLatestPlan(): Promise<WeeklyPlan | null> {
  const db = await dbPromise;
  const plans = await db.getAll('weeklyPlans');
  return plans.length > 0 ? plans[plans.length - 1] : null;
}
