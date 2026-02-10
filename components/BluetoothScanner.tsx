import React, { useState } from 'react';
import { Bluetooth, BluetoothOff, Loader2, Cpu, Signal, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n';
import { db } from "../firebase";
import { ref, set } from "firebase/database";

interface Props {
  language: Language;
}

interface Device {
  id: string;
  name: string;
  connected: boolean;
  rssi?: number;
}

const BluetoothScanner: React.FC<Props> = ({ language }) => {
  const t = translations[language];
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);

  const scanAndConnect = async () => {
    setError(null);
    setScanning(true);

    if (!(navigator as any).bluetooth) {
      setError(t.noBluetooth);
      setScanning(false);
      return;
    }

    try {
      // requestDevice will trigger the browser's native Bluetooth picker
      const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        // For specific IoT kits, you'd usually filter by services:
        // filters: [{ services: ['battery_service'] }]
      });

      console.log('Device selected:', device.name);

      const newDevice: Device = {
        id: device.id,
        name: device.name || 'Unknown IoT Device',
        connected: true,
        rssi: -Math.floor(Math.random() * 40 + 30) // Simulated signal strength
      };

      // Add the connected device to our list
      setDevices(prev => {
        const exists = prev.find(d => d.id === newDevice.id);
        if (exists) return prev.map(d => d.id === newDevice.id ? newDevice : d);
        return [...prev, newDevice];
      });

      // In a real app, you would now call device.gatt.connect() 
      // and start reading sensor characteristics.
      const server = await device.gatt.connect();
const service = await server.getPrimaryService("12345678-1234-1234-1234-1234567890ab");
const characteristic = await service.getCharacteristic("abcd1234-5678-1234-5678-abcdef123456");

characteristic.addEventListener("characteristicvaluechanged", (event: any) => {
  const value = new TextDecoder().decode(event.target.value);
  console.log("ESP32 Data:", value);

  const [ph, temp, turbidity, tds] = value.split(",");

  set(ref(db, "sensorData"), {
    ph: parseFloat(ph),
    temp: parseFloat(temp),
    turbidity: parseFloat(turbidity),
    tds: parseInt(tds),
    time: Date.now()
  });
});

await characteristic.startNotifications();

      
    } catch (err: any) {
      if (err.name !== 'NotFoundError') {
        setError(err.message || 'Bluetooth Connection Failed');
      }
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[24px] shadow-sm border border-slate-50 flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 p-2 rounded-xl text-white shadow-md shadow-blue-100">
            <Bluetooth size={20} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">{t.connectIot}</h3>
        </div>
        
        {devices.length > 0 && (
          <span className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-100">
            {devices.length} Active Node{devices.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
        {devices.length === 0 && !scanning && (
          <div className="flex flex-col items-center justify-center py-12 text-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
            <div className="bg-white p-4 rounded-full shadow-sm mb-4">
              <Cpu size={32} className="text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium text-sm max-w-[200px]">
              No IoT devices paired. Start scanning to connect your kit.
            </p>
          </div>
        )}

        {scanning && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-20"></div>
              <div className="relative bg-blue-100 p-6 rounded-full">
                <Loader2 size={32} className="text-blue-600 animate-spin" />
              </div>
            </div>
            <p className="text-blue-600 font-bold text-sm animate-pulse">
              {t.scanning}
            </p>
          </div>
        )}

        {devices.map((device) => (
          <div 
            key={device.id} 
            className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-200 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 p-3 rounded-xl text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <Cpu size={20} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">{device.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Signal size={12} className="text-emerald-500" />
                  <span className="text-[10px] font-medium text-slate-400">Signal: Strong ({device.rssi}dBm)</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
                <CheckCircle2 size={12} />
                Connected
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-50">
        <button
          onClick={scanAndConnect}
          disabled={scanning}
          className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-[0.98] ${
            scanning 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
          }`}
        >
          {scanning ? <Loader2 size={20} className="animate-spin" /> : <Bluetooth size={20} />}
          {scanning ? 'Initializing...' : t.connectIot}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-50 rounded-xl flex items-start gap-3 border border-red-100">
            <BluetoothOff size={16} className="text-red-500 mt-0.5" />
            <p className="text-xs text-red-600 font-medium leading-relaxed">
              {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BluetoothScanner;