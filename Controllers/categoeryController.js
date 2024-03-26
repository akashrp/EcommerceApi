import Categoery from "../Models/categoery.js";
import asyncHandler from "../utils/asyncHandler.js";
import userRoles from "../utils/userRole.js";

//add categoery
export const addCategoery=asyncHandler(async(req,res)=>
{   
    const role= req.user.role
    if(!role || role!=userRoles.ADMIN)
    {
        return res.status(403).json({
            success:false,
            data:null,
            message:"access forbiddden"
        })
    }
    const{name}=req.body
    if(!name)
    {
        return res.send(400).send("insufficent data")
    }
    const isCategoeryExist=await Categoery.findOne({name:name.toLowerCase().trim()})
    if(isCategoeryExist)
    {
        return res.send(400).send("categoery already exists")
    }
    const createdBy=req.user.email
    const categoery=await Categoery.create({
        name:name,
        createdBy:createdBy
    })
    if(categoery)
    {
        const categoeryList= await Categoery.find();
        return res.status(200).json({
            success:true,
            data:categoeryList,
            message:"categoery added successfuly"
        })
    }
    return res.status(500).json({
        success:false,
        data:null,
        message:"error in adding categoery"
    })
})

//edit categoery
export const editCategoery= asyncHandler(async(req,res)=>{
    
    const role= req.user.role
    if(!role || role!=userRoles.ADMIN)
    {
        return res.status(403).json({
            success:false,
            data:null,
            message:"access forbiddden"
        })
    }

    const{name, id}=req.body
    
    if(!(name && id))
    {
        return res.status(500).json({
            success:false,
            data:null,
            message:"insufficent data"
        })

    }

    let tempName= name.toLowerCase().trim()
    const isCategoeryExist=await Categoery.findOne({
        name: tempName,
        _id:{$ne:id}
    })

    if(isCategoeryExist)
    {
        return res.status(400).json({
            success:false,
            data:null,
            message:"categoery already exist"
        })
    }
    
    const updatedCategoery=await Categoery.findByIdAndUpdate(id,{name:name},{
        new:true,
    })
    if(updatedCategoery)
    {
        const categoeryList= await Categoery.find();
        return res.status(200).json({
            success:true,
            data:categoeryList,
            message:"categoery updated successfuly"
        })
    }
    return res.status(500).json({
        success:false,
        data:null,
        message:"error in data updation"
    })
})


//get all categoery
export const getAllCategoeries= asyncHandler(async(req,res)=>{
    const categoeryList= await Categoery.find();
    if(categoeryList){
        return res.status(200).json({
            success:true,
            data:categoeryList,
            message:"categoeries fetched"
        })
    }
    return res.status(500).json({
        success:false,
        data:null,
        message:" error in categoery fetching"
    })
})
//delete categoery