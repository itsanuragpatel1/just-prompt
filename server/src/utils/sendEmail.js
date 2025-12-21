import nodemailer from 'nodemailer'
import { otpEmail } from './templates/otpEmail.js';

const transport=nodemailer.createTransport({
        service:'gmail',
        auth:{
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    })

const sendOtpMail=async(to,otp)=>{
    await transport.sendMail({
        from:`Just Prompt <${process.env.EMAIL_USER}>`,
        to,
        subject:"Your OTP for Verification of Just Prompt",
        text:`Your OTP is ${otp}`,
        html:otpEmail(otp)
    })

};

// const sendWelcomeMail=async(to)=>{
//     await transport.sendMail({
//         from:`Just Prompt <${process.env.EMAIL_USER}>`,
//         to,
//         subject:"Welcome to Just Prompt",
//         text:`We are Welcoming you in Just Prompt`,
//         html:
//     })
// };


export {sendOtpMail}

