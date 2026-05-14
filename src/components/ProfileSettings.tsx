import { useState, type FormEvent } from 'react';
import { useNutrition } from '../store/NutritionContext';
import { UserProfile } from '../types';
import { motion } from 'motion/react';
import { Save, User, Activity, Target, Utensils } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ProfileSettings() {
  const { profile, updateProfile } = useNutrition();
  const [formData, setFormData] = useState<UserProfile>(profile || {
    name: '',
    age: 30,
    gender: 'male',
    weight: 75,
    height: 175,
    activityLevel: 'moderate',
    goal: 'maintain',
    dietType: 'balanced',
    targetCalories: 2500,
    targetProtein: 150,
    targetCarbs: 250,
    targetFat: 70
  });

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    
    // Simple BMR + TDEE calc if not manual
    // Harris-Benedict
    const bmr = formData.gender === 'male' 
      ? 88.362 + (13.397 * formData.weight) + (4.799 * formData.height) - (5.677 * formData.age)
      : 447.593 + (9.247 * formData.weight) + (3.098 * formData.height) - (4.330 * formData.age);
    
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    
    let tdee = bmr * multipliers[formData.activityLevel];
    
    // Adjust for goal
    if (formData.goal === 'lose_weight') tdee -= 500;
    if (formData.goal === 'gain_muscle') tdee += 300;
    
    const updated = {
      ...formData,
      targetCalories: Math.round(tdee),
      targetProtein: Math.round(formData.weight * (formData.goal === 'gain_muscle' ? 2 : 1.8)),
      targetFat: Math.round((tdee * 0.25) / 9),
      targetCarbs: Math.round((tdee - (Math.round(formData.weight * 2) * 4) - ((tdee * 0.25))) / 4)
    };
    
    await updateProfile(updated);
    toast.success('¡Perfil actualizado! Metas recalculadas.');
  };

  const activityLabels: Record<string, string> = {
    sedentary: 'Sedentario',
    light: 'Ligero',
    moderate: 'Moderado',
    active: 'Activo',
    very_active: 'Muy Activo'
  };

  const goalLabels: Record<string, string> = {
    lose_weight: 'Perder peso',
    maintain: 'Mantenimiento',
    gain_muscle: 'Volumen muscular',
    get_fit: 'Ponerse en forma'
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="space-y-2">
         <h2 className="text-3xl font-bold tracking-tighter">Tu Perfil</h2>
         <p className="text-[var(--text-dim)] text-sm">Configura tus métricas para personalizar tu experiencia en NutriTrack.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <section className="glass p-6 rounded-[2rem] space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <User size={18} className="text-[var(--accent-green)]" />
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-dim)]">Información Personal</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-dim)]">Edad</label>
              <input 
                type="number"
                value={formData.age}
                onChange={e => setFormData({...formData, age: Number(e.target.value)})}
                className="w-full h-12 bg-white/5 rounded-2xl px-4 font-bold border border-white/5 focus:border-[var(--accent-green)] transition-all outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-dim)]">Peso (kg)</label>
              <input 
                type="number"
                value={formData.weight}
                onChange={e => setFormData({...formData, weight: Number(e.target.value)})}
                className="w-full h-12 bg-white/5 rounded-2xl px-4 font-bold border border-white/5 focus:border-[var(--accent-green)] transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-dim)]">Género</label>
            <div className="flex gap-2">
               {[
                 { id: 'male', label: 'Hombre' },
                 { id: 'female', label: 'Mujer' },
                 { id: 'other', label: 'Otro' }
               ].map(g => (
                 <button 
                  key={g.id} type="button" 
                  onClick={() => setFormData({...formData, gender: g.id as any})}
                  className={`flex-1 h-12 rounded-2xl font-semibold capitalize transition-all ${formData.gender === g.id ? 'bg-[var(--accent-green)] text-black' : 'bg-white/5 text-[var(--text-dim)] border border-white/5'}`}
                 >
                   {g.label}
                 </button>
               ))}
            </div>
          </div>
        </section>

        <section className="glass p-6 rounded-[2rem] space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={18} className="text-[var(--accent-green)]" />
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-dim)]">Nivel de Actividad</h3>
          </div>
          <div className="grid grid-cols-1 gap-2">
             {Object.keys(activityLabels).map((level) => (
               <button 
                key={level} type="button"
                onClick={() => setFormData({...formData, activityLevel: level as any})}
                className={`w-full h-12 px-4 rounded-2xl font-semibold text-left transition-all ${formData.activityLevel === level ? 'bg-[var(--accent-green)]/10 text-[var(--accent-green)] border border-[var(--accent-green)]/20' : 'bg-white/5 text-[var(--text-dim)] border border-white/5'}`}
               >
                 {activityLabels[level].toUpperCase()}
               </button>
             ))}
          </div>
        </section>

        <section className="glass p-6 rounded-[2rem] space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Target size={18} className="text-[var(--accent-green)]" />
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-dim)]">Objetivo Principal</h3>
          </div>
          <div className="grid grid-cols-1 gap-2">
             {Object.keys(goalLabels).map((goal) => (
               <button 
                key={goal} type="button"
                onClick={() => setFormData({...formData, goal: goal as any})}
                className={`w-full h-12 px-4 rounded-2xl font-semibold text-left transition-all ${formData.goal === goal ? 'bg-[var(--accent-green)]/10 text-[var(--accent-green)] border border-[var(--accent-green)]/20' : 'bg-white/5 text-[var(--text-dim)] border border-white/5'}`}
               >
                 {goalLabels[goal].toUpperCase()}
               </button>
             ))}
          </div>
        </section>

        <motion.button 
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full h-16 bg-[var(--accent-green)] text-black font-bold uppercase tracking-widest rounded-[2rem] shadow-xl shadow-emerald-500/20"
        >
          Guardar y Recalcular
        </motion.button>
      </form>
    </div>
  );
}
