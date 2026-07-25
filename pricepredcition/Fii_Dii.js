const { chromium } = require("playwright");

async function getFIIDII() {
  const browser = await chromium.launch({
    headless: false, // IMPORTANT
  });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36",
  });

  const page = await context.newPage();

  // Step 1: visit homepage like real user
  await page.goto("https://www.nseindia.com", {
    waitUntil: "networkidle",
  });

  await page.waitForTimeout(5000);

  // Step 2: now fetch API
  const data = await page.evaluate(async () => {
    const res = await fetch(
      "https://www.nseindia.com/api/fiidiiTradeReact",
      {
        headers: {
          accept: "application/json",
        },
      }
    );
    return await res.json();
  });

  await browser.close();

  return data;
}


module.exports=getFIIDII