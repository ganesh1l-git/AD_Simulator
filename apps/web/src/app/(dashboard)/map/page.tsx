'use client';

import { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

// ---- India boundary (simplified educational coordinates) ----
const INDIA_OUTLINE: [number, number][] = [
  [68.7, 23.6], [70.0, 20.7], [72.8, 19.0], [74.8, 15.4], [74.5, 12.8],
  [77.0, 8.1], [78.0, 8.2], [80.2, 9.8], [80.0, 13.5], [82.2, 16.5],
  [87.0, 21.5], [88.0, 22.0], [89.0, 26.0], [88.1, 27.5], [85.0, 28.2],
  [81.0, 30.0], [78.0, 31.5], [76.0, 32.7], [74.5, 35.5], [74.0, 34.0],
  [72.0, 33.0], [70.5, 28.0], [68.5, 25.5], [68.7, 23.6],
];

// Strategic zones (educational, approximate)
const STRATEGIC_ZONES = [
  // Major Cities
  { id: 'delhi', name: 'New Delhi', lat: 28.6, lng: 77.2, type: 'CITY', radius: 2.0, value: 100, color: '#ef4444' },
  { id: 'mumbai', name: 'Mumbai', lat: 19.0, lng: 72.8, type: 'CITY', radius: 1.8, value: 90, color: '#ef4444' },
  { id: 'bengaluru', name: 'Bengaluru', lat: 12.9, lng: 77.5, type: 'CITY', radius: 1.5, value: 75, color: '#ef4444' },
  { id: 'kolkata', name: 'Kolkata', lat: 22.5, lng: 88.3, type: 'CITY', radius: 1.5, value: 70, color: '#ef4444' },
  { id: 'chennai', name: 'Chennai', lat: 13.0, lng: 80.2, type: 'CITY', radius: 1.3, value: 65, color: '#ef4444' },

  // Air Bases (18)
  { id: 'srinagar', name: 'Srinagar AFB', lat: 34.00, lng: 74.80, type: 'AIRBASE', radius: 0.8, value: 85, color: '#00b4d8' },
  { id: 'jammu', name: 'Jammu AFB', lat: 32.69, lng: 74.84, type: 'AIRBASE', radius: 0.8, value: 80, color: '#00b4d8' },
  { id: 'pathankot', name: 'Pathankot AFB', lat: 32.23, lng: 75.64, type: 'AIRBASE', radius: 0.8, value: 90, color: '#00b4d8' },
  { id: 'amritsar', name: 'Amritsar AFB', lat: 31.71, lng: 74.80, type: 'AIRBASE', radius: 0.8, value: 85, color: '#00b4d8' },
  { id: 'adampur', name: 'Adampur AFB', lat: 31.43, lng: 75.76, type: 'AIRBASE', radius: 0.8, value: 85, color: '#00b4d8' },
  { id: 'halwara', name: 'Halwara AFB', lat: 30.75, lng: 75.63, type: 'AIRBASE', radius: 0.8, value: 85, color: '#00b4d8' },
  { id: 'bathinda', name: 'Bathinda AFB', lat: 30.26, lng: 74.75, type: 'AIRBASE', radius: 0.8, value: 80, color: '#00b4d8' },
  { id: 'ambala', name: 'Ambala AFB', lat: 30.38, lng: 76.82, type: 'AIRBASE', radius: 0.8, value: 90, color: '#00b4d8' },
  { id: 'sirsa', name: 'Sirsa AFB', lat: 29.58, lng: 75.03, type: 'AIRBASE', radius: 0.8, value: 80, color: '#00b4d8' },
  { id: 'nal', name: 'Nal (Bikaner) AFB', lat: 28.07, lng: 73.21, type: 'AIRBASE', radius: 0.8, value: 85, color: '#00b4d8' },
  { id: 'phalodi', name: 'Phalodi AFB', lat: 27.25, lng: 72.53, type: 'AIRBASE', radius: 0.8, value: 80, color: '#00b4d8' },
  { id: 'jaisalmer', name: 'Jaisalmer AFB', lat: 26.89, lng: 70.86, type: 'AIRBASE', radius: 0.8, value: 85, color: '#00b4d8' },
  { id: 'jodhpur', name: 'Jodhpur AFB', lat: 26.25, lng: 73.05, type: 'AIRBASE', radius: 0.8, value: 85, color: '#00b4d8' },
  { id: 'uttarlai', name: 'Uttarlai AFB', lat: 25.75, lng: 71.48, type: 'AIRBASE', radius: 0.8, value: 80, color: '#00b4d8' },
  { id: 'deesa', name: 'Deesa AFB', lat: 24.26, lng: 72.19, type: 'AIRBASE', radius: 0.8, value: 75, color: '#00b4d8' },
  { id: 'bhuj', name: 'Bhuj AFB', lat: 23.29, lng: 69.67, type: 'AIRBASE', radius: 0.8, value: 80, color: '#00b4d8' },
  { id: 'naliya', name: 'Naliya AFB', lat: 23.22, lng: 68.90, type: 'AIRBASE', radius: 0.8, value: 75, color: '#00b4d8' },
  { id: 'jamnagar', name: 'Jamnagar AFB', lat: 22.48, lng: 70.01, type: 'AIRBASE', radius: 0.8, value: 85, color: '#00b4d8' },
];

// Placed defence systems (coordinates represent approximate airbase locations)
const DEFENCE_PLACEMENTS = [
  // S-400 Squadrons (Range: 4.0 = 400km)
  { id: 's400-punjab', name: 'S-400 Sqdn 1 (Punjab)', lat: 31.43, lng: 75.20, range: 4.0, color: '#ef4444', category: 'LONG_RANGE' },
  { id: 's400-china-front', name: 'S-400 Sqdn 2 (China Front)', lat: 27.50, lng: 88.80, range: 4.0, color: '#ef4444', category: 'LONG_RANGE' },
  { id: 's400-rajasthan', name: 'S-400 Sqdn 3 (Rajasthan)', lat: 26.00, lng: 71.50, range: 4.0, color: '#ef4444', category: 'LONG_RANGE' },
  { id: 's400-raj-punjab', name: 'S-400 Sqdn 4 (Raj-Punjab)', lat: 28.80, lng: 73.80, range: 4.0, color: '#ef4444', category: 'LONG_RANGE' },

  // Barak-8 SAM Systems (Range: 1.0 = 100km)
  { id: 'barak-jaisalmer', name: 'Barak-8 (Jaisalmer)', lat: 26.89, lng: 70.86, range: 1.0, color: '#f59e0b', category: 'MEDIUM_RANGE' },
  { id: 'barak-adampur', name: 'Barak-8 (Adampur)', lat: 31.43, lng: 75.76, range: 1.0, color: '#f59e0b', category: 'MEDIUM_RANGE' },
  { id: 'barak-bathinda', name: 'Barak-8 (Bathinda)', lat: 30.26, lng: 74.75, range: 1.0, color: '#f59e0b', category: 'MEDIUM_RANGE' },
  { id: 'barak-pathankot', name: 'Barak-8 (Pathankot)', lat: 32.23, lng: 75.64, range: 1.0, color: '#f59e0b', category: 'MEDIUM_RANGE' },
  { id: 'barak-halwara', name: 'Barak-8 (Halwara)', lat: 30.75, lng: 75.63, range: 1.0, color: '#f59e0b', category: 'MEDIUM_RANGE' },
  { id: 'barak-ambala', name: 'Barak-8 (Ambala)', lat: 30.38, lng: 76.82, range: 1.0, color: '#f59e0b', category: 'MEDIUM_RANGE' },
  { id: 'barak-sirsa', name: 'Barak-8 (Sirsa)', lat: 29.58, lng: 75.03, range: 1.0, color: '#f59e0b', category: 'MEDIUM_RANGE' },
  { id: 'barak-nal', name: 'Barak-8 (Nal)', lat: 28.07, lng: 73.21, range: 1.0, color: '#f59e0b', category: 'MEDIUM_RANGE' },
  { id: 'barak-uttarlai', name: 'Barak-8 (Uttarlai)', lat: 25.75, lng: 71.48, range: 1.0, color: '#f59e0b', category: 'MEDIUM_RANGE' },

  // Akash / Spyder / QRSAM (Short/Medium Range)
  // Deployed in rest of the air bases (less threat) & complementary to S-400/Barak-8
  { id: 'akash-bhuj', name: 'Akash (Bhuj)', lat: 23.29, lng: 69.67, range: 0.8, color: '#00ff88', category: 'SHORT_RANGE' },
  { id: 'spyder-naliya', name: 'Spyder (Naliya)', lat: 23.22, lng: 68.90, range: 0.35, color: '#00ff88', category: 'SHORT_RANGE' },
  { id: 'qrsam-jamnagar', name: 'QRSAM (Jamnagar)', lat: 22.48, lng: 70.01, range: 0.3, color: '#00ff88', category: 'SHORT_RANGE' },
  { id: 'akash-deesa', name: 'Akash (Deesa)', lat: 24.26, lng: 72.19, range: 0.8, color: '#00ff88', category: 'SHORT_RANGE' },
  { id: 'spyder-phalodi', name: 'Spyder (Phalodi)', lat: 27.25, lng: 72.53, range: 0.35, color: '#00ff88', category: 'SHORT_RANGE' },
  { id: 'akash-amritsar', name: 'Akash (Amritsar)', lat: 31.71, lng: 74.80, range: 0.8, color: '#00ff88', category: 'SHORT_RANGE' },
  { id: 'akash-srinagar', name: 'Akash (Srinagar)', lat: 34.00, lng: 74.80, range: 0.8, color: '#00ff88', category: 'SHORT_RANGE' },
  { id: 'spyder-srinagar', name: 'Spyder (Srinagar)', lat: 34.02, lng: 74.82, range: 0.35, color: '#00ff88', category: 'SHORT_RANGE' },
  { id: 'qrsam-jammu', name: 'QRSAM (Jammu)', lat: 32.69, lng: 74.84, range: 0.3, color: '#00ff88', category: 'SHORT_RANGE' },

  // Complementary systems in key cities/bases
  { id: 'akash-delhi', name: 'Akash (New Delhi)', lat: 28.60, lng: 77.20, range: 0.8, color: '#00ff88', category: 'SHORT_RANGE' },
  { id: 'spyder-delhi', name: 'Spyder (New Delhi)', lat: 28.58, lng: 77.10, range: 0.35, color: '#00ff88', category: 'SHORT_RANGE' },
  { id: 'akash-mumbai', name: 'Akash (Mumbai)', lat: 19.00, lng: 72.80, range: 0.8, color: '#00ff88', category: 'SHORT_RANGE' },
  { id: 'spyder-mumbai', name: 'Spyder (Mumbai)', lat: 19.05, lng: 72.85, range: 0.35, color: '#00ff88', category: 'SHORT_RANGE' },
  { id: 'akash-jodhpur', name: 'Akash (Jodhpur)', lat: 26.25, lng: 73.05, range: 0.8, color: '#00ff88', category: 'SHORT_RANGE' },
  { id: 'spyder-jodhpur', name: 'Spyder (Jodhpur)', lat: 26.20, lng: 73.00, range: 0.35, color: '#00ff88', category: 'SHORT_RANGE' },
  { id: 'akash-pathankot', name: 'Akash (Pathankot)', lat: 32.25, lng: 75.60, range: 0.8, color: '#00ff88', category: 'SHORT_RANGE' },
  { id: 'qrsam-jaisalmer', name: 'QRSAM (Jaisalmer)', lat: 26.87, lng: 70.82, range: 0.3, color: '#00ff88', category: 'SHORT_RANGE' },
  { id: 'spyder-ambala', name: 'Spyder (Ambala)', lat: 30.40, lng: 76.80, range: 0.35, color: '#00ff88', category: 'SHORT_RANGE' },
];

// ---- 3D Components ----
function latLngTo3D(lat: number, lng: number, scale: number = 1): [number, number, number] {
  const x = (lng - 78.5) * scale * 0.8;
  const z = -(lat - 22) * scale * 0.8;
  return [x, 0.01, z];
}

function IndiaOutline() {
  const points = useMemo(() => {
    return INDIA_OUTLINE.map(([lng, lat]) => {
      const [x, , z] = latLngTo3D(lat, lng);
      return new THREE.Vector3(x, 0.02, z);
    });
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  return (
    <line>
      <bufferGeometry attach="geometry" {...geometry} />
      <lineBasicMaterial attach="material" color="#00ff88" opacity={0.4} transparent linewidth={2} />
    </line>
  );
}

function GridFloor() {
  return (
    <gridHelper args={[40, 40, '#00ff88', '#00ff8810']} position={[0, 0, 0]} />
  );
}

function StrategicZone({ zone }: { zone: typeof STRATEGIC_ZONES[0] }) {
  const [hovered, setHovered] = useState(false);
  const [x, , z] = latLngTo3D(zone.lat, zone.lng);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group position={[x, 0, z]}>
      {/* Zone marker */}
      <mesh
        ref={meshRef}
        position={[0, 0.3, 0]}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <octahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial
          color={zone.color}
          emissive={zone.color}
          emissiveIntensity={hovered ? 0.8 : 0.3}
          transparent
          opacity={0.9}
        />
      </mesh>
      {/* Label */}
      {hovered && (
        <Html position={[0, 0.8, 0]} center>
          <div className="px-3 py-2 rounded-lg bg-[#111827]/95 border border-white/10 backdrop-blur-sm whitespace-nowrap">
            <div className="text-xs font-bold text-white">{zone.name}</div>
            <div className="text-[10px] text-[#6b7280]">{zone.type} • Value: {zone.value}</div>
          </div>
        </Html>
      )}
      {/* Base circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[zone.radius * 0.08, zone.radius * 0.1, 32]} />
        <meshBasicMaterial color={zone.color} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function DefenceCoverage({ system }: { system: typeof DEFENCE_PLACEMENTS[0] }) {
  const [x, , z] = latLngTo3D(system.lat, system.lng);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.3;
    }
  });

  return (
    <group position={[x, 0, z]}>
      {/* Coverage circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <circleGeometry args={[system.range, 64]} />
        <meshBasicMaterial color={system.color} transparent opacity={0.06} side={THREE.DoubleSide} />
      </mesh>
      {/* Coverage ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[system.range - 0.05, system.range, 64]} />
        <meshBasicMaterial color={system.color} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
      {/* System marker */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.12, 0.12, 0.12]} />
        <meshStandardMaterial color={system.color} emissive={system.color} emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

function RadarSweep() {
  const sweepRef = useRef<THREE.Mesh>(null);
  
  useFrame((_, delta) => {
    if (sweepRef.current) {
      sweepRef.current.rotation.y += delta * 1.5;
    }
  });

  const [x, , z] = latLngTo3D(28.6, 77.2);
  
  return (
    <group position={[x, 0.03, z]} ref={sweepRef}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[5, 64, 0, 0.3]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function Scene({ showCoverage, showZones }: { showCoverage: boolean; showZones: boolean }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={0.5} />
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#00ff88" />

      <GridFloor />
      <IndiaOutline />
      <RadarSweep />

      {showZones && STRATEGIC_ZONES.map(zone => (
        <StrategicZone key={zone.id} zone={zone} />
      ))}

      {showCoverage && DEFENCE_PLACEMENTS.map(sys => (
        <DefenceCoverage key={sys.id} system={sys} />
      ))}

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={5}
        maxDistance={25}
        target={[0, 0, -2]}
      />
    </>
  );
}

// ---- Main Page ----
export default function MapPage() {
  const [showCoverage, setShowCoverage] = useState(true);
  const [showZones, setShowZones] = useState(true);
  const [selectedLayer, setSelectedLayer] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'3d' | 'simulator'>('3d');

  const [hoverCoord, setHoverCoord] = useState<{x: number, y: number, cx: number, cy: number} | null>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setHoverCoord(null);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    hoverTimerRef.current = setTimeout(() => {
      setHoverCoord({ x, y, cx: e.clientX, cy: e.clientY });
    }, 2000);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setHoverCoord(null);
  };

  return (
    <div className="space-y-4 relative">
      <div className="card p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Interactive Strategy Map</h1>
          <p className="text-sm text-[#6b7280]">3D visualization of air defence coverage — educational approximation</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('3d')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              viewMode === '3d' ? 'bg-[#00ff88] text-[#0a0e17]' : 'bg-white/5 text-[#9ca3af] hover:bg-white/10'
            }`}
          >
            3D Strategy Map
          </button>
          <button
            onClick={() => setViewMode('simulator')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              viewMode === 'simulator' ? 'bg-[#00ff88] text-[#0a0e17]' : 'bg-white/5 text-[#9ca3af] hover:bg-white/10'
            }`}
          >
            2D Simulator Map
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Map Canvas */}
        <div className="lg:col-span-3 card overflow-hidden relative" style={{ height: '600px' }}>
          {viewMode === '3d' ? (
            <>
              <Canvas camera={{ position: [0, 15, 12], fov: 50 }}>
                <Scene showCoverage={showCoverage} showZones={showZones} />
              </Canvas>

              {/* Map Controls Overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <div className="glass rounded-lg p-2 space-y-2">
                  <label className="flex items-center gap-2 text-xs text-[#9ca3af] cursor-pointer">
                    <input type="checkbox" checked={showCoverage} onChange={e => setShowCoverage(e.target.checked)} className="accent-[#00ff88]" />
                    Coverage Layers
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[#9ca3af] cursor-pointer">
                    <input type="checkbox" checked={showZones} onChange={e => setShowZones(e.target.checked)} className="accent-[#00ff88]" />
                    Strategic Zones
                  </label>
                </div>
              </div>

              {/* Info overlay */}
              <div className="absolute bottom-4 left-4 glass rounded-lg px-3 py-2">
                <div className="text-[10px] text-[#4b5563]">Drag to rotate • Scroll to zoom • Right-click to pan</div>
              </div>
            </>
          ) : (
            <div 
              className="w-full h-full bg-[#070b12] relative cursor-crosshair overflow-hidden"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Simulator Grid */}
              <div className="absolute inset-x-0 top-0 h-4 border-b border-[#00ff88]/30 flex justify-between px-2 text-[10px] text-[#00ff88] font-mono">
                <span>X: 0</span>
                <span>X: 50</span>
                <span>X: 100</span>
              </div>
              <div className="absolute inset-y-0 left-0 w-4 border-r border-[#00ff88]/30 flex flex-col justify-between py-2 text-[10px] text-[#00ff88] font-mono items-center" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}>
                <span>Y: 0</span>
                <span>Y: 50</span>
                <span>Y: 100</span>
              </div>
              
              {/* Grid lines */}
              <div className="absolute inset-0" style={{
                backgroundImage: 'linear-gradient(to right, rgba(0, 255, 136, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 255, 136, 0.05) 1px, transparent 1px)',
                backgroundSize: '10% 10%'
              }} />

              {/* Center HQ */}
              <div className="absolute top-[80%] left-[50%] w-3 h-3 bg-[#00ff88] rounded-full -translate-x-1/2 -translate-y-1/2 border-2 border-[#0a0e17] shadow-[0_0_10px_#00ff88]" />
              <div className="absolute top-[80%] left-[50%] -translate-x-1/2 mt-2 text-[10px] font-mono text-[#00ff88]">HQ (50, 80)</div>

              {/* Defender Placements in 2D Map (Approximation for context) */}
              {DEFENCE_PLACEMENTS.map(sys => {
                const x = 30 + Math.random() * 40; // Approx spread
                const y = 40 + Math.random() * 30;
                return (
                  <div key={sys.id} className="absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2"
                       style={{ top: `${y}%`, left: `${x}%`, backgroundColor: sys.color }}>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[8px] font-mono whitespace-nowrap opacity-50" style={{ color: sys.color }}>
                      {sys.name.split(' ')[0]}
                    </div>
                  </div>
                );
              })}

              <div className="absolute bottom-4 left-6 glass rounded-lg px-3 py-2">
                <div className="text-[10px] text-[#00ff88] font-mono">2D SIMULATOR COORDINATE SYSTEM ACTIVE</div>
                <div className="text-[9px] text-[#4b5563]">Hover any point for 2s to extract coordinates.</div>
              </div>
            </div>
          )}
        </div>

        {/* Side Panel */}
        <div className="space-y-4">
          {/* Layer Filter */}
          <div className="card p-4">
            <h3 className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-3">Defence Layers</h3>
            <div className="space-y-2">
              {[
                { value: 'all', label: 'All Layers', color: '#e5e7eb' },
                { value: 'LONG_RANGE', label: 'Long Range', color: '#ef4444' },
                { value: 'MEDIUM_RANGE', label: 'Medium Range', color: '#f59e0b' },
                { value: 'SHORT_RANGE', label: 'Short Range', color: '#00ff88' },
              ].map(layer => (
                <button
                  key={layer.value}
                  onClick={() => setSelectedLayer(layer.value)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
                    selectedLayer === layer.value ? 'bg-white/[0.06]' : 'hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: layer.color }} />
                  <span style={{ color: selectedLayer === layer.value ? layer.color : '#9ca3af' }}>{layer.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Deployed Systems */}
          <div className="card p-4">
            <h3 className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-3">Deployed Systems</h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {DEFENCE_PLACEMENTS.map(sys => (
                <div key={sys.id} className="flex items-center gap-2 p-2 rounded hover:bg-white/[0.03] transition-colors">
                  <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: sys.color }} />
                  <div className="flex-1">
                    <div className="text-xs text-[#e5e7eb]">{sys.name}</div>
                    <div className="text-[10px] text-[#4b5563]">Range: {sys.range * 100}km</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Zones */}
          <div className="card p-4">
            <h3 className="text-xs font-semibold text-[#9ca3af] uppercase tracking-wider mb-3">Key Zones</h3>
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {STRATEGIC_ZONES.map(zone => (
                <div key={zone.id} className="flex items-center justify-between p-2 rounded hover:bg-white/[0.03] transition-colors">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: zone.color }} />
                    <span className="text-xs text-[#e5e7eb]">{zone.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#6b7280]">{zone.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* 2s Hover Coordinate Tooltip */}
      {hoverCoord && (
        <div 
          className="fixed z-50 pointer-events-none bg-[#0a0e17] border border-[#00ff88] text-[#00ff88] px-2 py-1 rounded text-xs font-mono shadow-[0_0_10px_rgba(0,255,136,0.3)] animate-fade-in-up"
          style={{ top: hoverCoord.cy + 15, left: hoverCoord.cx + 15 }}
        >
          Coordinates: ({hoverCoord.x}, {hoverCoord.y})
        </div>
      )}
    </div>
  );
}
