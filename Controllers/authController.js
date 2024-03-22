
import asyncHandler from "../utils/asyncHandler.js"
import User from "../Models/user.js"

export const addUser=asyncHandler(async(req,res)=>
{
    const {email, name,password,role}=req.body
    if(!(email && name && password))
    {
        return res.status(400).send("insufficient Data")
    }
    const isEmailExist= await User.IsEmailExists(email);
    if(isEmailExist)
    {
        return res.status(400).send("email already exist")
    }
    const user=await User.create({
        name,
        email,
        password
    })
    if(user)
    {
        user.password = undefined
        const token=user.getJwtToken
        const cookieOptions={
            httpOnly:true,
            expire:1*24*60*60*1000
        }
        res.cookie("token", token, cookieOptions)
    
       return res.status(200).json({
            success: true,
            token,
            user
        })
    }
    return res.status(500).json({
        success: false,
    })

})