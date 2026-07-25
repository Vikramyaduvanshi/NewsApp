// ===============================================
// FEATURE FUNCTIONS ENGINE
// file: featureFunctions.js
// Raw market data -> Meaningful signals
// ===============================================

// -------------------------------
// Helper Functions
// -------------------------------
function num(val) {
  if (val === "" || val === null || val === undefined) return 0;
  return Number(String(val).replace(/[,%x₹,]/g, "").trim()) || 0;
}

function avg(arr) {
  if (!arr || arr.length === 0) return 0;
  return arr.reduce((a, b) => a + num(b), 0) / arr.length;
}

function pctChange(oldVal, newVal) {
  if (!oldVal) return 0;
  return ((newVal - oldVal) / oldVal) * 100;
}

// -------------------------------
// 1. Technical State
// -------------------------------
function technicalState(data) {
  let price = num(data.currentPrice);
  let dma50 = num(data.dma50);
  let dma200 = num(data.dma200);
  let rsi = num(data.rsi);

  let trend = "Neutral";

  if (price > dma50 && dma50 > dma200) trend = "Strong Uptrend";
  else if (price > dma200 && price < dma50) trend = "Pullback In Uptrend";
  else if (price < dma50 && price > dma200) trend = "Weak";
  else if (price < dma200) trend = "Downtrend";

  let momentum = "Neutral";
  if (rsi > 70) momentum = "Overbought";
  else if (rsi > 55) momentum = "Bullish";
  else if (rsi < 30) momentum = "Oversold";
  else if (rsi < 45) momentum = "Weak";

  return {
    trend,
    momentum,
    above50DMA: price > dma50,
    above200DMA: price > dma200
  };
}

// -------------------------------
// 2. Fundamental Quality
// -------------------------------
function fundamentalScore(data) {
  let score = 0;

  let roe = num(data.roe);
  let roce = num(data.roce);
  let pe = num(data.pe);
  let growth = num(data.salesGrowthYoY);
  let profit = num(data.profitGrowthYoY);
  let opm = num(data.opm);

  if (roe > 20) score += 20;
  if (roce > 20) score += 20;
  if (growth > 15) score += 15;
  if (profit > 15) score += 15;
  if (opm > 20) score += 15;

  if (pe < 25) score += 15;
  else if (pe < 40) score += 10;
  else if (pe < 60) score += 5;

  return {
    score,
    quality:
      score >= 80
        ? "Excellent"
        : score >= 60
        ? "Strong"
        : score >= 40
        ? "Average"
        : "Weak"
  };
}

// -------------------------------
// 3. EPS Trend
// -------------------------------
function epsTrend(eps) {
  if (!eps || eps.length < 4) return "Not enough data";

  let last4 = eps.slice(-4);
  let rising = 0;

  for (let i = 1; i < last4.length; i++) {
    if (num(last4[i]) > num(last4[i - 1])) rising++;
  }

  if (rising >= 3) return "Strong Rising";
  if (rising === 2) return "Improving";
  return "Unstable";
}

// -------------------------------
// 4. Delivery Analysis
// -------------------------------
function deliverySignal(data) {
  let avgDel = num(data.avg7DayDelivery);
  let curr = num(data.currentDelivery);

  if (curr > avgDel + 3) return "Heavy Accumulation";
  if (curr > avgDel) return "Mild Accumulation";
  if (curr < avgDel - 3) return "Distribution";

  return "Neutral";
}

// -------------------------------
// 5. FII DII Flow
// -------------------------------
function fiiDiiSignal(arr) {
  let fii = arr.find(x => x.category.includes("FII"));
  let dii = arr.find(x => x.category.includes("DII"));

  let fiiNet = fii ? num(fii.netValue) : 0;
  let diiNet = dii ? num(dii.netValue) : 0;

  let mood = "Neutral";

  if (fiiNet > 0 && diiNet > 0) mood = "Strong Bullish";
  else if (fiiNet < 0 && diiNet > 0) mood = "Domestic Support";
  else if (fiiNet < 0 && diiNet < 0) mood = "Bearish";

  return {
    fiiNet,
    diiNet,
    mood
  };
}

// -------------------------------
// 6. News Sentiment
// -------------------------------
function newsSignal(newsArray) {
  let positive = 0;
  let negative = 0;

  const posWords = [
    "order","contract","profit","buy","upgrade",
    "growth","wins","deal","target","upside"
  ];

  const negWords = [
    "fraud","loss","falls","drops","raid",
    "probe","downgrade","penalty"
  ];

  for (let item of newsArray) {
    let text = (item.title + " " + item.article).toLowerCase();

    posWords.forEach(w => {
      if (text.includes(w)) positive++;
    });

    negWords.forEach(w => {
      if (text.includes(w)) negative++;
    });
  }

  let sentiment = "Neutral";
  if (positive > negative) sentiment = "Positive";
  if (negative > positive) sentiment = "Negative";

  return {
    positiveHits: positive,
    negativeHits: negative,
    sentiment
  };
}

// -------------------------------
// 7. Priced In Detector
// -------------------------------
function pricedInScore({
  priceVs50dma,
  rsi,
  positiveNewsCount,
  pe
}) {
  let score = 0;

  if (priceVs50dma > 3) score += 25;
  if (rsi > 65) score += 25;
  if (positiveNewsCount >= 3) score += 25;
  if (pe > 40) score += 25;

  return {
    score,
    status:
      score >= 75
        ? "Highly Priced In"
        : score >= 45
        ? "Partially Priced In"
        : "Not Priced In"
  };
}

// -------------------------------
// 8. Final Conviction Score
// -------------------------------
function finalScore({
  technical,
  fundamental,
  delivery,
  news,
  pricedIn
}) {
  let score = 0;

  if (technical.trend.includes("Uptrend")) score += 20;
  if (technical.momentum === "Bullish") score += 10;

  score += fundamental.score * 0.3;

  if (delivery.includes("Accumulation")) score += 15;

  if (news.sentiment === "Positive") score += 15;
  if (news.sentiment === "Negative") score -= 15;

  score -= pricedIn.score * 0.15;

  score = Math.max(0, Math.min(100, Math.round(score)));

  let verdict =
    score >= 75
      ? "Strong Bullish"
      : score >= 60
      ? "Bullish"
      : score >= 45
      ? "Neutral"
      : "Weak";

  return { score, verdict };
}

// -------------------------------
// EXPORTS
// -------------------------------
module.exports = {
  technicalState,
  fundamentalScore,
  epsTrend,
  deliverySignal,
  fiiDiiSignal,
  newsSignal,
  pricedInScore,
  finalScore
};