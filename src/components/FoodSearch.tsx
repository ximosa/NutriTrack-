import { useState, useEffect } from 'react';
import { useNutrition } from '../store/NutritionContext';
import { searchFood } from '../api/nutrition';
import { FoodItem } from '../types';
import { Search, ChevronLeft, Plus, Zap, Scale, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';

export default function FoodSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const { addLogEntry } = useNutrition();

  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.trim().length > 2) {
        handleSearch();
      }
    }, 500);
    return () => clearTimeout(delay);
  }, [query]);

  const handleSearch = async () => {
    setSearching(true);
    const data = await searchFood(query);
    setResults(data);
    setSearching(false);
  };

  const handleAdd = async (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    if (!selectedFood) return;
    await addLogEntry({
      foodId: selectedFood.id,
      foodName: selectedFood.name,
      calories: selectedFood.calories,
      protein: selectedFood.protein,
      carbs: selectedFood.carbs,
      fat: selectedFood.fat,
      amount: 1,
      mealType
    });

    const mealName = mealType === 'breakfast' ? 'Desayuno' : 
                   mealType === 'lunch' ? 'Almuerzo' : 
                   mealType === 'dinner' ? 'Cena' : 'Snack';

    toast.success(`Añadido ${selectedFood.name} a ${mealName}`);
    setSelectedFood(null);
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar alimentos, marcas..."
          className="w-full h-14 pl-12 pr-4 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-[var(--accent-green)] transition-all font-medium placeholder:text-gray-600"
        />
        <Search className="absolute left-4 top-4 text-gray-500" size={20} />
      </div>

      <div className="space-y-3">
        {searching && (
          <div className="flex justify-center p-8">
            <div className="w-8 h-8 border-2 border-[var(--accent-green)] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {results.map((food) => (
          <motion.div 
            key={food.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setSelectedFood(food)}
            className="glass p-3 rounded-2xl flex items-center cursor-pointer active:scale-98 transition-all hover:bg-white/[0.08]"
          >
            {food.imageUrl ? (
              <img
                src={food.imageUrl}
                alt={food.name}
                className="w-14 h-14 rounded-xl object-cover bg-white/5"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-[var(--accent-green)]">
                <Utensils size={20} />
              </div>
            )}
            <div className="ml-3 flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{food.name}</p>
              <p className="text-[10px] text-[var(--text-dim)] uppercase tracking-wider">{food.brand || food.source}</p>
            </div>
            <div className="text-right ml-2">
              <p className="text-sm font-bold font-mono">{Math.round(food.calories)}</p>
              <p className="text-[10px] text-[var(--text-dim)] uppercase">kcal</p>
            </div>
          </motion.div>
        ))}

        {!searching && results.length === 0 && query.length > 2 && (
          <div className="text-center p-8 opacity-50">
            <p className="text-sm">No se encontraron resultados. Prueba otra búsqueda.</p>
          </div>
        )}
      </div>

      {/* Food Detail Modal */}
      <AnimatePresence>
        {selectedFood && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
             <button onClick={() => setSelectedFood(null)} className="absolute top-6 left-6 w-10 h-10 rounded-full glass flex items-center justify-center">
               <ChevronLeft size={20} />
             </button>

             <div className="glass w-full max-w-md max-h-[90vh] rounded-3xl p-5 overflow-y-auto">
                <div className="h-56 w-full rounded-2xl bg-white/5 mb-6 flex items-center justify-center overflow-hidden">
                   {selectedFood.imageUrl ? (
                     <img
                       src={selectedFood.imageUrl}
                       alt={selectedFood.name}
                       className="w-full h-full object-cover"
                       loading="lazy"
                       referrerPolicy="no-referrer"
                     />
                   ) : (
                     <Zap size={64} className="text-[var(--accent-green)] opacity-50" />
                   )}
                </div>

                <div className="space-y-2">
                   <h2 className="text-2xl font-bold tracking-tight">{selectedFood.name}</h2>
                   <p className="text-[var(--text-dim)] text-sm uppercase tracking-widest">{selectedFood.brand || 'Genérico'}</p>
                </div>

                <div className="grid grid-cols-4 gap-2 mt-8">
                   <StatBox label="Cals" value={selectedFood.calories} color="[var(--accent-green)]" />
                   <StatBox label="Prot" value={selectedFood.protein} color="[var(--accent-green)]" />
                   <StatBox label="Carb" value={selectedFood.carbs} color="[var(--accent-blue)]" />
                   <StatBox label="Grasa" value={selectedFood.fat} color="amber-500" />
                </div>

                <div className="mt-8 space-y-4">
                   <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--text-dim)]">Registrar en...</h3>
                   <div className="grid grid-cols-2 gap-3">
                      <MealLogBtn type="Desayuno" onClick={() => handleAdd('breakfast')} />
                      <MealLogBtn type="Almuerzo" onClick={() => handleAdd('lunch')} />
                      <MealLogBtn type="Cena" onClick={() => handleAdd('dinner')} />
                      <MealLogBtn type="Snack" onClick={() => handleAdd('snack')} />
                   </div>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatBox({ label, value, color }: { label: string, value: number, color: string }) {
  return (
    <div className="glass p-3 rounded-2xl text-center">
      <p className="text-[9px] font-bold text-[var(--text-dim)] uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-sm font-bold font-mono text-${color}`}>{Math.round(value)}</p>
    </div>
  );
}

function MealLogBtn({ type, onClick }: { type: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="glass px-4 py-3 rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-white/10 active:scale-95 transition-all"
    >
      {type}
    </button>
  );
}

function Utensils(props: any) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" fill="none" 
      stroke="currentColor" strokeWidth="2" 
      strokeLinecap="round" strokeLinejoin="round" 
      {...props}
    >
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  );
}
