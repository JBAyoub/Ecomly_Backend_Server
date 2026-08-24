const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
     service: "gmail",
     auth: {
          type: "OAuth2",
          user: process.env.EMAIL_USER,
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
     },
});

await transporter.sendMail({
     from: process.env.EMAIL_USER,
     to: "recipient@gmail.com",
     subject: "Test email",
     text: "This email was sent from my Node.js backend.",
});