import { create } from 'zustand';

interface StrategicZone {
  id: string;
  name: string;
  type: 'CITY' | 'AIRBASE' | 'INFRASTRUCTURE' | 'RADAR_STATION';
  x: number; // percentage width
  y: number; // percentage height
  importance: 'CRITICAL' | 'HIGH' | 'MEDIUM';
}

interface MapState {
  selectedLayer: 'RADAR' | 'TERRAIN' | 'WEATHER' | 'STRATEGIC_ZONES' | 'ALL';
  showRadarCoverage: boolean;
  showStateBoundaries: boolean;
  showAirbases: boolean;
  showCities: boolean;
  showGraticule: boolean;
  activeZone: StrategicZone | null;
  strategicZones: StrategicZone[];
  
  // Actions
  setSelectedLayer: (layer: MapState['selectedLayer']) => void;
  toggleRadarCoverage: () => void;
  toggleStateBoundaries: () => void;
  toggleAirbases: () => void;
  toggleCities: () => void;
  toggleGraticule: () => void;
  setActiveZone: (zone: StrategicZone | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
  selectedLayer: 'ALL',
  showRadarCoverage: true,
  showStateBoundaries: true,
  showAirbases: true,
  showCities: true,
  showGraticule: false,
  activeZone: null,
  
  // Seeded educational strategic centers of interest
  strategicZones: [
    { id: 'sz-1', name: 'New Delhi (NCR)', type: 'CITY', x: 42, y: 35, importance: 'CRITICAL' },
    { id: 'sz-2', name: 'Mumbai (Western Command)', type: 'CITY', x: 28, y: 62, importance: 'CRITICAL' },
    { id: 'sz-3', name: 'Ambala Air Force Station', type: 'AIRBASE', x: 41, y: 31, importance: 'HIGH' },
    { id: 'sz-4', name: 'Halwara Airbase', type: 'AIRBASE', x: 39, y: 29, importance: 'HIGH' },
    { id: 'sz-5', name: 'Tezpur Airbase', type: 'AIRBASE', x: 86, y: 41, importance: 'HIGH' },
    { id: 'sz-6', name: 'Srinagar Airfield', type: 'AIRBASE', x: 38, y: 19, importance: 'HIGH' },
    { id: 'sz-7', name: 'Kolkata Sector Center', type: 'CITY', x: 70, y: 52, importance: 'CRITICAL' },
    { id: 'sz-8', name: 'Jodhpur Air Base', type: 'AIRBASE', x: 30, y: 40, importance: 'HIGH' },
    { id: 'sz-9', name: 'Visakhapatnam Naval Command', type: 'INFRASTRUCTURE', x: 55, y: 68, importance: 'HIGH' },
  ],

  setSelectedLayer: (layer) => set({ selectedLayer: layer }),
  toggleRadarCoverage: () => set((state) => ({ showRadarCoverage: !state.showRadarCoverage })),
  toggleStateBoundaries: () => set((state) => ({ showStateBoundaries: !state.showStateBoundaries })),
  toggleAirbases: () => set((state) => ({ showAirbases: !state.showAirbases })),
  toggleCities: () => set((state) => ({ showCities: !state.showCities })),
  toggleGraticule: () => set((state) => ({ showGraticule: !state.showGraticule })),
  setActiveZone: (zone) => set({ activeZone: zone }),
}));
