let express= require("express")
const { DomesticNews } = require("../../modal/modal")
let Indiarouter= express.Router()



Indiarouter.get("/india_news", async (req, res) => {
  try {
    let { limit = 20, page = 1, searchword, isin } = req.query;

    let searchobj = {};

  
    if (isin) {
      searchobj.isin = isin;
    } 
   
    else if (searchword) {
      searchobj.sm_name = { $regex: searchword, $options: "i" };
    }

    let skip = (Number(page) - 1) * Number(limit);

    let news = await DomesticNews.aggregate([
      { $match: searchobj },
      { $sort: { announcementDate: -1 } },
      { $skip: skip },
      { $limit: Number(limit) },
      {
        $project: {
          symbol: 1,
          sm_name: 1,
          GeneratedText: 1,
          announcementDate: 1,
          isin: 1 
        }
      }
    ]);

    res.json({ success: true, news });

  } catch (e) {
    res.json({ success: false, message: e.message });
  }
});

module.exports=Indiarouter
