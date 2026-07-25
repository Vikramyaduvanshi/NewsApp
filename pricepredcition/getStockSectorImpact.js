/**
 * Institutional Sector Intelligence System - Raw Data Output
 */

const getNSEData = require("./SectorIndex");
const getTechnicalData = require("./TechnicalAnalyse");
const sectorMapping = require("./sector_mapping.json");

// --- SECTOR IMPACT ENGINE ---
// 1. Pre-compute Map (Ise function ke bahar rakhein, sirf ek baar chalega)
const aliasMap = new Map();

for (const cat in sectorMapping.engine) {
    for (const indexName in sectorMapping.engine[cat]) {
        const config = sectorMapping.engine[cat][indexName];
        config.aliases.forEach(alias => {
            // Alias ko key banaya aur Index Name + Priority ko value
            aliasMap.set(alias.toLowerCase(), {
                indexName,
                priority: config.priority
            });
        });
    }
}

function sectorimpact(technical, nsedata) {
    const sectors = nsedata.sectors || [];
    const yahooIndustry = (technical.industry || "").toLowerCase().trim();
    const yahooSector = (technical.sector || "").toLowerCase().trim();

    // --- STRATEGY 1: DIRECT HASH MAP LOOKUP (Fastest - O(1)) ---
    // Pehle industry ko check karo, phir sector ko
    let matchConfig = aliasMap.get(yahooIndustry) || aliasMap.get(yahooSector);

    if (matchConfig) {
        const found = sectors.find(s => s.indexName === matchConfig.indexName || s.symbol === matchConfig.indexName);
        if (found) return found;
    }

    // --- STRATEGY 2: NORMALIZED INDEX LOOKUP (Fast - O(N)) ---
    // Agar direct nahi mila, toh normalization sirf ek baar karke Map banalo
    const normalize = (str) => String(str || "").replace(/[^A-Z0-9]/g, '').toUpperCase();
    
    // NSE Data ko Map mein dalo lookup fast karne ke liye
    const nseMap = new Map(sectors.map(s => [normalize(s.indexName), s]));

    // Industry ke words split karke dhoondo
    const words = `${yahooIndustry} ${yahooSector}`.split(/[\s&,-]+/);
    for (const word of words) {
        const cleanWord = normalize(word);
        if (cleanWord.length < 4) continue;
        
        if (nseMap.has(cleanWord)) return nseMap.get(cleanWord);
    }

    // --- STRATEGY 3: GLOBAL FALLBACK ---
    const fb = sectorMapping.rules.global_fallback;
    return nseMap.get(normalize(fb)) || nseMap.get("NIFTY500") || "stock not find";
}
// --- MAIN FUNCTION ---
async function sector_mapping(ticker="BEL.NS") {
    try {
        const technical = await getTechnicalData(ticker);
        const nsedata = await getNSEData("full");

        if (!technical || !nsedata) {
            return null; // safety
        }

        const nseObject = sectorimpact(technical, nsedata);

        return nseObject || null; // ✅ always return something

    } catch (error) {
        console.error("Error:", error.message);
        return null; // ✅ MUST
    }
}

module.exports=sector_mapping