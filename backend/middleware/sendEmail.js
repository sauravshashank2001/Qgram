const nodeMailer = require("nodemailer");
exports.sendEmail = async(options)=>{
    // const transporter = nodeMailer.createTransport({
    //     host:process.env.SMPT_HOST,
    //     port:process.env.SMPT_PORT,
    //     auth:{
    //         user: process.env.SMPT_MAIL,
    //         pass: process.env.SMPT_PASSWORD
    //     },
    //     service: process.env.SMPT_SERVICE 
    // });
    var transporter = nodeMailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "f9efdd5f518633",
          pass: "16cd0f2f04bfbc"
        }
      });
    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message
    }

    await transporter.sendMail(mailOptions);

}