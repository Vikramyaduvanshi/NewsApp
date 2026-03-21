let mongoose = require("mongoose");

// Schema
const newsSchema = new mongoose.Schema({
  title: String,
  url: { type: String, unique: true },
  source: String,
  image_url: String,
  ai_summary: { type: String, default: "" },
  impact: String,
  categories: [String],
  description: String,
  content: String,
  time: Date,
}, { timestamps: true });


let tradeSchema= new mongoose.Schema({
title:{type:String, required:true},
description:{type:String, required:true},
image_url:{type:String, default:""}
},
{
    timestamps:true
}
)

let Trade= mongoose.model("Trade", tradeSchema);

let News= mongoose.model("News", newsSchema);

module.exports= {Trade, News};