
//import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "firebase/auth";
import { ref, set, onValue } from "firebase/database";
import { db } from "./firebase";


import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Droplets, 
  Thermometer, 
  Wind, 
  Activity,
  AlertCircle,
  RefreshCw,
  MapPin,
  User as UserIcon,
  ShieldCheck,
  Search,
  CheckCircle2,
  Lock,
  Mail,
  UserPlus,
  ArrowRight,
  Settings,
  Globe,
  LogOut,
  Cpu
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import StatusCard from './components/StatusCard';
import SensorCard from './components/SensorCard';
import AICard from './components/AICard';
import ChartsPanel from './components/ChartsPanel';
import MapPanel from './components/MapPanel';
import BluetoothScanner from './components/BluetoothScanner';
import ManualEntryForm from './components/ManualEntryForm';
import LanguageSwitcher from './components/LanguageSwitcher';
import AddTankForm from './components/AddTankForm';

import { DISTRICTS, INITIAL_DATA, STATE_ALERTS, MOCK_TANKS } from './constants';
import { User, Language, WaterParameters, Tank } from './types';
import { analyzeWaterQuality } from './services/predictionService';
import { translations } from './i18n';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [currentPage, setCurrentPage] = useState('overview');

  const [districtId, setDistrictId] = useState(DISTRICTS[0].id);
  const [currentData, setCurrentData] = useState<WaterParameters>(INITIAL_DATA);
  const [history, setHistory] = useState<(WaterParameters & { timestamp: string })[]>([]);
  const [allTanks, setAllTanks] = useState<Tank[]>(MOCK_TANKS);

  const t = translations[language];


  const simulateNewData = () => {
    const newData = {
      ph: parseFloat((6.5 + Math.random() * 2).toFixed(1)),
      temp: parseFloat((22 + Math.random() * 8).toFixed(1)),
      turbidity: parseFloat((0.5 + Math.random() * 6).toFixed(1)),
      tds: Math.floor(150 + Math.random() * 800),
    };
    setCurrentData(newData);
  };

  useEffect(() => {
    if (history.length === 0) {
      const initialHistory = Array.from({ length: 15 }).map((_, i) => ({
        ph: 7.0 + Math.random() * 0.5,
        temp: 24 + Math.random() * 2,
        turbidity: 1.5 + Math.random() * 1.5,
        tds: 220 + Math.random() * 40,
        timestamp: new Date(Date.now() - (15 - i) * 1000 * 60).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
      setHistory(initialHistory);
    }
  }, []);

  useEffect(() => {
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setHistory(prev => [...prev, { ...currentData, timestamp }].slice(-25));
  }, [currentData]);
  useEffect(() => {
    if (user) {
      localStorage.setItem("mode", user.role);
    }
    }, [user]);

  const [loginData, setLoginData] = useState({ email: '', password: '', name: '', role: 'standard' as 'smart' | 'standard' });

 const handleAuth = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    if (isRegistering) {
  const userCred = await createUserWithEmailAndPassword(
    auth, 
    loginData.email, 
    loginData.password
  );

  // SAVE USER INFO TO DATABASE
  set(ref(db, "users/" + userCred.user.uid), {
    name: loginData.name,
    email: loginData.email,
    role: loginData.role
  });

  alert("Account created successfully! Now you can log in.");
  setIsRegistering(false);
  return;
}

    // LOGIN EXISTING USER
    const userCred = await signInWithEmailAndPassword(
  auth, 
  loginData.email, 
  loginData.password
);

// LOAD USER INFO FROM DATABASE
const userRef = ref(db, "users/" + userCred.user.uid);

onValue(userRef, (snapshot) => {
  const data = snapshot.val();

  setUser({ 
    name: data?.name || "Utility Officer",
    email: data?.email,
    role: data?.role || "standard"
  });
});


  } catch (error: any) {
    alert(error.message);
  }
};



  const handleLogout = () => setUser(null);

  const analysis = useMemo(() => analyzeWaterQuality(currentData), [currentData]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#f0f9fa]">
        <div className="wave-container"><div className="wave opacity-20"></div></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-2xl p-8 md:p-12 rounded-[40px] shadow-2xl border border-white max-w-xl w-full z-10"
        >
          <div className="flex flex-col items-center mb-10">
            <div className="bg-sky-500 p-5 rounded-[24px] text-white mb-6 shadow-xl shadow-sky-100">
              <Droplets size={48} />
            </div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tight text-center">
              {isRegistering ? t.register : t.login}
            </h2>
            <p className="text-slate-400 font-medium text-sm mt-2 text-center max-w-xs leading-relaxed">
              {t.tagline}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            {isRegistering && (
              <div className="relative">
                <UserPlus className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input 
                  required
                  type="text" 
                  value={loginData.name}
                  onChange={e => setLoginData({...loginData, name: e.target.value})}
                  className="w-full bg-slate-50/50 border border-slate-100 rounded-3xl px-14 py-5 text-sm font-medium text-slate-900 focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400 focus:outline-none transition-all placeholder:text-slate-300" 
                  placeholder={t.fullName}
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                required
                type="email" 
                value={loginData.email}
                onChange={e => setLoginData({...loginData, email: e.target.value})}
                className="w-full bg-slate-50/50 border border-slate-100 rounded-3xl px-14 py-5 text-sm font-medium text-slate-900 focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400 focus:outline-none transition-all placeholder:text-slate-300" 
                placeholder={t.email}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
              <input 
                required
                type="password" 
                value={loginData.password}
                onChange={e => setLoginData({...loginData, password: e.target.value})}
                className="w-full bg-slate-50/50 border border-slate-100 rounded-3xl px-14 py-5 text-sm font-medium text-slate-900 focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400 focus:outline-none transition-all placeholder:text-slate-300" 
                placeholder={t.password}
              />
            </div>

            <div className="pt-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-4 ml-2">Select User Role</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setLoginData({...loginData, role: 'standard'})}
                  className={`p-5 rounded-[24px] border-2 transition-all flex flex-col items-center gap-3 ${
                    loginData.role === 'standard' 
                      ? 'border-sky-500 bg-sky-50/50 text-sky-700' 
                      : 'border-slate-50 bg-slate-50/30 text-slate-400 grayscale'
                  }`}
                >
                  <UserIcon size={24} />
                  <span className="text-[11px] font-bold uppercase tracking-tight">{t.standardUser}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLoginData({...loginData, role: 'smart'})}
                  className={`p-5 rounded-[24px] border-2 transition-all flex flex-col items-center gap-3 ${
                    loginData.role === 'smart' 
                      ? 'border-sky-500 bg-sky-50/50 text-sky-700' 
                      : 'border-slate-50 bg-slate-50/30 text-slate-400 grayscale'
                  }`}
                >
                  <ShieldCheck size={24} />
                  <span className="text-[11px] font-bold uppercase tracking-tight">{t.smartUser}</span>
                </button>
              </div>

              {loginData.role === 'smart' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-4 bg-sky-50 rounded-2xl border border-sky-100 flex gap-3"
                >
                  <AlertCircle size={18} className="text-sky-500 shrink-0" />
                  <p className="text-[11px] text-sky-700 font-medium leading-relaxed">
                    {t.iotDisclaimer}
                  </p>
                </motion.div>
              )}
            </div>

            <button 
              type="submit"
              className="w-full bg-sky-500 text-white font-black py-6 rounded-3xl shadow-xl shadow-sky-100 hover:bg-sky-600 active:scale-95 transition-all mt-6 flex items-center justify-center gap-2 group"
            >
              {isRegistering ? t.register : t.login}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-10 text-center border-t border-slate-50 pt-8">
            <button 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-sky-600 text-sm font-black hover:text-sky-700 transition-colors"
            >
              {isRegistering ? "Return to Secure Login" : "New Officer? Create Dashboard Access"}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#f5fbfd] overflow-hidden">
      <div className="wave-container"><div className="wave opacity-5"></div></div>
      <Sidebar 
        currentPage={currentPage} 
        setPage={setCurrentPage} 
        language={language} 
        onLogout={handleLogout}
        role={user.role}
      />
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen scrollbar-hide pb-24">
        <header className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6 bg-white/50 p-6 rounded-[32px] border border-white backdrop-blur-sm shadow-sm print:hidden">
          <div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              {currentPage === 'account' ? 'Profile Authority' : 
               currentPage === 'management' ? 'Resource Management' :
               t[currentPage as keyof typeof t] || t.overview}
              <span className="text-sky-500 text-sm font-normal">• {user.name}</span>
            </h2>
            <p className="text-slate-400 text-sm font-medium">{t.tagline}</p>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={simulateNewData}
              className="bg-sky-500 text-white p-4 rounded-[20px] shadow-lg shadow-sky-100 flex items-center gap-2 hover:bg-sky-600 active:scale-95 transition-all font-bold text-xs uppercase tracking-wider"
            >
              <RefreshCw size={16} /> Simulate Data
            </button>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="bg-white/80 p-2.5 px-5 rounded-[20px] flex items-center gap-4 shadow-sm border border-slate-50">
              <MapPin size={18} className="text-sky-500" />
              <select 
                value={districtId} 
                onChange={e => setDistrictId(e.target.value)} 
                className="bg-transparent text-xs font-black text-slate-700 outline-none cursor-pointer uppercase tracking-widest"
              >
                {DISTRICTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {currentPage === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <StatusCard status={analysis.status} language={language} timestamp={new Date().toLocaleTimeString()} />
                <div className="lg:col-span-2">
                  <AICard 
                    analysis={analysis} 
                    language={language} 
                    currentData={currentData} 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SensorCard icon={Activity} label={t.ph} value={currentData.ph} unit="pH" color="bg-sky-400" />
                <SensorCard icon={Thermometer} label={t.temp} value={currentData.temp} unit="°C" color="bg-orange-400" />
                <SensorCard icon={Wind} label={t.turbidity} value={currentData.turbidity} unit="NTU" color="bg-cyan-400" />
                <SensorCard icon={Droplets} label={t.tds} value={currentData.tds} unit="ppm" color="bg-sky-600" />
              </div>
            </motion.div>
          )}

          {currentPage === 'analytics' && (
            <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="bg-white p-8 rounded-[48px] border border-slate-50 shadow-sm min-h-[600px]">
                <ChartsPanel 
                  history={history} 
                  language={language} 
                  currentData={currentData} 
                />
              </div>
            </motion.div>
          )}

          {currentPage === 'mapView' && (
            <motion.div key="mapView" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white p-6 rounded-[24px] shadow-sm border border-slate-50">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Network Search</h4>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                      <input className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 focus:outline-none" placeholder="Find Point..." />
                    </div>
                  </div>
                  {user.role === 'smart' && <AddTankForm language={language} onAdd={(t) => setAllTanks([...allTanks, t])} />}
                </div>
                <div className="lg:col-span-3">
                  <MapPanel districtId={districtId} language={language} />
                </div>
              </div>
            </motion.div>
          )}

          {currentPage === 'alerts' && (
            <motion.div key="alerts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-50">
                  <h3 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3"><AlertCircle className="text-red-500" /> Regional Water Surveillance</h3>
                  <div className="space-y-4">
                    {STATE_ALERTS.map(alert => (
                      <div key={alert.id} className={`p-6 rounded-[24px] border-2 transition-all hover:scale-[1.01] ${alert.severity === 'CRITICAL' ? 'bg-red-50 border-red-100 text-red-700' : 'bg-sky-50 border-sky-100 text-sky-700'}`}>
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-black text-[10px] uppercase tracking-[0.2em]">{alert.district} REGION</span>
                          <span className="text-[10px] font-bold opacity-60 bg-white/50 px-3 py-1 rounded-full">{alert.date}</span>
                        </div>
                        <p className="text-sm font-bold leading-relaxed">{alert.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-12 rounded-[40px] shadow-sm border border-slate-50 flex flex-col justify-center items-center text-center">
                  <div className="bg-emerald-50 text-emerald-500 p-8 rounded-full mb-6 animate-pulse"><ShieldCheck size={56} /></div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">Network Security: Active</h3>
                  <p className="text-slate-400 text-sm max-w-xs leading-relaxed">
                    AI-powered threat detection is continuously verifying water quality signatures across all Tamil Nadu supply points.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {currentPage === 'management' && (
            <motion.div key="management" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              {user.role === 'smart' ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <BluetoothScanner language={language} />
                  <ManualEntryForm initialData={currentData} onSave={setCurrentData} language={language} />
                </div>
              ) : (
                <div className="bg-white/50 p-20 rounded-[40px] border-4 border-dashed border-sky-100 flex flex-col items-center text-center">
                  <div className="bg-white p-6 rounded-full shadow-xl mb-6 text-sky-300"><Cpu size={64} /></div>
                  <h3 className="text-2xl font-black text-sky-900">Device Pairing Restricted</h3>
                  <p className="text-sky-600/60 text-sm mt-4 max-w-sm leading-relaxed font-bold">
                    Hardware synchronization, manual overrides, and IoT kit integration are strictly limited to verified Smart Device users.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {currentPage === 'account' && (
            <motion.div key="account" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-8">
              <div className="bg-white p-12 rounded-[40px] shadow-sm border border-slate-50 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-sky-500"></div>
                <div className="flex flex-col md:flex-row items-center gap-10">
                  <div className="relative">
                    <div className="w-32 h-32 bg-sky-50 rounded-[40px] flex items-center justify-center text-sky-500 border-2 border-white shadow-2xl shadow-sky-100">
                      <UserIcon size={56} />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-2xl border-4 border-white">
                      <CheckCircle2 size={16} />
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <p className="text-sky-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{user.role} Privilege Access</p>
                    <h3 className="text-4xl font-black text-slate-800 mb-2">{user.name}</h3>
                    <p className="text-slate-400 font-bold flex items-center justify-center md:justify-start gap-2">
                      <Mail size={16} /> {user.email}
                    </p>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-8 py-5 bg-red-50 text-red-500 font-black rounded-3xl hover:bg-red-100 transition-all active:scale-95"
                  >
                    <LogOut size={20} /> Sign Out
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-50">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-sky-50 p-3 rounded-2xl text-sky-500"><Globe size={24} /></div>
                    <h4 className="text-xl font-black text-slate-800">Interface Settings</h4>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 ml-2">Display Language</label>
                      <LanguageSwitcher currentLang={language} onSelect={setLanguage} />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-50">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="bg-sky-50 p-3 rounded-2xl text-sky-500"><Settings size={24} /></div>
                    <h4 className="text-xl font-black text-slate-800">System Preferences</h4>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-sm font-bold text-slate-600">Push Notifications</span>
                      <div className="w-10 h-6 bg-emerald-500 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1"></div></div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <span className="text-sm font-bold text-slate-600">Critical Audio Alerts</span>
                      <div className="w-10 h-6 bg-slate-200 rounded-full relative"><div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1"></div></div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <footer className="mt-16 pt-8 border-t border-slate-200/50 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest print:hidden">
          <p className="max-w-xl text-center md:text-left leading-relaxed">{t.generalDisclaimer}</p>
          <p className="whitespace-nowrap opacity-60">&copy; 2024 AquaSafe Intelligence Systems</p>
        </footer>
      </main>
    </div>
  );
};

export default App;
