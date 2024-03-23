import asyncHandler from "../utils/asyncHandler.js";
import User from "../Models/user.js";
import crypto from "crypto";
import { sendMail } from "../utils/mailHelper.js";
const from_Mail = process.env.from_Mail;

//add user
export const addUser = asyncHandler(async (req, res) => {
  const { email, name, password, role } = req.body;
  if (!(email && name && password)) {
    return res.status(400).send("insufficient Data");
  }
  const isEmailExist = await User.IsEmailExists(email);
  if (isEmailExist) {
    return res.status(400).send("email already exist");
  }
  const user = await User.create({
    name,
    email,
    password,
  });
  if (user) {
    const token = user.getJwtToken;
    const cookieOptions = {
      httpOnly: true,
      expire: 1 * 24 * 60 * 60 * 1000,
    };
   
    const verificationToken= await user.getEmailVerificationToken();
    const resetUrl = `${req.protocol}://${req.get("host" )}/verifyAccount?confirmation_token=${verificationToken}&&user=${user._id}`;

    const isMailSent= await sendMail(from_Mail, email, "Verify Account", resetUrl);
    if(!isMailSent)
    {
        await User.findByIdAndDelete(user._id);
        return res.status(500).json({
            success:false,
            mssage:"error in email sending"
        })
    }
    user.password = undefined;
    res.cookie("token", token, cookieOptions);
    return res.status(200).json({
      success: true,
      token,
      user,
    });
  }
  return res.status(500).json({
    success: false,
  });
});


//verify user
export const VerifyUser=asyncHandler(async(req,res)=>{
    const{confirmation_token,user}=req.query
    if(!(confirmation_token && user))
    {
        res.status(400).send("invalid url")
    }

    //encrypt the token from query
    const encryptedToken= crypto
    .createHash('sha256')
    .update(confirmation_token)
    .digest('hex')

    //find the matching user
    const userToActivate= await User.findOne({
        _id:user,
        emailVerificationToken:encryptedToken,
        emailVerificationTokenExpiry:{$gt:Date.now()}
    });

    //update isEmailVerifed if user is found
    if(userToActivate)
    {
        userToActivate.isEmailVerified=true
        userToActivate.emailVerificationToken=null
        userToActivate.emailVerificationTokenExpiry=null
       
        await userToActivate.save({validateModifiedOnly:true})
       
        return res.status(200).send("email verified")
    }

    return res.status(400).send("link is no longer valid")  
})

//login user
export const login= asyncHandler(async(req,res)=>{
    const {email,password}=req.body
    if(!(email && password))
    {
        return res.status(400).send("insufficient data")
    }
    const user=await User.findOne({email:email},'password role email name isEmailVerified')
    if(!user.isEmailVerified)
    {
        return res.status(403).send("please verify email")
    }
   
    if(user && await user.comparePassword(password))
    {
        const token= user.getJwtToken()
        const cookieOption={
              expire:1*24*60*60*1000,
            httpOnly:true
        }
        user.password=undefined
       return res.status(200).cookie('token',token,cookieOption).json({
            success:true,
            token,
            user
        })
    }
    return res.status(400).send("invalid credentials")
})

//logout user

export const logout = asyncHandler(async(req,res)=>{
    return res.status(200).cookie("token",null,{
        expire:Date.now(),
        httpOnly:true
    }).json({
        success:true,
        message:"user logged out"
    })
})