let dotenv= require("dotenv")
dotenv.config()
let express= require("express");
const newsrouter = require("./Route/routes");
let App= express();

App.use(express.json());

let PORT= process.env.PORT || 8000
let cors=require("cors");
const ConnectDb = require("./config");
App.use(cors())


App.get("/test", (req, res)=>{

res.json({success:true, message:"testing routing is running successfully"});

})


App.use("/news", newsrouter);







App.listen(PORT, ()=>{
    ConnectDb()
    console.log("server running is at port 5000");
})