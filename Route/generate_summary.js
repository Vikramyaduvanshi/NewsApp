// import OpenAI from "openai";
let OpenAI=require("openai")


const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const generateSummary = async (title, description, content, priceData) => {
  const stream = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
content: `
You are a professional forex and macro trader with deep knowledge of global markets.

Analyze the given news and live market data like a real trader .

NEWS:
Title: ${title}
Description: ${description}
Content: ${content}

LIVE MARKET DATA:
${JSON.stringify(priceData)}

INSTRUCTIONS:

- Focus on macro impact (inflation, interest rates, central banks, geopolitics)
- Use correct forex pair format (e.g., EUR/USD, GBP/USD, USD/JPY — NEVER USD/EUR)
- Think in terms of money flow (where capital is moving)
- Consider safe haven assets (Gold, JPY) during risk-off
- Use price data to support your reasoning

OUTPUT FORMAT:

1. 📰 Summary:
- Explain what happened and WHY (macro reason, not just news)

2. 📊 Market Sentiment:
- Clearly state Bullish/Bearish/Neutral
- Mention WHY (rates, inflation, risk sentiment)

3. 💱 Affected Assets:
- List assets with direction (↑ / ↓)

4. ⚡ Trade Ideas:
- Give 2-3 trade setups
- Use correct pairs (EUR/USD, XAU/USD etc.)
- Mention clear reasoning (no generic lines)

5. ⚠️ Risk Factors:
- Mention realistic invalidation scenarios (what can reverse the trade)

6. 📈 Confidence Score:
- Give a confidence score (0-100) based on strength of news + macro alignment

RULES:
- Keep it short but sharp
- No generic answers
- Think like a trader, not a news reporter
`,
      },
    ],
    stream: true,
  });

  let result = "";

  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content || "";
    process.stdout.write(text);
    result += text;
  }

  return result;
};
module.exports=generateSummary