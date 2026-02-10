
import React, { useState } from 'react';
import { Edit3, Check } from 'lucide-react';
import { WaterParameters, Language } from '../types';
import { translations } from '../i18n';
import { db } from "../firebase";
import { ref, set } from "firebase/database";


interface Props {
  initialData: WaterParameters;
  onSave: (data: WaterParameters) => void;
  language: Language;
}

const ManualEntryForm: React.FC<Props> = ({ initialData, onSave, language }) => {
  const t = translations[language];
  const [formData, setFormData] = useState(initialData);

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  // Save to Firebase
  set(ref(db, "sensorData"), {
    ph: formData.ph,
    temp: formData.temp,
    turbidity: formData.turbidity,
    tds: formData.tds,
    time: Date.now()
  });

  // Update dashboard UI
  onSave(formData);

  alert("Data saved to Firebase!");
};


  const fields = [
    { id: 'ph', label: 'pH', unit: 'pH', min: 0, max: 14, step: 0.1 },
    { id: 'temp', label: t.temp, unit: '°C', min: 0, max: 100, step: 0.5 },
    { id: 'turbidity', label: t.turbidity, unit: 'NTU', min: 0, max: 50, step: 0.1 },
    { id: 'tds', label: t.tds, unit: 'ppm', min: 0, max: 2000, step: 1 },
  ];

  return (
    <div className="bg-white p-8 rounded-[24px] shadow-sm border border-slate-50">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-sky-500 p-2 rounded-xl text-white shadow-sm">
          <Edit3 size={20} />
        </div>
        <h3 className="text-lg font-bold text-slate-800">{t.manualEntry}</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => (
            <div key={field.id}>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">{field.label} ({field.unit})</label>
              <input
                type="number"
                step={field.step}
                min={field.min}
                max={field.max}
                value={(formData as any)[field.id]}
                onChange={(e) => setFormData({ ...formData, [field.id]: parseFloat(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              />
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-sky-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-sky-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Check size={20} />
          {t.saveData}
        </button>
      </form>
    </div>
  );
};

export default ManualEntryForm;
