import { useState, useEffect } from 'react';
import { useNutrition } from '../store/NutritionContext';
import { generateWeeklyPlan } from '../api/gemini';
import { WeeklyPlan } from '../types';
import { Sparkles, Loader2, Calendar, ShoppingCart, Info, RotateCcw } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';
import * as db from '../api/db';

export default function MealPlanner() {
  const { profile } = useNutrition();
  const [plan, setPlan] = useState<WeeklyPlan | null>(null);
  const [generating, setGenerating] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  useEffect(() => {
    loadLatestPlan();
  }, []);

  const loadLatestPlan = async () => {
    const p = await db.getLatestPlan();
    setPlan(p);
  };

  const handleGenerate = async () => {
    if (!profile) return;
    setGenerating(true);
    try {
      const newPlan = await generateWeeklyPlan(profile);
      await db.saveWeeklyPlan(newPlan);
      setPlan(newPlan);
      toast.success('¡Plan IA generado con éxito!');
    } catch (error) {
       toast.error('Error al generar el plan. Inténtalo de nuevo.');
    } finally {
      setGenerating(false);
    }
  };

  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tighter">Planificador AI</h2>
          <p className="text-[var(--text-dim)] text-sm">Menús semanales inteligentes por Gemini.</p>
        </div>
        {!plan && !generating && (
           <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerate}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-green)] text-black rounded-full font-bold text-xs uppercase tracking-widest"
           >
             <Sparkles size={14} />
             Generar
           </motion.button>
        )}
      </div>

      {generating && (
        <div className="glass p-12 rounded-[2rem] flex flex-col items-center justify-center space-y-4 text-center">
           <Loader2 size={48} className="text-[var(--accent-green)] animate-spin" />
           <div className="space-y-1">
             <h3 className="font-bold uppercase tracking-widest">Diseñando tu dieta...</h3>
             <p className="text-xs text-[var(--text-dim)]">Nuestra IA está analizando tus metas e índices nutricionales.</p>
           </div>
        </div>
      )}

      {plan && !generating && (
        <div className="space-y-6">
          {/* Day Selector */}
          <div className="flex overflow-x-auto gap-2 pb-2 no-scrollbar">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, idx) => (
              <button 
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex-shrink-0 px-4 py-2 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${selectedDay === day ? 'bg-[var(--accent-green)] text-black' : 'glass text-gray-400'}`}
              >
                {days[idx]}
              </button>
            ))}
          </div>

          <div className="space-y-4">
             {plan.days[selectedDay]?.meals.map((meal, idx) => (
                <div key={idx} className="glass p-5 rounded-[2rem] space-y-3 relative overflow-hidden group">
                   <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent-green)] mb-1">
                          {meal.type === 'Breakfast' ? 'Desayuno' : 
                           meal.type === 'Lunch' ? 'Almuerzo' : 
                           meal.type === 'Dinner' ? 'Cena' : 'Snack'}
                        </p>
                        <h4 className="font-bold text-lg leading-tight">{meal.foodName}</h4>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold font-mono">{meal.calories}</p>
                        <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider">kcal</p>
                      </div>
                   </div>

                   <div className="flex gap-4 pt-2 border-t border-white/5">
                      <MacroMini label="P" value={meal.macros.protein} />
                      <MacroMini label="C" value={meal.macros.carbs} />
                      <MacroMini label="G" value={meal.macros.fat} />
                   </div>
                </div>
             ))}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4">
             <button onClick={handleGenerate} className="glass py-4 rounded-3xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-400">
                <RotateCcw size={14} />
                Regenerar
             </button>
             <button className="glass py-4 rounded-3xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--accent-blue)]">
                <ShoppingCart size={14} />
                Lista Compra
             </button>
          </div>
        </div>
      )}

      {!plan && !generating && (
        <div className="glass p-12 rounded-[3rem] border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-4">
           <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center text-gray-600">
             <Calendar size={32} />
           </div>
           <p className="text-xs uppercase tracking-[0.2em] font-bold text-gray-500">Sin plan activo</p>
           <button 
             onClick={handleGenerate}
             className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-all"
           >
             Comenzar Dieta Inteligente
           </button>
        </div>
      )}
    </div>
  );
}

function MacroMini({ label, value }: { label: string, value: number }) {
  return (
    <div className="flex items-baseline gap-1">
      <span className="text-[9px] font-bold text-[var(--text-dim)]">{label}</span>
      <span className="text-xs font-bold font-mono">{Math.round(value)}g</span>
    </div>
  );
}
