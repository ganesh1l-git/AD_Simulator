const fs = require('fs');
const path = require('path');

const projectRoot = `c:\\Users\\ganes\\OneDrive\\Desktop\\project\\air defence project`;
const encPath = path.join(projectRoot, 'apps', 'web', 'src', 'app', '(dashboard)', 'encyclopedia', 'page.tsx');
const encContent = fs.readFileSync(encPath, 'utf8');

// Find the start and end of DEFENDER_SYSTEMS array
const startPattern = 'const DEFENDER_SYSTEMS: EncyclopediaItem[] = [';
const startIndex = encContent.indexOf(startPattern);
if (startIndex === -1) {
  console.error("Could not find start of DEFENDER_SYSTEMS");
  process.exit(1);
}

// Find the end index: const ATTACKER_SYSTEMS
const endPattern = 'const ATTACKER_SYSTEMS: EncyclopediaItem[] = [';
const endIndex = encContent.indexOf(endPattern, startIndex);
if (endIndex === -1) {
  console.error("Could not find end of DEFENDER_SYSTEMS");
  process.exit(1);
}

let arrayText = encContent.substring(startIndex + startPattern.length - 1, endIndex).trim();
// Find the last closing bracket before const ATTACKER_SYSTEMS
const lastBracket = arrayText.lastIndexOf('];');
if (lastBracket !== -1) {
  arrayText = arrayText.substring(0, lastBracket + 1);
}

// Evaluate it safely
let defenderSystems = [];
try {
  defenderSystems = new Function(`return ${arrayText}`)();
} catch (e) {
  console.error("Failed to parse DEFENDER_SYSTEMS:", e);
  process.exit(1);
}

console.log(`Successfully parsed ${defenderSystems.length} defender systems.`);

// Helper function to extract number from string (e.g. "$1090 Million" -> 1090, "400 km" -> 400, "Mach 12" -> 12, "92%" -> 0.92)
function getVal(str) {
  if (!str) return 0;
  const match = str.replace(/[$,%]/g, '').match(/[\d\.]+/);
  return match ? parseFloat(match[0]) : 0;
}

// Map to DefenceItem structure
const defenceCatalog = defenderSystems.map(sys => {
  const isRadar = sys.category === 'RADAR';
  
  // Set default values based on category
  let defaultRadarRange = 50;
  let defaultAmmo = 16;
  let minAlt = 10;
  let maxAlt = 20000;
  let speed = 3.0;
  
  if (sys.category === 'LONG_RANGE') {
    defaultRadarRange = 400;
    defaultAmmo = 64;
    minAlt = 10;
    maxAlt = 30000;
    speed = 6.0;
  } else if (sys.category === 'MEDIUM_RANGE') {
    defaultRadarRange = 120;
    defaultAmmo = 48;
    minAlt = 15;
    maxAlt = 20000;
    speed = 4.0;
  } else if (sys.category === 'SHORT_RANGE') {
    defaultRadarRange = 50;
    defaultAmmo = 24;
    minAlt = 20;
    maxAlt = 15000;
    speed = 3.0;
  } else if (sys.category === 'VERY_SHORT_RANGE') {
    defaultRadarRange = 10;
    defaultAmmo = 8;
    minAlt = 5;
    maxAlt = 10000;
    speed = 2.0;
  } else if (sys.category === 'RADAR') {
    defaultRadarRange = 500;
    defaultAmmo = 0;
    minAlt = 0;
    maxAlt = 30000;
    speed = 0;
  }
  
  const primaryMissile = sys.missiles && sys.missiles[0];
  const range = primaryMissile ? getVal(primaryMissile.range) : (isRadar ? defaultRadarRange : 50);
  const accuracy = primaryMissile ? getVal(primaryMissile.accuracy) / 100 : (isRadar ? 0 : 0.8);
  const missileName = primaryMissile ? primaryMissile.name : 'None';
  const missileCost = primaryMissile ? getVal(primaryMissile.cost) : 0;
  
  const parsedSpeed = primaryMissile ? getVal(primaryMissile.speed) : speed;
  const parsedMinAlt = (primaryMissile && primaryMissile.minAlt) ? getVal(primaryMissile.minAlt) : minAlt;
  const parsedMaxAlt = (primaryMissile && primaryMissile.maxAlt) ? getVal(primaryMissile.maxAlt) : maxAlt;
  
  // Set color depending on country/category
  let color = '#ef4444'; // default red
  if (sys.country.toLowerCase().includes('india')) color = '#00b4d8';
  else if (sys.category === 'MEDIUM_RANGE') color = '#f59e0b';
  else if (sys.category === 'SHORT_RANGE') color = '#00ff88';
  else if (sys.category === 'VERY_SHORT_RANGE') color = '#00b4d8';
  else if (sys.category === 'RADAR') color = '#6366f1';
  
  const missileOptions = sys.missiles ? sys.missiles.map(m => {
    const mRange = getVal(m.range);
    const mSpeed = getVal(m.speed);
    const mCost = getVal(m.cost);
    const mAccuracy = getVal(m.accuracy) / 100;
    return {
      name: m.name,
      range: mRange,
      speed: mSpeed,
      cost: mCost,
      accuracy: mAccuracy,
      minAlt: parsedMinAlt,
      maxAlt: parsedMaxAlt,
      description: m.description || m.type
    };
  }) : undefined;
  
  const composition = sys.composition ? sys.composition.map(c => {
    return {
      name: c.name,
      type: c.type,
      qty: getVal(c.qty) || 1
    };
  }) : undefined;
  
  // Clean country name to match keys (e.g. 'Russia' -> 'russia')
  const cleanCountry = sys.country.split('/')[0].trim().toLowerCase().replace(/\s+/g, '_');
  
  return {
    id: sys.id.replace('def-', ''),
    name: sys.name,
    category: sys.category,
    batteryCost: getVal(sys.cost),
    missileCost,
    missileName,
    range,
    radarRange: isRadar ? range : defaultRadarRange,
    defaultAmmo,
    minAlt: parsedMinAlt,
    maxAlt: parsedMaxAlt,
    accuracy,
    color,
    speed: parsedSpeed,
    country: cleanCountry,
    missileOptions,
    composition
  };
});

fs.writeFileSync(
  path.join(__dirname, 'defence_catalog_extracted.json'),
  JSON.stringify(defenceCatalog, null, 2)
);
console.log("Successfully extracted and wrote defence_catalog_extracted.json");
