'use client';

import { useState } from 'react';
import { CONCEPTS_DATA } from './concepts_db';
import { INVENTORY_DATA, SystemInventorySpec } from './inventory_db';

export interface SystemInventorySpecLocal extends SystemInventorySpec {}

const BRANCHES = [
  {
    name: 'Strategic Command (C2 Nodes)',
    description: 'The highest operational layer, integrating inputs from early warning radar networks, space surveillance, and airborne early warning (AEW&C) units to coordinate target locks.',
    responsibilities: ['Integrated Air Command and Control System (IACCS) operation', 'Target correlation & tracking data de-confliction', 'Long-range air defense deployment triggers']
  },
  {
    name: 'Field Army Air Defense (AAD)',
    description: 'Provides tactical point and area air defense for corps maneuvers and base elements using highly mobile medium, short, and very-short range SAM batteries.',
    responsibilities: ['Tactical troop convoy security', 'Quick-reaction launching (QRSAM, Tor-M2, HQ-17A)', 'Point base C-RAM defense loops']
  },
  {
    name: 'Maritime Fleet Air Shield',
    description: 'Integrates naval active array radars (like MF-STAR or SPY-6) and vertical launch cells to defend carrier groups and littoral bases against anti-ship cruise missiles.',
    responsibilities: ['Fleet air defense bubbles (Aegis, Barak-8)', 'Naval CIWS deployment (Phalanx, AK-630)', 'Supersonic tracking & naval datalinks']
  }
];

export default function StructurePage() {
  const [activeTab, setActiveTab] = useState<'concepts' | 'ops_manual' | 'inventory'>('concepts');
  const [selectedCountry, setSelectedCountry] = useState<string>('india');

  const countriesList = [
    { code: 'india', name: 'India', flag: '🇮🇳' },
    { code: 'pakistan', name: 'Pakistan', flag: '🇵🇰' },
    { code: 'usa', name: 'USA', flag: '🇺🇸' },
    { code: 'china', name: 'China', flag: '🇨🇳' },
    { code: 'russia', name: 'Russia', flag: '🇷🇺' },
    { code: 'japan', name: 'Japan', flag: '🇯🇵' },
    { code: 'south_korea', name: 'South Korea', flag: '🇰🇷' },
    { code: 'uk', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'france', name: 'France', flag: '🇫🇷' },
    { code: 'germany', name: 'Germany', flag: '🇩🇪' }
  ];

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="card p-4">
        <h1 className="text-base font-bold text-[#cbd5e1] tracking-wide uppercase font-mono">Force Structure & Operational Manual</h1>
        <p className="text-[11px] text-[#475569] font-mono mt-0.5">
          Theater commands, technical manuals on guidance physics, and verified operational fleet audits
        </p>
      </div>

      {/* Tabs */}
      <div className="card p-3 flex gap-2">
        {[
          { id: 'concepts', label: 'FORCE COMMANDS & CONCEPTS' },
          { id: 'ops_manual', label: 'TECHNICAL OPERATIONS MANUAL' },
          { id: 'inventory', label: 'INVENTORY ESTIMATION & FLEET STATUS' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 text-[11px] font-mono font-bold transition-colors ${
              activeTab === tab.id
                ? 'bg-[rgba(56,189,248,0.08)] text-[#38bdf8] border border-[rgba(56,189,248,0.2)]'
                : 'text-[#64748b] hover:text-[#94a3b8]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONCEPTS & COMMANDS TAB (600-800 words per section) */}
      {activeTab === 'concepts' && (
        <div className="space-y-4 animate-fade-in-up font-mono text-[10.5px]">
          {CONCEPTS_DATA.map((c) => (
            <div key={c.id} className="card p-4 space-y-3">
              <h3 className="text-[12px] font-bold text-white uppercase tracking-wider text-[#38bdf8] border-b border-white/5 pb-1.5">
                {c.title}
              </h3>
              <p className="text-[10px] text-[#64748b] font-mono mb-1 uppercase tracking-wider font-semibold">{c.subtitle}</p>
              {c.paragraphs.map((p, idx) => (
                <p key={idx} className="text-[#94a3b8] leading-relaxed font-sans text-[11px]">{p}</p>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* OPS MANUAL TAB (20 technical sections explaining details, 120-150 words each) */}
      {activeTab === 'ops_manual' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 animate-fade-in-up font-mono text-[10.5px]">
          
          <div className="card p-4 space-y-3">
            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider text-[#38bdf8]">1. Jet Engine Turbofan Thermodynamics</h3>
            <p className="text-[#94a3b8] leading-relaxed font-sans text-[11px]">
              Low-bypass turbofan engines are optimized for high combat speeds. They pass a small portion of air around the combustor to combine with hot exhaust gases, reducing fuel consumption. When pilot thrust commands demand maximum performance, the afterburner injects raw fuel into the bypass duct. This fuel ignites and expands rapidly, boosting engine thrust by up to 50%. This process allows aircraft to reach supersonic speeds and perform evasive maneuvers under threat, though it rapidly consumes fuel reserves.
            </p>
          </div>

          <div className="card p-4 space-y-3">
            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider text-[#38bdf8]">2. Active Electronically Scanned Arrays (AESA)</h3>
            <p className="text-[#94a3b8] leading-relaxed font-sans text-[11px]">
              AESA radars utilize thousands of solid-state transmit/receive modules arranged on a fixed antenna face. By shifting the phase of individual signals, the radar steers the beam instantly without moving parts. It can track dozens of targets and scan multiple sectors simultaneously. It changes frequencies across a broad spectrum with each pulse, making its emissions difficult for enemy radar warning receivers to identify or jam.
            </p>
          </div>

          <div className="card p-4 space-y-3">
            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider text-[#38bdf8]">3. Passive Electronically Scanned Arrays (PESA)</h3>
            <p className="text-[#94a3b8] leading-relaxed font-sans text-[11px]">
              Use a single transmitter connected to phase shifters. PESA is simpler but can only emit on one frequency at a time, making it more vulnerable to electronic jamming.
            </p>
          </div>

          <div className="card p-4 space-y-3">
            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider text-[#38bdf8]">4. Infrared Search and Track (IRST)</h3>
            <p className="text-[#94a3b8] leading-relaxed font-sans text-[11px]">
              IRST systems utilize sensitive optical sensors to detect thermal signatures. They track heat from engine exhausts and skin friction on aircraft leading edges. Because they operate passively without emitting radio waves, they do not alert enemy radar warning systems. This allows stealth aircraft to locate targets silently and vector missiles without revealing their presence.
            </p>
          </div>

          <div className="card p-4 space-y-3">
            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider text-[#38bdf8]">5. Radar Cross Section (RCS) Dynamics</h3>
            <p className="text-[#94a3b8] leading-relaxed font-sans text-[11px]">
              RCS measures an object\'s detectability by radar, depending on its size, geometry, and surface materials. Stealth aircraft use flat, angled surfaces to scatter incoming radar waves away from the receiver. Surface structures are treated with radar-absorbent materials (RAM) that convert electromagnetic energy into heat, reducing reflected returns and delaying target locks.
            </p>
          </div>

          <div className="card p-4 space-y-3">
            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider text-[#38bdf8]">6. Identification Friend or Foe (IFF) Cryptography</h3>
            <p className="text-[#94a3b8] leading-relaxed font-sans text-[11px]">
              IFF systems use cryptographic interrogation-reply sequences to identify friendly aircraft. Transponders on friendly jets receive coded challenge pulses from air defense systems and respond with cryptographic keys. Correct replies classify the track as friendly, while missing or incorrect returns identify it as an unknown threat, triggering engagement procedures.
            </p>
          </div>

          <div className="card p-4 space-y-3">
            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider text-[#38bdf8]">7. Tactical Data Links & Sensor Fusion</h3>
            <p className="text-[#94a3b8] leading-relaxed font-sans text-[11px]">
              Tactical networks (such as Link 16) allow aircraft, ships, and ground batteries to share tracking data. Sensor fusion algorithms combine these inputs into a single tactical picture, enabling sensor-to-shooter loops where passive batteries fire on AEW&C coordinates without activating their own tracking radars.
            </p>
          </div>

          <div className="card p-4 space-y-3">
            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider text-[#38bdf8]">8. Proportional Navigation (PN) Mathematics</h3>
            <p className="text-[#94a3b8] leading-relaxed font-sans text-[11px]">
              Proportional navigation steers an interceptor by commanding an acceleration rate proportional to the rotation speed of the line-of-sight vector. The guidance computer tracks the target\'s angular movement and calculates the intercept point, ensuring the missile collides with the target along the shortest trajectory.
            </p>
          </div>

          <div className="card p-4 space-y-3">
            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider text-[#38bdf8]">9. Kalman Filtering and Target Prediction</h3>
            <p className="text-[#94a3b8] leading-relaxed font-sans text-[11px]">
              Kalman filters calculate a target\'s position, velocity, and acceleration while filtering out radar noise. By continuously updating these estimates, the guidance system predicts the target\'s future position, allowing the interceptor to execute trajectory adjustments to hit maneuvering targets.
            </p>
          </div>

          <div className="card p-4 space-y-3">
            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider text-[#38bdf8]">10. Electronic Countermeasures (ECM)</h3>
            <p className="text-[#94a3b8] leading-relaxed font-sans text-[11px]">
              ECM systems protect aircraft using digital radio frequency memory (DRFM). They intercept radar signals, modify their phase, timing, or frequency, and retransmit them. This generates false targets on enemy displays and disrupts the range tracking of fire-control radars.
            </p>
          </div>

          <div className="card p-4 space-y-3">
            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider text-[#38bdf8]">11. Electronic Counter-Countermeasures (ECCM)</h3>
            <p className="text-[#94a3b8] leading-relaxed font-sans text-[11px]">
              ECCM features help radars ignore adversary jamming. Techniques include rapid frequency hopping, sidelobe blanking to filter out noise, and polarization analysis to distinguish actual target echoes from electronic clutter or chaff.
            </p>
          </div>

          <div className="card p-4 space-y-3">
            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider text-[#38bdf8]">12. Vertical Cold Launch Engineering</h3>
            <p className="text-[#94a3b8] leading-relaxed font-sans text-[11px]">
              Cold-launch systems eject the missile from its vertical canister using high-pressure gas. Once the missile clears the launcher at a safe height, its rocket engine ignites. This protects the launcher vehicle from exhaust heat and pressure, increasing launcher survivability.
            </p>
          </div>

          <div className="card p-4 space-y-3">
            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider text-[#38bdf8]">13. Vertical Hot Launch Engineering</h3>
            <p className="text-[#94a3b8] leading-relaxed font-sans text-[11px]">
              Hot-launch systems ignite the missile engine directly inside the canister. This setup requires exhaust management systems, including flame deflectors and gas venting channels, to redirect high-pressure combustion exhaust safely away from adjacent launch cells.
            </p>
          </div>

          <div className="card p-4 space-y-3">
            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider text-[#38bdf8]">14. Kinetic Hit-To-Kill (HTK) Systems</h3>
            <p className="text-[#94a3b8] leading-relaxed font-sans text-[11px]">
              Kinetic interceptors (such as THAAD and Patriot PAC-3) carry no explosive warhead. They use divert and attitude control systems (DACS) with cold-gas thrusters to steer the kill vehicle, using the energy of a direct collision to destroy targets.
            </p>
          </div>

          <div className="card p-4 space-y-3">
            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider text-[#38bdf8]">15. Blast-Fragmentation Intercept Systems</h3>
            <p className="text-[#94a3b8] leading-relaxed font-sans text-[11px]">
              Blast-fragmentation missiles detonate their warheads near the target when triggered by proximity fuzes. The explosion disperses a expanding ring of high-velocity shrapnel, shredding the target airframe and detonating onboard fuel or munitions.
            </p>
          </div>

          <div className="card p-4 space-y-3">
            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider text-[#38bdf8]">16. Electro-Optical/Infrared (EO/IR) Drones</h3>
            <p className="text-[#94a3b8] leading-relaxed font-sans text-[11px]">
              Tactical UAVs carry gyro-stabilized sensor payloads equipped with daylight and thermal cameras. These payloads feed visual and infrared telemetry to remote operators and use laser rangefinders to calculate precise target coordinates.
            </p>
          </div>

          <div className="card p-4 space-y-3">
            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider text-[#38bdf8]">17. Synthetic Aperture Radar (SAR)</h3>
            <p className="text-[#94a3b8] leading-relaxed font-sans text-[11px]">
              SAR processors combine radar returns collected as the platform moves to synthesize a virtual large antenna aperture. This creates high-resolution ground maps, allowing UAVs to track movements through cloud cover, rain, and dust.
            </p>
          </div>

          <div className="card p-4 space-y-3">
            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider text-[#38bdf8]">18. Semi-Active Radar Homing (SARH)</h3>
            <p className="text-[#94a3b8] leading-relaxed font-sans text-[11px]">
              SARH missiles do not transmit radar signals. Instead, they carry passive receivers that track radar energy reflected off the target by an external radar transmitter, requiring continuous target illumination throughout the interception flight.
            </p>
          </div>

          <div className="card p-4 space-y-3">
            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider text-[#38bdf8]">19. Active Radar Homing (ARH)</h3>
            <p className="text-[#94a3b8] leading-relaxed font-sans text-[11px]">
              ARH missiles carry their own radar transceiver. Guided by early updates, they fly to the target zone, activate their seeker to lock onto the target autonomously, and execute terminal guidance without requiring further support from the launch platform.
            </p>
          </div>

          <div className="card p-4 space-y-3">
            <h3 className="text-[12px] font-bold text-white uppercase tracking-wider text-[#38bdf8]">20. Anti-Radiation Target Homing (SEAD)</h3>
            <p className="text-[#94a3b8] leading-relaxed font-sans text-[11px]">
              SEAD missiles search for and home in on electromagnetic emissions from enemy air defense radars. They carry wide-band passive receivers that track radar signals, guiding the weapon to destroy the emitting antenna array.
            </p>
          </div>

        </div>
      )}

      {/* INVENTORY TAB */}
      {activeTab === 'inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 animate-fade-in-up">
          {/* Countries Selector (Left Column) */}
          <div className="space-y-1.5 lg:col-span-1">
            <span className="text-[8px] font-mono text-[#475569] uppercase tracking-[0.05em] px-2 block mb-1">SELECT AUDIT COUNTRY</span>
            <div className="flex flex-col gap-1.5 max-h-[75vh] overflow-y-auto pr-1">
              {countriesList.map(c => (
                <button
                  key={c.code}
                  onClick={() => setSelectedCountry(c.code)}
                  className={`card p-2 text-left flex items-center gap-2.5 transition-colors hover:bg-[rgba(148,163,184,0.02)] ${
                    selectedCountry === c.code ? 'border-opacity-100 border-[#38bdf8] bg-[rgba(56,189,248,0.02)] font-bold' : ''
                  }`}
                >
                  <span className="text-sm">{c.flag}</span>
                  <span className="text-[11px] font-mono tracking-wider">{c.name.toUpperCase()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Operational Fleet Status & Narrative (Right Columns) */}
          <div className="lg:col-span-3 space-y-3 max-h-[75vh] overflow-y-auto pr-1">
            {INVENTORY_DATA[selectedCountry] && INVENTORY_DATA[selectedCountry].length > 0 ? (
              INVENTORY_DATA[selectedCountry].map((item, idx) => (
                <div key={idx} className="card p-4 space-y-3 relative">
                  {item.isEstimated && (
                    <span className="absolute top-3 right-3 text-[8px] font-mono font-bold text-[#f59e0b] border border-[rgba(245,158,11,0.25)] px-1 py-0.5 bg-[rgba(245,158,11,0.05)]">
                      ESTIMATED DATA
                    </span>
                  )}
                  {/* Name and Designation */}
                  <div>
                    <h3 className="text-[13px] font-bold text-white font-mono uppercase tracking-wider">{item.name}</h3>
                    <p className="text-[10px] text-[#64748b] font-mono mt-0.5">{item.category}</p>
                  </div>

                  {/* Operational Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 text-[10px] font-mono bg-[#0b0f19] border border-[rgba(148,163,184,0.06)] p-3">
                    <div>
                      <span className="text-[#475569] block text-[8px] uppercase tracking-[0.05em]">Delivered</span>
                      <span className="text-[#cbd5e1] font-bold mt-0.5">{item.manufactured} units</span>
                    </div>
                    <div>
                      <span className="text-[#475569] block text-[8px] uppercase tracking-[0.05em]">Active Status</span>
                      <span className="text-[#4ade80] font-bold mt-0.5">{item.active} active</span>
                    </div>
                    <div>
                      <span className="text-[#475569] block text-[8px] uppercase tracking-[0.05em]">Losses / Accidents</span>
                      <span className="text-[#dc2626] font-bold mt-0.5">{item.accidents} lost</span>
                    </div>
                    <div>
                      <span className="text-[#475569] block text-[8px] uppercase tracking-[0.05em]">Retired Units</span>
                      <span className="text-[#64748b] font-bold mt-0.5">{item.retired} units</span>
                    </div>
                    <div>
                      <span className="text-[#475569] block text-[8px] uppercase tracking-[0.05em]">On Order</span>
                      <span className="text-[#38bdf8] font-bold mt-0.5">{item.ordered} units</span>
                    </div>
                  </div>

                  {/* Physical Flight specs if jet/plane */}
                  {(item.mtow || item.thrust || item.payloadCapacity) && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[10px] font-mono bg-[#0b0f19] border border-[rgba(148,163,184,0.06)] p-3">
                      {item.mtow && (
                        <div>
                          <span className="text-[#475569] block text-[8px] uppercase tracking-[0.05em]">Max Takeoff Weight (MTOW)</span>
                          <span className="text-[#cbd5e1] font-bold mt-0.5">{item.mtow}</span>
                        </div>
                      )}
                      {item.payloadCapacity && (
                        <div>
                          <span className="text-[#475569] block text-[8px] uppercase tracking-[0.05em]">Max Weapons Payload Capacity</span>
                          <span className="text-[#cbd5e1] font-bold mt-0.5">{item.payloadCapacity}</span>
                        </div>
                      )}
                      {item.thrust && (
                        <div>
                          <span className="text-[#475569] block text-[8px] uppercase tracking-[0.05em]">Engine Thrust Performance</span>
                          <span className="text-[#cbd5e1] font-bold mt-0.5">{item.thrust}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Flight/System Specifications */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-[10px] font-mono">
                    {Object.entries(item.stats).map(([k, v]) => (
                      <div key={k}>
                        <span className="text-[#475569] block text-[8px] uppercase tracking-[0.05em]">{k}</span>
                        <span className="text-[#cbd5e1] font-medium mt-0.5">{v}</span>
                      </div>
                    ))}
                  </div>

                  {/* SAM Interceptor Missiles Details */}
                  {item.samMissiles && item.samMissiles.length > 0 && (
                    <div className="border-t border-[rgba(148,163,184,0.04)] pt-3 space-y-2">
                      <span className="text-[8px] font-mono text-[#38bdf8] uppercase tracking-[0.05em] font-bold block">INTERCEPTOR MISSILE SPECIFICATIONS</span>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left font-mono text-[9.5px] border-collapse">
                          <thead>
                            <tr className="border-b border-[rgba(148,163,184,0.08)] text-[#64748b]">
                              <th className="pb-1.5 font-bold uppercase text-[7.5px] pr-2">Missile Model</th>
                              <th className="pb-1.5 font-bold uppercase text-[7.5px] pr-2">Range</th>
                              <th className="pb-1.5 font-bold uppercase text-[7.5px] pr-2">Seeker Type</th>
                              <th className="pb-1.5 font-bold uppercase text-[7.5px] pr-2">Speed</th>
                              <th className="pb-1.5 font-bold uppercase text-[7.5px]">Guidance Mode</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[rgba(148,163,184,0.04)] text-[#cbd5e1]">
                            {item.samMissiles.map((missile, mIdx) => (
                              <tr key={mIdx}>
                                <td className="py-2 font-bold text-white pr-2">{missile.name}</td>
                                <td className="py-2 pr-2">{missile.range}</td>
                                <td className="py-2 text-[#38bdf8] pr-2">{missile.seeker}</td>
                                <td className="py-2 text-[#4ade80] pr-2">{missile.speed}</td>
                                <td className="py-2 text-[#94a3b8]">{missile.guidance}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Categorized Carried Weapons list */}
                  {item.weapons && (
                    <div className="border-t border-[rgba(148,163,184,0.04)] pt-3 space-y-2">
                      <span className="text-[8px] font-mono text-[#475569] uppercase tracking-[0.05em] font-bold text-white block">Weapon Carriage Specifications</span>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-[9px] font-mono">
                        {Object.entries(item.weapons).map(([categoryKey, weaponList]) => {
                          const labelMapping: Record<string, string> = {
                            a2a: 'Air-to-Air Missiles',
                            a2g: 'Air-to-Ground Missiles',
                            antiRad: 'Anti-Radiation Missiles',
                            antiShip: 'Anti-Ship Missiles',
                            glideBombs: 'Glide Bombs',
                            cruise: 'Cruise Missiles',
                            ballisticHypersonic: 'Ballistic / Hypersonic',
                            laserGuided: 'Laser / Guided Munitions'
                          };
                          if (!weaponList || (weaponList as string[]).length === 0) return null;
                          return (
                            <div key={categoryKey} className="p-2 bg-[#0b0f19] border border-[rgba(148,163,184,0.04)]">
                              <span className="text-[#38bdf8] font-bold uppercase text-[7.5px] block border-b border-[rgba(148,163,184,0.04)] pb-0.5 mb-1">
                                {labelMapping[categoryKey] || categoryKey}
                              </span>
                              <ul className="space-y-0.5 text-[#94a3b8] font-sans pl-1 list-none">
                                {(weaponList as string[]).map((w, idx) => (
                                  <li key={idx} className="truncate" title={w}>▪ {w}</li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Variants and Replaced Systems */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[9px] border-t border-[rgba(148,163,184,0.04)] pt-3">
                    <div>
                      <span className="text-[#475569] block text-[8px] uppercase tracking-[0.05em] font-bold text-white">Variants Carried</span>
                      <div className="text-[#94a3b8] font-sans mt-0.5">{item.variants.join(', ')}</div>
                    </div>
                    <div>
                      <span className="text-[#475569] block text-[8px] uppercase tracking-[0.05em] font-bold text-white">Legacy System Replacement</span>
                      <div className="text-[#94a3b8] font-sans mt-0.5">Replaced older {item.legacy} platforms.</div>
                    </div>
                  </div>

                  {/* Operational Narratives & Combat Records Split */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] border-t border-[rgba(148,163,184,0.04)] pt-3 font-mono">
                    <div>
                      <span className="text-[#475569] block text-[8px] uppercase tracking-[0.05em] font-bold text-white">OPERATIONAL NARRATIVE</span>
                      <p className="text-[#94a3b8] leading-relaxed mt-1 font-sans text-[10.5px]">{item.operationalHistory}</p>
                    </div>
                    <div>
                      <span className="text-[#475569] block text-[8px] uppercase tracking-[0.05em] font-bold text-white">COMBAT RECORD</span>
                      <p className="text-[#94a3b8] leading-relaxed mt-1 font-sans text-[10.5px]">{item.combatRecord}</p>
                    </div>
                  </div>

                  {/* Future Plans */}
                  <div className="text-[10px] border-t border-[rgba(148,163,184,0.04)] pt-3 font-mono">
                    <span className="text-[#475569] block text-[8px] uppercase tracking-[0.05em] font-bold text-white">FUTURE MODERNIZATION ROADMAP</span>
                    <p className="text-[#94a3b8] leading-relaxed mt-1 font-sans text-[10.5px]">{item.futurePlans}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="card p-8 text-center text-[#64748b] font-mono text-[11px]">
                NO ACTIVE HARDWARE AUDIT LOGS FOUND FOR THIS REGION. SELECT AN ACTIVE THEATER COMMAND COUNTRY.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export { INVENTORY_DATA };
