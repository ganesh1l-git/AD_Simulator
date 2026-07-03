'use client';

import { useState, useMemo } from 'react';
import mergedDefenders from '../simulation/new/merged_defence_catalog.json';
import mergedAttackers from '../simulation/new/merged_threat_catalog.json';

// Rich historical and operational manuals lookup map to inject detailed educational data
// for simulator assets when viewed in the encyclopedia.
interface EnrichmentData {
  description: string;
  history: string;
  achievements: string;
  breakthrough: string;
}

const NARRATIVE_OVERLAYS: Record<string, EnrichmentData> = {
  // --- DEFENDER SYSTEMS ---
  'S-400': {
    description: 'Premier mobile long-range surface-to-air missile system. Provides layered airspace denial against aircraft, cruise missiles, and medium-range ballistic targets.',
    history: 'Developed by Almaz-Antey (Russia) in the 1990s as an upgrade to the S-300 PMU series. Entered Russian service in 2007. India signed a $5.4B contract for 5 regiments in 2018; deliveries began in 2021.',
    achievements: 'Operational in major conflicts, serving as the core of Russia\'s A2/AD (Anti-Access/Area-Denial) zones in Kaliningrad, Crimea, and Syria. Deployed by India along northern and western borders.',
    breakthrough: 'Features target-selection and guidance automation. Capable of firing the 40N6E active radar interceptor, enabling "over-the-horizon" target destruction by using active radar terminal locks.'
  },
  'Patriot': {
    description: 'Highly mobile, combat-proven air and missile defence system. Designed to intercept tactical ballistic missiles, advanced cruise missiles, and aircraft.',
    history: 'Developed by Raytheon (USA), entering service in 1984. Heavily upgraded under the PAC-2 and PAC-3 programs. Deployed by the US, NATO partners, Japan, South Korea, and Saudi Arabia.',
    achievements: 'Achieved first-ever ballistic missile interception during the 1991 Gulf War. Used extensively in the Middle East to intercept Houthi-fired ballistic missiles and in Ukraine with highly documented intercepts of supersonic and hypersonic targets.',
    breakthrough: 'Integration of the PAC-3 MSE (Missile Segment Enhancement) with Hit-To-Kill (HTK) technology, utilizing kinetic energy instead of a blast-fragmentation warhead to destroy incoming targets.'
  },
  'THAAD': {
    description: 'Terminal High Altitude Area Defense system. Specialized in exoatmospheric interception of short, medium, and intermediate-range ballistic missiles in their terminal phase.',
    history: 'Developed by Lockheed Martin (USA) in response to Scud missile threats in the Gulf War. Entered service in 2008. Deployed in Guam, South Korea, Hawaii, and Israel.',
    achievements: 'Maintains a perfect 100% intercept record during developmental and operational testing. First operational combat intercept occurred in early 2022 in the UAE against incoming ballistic missiles.',
    breakthrough: 'Operates the AN/TPY-2 X-band radar, one of the most powerful mobile radars in the world, enabling target classification and track data sharing across Patriot and Aegis batteries.'
  },
  'MRSAM': {
    description: 'Medium-Range Surface-to-Air Missile system. Jointly developed by India (DRDO) and Israel (IAI) to protect land and naval units from aircraft, helicopters, cruise missiles, and UAVs.',
    history: 'Born out of a collaborative agreement between India and Israel in the mid-2000s. Known as MRSAM in the Indian Air Force/Army, and Barak-8 in the Navy and Israel Defense Forces.',
    achievements: 'Fully integrated across all modern Indian Navy front-line warships (Kolkata, Visakhapatnam classes) and operationalized by the Indian Air Force and Army in key sectors.',
    breakthrough: 'Employs an advanced dual-pulse rocket motor coupled with an active RF terminal seeker, giving the missile extreme maneuverability (high-G turns) during the terminal intercept phase.'
  },
  'Barak': {
    description: 'Surface-to-air missile system designed to defend naval assets and land bases against supersonic cruise missiles, fighter jets, and low-altitude guided weapons.',
    history: 'Developed by Israel Aerospace Industries (IAI) and RAFAEL. Evolved from the point-defence Barak-1 to the medium-range Barak-8 and the long-range Barak-8 ER (Extended Range).',
    achievements: 'Operational in the Israeli Navy, Indian Armed Forces, and exported to Azerbaijan, where it logged successful intercepts of tactical ballistic missiles.',
    breakthrough: 'Uses vertical launch canisters with 360-degree coverage, combined with the MF-STAR Active Electronically Scanned Array (AESA) radar for multi-target tracking.'
  },
  'Akash': {
    description: 'Short-to-medium range surface-to-air missile system developed in India. Designed to protect mobile army formations and air force installations.',
    history: 'Developed by DRDO under the Integrated Guided Missile Development Programme (IGMDP) starting in the 1980s. Entered service in 2015 after extensive trials.',
    achievements: 'Served as India\'s primary medium-range SAM for over a decade. Exported to Armenia in 2023, marking a milestone in Indian defence manufacturing.',
    breakthrough: 'Utilizes a unique solid-fueled ramjet propulsion system, which allows the missile to maintain high velocity throughout its flight envelope without thrust decay.'
  },
  'IRIS-T': {
    description: 'Highly advanced medium-range air defence system. Highly effective against cruise missiles, fighter jets, and low-flying drone arrays.',
    history: 'Developed by Diehl Defence (Germany). Ground-based variant (IRIS-T SLM) entered production in the 2010s. Deployed in Ukraine in 2022 as one of their primary anti-cruise missile shields.',
    achievements: 'Achieved an interception rate exceeding 95% under intense combat conditions in Ukraine, neutralizing cruise missiles and loitering munitions with high reliability.',
    breakthrough: 'Equipped with a highly sensitive imaging infrared (IIR) terminal seeker, allowing it to ignore electronic jamming and flare countermeasures.'
  },
  'Pantsir': {
    description: 'Combined short-range surface-to-air missile and anti-aircraft artillery system. Designed to protect point installations from low-flying cruise missiles, aircraft, and UAVs.',
    history: 'Developed by KBP Instrument Design Bureau (Russia) in the 1990s as the successor to the Tunguska system. Operationalized in 2003.',
    achievements: 'Deployed extensively in Syria and Ukraine. Used by Russia and various Middle Eastern export partners to intercept tactical drones and guided munitions.',
    breakthrough: 'Integrates two rapid-fire 30mm auto-cannons with 12 radio-command guided missiles on a single mobile chassis, providing dual-layer point interception.'
  },
  'Iron Dome': {
    description: 'Mobile all-weather air defence system. Designed to intercept short-range rockets, artillery shells, and mortar rounds.',
    history: 'Developed by Rafael Advanced Defense Systems (Israel) in the late 2000s to counter rocket attacks. Entered service in 2011.',
    achievements: 'Successfully intercepted over 4,000 rockets with an interception rate of 90-95% during various border conflicts, preventing extensive civilian casualties.',
    breakthrough: 'Utilizes the Tamir interceptor equipped with proximity fuzing and dynamic trajectory steering guided by EL/M-2084 active radar tracking.'
  },
  'HQ-9': {
    description: 'Long-range semi-active/active radar homing surface-to-air missile system. Provides theater-level air and missile defence.',
    history: 'Developed by CASIC (China) starting in the 1980s, heavily influenced by Russian S-300 and American Patriot design concepts. HQ-9P is the export variant supplied to Pakistan.',
    achievements: 'Forms the backbone of China\'s domestic area defence network and is deployed on Type 052D/055 naval destroyers. Entered Pakistan Army service in 2021.',
    breakthrough: 'First Chinese SAM system to implement a phased-array radar system capable of tracking up to 100 targets and engaging 6 simultaneously.'
  },

  // --- ATTACKER SYSTEMS ---
  'JF-17': {
    description: 'Lightweight, single-engine, multi-role combat aircraft. Developed to perform air-to-ground strike and air-to-air interception roles.',
    history: 'Jointly developed by the Pakistan Aeronautical Complex (PAC) and Chengdu Aircraft Corporation (CAC) of China. First flight in 2003, with Block III entering production in 2020.',
    achievements: 'Serves as the workhorse of the Pakistan Air Force (PAF). Participated in Border operations, claiming aerial victories and conducting stand-off guided strikes.',
    breakthrough: 'Block III integrates the KLJ-7A Active Electronically Scanned Array (AESA) radar, a helmet-mounted display (HMD), and compatibility with the PL-15 long-range air-to-air missile.'
  },
  'F-16': {
    description: 'Highly maneuverable, single-engine multi-role fighter jet. Capable of executing diverse air superiority, strike, and SEAD (Suppression of Enemy Air Defences) missions.',
    history: 'Developed by General Dynamics (USA) in the 1970s. Over 4,600 units built and operated by 25 nations. Pakistan acquired its first batch in 1983.',
    achievements: 'Accumulated over 70 aerial combat victories globally with zero losses. Used extensively by Pakistan in strike operations and border defense.',
    breakthrough: 'Evolution to the Block 52+ standard introduced conformal fuel tanks (CFTs) for extended strike ranges, advanced AN/APG-68(V)9 radar, and satellite-guided weapon integration.'
  },
  'J-20': {
    description: 'Fifth-generation, twin-engine stealth fighter aircraft. Optimized for long-range air superiority and precision intercept missions.',
    history: 'Developed by Chengdu Aerospace Corporation (China). First flight in 2011, entered operational service with the PLAAF in 2017.',
    achievements: 'Established China as the second nation to deploy an operational indigenous stealth fighter. Routinely patrols the East and South China Seas.',
    breakthrough: 'Incorporates stealth coatings, internal weapon bays, active sensor fusion via AESA radar, electro-optical targeting systems (EOTS), and passive infrared tracking.'
  },
  'Rafale': {
    description: 'Twin-engine, delta-wing multi-role "omnirole" combat aircraft. Capable of performing air defense, deep strike, anti-ship, and nuclear deterrence missions.',
    history: 'Developed by Dassault Aviation (France) after exiting the Eurofighter program. Entered service in 2001. Acquired by India (36 units) in 2016.',
    achievements: 'Proven in combat operations over Afghanistan, Libya, Iraq, and Mali. Serves as a premier strategic platform for both France and the IAF.',
    breakthrough: 'Features the RBE2 AESA radar integrated with the SPECTRA electronic warfare suite, allowing target jamming and stealth penetration.'
  },
  'Su-30MKI': {
    description: 'Heavy, twin-engine multi-role air superiority fighter. Features thrust-vectoring engines and canards for high maneuverability.',
    history: 'Custom variant of the Su-30 developed by Sukhoi (Russia) specifically for the Indian Air Force and manufactured under license by HAL since 2002.',
    achievements: 'Forms the operational backbone of the Indian Air Force with over 260 aircraft in service. Successfully modified to launch the BrahMos-A supersonic cruise missile.',
    breakthrough: 'Integrated the N011M Bars passive electronically scanned array (PESA) radar, combining Russian airframe design with French, Israeli, and Indian avionics.'
  },
  'BrahMos': {
    description: 'Medium-range ramjet supersonic cruise missile. Capable of being launched from submarines, ships, aircraft, or land-based mobile platforms.',
    history: 'Developed as a joint venture between India\'s DRDO and Russia\'s NPO Mashinostroyeniya, based on the P-800 Oniks cruise missile technology.',
    achievements: 'Widely cited as the world\'s fastest operational anti-ship and land-attack cruise missile. Exported to the Philippines in 2024.',
    breakthrough: 'Propelled by a solid propellant booster stage followed by a liquid ramjet engine, maintaining a continuous speed of Mach 3.0 throughout its flight profile.'
  }
};

const getCountryName = (c: string): string => {
  const mapping: Record<string, string> = {
    'india': 'India',
    'pakistan': 'Pakistan',
    'usa': 'USA',
    'china': 'China',
    'russia': 'Russia',
    'japan': 'Japan',
    'south_korea': 'South Korea',
    'uk': 'UK',
    'france': 'France',
    'germany': 'Germany',
    'generic': 'Generic'
  };
  return mapping[c.toLowerCase()] || c.charAt(0).toUpperCase() + c.slice(1);
};

const getCategoryLabel = (cat: string): string => {
  return cat.replace('_', ' ');
};

export default function EncyclopediaPage() {
  const [activeTab, setActiveTab] = useState<'defenders' | 'attackers' | 'munitions'>('defenders');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [selectedMunition, setSelectedMunition] = useState<any | null>(null);

  // 1. Process and Merge Defenders
  const defendersList = useMemo(() => {
    return mergedDefenders.map((sys: any) => {
      const matchKey = Object.keys(NARRATIVE_OVERLAYS).find(k => sys.name.includes(k));
      const details = matchKey ? NARRATIVE_OVERLAYS[matchKey] : {
        description: `Operational ${sys.category.toLowerCase().replace('_', ' ')} air defence unit. Part of the local national air shield network, operating radar and launch batteries.`,
        history: `Developed to meet requirements for modern layered air space denial. Integrated into regional command defense nodes.`,
        achievements: `Successfully evaluated in combat exercises. Serves as a primary protective asset against air threats.`,
        breakthrough: `Utilizes mobile missile transport-erector-launchers (TEL) coordinated by mobile fire-control radars and command vehicles.`
      };

      const missiles = (sys.missileOptions || []).map((m: any) => ({
        name: m.name,
        type: sys.missileName === m.name ? 'Primary Interceptor' : 'Secondary Interceptor',
        range: `${m.range} km`,
        speed: `Mach ${m.speed}`,
        cost: `$${m.cost} Million`,
        guidance: sys.category === 'RADAR' ? 'N/A' : (m.range > 100 ? 'Active Radar / Inerital' : 'Active/Passive RF Homing'),
        accuracy: `${Math.round(m.accuracy * 100)}%`,
        warhead: m.range > 200 ? '180 kg Blast-Frag' : '60 kg HE-Frag',
        description: m.description
      }));

      const composition = (sys.composition || []).map((c: any) => ({
        name: c.name,
        type: c.type,
        qty: `${c.qty} units`,
        description: `Dedicated tactical component of the ${sys.name} regiment.`
      }));

      return {
        id: sys.id,
        name: sys.name,
        category: getCategoryLabel(sys.category),
        country: getCountryName(sys.country),
        cost: `$${sys.batteryCost}M (Battery Base)`,
        description: details.description,
        history: details.history,
        achievements: details.achievements,
        breakthrough: details.breakthrough,
        isIndian: sys.country === 'india',
        composition,
        missiles
      };
    });
  }, []);

  // 2. Process and Merge Attackers (Threat platforms)
  const attackersList = useMemo(() => {
    return mergedAttackers.map((t: any) => {
      const matchKey = Object.keys(NARRATIVE_OVERLAYS).find(k => t.name.includes(k));
      const details = matchKey ? NARRATIVE_OVERLAYS[matchKey] : {
        description: `Operational ${t.type.toLowerCase()} strike asset. Equipped for tactical weapon delivery, strategic penetration, or target designation.`,
        history: `Introduced into active service to provide regional standoff engagement capabilities, deep airspace breach, or surveillance.`,
        achievements: `Deployed in defense exercises and border tracking scenarios. Demonstrates capabilities in electronic suppression and high-velocity strikes.`,
        breakthrough: `Integrates advanced aerodynamics or rocket motors, featuring stand-off weapon carriage and flight-control systems.`
      };

      const payloadCarriage = (t.weaponsCatalog || []).map((w: any) => 
        `${w.name} (Max: ${w.maxQty} units, Range: ${w.range}km, Mach ${w.speed})`
      );

      return {
        id: t.id,
        name: t.name,
        category: t.type,
        country: getCountryName(t.country),
        cost: `$${t.cost}M (Base Unit)`,
        description: details.description,
        history: details.history,
        achievements: details.achievements,
        breakthrough: details.breakthrough,
        speed: `Mach ${t.speed}`,
        altitude: `${(t.altitude / 1000).toFixed(1)} km`,
        range: t.type === 'BALLISTIC' ? '1,500+ km' : '800+ km',
        payloadCapacity: t.maxSlots ? `${t.maxSlots} Payload Slots` : 'Internal Payload Only',
        payloadCarriage: payloadCarriage.length > 0 ? payloadCarriage : ['N/A (Built-in Warhead / Munition)'],
        guidance: t.type === 'BALLISTIC' ? 'INS + Satellite Guidance' : 'Laser / EO Tracker / Radar Terminal',
        warhead: t.type === 'BALLISTIC' ? '500 - 1000 kg warhead capability' : '200 - 450 kg warhead capability',
        isIndian: t.country === 'india'
      };
    });
  }, []);

  // 3. Process and Merge Munitions
  const munitionsList = useMemo(() => {
    const list: any[] = [];
    const names = new Set<string>();

    // Extract interceptor missiles
    mergedDefenders.forEach((sys: any) => {
      (sys.missileOptions || []).forEach((m: any) => {
        if (!names.has(m.name)) {
          names.add(m.name);
          list.push({
            name: m.name,
            type: `${sys.name.split(' ')[0]} Interceptor`,
            range: `${m.range} km`,
            speed: `Mach ${m.speed}`,
            cost: `$${m.cost}M`,
            guidance: m.range > 100 ? 'Active Radar + INS' : 'Active RF / IR Terminal Homing',
            accuracy: `${Math.round(m.accuracy * 100)}%`,
            warhead: m.range > 200 ? '180 kg Blast-Frag' : '60 kg HE-Frag',
            description: m.description || `High-speed surface-to-air interceptor.`
          });
        }
      });
    });

    // Extract payloads carried by aircraft
    mergedAttackers.forEach((t: any) => {
      (t.weaponsCatalog || []).forEach((w: any) => {
        if (!names.has(w.name)) {
          names.add(w.name);
          list.push({
            name: w.name,
            type: `${t.name.split(' ')[0]} Payload`,
            range: `${w.range} km`,
            speed: `Mach ${w.speed}`,
            cost: `$${w.cost}M`,
            guidance: w.name.includes('AMRAAM') || w.name.includes('PL-15') ? 'AESA Radar Active Seeker' : 'Laser / GPS + INS',
            accuracy: `${Math.round(w.accuracy * 100)}%`,
            warhead: w.range > 100 ? '250 kg HE' : '45 kg HE-Frag',
            description: `Air-launched tactical strike weapon carried by ${t.name}.`
          });
        }
      });
    });

    return list;
  }, []);

  const filteredDefenders = useMemo(() => {
    const q = search.toLowerCase();
    return defendersList.filter(sys => 
      sys.name.toLowerCase().includes(q) || 
      sys.country.toLowerCase().includes(q) ||
      sys.category.toLowerCase().includes(q)
    );
  }, [search, defendersList]);

  const filteredAttackers = useMemo(() => {
    const q = search.toLowerCase();
    return attackersList.filter(sys => 
      sys.name.toLowerCase().includes(q) || 
      sys.country.toLowerCase().includes(q) ||
      sys.category.toLowerCase().includes(q)
    );
  }, [search, attackersList]);

  const filteredMunitions = useMemo(() => {
    const q = search.toLowerCase();
    return munitionsList.filter(m => 
      m.name.toLowerCase().includes(q) || 
      m.type.toLowerCase().includes(q) ||
      m.guidance.toLowerCase().includes(q)
    );
  }, [search, munitionsList]);

  return (
    <div className="space-y-4">
      {/* Header Panel */}
      <div className="card p-4">
        <h1 className="text-base font-bold text-[#cbd5e1] tracking-wide uppercase font-mono">Military Encyclopedia</h1>
        <p className="text-[11px] text-[#475569] font-mono mt-0.5">
          Comprehensive defense intelligence registry — hardware assets, specifications, operational histories, and engineering breakthroughs
        </p>
      </div>

      {/* Tabs and Search */}
      <div className="card p-3 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          {[
            { id: 'defenders', label: 'DEFENDER SYSTEMS' },
            { id: 'attackers', label: 'ATTACKER PLATFORMS' },
            { id: 'munitions', label: 'MUNITIONS & PAYLOADS' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSearch('');
              }}
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
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder={`Filter ${activeTab} database...`}
          className="input-field max-w-xs text-[11px] py-1.5 font-mono"
        />
      </div>

      {/* DEFENDERS TAB */}
      {activeTab === 'defenders' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredDefenders.map(sys => (
            <div
              key={sys.id}
              onClick={() => setSelectedItem(sys)}
              className="card card-interactive p-4 flex flex-col justify-between hover:border-[rgba(56,189,248,0.2)]"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[12px] font-bold text-white font-mono">{sys.name}</h3>
                  <span className="badge badge-green text-[9px]">{sys.category}</span>
                </div>
                <div className="text-[10px] text-[#64748b] font-mono mb-2">{sys.country} • Cost: {sys.cost}</div>
                <p className="text-[11px] text-[#94a3b8] line-clamp-3 mb-4 leading-relaxed font-sans">{sys.description}</p>
              </div>
              <button className="w-full py-1.5 bg-[#1b2340] text-[#38bdf8] text-[9px] font-mono font-bold tracking-wider hover:bg-[rgba(56,189,248,0.06)] border border-[rgba(56,189,248,0.12)]">
                VIEW SPECIFICATIONS & COMPOSITION
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ATTACKERS TAB */}
      {activeTab === 'attackers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredAttackers.map(sys => (
            <div
              key={sys.id}
              onClick={() => setSelectedItem(sys)}
              className="card card-interactive p-4 flex flex-col justify-between hover:border-[rgba(220,38,38,0.2)]"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-[12px] font-bold text-white font-mono">{sys.name}</h3>
                  <span className="badge badge-red text-[9px]">{sys.category}</span>
                </div>
                <div className="text-[10px] text-[#64748b] font-mono mb-2">{sys.country} • Max Velocity: {sys.speed}</div>
                <p className="text-[11px] text-[#94a3b8] line-clamp-3 mb-4 leading-relaxed font-sans">{sys.description}</p>
              </div>
              <button className="w-full py-1.5 bg-[#1b2340] text-[#dc2626] text-[9px] font-mono font-bold tracking-wider hover:bg-[rgba(220,38,38,0.06)] border border-[rgba(220,38,38,0.12)]">
                VIEW PLATFORM CARRIAGE DETAILS
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MUNITIONS TAB */}
      {activeTab === 'munitions' && (
        <div className="card overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Designation</th>
                <th>Classification</th>
                <th>Velocity</th>
                <th>Range Envelope</th>
                <th>Guidance Type</th>
                <th>Accuracy</th>
                <th>Est. Unit Cost</th>
              </tr>
            </thead>
            <tbody>
              {filteredMunitions.map((m, i) => (
                <tr key={i} className="hover:bg-[rgba(148,163,184,0.02)] cursor-pointer" onClick={() => setSelectedMunition(m)}>
                  <td className="font-bold text-white font-mono">{m.name}</td>
                  <td><span className="badge badge-cyan text-[9px]">{m.type}</span></td>
                  <td className="font-mono text-[11px]">{m.speed}</td>
                  <td className="font-mono text-[11px]">{m.range}</td>
                  <td className="text-[11px] text-[#94a3b8] font-mono">{m.guidance}</td>
                  <td className="font-mono text-[#4ade80] text-[11px] font-bold">{m.accuracy}</td>
                  <td className="font-mono text-[#f59e0b] text-[11px] font-bold">{m.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DETAILED DIALOG MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedItem(null)}>
          <div className="card p-5 max-w-2xl w-full max-h-[85vh] overflow-y-auto animate-fade-in-up space-y-4" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex justify-between items-start border-b border-[rgba(148,163,184,0.08)] pb-2">
              <div>
                <h2 className="text-[14px] font-bold text-white font-mono uppercase tracking-wider">{selectedItem.name}</h2>
                <p className="text-[10px] text-[#64748b] font-mono mt-0.5">{selectedItem.country} • Est. Cost: {selectedItem.cost}</p>
              </div>
              <button onClick={() => setSelectedItem(null)} className="text-[#64748b] hover:text-white font-mono text-sm">✕</button>
            </div>

            {/* Description */}
            <div>
              <span className="text-[9px] font-mono text-[#475569] uppercase tracking-[0.05em]">SYSTEM DESCRIPTION</span>
              <p className="text-[11px] text-[#cbd5e1] leading-relaxed mt-1 font-sans">{selectedItem.description}</p>
            </div>

            {/* Flight parameters for attackers */}
            {selectedItem.speed && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#0b0f19] border border-[rgba(148,163,184,0.06)] p-3 font-mono text-[10px]">
                {[
                  ['Maximum Speed', selectedItem.speed],
                  ['Flight Ceiling', selectedItem.altitude ?? 'N/A'],
                  ['Operational Range', selectedItem.range ?? 'N/A'],
                  ['Payload Capacity', selectedItem.payloadCapacity ?? 'N/A']
                ].map(([label, val]) => (
                  <div key={label}>
                    <div className="text-[8px] text-[#475569] uppercase tracking-[0.05em]">{label}</div>
                    <div className="text-[#cbd5e1] font-bold mt-0.5">{val}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Operational History, Breakthroughs, and Achievements */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-[10px] border-t border-[rgba(148,163,184,0.04)] pt-3">
              <div>
                <div className="text-[8px] text-[#475569] uppercase tracking-[0.05em] font-bold text-white">OPERATIONAL HISTORY</div>
                <p className="text-[#94a3b8] leading-relaxed mt-1 text-[9px] font-sans">{selectedItem.history}</p>
              </div>
              <div>
                <div className="text-[8px] text-[#475569] uppercase tracking-[0.05em] font-bold text-white">OPERATIONAL ACHIEVEMENTS</div>
                <p className="text-[#94a3b8] leading-relaxed mt-1 text-[9px] font-sans">{selectedItem.achievements}</p>
              </div>
              <div>
                <div className="text-[8px] text-[#475569] uppercase tracking-[0.05em] font-bold text-white">TECHNICAL BREAKTHROUGH</div>
                <p className="text-[#94a3b8] leading-relaxed mt-1 text-[9px] font-sans">{selectedItem.breakthrough}</p>
              </div>
            </div>

            {/* Composition Section */}
            {selectedItem.composition && selectedItem.composition.length > 0 && (
              <div className="space-y-1.5 border-t border-[rgba(148,163,184,0.04)] pt-3 font-mono text-[10px]">
                <h4 className="text-[8px] text-[#475569] uppercase tracking-[0.05em] font-bold text-white">Regiment / Battery System Composition</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedItem.composition.map((comp: any, i: number) => (
                    <div key={i} className="p-2 bg-[#0b0f19] border border-[rgba(148,163,184,0.06)]">
                      <div className="flex justify-between items-center font-bold text-[#cbd5e1]">
                        <span>{comp.name}</span>
                        <span className="text-[#4ade80]">{comp.qty}</span>
                      </div>
                      <div className="text-[9px] text-[#64748b] mt-0.5">{comp.type}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ammo options */}
            {selectedItem.missiles && selectedItem.missiles.length > 0 && (
              <div className="space-y-1.5 border-t border-[rgba(148,163,184,0.04)] pt-3 font-mono text-[10px]">
                <h4 className="text-[8px] text-[#475569] uppercase tracking-[0.05em] font-bold text-white">Canisterized Interceptor Ammo Configurations</h4>
                <div className="space-y-2">
                  {selectedItem.missiles.map((mis: any, i: number) => (
                    <div key={i} className="p-2 bg-[#0b0f19] border border-[rgba(148,163,184,0.06)]">
                      <div className="flex justify-between text-[#cbd5e1] font-bold mb-1">
                        <span>{mis.name} — {mis.type}</span>
                        <span className="text-[#f59e0b]">{mis.cost}</span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-[9px] text-[#64748b] mb-1.5">
                        <div>Range: <span className="text-[#cbd5e1]">{mis.range}</span></div>
                        <div>Velocity: <span className="text-[#cbd5e1]">{mis.speed}</span></div>
                        <div>Guidance: <span className="text-[#cbd5e1] truncate">{mis.guidance}</span></div>
                        <div>Accuracy: <span className="text-[#4ade80] font-bold">{mis.accuracy}</span></div>
                      </div>
                      <p className="text-[9px] text-[#94a3b8] font-sans leading-relaxed border-t border-[rgba(148,163,184,0.03)] pt-1">{mis.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payload carriage specifications for combat aircraft */}
            {selectedItem.payloadCarriage && selectedItem.payloadCarriage.length > 0 && selectedItem.payloadCarriage[0] !== 'N/A' && (
              <div className="space-y-1.5 border-t border-[rgba(148,163,184,0.04)] pt-3 font-mono text-[10px]">
                <h4 className="text-[8px] text-[#475569] uppercase tracking-[0.05em] font-bold text-[#dc2626]">Combat Weapon Carriage Specifications</h4>
                <ul className="list-disc pl-4 space-y-0.5 text-[#cbd5e1] text-[9px]">
                  {selectedItem.payloadCarriage.map((payload: string, i: number) => (
                    <li key={i}>{payload}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MUNITIONS DETAIL DIALOG MODAL */}
      {selectedMunition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedMunition(null)}>
          <div className="card p-5 max-w-md w-full animate-fade-in-up space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start border-b border-[rgba(148,163,184,0.08)] pb-2">
              <div>
                <h2 className="text-[13px] font-bold text-white font-mono uppercase tracking-wider">{selectedMunition.name}</h2>
                <p className="text-[10px] text-[#64748b] font-mono mt-0.5">{selectedMunition.type}</p>
              </div>
              <button onClick={() => setSelectedMunition(null)} className="text-[#64748b] hover:text-white font-mono text-sm">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 font-mono text-[10px] bg-[#0b0f19] border border-[rgba(148,163,184,0.06)] p-3">
              <div>
                <span className="text-[#475569] block text-[8px] uppercase tracking-[0.05em]">Velocity</span>
                <span className="text-[#cbd5e1] font-bold mt-0.5">{selectedMunition.speed}</span>
              </div>
              <div>
                <span className="text-[#475569] block text-[8px] uppercase tracking-[0.05em]">Target Envelope</span>
                <span className="text-[#cbd5e1] font-bold mt-0.5">{selectedMunition.range}</span>
              </div>
              <div>
                <span className="text-[#475569] block text-[8px] uppercase tracking-[0.05em]">Guidance Seeker</span>
                <span className="text-[#cbd5e1] font-bold mt-0.5 truncate">{selectedMunition.guidance}</span>
              </div>
              <div>
                <span className="text-[#475569] block text-[8px] uppercase tracking-[0.05em]">Kill Probability</span>
                <span className="text-[#4ade80] font-bold mt-0.5">{selectedMunition.accuracy}</span>
              </div>
              <div>
                <span className="text-[#475569] block text-[8px] uppercase tracking-[0.05em]">Warhead Capacity</span>
                <span className="text-[#cbd5e1] font-bold mt-0.5">{selectedMunition.warhead}</span>
              </div>
              <div>
                <span className="text-[#475569] block text-[8px] uppercase tracking-[0.05em]">Estimated Unit Cost</span>
                <span className="text-[#f59e0b] font-bold mt-0.5">{selectedMunition.cost}</span>
              </div>
            </div>

            <div>
              <span className="text-[8px] font-mono text-[#475569] uppercase tracking-[0.05em]">TACTICAL NOTES & ROLE</span>
              <p className="text-[11px] text-[#cbd5e1] leading-relaxed mt-1 font-sans">{selectedMunition.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
