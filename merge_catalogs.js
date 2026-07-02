const fs = require('fs');
const path = require('path');

const projectRoot = `c:\\Users\\ganes\\OneDrive\\Desktop\\project\\air defence project`;
const extractedPath = path.join(projectRoot, 'defence_catalog_extracted.json');
const simPagePath = path.join(projectRoot, 'apps', 'web', 'src', 'app', '(dashboard)', 'simulation', 'new', 'page.tsx');

const extracted = JSON.parse(fs.readFileSync(extractedPath, 'utf8'));
const simContent = fs.readFileSync(simPagePath, 'utf8');

// The original 11 Indian/joint systems in simulation page
const originalIndianIds = ['d1', 'd2b', 'd2', 'd3', 'd3a', 'd3b', 'd4b', 'd4', 'd5b', 'd5', 'd6'];

// Let's parse the original 11 systems from simContent to preserve their exact metrics
// We can locate them in DEFENCE_CATALOG
const startPattern = 'const DEFENCE_CATALOG: DefenceItem[] = [';
const startIndex = simContent.indexOf(startPattern);
if (startIndex === -1) {
  console.error("Could not find DEFENCE_CATALOG in simulation page");
  process.exit(1);
}
const endIndex = simContent.indexOf('];', startIndex);
if (endIndex === -1) {
  console.error("Could not find closing ]; of DEFENCE_CATALOG");
  process.exit(1);
}

const originalCatalogText = simContent.substring(startIndex + startPattern.length - 1, endIndex + 2);
let originalCatalog = [];
try {
  originalCatalog = new Function(`return ${originalCatalogText}`)();
} catch (e) {
  console.error("Failed to parse original catalog text:", e);
  process.exit(1);
}

console.log(`Parsed ${originalCatalog.length} original systems from simulation page.`);

// Map original catalog items to have country: 'india'
const updatedOriginalCatalog = originalCatalog.map(item => {
  return {
    ...item,
    country: 'india'
  };
});

// Now, get the non-Indian systems from the extracted catalogue
// Note: some extracted systems might be Indian (e.g. they have country 'india'), we filter them out to avoid duplicates
const nonIndianNewSystems = extracted.filter(sys => {
  // If it's in originalIndianIds, we skip it
  if (originalIndianIds.includes(sys.id)) return false;
  // If it's indian, we skip it since we already have the calibrated Indian systems
  if (sys.country === 'india') return false;
  return true;
});

console.log(`Found ${nonIndianNewSystems.length} new non-Indian systems to add.`);

// Merge them
const mergedCatalog = [...updatedOriginalCatalog, ...nonIndianNewSystems];
console.log(`Merged catalog size: ${mergedCatalog.length}`);

// Write the merged catalog as formatted JS text to insert
fs.writeFileSync(
  path.join(projectRoot, 'merged_defence_catalog.json'),
  JSON.stringify(mergedCatalog, null, 2)
);
console.log("Successfully wrote merged_defence_catalog.json");
