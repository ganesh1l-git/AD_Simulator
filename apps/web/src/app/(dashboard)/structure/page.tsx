'use client';

const layers = [
  { name: 'Long Range Air Defence (LRAD)', range: '200-400 km', systems: ['S-400 Triumf (5 regiments)'], color: '#ef4444', radius: 85, description: 'Provides area defence against high-altitude threats, ballistic missiles, and aircraft at extreme range. Forms the outermost defensive layer.' },
  { name: 'Medium Range Air Defence (MRAD)', range: '30-100 km', systems: ['MRSAM/Barak-8', 'Akash', 'Akash-NG', 'Akash Prime', 'Pechora-2M'], color: '#f59e0b', radius: 65, description: 'Engages aircraft, cruise missiles, and UAVs at medium range. Provides the primary engagement layer for most aerial threats.' },
  { name: 'Short Range Air Defence (SRAD)', range: '5-30 km', systems: ['QRSAM', 'OSA-AKM', 'Strela-10M3'], color: '#00ff88', radius: 45, description: 'Protects mobile formations and point targets against low-flying threats. Quick reaction capability for close-in defence.' },
  { name: 'Very Short Range AD (VSHORAD)', range: '0.5-8 km', systems: ['Igla-S', 'Mistral', 'RBS-70'], color: '#00b4d8', radius: 25, description: 'Man-portable and vehicle-mounted systems for immediate self-defence. Last line of defence against aircraft, helicopters, and drones.' },
  { name: 'Counter-UAS', range: '0.1-3 km', systems: ['DRDO Anti-Drone System', 'SMASH 2000 Plus'], color: '#a855f7', radius: 12, description: 'Specialized systems to detect, track, and neutralize unmanned aerial threats including small drones and drone swarms.' },
];

const branches = [
  {
    name: 'Indian Air Force — Air Defence',
    icon: '✈️',
    description: 'The IAF is responsible for the overall air defence of India. It operates the Air Defence Ground Environment System (ADGES) and the Integrated Air Command and Control System (IACCS).',
    responsibilities: ['National air defence', 'IACCS operation', 'Long-range SAMs (S-400)', 'Medium-range SAMs (Akash for IAF)', 'Fighter interception', 'Radar network management'],
    color: '#00b4d8',
  },
  {
    name: 'Indian Army — Army Air Defence',
    icon: '🛡️',
    description: 'The Army Air Defence (AAD) branch provides air defence cover for army formations in the field. It operates short-range and very short-range systems to protect ground forces.',
    responsibilities: ['Field army air defence', 'Short-range SAMs (QRSAM, OSA-AKM)', 'VSHORAD (Igla-S, Mistral, RBS-70)', 'Counter-drone operations', 'Point defence of key installations', 'Mobile air defence for advancing formations'],
    color: '#00ff88',
  },
  {
    name: 'Indian Navy — Naval Air Defence',
    icon: '⚓',
    description: 'The Indian Navy operates ship-based air defence systems to protect naval assets and maritime zones. It uses the MRSAM/Barak-8 as its primary long-range naval air defence system.',
    responsibilities: ['Fleet air defence', 'LRSAM/Barak-8 (naval variant)', 'Close-in weapon systems (AK-630, Phalanx)', 'Area air defence for task forces', 'Carrier battle group protection'],
    color: '#f59e0b',
  },
];

const concepts = [
  {
    title: 'Integrated Air Command and Control System (IACCS)',
    description: 'IACCS is the digital backbone of India\'s air defence network. It integrates data from multiple radar systems, SAM batteries, and fighter aircraft into a unified operational picture. This enables faster threat detection, identification, and engagement decisions.',
    icon: '🖥️',
  },
  {
    title: 'Layered Defence Concept',
    description: 'India\'s air defence follows a layered approach where different systems cover overlapping ranges. Long-range systems (S-400) provide the first line of defence, medium-range systems (MRSAM, Akash) provide the second layer, and short/very-short range systems provide point defence.',
    icon: '🎯',
  },
  {
    title: 'Air Defence Identification Zone (ADIZ)',
    description: 'India maintains an ADIZ extending beyond its territorial airspace. All aircraft entering the ADIZ must identify themselves. Unidentified aircraft trigger air defence procedures including fighter scrambles and radar tracking.',
    icon: '📡',
  },
  {
    title: 'Network-Centric Warfare',
    description: 'Modern Indian air defence emphasizes network-centric operations where all sensors and weapons are linked through secure data networks. This allows any sensor to cue any weapon system, dramatically improving response time and effectiveness.',
    icon: '🌐',
  },
];

export default function StructurePage() {
  return (
    <div className="space-y-6">
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/5 via-transparent to-[#00b4d8]/5" />
        <div className="relative">
          <h1 className="text-2xl font-bold text-white mb-1">Indian Air Defence Structure</h1>
          <p className="text-sm text-[#6b7280]">Educational overview based on publicly available information</p>
          <div className="mt-2 badge badge-amber text-[10px]">⚠️ Educational reference only — not operational data</div>
        </div>
      </div>

      {/* Layered Defence Visualization */}
      <div className="card p-6 animate-fade-in-up">
        <h2 className="text-lg font-bold text-white mb-4">Layered Air Defence Concept</h2>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Visual */}
          <div className="flex-shrink-0 w-full lg:w-[300px] aspect-square relative mx-auto">
            {layers.map((layer, i) => (
              <div
                key={layer.name}
                className="absolute rounded-full border-2 border-dashed transition-all hover:border-opacity-100"
                style={{
                  width: `${layer.radius * 2}%`,
                  height: `${layer.radius * 2}%`,
                  top: `${50 - layer.radius}%`,
                  left: `${50 - layer.radius}%`,
                  borderColor: `${layer.color}66`,
                  backgroundColor: `${layer.color}08`,
                }}
                title={layer.name}
              />
            ))}
            {/* Center point */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-[8px] font-bold text-white z-10">
              HVT
            </div>
          </div>

          {/* Legend */}
          <div className="flex-1 space-y-3">
            {layers.map((layer, i) => (
              <div key={layer.name} className="p-3 rounded-lg hover:bg-white/[0.02] transition-colors animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: layer.color, boxShadow: `0 0 8px ${layer.color}` }} />
                  <span className="text-sm font-bold" style={{ color: layer.color }}>{layer.name}</span>
                  <span className="text-xs text-[#4b5563] font-mono">{layer.range}</span>
                </div>
                <p className="text-xs text-[#6b7280] ml-6 mb-1">{layer.description}</p>
                <div className="flex flex-wrap gap-1 ml-6">
                  {layer.systems.map(sys => (
                    <span key={sys} className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] text-[#9ca3af]">{sys}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Branches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {branches.map((branch, i) => (
          <div key={branch.name} className="card p-5 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{branch.icon}</span>
              <h3 className="text-sm font-bold" style={{ color: branch.color }}>{branch.name}</h3>
            </div>
            <p className="text-xs text-[#6b7280] mb-3 leading-relaxed">{branch.description}</p>
            <ul className="space-y-1">
              {branch.responsibilities.map(resp => (
                <li key={resp} className="flex items-center gap-2 text-xs text-[#9ca3af]">
                  <div className="w-1 h-1 rounded-full" style={{ backgroundColor: branch.color }} />
                  {resp}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Key Concepts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {concepts.map((concept, i) => (
          <div key={concept.title} className="card p-5 animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xl">{concept.icon}</span>
              <h3 className="text-sm font-bold text-[#e5e7eb]">{concept.title}</h3>
            </div>
            <p className="text-xs text-[#6b7280] leading-relaxed">{concept.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
