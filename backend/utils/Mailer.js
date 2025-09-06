const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});
const sendWelcomeMail =  async (to,username)=>{
    try{
        transporter.sendMail({
            from: `"YumeTrack "${process.env.EMAIL_USER}`,
            to,
            subject:"Welcome To YumeTrack",
            html: `
                <h2>Welcome to AniMate, ${username} 👋</h2>
                <p>We’re excited to have you join our anime community!</p>
                <p>You can now explore, rate, and discover amazing anime recommendations 🎉</p>
                <br/>
                <p>Enjoy your journey,<br/>The AniMate Team ❤️</p>
                `
        });
        console.log("Welcome email sent to:",to);
    }
    catch(err){
        console.log("❌Error sending email:",err.message)
    }
}
module.exports = {sendWelcomeMail};