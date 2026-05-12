/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Search, Calendar, User, Plus, Utensils, Droplets, Target } from 'lucide-react';
import { NutritionProvider, useNutrition } from './store/NutritionContext';
import { Toaster } from 'react-hot-toast';
import Dashboard from './components/Dashboard';
import FoodSearch from './components/FoodSearch';
import MealPlanner from './components/MealPlanner';
import ProfileSettings from './components/ProfileSettings';

function MainApp() {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'planner' | 'profile'>('home');
  const { profile, loading } = useNutrition();

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[var(--bg-deep)]">
        <div className="w-12 h-12 border-4 border-[var(--accent-green)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If no profile, force profile setup
  const currentTab = !profile ? 'profile' : activeTab;

  return (
    <div className="min-h-screen bg-[var(--bg-deep)] pb-24 text-white">
      <header className="px-6 pt-8 pb-4 flex justify-between items-center sticky top-0 bg-[var(--bg-deep)]/80 backdrop-blur-md z-40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">NutriTrack<span className="text-[var(--accent-green)]">+</span></h1>
          <p className="text-[var(--text-dim)] text-xs uppercase tracking-widest font-mono">Salud Premium</p>
        </div>
        <button onClick={() => setActiveTab('profile')} className="w-10 h-10 rounded-full glass flex items-center justify-center overflow-hidden">
          {profile ? <User size={20} /> : <Target size={20} className="text-[var(--accent-green)]" />}
        </button>
      </header>

      <main className="px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {currentTab === 'home' && <Dashboard />}
            {currentTab === 'search' && <FoodSearch />}
            {currentTab === 'planner' && <MealPlanner />}
            {currentTab === 'profile' && <ProfileSettings />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Bottom Navigation */}
      <nav className="fixed bottom-6 left-6 right-6 z-50">
        <div className="glass-dark rounded-3xl p-2 flex justify-between items-center shadow-2xl">
          <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home size={22} />} label="Inicio" />
          <NavButton active={activeTab === 'search'} onClick={() => setActiveTab('search')} icon={<Search size={22} />} label="Buscar" />
          <div className="relative -top-6">
             <button 
              onClick={() => setActiveTab('search')}
              className="w-14 h-14 bg-gradient-to-br from-[var(--accent-green)] to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 active:scale-95 transition-transform"
             >
                <Plus size={28} className="text-white" />
             </button>
          </div>
          <NavButton active={activeTab === 'planner'} onClick={() => setActiveTab('planner')} icon={<Calendar size={22} />} label="Planes" />
          <NavButton active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<User size={22} />} label="Perfil" />
        </div>
      </nav>
      
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center px-4 py-2 rounded-2xl transition-all duration-300 ${
        active ? 'text-white' : 'text-gray-500 hover:text-gray-300'
      }`}
    >
      <div className={`mb-1 transition-transform ${active ? 'scale-110' : ''}`}>{icon}</div>
      <span className={`text-[10px] font-medium tracking-wide uppercase ${active ? 'opacity-100' : 'opacity-0'}`}>
        {label}
      </span>
    </button>
  );
}

export default function App() {
  return (
    <NutritionProvider>
      <MainApp />
    </NutritionProvider>
  );
}

