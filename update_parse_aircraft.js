const fs = require('fs');
const path = require('path');

const projectRoot = `C:\\Users\\ganes\\.gemini\\antigravity-ide\\scratch`;
const parseScriptPath = path.join(projectRoot, 'parse_aircraft.js');

let content = fs.readFileSync(parseScriptPath, 'utf8');

const oldPattern = `  if (nameLower.includes('j-35a') || nameLower.includes('f-35a')) {
    return [
      { name: 'AIM-120D AMRAAM', type: 'CRUISE', speed: 4.0, range: 180, rcs: 0.05, altitude: 100, cost: 1.5, maxQty: 4, weightSlots: 1, set: 2, accuracy: 0.92 },
      { name: 'AIM-9X Sidewinder', type: 'CRUISE', speed: 2.5, range: 22,  rcs: 0.04, altitude: 100, cost: 0.4, maxQty: 2, weightSlots: 1, set: 2, accuracy: 0.88 }
    ];
  }`;

const newPattern = `  if (nameLower.includes('j-35a') || nameLower.includes('f-35')) {
    return [
      { name: 'AIM-120D AMRAAM', type: 'CRUISE', speed: 4.0, range: 180, rcs: 0.05, altitude: 100, cost: 1.5, maxQty: 4, weightSlots: 1, set: 2, accuracy: 0.92 },
      { name: 'AIM-9X Sidewinder', type: 'CRUISE', speed: 2.5, range: 22,  rcs: 0.04, altitude: 100, cost: 0.4, maxQty: 2, weightSlots: 1, set: 2, accuracy: 0.88 }
    ];
  }
  if (nameLower.includes('typhoon')) {
    return [
      { name: 'AIM-120D AMRAAM', type: 'CRUISE', speed: 4.0, range: 180, rcs: 0.05, altitude: 100, cost: 1.5, maxQty: 4, weightSlots: 1, set: 2, accuracy: 0.92 },
      { name: 'Meteor BVRAAM', type: 'CRUISE', speed: 4.0, range: 200, rcs: 0.05, altitude: 100, cost: 2.0, maxQty: 4, weightSlots: 1, set: 2, accuracy: 0.94 },
      { name: 'ASRAAM SRAAM', type: 'CRUISE', speed: 3.0, range: 25, rcs: 0.04, altitude: 100, cost: 0.4, maxQty: 2, weightSlots: 1, set: 2, accuracy: 0.86 },
      { name: 'Storm Shadow Cruise Missile', type: 'CRUISE', speed: 0.8, range: 560, rcs: 0.03, altitude: 50, cost: 3.0, maxQty: 2, weightSlots: 3, set: 1 }
    ];
  }
  if (nameLower.includes('rafale')) {
    return [
      { name: 'Meteor BVRAAM', type: 'CRUISE', speed: 4.0, range: 200, rcs: 0.05, altitude: 100, cost: 2.0, maxQty: 4, weightSlots: 1, set: 2, accuracy: 0.94 },
      { name: 'MICA IR/EM', type: 'CRUISE', speed: 4.0, range: 80, rcs: 0.04, altitude: 100, cost: 1.0, maxQty: 6, weightSlots: 1, set: 2, accuracy: 0.88 },
      { name: 'SCALP EG Cruise Missile', type: 'CRUISE', speed: 0.8, range: 560, rcs: 0.03, altitude: 50, cost: 3.0, maxQty: 2, weightSlots: 3, set: 1 }
    ];
  }
  if (nameLower.includes('mirage 2000')) {
    return [
      { name: 'MICA IR/EM', type: 'CRUISE', speed: 4.0, range: 80, rcs: 0.04, altitude: 100, cost: 1.0, maxQty: 4, weightSlots: 1, set: 2, accuracy: 0.88 },
      { name: 'SCALP EG Cruise Missile', type: 'CRUISE', speed: 0.8, range: 560, rcs: 0.03, altitude: 50, cost: 3.0, maxQty: 1, weightSlots: 3, set: 1 }
    ];
  }
  if (nameLower.includes('kf-21')) {
    return [
      { name: 'Meteor BVRAAM', type: 'CRUISE', speed: 4.0, range: 200, rcs: 0.05, altitude: 100, cost: 2.0, maxQty: 4, weightSlots: 1, set: 2, accuracy: 0.94 },
      { name: 'AIM-9X Sidewinder', type: 'CRUISE', speed: 2.5, range: 22, rcs: 0.04, altitude: 100, cost: 0.4, maxQty: 2, weightSlots: 1, set: 2, accuracy: 0.88 }
    ];
  }
  if (nameLower.includes('tornado')) {
    return [
      { name: 'Storm Shadow Cruise Missile', type: 'CRUISE', speed: 0.8, range: 560, rcs: 0.03, altitude: 50, cost: 3.0, maxQty: 2, weightSlots: 3, set: 1 }
    ];
  }
  if (nameLower.includes('heron') || nameLower.includes('global hawk')) {
    return []; // unarmed ISR UAVs
  }`;

if (content.includes(oldPattern)) {
  content = content.replace(oldPattern, newPattern);
  console.log("Updated parse_aircraft.js mappings successfully.");
} else {
  // Let's do a backup search with normalized spaces
  console.error("Could not find old pattern in parse_aircraft.js.");
}

fs.writeFileSync(parseScriptPath, content, 'utf8');
