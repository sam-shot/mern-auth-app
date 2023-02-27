import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import ENV from '../config.js';





const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'helga.brown79@ethereal.email',
        pass: 'RavcTpn9Jv6GC8mgB7'
    }
});

let MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: "https://mailgen.js"
    }
});

export async function sendMailOTP (req,res) {
    

    const {username, usermail, text, subject } = req.body;

    
    var email = {
        body : {
            name: username,
            intro: text || "Its my firt mail service",
            outro: "Im glad creating this"
        }

    }

    var emailBody = MailGenerator.generate(email);
    let message = {
        from : ENV.EMAIL,
        to: usermail,
        subject : subject || "Sign up Success",
        html: emailBody
    }
    
    transporter.sendMail(message).then(()=>{
        return res.status(200).send({message  : "An Email wi6ll be sent to you shortly"})
    }).catch(res.status(200).send({message  : "An Emaild wihll be sent to you shortly"}));
}
