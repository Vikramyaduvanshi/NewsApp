let mongoose = require("mongoose");

let newschema= new mongoose.Schema({
title:{type:String, required:true},
description:{type:String, required:true},
image_url:{type:String, default:"https://greenup24.com/assets/img/blog/a-complete-guide-to-forex-market-news-and-how-it-affects-your-trades-with-greenup24.webp"},
},
{
    timestamps:true
}
)


let tradeSchema= new mongoose.Schema({
title:{type:String, required:true},
description:{type:String, required:true},
imge_url:{type:String, default:""}
},
{
    timestamps:true
}
)

let Trade= mongoose.model("Trade", tradeSchema);

let News= mongoose.model("News", newschema);

module.exports= {Trade, News};