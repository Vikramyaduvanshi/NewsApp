const axios = require("axios");

const { News } = require("../modal/modal");

const fetchAllNews = async () => {

  const queries = [

    // FOREX + MAJOR CURRENCIES
    `forex OR USD OR EUR OR GBP OR JPY OR CHF OR AUD OR CAD OR NZD OR INR OR CNY`,

    // CENTRAL BANKS
    `Fed OR FOMC OR ECB OR BOJ OR BOE OR RBA OR BOC OR RBI OR SNB OR PBOC OR RBNZ`,

    // MACRO ECONOMICS
    `"interest rates" OR inflation OR CPI OR PPI OR NFP OR payrolls OR unemployment OR GDP OR recession`,

    // BONDS + DXY
    `DXY OR "bond yields" OR "treasury yields"`,

    // COMMODITIES
    `gold OR XAU OR silver OR oil OR crude OR brent OR WTI OR OPEC`,

    // GEOPOLITICS
    `war OR sanctions OR tariffs OR geopolitics OR Iran OR Israel OR Russia OR Ukraine OR China OR Taiwan`,

    // RISK SENTIMENT
    `"risk-on" OR "risk-off"`,

  ];

  try {

    let allArticles = [];

    // =====================================
    // SEQUENTIAL REQUESTS
    // =====================================

    for (let q of queries) {

      try {

        const res = await axios.get("https://gnews.io/api/v4/search",{params: {q,lang: "en",max: 5,sortby: "publishedAt",token:"d79b544b4e9bec9b8e616fefa95042bf"}});

        if (res.data?.articles) {

          allArticles.push( ...res.data.articles);

        }

        // ==========================
        // DELAY (IMPORTANT)
        // ==========================

        await new Promise((resolve) =>setTimeout(resolve, 1500));

      } catch (err) {

        console.log(
          `❌ Failed Query: ${q}`
        );

      }

    }

    // =====================================
    // REMOVE DUPLICATES
    // =====================================

    const unique = [];

    const titles = new Set();

    for (let article of allArticles) {

      if (!titles.has(article.title)) {

        titles.add(article.title);

        unique.push(article);

      }

    }

    // =====================================
    // SORT LATEST FIRST
    // =====================================

    unique.sort((a, b) => {

      return (
        new Date(b.publishedAt) -
        new Date(a.publishedAt)
      );

    });

    return unique;

  } catch (err) {

    console.log(
      "❌ GNews Error:",
      err.message
    );

    return [];

  }

};







async function Cleangnewsdata() {
  let arr= await fetchAllNews()
  let final= arr.map((v)=>{
let {title,description,content}=v
return {title,description,content}
  })

  return final
}






async function gnewsdatafromdb() {
  try {
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);

    const news = await News.aggregate([{ $match: { time: {$gte: threeHoursAgo}  }},{$sort: { time: -1  }}]);

    return news;
  } catch (error) {
    console.error("Error fetching last 3 hours news:", error);
    return [];
  }
}


module.exports={gnewsdatafromdb,Cleangnewsdata, fetchAllNews}
