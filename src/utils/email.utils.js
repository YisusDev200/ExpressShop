const nodeMailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const { EMAIL_USER, EMAIL_PASS } = require("../config");

const sendEmail = asyncHandler(async (data, req, res) => {
  let transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
  try {
    const info = await transporter.sendMail({
      // ! Change this to your email address
      from: '"Remitente" <company@gmail.com>',
      to: data.to,
      subject: data.text,
      html: data.html,
    });
  } catch (error) {}
});

module.exports = { sendEmail };
