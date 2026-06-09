'use client';

import { useState, useMemo } from 'react';

// ---- DETAILED EDUCATIONAL DATABASE ----

interface MissileVariant {
  name: string;
  type: string;
  range: string;
  speed: string;
  cost: string;
  guidance: string;
  accuracy: string;
  warhead: string;
  description: string;
}

interface SubComponent {
  name: string;
  type: string;
  description: string;
  qty: string;
}

interface EncyclopediaItem {
  id: string;
  name: string;
  category: string;
  country: string;
  cost: string;
  description: string;
  isIndian: boolean;
  
  // Detailed Military Structure
  composition?: SubComponent[];
  missiles?: MissileVariant[];
  
  // For Launchers (Attacker Platforms)
  speed?: string;
  altitude?: string;
  range?: string;
  payloadCapacity?: string;
  payloadCarriage?: string[];
  guidance?: string;
  warhead?: string;
}

const DEFENDER_SYSTEMS: EncyclopediaItem[] = [
  {
    id: 'def-s400',
    name: 'S-400 Triumf Regiment',
    category: 'LONG_RANGE',
    country: 'Russia/India',
    cost: '$1.0 Billion (Regiment Cost)',
    isIndian: true,
    description: 'Premier mobile long-range surface-to-air missile system. In Indian service, configured as a layered regiment consisting of 2 Battalions (Batteries). Each Battalion operates its own independent surveillance, fire control, and launch vehicle assets to intercept aircraft, cruise missiles, and ballistic targets.',
    composition: [
      { name: '55K6E Command & Control Post', type: 'C2 Vehicle', qty: '1 per Regiment (Central control)', description: 'Central combat management station that coordinates radar feeds and battery assignments.' },
      { name: '91N6E Acquisition Radar (S-band)', type: 'Surveillance Radar', qty: '1 per Regiment', description: 'Panoramic 3D radar with 600km range, tracks up to 300 targets simultaneously.' },
      { name: '92N6E Grave Stone Radar (X-band)', type: 'Fire Control Radar', qty: '2 per Regiment (1 per Battalion)', description: 'Target acquisition and engagement radar with 400km range, guides up to 12 missiles against 6 targets simultaneously.' },
      { name: '5P85TE2 Self-Propelled Launcher', type: 'TEL Vehicle', qty: '8 per Regiment (4 per Battalion / 4 missiles each)', description: 'Launcher trucks, each equipped with 4 ready-to-fire launch canisters containing interceptors.' }
    ],
    missiles: [
      {
        name: '40N6E Ultra Long-Range',
        type: 'Active Radar Homing',
        range: '400 km',
        speed: 'Mach 12.0 (3100 m/s)',
        cost: '$2.5 Million',
        guidance: 'Inertial + Active Radar terminal homing',
        accuracy: '92%',
        warhead: '180 kg Blast Fragmentation',
        description: 'Designed to target high-value airborne assets (AWACS, tankers) and ballistic missiles at extreme range.'
      },
      {
        name: '48N6DM Long-Range',
        type: 'Semi-Active Radar Homing',
        range: '250 km',
        speed: 'Mach 6.0 (2000 m/s)',
        cost: '$1.5 Million',
        guidance: 'Track-Via-Missile (TVM) semi-active guidance',
        accuracy: '88%',
        warhead: '180 kg HE-Frag',
        description: 'The standard heavy interceptor for high-altitude aircraft and supersonic cruise missiles.'
      },
      {
        name: '9M96E2 Medium-Range',
        type: 'Active Radar / Hit-To-Kill',
        range: '120 km',
        speed: 'Mach 4.5 (1500 m/s)',
        cost: '$0.8 Million',
        guidance: 'Active radar terminal seeker with gas-dynamic thrusters',
        accuracy: '85%',
        warhead: '24 kg Directed HE-Frag',
        description: 'Highly agile interceptor designed for kinetic hit-to-kill against maneuvering fighters and cruise missiles.'
      }
    ]
  },
  {
    id: 'def-barak8er',
    name: 'Barak 8 ER SAM Battery',
    category: 'MEDIUM_RANGE',
    country: 'India/Israel',
    cost: '$180 Million (Battery Cost)',
    isIndian: true,
    description: 'Extended Range version of the MRSAM system. Incorporates an active booster stage to extend range to 150km, specifically enhanced for anti-ballistic and high-altitude standoff threat neutralization.',
    composition: [
      { name: 'Mobile Command & Control (MCP)', type: 'C2 Station', qty: '1 per Battery', description: 'Coordinates weapon deployments and tracks target allocations.' },
      { name: 'MF-STAR Multi-Function Radar', type: 'Active AESA Radar (S-band)', qty: '1 per Battery', description: 'Advanced AESA radar capable of tracking low-altitude targets and cruise missiles up to 150km.' },
      { name: 'Vertical Launcher Unit (VLU)', type: 'Launcher Truck (8 cells)', qty: '3 per Battery', description: '8-cell vertical launcher canisters, allowing rapid 360-degree firing of up to 24 missiles.' }
    ],
    missiles: [
      {
        name: 'Barak-8 ER (Extended Range)',
        type: 'Active Radar Homing',
        range: '150 km',
        speed: 'Mach 3.0',
        cost: '$1.2 Million',
        guidance: 'Dual pulse rocket motor + Active RF terminal seeker',
        accuracy: '88%',
        warhead: '60 kg HE-Frag',
        description: 'Equipped with a booster to intercept aircraft and stand-off missiles before launch.'
      }
    ]
  },
  {
    id: 'def-mrsam',
    name: 'MRSAM / Barak-8 Battery',
    category: 'MEDIUM_RANGE',
    country: 'India/Israel',
    cost: '$150 Million (Battery Cost)',
    isIndian: true,
    description: 'Jointly developed by DRDO (India) and IAI (Israel), the Medium Range Surface-to-Air Missile system provides advanced 360-degree defense for ground forces, naval ships, and cities.',
    composition: [
      { name: 'Mobile Command & Control (MCP)', type: 'C2 Station', qty: '1 per Battery', description: 'Coordinates weapon deployments and tracks target allocations.' },
      { name: 'MF-STAR Multi-Function Radar', type: 'Active AESA Radar (S-band)', qty: '1 per Battery', description: 'Advanced AESA radar capable of tracking low-altitude targets and cruise missiles up to 150km.' },
      { name: 'Vertical Launcher Unit (VLU)', type: 'Launcher Truck (8 cells)', qty: '3 per Battery', description: '8-cell vertical launcher canisters, allowing rapid 360-degree firing of up to 24 missiles.' }
    ],
    missiles: [
      {
        name: 'Barak-8 Standard',
        type: 'Active Radar Homing',
        range: '70 km',
        speed: 'Mach 2.0',
        cost: '$1.0 Million',
        guidance: 'Active RF terminal seeker + bidirectional data-link',
        accuracy: '85%',
        warhead: '60 kg HE-Frag',
        description: 'Highly maneuverable interceptor for defending local sectors against low-flying cruise missiles.'
      }
    ]
  },
  {
    id: 'def-akashng',
    name: 'Akash-NG / Akash Battery',
    category: 'MEDIUM_RANGE',
    country: 'India',
    cost: '$50 Million (Battery Cost)',
    isIndian: true,
    description: 'Indigenous surface-to-air defense network. The next-generation (NG) version features active radio frequency seekers and solid propellant rocket motors.',
    composition: [
      { name: 'Battery Command Post (BCP)', type: 'Tactical C2', qty: '1 per Battery', description: 'Manages fire zones and launcher parameters.' },
      { name: '3D Active Electronically Scanned Radar', type: 'PESA/AESA Radar (120km range)', qty: '1 per Battery', description: 'Tracks targets up to 120km and guides missiles simultaneously.' },
      { name: 'Mobile Launcher Unit (ML)', type: 'TEL Trailer (3 cells)', qty: '4 per Battery', description: 'Carries 3 ready-to-fire missiles in containers, total 12 missiles per battery.' }
    ],
    missiles: [
      {
        name: 'Akash-NG Interceptor',
        type: 'Active RF Seeker',
        range: '80 km',
        speed: 'Mach 3.5',
        cost: '$0.3 Million',
        guidance: 'Dual-pulse rocket motor + indigenous active RF seeker',
        accuracy: '85%',
        warhead: '25 kg Pre-fragmented HE',
        description: 'Next-generation solid fuel interceptor with terminal active RF seeker.'
      },
      {
        name: 'Akash Standard',
        type: 'Command Guided',
        range: '30 km',
        speed: 'Mach 2.5',
        cost: '$0.2 Million',
        guidance: 'Command guidance via fire control radar',
        accuracy: '75%',
        warhead: '60 kg HE-Frag',
        description: 'DRDO legacy standard interceptor featuring ramjet propulsion and command tracking.'
      }
    ]
  },
  {
    id: 'def-pechora2m',
    name: 'Pechora-2M SAM Battery',
    category: 'MEDIUM_RANGE',
    country: 'Russia/India',
    cost: '$15 Million (Battery Cost)',
    isIndian: true,
    description: 'Upgraded mobile version of the S-125 Pechora-2M system. Operates upgraded electronic warfare suites and modern command vehicles to extend operational life, targeting medium-altitude tactical aircraft and cruise missiles.',
    composition: [
      { name: 'UNV-2M Command Cabin', type: 'Guidance Cabin', qty: '1 per Battery', description: 'Processes target data and transmits command guidance signals.' },
      { name: 'Pechora-2M 5P73 TEL Launcher', type: 'Launcher Trailer (2 rails)', qty: '4 per Battery', description: '2-rail mobile launchers, providing rapid setup times and deployment mobility.' }
    ],
    missiles: [
      {
        name: '5V27DE Interceptor',
        type: 'Command Guided',
        range: '35 km',
        speed: 'Mach 3.5',
        cost: '$0.1 Million',
        guidance: 'Command guided radio control + optical tracking option',
        accuracy: '72%',
        warhead: '60 kg HE-Frag',
        description: 'Command-guided heavy missile upgraded for Pechora-2M launchers.'
      }
    ]
  },
  {
    id: 'def-qrsam',
    name: 'QRSAM Battery',
    category: 'SHORT_RANGE',
    country: 'India',
    cost: '$20 Million (Battery Cost)',
    isIndian: true,
    description: 'Quick Reaction Surface-to-Air Missile system designed to defend tactical armor columns on the move.',
    composition: [
      { name: 'Battery Surveillance Radar (BSR)', type: '3D AESA Radar (50km range)', qty: '1 per Battery', description: 'Track-on-the-move surveillance system.' },
      { name: 'Battery Multifunction Radar (BMR)', type: 'Engagement Radar (30km range)', qty: '1 per Battery', description: 'Lock-on target radar for engagement guidance.' },
      { name: 'Quick Reaction Launcher (QRL)', type: 'TEL Vehicle (6 cells)', qty: '3 per Battery', description: 'Launcher truck equipped with 6 canister-based quick-launch missiles, total 18 missiles.' }
    ],
    missiles: [
      {
        name: 'QRSAM Missile',
        type: 'Active Radar Homing',
        range: '30 km',
        speed: 'Mach 3.0',
        cost: '$0.15 Million',
        guidance: 'Mid-course inertial + terminal active RF homing',
        accuracy: '82%',
        warhead: '15 kg HE-Frag',
        description: 'Single-stage solid propellant weapon with quick launch, multi-directional reaction capabilities.'
      }
    ]
  },
  {
    id: 'def-spyder',
    name: 'SPYDER SAM Battery',
    category: 'SHORT_RANGE',
    country: 'Israel/India',
    cost: '$80 Million (Battery Cost)',
    isIndian: true,
    description: 'Surface-to-air Python and Derby (SPYDER) mobile air defence battery. Operating highly agile infrared Python-5 and active radar Derby missiles for quick-reaction point defence against cruise missiles, fighter jets, and low-altitude UAVs.',
    composition: [
      { name: 'Mobile Command & Control Post (MCP)', type: 'Tactical C2', qty: '1 per Battery', description: 'Receives air surveillance data and handles weapon assignments.' },
      { name: 'EL/M-2106 ATAR 3D Surveillance Radar', type: 'Surveillance Radar', qty: '1 per Battery', description: 'Tracks up to 60 targets simultaneously at ranges up to 180km.' },
      { name: 'SPYDER Mobile Launcher (Derby/Python-5)', type: 'TEL Launcher (4 rails)', qty: '4 per Battery', description: 'Launcher trucks equipped with 4 ready-to-fire quick launching interceptors.' }
    ],
    missiles: [
      {
        name: 'Derby Interceptor',
        type: 'Active Radar Homing',
        range: '50 km',
        speed: 'Mach 4.0',
        cost: '$0.5 Million',
        guidance: 'Active radar terminal homing + data link',
        accuracy: '82%',
        warhead: '23 kg HE-Frag',
        description: 'Active radar-homing interceptor for SPYDER system, highly effective against maneuvering targets.'
      },
      {
        name: 'Python-5 Interceptor',
        type: 'Dual-band IR/CCD Seeker',
        range: '20 km',
        speed: 'Mach 4.0',
        cost: '$0.3 Million',
        guidance: 'Dual-band IR/CCD imaging seeker + lock-on after launch',
        accuracy: '82%',
        warhead: '11 kg HE-Frag',
        description: 'Infrared-homing point defence missile with full sphere capability and high countermeasure resistance.'
      }
    ]
  },
  {
    id: 'def-iglas',
    name: 'Igla-S MANPADS Team',
    category: 'VERY_SHORT_RANGE',
    country: 'Russia',
    cost: '$1.0 Million (Team Package)',
    isIndian: false,
    description: 'Man-portable short-range air defence weapon system. Deployed by light infantry teams to engage low-flying helicopters, jets, and UAVs.',
    composition: [
      { name: 'Igla-S Launch Grip-stock', type: 'Launcher Tube', qty: '4 per Team', description: 'Shoulder-mounted launch mechanism.' },
      { name: 'Optical Target Pointer', type: 'Target Sight', qty: '4 per Team', description: 'Allows manual locking and thermal visualization.' }
    ],
    missiles: [
      {
        name: 'Igla-S 9M342',
        type: 'Passive Infrared Homing',
        range: '6 km',
        speed: 'Mach 1.5',
        cost: '$0.05 Million',
        guidance: 'Dual-band passive infrared seeker (IR/UV tracking)',
        accuracy: '65%',
        warhead: '2.5 kg HE-Frag with laser fuze',
        description: 'Shoulder-fired infrared tracking missile designed to intercept targets using thermal exhaust signatures.'
      }
    ]
  },
  {
    id: 'def-vshoradmanpad',
    name: 'VSHORAD MANPADS Team',
    category: 'VERY_SHORT_RANGE',
    country: 'India',
    cost: '$0.15 Million (Unit Cost)',
    isIndian: true,
    description: 'Indigenous Very Short Range Air Defence System (VSHORAD) MANPADS developed by DRDO. Deployed by shoulder-fired operators to defend point assets against low-altitude attack helicopters, subsonic cruise missiles, and UAVs using advanced dual-band IR seekers.',
    composition: [
      { name: 'DRDO VSHORAD Launcher', type: 'MANPADS Launcher', qty: '4 per Team', description: 'Indigenous shoulder-fired launching mechanism.' },
      { name: 'Optical Target Acquisition Sight', type: 'Target Scope', qty: '4 per Team', description: 'Visual and thermal acquisition assist sensor.' }
    ],
    missiles: [
      {
        name: 'DRDO VSHORAD',
        type: 'Dual-band IR Seeker',
        range: '6.5 km',
        speed: 'Mach 2.5',
        cost: '$0.08 Million',
        guidance: 'Dual-band passive infrared homing',
        accuracy: '70%',
        warhead: '2.5 kg HE-Frag',
        description: 'Shoulder-fired very short range interceptor developed by DRDO.'
      }
    ]
  },
  {
    id: 'def-arudhra',
    name: 'Arudhra AESA Radar Station',
    category: 'RADAR',
    country: 'India',
    cost: '$100 Million',
    isIndian: true,
    description: 'IAF primary Medium Power Radar. A 4D Active Electronically Scanned Array (AESA) radar providing long-range battlefield monitoring.',
    composition: [
      { name: 'Rotating AESA Antenna Unit', type: 'Radar Array (500km range)', qty: '1 per Station', description: 'Transmits and receives radar beams in S-band.' },
      { name: 'Signal Processing Container', type: 'Tactical Shelter', qty: '1 per Station', description: 'Decodes signals, tracks radar returns, and filters jamming.' }
    ],
    missiles: []
  }
];

const ATTACKER_SYSTEMS: EncyclopediaItem[] = [
  {
    id: 'att-jf17',
    name: 'JF-17 Block III Fighter Jet',
    category: 'FIGHTER',
    country: 'Pakistan/China',
    cost: '$35.0 Million (Unit Cost)',
    isIndian: false,
    description: 'Lightweight multirole fighter aircraft equipped with KLJ-7A AESA radar and integrated ECM jamming systems. Acts as a stand-off weapon carriage platform to deploy precision bombs and cruise missiles.',
    speed: 'Mach 1.6',
    altitude: '15,000 meters',
    range: '1,350 km combat radius',
    payloadCapacity: '3,700 kg payload on 7 hardpoints',
    payloadCarriage: [
      'PL-15E BVRAAM (Active AESA air-to-air, Range 145km) — Up to 4 units',
      'HD-1A Cruise Missile (Supersonic stand-off land-attack, Range 290km) — Up to 2 units',
      'LS-6 Precision Glide Bomb (GPS folded-wing glide bomb, Range 60km) — Up to 4 units',
      'GB-250 Dumb Bomb (Unguided free-fall gravity bomb, Range 2km) — Up to 4 units'
    ]
  },
  {
    id: 'att-wingloong',
    name: 'Wing Loong II UAV',
    category: 'UAV',
    country: 'China',
    cost: '$5.0 Million (Unit Cost)',
    isIndian: false,
    description: 'Medium-Altitude Long-Endurance (MALE) unmanned combat aerial vehicle. Deployed for low-altitude reconnaissance, radar tracking, and precision guided stand-off strikes.',
    speed: 'Mach 0.3 (370 km/h)',
    altitude: '9,000 meters',
    range: '4,000 km ferry range (20-hour endurance)',
    payloadCapacity: '480 kg external weapon load on 6 hardpoints',
    payloadCarriage: [
      'AR-1 Laser-Guided Missile (Semi-active laser tank-buster, Range 8km) — Up to 8 units',
      'FT-9 Precision guided bomb (Small tactical GPS guided bomb, Range 5km) — Up to 6 units',
      'GB-25 Dumb Bomb (Small unguided gravity drop bomb, Range 2km) — Up to 4 units'
    ]
  },
  {
    id: 'att-shaheen3',
    name: 'Shaheen-III MRBM',
    category: 'BALLISTIC',
    country: 'Pakistan',
    cost: '$10.0 Million (Est. Unit Cost)',
    isIndian: false,
    description: 'Solid-fueled Medium-Range Ballistic Missile (MRBM). Deployed to strike strategic infrastructure, flying in a parabolic exo-atmospheric arc before descending at hypersonic speeds.',
    speed: 'Mach 12.0 terminal',
    altitude: 'Apogee up to 120,000 meters (exo-atmospheric)',
    range: '2,750 km',
    guidance: 'Inertial Guidance + GPS/BeiDou satellite navigation',
    warhead: '1,000 kg HE conventional HE-Frag'
  },
  {
    id: 'att-babur3',
    name: 'Babur-3 Cruise Missile',
    category: 'CRUISE',
    country: 'Pakistan',
    cost: '$2.0 Million',
    isIndian: false,
    description: 'Subsonic land-attack cruise missile. Deployed via mobile ground launchers, it flies a low-altitude terrain-hugging trajectory at sea-skimming levels to evade radars.',
    speed: 'Mach 0.8',
    altitude: '50 - 100 meters (Terrain contour matching)',
    range: '450 km',
    guidance: 'TERCOM (Terrain Contour Matching) + DSMAC (Digital Scene Correlation) optical terminal tracking',
    warhead: '450 kg HE conventional'
  },
  {
    id: 'att-hgv',
    name: 'Hypersonic Glide Vehicle (HGV)',
    category: 'HYPERSONIC',
    country: 'Global Threat Class',
    cost: '$15.0 Million',
    isIndian: false,
    description: 'Hypersonic glide weapon. Fired into the upper atmosphere via a booster rocket, it detaches and glides along a non-ballistic atmospheric boundary, performing high-G maneuvers to bypass interceptors.',
    speed: 'Mach 8.0',
    altitude: '35,000 - 45,000 meters',
    range: '1,500 km',
    guidance: 'Satellite-aided inertial + Active radar terminal homing seeker',
    warhead: '500 kg HE conventional armor-penetrating'
  }
];

const MUNITIONS: MissileVariant[] = [
  // Defender Interceptors
  { name: '40N6E SAM', type: 'Ultra Long-Range SAM', range: '400 km', speed: 'Mach 12.0', cost: '$2.5 Million', guidance: 'Active Radar', accuracy: '92%', warhead: '180 kg Blast-Frag', description: 'Used by S-400 for high-altitude AWACS, cruise, and ballistic interception.' },
  { name: '48N6DM SAM', type: 'Long-Range SAM', range: '250 km', speed: 'Mach 6.0', cost: '$1.5 Million', guidance: 'Semi-Active Radar (TVM)', accuracy: '88%', warhead: '180 kg HE-Frag', description: 'Standard heavy missile for S-400 battalions targeting maneuvering aircraft.' },
  { name: '9M96E2 SAM', type: 'Medium-Range Agile SAM', range: '120 km', speed: 'Mach 4.5', cost: '$0.8 Million', guidance: 'Active Radar / Hit-To-Kill', accuracy: '85%', warhead: '24 kg Directed HE-Frag', description: 'Agile interceptor with thruster vectors for kinetic neutralization.' },
  { name: 'Barak-8 ER', type: 'Extended Range SAM', range: '150 km', speed: 'Mach 3.0', cost: '$1.2 Million', guidance: 'Active Radar', accuracy: '88%', warhead: '60 kg HE-Frag', description: 'Used by MRSAM batteries to deny stand-off strikes from fighter jets.' },
  { name: 'Derby Interceptor', type: 'Medium-Range Radar SAM', range: '50 km', speed: 'Mach 4.0', cost: '$0.5 Million', guidance: 'Active Radar Homing', accuracy: '82%', warhead: '23 kg HE-Frag', description: 'Active radar-homing interceptor for SPYDER system, highly effective against maneuvering targets.' },
  { name: 'Python-5 Interceptor', type: 'Short-Range Infrared SAM', range: '20 km', speed: 'Mach 4.0', cost: '$0.3 Million', guidance: 'Dual-band IR/CCD', accuracy: '82%', warhead: '11 kg HE-Frag', description: 'Infrared-homing point defence missile with full sphere capability and high countermeasure resistance.' },
  { name: '5V27DE Interceptor', type: 'Medium-Range Point SAM', range: '35 km', speed: 'Mach 3.5', cost: '$0.1 Million', guidance: 'Command Guided', accuracy: '72%', warhead: '60 kg HE-Frag', description: 'Command-guided heavy missile upgraded for Pechora-2M launchers.' },
  { name: 'DRDO VSHORAD', type: 'Man-Portable VSHORAD', range: '6.5 km', speed: 'Mach 2.5', cost: '$0.08 Million', guidance: 'Dual-band IR Seeker', accuracy: '70%', warhead: '2.5 kg HE-Frag', description: 'Shoulder-fired very short range interceptor developed by DRDO.' },
  { name: 'Akash-NG', type: 'Medium-Range active SAM', range: '80 km', speed: 'Mach 3.5', cost: '$0.3 Million', guidance: 'Active RF Seeker', accuracy: '85%', warhead: '25 kg Pre-fragmented HE', description: 'DRDO next-generation canisterized solid-fuel rocket interceptor.' },
  
  // Attacker Payloads
  { name: 'HD-1A Cruise Missile', type: 'Supersonic Cruise Missile (Jet Payload)', range: '290 km', speed: 'Mach 3.0', cost: '$2.0 Million', guidance: 'Inertial + GPS + Radar Terminal', accuracy: '80%', warhead: '250 kg HE', description: 'Supersonic stand-off weapon launched by fighter jets.' },
  { name: 'PL-15E BVRAAM', type: 'Beyond-Visual-Range Missile (Jet Payload)', range: '145 km', speed: 'Mach 4.0', cost: '$1.0 Million', guidance: 'AESA Active Seeker', accuracy: '85%', warhead: '30 kg HE-Frag', description: 'Long-range air-to-air missile carried by combat aircraft.' },
  { name: 'LS-6 Glide Bomb', type: 'Precision Guided Glide Bomb (Jet Payload)', range: '60 km', speed: 'Mach 0.9', cost: '$0.5 Million', guidance: 'Inertial + GPS', accuracy: '85%', warhead: '440 kg HE', description: 'Heavy satellite-guided bomb with folding wings.' },
  { name: 'GB-250 Dumb Bomb', type: 'Unguided Gravity Bomb (Jet Payload)', range: '2 km', speed: 'Mach 0.8', cost: '$0.05 Million', guidance: 'None (Ballistic drop)', accuracy: '50%', warhead: '250 kg HE', description: 'Unguided free-fall heavy gravity bomb.' },
  { name: 'AR-1 Tactical Rocket', type: 'Laser Guided Rocket (UAV Payload)', range: '8 km', speed: 'Mach 1.1', cost: '$0.2 Million', guidance: 'Semi-active Laser', accuracy: '90%', warhead: '10 kg HE-penetrating', description: 'Precision weapon fired by drones from safe distances.' },
  { name: 'FT-9 Precision Bomb', type: 'GPS Guided Tactical Bomb (UAV Payload)', range: '5 km', speed: 'Mach 0.8', cost: '$0.1 Million', guidance: 'GPS/INS', accuracy: '85%', warhead: '50 kg HE', description: 'Satellite guided tactical bomb carried by UAVs.' },
  { name: 'GB-25 Dumb Bomb', type: 'Unguided Tactical Bomb (UAV Payload)', range: '2 km', speed: 'Mach 0.6', cost: '$0.05 Million', guidance: 'None (Ballistic drop)', accuracy: '50%', warhead: '250 kg HE', description: 'Lightweight unguided gravity bomb for tactical drone release.' }
];

export default function EncyclopediaPage() {
  const [activeTab, setActiveTab] = useState<'defenders' | 'attackers' | 'munitions'>('defenders');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<EncyclopediaItem | null>(null);
  const [selectedMunition, setSelectedMunition] = useState<MissileVariant | null>(null);

  const filteredDefenders = useMemo(() => {
    return DEFENDER_SYSTEMS.filter(sys => {
      const q = search.toLowerCase();
      return sys.name.toLowerCase().includes(q) || sys.country.toLowerCase().includes(q) || sys.description.toLowerCase().includes(q);
    });
  }, [search]);

  const filteredAttackers = useMemo(() => {
    return ATTACKER_SYSTEMS.filter(sys => {
      const q = search.toLowerCase();
      return sys.name.toLowerCase().includes(q) || sys.country.toLowerCase().includes(q) || sys.description.toLowerCase().includes(q);
    });
  }, [search]);

  const filteredMunitions = useMemo(() => {
    return MUNITIONS.filter(m => {
      const q = search.toLowerCase();
      return m.name.toLowerCase().includes(q) || m.type.toLowerCase().includes(q) || m.description.toLowerCase().includes(q);
    });
  }, [search]);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="card p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#00ff88]/5 via-transparent to-[#ef4444]/5" />
        <div className="relative">
          <h1 className="text-2xl font-bold text-white mb-1">Air Defence Encyclopedia</h1>
          <p className="text-sm text-[#6b7280]">
            Detailed structural analysis and munitions catalog of declassified systems.
          </p>
        </div>
      </div>

      {/* Navigation & Search */}
      <div className="card p-4 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          {[
            { id: 'defenders', label: '🛡️ Defender Systems' },
            { id: 'attackers', label: '⚔️ Attacker Platforms' },
            { id: 'munitions', label: '🚀 Munitions & Payloads' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSearch('');
              }}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#00ff88]/15 text-[#00ff88] border border-[#00ff88]/30'
                  : 'text-[#6b7280] hover:text-white'
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
          placeholder={`Search ${activeTab}...`}
          className="input-field max-w-xs text-xs py-1.5"
        />
      </div>

      {/* DEFENDERS TAB */}
      {activeTab === 'defenders' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDefenders.map(sys => (
            <div
              key={sys.id}
              onClick={() => setSelectedItem(sys)}
              className="card card-interactive p-5 flex flex-col justify-between hover:border-[#00ff88]/40"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-bold text-white">{sys.name}</h3>
                  <span className="badge badge-green text-[9px]">{sys.category.replace('_', ' ')}</span>
                </div>
                <div className="text-[10px] text-[#6b7280] mb-3">{sys.country} • Cost: {sys.cost}</div>
                <p className="text-xs text-[#9ca3af] line-clamp-3 mb-4 leading-relaxed">{sys.description}</p>
              </div>
              <button className="w-full py-1.5 rounded bg-[#00ff88]/5 text-[#00ff88] text-[10px] font-bold tracking-wider hover:bg-[#00ff88]/15 border border-[#00ff88]/15">
                VIEW REGIMENT COMPOSITION & AMMO
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ATTACKERS TAB */}
      {activeTab === 'attackers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAttackers.map(sys => (
            <div
              key={sys.id}
              onClick={() => setSelectedItem(sys)}
              className="card card-interactive p-5 flex flex-col justify-between hover:border-[#ef4444]/40"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-bold text-white">{sys.name}</h3>
                  <span className="badge badge-red text-[9px]">{sys.category}</span>
                </div>
                <div className="text-[10px] text-[#6b7280] mb-3">{sys.country} • Max Speed: {sys.speed}</div>
                <p className="text-xs text-[#9ca3af] line-clamp-3 mb-4 leading-relaxed">{sys.description}</p>
              </div>
              <button className="w-full py-1.5 rounded bg-[#ef4444]/5 text-[#ef4444] text-[10px] font-bold tracking-wider hover:bg-[#ef4444]/15 border border-[#ef4444]/15">
                VIEW PLATFORM PAYLOAD SPECIFICATIONS
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
                <th>Munition Name</th>
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
                <tr key={i} className="hover:bg-white/[0.02] cursor-pointer" onClick={() => setSelectedMunition(m)}>
                  <td className="font-bold text-white">{m.name}</td>
                  <td><span className="badge badge-cyan text-[9px]">{m.type}</span></td>
                  <td className="font-mono text-xs">{m.speed}</td>
                  <td className="font-mono text-xs">{m.range}</td>
                  <td className="text-xs">{m.guidance}</td>
                  <td className="font-mono text-[#00ff88] text-xs">{m.accuracy}</td>
                  <td className="font-mono text-[#f59e0b] text-xs">{m.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* REGIMENT / PLATFORM DETAIL MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedItem(null)}>
          <div className="card p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto animate-fade-in-up space-y-6" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="flex justify-between items-start border-b border-white/5 pb-3">
              <div>
                <h2 className="text-lg font-bold text-white">{selectedItem.name}</h2>
                <p className="text-xs text-[#6b7280]">{selectedItem.country} • Procurement Cost: {selectedItem.cost}</p>
              </div>
              <button onClick={() => setSelectedItem(null)} className="text-[#6b7280] hover:text-white text-md">✕</button>
            </div>

            {/* Description */}
            <p className="text-xs text-[#9ca3af] leading-relaxed">{selectedItem.description}</p>

            {/* Flight Performance Parameters (For Jets/Drones/Ballistics) */}
            {selectedItem.speed && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/[0.01] border border-white/5 p-4 rounded-lg">
                {[
                  ['Maximum Speed', selectedItem.speed],
                  ['Flight Ceiling', selectedItem.altitude ?? 'N/A'],
                  ['Operating Range', selectedItem.range ?? 'N/A'],
                  ['Payload Weight/Cap', selectedItem.payloadCapacity ?? 'N/A']
                ].map(([label, val]) => (
                  <div key={label}>
                    <div className="text-[10px] text-[#4b5563] uppercase">{label}</div>
                    <div className="text-xs font-mono font-bold text-[#e5e7eb]">{val}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Missile Guidance & Warhead Specs */}
            {(selectedItem.guidance || selectedItem.warhead) && (
              <div className="grid grid-cols-2 gap-4 bg-white/[0.01] border border-white/5 p-4 rounded-lg">
                {selectedItem.guidance && (
                  <div>
                    <div className="text-[10px] text-[#4b5563] uppercase">Guidance Tech</div>
                    <div className="text-xs font-mono font-bold text-[#e5e7eb]">{selectedItem.guidance}</div>
                  </div>
                )}
                {selectedItem.warhead && (
                  <div>
                    <div className="text-[10px] text-[#4b5563] uppercase">Warhead Payload</div>
                    <div className="text-xs font-mono font-bold text-[#e5e7eb]">{selectedItem.warhead}</div>
                  </div>
                )}
              </div>
            )}

            {/* Jet Carried Payloads List */}
            {selectedItem.payloadCarriage && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#ef4444] uppercase tracking-wider">Deployable Weapon Carriage Configurations</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedItem.payloadCarriage.map((payload, i) => (
                    <div key={i} className="p-2.5 rounded bg-black/30 border border-white/5 text-xs text-white font-mono flex items-center gap-2">
                      <span className="text-[#ef4444]">⚔️</span> {payload}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Regiment Component Breakdown (Defender) */}
            {selectedItem.composition && selectedItem.composition.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#00ff88] uppercase tracking-wider">Regiment & Battery System Composition</h4>
                <div className="space-y-2">
                  {selectedItem.composition.map((comp, i) => (
                    <div key={i} className="p-3 rounded bg-white/[0.01] border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-xs">
                      <div>
                        <div className="font-semibold text-white">{comp.name}</div>
                        <div className="text-[10px] text-[#6b7280]">{comp.type} • {comp.qty}</div>
                        <p className="text-[11px] text-[#4b5563] mt-1">{comp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Guided Missile Options (Defender) */}
            {selectedItem.missiles && selectedItem.missiles.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#00b4d8] uppercase tracking-wider">Ammunition & Interceptor Missile Variants</h4>
                <div className="grid grid-cols-1 gap-3">
                  {selectedItem.missiles.map((missile, i) => (
                    <div key={i} className="p-4 rounded-lg bg-black/40 border border-white/5 space-y-2 text-xs">
                      <div className="flex justify-between items-start border-b border-white/5 pb-2">
                        <div>
                          <div className="font-bold text-[#00b4d8] text-sm">{missile.name}</div>
                          <div className="text-[10px] text-[#6b7280]">{missile.type}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-mono font-bold text-[#00ff88]">{missile.range}</span>
                          <div className="text-[9px] text-[#4b5563]">{missile.cost} each</div>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#9ca3af] leading-relaxed">{missile.description}</p>
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-[10px] font-mono">
                        <div>
                          <span className="text-[#4b5563]">Velocity:</span>
                          <div className="text-[#e5e7eb] font-bold">{missile.speed}</div>
                        </div>
                        <div>
                          <span className="text-[#4b5563]">Guidance:</span>
                          <div className="text-[#e5e7eb] truncate" title={missile.guidance}>{missile.guidance}</div>
                        </div>
                        <div>
                          <span className="text-[#4b5563]">Hit Probability:</span>
                          <div className="text-[#e5e7eb] font-bold">{missile.accuracy}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MUNITIONS DETAIL MODAL */}
      {selectedMunition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedMunition(null)}>
          <div className="card p-6 max-w-md w-full animate-fade-in-up space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start border-b border-white/5 pb-3">
              <div>
                <h2 className="text-lg font-bold text-white">{selectedMunition.name}</h2>
                <p className="text-xs text-[#6b7280]">{selectedMunition.type}</p>
              </div>
              <button onClick={() => setSelectedMunition(null)} className="text-[#6b7280] hover:text-white text-md">✕</button>
            </div>
            
            <p className="text-xs text-[#9ca3af] leading-relaxed">{selectedMunition.description}</p>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              {[
                ['Range Envelope', selectedMunition.range],
                ['Flight Velocity', selectedMunition.speed],
                ['Unit Cost', selectedMunition.cost],
                ['Guidance Tech', selectedMunition.guidance],
                ['Neutralization Rate', selectedMunition.accuracy],
                ['Warhead Configuration', selectedMunition.warhead]
              ].map(([lbl, val]) => (
                <div key={lbl}>
                  <span className="text-[10px] text-[#4b5563] uppercase">{lbl}</span>
                  <div className="text-white font-bold">{val}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
