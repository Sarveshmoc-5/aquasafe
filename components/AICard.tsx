
import React, { useState, useEffect } from 'react';
import { BrainCircuit, Info, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { RiskAnalysis, Language, WaterParameters } from '../types';
import { translations } from '../i18n';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'framer-motion';

interface AICardProps {
  analysis: RiskAnalysis;
  language: Language;
  currentData: WaterParameters;
}

const AICard: React.FC<AICardProps> = ({ analysis, language, currentData }) => {
  const t = translations[language];
  const [aiAdvice, setAiAdvice] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchAiAdvice = async () => {
      setLoading(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Based on these water parameters: pH ${currentData.ph}, Temp ${currentData.temp}°C, Turbidity ${currentData.turbidity} NTU, TDS ${currentData.tds} ppm. 
        Current Status is ${analysis.status}. 
        Provide ONE specific line of advice on how the user should TREAT or USE this water safely (e.g., recommend filtration, boiling, or RO if needed).
        Keep it under 15 words. Be practical and authoritative.
        Format as plain text only.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: [{ parts: [{ text: prompt }] }],
        });

        setAiAdvice(response.text || "Boil or filter water before consumption to ensure safety.");
      } catch (error) {
        console.error("Gemini API Error:", error);
        setAiAdvice("Water status: " + analysis.status + ". Follow standard local safety protocols.");
      } finally {
        setLoading(false);
      }
    };

    fetchAiAdvice();
  }, [currentData, analysis.status]);

  return (
    <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-50 h-full flex flex-col relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-sky-100/30 blur-3xl -mr-16 -mt-16 group-hover:bg-sky-200/40 transition-colors duration-500"></div>

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="bg-sky-500 p-2.5 rounded-2xl text-white shadow-lg shadow-sky-100 flex items-center justify-center">
          <BrainCircuit size={22} className="animate-pulse" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
            Usage & Treatment Advice
            <Sparkles size={14} className="text-sky-400" />
          </h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Safety Intelligence</p>
        </div>
        <div className="ml-auto bg-sky-50 px-4 py-1.5 rounded-full border border-sky-100 flex items-center gap-2">
          <span className="text-[10px] font-bold text-sky-400 uppercase tracking-widest">{t.confidence}</span>
          <span className="text-xs font-black text-sky-600">{analysis.confidence}%</span>
        </div>
      </div>

      <div className="flex-1 space-y-6 relative z-10">
        <div className="min-h-[4rem] flex flex-col justify-center">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 flex items-center gap-2">
            <ShieldCheck size={12} className="text-emerald-500" />
            Practical Treatment Plan
          </label>
          <div className="bg-slate-50/50 p-5 rounded-3xl border border-slate-100/50 flex items-center shadow-inner">
            {loading ? (
              <div className="flex items-center gap-2 text-slate-400 italic text-sm">
                <Loader2 size={16} className="animate-spin text-sky-400" />
                Analyzing treatment vectors...
              </div>
            ) : (
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-slate-700 font-bold text-sm leading-relaxed"
              >
                {aiAdvice}
              </motion.p>
            )}
          </div>
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3">Diagnostic Markers</label>
          <div className="flex flex-wrap gap-2">
            {analysis.potentialIssues.map((issue, idx) => (
              <motion.span 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white text-slate-600 px-4 py-2 rounded-xl text-xs font-bold border border-slate-100 shadow-sm flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400"></div>
                {issue}
              </motion.span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICard;
