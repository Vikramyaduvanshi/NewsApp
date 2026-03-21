const detectAssets = (text) => {
  text = text.toLowerCase();

  const assets = new Set();

  // 💱 Forex
  if (text.includes("eur")) assets.add("EUR/USD");
  if (text.includes("jpy")) assets.add("USD/JPY");
  if (text.includes("gbp")) assets.add("GBP/USD");
  if (text.includes("aud")) assets.add("AUD/USD");
  if (text.includes("cad")) assets.add("USD/CAD");
  if (text.includes("chf")) assets.add("USD/CHF");
  if (text.includes("nzd")) assets.add("NZD/USD");

  // 🇮🇳 INR
  if (
    text.includes("inr") ||
    text.includes("rbi") ||
    text.includes("india")
  ) {
    assets.add("USD/INR");
  }

  // 🪙 Commodities
  if (text.includes("gold")) assets.add("XAU/USD");

  // 🔥 Oil FIX
  if (text.includes("oil") || text.includes("crude")) assets.add("WTI");
  if (text.includes("brent")) assets.add("BRENT");

  // 🏦 Central Banks
  if (text.includes("fed")) {
    assets.add("XAU/USD");
    assets.add("USD/JPY");
  }

  if (text.includes("ecb")) assets.add("EUR/USD");
  if (text.includes("boe")) assets.add("GBP/USD");
  if (text.includes("boc")) assets.add("USD/CAD");
  if (text.includes("boj")) assets.add("USD/JPY");

  // 🏦 Macro
  if (text.includes("inflation") || text.includes("cpi")) {
    assets.add("XAU/USD");
  }

  if (text.includes("employment") || text.includes("nfp")) {
    assets.add("USD/JPY");
  }

  // 🪙 Crypto (FIXED)
  if (text.includes("bitcoin") || text.includes("btc")) assets.add("BTC/USDT");
  if (text.includes("ethereum") || text.includes("eth")) assets.add("ETH/USDT");

  return Array.from(assets);
};

module.exports = detectAssets;