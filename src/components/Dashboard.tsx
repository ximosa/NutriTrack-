import { useNutrition } from '../store/NutritionContext';
import { motion } from 'motion/react';
import { Utensils, Droplets, Flame, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { currentLog, profile, updateWaterIntake } = useNutrition();

  if (!profile) return null;

  const totals = currentLog?.entries.reduce((acc, entry) => ({
    calories: acc.calories + entry.calories * entry.amount,
    protein: acc.protein + entry.protein * entry.amount,
    carbs: acc.carbs + entry.carbs * entry.amount,
    fat: acc.fat + entry.fat * entry.amount,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 }) || { calories: 0, protein: 0, carbs: 0, fat: 0 };

  const calorieProgress = Math.min((totals.calories / profile.targetCalories) * 100, 100);

  const macroData = [
    { name: 'Proteína', value: totals.protein, color: '#10b981', target: profile.targetProtein },
    { name: 'Carbos', value: totals.carbs, color: '#3b82f6', target: profile.targetCarbs },
    { name: 'Grasa', value: totals.fat, color: '#f59e0b', target: profile.targetFat },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Stats */}
      <section className="relative h-64 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <div className="w-48 h-48 bg-[var(--accent-green)] rounded-full blur-[100px]" />
          <div className="w-32 h-32 bg-[var(--accent-blue)] rounded-full blur-[80px] -ml-20 mt-20" />
        </div>

        <div className="relative text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center"
          >
             <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle
                    cx="96" cy="96" r="88"
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth="12"
                    fill="transparent"
                  />
                  <circle
                    cx="96" cy="96" r="88"
                    stroke="url(#gradient)"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 88}
                    strokeDashoffset={2 * Math.PI * 88 * (1 - calorieProgress / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="var(--accent-green)" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="text-center z-10">
                  <span className="text-4xl font-bold font-mono tracking-tighter">
                    {Math.round(totals.calories)}
                  </span>
                  <p className="text-[var(--text-dim)] text-[10px] uppercase tracking-wider font-semibold">Calorías consumidas</p>
                  <p className="text-[var(--text-dim)] text-[10px] mt-1 font-mono">{Math.max(0, Math.round(profile.targetCalories - totals.calories))} restantes / {profile.targetCalories}</p>
                </div>
             </div>
          </motion.div>
        </div>
      </section>

      {/* Macros Grid */}
      <section className="grid grid-cols-3 gap-3">
        {macroData.map((macro) => (
          <div key={macro.name} className="glass p-4 rounded-3xl flex flex-col items-center justify-center space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-dim)]">{macro.name}</p>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
               <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((macro.value / (macro.target || 1)) * 100, 100)}%` }}
                className="h-full rounded-full"
                style={{ backgroundColor: macro.color }}
               />
            </div>
            <p className="text-sm font-bold font-mono">{Math.round(macro.value)}<span className="text-[10px] text-[var(--text-dim)] font-normal ml-0.5">/ {macro.target}g</span></p>
          </div>
        ))}
      </section>

      {/* Daily Activity */}
      <section className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-dim)] flex items-center gap-2">
          <TrendingUp size={14} className="text-[var(--accent-green)]" />
          Actividad de hoy
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
           <div className="glass p-4 rounded-3xl flex items-center justify-between col-span-2">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Droplets size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-wider">Hidratación</p>
                  <p className="text-lg font-bold font-mono">{currentLog?.waterIntake || 0}<span className="text-xs font-normal ml-1">vasos</span></p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => updateWaterIntake(-1)} className="w-8 h-8 rounded-xl glass flex items-center justify-center text-gray-400">-</button>
                <button onClick={() => updateWaterIntake(1)} className="w-8 h-8 rounded-xl glass flex items-center justify-center text-[var(--accent-blue)]">+</button>
              </div>
           </div>

           <div className="glass p-4 rounded-3xl flex items-center justify-between col-span-2">
              <div>
                <p className="text-[10px] font-bold text-[var(--text-dim)] uppercase tracking-wider">Comidas registradas</p>
                <p className="text-lg font-bold font-mono">{currentLog?.entries.length || 0}</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <Utensils size={20} />
              </div>
           </div>
        </div>
      </section>

      {/* Log Feed */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-dim)]">Registros recientes</h3>
          <button className="text-[10px] font-bold text-[var(--accent-green)] uppercase tracking-widest">Ver todo</button>
        </div>

        <div className="space-y-2">
          {currentLog?.entries.slice(-3).reverse().map((entry) => (
            <div key={entry.id} className="glass p-1 rounded-3xl flex items-center pr-4">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-[var(--accent-green)]">
                <Flame size={20} />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-semibold truncate max-w-[150px]">{entry.foodName}</p>
                <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider">
                  {entry.mealType === 'breakfast' ? 'Desayuno' : 
                   entry.mealType === 'lunch' ? 'Almuerzo' : 
                   entry.mealType === 'dinner' ? 'Cena' : 'Snack'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold font-mono">+{Math.round(entry.calories * entry.amount)}</p>
                <p className="text-[10px] text-[var(--text-dim)] font-mono">kcal</p>
              </div>
            </div>
          ))}
          {(!currentLog?.entries || currentLog.entries.length === 0) && (
            <div className="p-8 text-center glass rounded-3xl opacity-50 border-dashed">
              <p className="text-xs uppercase tracking-widest font-semibold">Sin registros aún</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
