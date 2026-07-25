const generateDomesticSummary = require("./DomesticAi")
const ExtractTotext = require("./PdfTotext")





async function Domestictheme(arr){

let newarr = await Promise.all(arr.map(async (v,i)=>{
let {symbol, sm_name, smIndustry, attchmntText, sm_isin, sort_date, attchmntFile} = v

let text = await ExtractTotext(attchmntFile)
let gt = await generateDomesticSummary(sm_name, text) 

return {
symbol,
sm_name,
smIndustry,
attchmntText,
isin: sm_isin,
attchmntFile,
GeneratedText: gt,
announcementDate: new Date(sort_date) 
}
}))

return newarr
}

module.exports=Domestictheme