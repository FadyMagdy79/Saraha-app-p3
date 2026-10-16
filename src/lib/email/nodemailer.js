import nodemailer from "nodemailer";
import { env } from "../config/env.js";
const transporter = nodemailer.createTransport({
   
    service: "gmail",   
    auth: {
        user: env.nodeMailer.user,
        pass: env.nodeMailer.password,
    }
});

export async function sendEmail(to, subject, html){

 await transporter.sendMail({
        from: `"ngl.app" <${env.nodeMailer.user}>`,
        to: to,
        subject: subject,
        html: html
    });
}
