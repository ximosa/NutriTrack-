import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, DayLog, LogEntry } from '../types';
import * as db from '../api/db';

interface NutritionContextType {
  profile: UserProfile | null;
  currentLog: DayLog | null;
  selectedDate: string;
  updateProfile: (p: UserProfile) => Promise<void>;
  addLogEntry: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => Promise<void>;
  setSelectedDate: (date: string) => void;
  updateWaterIntake: (amount: number) => Promise<void>;
  loading: boolean;
}

const NutritionContext = createContext<NutritionContextType | undefined>(undefined);

export function NutritionProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentLog, setCurrentLog] = useState<DayLog | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.initDB();
    loadInitialData();
  }, []);

  useEffect(() => {
    loadLog(selectedDate);
  }, [selectedDate]);

  const loadInitialData = async () => {
    const p = await db.getProfile();
    setProfile(p);
    setLoading(false);
  };

  const loadLog = async (date: string) => {
    const log = await db.getLog(date);
    setCurrentLog(log || { date, entries: [], waterIntake: 0 });
  };

  const updateProfile = async (p: UserProfile) => {
    await db.saveProfile(p);
    setProfile(p);
  };

  const addLogEntry = async (entry: Omit<LogEntry, 'id' | 'timestamp'>) => {
    if (!currentLog) return;
    const newEntry: LogEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now()
    };
    const updatedLog = {
      ...currentLog,
      entries: [...currentLog.entries, newEntry]
    };
    await db.saveLog(updatedLog);
    setCurrentLog(updatedLog);
  };

  const updateWaterIntake = async (amount: number) => {
    if (!currentLog) return;
    const updatedLog = {
      ...currentLog,
      waterIntake: Math.max(0, (currentLog.waterIntake || 0) + amount)
    };
    await db.saveLog(updatedLog);
    setCurrentLog(updatedLog);
  };

  return (
    <NutritionContext.Provider value={{
      profile,
      currentLog,
      selectedDate,
      updateProfile,
      addLogEntry,
      setSelectedDate,
      updateWaterIntake,
      loading
    }}>
      {children}
    </NutritionContext.Provider>
  );
}

export function useNutrition() {
  const context = useContext(NutritionContext);
  if (context === undefined) {
    throw new Error('useNutrition must be used within a NutritionProvider');
  }
  return context;
}
