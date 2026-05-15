const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "YOUR_GMAIL@gmail.com",
    pass: "YOUR_APP_PASSWORD"
  }
});

async function sendMail(to, subject, text) {

  try {

    await transporter.sendMail({
      from: "uSports",
      to,
      subject,
      text
    });

    console.log("Mail sent");

  } catch (err) {

    console.log(err);

  }
}

module.exports = sendMail;