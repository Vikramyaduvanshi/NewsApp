let OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const generateDomesticSummary = async (companyName, rawText) => {
  const stream = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `
You are a professional Indian stock market analyst.

Analyze the given company announcement and convert it into simple, user-friendly stock market news.

COMPANY:
${companyName}

DOCUMENT TEXT:
${rawText}

INSTRUCTIONS:

- Explain in simple language (retail investor friendly)
- Focus on business impact with amount if include(orders,projects, expansion, results, management changes)
- Identify if news is Positive / Negative / Neutral
- Avoid technical jargon
- Keep it short and clear

OUTPUT FORMAT:

1. 📰 Headline:
- One short, clear headline (like StockEdge)

2. 📄 Summary:
- 2-3 lines explaining what happened

3. 📊 Impact:
- Positive / Negative / Neutral
- Explain WHY

4. 🏢 Key Detail:
- Extract important info (order size, location, change, etc.)

RULES:
- No long paragraphs
- No repetition
- Must be clear for beginner investors
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

module.exports = generateDomesticSummary;