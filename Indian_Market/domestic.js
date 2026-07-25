const axios = require("axios");
let express= require("express")
// const axios = require("axios");
let Inidamarket= express.Router()
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

async function Domestic() {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-http2", // 🔥 important fix
    ],
  });

  const page = await browser.newPage();

  try {
    // 👉 headers set karo (browser mimic)
    await page.setExtraHTTPHeaders({
      "accept-language": "en-US,en;q=0.9",
    });

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
    );

    // 👉 NSE homepage
    await page.goto("https://www.nseindia.com", {
      waitUntil: "networkidle2",
      timeout: 0,
    });

    // 👉 delay (important)
    await new Promise((r) => setTimeout(r, 2000));

    // 👉 API call inside browser
    const data = await page.evaluate(async () => {
      const res = await fetch(
        "https://www.nseindia.com/api/corporate-announcements?index=equities"
      );
      return res.json();
    });

    await browser.close();
    return data;
  } catch (err) {
    await browser.close();
    console.log("Error:", err.message);
    return [];
  }
}

module.exports = Domestic;

// Inidamarket.get("/getindia_news", async (req, res) => {
//   try {
//     let data = await Domestic();







//     res.json({
//       success: true,
//       count: data.length,
//       data: data,
//     });
//   } catch (err) {
//     res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// });






// module.exports= Inidamarket