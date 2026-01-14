
export type UserRole = 'smart' | 'standard';

export interface User {
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type WaterStatus = 'SAFE' | 'LOW RISK' | 'HIGH RISK' | 'CRITICAL';
export type TankType = 'private' | 'public';

export interface WaterParameters {
  ph: number;
  temp: number;
  turbidity: number;
  tds: number;
}

export interface RiskAnalysis {
  status: WaterStatus;
  riskLevel: string;
  confidence: number;
  potentialIssues: string[];
  recommendation: string;
  predictedDiseases?: string[];
}

export interface Tank {
  id: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  status: WaterStatus;
  isMajor?: boolean;
  liveData?: WaterParameters;
  lastUpdated?: string;
  type: TankType;
  address?: string;
}

export interface District {
  id: string;
  name: string;
  sources: string[];
}

export interface StateAlert {
  id: string;
  district: string;
  severity: WaterStatus;
  message: string;
  date: string;
}

export type Language = 'en' | 'ta' | 'hi';
