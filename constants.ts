
import { District, Tank, StateAlert } from './types';

export const DISTRICTS: District[] = [
  { id: 'sal', name: 'Salem', sources: ['Mettur Dam', 'Cauvery Water Supply', 'Yercaud Lake'] },
  { id: 'chn', name: 'Chennai', sources: ['Poondi Reservoir', 'Red Hills Lake', 'Chembarambakkam Lake'] },
  { id: 'cbe', name: 'Coimbatore', sources: ['Siruvani Dam', 'Pillur Reservoir', 'Bhavani River'] },
  { id: 'mdu', name: 'Madurai', sources: ['Vaigai Dam', 'Mullaperiyar Aqueduct'] },
  { id: 'try', name: 'Trichy', sources: ['Cauvery River', 'Kollidam Wells'] },
];

export const STATE_ALERTS: StateAlert[] = [
  { id: '1', district: 'Chennai', severity: 'CRITICAL', message: 'Heavy metal contaminants detected in Red Hills catchment area.', date: '2024-05-24' },
  { id: '2', district: 'Salem', severity: 'SAFE', message: 'Mettur Dam levels healthy; quality parameters within WHO standards.', date: '2024-05-22' },
];

export const MOCK_TANKS: Tank[] = [
  // SALEM
  { 
    id: 'mettur-main', 
    name: 'Mettur Dam', 
    district: 'sal', 
    lat: 11.7963, 
    lng: 77.8016, 
    status: 'SAFE', 
    isMajor: true,
    lastUpdated: '2 minutes ago',
    type: 'public',
    liveData: { ph: 7.4, temp: 28.6, tds: 412, turbidity: 2.8 }
  },
  { id: 'sal-local-1', name: 'Fairlands Local Tank', district: 'sal', lat: 11.6643, lng: 78.1460, status: 'SAFE', type: 'public' },
  
  // CHENNAI
  { 
    id: 'poondi-main', 
    name: 'Poondi Reservoir', 
    district: 'chn', 
    lat: 13.1819, 
    lng: 79.8594, 
    status: 'SAFE', 
    isMajor: true,
    lastUpdated: '5 minutes ago',
    type: 'public',
    liveData: { ph: 7.2, temp: 30.1, tds: 380, turbidity: 1.5 }
  },
  { 
    id: 'chem-main', 
    name: 'Chembarambakkam Lake', 
    district: 'chn', 
    lat: 13.0080, 
    lng: 80.0590, 
    status: 'LOW RISK', 
    isMajor: true,
    lastUpdated: '8 minutes ago',
    type: 'public',
    liveData: { ph: 8.1, temp: 31.2, tds: 520, turbidity: 4.8 }
  },
  { id: 'chn-local-1', name: 'Mylapore Supply Node', district: 'chn', lat: 13.0337, lng: 80.2677, status: 'SAFE', type: 'public' },

  // COIMBATORE
  { 
    id: 'siruvani-main', 
    name: 'Siruvani Dam', 
    district: 'cbe', 
    lat: 10.9410, 
    lng: 76.6850, 
    status: 'SAFE', 
    isMajor: true,
    lastUpdated: '10 minutes ago',
    type: 'public',
    liveData: { ph: 7.0, temp: 24.2, tds: 120, turbidity: 0.8 }
  },
  { id: 'cbe-local-1', name: 'RS Puram Distribution', district: 'cbe', lat: 11.0090, lng: 76.9500, status: 'SAFE', type: 'public' },

  // MADURAI
  { 
    id: 'vaigai-main', 
    name: 'Vaigai Dam', 
    district: 'mdu', 
    lat: 10.0538, 
    lng: 77.5891, 
    status: 'LOW RISK', 
    isMajor: true,
    lastUpdated: '1 minute ago',
    type: 'public',
    liveData: { ph: 6.8, temp: 29.4, tds: 450, turbidity: 4.2 }
  },
  { id: 'mdu-local-1', name: 'Simmakkal Station', district: 'mdu', lat: 9.9252, lng: 78.1198, status: 'HIGH RISK', type: 'public' },

  // TRICHY
  { 
    id: 'kollidam-main', 
    name: 'Kollidam Wells', 
    district: 'try', 
    lat: 10.8500, 
    lng: 78.7000, 
    status: 'SAFE', 
    isMajor: true,
    lastUpdated: '4 minutes ago',
    type: 'public',
    liveData: { ph: 7.3, temp: 27.8, tds: 310, turbidity: 1.2 }
  }
];

export const INITIAL_DATA = {
  ph: 7.2,
  temp: 24.5,
  turbidity: 2.1,
  tds: 240,
};
