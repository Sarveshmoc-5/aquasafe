
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, AlertCircle, XCircle, Clock } from 'lucide-react';
import { WaterStatus, Language } from '../types';
import { translations } from '../i18n';

interface StatusCardProps {
  status: WaterStatus;
  language: Language;
  timestamp: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ status, language, timestamp }) => {
  const t = translations[language];

  const configs = {
    SAFE: { color: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', icon: CheckCircle2, label: t.safe },
    'LOW RISK': { color: 'bg-amber-400', text: 'text-amber-700', bg: 'bg-amber-50', icon: AlertTriangle, label: t.lowRisk },
    'HIGH RISK': { color: 'bg-orange-500', text: 'text-orange-700', bg: 'bg-orange-50', icon: AlertCircle, label: t.highRisk },
    CRITICAL: { color: 'bg-red-600', text: 'text-red-700', bg: 'bg-red-50', icon: XCircle, label: t.critical },
  };

  const current = configs[status];

  return (
    <div className={`p-8 rounded-[24px] ${current.bg} border border-white/50 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden h-full`}>
      <div className="absolute top-0 right-0 p-4 flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <Clock size={12} />
        {t.lastUpdated}: {timestamp}
      </div>

      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        className={`w-20 h-20 rounded-full ${current.color} flex items-center justify-center text-white shadow-lg mb-6`}
      >
        <current.icon size={40} />
      </motion.div>

      <h3 className={`text-4xl font-black ${current.text} tracking-tight mb-2`}>
        {current.label}
      </h3>
      
      <p className="text-slate-500 text-sm max-w-[200px] leading-relaxed">
        {status === 'SAFE' ? t.safeMsg : t.report}
      </p>
    </div>
  );
};

export default StatusCard;
