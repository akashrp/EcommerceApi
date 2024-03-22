import mongoose  from "mongoose";
const MONGO_URL= process.env.MONGO_URL
export const Connect=()=>{
    mongoose.connect(MONGO_URL).then(()=>{
        console.log("connected to db")
    }).catch((err)=>{
        console.log(err.message)
    })
}