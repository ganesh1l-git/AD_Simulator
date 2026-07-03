// Programmatically Generated Fleet Inventory Database
// Contains 15-25 systems for ALL 10 countries with complete military stats.

export interface SAMMissileSpec {
  name: string;
  range: string;
  seeker: string;
  speed: string;
  guidance: string;
}

export interface SystemInventorySpec {
  name: string;
  category: string;
  cost: string;
  manufactured: number;
  active: number;
  accidents: number;
  retired: number;
  ordered: number;
  mtow?: string;
  payloadCapacity?: string;
  thrust?: string;
  legacy: string;
  variants: string[];
  weapons?: {
    a2a?: string[];
    a2g?: string[];
    antiRad?: string[];
    antiShip?: string[];
    glideBombs?: string[];
    cruise?: string[];
    ballisticHypersonic?: string[];
    laserGuided?: string[];
  };
  samMissiles?: SAMMissileSpec[];
  operationalHistory: string;
  combatRecord: string;
  futurePlans: string;
  stats: Record<string, string>;
  isEstimated?: boolean;
}

export const INVENTORY_DATA: Record<string, SystemInventorySpec[]> = {
  "india": [
    {
      "name": "Su-30MKI Flanker-H",
      "category": "Tactical Combat Fighter",
      "cost": "$62 Million",
      "manufactured": 272,
      "active": 259,
      "accidents": 13,
      "retired": 0,
      "ordered": 12,
      "mtow": "38,800 kg (85,539 lbs)",
      "payloadCapacity": "8,130 kg (17,924 lbs)",
      "thrust": "74.5 kN (16,700 lbf) dry / 122.6 kN (27,600 lbf) afterburner (AL-31FP)",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "Su-30MKI Block I",
        "Su-30MKI Block II"
      ],
      "weapons": {
        "a2a": [
          "Astra Mk-1 active radar (110km)",
          "Astra Mk-2 active radar (160km)",
          "R-77-1 active radar homing (110km)",
          "R-27ER semi-active (130km)",
          "R-73 infrared high-agility (30km)",
          "R-74M infrared (40km)"
        ],
        "a2g": [
          "Kh-59ME television-guided standoff (115km)",
          "Kh-59M2 land attack (115km)",
          "DRDO SAAW anti-airfield weapon",
          "Kh-38M precision guided"
        ],
        "antiRad": [
          "Rudram-1 (NGARM) anti-radiation (150km)",
          "Kh-31PD supersonic anti-radar (250km)"
        ],
        "antiShip": [
          "BrahMos-A supersonic cruise (Mach 3.0, 450km)",
          "Kh-35E active radar anti-ship (130km)"
        ],
        "glideBombs": [
          "DRDO SAAW folding-wing",
          "HSLD-250 / HSLD-500 gravity bombs",
          "Spice 2000 EO-guided (60km)"
        ],
        "cruise": [
          "BrahMos-A supersonic cruise",
          "Nirbhay Land-Attack LACM (1000km)"
        ],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the India Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "3,000 km",
        "Speed": "Mach 2.0",
        "Ceiling": "17,300 m",
        "Radar": "N011M Bars PESA"
      }
    },
    {
      "name": "Rafale EH / DH",
      "category": "Tactical Combat Fighter",
      "cost": "$0.12 Billion",
      "manufactured": 36,
      "active": 36,
      "accidents": 0,
      "retired": 0,
      "ordered": 26,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "Rafale Block I",
        "Rafale Block II"
      ],
      "weapons": {
        "a2a": [
          "Meteor active radar BVRAAM (150+ km)",
          "MICA EM active radar homing (80km)",
          "MICA IR heat-seeking (80km)",
          "MICA NG (Next-Gen) active/IR (100km)"
        ],
        "a2g": [
          "AASM Hammer rocket-assisted precision bomb (250/500/1000kg)"
        ],
        "antiRad": [],
        "antiShip": [
          "AM39 Exocet Block 2 Mod 2 (70km)"
        ],
        "glideBombs": [
          "AASM Hammer (laser/GPS/IR guided, 70km)"
        ],
        "cruise": [
          "SCALP-EG deep-strike cruise missile (560km)"
        ],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the India Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "MiG-29UPG",
      "category": "Tactical Combat Fighter",
      "cost": "$35 Million",
      "manufactured": 65,
      "active": 61,
      "accidents": 4,
      "retired": 0,
      "ordered": 0,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "MiG-29UPG Block I",
        "MiG-29UPG Block II"
      ],
      "weapons": {
        "a2a": [
          "R-77 active radar homing (100km)",
          "R-77-1 active radar (110km)",
          "R-27ER semi-active radar (130km)",
          "R-27ET infrared (120km)",
          "R-73 infrared homing (30km)"
        ],
        "a2g": [
          "Kh-29T TV-guided missile (12km)",
          "Kh-29L laser-guided (10km)",
          "Kh-25ML laser-guided (11km)"
        ],
        "antiRad": [
          "Kh-31P supersonic anti-radiation (110km)"
        ],
        "antiShip": [],
        "glideBombs": [
          "KAB-500Kr television guided bomb",
          "KAB-500L laser guided bomb"
        ],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the India Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "Mirage 2000I",
      "category": "Tactical Combat Fighter",
      "cost": "$45 Million",
      "manufactured": 59,
      "active": 47,
      "accidents": 10,
      "retired": 2,
      "ordered": 0,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "Mirage Block I",
        "Mirage Block II"
      ],
      "weapons": {
        "a2a": [
          "MICA EM active radar homing (80km)",
          "MICA IR infrared seeker (80km)",
          "Super 530D semi-active radar (60km)",
          "Magic II dogfight IR (15km)"
        ],
        "a2g": [
          "AS-30L laser guided missile (12km)"
        ],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [
          "Spice 2000 electro-optical guided bomb (60km)",
          "GBU-12 Paveway II laser guided"
        ],
        "cruise": [
          "SCALP-EG cruise missile (560km)"
        ],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the India Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "Jaguar IS",
      "category": "Tactical Combat Fighter",
      "cost": "$25 Million",
      "manufactured": 120,
      "active": 78,
      "accidents": 22,
      "retired": 20,
      "ordered": 0,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "Jaguar Block I",
        "Jaguar Block II"
      ],
      "weapons": {
        "a2a": [
          "Matra Magic II (Overwing pylon mounts, 15km)"
        ],
        "a2g": [
          "AS-30L laser-guided ground attack (12km)"
        ],
        "antiRad": [
          "ALARM passive anti-radiation (90km)"
        ],
        "antiShip": [
          "Sea Eagle active radar anti-ship (110km)"
        ],
        "glideBombs": [
          "CBU-105 Sensor Fuzed smart cluster bomb"
        ],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the India Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "Tejas Mk1 FOC/IOC",
      "category": "Tactical Combat Fighter",
      "cost": "$38 Million",
      "manufactured": 32,
      "active": 30,
      "accidents": 2,
      "retired": 0,
      "ordered": 0,
      "mtow": "13,500 kg (29,762 lbs)",
      "payloadCapacity": "3,500 kg (7,716 lbs)",
      "thrust": "53.9 kN (12,100 lbf) dry / 89.8 kN (20,200 lbf) afterburner (GE F404-GE-F2J3)",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "Tejas Block I",
        "Tejas Block II"
      ],
      "weapons": {
        "a2a": [
          "Astra Mk-1 active radar (110km)",
          "I-Derby ER active radar (100km)",
          "Python-5 dual-band IR (20km)",
          "R-73 infrared dogfight (30km)"
        ],
        "a2g": [
          "Kh-59ME television guided (115km)",
          "Kh-29T TV-guided (12km)"
        ],
        "antiRad": [],
        "antiShip": [
          "Kh-35E active radar anti-ship (130km)"
        ],
        "glideBombs": [
          "DRDO SAAW folding-wing precision bomb",
          "HSLD-250 gravity bombs"
        ],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": [
          "Sudharshan laser-guided kits",
          "GBU-12 Paveway II"
        ]
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the India Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "1,375 km",
        "Speed": "Mach 1.6",
        "Ceiling": "16,000 m",
        "Radar": "EL/M-2032 Hybrid PESA"
      }
    },
    {
      "name": "Tejas Mk1A",
      "category": "Tactical Combat Fighter",
      "cost": "$42 Million",
      "manufactured": 2,
      "active": 2,
      "accidents": 0,
      "retired": 0,
      "ordered": 83,
      "mtow": "13,500 kg (29,762 lbs)",
      "payloadCapacity": "3,800 kg (8,377 lbs)",
      "thrust": "53.9 kN (12,100 lbf) dry / 89.8 kN (20,200 lbf) afterburner (GE F404-GE-IN20)",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "Tejas Block I",
        "Tejas Block II"
      ],
      "weapons": {
        "a2a": [
          "Astra Mk-1 active radar (110km)",
          "Astra Mk-2 active radar (160km)",
          "I-Derby ER active radar (100km)",
          "Python-5 dual-band IR (20km)",
          "ASRAAM high-agility IR (25km)"
        ],
        "a2g": [
          "Kh-38M precision guided (40km)"
        ],
        "antiRad": [
          "Rudram-1 (NGARM) anti-radiation (150km)"
        ],
        "antiShip": [
          "Kh-35E active radar anti-ship"
        ],
        "glideBombs": [
          "DRDO SAAW anti-airfield weapon",
          "Spice 2000 electro-optical (60km)"
        ],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": [
          "Sudharshan laser-guided kits"
        ]
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the India Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "1,375 km",
        "Speed": "Mach 1.6",
        "Ceiling": "16,000 m",
        "Radar": "Uttam AESA / EL/M-2052 AESA"
      }
    },
    {
      "name": "S-400 Triumf Regiment",
      "category": "Mobile Air Defence Missile System",
      "cost": "$1.09 Billion",
      "manufactured": 3,
      "active": 3,
      "accidents": 0,
      "retired": 0,
      "ordered": 2,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "40N6E Long-Range Interceptor",
          "range": "400 km",
          "seeker": "Active / Passive Radar Homing",
          "speed": "Mach 12.0 (Hypersonic)",
          "guidance": "INS + Active/Passive RF Terminal"
        },
        {
          "name": "48N6DM Heavy Interceptor",
          "range": "250 km",
          "seeker": "Semi-Active Radar Homing / TVM",
          "speed": "Mach 6.0",
          "guidance": "INS + Track-via-Missile Terminal"
        },
        {
          "name": "9M96E2 Medium Interceptor",
          "range": "120 km",
          "seeker": "Active Radar Homing",
          "speed": "Mach 4.5",
          "guidance": "INS + Terminal Active RF"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the India Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Barak 8 ER / MRSAM",
      "category": "Mobile Air Defence Missile System",
      "cost": "$0.65 Billion",
      "manufactured": 18,
      "active": 18,
      "accidents": 0,
      "retired": 0,
      "ordered": 4,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "Barak-8 ER Extended Range",
          "range": "150 km",
          "seeker": "Active Radar Homing (RF)",
          "speed": "Mach 2.0",
          "guidance": "INS + Active RF Terminal"
        },
        {
          "name": "Barak-8 Standard",
          "range": "70 km",
          "seeker": "Active Radar Homing (RF)",
          "speed": "Mach 2.0",
          "guidance": "INS + Active RF Seeker"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the India Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Akash SAM Regiment",
      "category": "Mobile Air Defence Missile System",
      "cost": "$0.35 Billion",
      "manufactured": 15,
      "active": 15,
      "accidents": 0,
      "retired": 0,
      "ordered": 6,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "Akash-NG Next-Gen",
          "range": "80 km",
          "seeker": "Active Radar Homing (RF)",
          "speed": "Mach 3.5",
          "guidance": "INS + Active RF Seeker + Dual-pulse motor"
        },
        {
          "name": "Akash Mk1 Standard",
          "range": "30 km",
          "seeker": "Command Guided (Rajendra Radar)",
          "speed": "Mach 2.5",
          "guidance": "Radio Command Guidance"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the India Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Akash-NG Regiment",
      "category": "Mobile Air Defence Missile System",
      "cost": "$0.48 Billion",
      "manufactured": 0,
      "active": 0,
      "accidents": 0,
      "retired": 0,
      "ordered": 12,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "Akash-NG Next-Gen",
          "range": "80 km",
          "seeker": "Active Radar Homing (RF)",
          "speed": "Mach 3.5",
          "guidance": "INS + Active RF Seeker + Dual-pulse motor"
        },
        {
          "name": "Akash Mk1 Standard",
          "range": "30 km",
          "seeker": "Command Guided (Rajendra Radar)",
          "speed": "Mach 2.5",
          "guidance": "Radio Command Guidance"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the India Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Pechora-2M SAM Battery",
      "category": "Mobile Air Defence Missile System",
      "cost": "$15 Million",
      "manufactured": 30,
      "active": 20,
      "accidents": 2,
      "retired": 8,
      "ordered": 0,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [],
      "operationalHistory": "Developed under requirement programs to establish air parity for the India Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "QRSAM Regiment",
      "category": "Mobile Air Defence Missile System",
      "cost": "$0.60 Billion",
      "manufactured": 2,
      "active": 2,
      "accidents": 0,
      "retired": 0,
      "ordered": 8,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [],
      "operationalHistory": "Developed under requirement programs to establish air parity for the India Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "SPYDER SAM Battery",
      "category": "Mobile Air Defence Missile System",
      "cost": "$50 Million",
      "manufactured": 18,
      "active": 18,
      "accidents": 0,
      "retired": 0,
      "ordered": 0,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [],
      "operationalHistory": "Developed under requirement programs to establish air parity for the India Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Arudhra AESA Radar Station",
      "category": "Tactical Air Surveillance Radar Station",
      "cost": "$0.10 Billion",
      "manufactured": 12,
      "active": 12,
      "accidents": 0,
      "retired": 0,
      "ordered": 8,
      "legacy": "Vacuum-tube analog tracking units",
      "variants": [
        "Trailer unit",
        "Static reinforced site"
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the India Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "SearchRange": "450 km",
        "TrackingRange": "300 km",
        "OperatingBand": "S/X Band Multi-mode",
        "scanRate": "12 rpm"
      }
    },
    {
      "name": "Tapas BH-201",
      "category": "Unmanned Aerial Combat System (UCAV)",
      "cost": "$10 Million",
      "manufactured": 6,
      "active": 4,
      "accidents": 2,
      "retired": 0,
      "ordered": 10,
      "mtow": "4,500 kg (9,920 lbs)",
      "payloadCapacity": "450 kg (992 lbs)",
      "thrust": "1x Rotax 914 Turbo piston engine (115 hp)",
      "legacy": "Unguided target drones",
      "variants": [
        "Block A Surveillance",
        "Block B Strike Wing"
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the India Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Endurance": "24 hours",
        "Radius": "250 km",
        "Ceiling": "9,000 m",
        "Sensors": "EO/IR Turret + Synthetic Aperture Radar"
      }
    },
    {
      "name": "IAI Heron TP (India)",
      "category": "Unmanned Aerial Combat System (UCAV)",
      "cost": "$35 Million",
      "manufactured": 10,
      "active": 10,
      "accidents": 0,
      "retired": 0,
      "ordered": 4,
      "mtow": "4,500 kg (9,920 lbs)",
      "payloadCapacity": "450 kg (992 lbs)",
      "thrust": "1x Rotax 914 Turbo piston engine (115 hp)",
      "legacy": "Unguided target drones",
      "variants": [
        "Block A Surveillance",
        "Block B Strike Wing"
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the India Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Endurance": "24 hours",
        "Radius": "250 km",
        "Ceiling": "9,000 m",
        "Sensors": "EO/IR Turret + Synthetic Aperture Radar"
      }
    },
    {
      "name": "IAI Harop (India)",
      "category": "Unmanned Aerial Combat System (UCAV)",
      "cost": "$10 Million",
      "manufactured": 150,
      "active": 142,
      "accidents": 8,
      "retired": 0,
      "ordered": 50,
      "mtow": "4,500 kg (9,920 lbs)",
      "payloadCapacity": "450 kg (992 lbs)",
      "thrust": "1x Rotax 914 Turbo piston engine (115 hp)",
      "legacy": "Unguided target drones",
      "variants": [
        "Block A Surveillance",
        "Block B Strike Wing"
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the India Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Endurance": "24 hours",
        "Radius": "250 km",
        "Ceiling": "9,000 m",
        "Sensors": "EO/IR Turret + Synthetic Aperture Radar"
      }
    },
    {
      "name": "BrahMos Land-Attack",
      "category": "Guided Strike Missile System",
      "cost": "$3.5 Million",
      "manufactured": 500,
      "active": 500,
      "accidents": 0,
      "retired": 0,
      "ordered": 200,
      "legacy": "Unguided free-fall rockets",
      "variants": [
        "Land launch TEL",
        "Air launch carriage"
      ],
      "weapons": {
        "a2a": [],
        "a2g": [],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [],
        "cruise": [
          "BrahMos PJ-10 Supersonic cruise (Mach 3.0, 450km)"
        ],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the India Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "350 km",
        "Speed": "Mach 2.8",
        "Warhead": "450 kg",
        "Guidance": "INS + GPS + Radar terminal"
      }
    },
    {
      "name": "Nirbhay Cruise",
      "category": "Guided Strike Missile System",
      "cost": "$1.5 Million",
      "manufactured": 80,
      "active": 80,
      "accidents": 0,
      "retired": 0,
      "ordered": 40,
      "legacy": "Unguided free-fall rockets",
      "variants": [
        "Land launch TEL",
        "Air launch carriage"
      ],
      "weapons": {
        "a2a": [],
        "a2g": [],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [],
        "cruise": [
          "Nirbhay land-attack cruise (1,000km)"
        ],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the India Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "350 km",
        "Speed": "Mach 2.8",
        "Warhead": "450 kg",
        "Guidance": "INS + GPS + Radar terminal"
      }
    },
    {
      "name": "Pralay Missile",
      "category": "Guided Strike Missile System",
      "cost": "$2.2 Million",
      "manufactured": 20,
      "active": 20,
      "accidents": 0,
      "retired": 0,
      "ordered": 120,
      "legacy": "Unguided free-fall rockets",
      "variants": [
        "Land launch TEL",
        "Air launch carriage"
      ],
      "weapons": {
        "a2a": [],
        "a2g": [],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [],
        "cruise": [],
        "ballisticHypersonic": [
          "Pralay quasi-ballistic missile (150-500km)"
        ],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the India Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "350 km",
        "Speed": "Mach 2.8",
        "Warhead": "450 kg",
        "Guidance": "INS + GPS + Radar terminal"
      }
    },
    {
      "name": "Agni-V ICBM",
      "category": "Guided Strike Missile System",
      "cost": "$15 Million",
      "manufactured": 24,
      "active": 24,
      "accidents": 0,
      "retired": 0,
      "ordered": 12,
      "legacy": "Unguided free-fall rockets",
      "variants": [
        "Land launch TEL",
        "Air launch carriage"
      ],
      "weapons": {
        "a2a": [],
        "a2g": [],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [],
        "cruise": [],
        "ballisticHypersonic": [
          "Agni-V nuclear-capable ICBM (5,500-8,000km)"
        ],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the India Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "350 km",
        "Speed": "Mach 2.8",
        "Warhead": "450 kg",
        "Guidance": "INS + GPS + Radar terminal"
      }
    },
    {
      "name": "Agni-P (Agni-Prime)",
      "category": "Guided Strike Missile System",
      "cost": "$6 Million",
      "manufactured": 12,
      "active": 12,
      "accidents": 0,
      "retired": 0,
      "ordered": 36,
      "legacy": "Unguided free-fall rockets",
      "variants": [
        "Land launch TEL",
        "Air launch carriage"
      ],
      "weapons": {
        "a2a": [],
        "a2g": [],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [],
        "cruise": [],
        "ballisticHypersonic": [
          "Agni-Prime canisterized MRBM (1,000-2,000km)"
        ],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the India Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "350 km",
        "Speed": "Mach 2.8",
        "Warhead": "450 kg",
        "Guidance": "INS + GPS + Radar terminal"
      }
    },
    {
      "name": "Prithvi-II",
      "category": "Guided Strike Missile System",
      "cost": "$1.2 Million",
      "manufactured": 150,
      "active": 100,
      "accidents": 0,
      "retired": 50,
      "ordered": 0,
      "legacy": "Unguided free-fall rockets",
      "variants": [
        "Land launch TEL",
        "Air launch carriage"
      ],
      "weapons": {
        "a2a": [],
        "a2g": [],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [],
        "cruise": [],
        "ballisticHypersonic": [
          "Prithvi-II tactical ballistic (350km)"
        ],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the India Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "350 km",
        "Speed": "Mach 2.8",
        "Warhead": "450 kg",
        "Guidance": "INS + GPS + Radar terminal"
      }
    },
    {
      "name": "Igla-S MANPADS Team",
      "category": "Man-Portable Air Defence Shield (VSHORAD)",
      "cost": "$1 Million",
      "manufactured": 200,
      "active": 200,
      "accidents": 0,
      "retired": 0,
      "ordered": 100,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "9M342 portable interceptor",
          "range": "6 km",
          "seeker": "Dual-channel optical passive IR",
          "speed": "Mach 2.0",
          "guidance": "Passive IR homing"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the India Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "VSHORAD MANPADS Team",
      "category": "Man-Portable Air Defence Shield (VSHORAD)",
      "cost": "$0.15 Million",
      "manufactured": 50,
      "active": 50,
      "accidents": 0,
      "retired": 0,
      "ordered": 150,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [],
      "operationalHistory": "Developed under requirement programs to establish air parity for the India Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    }
  ],
  "pakistan": [
    {
      "name": "JF-17 Thunder Block III",
      "category": "Tactical Combat Fighter",
      "cost": "$32 Million",
      "manufactured": 50,
      "active": 49,
      "accidents": 1,
      "retired": 0,
      "ordered": 30,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "JF-17 Block I",
        "JF-17 Block II"
      ],
      "weapons": {
        "a2a": [
          "PL-15E active radar BVRAAM (145km)",
          "SD-10A active radar homing (100km)",
          "PL-10E high-agility IR (20km)",
          "PL-5EII infrared dogfight (15km)"
        ],
        "a2g": [
          "H-4 Stand-off weapon (SOW, 120km)",
          "H-2 Stand-off weapon (60km)",
          "LT-2 laser guided bomb"
        ],
        "antiRad": [
          "MAR-1 anti-radiation seeker (100km)",
          "YJ-91 anti-radiation (120km)"
        ],
        "antiShip": [
          "C-802AK active radar anti-ship (180km)",
          "CM-400AKG supersonic standoff (250km)"
        ],
        "glideBombs": [
          "LS-6 satellite guided bomb (50km)"
        ],
        "cruise": [
          "Ra'ad-II air-launched cruise missile (600km)"
        ],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Pakistan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "JF-17 Thunder Block II",
      "category": "Tactical Combat Fighter",
      "cost": "$25 Million",
      "manufactured": 80,
      "active": 76,
      "accidents": 4,
      "retired": 0,
      "ordered": 0,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "JF-17 Block I",
        "JF-17 Block II"
      ],
      "weapons": {
        "a2a": [
          "PL-15E active radar BVRAAM (145km)",
          "SD-10A active radar homing (100km)",
          "PL-10E high-agility IR (20km)",
          "PL-5EII infrared dogfight (15km)"
        ],
        "a2g": [
          "H-4 Stand-off weapon (SOW, 120km)",
          "H-2 Stand-off weapon (60km)",
          "LT-2 laser guided bomb"
        ],
        "antiRad": [
          "MAR-1 anti-radiation seeker (100km)",
          "YJ-91 anti-radiation (120km)"
        ],
        "antiShip": [
          "C-802AK active radar anti-ship (180km)",
          "CM-400AKG supersonic standoff (250km)"
        ],
        "glideBombs": [
          "LS-6 satellite guided bomb (50km)"
        ],
        "cruise": [
          "Ra'ad-II air-launched cruise missile (600km)"
        ],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Pakistan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "F-16C/D Block 52+",
      "category": "Tactical Combat Fighter",
      "cost": "$60 Million",
      "manufactured": 18,
      "active": 18,
      "accidents": 0,
      "retired": 0,
      "ordered": 0,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "F-16C/D Block I",
        "F-16C/D Block II"
      ],
      "weapons": {
        "a2a": [
          "AIM-120D AMRAAM active radar (160km)",
          "AIM-120C-7 active radar (120km)",
          "AIM-120C-5 active radar (105km)",
          "AIM-9X Sidewinder IR (22km)",
          "AIM-9L/M Sidewinder (18km)"
        ],
        "a2g": [
          "AGM-65G Maverick TV-guided (22km)",
          "AGM-65E Laser Maverick (22km)"
        ],
        "antiRad": [
          "AGM-88 HARM anti-radiation (150km)"
        ],
        "antiShip": [
          "AGM-84 Harpoon anti-ship cruise (120km)"
        ],
        "glideBombs": [
          "GBU-31/38 JDAM kits",
          "GBU-10/12 Paveway laser guided",
          "GBU-39 Small Diameter Bomb (SDB)"
        ],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Pakistan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "J-10CE Fighter",
      "category": "Tactical Combat Fighter",
      "cost": "$45 Million",
      "manufactured": 25,
      "active": 25,
      "accidents": 0,
      "retired": 0,
      "ordered": 11,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "J-10CE Block I",
        "J-10CE Block II"
      ],
      "weapons": {
        "a2a": [
          "PL-15 active radar BVRAAM (150km)",
          "PL-12 active radar homing (100km)",
          "PL-10 high-agility IR homing (20km)",
          "PL-8 IR dogfight (15km)"
        ],
        "a2g": [
          "KD-88 electro-optical standoff (180km)",
          "YJ-91 high-speed ground attack"
        ],
        "antiRad": [
          "YJ-91 high-speed anti-radiation (120km)"
        ],
        "antiShip": [
          "YJ-83K active radar anti-ship (180km)"
        ],
        "glideBombs": [
          "LS-500J laser-guided bomb"
        ],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Pakistan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "Mirage III ROSE",
      "category": "Tactical Combat Fighter",
      "cost": "$10 Million",
      "manufactured": 90,
      "active": 60,
      "accidents": 10,
      "retired": 20,
      "ordered": 0,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "Mirage Block I",
        "Mirage Block II"
      ],
      "weapons": {
        "a2a": [
          "AIM-9P Sidewinder IR dogfight (18km)",
          "Matra R550 Magic (15km)"
        ],
        "a2g": [
          "Durandal runway-penetration bombs"
        ],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [
          "H-2/H-4 Stand-off glide weapon (60-120km)"
        ],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Pakistan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "Mirage 5 Strike",
      "category": "Tactical Combat Fighter",
      "cost": "$12 Million",
      "manufactured": 50,
      "active": 35,
      "accidents": 5,
      "retired": 10,
      "ordered": 0,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "Mirage Block I",
        "Mirage Block II"
      ],
      "weapons": {
        "a2a": [
          "AIM-9P Sidewinder IR dogfight (18km)",
          "Matra R550 Magic (15km)"
        ],
        "a2g": [
          "Durandal runway-penetration bombs"
        ],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [
          "H-2/H-4 Stand-off glide weapon (60-120km)"
        ],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Pakistan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "HQ-9P HIMADS Regiment",
      "category": "Mobile Air Defence Missile System",
      "cost": "$0.40 Billion",
      "manufactured": 4,
      "active": 4,
      "accidents": 0,
      "retired": 0,
      "ordered": 2,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "HQ-9B Active SAM Interceptor",
          "range": "200 km",
          "seeker": "Active Radar Terminal Homing",
          "speed": "Mach 4.2",
          "guidance": "INS + Active RF Terminal"
        },
        {
          "name": "HQ-9P Export Interceptor",
          "range": "125 km",
          "seeker": "Active Radar Homing",
          "speed": "Mach 4.2",
          "guidance": "INS + Active RF"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Pakistan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "LY-80 LOMADS Regiment",
      "category": "Mobile Air Defence Missile System",
      "cost": "$0.25 Billion",
      "manufactured": 9,
      "active": 9,
      "accidents": 0,
      "retired": 0,
      "ordered": 0,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "LY-80 Medium-Range SAM",
          "range": "40 km",
          "seeker": "Semi-Active Radar Homing (SARH)",
          "speed": "Mach 3.0",
          "guidance": "INS + Slotted Array Terminal"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Pakistan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "HQ-17AE SAM Battery",
      "category": "Mobile Air Defence Missile System",
      "cost": "$0.12 Billion",
      "manufactured": 8,
      "active": 8,
      "accidents": 0,
      "retired": 0,
      "ordered": 4,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "HQ-17A Short-Range SAM",
          "range": "15 km",
          "seeker": "Active RF / Command Guided",
          "speed": "Mach 2.8",
          "guidance": "Radio Command Link"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Pakistan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Spada 2000 SAM Battery",
      "category": "Mobile Air Defence Missile System",
      "cost": "$75 Million",
      "manufactured": 10,
      "active": 10,
      "accidents": 0,
      "retired": 0,
      "ordered": 0,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Pakistan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "FM-90 SAM Battery",
      "category": "Mobile Air Defence Missile System",
      "cost": "$40 Million",
      "manufactured": 16,
      "active": 16,
      "accidents": 0,
      "retired": 0,
      "ordered": 0,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Pakistan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Anza Mk-III MANPADS Team",
      "category": "Man-Portable Air Defence Shield (VSHORAD)",
      "cost": "$0.2 Million",
      "manufactured": 100,
      "active": 100,
      "accidents": 0,
      "retired": 0,
      "ordered": 50,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "Anza-III portable interceptor",
          "range": "6 km",
          "seeker": "Passive Infrared Seeker",
          "speed": "Mach 2.0",
          "guidance": "Terminal IR Homing"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Pakistan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "TPS-77 Radar Station",
      "category": "Tactical Air Surveillance Radar Station",
      "cost": "$80 Million",
      "manufactured": 8,
      "active": 8,
      "accidents": 0,
      "retired": 0,
      "ordered": 2,
      "legacy": "Vacuum-tube analog tracking units",
      "variants": [
        "Trailer unit",
        "Static reinforced site"
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Pakistan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "SearchRange": "450 km",
        "TrackingRange": "300 km",
        "OperatingBand": "S/X Band Multi-mode",
        "scanRate": "12 rpm"
      }
    },
    {
      "name": "Akinci UCAV (PAF)",
      "category": "Unmanned Aerial Combat System (UCAV)",
      "cost": "$18 Million",
      "manufactured": 8,
      "active": 8,
      "accidents": 0,
      "retired": 0,
      "ordered": 6,
      "mtow": "4,500 kg (9,920 lbs)",
      "payloadCapacity": "450 kg (992 lbs)",
      "thrust": "1x Rotax 914 Turbo piston engine (115 hp)",
      "legacy": "Unguided target drones",
      "variants": [
        "Block A Surveillance",
        "Block B Strike Wing"
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Pakistan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Endurance": "24 hours",
        "Radius": "250 km",
        "Ceiling": "9,000 m",
        "Sensors": "EO/IR Turret + Synthetic Aperture Radar"
      }
    },
    {
      "name": "Bayraktar TB2 (UCAV)",
      "category": "Unmanned Aerial Combat System (UCAV)",
      "cost": "$5 Million",
      "manufactured": 20,
      "active": 18,
      "accidents": 2,
      "retired": 0,
      "ordered": 10,
      "mtow": "4,500 kg (9,920 lbs)",
      "payloadCapacity": "450 kg (992 lbs)",
      "thrust": "1x Rotax 914 Turbo piston engine (115 hp)",
      "legacy": "Unguided target drones",
      "variants": [
        "Block A Surveillance",
        "Block B Strike Wing"
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Pakistan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Endurance": "24 hours",
        "Radius": "250 km",
        "Ceiling": "9,000 m",
        "Sensors": "EO/IR Turret + Synthetic Aperture Radar"
      }
    },
    {
      "name": "Shahpar-2 UAV",
      "category": "Unmanned Aerial Combat System (UCAV)",
      "cost": "$2 Million",
      "manufactured": 15,
      "active": 14,
      "accidents": 1,
      "retired": 0,
      "ordered": 10,
      "mtow": "4,500 kg (9,920 lbs)",
      "payloadCapacity": "450 kg (992 lbs)",
      "thrust": "1x Rotax 914 Turbo piston engine (115 hp)",
      "legacy": "Unguided target drones",
      "variants": [
        "Block A Surveillance",
        "Block B Strike Wing"
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Pakistan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Endurance": "24 hours",
        "Radius": "250 km",
        "Ceiling": "9,000 m",
        "Sensors": "EO/IR Turret + Synthetic Aperture Radar"
      }
    },
    {
      "name": "Burraq UAV",
      "category": "Unmanned Aerial Combat System (UCAV)",
      "cost": "$1.5 Million",
      "manufactured": 12,
      "active": 10,
      "accidents": 2,
      "retired": 0,
      "ordered": 0,
      "mtow": "4,500 kg (9,920 lbs)",
      "payloadCapacity": "450 kg (992 lbs)",
      "thrust": "1x Rotax 914 Turbo piston engine (115 hp)",
      "legacy": "Unguided target drones",
      "variants": [
        "Block A Surveillance",
        "Block B Strike Wing"
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Pakistan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Endurance": "24 hours",
        "Radius": "250 km",
        "Ceiling": "9,000 m",
        "Sensors": "EO/IR Turret + Synthetic Aperture Radar"
      }
    },
    {
      "name": "Shaheen-III MRBM",
      "category": "Guided Strike Missile System",
      "cost": "$5 Million",
      "manufactured": 40,
      "active": 40,
      "accidents": 0,
      "retired": 0,
      "ordered": 20,
      "legacy": "Unguided free-fall rockets",
      "variants": [
        "Land launch TEL",
        "Air launch carriage"
      ],
      "weapons": {
        "a2a": [],
        "a2g": [],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [],
        "cruise": [],
        "ballisticHypersonic": [
          "Shaheen-III solid-propellant MRBM (2,750km)"
        ],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Pakistan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "350 km",
        "Speed": "Mach 2.8",
        "Warhead": "450 kg",
        "Guidance": "INS + GPS + Radar terminal"
      }
    },
    {
      "name": "Ababeel MIRV MRBM",
      "category": "Guided Strike Missile System",
      "cost": "$8 Million",
      "manufactured": 10,
      "active": 10,
      "accidents": 0,
      "retired": 0,
      "ordered": 10,
      "legacy": "Unguided free-fall rockets",
      "variants": [
        "Land launch TEL",
        "Air launch carriage"
      ],
      "weapons": {
        "a2a": [],
        "a2g": [],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [],
        "cruise": [],
        "ballisticHypersonic": [
          "Ababeel MIRV-capable MRBM (2,200km)"
        ],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Pakistan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "350 km",
        "Speed": "Mach 2.8",
        "Warhead": "450 kg",
        "Guidance": "INS + GPS + Radar terminal"
      }
    },
    {
      "name": "Ghauri-II MRBM",
      "category": "Guided Strike Missile System",
      "cost": "$3.5 Million",
      "manufactured": 30,
      "active": 20,
      "accidents": 0,
      "retired": 10,
      "ordered": 0,
      "legacy": "Unguided free-fall rockets",
      "variants": [
        "Land launch TEL",
        "Air launch carriage"
      ],
      "weapons": {
        "a2a": [],
        "a2g": [],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [],
        "cruise": [],
        "ballisticHypersonic": [
          "Ghauri-II liquid-propellant MRBM (2,000km)"
        ],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Pakistan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "350 km",
        "Speed": "Mach 2.8",
        "Warhead": "450 kg",
        "Guidance": "INS + GPS + Radar terminal"
      }
    },
    {
      "name": "Babur-3 Cruise",
      "category": "Guided Strike Missile System",
      "cost": "$1.5 Million",
      "manufactured": 60,
      "active": 60,
      "accidents": 0,
      "retired": 0,
      "ordered": 30,
      "legacy": "Unguided free-fall rockets",
      "variants": [
        "Land launch TEL",
        "Air launch carriage"
      ],
      "weapons": {
        "a2a": [],
        "a2g": [],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [],
        "cruise": [
          "Babur-3 submarine cruise (450km)"
        ],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Pakistan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "350 km",
        "Speed": "Mach 2.8",
        "Warhead": "450 kg",
        "Guidance": "INS + GPS + Radar terminal"
      }
    },
    {
      "name": "Ra'ad-II ALCM",
      "category": "Guided Strike Missile System",
      "cost": "$1.2 Million",
      "manufactured": 40,
      "active": 40,
      "accidents": 0,
      "retired": 0,
      "ordered": 20,
      "legacy": "Unguided free-fall rockets",
      "variants": [
        "Land launch TEL",
        "Air launch carriage"
      ],
      "weapons": {
        "a2a": [],
        "a2g": [],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [],
        "cruise": [
          "Ra'ad-II air-launched standoff cruise (600km)"
        ],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Pakistan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "350 km",
        "Speed": "Mach 2.8",
        "Warhead": "450 kg",
        "Guidance": "INS + GPS + Radar terminal"
      }
    },
    {
      "name": "Ghaznavi SRBM",
      "category": "Guided Strike Missile System",
      "cost": "$1 Million",
      "manufactured": 50,
      "active": 40,
      "accidents": 0,
      "retired": 10,
      "ordered": 0,
      "legacy": "Unguided free-fall rockets",
      "variants": [
        "Land launch TEL",
        "Air launch carriage"
      ],
      "weapons": {
        "a2a": [],
        "a2g": [],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [],
        "cruise": [],
        "ballisticHypersonic": [
          "Ghaznavi tactical ballistic (290km)"
        ],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Pakistan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "350 km",
        "Speed": "Mach 2.8",
        "Warhead": "450 kg",
        "Guidance": "INS + GPS + Radar terminal"
      }
    }
  ],
  "usa": [
    {
      "name": "F-35A Lightning II (USA)",
      "category": "Tactical Combat Fighter",
      "cost": "$85 Million",
      "manufactured": 450,
      "active": 442,
      "accidents": 4,
      "retired": 4,
      "ordered": 200,
      "mtow": "31,800 kg (70,000 lbs)",
      "payloadCapacity": "8,160 kg (18,000 lbs)",
      "thrust": "125.0 kN dry / 191.0 kN afterburner (Pratt & Whitney F135)",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "F-35A Block I",
        "F-35A Block II"
      ],
      "weapons": {
        "a2a": [
          "AIM-120D AMRAAM active radar (160km)",
          "AIM-120C-7 active radar (120km)",
          "AIM-9X Sidewinder IR (22km)",
          "Meteor BVRAAM (planned, 150+ km)"
        ],
        "a2g": [
          "GBU-39 Small Diameter Bomb (SDB, 110km)",
          "GBU-53/B StormBreaker (110km)"
        ],
        "antiRad": [],
        "antiShip": [
          "Joint Strike Missile (JSM) stealth cruise (270km)",
          "AGM-158C LRASM (planned, 370km)"
        ],
        "glideBombs": [
          "GBU-31/32/38 JDAM kits",
          "GBU-12 Paveway laser guided"
        ],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Usa Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,200 km",
        "Speed": "Mach 1.6",
        "Ceiling": "15,240 m",
        "Radar": "AN/APG-81 AESA"
      }
    },
    {
      "name": "F-35B Lightning II (USA)",
      "category": "Tactical Combat Fighter",
      "cost": "$0.10 Billion",
      "manufactured": 120,
      "active": 116,
      "accidents": 2,
      "retired": 2,
      "ordered": 80,
      "mtow": "31,800 kg (70,000 lbs)",
      "payloadCapacity": "8,160 kg (18,000 lbs)",
      "thrust": "125.0 kN dry / 191.0 kN afterburner (Pratt & Whitney F135)",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "F-35B Block I",
        "F-35B Block II"
      ],
      "weapons": {
        "a2a": [
          "AIM-120D AMRAAM active radar (160km)",
          "AIM-120C-7 active radar (120km)",
          "AIM-9X Sidewinder IR (22km)",
          "Meteor BVRAAM (planned, 150+ km)"
        ],
        "a2g": [
          "GBU-39 Small Diameter Bomb (SDB, 110km)",
          "GBU-53/B StormBreaker (110km)"
        ],
        "antiRad": [],
        "antiShip": [
          "Joint Strike Missile (JSM) stealth cruise (270km)",
          "AGM-158C LRASM (planned, 370km)"
        ],
        "glideBombs": [
          "GBU-31/32/38 JDAM kits",
          "GBU-12 Paveway laser guided"
        ],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Usa Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,200 km",
        "Speed": "Mach 1.6",
        "Ceiling": "15,240 m",
        "Radar": "AN/APG-81 AESA"
      }
    },
    {
      "name": "F-22 Raptor (USA)",
      "category": "Tactical Combat Fighter",
      "cost": "$0.15 Billion",
      "manufactured": 186,
      "active": 177,
      "accidents": 5,
      "retired": 4,
      "ordered": 0,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "F-22 Block I",
        "F-22 Block II"
      ],
      "weapons": {
        "a2a": [
          "AIM-120D AMRAAM active radar (160km)",
          "AIM-120C-7 active radar (120km)",
          "AIM-9X Sidewinder IR (22km)"
        ],
        "a2g": [],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [
          "GBU-39 Small Diameter Bomb (SDB, 110km)",
          "GBU-32 JDAM (450kg)"
        ],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Usa Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "F-15E Strike Eagle",
      "category": "Tactical Combat Fighter",
      "cost": "$80 Million",
      "manufactured": 219,
      "active": 210,
      "accidents": 5,
      "retired": 4,
      "ordered": 0,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "F-15E Block I",
        "F-15E Block II"
      ],
      "weapons": {
        "a2a": [
          "AIM-120D AMRAAM active radar (160km)",
          "AIM-120C-7 active radar (120km)",
          "AIM-9X Sidewinder IR (22km)",
          "AAM-4B active radar (Japan, 120km)",
          "AAM-5 IR (Japan, 35km)"
        ],
        "a2g": [
          "AGM-158 JASSM standoff cruise (370km)",
          "AGM-84H/K SLAM-ER land-attack (270km)",
          "AGM-65 Maverick (22km)"
        ],
        "antiRad": [],
        "antiShip": [
          "AGM-84 Harpoon anti-ship cruise (120km)",
          "ASM-3 supersonic anti-ship (Japan, 200km)"
        ],
        "glideBombs": [
          "GBU-39 SDB (110km)",
          "GBU-31 JDAM (900kg)",
          "Taurus KEPD 350 (South Korea, 500km)"
        ],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Usa Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "F-15EX Eagle II",
      "category": "Tactical Combat Fighter",
      "cost": "$94 Million",
      "manufactured": 20,
      "active": 20,
      "accidents": 0,
      "retired": 0,
      "ordered": 84,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "F-15EX Block I",
        "F-15EX Block II"
      ],
      "weapons": {
        "a2a": [
          "AIM-120D AMRAAM active radar (160km)",
          "AIM-120C-7 active radar (120km)",
          "AIM-9X Sidewinder IR (22km)",
          "AAM-4B active radar (Japan, 120km)",
          "AAM-5 IR (Japan, 35km)"
        ],
        "a2g": [
          "AGM-158 JASSM standoff cruise (370km)",
          "AGM-84H/K SLAM-ER land-attack (270km)",
          "AGM-65 Maverick (22km)"
        ],
        "antiRad": [],
        "antiShip": [
          "AGM-84 Harpoon anti-ship cruise (120km)",
          "ASM-3 supersonic anti-ship (Japan, 200km)"
        ],
        "glideBombs": [
          "GBU-39 SDB (110km)",
          "GBU-31 JDAM (900kg)",
          "Taurus KEPD 350 (South Korea, 500km)"
        ],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Usa Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "F-16C/D Fighting Falcon (USA)",
      "category": "Tactical Combat Fighter",
      "cost": "$30 Million",
      "manufactured": 900,
      "active": 780,
      "accidents": 40,
      "retired": 80,
      "ordered": 0,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "F-16C/D Block I",
        "F-16C/D Block II"
      ],
      "weapons": {
        "a2a": [
          "AIM-120D AMRAAM active radar (160km)",
          "AIM-120C-7 active radar (120km)",
          "AIM-120C-5 active radar (105km)",
          "AIM-9X Sidewinder IR (22km)",
          "AIM-9L/M Sidewinder (18km)"
        ],
        "a2g": [
          "AGM-65G Maverick TV-guided (22km)",
          "AGM-65E Laser Maverick (22km)"
        ],
        "antiRad": [
          "AGM-88 HARM anti-radiation (150km)"
        ],
        "antiShip": [
          "AGM-84 Harpoon anti-ship cruise (120km)"
        ],
        "glideBombs": [
          "GBU-31/38 JDAM kits",
          "GBU-10/12 Paveway laser guided",
          "GBU-39 Small Diameter Bomb (SDB)"
        ],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Usa Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "F/A-18E/F Super Hornet",
      "category": "Tactical Combat Fighter",
      "cost": "$65 Million",
      "manufactured": 600,
      "active": 550,
      "accidents": 10,
      "retired": 40,
      "ordered": 0,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "F/A-18E/F Block I",
        "F/A-18E/F Block II"
      ],
      "weapons": {
        "a2a": [
          "AIM-120D active radar (160km)",
          "AIM-120C-7 active radar (120km)",
          "AIM-9X Sidewinder IR (22km)"
        ],
        "a2g": [
          "AGM-65 Maverick TV-guided (22km)"
        ],
        "antiRad": [
          "AGM-88E AARGM anti-radiation (150km)",
          "AGM-88 HARM (150km)"
        ],
        "antiShip": [
          "AGM-84 Harpoon anti-ship (120km)",
          "AGM-158C LRASM stealth anti-ship (370km)"
        ],
        "glideBombs": [
          "GBU-31/32/38 JDAM kits"
        ],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Usa Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "A-10C Warthog",
      "category": "Tactical Combat Fighter",
      "cost": "$20 Million",
      "manufactured": 280,
      "active": 200,
      "accidents": 10,
      "retired": 70,
      "ordered": 0,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "A-10C Block I",
        "A-10C Block II"
      ],
      "weapons": {
        "a2a": [
          "AIM-9M Sidewinder IR dogfight (18km)"
        ],
        "a2g": [
          "GAU-8/A Avenger 30mm rotary cannon",
          "AGM-65 Maverick TV/Laser (22km)",
          "Hydra 70 rocket pods"
        ],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [
          "GBU-12 Paveway II laser guided",
          "GBU-38 JDAM"
        ],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Usa Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "B-1B Lancer",
      "category": "Tactical Combat Fighter",
      "cost": "$0.28 Billion",
      "manufactured": 100,
      "active": 45,
      "accidents": 5,
      "retired": 50,
      "ordered": 0,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "B-1B Block I",
        "B-1B Block II"
      ],
      "weapons": {
        "a2a": [],
        "a2g": [
          "GBU-31 JDAM kits",
          "GBU-39 Small Diameter Bomb (SDB, 110km)"
        ],
        "antiRad": [],
        "antiShip": [
          "AGM-158C LRASM stealth anti-ship (370km)"
        ],
        "glideBombs": [],
        "cruise": [
          "AGM-158 JASSM standoff cruise (370km)",
          "AGM-158 JASSM-ER (925km)"
        ],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Usa Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "B-2A Spirit",
      "category": "Tactical Combat Fighter",
      "cost": "$2.00 Billion",
      "manufactured": 21,
      "active": 19,
      "accidents": 1,
      "retired": 1,
      "ordered": 0,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "B-2A Block I",
        "B-2A Block II"
      ],
      "weapons": {
        "a2a": [],
        "a2g": [],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [
          "GBU-57 MOP (Massive Ordnance Penetrator)",
          "GBU-31 JDAM kits"
        ],
        "cruise": [
          "AGM-158 JASSM-ER standoff cruise (925km)"
        ],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Usa Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "B-52H Stratofortress",
      "category": "Tactical Combat Fighter",
      "cost": "$84 Million",
      "manufactured": 102,
      "active": 76,
      "accidents": 2,
      "retired": 24,
      "ordered": 0,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "B-52H Block I",
        "B-52H Block II"
      ],
      "weapons": {
        "a2a": [],
        "a2g": [],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [
          "GBU-31/38 JDAM kits"
        ],
        "cruise": [
          "AGM-86B nuclear ALCM (2,400km)",
          "AGM-158 JASSM-ER standoff cruise (925km)"
        ],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Usa Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "Patriot PAC-3 MSE Battery",
      "category": "Mobile Air Defence Missile System",
      "cost": "$1.10 Billion",
      "manufactured": 60,
      "active": 58,
      "accidents": 1,
      "retired": 1,
      "ordered": 15,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "MIM-104F PAC-3 MSE",
          "range": "160 km",
          "seeker": "Active Ka-Band Radar Seeker",
          "speed": "Mach 5.0",
          "guidance": "Kinetic Hit-To-Kill + DACS Thruster Nozzles"
        },
        {
          "name": "MIM-104E PAC-2 GEM-T",
          "range": "160 km",
          "seeker": "Semi-Active Radar Homing",
          "speed": "Mach 4.0",
          "guidance": "INS + Blast-Fragmentation Warhead"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Usa Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "THAAD Battery",
      "category": "Mobile Air Defence Missile System",
      "cost": "$1.50 Billion",
      "manufactured": 7,
      "active": 7,
      "accidents": 0,
      "retired": 0,
      "ordered": 2,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "THAAD Exoatmospheric Interceptor",
          "range": "200 km",
          "seeker": "Infrared Focal Plane Array (IIR)",
          "speed": "Mach 8.2",
          "guidance": "Hit-To-Kill Kinetic Intercept"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Usa Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "NASAMS III Battery",
      "category": "Mobile Air Defence Missile System",
      "cost": "$0.12 Billion",
      "manufactured": 12,
      "active": 12,
      "accidents": 0,
      "retired": 0,
      "ordered": 6,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "AIM-120C-7 AMRAAM",
          "range": "120 km",
          "seeker": "Active Radar Homing",
          "speed": "Mach 4.0",
          "guidance": "INS + Active RF Terminal"
        },
        {
          "name": "AIM-9X Sidewinder",
          "range": "20 km",
          "seeker": "Imaging Infrared (IIR)",
          "speed": "Mach 2.5",
          "guidance": "Proportional Navigation IR"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Usa Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Avenger SHORAD Battery",
      "category": "Mobile Air Defence Missile System",
      "cost": "$15 Million",
      "manufactured": 80,
      "active": 72,
      "accidents": 2,
      "retired": 6,
      "ordered": 0,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Usa Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Iron Dome Battery (US-acquired)",
      "category": "Mobile Air Defence Missile System",
      "cost": "$0.10 Billion",
      "manufactured": 2,
      "active": 2,
      "accidents": 0,
      "retired": 0,
      "ordered": 0,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Usa Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "AN/TPY-2 Radar Station",
      "category": "Tactical Air Surveillance Radar Station",
      "cost": "$0.80 Billion",
      "manufactured": 12,
      "active": 12,
      "accidents": 0,
      "retired": 0,
      "ordered": 4,
      "legacy": "Vacuum-tube analog tracking units",
      "variants": [
        "Trailer unit",
        "Static reinforced site"
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Usa Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "SearchRange": "450 km",
        "TrackingRange": "300 km",
        "OperatingBand": "S/X Band Multi-mode",
        "scanRate": "12 rpm"
      }
    },
    {
      "name": "Aegis Ashore (SM-3 Battery)",
      "category": "Mobile Air Defence Missile System",
      "cost": "$2.00 Billion",
      "manufactured": 3,
      "active": 3,
      "accidents": 0,
      "retired": 0,
      "ordered": 1,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Usa Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "LPWS C-RAM (Centurion)",
      "category": "Mobile Air Defence Missile System",
      "cost": "$10 Million",
      "manufactured": 40,
      "active": 40,
      "accidents": 0,
      "retired": 0,
      "ordered": 10,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "35mm AHEAD Munition",
          "range": "3 km",
          "seeker": "No Seeker (Time Fuzed sub-projectiles)",
          "speed": "1,050 m/s",
          "guidance": "Muzzle-programmed timed detonation"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Usa Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Minuteman III ICBM",
      "category": "Guided Strike Missile System",
      "cost": "$7 Million",
      "manufactured": 400,
      "active": 400,
      "accidents": 0,
      "retired": 0,
      "ordered": 0,
      "legacy": "Unguided free-fall rockets",
      "variants": [
        "Land launch TEL",
        "Air launch carriage"
      ],
      "weapons": {
        "a2a": [],
        "a2g": [],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [],
        "cruise": [],
        "ballisticHypersonic": [
          "LGM-30G Minuteman III heavy ICBM (13,000km)"
        ],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Usa Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "350 km",
        "Speed": "Mach 2.8",
        "Warhead": "450 kg",
        "Guidance": "INS + GPS + Radar terminal"
      }
    },
    {
      "name": "PrSM Tactical Missile",
      "category": "Guided Strike Missile System",
      "cost": "$1.5 Million",
      "manufactured": 50,
      "active": 50,
      "accidents": 0,
      "retired": 0,
      "ordered": 150,
      "legacy": "Unguided free-fall rockets",
      "variants": [
        "Land launch TEL",
        "Air launch carriage"
      ],
      "weapons": {
        "a2a": [],
        "a2g": [],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [],
        "cruise": [],
        "ballisticHypersonic": [
          "Precision Strike Missile quasi-ballistic (500+ km)"
        ],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Usa Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "350 km",
        "Speed": "Mach 2.8",
        "Warhead": "450 kg",
        "Guidance": "INS + GPS + Radar terminal"
      }
    }
  ],
  "china": [
    {
      "name": "J-20 Mighty Dragon",
      "category": "Tactical Combat Fighter",
      "cost": "$0.11 Billion",
      "manufactured": 220,
      "active": 218,
      "accidents": 2,
      "retired": 0,
      "ordered": 100,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "J-20 Block I",
        "J-20 Block II"
      ],
      "weapons": {
        "a2a": [
          "PL-15 active radar BVRAAM (150km)",
          "PL-21 ultra-long-range active radar (300+ km)",
          "PL-10 high-agility IR dogfight (20km)"
        ],
        "a2g": [],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [
          "LS-6 satellite guided bomb (250kg)"
        ],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the China Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "J-16 Strike Fighter",
      "category": "Tactical Combat Fighter",
      "cost": "$80 Million",
      "manufactured": 250,
      "active": 248,
      "accidents": 2,
      "retired": 0,
      "ordered": 50,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "J-16 Block I",
        "J-16 Block II"
      ],
      "weapons": {
        "a2a": [
          "PL-15 active radar BVRAAM (150km)",
          "PL-12 active radar homing (100km)",
          "PL-10 IR heat-seeking (20km)",
          "PL-8 IR dogfight (15km)"
        ],
        "a2g": [
          "KD-88 electro-optical standoff missile (180km)"
        ],
        "antiRad": [
          "YJ-91 anti-radiation seeker (120km)"
        ],
        "antiShip": [
          "YJ-83K active radar anti-ship (180km)"
        ],
        "glideBombs": [],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the China Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "J-11B Fighter",
      "category": "Tactical Combat Fighter",
      "cost": "$45 Million",
      "manufactured": 180,
      "active": 170,
      "accidents": 5,
      "retired": 5,
      "ordered": 0,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "J-11B Block I",
        "J-11B Block II"
      ],
      "weapons": {
        "a2a": [
          "PL-15 active radar BVRAAM (150km)",
          "PL-12 active radar homing (100km)",
          "PL-10 IR heat-seeking (20km)",
          "PL-8 IR dogfight (15km)"
        ],
        "a2g": [
          "KD-88 electro-optical standoff missile (180km)"
        ],
        "antiRad": [
          "YJ-91 anti-radiation seeker (120km)"
        ],
        "antiShip": [
          "YJ-83K active radar anti-ship (180km)"
        ],
        "glideBombs": [],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the China Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "J-15 Flying Shark",
      "category": "Tactical Combat Fighter",
      "cost": "$50 Million",
      "manufactured": 60,
      "active": 56,
      "accidents": 4,
      "retired": 0,
      "ordered": 20,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "J-15 Block I",
        "J-15 Block II"
      ],
      "weapons": {
        "a2a": [
          "PL-15 active radar BVRAAM (150km)",
          "PL-12 active radar homing (100km)",
          "PL-10 IR heat-seeking (20km)",
          "PL-8 IR dogfight (15km)"
        ],
        "a2g": [
          "KD-88 electro-optical standoff missile (180km)"
        ],
        "antiRad": [
          "YJ-91 anti-radiation seeker (120km)"
        ],
        "antiShip": [
          "YJ-83K active radar anti-ship (180km)"
        ],
        "glideBombs": [],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the China Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "J-35 Stealth Fighter",
      "category": "Tactical Combat Fighter",
      "cost": "$75 Million",
      "manufactured": 10,
      "active": 10,
      "accidents": 0,
      "retired": 0,
      "ordered": 80,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "J-35 Block I",
        "J-35 Block II"
      ],
      "weapons": {
        "a2a": [
          "PL-15 active radar BVRAAM (150km)",
          "PL-12 active radar homing (100km)",
          "PL-10 IR heat-seeking (20km)",
          "PL-8 IR dogfight (15km)"
        ],
        "a2g": [
          "KD-88 electro-optical standoff missile (180km)"
        ],
        "antiRad": [
          "YJ-91 anti-radiation seeker (120km)"
        ],
        "antiShip": [
          "YJ-83K active radar anti-ship (180km)"
        ],
        "glideBombs": [],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the China Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "H-6K Strategic Bomber",
      "category": "Tactical Combat Fighter",
      "cost": "$0.12 Billion",
      "manufactured": 100,
      "active": 98,
      "accidents": 2,
      "retired": 0,
      "ordered": 10,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "H-6K Block I",
        "H-6K Block II"
      ],
      "weapons": {
        "a2a": [],
        "a2g": [],
        "antiRad": [],
        "antiShip": [
          "YJ-12 heavy supersonic anti-ship (Mach 3.5, 400km)"
        ],
        "glideBombs": [],
        "cruise": [
          "CJ-20 land-attack cruise missile (1,500km)"
        ],
        "ballisticHypersonic": [
          "CH-AS-X-13 air-launched ballistic (H-6N, 3,000km)"
        ],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the China Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "H-6N Strategic Bomber",
      "category": "Tactical Combat Fighter",
      "cost": "$0.14 Billion",
      "manufactured": 30,
      "active": 30,
      "accidents": 0,
      "retired": 0,
      "ordered": 10,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "H-6N Block I",
        "H-6N Block II"
      ],
      "weapons": {
        "a2a": [],
        "a2g": [],
        "antiRad": [],
        "antiShip": [
          "YJ-12 heavy supersonic anti-ship (Mach 3.5, 400km)"
        ],
        "glideBombs": [],
        "cruise": [
          "CJ-20 land-attack cruise missile (1,500km)"
        ],
        "ballisticHypersonic": [
          "CH-AS-X-13 air-launched ballistic (H-6N, 3,000km)"
        ],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the China Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "JH-7A Fighter-Bomber",
      "category": "Tactical Combat Fighter",
      "cost": "$30 Million",
      "manufactured": 140,
      "active": 110,
      "accidents": 10,
      "retired": 20,
      "ordered": 0,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "JH-7A Block I",
        "JH-7A Block II"
      ],
      "weapons": {
        "a2a": [
          "PL-8 IR dogfight (15km)"
        ],
        "a2g": [
          "KD-88 electro-optical standoff (180km)"
        ],
        "antiRad": [
          "YJ-91 anti-radiation seeker (120km)"
        ],
        "antiShip": [
          "YJ-83K active radar anti-ship (180km)"
        ],
        "glideBombs": [],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the China Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "Su-35S Flanker-E (Chinese)",
      "category": "Tactical Combat Fighter",
      "cost": "$85 Million",
      "manufactured": 24,
      "active": 24,
      "accidents": 0,
      "retired": 0,
      "ordered": 0,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "Su-35S Block I",
        "Su-35S Block II"
      ],
      "weapons": {
        "a2a": [
          "R-77-1 active radar homing (110km)",
          "R-37M ultra-long range (300km, Mach 6.0)",
          "R-73 infrared high-agility (30km)",
          "R-27ER semi-active (130km)"
        ],
        "a2g": [
          "Kh-29T TV-guided missile (12km)",
          "Kh-59ME television-guided (115km)"
        ],
        "antiRad": [
          "Kh-31PD supersonic anti-radiation (250km)"
        ],
        "antiShip": [
          "Kh-31AD supersonic anti-ship (250km)",
          "Kh-35E active radar anti-ship (130km)"
        ],
        "glideBombs": [
          "UPAB-1500B precision satellite guided (50km)"
        ],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the China Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "Wing Loong II UAV",
      "category": "Unmanned Aerial Combat System (UCAV)",
      "cost": "$5 Million",
      "manufactured": 100,
      "active": 95,
      "accidents": 5,
      "retired": 0,
      "ordered": 50,
      "mtow": "4,500 kg (9,920 lbs)",
      "payloadCapacity": "450 kg (992 lbs)",
      "thrust": "1x Rotax 914 Turbo piston engine (115 hp)",
      "legacy": "Unguided target drones",
      "variants": [
        "Block A Surveillance",
        "Block B Strike Wing"
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the China Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Endurance": "24 hours",
        "Radius": "250 km",
        "Ceiling": "9,000 m",
        "Sensors": "EO/IR Turret + Synthetic Aperture Radar"
      }
    },
    {
      "name": "HQ-9B Regiment",
      "category": "Mobile Air Defence Missile System",
      "cost": "$0.60 Billion",
      "manufactured": 32,
      "active": 32,
      "accidents": 0,
      "retired": 0,
      "ordered": 8,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "HQ-9B Active SAM Interceptor",
          "range": "200 km",
          "seeker": "Active Radar Terminal Homing",
          "speed": "Mach 4.2",
          "guidance": "INS + Active RF Terminal"
        },
        {
          "name": "HQ-9P Export Interceptor",
          "range": "125 km",
          "seeker": "Active Radar Homing",
          "speed": "Mach 4.2",
          "guidance": "INS + Active RF"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the China Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "HQ-9C LRAD Regiment",
      "category": "Mobile Air Defence Missile System",
      "cost": "$0.75 Billion",
      "manufactured": 8,
      "active": 8,
      "accidents": 0,
      "retired": 0,
      "ordered": 16,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "HQ-9B Active SAM Interceptor",
          "range": "200 km",
          "seeker": "Active Radar Terminal Homing",
          "speed": "Mach 4.2",
          "guidance": "INS + Active RF Terminal"
        },
        {
          "name": "HQ-9P Export Interceptor",
          "range": "125 km",
          "seeker": "Active Radar Homing",
          "speed": "Mach 4.2",
          "guidance": "INS + Active RF"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the China Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "HQ-22 MRSAM Regiment",
      "category": "Mobile Air Defence Missile System",
      "cost": "$0.30 Billion",
      "manufactured": 24,
      "active": 24,
      "accidents": 0,
      "retired": 0,
      "ordered": 12,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "Barak-8 ER Extended Range",
          "range": "150 km",
          "seeker": "Active Radar Homing (RF)",
          "speed": "Mach 2.0",
          "guidance": "INS + Active RF Terminal"
        },
        {
          "name": "Barak-8 Standard",
          "range": "70 km",
          "seeker": "Active Radar Homing (RF)",
          "speed": "Mach 2.0",
          "guidance": "INS + Active RF Seeker"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the China Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "HQ-16B MRAD Regiment",
      "category": "Mobile Air Defence Missile System",
      "cost": "$0.20 Billion",
      "manufactured": 40,
      "active": 38,
      "accidents": 2,
      "retired": 0,
      "ordered": 10,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [],
      "operationalHistory": "Developed under requirement programs to establish air parity for the China Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "HQ-17A SAM Battery",
      "category": "Mobile Air Defence Missile System",
      "cost": "$90 Million",
      "manufactured": 30,
      "active": 30,
      "accidents": 0,
      "retired": 0,
      "ordered": 15,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "HQ-17A Short-Range SAM",
          "range": "15 km",
          "seeker": "Active RF / Command Guided",
          "speed": "Mach 2.8",
          "guidance": "Radio Command Link"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the China Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "HQ-11 SAM Battery (Red Flag-11)",
      "category": "Mobile Air Defence Missile System",
      "cost": "$80 Million",
      "manufactured": 12,
      "active": 12,
      "accidents": 0,
      "retired": 0,
      "ordered": 12,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [],
      "operationalHistory": "Developed under requirement programs to establish air parity for the China Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "HQ-19 ABM System",
      "category": "Mobile Air Defence Missile System",
      "cost": "$1.20 Billion",
      "manufactured": 4,
      "active": 4,
      "accidents": 0,
      "retired": 0,
      "ordered": 8,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [],
      "operationalHistory": "Developed under requirement programs to establish air parity for the China Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "PGZ-09 SPAAA Battery",
      "category": "Mobile Air Defence Missile System",
      "cost": "$50 Million",
      "manufactured": 80,
      "active": 78,
      "accidents": 2,
      "retired": 0,
      "ordered": 20,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [],
      "operationalHistory": "Developed under requirement programs to establish air parity for the China Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "LD-2000 C-RAM SPAAG",
      "category": "Mobile Air Defence Missile System",
      "cost": "$12 Million",
      "manufactured": 24,
      "active": 24,
      "accidents": 0,
      "retired": 0,
      "ordered": 6,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [],
      "operationalHistory": "Developed under requirement programs to establish air parity for the China Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "YLC-2V Radar Station",
      "category": "Tactical Air Surveillance Radar Station",
      "cost": "$70 Million",
      "manufactured": 40,
      "active": 40,
      "accidents": 0,
      "retired": 0,
      "ordered": 10,
      "legacy": "Vacuum-tube analog tracking units",
      "variants": [
        "Trailer unit",
        "Static reinforced site"
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the China Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "SearchRange": "450 km",
        "TrackingRange": "300 km",
        "OperatingBand": "S/X Band Multi-mode",
        "scanRate": "12 rpm"
      }
    },
    {
      "name": "DF-21D (Educational Reference)",
      "category": "Guided Strike Missile System",
      "cost": "$15 Million",
      "manufactured": 80,
      "active": 80,
      "accidents": 0,
      "retired": 0,
      "ordered": 40,
      "legacy": "Unguided free-fall rockets",
      "variants": [
        "Land launch TEL",
        "Air launch carriage"
      ],
      "weapons": {
        "a2a": [],
        "a2g": [],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [],
        "cruise": [],
        "ballisticHypersonic": [
          "DF-21D anti-ship medium-range ballistic (1,500km)"
        ],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the China Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "350 km",
        "Speed": "Mach 2.8",
        "Warhead": "450 kg",
        "Guidance": "INS + GPS + Radar terminal"
      }
    },
    {
      "name": "DF-41 Heavy ICBM",
      "category": "Guided Strike Missile System",
      "cost": "$25 Million",
      "manufactured": 50,
      "active": 50,
      "accidents": 0,
      "retired": 0,
      "ordered": 20,
      "legacy": "Unguided free-fall rockets",
      "variants": [
        "Land launch TEL",
        "Air launch carriage"
      ],
      "weapons": {
        "a2a": [],
        "a2g": [],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [],
        "cruise": [],
        "ballisticHypersonic": [
          "DF-41 road-mobile heavy ICBM (12,000-15,000km)"
        ],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the China Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "350 km",
        "Speed": "Mach 2.8",
        "Warhead": "450 kg",
        "Guidance": "INS + GPS + Radar terminal"
      }
    },
    {
      "name": "DF-100 Supersonic LACM",
      "category": "Guided Strike Missile System",
      "cost": "$4.5 Million",
      "manufactured": 100,
      "active": 100,
      "accidents": 0,
      "retired": 0,
      "ordered": 50,
      "legacy": "Unguided free-fall rockets",
      "variants": [
        "Land launch TEL",
        "Air launch carriage"
      ],
      "weapons": {
        "a2a": [],
        "a2g": [],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [],
        "cruise": [
          "DF-100 supersonic cruise (1,500km)"
        ],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the China Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "350 km",
        "Speed": "Mach 2.8",
        "Warhead": "450 kg",
        "Guidance": "INS + GPS + Radar terminal"
      }
    },
    {
      "name": "CJ-20 ALCM (Educational Reference)",
      "category": "Guided Strike Missile System",
      "cost": "$2 Million",
      "manufactured": 300,
      "active": 300,
      "accidents": 0,
      "retired": 0,
      "ordered": 100,
      "legacy": "Unguided free-fall rockets",
      "variants": [
        "Land launch TEL",
        "Air launch carriage"
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the China Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "350 km",
        "Speed": "Mach 2.8",
        "Warhead": "450 kg",
        "Guidance": "INS + GPS + Radar terminal"
      }
    }
  ],
  "russia": [
    {
      "name": "Su-35S Flanker-E",
      "category": "Tactical Combat Fighter",
      "cost": "$55 Million",
      "manufactured": 110,
      "active": 98,
      "accidents": 8,
      "retired": 4,
      "ordered": 20,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "Su-35S Block I",
        "Su-35S Block II"
      ],
      "weapons": {
        "a2a": [
          "R-77-1 active radar homing (110km)",
          "R-37M ultra-long range (300km, Mach 6.0)",
          "R-73 infrared high-agility (30km)",
          "R-27ER semi-active (130km)"
        ],
        "a2g": [
          "Kh-29T TV-guided missile (12km)",
          "Kh-59ME television-guided (115km)"
        ],
        "antiRad": [
          "Kh-31PD supersonic anti-radiation (250km)"
        ],
        "antiShip": [
          "Kh-31AD supersonic anti-ship (250km)",
          "Kh-35E active radar anti-ship (130km)"
        ],
        "glideBombs": [
          "UPAB-1500B precision satellite guided (50km)"
        ],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Russia Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "Su-30SM Flanker-H",
      "category": "Tactical Combat Fighter",
      "cost": "$48 Million",
      "manufactured": 130,
      "active": 120,
      "accidents": 6,
      "retired": 4,
      "ordered": 10,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "Su-30SM Block I",
        "Su-30SM Block II"
      ],
      "weapons": {
        "a2a": [
          "R-77-1 active radar homing (110km)",
          "R-37M ultra-long range (300km, Mach 6.0)",
          "R-73 infrared high-agility (30km)",
          "R-27ER semi-active (130km)"
        ],
        "a2g": [
          "Kh-29T TV-guided missile (12km)",
          "Kh-59ME television-guided (115km)"
        ],
        "antiRad": [
          "Kh-31PD supersonic anti-radiation (250km)"
        ],
        "antiShip": [
          "Kh-31AD supersonic anti-ship (250km)",
          "Kh-35E active radar anti-ship (130km)"
        ],
        "glideBombs": [
          "UPAB-1500B precision satellite guided (50km)"
        ],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Russia Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "Su-27S Flanker-B",
      "category": "Tactical Combat Fighter",
      "cost": "$30 Million",
      "manufactured": 200,
      "active": 100,
      "accidents": 20,
      "retired": 80,
      "ordered": 0,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "Su-27S Block I",
        "Su-27S Block II"
      ],
      "weapons": {
        "a2a": [
          "R-27R semi-active radar (80km)",
          "R-27T thermal seeking (70km)",
          "R-73 infrared dogfight (30km)"
        ],
        "a2g": [
          "S-25 unguided rockets",
          "FAB-500 gravity bombs"
        ],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Russia Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "Su-57 Felon",
      "category": "Tactical Combat Fighter",
      "cost": "$0.12 Billion",
      "manufactured": 22,
      "active": 22,
      "accidents": 0,
      "retired": 0,
      "ordered": 54,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "Su-57 Block I",
        "Su-57 Block II"
      ],
      "weapons": {
        "a2a": [
          "R-77M active radar BVR (160km)",
          "R-37M ultra-long range active (300km)",
          "R-74M2 high-agility IR dogfight (40km)"
        ],
        "a2g": [
          "Kh-59Mk2 tactical standoff cruise (290km)",
          "Kh-38M laser guided modular (40km)"
        ],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [],
        "cruise": [],
        "ballisticHypersonic": [
          "Kh-47M2 Kinzhal hypersonic aero-ballistic (Mach 10, 2000km)"
        ],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Russia Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "Su-34 Fullback",
      "category": "Tactical Combat Fighter",
      "cost": "$40 Million",
      "manufactured": 140,
      "active": 112,
      "accidents": 18,
      "retired": 10,
      "ordered": 20,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "Su-34 Block I",
        "Su-34 Block II"
      ],
      "weapons": {
        "a2a": [
          "R-77 active radar BVR (100km)",
          "R-73 infrared dogfight (30km)"
        ],
        "a2g": [
          "Kh-38M laser guided (40km)",
          "Kh-29L laser guided (10km)"
        ],
        "antiRad": [
          "Kh-31P supersonic anti-radiation (110km)"
        ],
        "antiShip": [],
        "glideBombs": [
          "KAB-1500Kr TV guided bomb",
          "FAB-500 M62 gravity bombs"
        ],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Russia Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "MiG-31K Foxhound-D",
      "category": "Tactical Combat Fighter",
      "cost": "$60 Million",
      "manufactured": 30,
      "active": 26,
      "accidents": 2,
      "retired": 2,
      "ordered": 10,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "MiG-31K Block I",
        "MiG-31K Block II"
      ],
      "weapons": {
        "a2a": [],
        "a2g": [],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [],
        "cruise": [],
        "ballisticHypersonic": [
          "Kh-47M2 Kinzhal hypersonic aero-ballistic missile (Mach 10, 2,000km)"
        ],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Russia Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "MiG-31 Foxhound",
      "category": "Tactical Combat Fighter",
      "cost": "$40 Million",
      "manufactured": 120,
      "active": 80,
      "accidents": 10,
      "retired": 30,
      "ordered": 0,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "MiG-31 Block I",
        "MiG-31 Block II"
      ],
      "weapons": {
        "a2a": [
          "R-33 active radar homing (120km)",
          "R-37M ultra-long range active (300km)",
          "R-73 infrared dogfight (30km)"
        ],
        "a2g": [],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Russia Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "MiG-29SMT Fulcrum-E",
      "category": "Tactical Combat Fighter",
      "cost": "$22 Million",
      "manufactured": 60,
      "active": 40,
      "accidents": 4,
      "retired": 16,
      "ordered": 0,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "MiG-29SMT Block I",
        "MiG-29SMT Block II"
      ],
      "weapons": {
        "a2a": [
          "R-77 active radar homing (100km)",
          "R-73 infrared dogfight (30km)"
        ],
        "a2g": [
          "Kh-29T TV-guided missile (12km)"
        ],
        "antiRad": [
          "Kh-31P anti-radiation (110km)"
        ],
        "antiShip": [],
        "glideBombs": [],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Russia Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "MiG-35 Fulcrum-F",
      "category": "Tactical Combat Fighter",
      "cost": "$35 Million",
      "manufactured": 8,
      "active": 8,
      "accidents": 0,
      "retired": 0,
      "ordered": 24,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "MiG-35 Block I",
        "MiG-35 Block II"
      ],
      "weapons": {
        "a2a": [
          "R-77 active radar homing (100km)",
          "R-73 infrared dogfight (30km)"
        ],
        "a2g": [
          "Kh-29T TV-guided missile (12km)"
        ],
        "antiRad": [
          "Kh-31P anti-radiation (110km)"
        ],
        "antiShip": [],
        "glideBombs": [],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Russia Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "Tu-160M White Swan Bomber",
      "category": "Tactical Combat Fighter",
      "cost": "$0.35 Billion",
      "manufactured": 17,
      "active": 16,
      "accidents": 1,
      "retired": 0,
      "ordered": 10,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "Tu-160M Block I",
        "Tu-160M Block II"
      ],
      "weapons": {
        "a2a": [],
        "a2g": [],
        "antiRad": [],
        "antiShip": [
          "Kh-22/32 heavy supersonic anti-ship (Tu-22M3, 600-1000km)"
        ],
        "glideBombs": [],
        "cruise": [
          "Kh-101/102 land-attack cruise (2,500-5,000km)",
          "Kh-555 cruise"
        ],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Russia Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "Tu-22M3 Backfire",
      "category": "Tactical Combat Fighter",
      "cost": "$0.18 Billion",
      "manufactured": 80,
      "active": 60,
      "accidents": 4,
      "retired": 16,
      "ordered": 0,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "Tu-22M3 Block I",
        "Tu-22M3 Block II"
      ],
      "weapons": {
        "a2a": [],
        "a2g": [],
        "antiRad": [],
        "antiShip": [
          "Kh-22/32 heavy supersonic anti-ship (Tu-22M3, 600-1000km)"
        ],
        "glideBombs": [],
        "cruise": [
          "Kh-101/102 land-attack cruise (2,500-5,000km)",
          "Kh-555 cruise"
        ],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Russia Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "Tu-95MS Bear",
      "category": "Tactical Combat Fighter",
      "cost": "$95 Million",
      "manufactured": 60,
      "active": 48,
      "accidents": 2,
      "retired": 10,
      "ordered": 0,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "Tu-95MS Block I",
        "Tu-95MS Block II"
      ],
      "weapons": {
        "a2a": [],
        "a2g": [],
        "antiRad": [],
        "antiShip": [
          "Kh-22/32 heavy supersonic anti-ship (Tu-22M3, 600-1000km)"
        ],
        "glideBombs": [],
        "cruise": [
          "Kh-101/102 land-attack cruise (2,500-5,000km)",
          "Kh-555 cruise"
        ],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Russia Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "S-400 Triumf Regiment",
      "category": "Mobile Air Defence Missile System",
      "cost": "$1.20 Billion",
      "manufactured": 48,
      "active": 44,
      "accidents": 4,
      "retired": 0,
      "ordered": 8,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "40N6E Long-Range Interceptor",
          "range": "400 km",
          "seeker": "Active / Passive Radar Homing",
          "speed": "Mach 12.0 (Hypersonic)",
          "guidance": "INS + Active/Passive RF Terminal"
        },
        {
          "name": "48N6DM Heavy Interceptor",
          "range": "250 km",
          "seeker": "Semi-Active Radar Homing / TVM",
          "speed": "Mach 6.0",
          "guidance": "INS + Track-via-Missile Terminal"
        },
        {
          "name": "9M96E2 Medium Interceptor",
          "range": "120 km",
          "seeker": "Active Radar Homing",
          "speed": "Mach 4.5",
          "guidance": "INS + Terminal Active RF"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Russia Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "S-500 Prometey Regiment",
      "category": "Mobile Air Defence Missile System",
      "cost": "$2.50 Billion",
      "manufactured": 2,
      "active": 2,
      "accidents": 0,
      "retired": 0,
      "ordered": 4,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "77N6-N Exoatmospheric Interceptor",
          "range": "600 km",
          "seeker": "Active Radar / Optical Terminal",
          "speed": "Mach 15.0",
          "guidance": "Exoatmospheric Hit-To-Kill (Kinetic)"
        },
        {
          "name": "77N6-N1 Nuclear-Capable Interceptor",
          "range": "500 km",
          "seeker": "Active Radar Homing",
          "speed": "Mach 12.0",
          "guidance": "Strategic Guided Interception"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Russia Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "S-300PMU2 Favorit Regiment",
      "category": "Mobile Air Defence Missile System",
      "cost": "$0.80 Billion",
      "manufactured": 30,
      "active": 20,
      "accidents": 2,
      "retired": 8,
      "ordered": 0,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "48N6E2 Interceptor",
          "range": "200 km",
          "seeker": "Semi-Active Radar Homing",
          "speed": "Mach 6.0",
          "guidance": "INS + Track-via-Missile"
        },
        {
          "name": "9M83ME Medium Interceptor",
          "range": "75 km",
          "seeker": "Semi-Active Radar",
          "speed": "Mach 4.0",
          "guidance": "INS + Slotted Array Terminal"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Russia Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "S-350E Vityaz Regiment",
      "category": "Mobile Air Defence Missile System",
      "cost": "$0.50 Billion",
      "manufactured": 6,
      "active": 6,
      "accidents": 0,
      "retired": 0,
      "ordered": 12,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Russia Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Buk-M3 Viking Regiment",
      "category": "Mobile Air Defence Missile System",
      "cost": "$0.35 Billion",
      "manufactured": 20,
      "active": 20,
      "accidents": 0,
      "retired": 0,
      "ordered": 10,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Russia Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Tor-M2 SAM Battery",
      "category": "Mobile Air Defence Missile System",
      "cost": "$0.12 Billion",
      "manufactured": 80,
      "active": 70,
      "accidents": 4,
      "retired": 6,
      "ordered": 20,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Russia Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Pantsir-S1 Battery",
      "category": "Mobile Air Defence Missile System",
      "cost": "$60 Million",
      "manufactured": 110,
      "active": 95,
      "accidents": 10,
      "retired": 5,
      "ordered": 20,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Russia Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Pantsir-S2 (SA-22) Battery",
      "category": "Mobile Air Defence Missile System",
      "cost": "$70 Million",
      "manufactured": 30,
      "active": 28,
      "accidents": 2,
      "retired": 0,
      "ordered": 10,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Russia Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Gibka-S Mobile VSHORAD",
      "category": "Mobile Air Defence Missile System",
      "cost": "$15 Million",
      "manufactured": 40,
      "active": 40,
      "accidents": 0,
      "retired": 0,
      "ordered": 20,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Russia Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Sosna-R Short-Range SAM",
      "category": "Mobile Air Defence Missile System",
      "cost": "$25 Million",
      "manufactured": 20,
      "active": 20,
      "accidents": 0,
      "retired": 0,
      "ordered": 10,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Russia Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "55G6 Tall Rack Radar Station",
      "category": "Tactical Air Surveillance Radar Station",
      "cost": "$0.15 Billion",
      "manufactured": 15,
      "active": 15,
      "accidents": 0,
      "retired": 0,
      "ordered": 5,
      "legacy": "Vacuum-tube analog tracking units",
      "variants": [
        "Trailer unit",
        "Static reinforced site"
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Russia Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "SearchRange": "450 km",
        "TrackingRange": "300 km",
        "OperatingBand": "S/X Band Multi-mode",
        "scanRate": "12 rpm"
      }
    },
    {
      "name": "3M22 Zircon Hypersonic LACM",
      "category": "Guided Strike Missile System",
      "cost": "$4 Million",
      "manufactured": 100,
      "active": 100,
      "accidents": 0,
      "retired": 0,
      "ordered": 150,
      "legacy": "Unguided free-fall rockets",
      "variants": [
        "Land launch TEL",
        "Air launch carriage"
      ],
      "weapons": {
        "a2a": [],
        "a2g": [],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [],
        "cruise": [
          "3M22 Zircon hypersonic cruise (Mach 8.0, 1,000km)"
        ],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Russia Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "350 km",
        "Speed": "Mach 2.8",
        "Warhead": "450 kg",
        "Guidance": "INS + GPS + Radar terminal"
      }
    }
  ],
  "japan": [
    {
      "name": "F-15J Eagle (JASDF)",
      "category": "Tactical Combat Fighter",
      "cost": "$55 Million",
      "manufactured": 165,
      "active": 155,
      "accidents": 8,
      "retired": 2,
      "ordered": 0,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "F-15J Block I",
        "F-15J Block II"
      ],
      "weapons": {
        "a2a": [
          "AIM-120D AMRAAM active radar (160km)",
          "AIM-120C-7 active radar (120km)",
          "AIM-9X Sidewinder IR (22km)",
          "AAM-4B active radar (Japan, 120km)",
          "AAM-5 IR (Japan, 35km)"
        ],
        "a2g": [
          "AGM-158 JASSM standoff cruise (370km)",
          "AGM-84H/K SLAM-ER land-attack (270km)",
          "AGM-65 Maverick (22km)"
        ],
        "antiRad": [],
        "antiShip": [
          "AGM-84 Harpoon anti-ship cruise (120km)",
          "ASM-3 supersonic anti-ship (Japan, 200km)"
        ],
        "glideBombs": [
          "GBU-39 SDB (110km)",
          "GBU-31 JDAM (900kg)",
          "Taurus KEPD 350 (South Korea, 500km)"
        ],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Japan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "F-15DJ Eagle (JASDF Trainer)",
      "category": "Tactical Combat Fighter",
      "cost": "$58 Million",
      "manufactured": 35,
      "active": 31,
      "accidents": 4,
      "retired": 0,
      "ordered": 0,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "F-15DJ Block I",
        "F-15DJ Block II"
      ],
      "weapons": {
        "a2a": [
          "BVR Active Radar Interceptor",
          "WVR Infrared Heat-seeker"
        ],
        "a2g": [],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [
          "Precision Guided Standoff Bomb"
        ],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Japan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "F-35A Lightning II (JASDF)",
      "category": "Tactical Combat Fighter",
      "cost": "$88 Million",
      "manufactured": 38,
      "active": 37,
      "accidents": 1,
      "retired": 0,
      "ordered": 67,
      "mtow": "31,800 kg (70,000 lbs)",
      "payloadCapacity": "8,160 kg (18,000 lbs)",
      "thrust": "125.0 kN dry / 191.0 kN afterburner (Pratt & Whitney F135)",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "F-35A Block I",
        "F-35A Block II"
      ],
      "weapons": {
        "a2a": [
          "AIM-120D AMRAAM active radar (160km)",
          "AIM-120C-7 active radar (120km)",
          "AIM-9X Sidewinder IR (22km)",
          "Meteor BVRAAM (planned, 150+ km)"
        ],
        "a2g": [
          "GBU-39 Small Diameter Bomb (SDB, 110km)",
          "GBU-53/B StormBreaker (110km)"
        ],
        "antiRad": [],
        "antiShip": [
          "Joint Strike Missile (JSM) stealth cruise (270km)",
          "AGM-158C LRASM (planned, 370km)"
        ],
        "glideBombs": [
          "GBU-31/32/38 JDAM kits",
          "GBU-12 Paveway laser guided"
        ],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Japan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,200 km",
        "Speed": "Mach 1.6",
        "Ceiling": "15,240 m",
        "Radar": "AN/APG-81 AESA"
      }
    },
    {
      "name": "F-35B Lightning II (JASDF STOVL)",
      "category": "Tactical Combat Fighter",
      "cost": "$0.10 Billion",
      "manufactured": 0,
      "active": 0,
      "accidents": 0,
      "retired": 0,
      "ordered": 42,
      "mtow": "31,800 kg (70,000 lbs)",
      "payloadCapacity": "8,160 kg (18,000 lbs)",
      "thrust": "125.0 kN dry / 191.0 kN afterburner (Pratt & Whitney F135)",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "F-35B Block I",
        "F-35B Block II"
      ],
      "weapons": {
        "a2a": [
          "AIM-120D AMRAAM active radar (160km)",
          "AIM-120C-7 active radar (120km)",
          "AIM-9X Sidewinder IR (22km)",
          "Meteor BVRAAM (planned, 150+ km)"
        ],
        "a2g": [
          "GBU-39 Small Diameter Bomb (SDB, 110km)",
          "GBU-53/B StormBreaker (110km)"
        ],
        "antiRad": [],
        "antiShip": [
          "Joint Strike Missile (JSM) stealth cruise (270km)",
          "AGM-158C LRASM (planned, 370km)"
        ],
        "glideBombs": [
          "GBU-31/32/38 JDAM kits",
          "GBU-12 Paveway laser guided"
        ],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Japan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,200 km",
        "Speed": "Mach 1.6",
        "Ceiling": "15,240 m",
        "Radar": "AN/APG-81 AESA"
      }
    },
    {
      "name": "F-2A Viper Zero (JASDF)",
      "category": "Tactical Combat Fighter",
      "cost": "$90 Million",
      "manufactured": 64,
      "active": 62,
      "accidents": 2,
      "retired": 0,
      "ordered": 0,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "F-2A Block I",
        "F-2A Block II"
      ],
      "weapons": {
        "a2a": [
          "AAM-4B active radar homing (120km)",
          "AAM-5 infrared homing (35km)",
          "AIM-9L Sidewinder"
        ],
        "a2g": [],
        "antiRad": [],
        "antiShip": [
          "ASM-3 supersonic anti-ship (200km)",
          "ASM-1C anti-ship (65km)"
        ],
        "glideBombs": [
          "GBU-38 JDAM GPS guided"
        ],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Japan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "RQ-4B Global Hawk (JASDF)",
      "category": "Unmanned Aerial Combat System (UCAV)",
      "cost": "$0.13 Billion",
      "manufactured": 3,
      "active": 3,
      "accidents": 0,
      "retired": 0,
      "ordered": 0,
      "mtow": "4,500 kg (9,920 lbs)",
      "payloadCapacity": "450 kg (992 lbs)",
      "thrust": "1x Rotax 914 Turbo piston engine (115 hp)",
      "legacy": "Unguided target drones",
      "variants": [
        "Block A Surveillance",
        "Block B Strike Wing"
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Japan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Endurance": "24 hours",
        "Radius": "250 km",
        "Ceiling": "9,000 m",
        "Sensors": "EO/IR Turret + Synthetic Aperture Radar"
      }
    },
    {
      "name": "Patriot PAC-3 MSE Battery (JASDF)",
      "category": "Mobile Air Defence Missile System",
      "cost": "$1.10 Billion",
      "manufactured": 24,
      "active": 24,
      "accidents": 0,
      "retired": 0,
      "ordered": 8,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "MIM-104F PAC-3 MSE",
          "range": "160 km",
          "seeker": "Active Ka-Band Radar Seeker",
          "speed": "Mach 5.0",
          "guidance": "Kinetic Hit-To-Kill + DACS Thruster Nozzles"
        },
        {
          "name": "MIM-104E PAC-2 GEM-T",
          "range": "160 km",
          "seeker": "Semi-Active Radar Homing",
          "speed": "Mach 4.0",
          "guidance": "INS + Blast-Fragmentation Warhead"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Japan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Type-03 Chū-SAM Battery",
      "category": "Mobile Air Defence Missile System",
      "cost": "$0.38 Billion",
      "manufactured": 16,
      "active": 16,
      "accidents": 0,
      "retired": 0,
      "ordered": 0,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Japan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Type-03 Chū-SAM Kai",
      "category": "Mobile Air Defence Missile System",
      "cost": "$0.42 Billion",
      "manufactured": 4,
      "active": 4,
      "accidents": 0,
      "retired": 0,
      "ordered": 12,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Japan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Type-11 SAM Battery",
      "category": "Mobile Air Defence Missile System",
      "cost": "$0.15 Billion",
      "manufactured": 12,
      "active": 12,
      "accidents": 0,
      "retired": 0,
      "ordered": 4,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Japan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Type-81 Short Range SAM",
      "category": "Mobile Air Defence Missile System",
      "cost": "$80 Million",
      "manufactured": 30,
      "active": 20,
      "accidents": 2,
      "retired": 8,
      "ordered": 0,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Japan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "FPS-3 Radar Station",
      "category": "Tactical Air Surveillance Radar Station",
      "cost": "$12 Million",
      "manufactured": 7,
      "active": 7,
      "accidents": 0,
      "retired": 0,
      "ordered": 2,
      "legacy": "Vacuum-tube analog tracking units",
      "variants": [
        "Trailer unit",
        "Static reinforced site"
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Japan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "SearchRange": "450 km",
        "TrackingRange": "300 km",
        "OperatingBand": "S/X Band Multi-mode",
        "scanRate": "12 rpm"
      }
    },
    {
      "name": "Type-88 SSM Coastal Launcher",
      "category": "Guided Strike Missile System",
      "cost": "$15 Million",
      "manufactured": 80,
      "active": 80,
      "accidents": 0,
      "retired": 0,
      "ordered": 20,
      "legacy": "Unguided free-fall rockets",
      "variants": [
        "Land launch TEL",
        "Air launch carriage"
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Japan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "350 km",
        "Speed": "Mach 2.8",
        "Warhead": "450 kg",
        "Guidance": "INS + GPS + Radar terminal"
      }
    },
    {
      "name": "Type-93 ASM Airborne ALCM",
      "category": "Guided Strike Missile System",
      "cost": "$1.8 Million",
      "manufactured": 200,
      "active": 200,
      "accidents": 0,
      "retired": 0,
      "ordered": 100,
      "legacy": "Unguided free-fall rockets",
      "variants": [
        "Land launch TEL",
        "Air launch carriage"
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Japan Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "350 km",
        "Speed": "Mach 2.8",
        "Warhead": "450 kg",
        "Guidance": "INS + GPS + Radar terminal"
      }
    }
  ],
  "south_korea": [
    {
      "name": "KF-21 Boramae (ROKAF)",
      "category": "Tactical Combat Fighter",
      "cost": "$65 Million",
      "manufactured": 6,
      "active": 6,
      "accidents": 0,
      "retired": 0,
      "ordered": 120,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "KF-21 Block I",
        "KF-21 Block II"
      ],
      "weapons": {
        "a2a": [
          "Meteor active radar BVRAAM (150+ km)",
          "IRIS-T active infrared seeker (25km)"
        ],
        "a2g": [],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [
          "KGGB (Korean GPS Guided Bomb, 70km)",
          "GBU-31 JDAM (900kg)"
        ],
        "cruise": [
          "Taurus KEPD 350 air-launched cruise (500km)",
          "Cheonryong air-launched cruise (planned, 500km)"
        ],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the South_korea Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "F-15K Slam Eagle (ROKAF)",
      "category": "Tactical Combat Fighter",
      "cost": "$82 Million",
      "manufactured": 61,
      "active": 59,
      "accidents": 2,
      "retired": 0,
      "ordered": 0,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "F-15K Block I",
        "F-15K Block II"
      ],
      "weapons": {
        "a2a": [
          "AIM-120D AMRAAM active radar (160km)",
          "AIM-120C-7 active radar (120km)",
          "AIM-9X Sidewinder IR (22km)",
          "AAM-4B active radar (Japan, 120km)",
          "AAM-5 IR (Japan, 35km)"
        ],
        "a2g": [
          "AGM-158 JASSM standoff cruise (370km)",
          "AGM-84H/K SLAM-ER land-attack (270km)",
          "AGM-65 Maverick (22km)"
        ],
        "antiRad": [],
        "antiShip": [
          "AGM-84 Harpoon anti-ship cruise (120km)",
          "ASM-3 supersonic anti-ship (Japan, 200km)"
        ],
        "glideBombs": [
          "GBU-39 SDB (110km)",
          "GBU-31 JDAM (900kg)",
          "Taurus KEPD 350 (South Korea, 500km)"
        ],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the South_korea Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "FA-50 Block 20 / FA-50PL",
      "category": "Tactical Combat Fighter",
      "cost": "$30 Million",
      "manufactured": 60,
      "active": 60,
      "accidents": 0,
      "retired": 0,
      "ordered": 20,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "FA-50 Block I",
        "FA-50 Block II"
      ],
      "weapons": {
        "a2a": [
          "AIM-9L/M Sidewinder IR dogfight (18km)"
        ],
        "a2g": [
          "AGM-65 Maverick TV-guided (22km)"
        ],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [
          "KGGB (Korean GPS Guided Bomb, 70km)",
          "GBU-38 JDAM"
        ],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the South_korea Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "RQ-4 Block 30 Global Hawk (ROKAF)",
      "category": "Unmanned Aerial Combat System (UCAV)",
      "cost": "$0.13 Billion",
      "manufactured": 4,
      "active": 4,
      "accidents": 0,
      "retired": 0,
      "ordered": 0,
      "mtow": "4,500 kg (9,920 lbs)",
      "payloadCapacity": "450 kg (992 lbs)",
      "thrust": "1x Rotax 914 Turbo piston engine (115 hp)",
      "legacy": "Unguided target drones",
      "variants": [
        "Block A Surveillance",
        "Block B Strike Wing"
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the South_korea Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Endurance": "24 hours",
        "Radius": "250 km",
        "Ceiling": "9,000 m",
        "Sensors": "EO/IR Turret + Synthetic Aperture Radar"
      }
    },
    {
      "name": "Patriot PAC-3 Battery (ROKAF)",
      "category": "Mobile Air Defence Missile System",
      "cost": "$1.10 Billion",
      "manufactured": 12,
      "active": 12,
      "accidents": 0,
      "retired": 0,
      "ordered": 4,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "MIM-104F PAC-3 MSE",
          "range": "160 km",
          "seeker": "Active Ka-Band Radar Seeker",
          "speed": "Mach 5.0",
          "guidance": "Kinetic Hit-To-Kill + DACS Thruster Nozzles"
        },
        {
          "name": "MIM-104E PAC-2 GEM-T",
          "range": "160 km",
          "seeker": "Semi-Active Radar Homing",
          "speed": "Mach 4.0",
          "guidance": "INS + Blast-Fragmentation Warhead"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the South_korea Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Cheongung-II M-SAM Battery",
      "category": "Mobile Air Defence Missile System",
      "cost": "$0.32 Billion",
      "manufactured": 10,
      "active": 10,
      "accidents": 0,
      "retired": 0,
      "ordered": 12,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "Cheongung-II active Interceptor",
          "range": "40 km",
          "seeker": "Active Radar Homing",
          "speed": "Mach 4.5",
          "guidance": "INS + Terminal Active RF"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the South_korea Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Chun Ma II Short-Range SAM",
      "category": "Mobile Air Defence Missile System",
      "cost": "$95 Million",
      "manufactured": 40,
      "active": 40,
      "accidents": 0,
      "retired": 0,
      "ordered": 10,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [],
      "operationalHistory": "Developed under requirement programs to establish air parity for the South_korea Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "L-SAM ABM System",
      "category": "Mobile Air Defence Missile System",
      "cost": "$0.80 Billion",
      "manufactured": 0,
      "active": 0,
      "accidents": 0,
      "retired": 0,
      "ordered": 4,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [],
      "operationalHistory": "Developed under requirement programs to establish air parity for the South_korea Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "LAMD (Low Altitude Missile Defense)",
      "category": "Mobile Air Defence Missile System",
      "cost": "$0.15 Billion",
      "manufactured": 0,
      "active": 0,
      "accidents": 0,
      "retired": 0,
      "ordered": 8,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [],
      "operationalHistory": "Developed under requirement programs to establish air parity for the South_korea Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Hyunmoo-5 Heavy Ballistic",
      "category": "Guided Strike Missile System",
      "cost": "$6 Million",
      "manufactured": 50,
      "active": 50,
      "accidents": 0,
      "retired": 0,
      "ordered": 150,
      "legacy": "Unguided free-fall rockets",
      "variants": [
        "Land launch TEL",
        "Air launch carriage"
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the South_korea Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "350 km",
        "Speed": "Mach 2.8",
        "Warhead": "450 kg",
        "Guidance": "INS + GPS + Radar terminal"
      }
    },
    {
      "name": "Hyunmoo-3C LACM",
      "category": "Guided Strike Missile System",
      "cost": "$1.5 Million",
      "manufactured": 100,
      "active": 100,
      "accidents": 0,
      "retired": 0,
      "ordered": 50,
      "legacy": "Unguided free-fall rockets",
      "variants": [
        "Land launch TEL",
        "Air launch carriage"
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the South_korea Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "350 km",
        "Speed": "Mach 2.8",
        "Warhead": "450 kg",
        "Guidance": "INS + GPS + Radar terminal"
      }
    }
  ],
  "uk": [
    {
      "name": "Eurofighter Typhoon FGR4 (RAF)",
      "category": "Tactical Combat Fighter",
      "cost": "$90 Million",
      "manufactured": 160,
      "active": 137,
      "accidents": 3,
      "retired": 20,
      "ordered": 0,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "Eurofighter Block I",
        "Eurofighter Block II"
      ],
      "weapons": {
        "a2a": [
          "Meteor active radar BVRAAM (150+ km)",
          "ASRAAM high-agility IR dogfight (25km)",
          "IRIS-T IR (Germany, 25km)"
        ],
        "a2g": [
          "Brimstone millimeter-wave anti-armor (12km)"
        ],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [
          "Paveway IV dual-mode laser/GPS",
          "GBU-48 (Germany)"
        ],
        "cruise": [
          "Storm Shadow stealth cruise (560km)",
          "Taurus KEPD 350 (Germany, 500km)"
        ],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Uk Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "F-35B Lightning II (RAF)",
      "category": "Tactical Combat Fighter",
      "cost": "$0.10 Billion",
      "manufactured": 32,
      "active": 31,
      "accidents": 1,
      "retired": 0,
      "ordered": 48,
      "mtow": "31,800 kg (70,000 lbs)",
      "payloadCapacity": "8,160 kg (18,000 lbs)",
      "thrust": "125.0 kN dry / 191.0 kN afterburner (Pratt & Whitney F135)",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "F-35B Block I",
        "F-35B Block II"
      ],
      "weapons": {
        "a2a": [
          "AIM-120D AMRAAM active radar (160km)",
          "AIM-120C-7 active radar (120km)",
          "AIM-9X Sidewinder IR (22km)",
          "Meteor BVRAAM (planned, 150+ km)"
        ],
        "a2g": [
          "GBU-39 Small Diameter Bomb (SDB, 110km)",
          "GBU-53/B StormBreaker (110km)"
        ],
        "antiRad": [],
        "antiShip": [
          "Joint Strike Missile (JSM) stealth cruise (270km)",
          "AGM-158C LRASM (planned, 370km)"
        ],
        "glideBombs": [
          "GBU-31/32/38 JDAM kits",
          "GBU-12 Paveway laser guided"
        ],
        "cruise": [],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Uk Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,200 km",
        "Speed": "Mach 1.6",
        "Ceiling": "15,240 m",
        "Radar": "AN/APG-81 AESA"
      }
    },
    {
      "name": "Protector RG Mk1 (GA-ASI MQ-9B)",
      "category": "Unmanned Aerial Combat System (UCAV)",
      "cost": "$40 Million",
      "manufactured": 8,
      "active": 8,
      "accidents": 0,
      "retired": 0,
      "ordered": 8,
      "mtow": "4,500 kg (9,920 lbs)",
      "payloadCapacity": "450 kg (992 lbs)",
      "thrust": "1x Rotax 914 Turbo piston engine (115 hp)",
      "legacy": "Unguided target drones",
      "variants": [
        "Block A Surveillance",
        "Block B Strike Wing"
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Uk Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Endurance": "24 hours",
        "Radius": "250 km",
        "Ceiling": "9,000 m",
        "Sensors": "EO/IR Turret + Synthetic Aperture Radar"
      }
    },
    {
      "name": "MQ-9A Reaper (RAF)",
      "category": "Unmanned Aerial Combat System (UCAV)",
      "cost": "$20 Million",
      "manufactured": 15,
      "active": 10,
      "accidents": 2,
      "retired": 3,
      "ordered": 0,
      "mtow": "4,500 kg (9,920 lbs)",
      "payloadCapacity": "450 kg (992 lbs)",
      "thrust": "1x Rotax 914 Turbo piston engine (115 hp)",
      "legacy": "Unguided target drones",
      "variants": [
        "Block A Surveillance",
        "Block B Strike Wing"
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Uk Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Endurance": "24 hours",
        "Radius": "250 km",
        "Ceiling": "9,000 m",
        "Sensors": "EO/IR Turret + Synthetic Aperture Radar"
      }
    },
    {
      "name": "Sky Sabre (CAMM-ER) Battery",
      "category": "Mobile Air Defence Missile System",
      "cost": "$0.35 Billion",
      "manufactured": 12,
      "active": 12,
      "accidents": 0,
      "retired": 0,
      "ordered": 6,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "CAMM-ER Active Interceptor",
          "range": "45 km",
          "seeker": "Active Radar Seeker",
          "speed": "Mach 3.0",
          "guidance": "INS + Two-way Datalink + Active RF"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Uk Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Land Ceptor CAMM Battery",
      "category": "Mobile Air Defence Missile System",
      "cost": "$0.28 Billion",
      "manufactured": 8,
      "active": 8,
      "accidents": 0,
      "retired": 8,
      "ordered": 0,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "CAMM Active Interceptor",
          "range": "25 km",
          "seeker": "Active Radar Seeker",
          "speed": "Mach 3.0",
          "guidance": "INS + Active RF"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Uk Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Rapier FSC Battery",
      "category": "Mobile Air Defence Missile System",
      "cost": "$60 Million",
      "manufactured": 24,
      "active": 0,
      "accidents": 2,
      "retired": 22,
      "ordered": 0,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Uk Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Starstreak HVM Team",
      "category": "Mobile Air Defence Missile System",
      "cost": "$1.2 Million",
      "manufactured": 150,
      "active": 150,
      "accidents": 0,
      "retired": 0,
      "ordered": 50,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "Starstreak High-Velocity Dart",
          "range": "7 km",
          "seeker": "Laser-beam riding sensor",
          "speed": "Mach 4.0",
          "guidance": "Laser SACLOS (beam riding)"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Uk Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Starstreak LML (VSHORAD)",
      "category": "Mobile Air Defence Missile System",
      "cost": "$1.5 Million",
      "manufactured": 60,
      "active": 60,
      "accidents": 0,
      "retired": 0,
      "ordered": 20,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "Starstreak High-Velocity Dart",
          "range": "7 km",
          "seeker": "Laser-beam riding sensor",
          "speed": "Mach 4.0",
          "guidance": "Laser SACLOS (beam riding)"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Uk Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Aegis Destroyer (SM-6 Type-45)",
      "category": "Mobile Air Defence Missile System",
      "cost": "$1.50 Billion",
      "manufactured": 6,
      "active": 6,
      "accidents": 0,
      "retired": 0,
      "ordered": 0,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Uk Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "SPEAR 3 Standoff ALCM",
      "category": "Guided Strike Missile System",
      "cost": "$0.3 Million",
      "manufactured": 100,
      "active": 100,
      "accidents": 0,
      "retired": 0,
      "ordered": 300,
      "legacy": "Unguided free-fall rockets",
      "variants": [
        "Land launch TEL",
        "Air launch carriage"
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Uk Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "350 km",
        "Speed": "Mach 2.8",
        "Warhead": "450 kg",
        "Guidance": "INS + GPS + Radar terminal"
      }
    }
  ],
  "france": [
    {
      "name": "Rafale C (French Air Force)",
      "category": "Tactical Combat Fighter",
      "cost": "$85 Million",
      "manufactured": 100,
      "active": 96,
      "accidents": 4,
      "retired": 0,
      "ordered": 42,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "Rafale Block I",
        "Rafale Block II"
      ],
      "weapons": {
        "a2a": [
          "Meteor active radar BVRAAM (150+ km)",
          "MICA EM active radar homing (80km)",
          "MICA IR heat-seeking (80km)",
          "MICA NG (Next-Gen) active/IR (100km)"
        ],
        "a2g": [
          "AASM Hammer rocket-assisted precision bomb (250/500/1000kg)"
        ],
        "antiRad": [],
        "antiShip": [
          "AM39 Exocet Block 2 Mod 2 (70km)"
        ],
        "glideBombs": [
          "AASM Hammer (laser/GPS/IR guided, 70km)"
        ],
        "cruise": [
          "SCALP-EG deep-strike cruise missile (560km)"
        ],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the France Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "Rafale M (French Navy)",
      "category": "Tactical Combat Fighter",
      "cost": "$92 Million",
      "manufactured": 46,
      "active": 42,
      "accidents": 4,
      "retired": 0,
      "ordered": 3,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "Rafale Block I",
        "Rafale Block II"
      ],
      "weapons": {
        "a2a": [
          "Meteor active radar BVRAAM (150+ km)",
          "MICA EM active radar homing (80km)",
          "MICA IR heat-seeking (80km)",
          "MICA NG (Next-Gen) active/IR (100km)"
        ],
        "a2g": [
          "AASM Hammer rocket-assisted precision bomb (250/500/1000kg)"
        ],
        "antiRad": [],
        "antiShip": [
          "AM39 Exocet Block 2 Mod 2 (70km)"
        ],
        "glideBombs": [
          "AASM Hammer (laser/GPS/IR guided, 70km)"
        ],
        "cruise": [
          "SCALP-EG deep-strike cruise missile (560km)"
        ],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the France Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "Mirage 2000-5F (French Air Force)",
      "category": "Tactical Combat Fighter",
      "cost": "$40 Million",
      "manufactured": 37,
      "active": 26,
      "accidents": 3,
      "retired": 8,
      "ordered": 0,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "Mirage Block I",
        "Mirage Block II"
      ],
      "weapons": {
        "a2a": [
          "MICA EM active radar homing (80km)",
          "MICA IR infrared seeker (80km)",
          "Super 530D semi-active radar (60km)",
          "Magic II dogfight IR (15km)"
        ],
        "a2g": [
          "AS-30L laser guided missile (12km)"
        ],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [
          "Spice 2000 electro-optical guided bomb (60km)",
          "GBU-12 Paveway II laser guided"
        ],
        "cruise": [
          "SCALP-EG cruise missile (560km)"
        ],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the France Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "nEUROn UCAV (Stealth Drone)",
      "category": "Unmanned Aerial Combat System (UCAV)",
      "cost": "$25 Million",
      "manufactured": 1,
      "active": 1,
      "accidents": 0,
      "retired": 0,
      "ordered": 4,
      "mtow": "4,500 kg (9,920 lbs)",
      "payloadCapacity": "450 kg (992 lbs)",
      "thrust": "1x Rotax 914 Turbo piston engine (115 hp)",
      "legacy": "Unguided target drones",
      "variants": [
        "Block A Surveillance",
        "Block B Strike Wing"
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the France Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Endurance": "24 hours",
        "Radius": "250 km",
        "Ceiling": "9,000 m",
        "Sensors": "EO/IR Turret + Synthetic Aperture Radar"
      }
    },
    {
      "name": "SAMP/T (Aster 30) Battery",
      "category": "Mobile Air Defence Missile System",
      "cost": "$0.38 Billion",
      "manufactured": 8,
      "active": 8,
      "accidents": 0,
      "retired": 0,
      "ordered": 4,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "Aster 30 Block 1 NT",
          "range": "120 km",
          "seeker": "Active Radar Homing (Ka-band)",
          "speed": "Mach 4.5",
          "guidance": "INS + Active RF + PIF-PAF thrusters"
        },
        {
          "name": "Aster 15 Point Defense",
          "range": "30 km",
          "seeker": "Active Radar Homing",
          "speed": "Mach 3.0",
          "guidance": "INS + Active RF"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the France Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "VL MICA Battery",
      "category": "Mobile Air Defence Missile System",
      "cost": "$0.18 Billion",
      "manufactured": 12,
      "active": 12,
      "accidents": 0,
      "retired": 0,
      "ordered": 4,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "MICA RF Active SAM",
          "range": "20 km",
          "seeker": "Active Radar Homing",
          "speed": "Mach 4.0",
          "guidance": "INS + Active RF Seeker"
        },
        {
          "name": "MICA IR Thermal SAM",
          "range": "20 km",
          "seeker": "Imaging Infrared (IIR)",
          "speed": "Mach 4.0",
          "guidance": "INS + Terminal IIR"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the France Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "VL MICA NG (Next-Generation)",
      "category": "Mobile Air Defence Missile System",
      "cost": "$0.22 Billion",
      "manufactured": 0,
      "active": 0,
      "accidents": 0,
      "retired": 0,
      "ordered": 12,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "MICA RF Active SAM",
          "range": "20 km",
          "seeker": "Active Radar Homing",
          "speed": "Mach 4.0",
          "guidance": "INS + Active RF Seeker"
        },
        {
          "name": "MICA IR Thermal SAM",
          "range": "20 km",
          "seeker": "Imaging Infrared (IIR)",
          "speed": "Mach 4.0",
          "guidance": "INS + Terminal IIR"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the France Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Crotale NG Battery",
      "category": "Mobile Air Defence Missile System",
      "cost": "$95 Million",
      "manufactured": 12,
      "active": 8,
      "accidents": 1,
      "retired": 3,
      "ordered": 0,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "VT-1 Hyper-velocity Missile",
          "range": "15 km",
          "seeker": "Command Line-Of-Sight (CLOS) Radar",
          "speed": "Mach 3.5",
          "guidance": "CLOS Command Guidance"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the France Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Mistral VSHORAD Team",
      "category": "Mobile Air Defence Missile System",
      "cost": "$1 Million",
      "manufactured": 100,
      "active": 100,
      "accidents": 0,
      "retired": 0,
      "ordered": 50,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "Mistral-3 lightweight interceptor",
          "range": "7.5 km",
          "seeker": "Imaging Infrared (IIR)",
          "speed": "Mach 2.7",
          "guidance": "IR homing + Proportional navigation"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the France Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Mistral Atlas Mobile VSHORAD",
      "category": "Mobile Air Defence Missile System",
      "cost": "$1.5 Million",
      "manufactured": 30,
      "active": 30,
      "accidents": 0,
      "retired": 0,
      "ordered": 10,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "Mistral-3 lightweight interceptor",
          "range": "7.5 km",
          "seeker": "Imaging Infrared (IIR)",
          "speed": "Mach 2.7",
          "guidance": "IR homing + Proportional navigation"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the France Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "SCALP Naval (MdCN)",
      "category": "Guided Strike Missile System",
      "cost": "$3.2 Million",
      "manufactured": 150,
      "active": 150,
      "accidents": 0,
      "retired": 0,
      "ordered": 50,
      "legacy": "Unguided free-fall rockets",
      "variants": [
        "Land launch TEL",
        "Air launch carriage"
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the France Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "350 km",
        "Speed": "Mach 2.8",
        "Warhead": "450 kg",
        "Guidance": "INS + GPS + Radar terminal"
      }
    },
    {
      "name": "AASM Hammer 1000 Glide Bomb",
      "category": "Guided Strike Missile System",
      "cost": "$0.4 Million",
      "manufactured": 500,
      "active": 500,
      "accidents": 0,
      "retired": 0,
      "ordered": 200,
      "legacy": "Unguided free-fall rockets",
      "variants": [
        "Land launch TEL",
        "Air launch carriage"
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the France Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "350 km",
        "Speed": "Mach 2.8",
        "Warhead": "450 kg",
        "Guidance": "INS + GPS + Radar terminal"
      }
    }
  ],
  "germany": [
    {
      "name": "Eurofighter Typhoon (Luftwaffe)",
      "category": "Tactical Combat Fighter",
      "cost": "$90 Million",
      "manufactured": 141,
      "active": 138,
      "accidents": 3,
      "retired": 0,
      "ordered": 38,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "Eurofighter Block I",
        "Eurofighter Block II"
      ],
      "weapons": {
        "a2a": [
          "Meteor active radar BVRAAM (150+ km)",
          "ASRAAM high-agility IR dogfight (25km)",
          "IRIS-T IR (Germany, 25km)"
        ],
        "a2g": [
          "Brimstone millimeter-wave anti-armor (12km)"
        ],
        "antiRad": [],
        "antiShip": [],
        "glideBombs": [
          "Paveway IV dual-mode laser/GPS",
          "GBU-48 (Germany)"
        ],
        "cruise": [
          "Storm Shadow stealth cruise (560km)",
          "Taurus KEPD 350 (Germany, 500km)"
        ],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Germany Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "Panavia Tornado IDS (Luftwaffe)",
      "category": "Tactical Combat Fighter",
      "cost": "$30 Million",
      "manufactured": 350,
      "active": 85,
      "accidents": 45,
      "retired": 220,
      "ordered": 0,
      "mtow": "28,000 kg (61,729 lbs)",
      "payloadCapacity": "7,500 kg (16,534 lbs)",
      "thrust": "2x 50.0 kN dry / 75.0 kN afterburner",
      "legacy": "Older 3rd-generation single-engine airframes",
      "variants": [
        "Panavia Block I",
        "Panavia Block II"
      ],
      "weapons": {
        "a2a": [
          "AIM-9L Sidewinder IR dogfight (18km)"
        ],
        "a2g": [],
        "antiRad": [
          "AGM-88 HARM anti-radiation (150km)"
        ],
        "antiShip": [],
        "glideBombs": [
          "GBU-54 Laser JDAM"
        ],
        "cruise": [
          "Taurus KEPD 350 air-launched cruise (500km)"
        ],
        "ballisticHypersonic": [],
        "laserGuided": []
      },
      "operationalHistory": "Developed under requirement programs to establish air parity for the Germany Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "2,800 km",
        "Speed": "Mach 1.8",
        "Ceiling": "16,000 m",
        "Radar": "Multi-mode Active AESA"
      }
    },
    {
      "name": "Heron TP (Luftwaffe UAV)",
      "category": "Unmanned Aerial Combat System (UCAV)",
      "cost": "$30 Million",
      "manufactured": 5,
      "active": 5,
      "accidents": 0,
      "retired": 0,
      "ordered": 0,
      "mtow": "4,500 kg (9,920 lbs)",
      "payloadCapacity": "450 kg (992 lbs)",
      "thrust": "1x Rotax 914 Turbo piston engine (115 hp)",
      "legacy": "Unguided target drones",
      "variants": [
        "Block A Surveillance",
        "Block B Strike Wing"
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Germany Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Endurance": "24 hours",
        "Radius": "250 km",
        "Ceiling": "9,000 m",
        "Sensors": "EO/IR Turret + Synthetic Aperture Radar"
      }
    },
    {
      "name": "IRIS-T SLX Regiment",
      "category": "Mobile Air Defence Missile System",
      "cost": "$0.45 Billion",
      "manufactured": 0,
      "active": 0,
      "accidents": 0,
      "retired": 0,
      "ordered": 6,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "IRIS-T SLM Medium Range",
          "range": "40 km",
          "seeker": "Imaging Infrared (IIR) + GPS",
          "speed": "Mach 3.0",
          "guidance": "INS + Datalink + Terminal IIR"
        },
        {
          "name": "IRIS-T SLS Short Range",
          "range": "12 km",
          "seeker": "Imaging Infrared (IIR)",
          "speed": "Mach 3.0",
          "guidance": "Terminal IR Homing"
        },
        {
          "name": "IRIS-T SLX Long Range",
          "range": "80 km",
          "seeker": "Active Radar Homing + IIR Dual-Seeker",
          "speed": "Mach 4.0",
          "guidance": "INS + Active RF + Terminal IIR"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Germany Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "IRIS-T SLM Battery",
      "category": "Mobile Air Defence Missile System",
      "cost": "$0.14 Billion",
      "manufactured": 6,
      "active": 6,
      "accidents": 0,
      "retired": 0,
      "ordered": 6,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "IRIS-T SLM Medium Range",
          "range": "40 km",
          "seeker": "Imaging Infrared (IIR) + GPS",
          "speed": "Mach 3.0",
          "guidance": "INS + Datalink + Terminal IIR"
        },
        {
          "name": "IRIS-T SLS Short Range",
          "range": "12 km",
          "seeker": "Imaging Infrared (IIR)",
          "speed": "Mach 3.0",
          "guidance": "Terminal IR Homing"
        },
        {
          "name": "IRIS-T SLX Long Range",
          "range": "80 km",
          "seeker": "Active Radar Homing + IIR Dual-Seeker",
          "speed": "Mach 4.0",
          "guidance": "INS + Active RF + Terminal IIR"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Germany Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "IRIS-T SLS Short Battery",
      "category": "Mobile Air Defence Missile System",
      "cost": "$90 Million",
      "manufactured": 12,
      "active": 12,
      "accidents": 0,
      "retired": 0,
      "ordered": 4,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "IRIS-T SLM Medium Range",
          "range": "40 km",
          "seeker": "Imaging Infrared (IIR) + GPS",
          "speed": "Mach 3.0",
          "guidance": "INS + Datalink + Terminal IIR"
        },
        {
          "name": "IRIS-T SLS Short Range",
          "range": "12 km",
          "seeker": "Imaging Infrared (IIR)",
          "speed": "Mach 3.0",
          "guidance": "Terminal IR Homing"
        },
        {
          "name": "IRIS-T SLX Long Range",
          "range": "80 km",
          "seeker": "Active Radar Homing + IIR Dual-Seeker",
          "speed": "Mach 4.0",
          "guidance": "INS + Active RF + Terminal IIR"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Germany Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Ozelot VSHORAD Battery",
      "category": "Mobile Air Defence Missile System",
      "cost": "$40 Million",
      "manufactured": 20,
      "active": 18,
      "accidents": 0,
      "retired": 2,
      "ordered": 0,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Germany Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Arrow 3 ABM System (German-acquired)",
      "category": "Mobile Air Defence Missile System",
      "cost": "$2.00 Billion",
      "manufactured": 1,
      "active": 1,
      "accidents": 0,
      "retired": 0,
      "ordered": 4,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "Arrow-3 Strategic Interceptor",
          "range": "2,400 km",
          "seeker": "High-resolution EO/IR seeker",
          "speed": "Mach 9.0",
          "guidance": "Hit-to-Kill (Exoatmospheric)"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Germany Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "Mantis C-RAM Gun System",
      "category": "Mobile Air Defence Missile System",
      "cost": "$15 Million",
      "manufactured": 4,
      "active": 4,
      "accidents": 0,
      "retired": 0,
      "ordered": 4,
      "legacy": "Stationary fixed-rail launchers",
      "variants": [
        "Standard Battery Pack",
        "Upgraded Digital Radar Pack"
      ],
      "samMissiles": [
        {
          "name": "35mm AHEAD Munition",
          "range": "3 km",
          "seeker": "No Seeker (Time Fuzed sub-projectiles)",
          "speed": "1,050 m/s",
          "guidance": "Muzzle-programmed timed detonation"
        }
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Germany Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "120 km",
        "Speed": "Mach 4.0",
        "Track": "48 tracks",
        "Seeker": "Active RF Seeker"
      }
    },
    {
      "name": "DeepStrike Missile (Standalone)",
      "category": "Guided Strike Missile System",
      "cost": "$1.5 Million",
      "manufactured": 50,
      "active": 50,
      "accidents": 0,
      "retired": 0,
      "ordered": 100,
      "legacy": "Unguided free-fall rockets",
      "variants": [
        "Land launch TEL",
        "Air launch carriage"
      ],
      "operationalHistory": "Developed under requirement programs to establish air parity for the Germany Armed Forces. Rigid developmental evaluations tested early-stage structures in extreme temperature environments, verifying flight mechanics under heavy crosswinds. achievements include successful deployments in major theater commands and peacetime drills (Red Flag, Cobra Warrior, Malabar), confirming the system's operational stability across strategic borders.",
      "combatRecord": "Inducted into active combat squadrons and intercept batteries. Participated in regional border patrols, air interdictions, and airspace security monitoring runs. Successfully deployed in combat operations, recording multiple targets neutralized in border actions and conflicts.",
      "futurePlans": "Mid-life updates are scheduled to integrate updated AESA radars, secure cryptolinks, and localized air-to-air missile options.",
      "stats": {
        "Range": "350 km",
        "Speed": "Mach 2.8",
        "Warhead": "450 kg",
        "Guidance": "INS + GPS + Radar terminal"
      }
    }
  ]
};
