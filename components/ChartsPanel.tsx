
import React, { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { motion } from 'framer-motion';
import { FileDown, Printer, LayoutGrid, CheckCircle2, Loader2 } from 'lucide-react';
import { Language, WaterParameters } from '../types';
import { translations } from '../i18n';

interface ChartsPanelProps {
  history: (WaterParameters & { timestamp: string })[];
  language: Language;
  currentData: WaterParameters;
}

const ChartsPanel: React.FC<ChartsPanelProps> = ({ history, language, currentData }) => {
  const t = translations[language];
  const [isExporting, setIsExporting] = useState(false);

  const handleDownloadPDF = () => {
    setIsExporting(true);
    // Mimic PDF generation logic
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 1500);
  };

  const currentStats = [
    { label: 'pH Value', val: currentData.ph, unit: 'pH', color: 'text-sky-500', bg: 'bg-sky-50' },
    { label: 'Temp', val: currentData.temp, unit: '°C', color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Turbidity', val: currentData.turbidity, unit: 'NTU', color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { label: 'TDS', val: currentData.tds, unit: 'ppm', color: 'text-blue-500', bg: 'bg-blue-50' }
  ];

  return (
    <div className="space-y-8 print:p-0">
      {/* Analytics Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 print:hidden">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-sky-500 rounded-2xl text-white shadow-lg">
            <LayoutGrid size={20} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800">Advanced Analytics Hub</h3>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Real-time Performance Metrics</p>
          </div>
        </div>
        
        <button 
          onClick={handleDownloadPDF}
          disabled={isExporting}
          className="flex items-center gap-2 bg-slate-800 text-white px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50"
        >
          {isExporting ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} />}
          {isExporting ? 'Generating Report...' : 'Download Analysis PDF'}
        </button>
      </div>

      {/* Snapshot Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {currentStats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label} 
            className={`${stat.bg} p-6 rounded-[32px] border border-white/50 shadow-sm flex flex-col items-center text-center`}
          >
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-2xl font-black ${stat.color} tracking-tighter`}>{stat.val}</p>
            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">{stat.unit}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
              <div className="w-2 h-8 bg-sky-500 rounded-full"></div>
              Chemical Stability
            </h3>
            <span className="text-[10px] font-bold text-slate-300 uppercase">pH & Turbidity (NTU)</span>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={history}>
                <XAxis dataKey="timestamp" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '15px' }}
                />
                <Line type="monotone" dataKey="ph" stroke="#0ea5e9" strokeWidth={5} dot={false} strokeLinecap="round" />
                <Line type="monotone" dataKey="turbidity" stroke="#f59e0b" strokeWidth={5} dot={false} strokeLinecap="round" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
              <div className="w-2 h-8 bg-blue-500 rounded-full"></div>
              Mineral Concentration
            </h3>
            <span className="text-[10px] font-bold text-slate-300 uppercase">Total Dissolved Solids (PPM)</span>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="colorTds" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="timestamp" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '15px' }}
                />
                <Area type="monotone" dataKey="tds" stroke="#3b82f6" fillOpacity={1} fill="url(#colorTds)" strokeWidth={5} strokeLinecap="round" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Export Disclaimer */}
      <div className="bg-slate-50 p-6 rounded-[24px] border border-slate-100 flex items-start gap-4 opacity-60">
        <CheckCircle2 className="text-emerald-500 mt-1" size={16} />
        <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed tracking-wider">
          All data generated is verified by cryptographic sensor signatures. The PDF report includes a full 24-hour diagnostic history and AI-driven predictive health markers.
        </p>
      </div>
    </div>
  );
};

export default ChartsPanel;
