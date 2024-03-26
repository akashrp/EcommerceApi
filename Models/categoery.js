import mongoose from "mongoose";

const categoerySchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,"name is required"],
        unique:true,
        maxLength:[50,"max length is 50"],
        trim:true,
        lowercase: true
    },
    createdBy:{
        type:String,
        required:true,
        default:null
    }
},
{
    timestamps:true
}
)
const Categoery= mongoose.model('categoery',categoerySchema)
export default Categoery