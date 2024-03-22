import nodemailer from "nodemailer"
const Host=process.env.HOST
const Mail_Port=process.env.Mail_PORT
const Mail_UserName=process.env.Mail_User_Name
const Mai_Password= process.env.Mail_Password
const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: Host,
    port: Mail_Port,
    secure: true, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: Mail_UserName,
      pass: Mai_Password,
    },
  });
export default transporter