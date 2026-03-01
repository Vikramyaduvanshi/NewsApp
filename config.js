let mongoose= require("mongoose")



async function ConnectDb(){


   try{
     await mongoose.connect(process.env.MONGO_URI)
   }catch(e){
console.log("server connected succesfully to db")
   }
}

module.exports=ConnectDb