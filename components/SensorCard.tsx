
import React from 'react';
import { LucideIcon, Wifi, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface SensorCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit: string;
  color: string;
}

const SensorCard: React.FC<SensorCardProps> = ({ icon: Icon, label, value, unit, color }) => {
  return (
    <motion.div 
      whileHover={{ y: -8, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white/70 backdrop-blur-2xl p-6 rounded-[40px] shadow-xl shadow-slate-200/50 border border-white flex flex-col gap-4 relative overflow-hidden group cursor-pointer"
    >
      {/* Dynamic Wave Animation */}
      <div className="absolute inset-0 pointer-events-none opacity-20 group-hover:opacity-30 transition-opacity">
        <motion.div
          animate={{ 
            y: ["55%", "50%", "55%"],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className={`absolute -left-1/2 -right-1/2 bottom-0 h-[200%] ${color} rounded-[45%]`}
        />
        <motion.div
          animate={{ 
            y: ["60%", "58%", "60%"],
            rotate: [0, -10, 10, 0]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className={`absolute -left-1/2 -right-1/2 bottom-0 h-[200%] ${color} rounded-[40%] opacity-50`}
        />
      </div>

      <div className="flex items-center justify-between relative z-10">
        <div className="relative">
          {/* Animated Ring */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className={`absolute -inset-2 border-2 border-dashed ${color} opacity-20 rounded-full`}
          />
          <div className={`p-4 rounded-[24px] ${color} text-white shadow-lg shadow-inherit/20 relative`}>
            <Icon size={24} className="group-hover:scale-110 group-hover:rotate-12 transition-transform" />
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1.5 bg-white/50 backdrop-blur-md px-3 py-1 rounded-full border border-white">
            <Activity size={10} className="text-sky-500 animate-pulse" />
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Monitoring</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-2">
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-1">{label}</p>
        <div className="flex items-baseline gap-2">
          <motion.span 
            key={value}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl font-black text-slate-800 tracking-tighter"
          >
            {value}
          </motion.span>
          <span className="text-sm font-black text-slate-300 uppercase tracking-widest">{unit}</span>
        </div>
      </div>

      {/* Decorative Glow */}
      <div className={`absolute -bottom-10 -right-10 w-32 h-32 ${color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity`}></div>
    </motion.div>
  );
};

export default SensorCard;
