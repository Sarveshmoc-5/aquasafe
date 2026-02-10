
import React from 'react';
import { 
  LayoutDashboard, 
  BarChart3, 
  Map as MapIcon, 
  Bell, 
  Settings, 
  LogOut,
  Droplets,
  User as UserIcon,
  Cpu
} from 'lucide-react';
import { translations } from '../i18n';
import { Language } from '../types';

interface SidebarProps {
  currentPage: string;
  setPage: (page: string) => void;
  language: Language;
  onLogout: () => void;
  role: 'smart' | 'standard';
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, setPage, language, onLogout, role }) => {
  const t = translations[language];

  const navItems = [
    { id: 'overview', icon: LayoutDashboard, label: t.overview },
    { id: 'analytics', icon: BarChart3, label: t.analytics },
    { id: 'mapView', icon: MapIcon, label: t.mapView },
    { id: 'alerts', icon: Bell, label: t.alerts },
    { id: 'management', icon: Cpu, label: 'Management' },
    { id: 'account', icon: UserIcon, label: 'Account' }
  ];

  return (
    <div className="w-64 bg-white h-screen flex flex-col border-r border-sky-50 shadow-sm fixed left-0 top-0 z-50">
      <div className="p-8 flex items-center gap-3">
        <div className="bg-sky-500 p-2.5 rounded-2xl text-white shadow-lg shadow-sky-100">
          <Droplets size={26} />
        </div>
        <div>
          <h1 className="text-xl font-black text-sky-900 leading-none tracking-tight">AquaSafe</h1>
          <p className="text-[10px] text-sky-500 font-bold uppercase tracking-[0.2em] mt-1">Surveillance</p>
        </div>
      </div>

      <nav className="flex-1 px-4 mt-6 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
              currentPage === item.id 
                ? 'bg-sky-500 text-white font-bold shadow-xl shadow-sky-100 scale-[1.02]' 
                : 'text-slate-400 hover:bg-slate-50 hover:text-sky-500'
            }`}
          >
            <item.icon size={20} className={currentPage === item.id ? 'text-white' : ''} />
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-6">
        <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100/50">
          <p className="text-[10px] font-bold text-sky-400 uppercase tracking-widest mb-1">Session Role</p>
          <p className="text-xs font-bold text-sky-700 capitalize">{role} Officer</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
