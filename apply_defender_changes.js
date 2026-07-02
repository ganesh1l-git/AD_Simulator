const fs = require('fs');
const path = require('path');

const projectRoot = `c:\\Users\\ganes\\OneDrive\\Desktop\\project\\air defence project`;
const simPagePath = path.join(projectRoot, 'apps', 'web', 'src', 'app', '(dashboard)', 'simulation', 'new', 'page.tsx');

let content = fs.readFileSync(simPagePath, 'utf8');

// 1. Add import
const importPattern = "import { getMissileThreatMultiplier } from '@iades/shared';";
if (content.includes(importPattern)) {
  if (!content.includes("import mergedDefenceCatalog from './merged_defence_catalog.json';")) {
    content = content.replace(
      importPattern,
      importPattern + "\nimport mergedDefenceCatalog from './merged_defence_catalog.json';"
    );
    console.log("Import statement added.");
  } else {
    console.log("Import statement already exists.");
  }
} else {
  console.error("Could not find import pattern!");
}

// 2. Add accuracy to WeaponItem
const weaponItemPattern = "interface WeaponItem {\n  name: string;\n  type: 'CRUISE' | 'GLIDE_BOMB' | 'ROCKET';\n  speed: number; // Mach\n  range: number; // km\n  rcs: number; // m²\n  altitude: number; // meters\n  cost: number; // USD Millions\n  maxQty: number;\n  weightSlots: number;\n  set?: 1 | 2;\n}";
const weaponItemPatternCRLF = "interface WeaponItem {\r\n  name: string;\r\n  type: 'CRUISE' | 'GLIDE_BOMB' | 'ROCKET';\r\n  speed: number; // Mach\r\n  range: number; // km\r\n  rcs: number; // m²\r\n  altitude: number; // meters\r\n  cost: number; // USD Millions\r\n  maxQty: number;\r\n  weightSlots: number;\r\n  set?: 1 | 2;\r\n}";

if (content.includes(weaponItemPattern)) {
  content = content.replace(
    weaponItemPattern,
    weaponItemPattern.replace("set?: 1 | 2;\n}", "set?: 1 | 2;\n  accuracy?: number;\n}")
  );
  console.log("accuracy added to WeaponItem (LF).");
} else if (content.includes(weaponItemPatternCRLF)) {
  content = content.replace(
    weaponItemPatternCRLF,
    weaponItemPatternCRLF.replace("set?: 1 | 2;\r\n}", "set?: 1 | 2;\r\n  accuracy?: number;\r\n}")
  );
  console.log("accuracy added to WeaponItem (CRLF).");
} else {
  console.error("Could not find WeaponItem pattern!");
}

// 3. Add country to ThreatItem
const threatItemPattern = "interface ThreatItem {\n  id: string;\n  name: string;\n  type: 'BALLISTIC' | 'CRUISE' | 'FIGHTER' | 'UAV' | 'SWARM' | 'HYPERSONIC' | 'GLIDE_BOMB' | 'ROCKET' | 'LOITERING_MUNITION' | 'TACTICAL_MISSILE';\n  speed: number; // Mach\n  altitude: number; // meters\n  rcs: number; // m²\n  threatScore: number;\n  cost: number; // in USD Millions (base price without weapons)\n  color: string;\n  maxSlots?: number;\n  weaponsCatalog?: WeaponItem[];\n}";
const threatItemPatternCRLF = "interface ThreatItem {\r\n  id: string;\r\n  name: string;\r\n  type: 'BALLISTIC' | 'CRUISE' | 'FIGHTER' | 'UAV' | 'SWARM' | 'HYPERSONIC' | 'GLIDE_BOMB' | 'ROCKET' | 'LOITERING_MUNITION' | 'TACTICAL_MISSILE';\r\n  speed: number; // Mach\r\n  altitude: number; // meters\r\n  rcs: number; // m²\r\n  threatScore: number;\r\n  cost: number; // in USD Millions (base price without weapons)\r\n  color: string;\r\n  maxSlots?: number;\r\n  weaponsCatalog?: WeaponItem[];\r\n}";

if (content.includes(threatItemPattern)) {
  content = content.replace(
    threatItemPattern,
    threatItemPattern.replace("weaponsCatalog?: WeaponItem[];\n}", "weaponsCatalog?: WeaponItem[];\n  country?: string;\n}")
  );
  console.log("country added to ThreatItem (LF).");
} else if (content.includes(threatItemPatternCRLF)) {
  content = content.replace(
    threatItemPatternCRLF,
    threatItemPatternCRLF.replace("weaponsCatalog?: WeaponItem[];\r\n}", "weaponsCatalog?: WeaponItem[];\r\n  country?: string;\r\n}")
  );
  console.log("country added to ThreatItem (CRLF).");
} else {
  console.error("Could not find ThreatItem pattern!");
}

// 4. Add country to interface DefenceItem
const interfacePattern = "interface DefenceItem {\n  id: string;\n  name: string;\n  category: 'LONG_RANGE' | 'MEDIUM_RANGE' | 'SHORT_RANGE' | 'VERY_SHORT_RANGE' | 'RADAR';\n  batteryCost: number; // USD Millions";
const interfacePatternCRLF = "interface DefenceItem {\r\n  id: string;\r\n  name: string;\r\n  category: 'LONG_RANGE' | 'MEDIUM_RANGE' | 'SHORT_RANGE' | 'VERY_SHORT_RANGE' | 'RADAR';\r\n  batteryCost: number; // USD Millions";

if (content.includes(interfacePattern)) {
  content = content.replace(
    interfacePattern,
    interfacePattern.replace("batteryCost: number; // USD Millions", "country?: string;\n  batteryCost: number; // USD Millions")
  );
  console.log("Country added to interface (LF).");
} else if (content.includes(interfacePatternCRLF)) {
  content = content.replace(
    interfacePatternCRLF,
    interfacePatternCRLF.replace("batteryCost: number; // USD Millions", "country?: string;\r\n  batteryCost: number; // USD Millions")
  );
  console.log("Country added to interface (CRLF).");
} else {
  console.error("Could not find interface pattern!");
}

// 5. Replace DEFENCE_CATALOG array
const startPattern = "const DEFENCE_CATALOG: DefenceItem[] = [";
const startIndex = content.indexOf(startPattern);
if (startIndex !== -1) {
  // Find the closing ];
  const endIndex = content.indexOf("];", startIndex);
  if (endIndex !== -1) {
    const before = content.substring(0, startIndex);
    const after = content.substring(endIndex + 2);
    content = before + "const DEFENCE_CATALOG: DefenceItem[] = mergedDefenceCatalog as DefenceItem[];" + after;
    console.log("DEFENCE_CATALOG array replaced.");
  } else {
    console.error("Could not find closing ]; for DEFENCE_CATALOG!");
  }
} else {
  console.log("DEFENCE_CATALOG already replaced.");
}

fs.writeFileSync(simPagePath, content, 'utf8');
console.log("Done modifying simulation/new/page.tsx successfully.");
