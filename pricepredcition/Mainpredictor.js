const Delevery = require("./Delevery")
const getFIIDII = require("./Fii_Dii")
const sector_mapping = require("./getStockSectorImpact")
const getStockSectorImpact = require("./getStockSectorImpact")
const getStockAIResult = require("./Groq_predict")
const Newssentiment = require("./Newssentiment")
const getScreenerData = require("./ScreenerData")
const getNSEData = require("./SectorIndex")
const getTechnicalData = require("./TechnicalAnalyse")




async function predictorresult(symbol){
try{
const [ deliveryData, newsData,  screenerData,  technicalData, fiiDiiData,NSEdata,sector_impact] =await Promise.all([Delevery(symbol), Newssentiment(symbol),  getScreenerData(symbol),  getTechnicalData(symbol + ".NS"),  getFIIDII(), getNSEData(), sector_mapping(symbol + ".NS")]) 
let result =await getStockAIResult({screenerData, technicalData,newsData,fiiDiiData,deliveryData,sector_impact})
// console.log(result)
return result;
}catch(e){
console.log(e.message)
}

}


module.exports=predictorresult

// predictorresult("bel")




