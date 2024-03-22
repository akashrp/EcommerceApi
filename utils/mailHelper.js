import transporter from "../Config/mailConfig.js"

export const sendMail= async(from,to,subject,text)=>
{
    try{
     
        await transporter.sendMail({
          from:from,
          to:to,
          subject:subject,
          text:text
        })
       return true;
    }
 
  catch(error)
  {
    console.log(error)
    return false
  }
}