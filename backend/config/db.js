const mongoose = require("mongoose");

async function connectDB(){
  try{
    // console.log(process.env.MONGO_URI)
   await  mongoose.connect(process.env.MONGO_URI).then(()=>{
      console.log("MongoDB Connected 😊");
    });
  } catch(error){
    console.log(error);
    process.exit(1);
  }
}

module.exports = connectDB;