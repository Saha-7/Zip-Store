import { Resend } from 'resend';
import dotenv from 'dotenv'

dotenv.config()


if(!process.env.RESEND_API_KEY){
    console.log("Provide Resend API key in .env file")
}

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async({sendTo, subject, html })=>{
    try {
        const { data, error } = await resend.emails.send({
            from: 'Zip-Store <onboarding@resend.dev>',
            to: sendTo,
            subject: subject,
            html: html,
        });

        if (error) {
            return console.error({ error });
        }

        return data
    } catch (error) {
        console.log(error)
    }
}

export default sendEmail
