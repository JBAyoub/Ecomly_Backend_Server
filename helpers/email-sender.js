const nodemailer = require("nodemailer");

exports.sendMail = async function (email, subject, text) {
     try {
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
               to: email,
               subject: subject,
               text: text,
          });

          console.log("Email sent");

          return {
               message: "Password OTP has been sent to your email.",
               statusCode: 201
          };

     } catch (err) {
          console.error("Error Sending Email:", err);

          return {
               message: err.message,
               statusCode: 500
          };
     }
};

