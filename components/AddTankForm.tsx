
import React, { useState } from 'react';
import { PlusCircle, MapPin, Check, Navigation, Loader2, Satellite, Home, Building2 } from 'lucide-react';
import { Language, TankType } from '../types';
import { translations } from '../i18n';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  language: Language;
  onAdd: (tank: any) => void;
}

const AddTankForm: React.FC<Props> = ({ language, onAdd }) => {
  const t = translations[language];
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('sal');
  const [address, setAddress] = useState('');
  const [type, setType] = useState<TankType>('private');
  const [isLocating, setIsLocating] = useState(false);
  const [tempCoords, setTempCoords] = useState<{lat: number, lng: number} | null>(null);

  const handleGetGps = () => {
    if (!navigator.geolocation) {
      alert("Satellite positioning not supported by your device.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setTempCoords({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setIsLocating(false);
      },
      (error) => {
        console.error(error);
        setIsLocating(false);
        alert("GPS Signal Weak: Unable to lock coordinates.");
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !address) {
      alert("Tank Name and Tank Address are mandatory.");
      return;
    }
    onAdd({ 
      id: Math.random().toString(), 
      name, 
      district, 
      lat: tempCoords?.lat || 11.6643, 
      lng: tempCoords?.lng || 78.1460, 
      status: 'SAFE',
      type,
      address 
    });
    setName(''); setAddress(''); setTempCoords(null);
  };

  return (
    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-slate-50 relative overflow-hidden group">
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-sky-500 p-3 rounded-2xl text-white shadow-lg shadow-sky-100">
          <PlusCircle size={24} />
        </div>
        <div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">Register Tank</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-1">Grid Registration</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Tank Name</label>
          <input 
            placeholder="e.g. My Home Storage Tank" 
            value={name} 
            onChange={e => setName(e.target.value)}
            className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400 transition-all placeholder:text-slate-300"
          />
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-1">Tank Address / Location</label>
          <textarea 
            placeholder="Enter full physical address or specific location details..." 
            value={address} 
            onChange={e => setAddress(e.target.value)}
            className="w-full bg-slate-50/50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400 transition-all placeholder:text-slate-300 h-28 resize-none"
          />
        </div>

        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-3 px-1">Tank Type</label>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setType('private')}
                className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${
                  type === 'private' 
                  ? 'bg-sky-500 border-sky-400 text-white shadow-lg' 
                  : 'bg-slate-50 border-slate-100 text-slate-400'
                }`}
              >
                <Home size={14} /> Private
              </button>
              <p className="text-[9px] text-slate-400 px-1 font-medium leading-tight text-center">
                {t.privateDesc}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setType('public')}
                className={`flex items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${
                  type === 'public' 
                  ? 'bg-sky-500 border-sky-400 text-white shadow-lg' 
                  : 'bg-slate-50 border-slate-100 text-slate-400'
                }`}
              >
                <Building2 size={14} /> Public
              </button>
              <p className="text-[9px] text-slate-400 px-1 font-medium leading-tight text-center">
                {t.publicDesc}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <button
            type="button"
            onClick={handleGetGps}
            disabled={isLocating}
            className={`w-full flex items-center justify-center gap-3 py-5 rounded-[24px] font-black text-xs uppercase tracking-widest transition-all border-2 ${
              tempCoords 
                ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                : 'bg-white text-sky-500 border-sky-100 hover:bg-sky-50'
            }`}
          >
            {isLocating ? <Loader2 size={18} className="animate-spin" /> : tempCoords ? <Check size={18} /> : <Satellite size={18} />}
            {isLocating ? 'Locking Satellite...' : tempCoords ? 'GPS Signature Verified' : 'Sync GPS Location'}
          </button>
          
          <AnimatePresence>
            {tempCoords && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-emerald-50/30 rounded-2xl border border-emerald-50 text-center"
              >
                <p className="text-[9px] text-emerald-500 font-bold uppercase tracking-widest">
                  PRECISION: {tempCoords.lat.toFixed(6)} • {tempCoords.lng.toFixed(6)}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button type="submit" className="w-full bg-slate-800 text-white font-black py-5 rounded-[28px] shadow-2xl hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center gap-3 uppercase tracking-[0.25em] text-xs mt-4">
          <Check size={20} /> Initialize Tank Node
        </button>
      </form>
    </div>
  );
};

export default AddTankForm;
