
import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Tank, Language, District } from '../types';
import { MOCK_TANKS, DISTRICTS } from '../constants';
import { translations } from '../i18n';
import { Search, ChevronRight, Activity, Thermometer, Wind, Droplets, Info, CheckCircle2, Anchor, Building2, Map as MapIcon, Globe, Home, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MapPanelProps {
  districtId: string;
  language: Language;
}

// Custom Icons
const TankIcon = L.divIcon({
  className: 'custom-tank-icon',
  html: `
    <div style="background: #0ea5e9; width: 40px; height: 40px; border-radius: 50% 50% 10% 10%; border: 3px solid white; box-shadow: 0 4px 15px rgba(14,165,233,0.3); display: flex; align-items: center; justify-content: center; color: white;">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

const PrivateTankIcon = L.divIcon({
  className: 'custom-tank-icon',
  html: `
    <div style="background: #64748b; width: 36px; height: 36px; border-radius: 12px; border: 3px solid white; box-shadow: 0 4px 15px rgba(100,116,139,0.3); display: flex; align-items: center; justify-content: center; color: white;">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

const MajorIcon = L.divIcon({
  className: 'custom-tank-icon',
  html: `
    <div style="background: #6366f1; width: 52px; height: 52px; border-radius: 50% 50% 10% 10%; border: 4px solid white; box-shadow: 0 4px 25px rgba(99,102,241,0.5); display: flex; align-items: center; justify-content: center; color: white;">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>
    </div>
  `,
  iconSize: [52, 52],
  iconAnchor: [26, 52],
  popupAnchor: [0, -52],
});

const ChangeView = ({ center, zoom }: { center: [number, number], zoom?: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom || 13, { animate: true });
  }, [center, zoom, map]);
  return null;
};

const MapPanel: React.FC<MapPanelProps> = ({ districtId: propDistrictId, language }) => {
  const t = translations[language];
  
  const [selectedState, setSelectedState] = useState('Tamil Nadu');
  const [selectedDistrictId, setSelectedDistrictId] = useState(propDistrictId);
  const [selectedResourceId, setSelectedResourceId] = useState('');
  
  const [mapCenter, setMapCenter] = useState<[number, number]>([13.0827, 80.2707]);
  const [zoom, setZoom] = useState(12);

  useEffect(() => {
    setSelectedDistrictId(propDistrictId);
    setSelectedResourceId('');
  }, [propDistrictId]);

  const availableResources = useMemo(() => 
    MOCK_TANKS.filter(tank => tank.district === selectedDistrictId && tank.isMajor), 
    [selectedDistrictId]
  );

  const activeResource = useMemo(() => 
    MOCK_TANKS.find(tank => tank.id === selectedResourceId), 
    [selectedResourceId]
  );

  useEffect(() => {
    if (activeResource) {
      setMapCenter([activeResource.lat, activeResource.lng]);
      setZoom(15);
    } else {
      const firstInDist = MOCK_TANKS.find(t => t.district === selectedDistrictId);
      if (firstInDist) {
        setMapCenter([firstInDist.lat, firstInDist.lng]);
        setZoom(12);
      }
    }
  }, [selectedResourceId, selectedDistrictId]);

  return (
    <div className="bg-white rounded-[48px] shadow-sm border border-slate-50 overflow-hidden h-[780px] relative z-0 flex flex-col xl:flex-row">
      
      {/* 3-Level Network Selector Sidebar */}
      <div className="w-full xl:w-[400px] bg-slate-50 border-r border-slate-100 p-10 flex flex-col gap-10 overflow-y-auto">
        <div className="flex items-center gap-4 mb-2">
          <div className="bg-sky-500 p-3 rounded-2xl text-white shadow-lg shadow-sky-100">
            <Search size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">Network Explorer</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Hierarchical Node Selection</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Level 1: State Selection */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-4 ml-1">01. Regional Authority</label>
            <div className="bg-white border-2 border-slate-100 rounded-3xl p-5 flex items-center justify-between group hover:border-sky-200 transition-colors cursor-default">
              <div className="flex items-center gap-3">
                <Globe size={18} className="text-sky-500" />
                <span className="text-sm font-black text-slate-800">{selectedState}</span>
              </div>
              <CheckCircle2 size={18} className="text-emerald-500" />
            </div>
          </div>

          {/* Level 2: District Selection */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-4 ml-1">02. Administrative District</label>
            <div className="relative">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-sky-500">
                <MapIcon size={18} />
              </div>
              <select 
                className="w-full bg-white border-2 border-slate-100 rounded-3xl pl-14 pr-6 py-5 text-sm font-black text-slate-800 appearance-none focus:outline-none focus:ring-4 focus:ring-sky-500/10 focus:border-sky-400 transition-all cursor-pointer shadow-sm"
                value={selectedDistrictId}
                onChange={(e) => {
                  setSelectedDistrictId(e.target.value);
                  setSelectedResourceId('');
                }}
              >
                {DISTRICTS.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
                <ChevronRight size={18} className="rotate-90" />
              </div>
            </div>
          </div>

          {/* Level 3: Resource Selection */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] block mb-4 ml-1">03. Major Infrastructure</label>
            <div className="space-y-3">
              {availableResources.length > 0 ? (
                availableResources.map(res => (
                  <button
                    key={res.id}
                    onClick={() => setSelectedResourceId(res.id)}
                    className={`w-full flex items-center justify-between p-6 rounded-[28px] border-2 transition-all text-left group ${
                      selectedResourceId === res.id 
                      ? 'bg-sky-500 border-sky-400 text-white shadow-xl shadow-sky-100 scale-[1.02]' 
                      : 'bg-white border-slate-100 text-slate-600 hover:border-sky-300 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                       <div className={`p-2.5 rounded-xl ${selectedResourceId === res.id ? 'bg-white/20' : 'bg-sky-50 text-sky-500'}`}>
                         <Anchor size={18} />
                       </div>
                       <div>
                         <span className="text-xs font-black uppercase tracking-tight block">{res.name}</span>
                         <span className={`text-[9px] font-bold uppercase tracking-widest ${selectedResourceId === res.id ? 'text-white/70' : 'text-slate-400'}`}>Sector Active</span>
                       </div>
                    </div>
                    <ChevronRight size={18} className={selectedResourceId === res.id ? 'text-white' : 'text-slate-300 group-hover:translate-x-1 transition-transform'} />
                  </button>
                ))
              ) : (
                <div className="p-8 bg-white border-2 border-dashed border-slate-100 rounded-[32px] text-center opacity-60">
                  <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <Building2 size={24} />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed tracking-widest">
                    No major grid hubs<br/>detected in this sector
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Map Core */}
      <div className="flex-1 relative h-full min-h-[500px]">
        <MapContainer center={mapCenter} zoom={zoom} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; CARTO'
          />
          <ChangeView center={mapCenter} zoom={zoom} />
          
          {MOCK_TANKS.map(tank => (
            <Marker 
              key={tank.id} 
              position={[tank.lat, tank.lng]}
              icon={tank.isMajor ? MajorIcon : (tank.type === 'private' ? PrivateTankIcon : TankIcon)}
              eventHandlers={{
                click: () => setSelectedResourceId(tank.id),
              }}
            >
              <Popup>
                <div className="p-4 min-w-[200px] text-center">
                  <h4 className="font-black text-sky-900 m-0 leading-tight uppercase text-sm mb-1">{tank.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {tank.isMajor ? 'Strategic Grid Point' : (tank.type === 'private' ? 'Residential Node' : 'Distribution Center')}
                  </p>
                  <div className={`mt-2 inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${tank.type === 'private' ? 'bg-slate-100 text-slate-500' : 'bg-sky-100 text-sky-500'}`}>
                    {tank.type}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Floating Strategic Data Card */}
        <AnimatePresence>
          {activeResource && (
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              className="absolute top-10 right-10 z-[1000] w-96 bg-white/95 backdrop-blur-2xl p-10 rounded-[48px] shadow-2xl border border-white flex flex-col gap-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-2xl font-black text-slate-800 tracking-tighter uppercase leading-none">{activeResource.name}</h4>
                  <p className="text-[11px] text-sky-500 font-bold uppercase tracking-[0.25em] mt-3">
                    {activeResource.type === 'private' ? 'Private Node Visibility' : 'Precision Surveillance'}
                  </p>
                </div>
                <div className={`p-4 rounded-[22px] text-white shadow-xl flex items-center justify-center ${activeResource.type === 'private' ? 'bg-slate-400 shadow-slate-100' : 'bg-sky-500 shadow-sky-100'}`}>
                  {activeResource.type === 'private' ? <Home size={24} /> : <Activity size={24} className="animate-pulse" />}
                </div>
              </div>

              {activeResource.type === 'private' ? (
                <div className="py-10 flex flex-col items-center justify-center text-center bg-slate-50 rounded-[40px] border border-dashed border-slate-200">
                  <ShieldAlert size={48} className="text-slate-300 mb-4" />
                  <h5 className="text-sm font-black text-slate-800 uppercase tracking-tight">Data Restricted</h5>
                  <p className="text-[11px] text-slate-400 mt-2 px-8 leading-relaxed font-bold">
                    This is a private residential node. Sensor metrics are visible only to the authorized property owner.
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-5">
                    {[
                      { label: 'pH Value', value: activeResource.liveData?.ph, unit: 'pH', icon: Activity, color: 'text-sky-500', bg: 'bg-sky-50/50' },
                      { label: 'Thermal Index', value: activeResource.liveData?.temp, unit: '°C', icon: Thermometer, color: 'text-orange-500', bg: 'bg-orange-50/50' },
                      { label: 'Mineral TDS', value: activeResource.liveData?.tds, unit: 'ppm', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50/50' },
                      { label: 'Turbidity', value: activeResource.liveData?.turbidity, unit: 'NTU', icon: Wind, color: 'text-cyan-500', bg: 'bg-cyan-50/50' },
                    ].map((stat, i) => (
                      <div key={i} className={`${stat.bg} p-6 rounded-[32px] border border-white flex flex-col items-center shadow-sm`}>
                        <stat.icon size={16} className={`${stat.color} mb-2`} />
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-2 tracking-widest">{stat.label}</p>
                        <p className="text-xl font-black text-slate-800 tracking-tight">{stat.value} <span className="text-[9px] text-slate-400 uppercase ml-1">{stat.unit}</span></p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-emerald-500/10 p-6 rounded-[32px] border border-emerald-500/20 flex items-center gap-5">
                    <div className="bg-emerald-500 p-3 rounded-2xl shadow-lg shadow-emerald-100 text-white">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">Grid Health Status</p>
                      <p className="text-lg font-black text-emerald-800 uppercase tracking-tight">Optimal / Good</p>
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2">
                <span className="flex items-center gap-2"><Info size={14} className="text-sky-400" /> Sensor Sync Verified</span>
                <span className="text-slate-500">Updated {activeResource.lastUpdated || 'Recently'}</span>
              </div>

              <button className={`w-full text-white font-black py-6 rounded-[32px] shadow-2xl active:scale-[0.97] transition-all text-xs uppercase tracking-[0.25em] flex items-center justify-center gap-3 ${activeResource.type === 'private' ? 'bg-slate-400 shadow-slate-200' : 'bg-slate-900 shadow-slate-200 hover:bg-black'}`}>
                {activeResource.type === 'private' ? 'Verify Ownership' : <><Activity size={18} /> Deep Diagnostic Report</>}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MapPanel;
