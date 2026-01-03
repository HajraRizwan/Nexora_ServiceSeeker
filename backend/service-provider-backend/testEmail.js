import nodemailer from "nodemailer";

let testAccount = await nodemailer.createTestAccount();
let transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: testAccount.user,
    pass: testAccount.pass,
  },
});

const info = await transporter.sendMail({
  from: '"Test" <test@example.com>',
  to: "user@example.com",
  subject: "OTP Test",
  text: "123456",
});

console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
