const fs = require('fs');
const path = require('path');

const projectRoot = `c:\\Users\\ganes\\OneDrive\\Desktop\\project\\air defence project`;
const simPagePath = path.join(projectRoot, 'apps', 'web', 'src', 'app', '(dashboard)', 'simulation', 'new', 'page.tsx');

let content = fs.readFileSync(simPagePath, 'utf8');

const countryMetaText = `
const COUNTRY_META = {
  "india": {
    "label": "India",
    "flag": "🇮🇳",
    "color": "#00b4d8",
    "defColor": "#00b4d8"
  },
  "pakistan": {
    "label": "Pakistan",
    "flag": "🇵🇰",
    "color": "#ef4444",
    "defColor": "#ef4444"
  },
  "usa": {
    "label": "USA",
    "flag": "🇺🇸",
    "color": "#3b82f6",
    "defColor": "#3b82f6"
  },
  "china": {
    "label": "China",
    "flag": "🇨🇳",
    "color": "#ef4444",
    "defColor": "#ef4444"
  },
  "russia": {
    "label": "Russia",
    "flag": "🇷🇺",
    "color": "#dc2626",
    "defColor": "#dc2626"
  },
  "japan": {
    "label": "Japan",
    "flag": "🇯🇵",
    "color": "#f97316",
    "defColor": "#f97316"
  },
  "south_korea": {
    "label": "South Korea",
    "flag": "🇰🇷",
    "color": "#22d3ee",
    "defColor": "#22d3ee"
  },
  "uk": {
    "label": "UK",
    "flag": "🇬🇧",
    "color": "#6366f1",
    "defColor": "#6366f1"
  },
  "france": {
    "label": "France",
    "flag": "🇫🇷",
    "color": "#a78bfa",
    "defColor": "#a78bfa"
  },
  "germany": {
    "label": "Germany",
    "flag": "🇩🇪",
    "color": "#facc15",
    "defColor": "#facc15"
  }
};
`;

// 1. Add COUNTRY_META before SimulationPage
const compPattern = "export default function SimulationPage() {";
if (content.includes(compPattern) && !content.includes("const COUNTRY_META = {")) {
  content = content.replace(
    compPattern,
    countryMetaText + "\n" + compPattern
  );
  console.log("COUNTRY_META added.");
} else {
  console.log("COUNTRY_META already added or main component not found.");
}

// 2. Add defCountryTab state inside SimulationPage
const statePattern = "const [phase, setPhase] = useState<SimPhase>('config');";
if (content.includes(statePattern) && !content.includes("const [defCountryTab, setDefCountryTab]")) {
  content = content.replace(
    statePattern,
    statePattern + "\n  const [defCountryTab, setDefCountryTab] = useState<string>('india');"
  );
  console.log("defCountryTab state added.");
} else {
  console.log("defCountryTab state already added or phase state not found.");
}

// 3. Replace Defender Systems Catalogue rendering with country tab filter
const catalogStartPattern = `{/* Catalog (Right) */}
          <div className="lg:col-span-2 card p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#00ff88] uppercase tracking-wider">Defender Systems Catalogue</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DEFENCE_CATALOG.map(sys => (`;

const catalogStartPatternCRLF = `{/* Catalog (Right) */}\r
          <div className="lg:col-span-2 card p-5 space-y-4">\r
            <h3 className="text-sm font-semibold text-[#00ff88] uppercase tracking-wider">Defender Systems Catalogue</h3>\r
            \r
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">\r
              {DEFENCE_CATALOG.map(sys => (`;

const catalogReplacement = `{/* Catalog (Right) */}
          <div className="lg:col-span-2 card p-5 space-y-4">
            <div className="flex flex-wrap gap-4 items-center justify-between border-b border-white/[0.05] pb-3">
              <h3 className="text-sm font-semibold text-[#00ff88] uppercase tracking-wider">Defender Systems Catalogue</h3>
              
              {/* Section Tabs */}
              <div className="flex flex-wrap gap-1 bg-white/[0.02] border border-white/5 p-0.5 rounded-lg">
                {Object.keys(COUNTRY_META).map(cid => {
                  const meta = COUNTRY_META[cid as keyof typeof COUNTRY_META];
                  return (
                    <button
                      key={cid}
                      type="button"
                      onClick={() => setDefCountryTab(cid)}
                      className={\`px-2 py-1 rounded text-[10px] font-bold transition-all \${
                        defCountryTab === cid
                          ? 'bg-white/10 text-white shadow-sm'
                          : 'text-[#6b7280] hover:text-white'
                      }\`}
                    >
                      {meta.flag} {meta.label}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {DEFENCE_CATALOG.filter(sys => (sys.country || 'india') === defCountryTab).map(sys => (`;

if (content.includes(catalogStartPattern)) {
  content = content.replace(catalogStartPattern, catalogReplacement);
  console.log("Defender Systems Catalogue UI updated (LF).");
} else if (content.includes(catalogStartPatternCRLF)) {
  content = content.replace(catalogStartPatternCRLF, catalogReplacement);
  console.log("Defender Systems Catalogue UI updated (CRLF).");
} else {
  // Let's do a more search pattern match
  const fallbackHeader = '<h3 className="text-sm font-semibold text-[#00ff88] uppercase tracking-wider">Defender Systems Catalogue</h3>';
  if (content.includes(fallbackHeader)) {
    console.log("Found Defender Systems Catalogue header in fallback check.");
  } else {
    console.error("Could not find Defender Systems Catalogue section!");
  }
}

fs.writeFileSync(simPagePath, content, 'utf8');
console.log("Done adding country filters.");
