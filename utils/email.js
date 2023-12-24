const nodemailer = require("nodemailer");
require("dotenv").config();

const trnasporter = nodemailer.createTransport({
  port: process.env.NODEMAILER_PORT,
  host: process.env.NODEMAILER_HOST,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
  secure: true,
});

const sendEmail = function (to, subject, type, user, pass = "") {
  // generate html depend on type
  let html = defineHTML(type, user, pass);

  // mail data
  const mailData = {
    from: process.env.NODEMAILER_USER,
    to: to,
    subject: subject,
    html: html,
  };

  //send email
  trnasporter.sendMail(mailData, function (err, info) {
    if (err) console.log(err);
  });
};

// html generator
const defineHTML = function (type, user, pass) {
  let html = ``;
  if (type === "newEmployee") {
    html = `<h1>Hello ${user.name.split(" ")[0]}</h1>
                <p>the admin added you to the stuff of the hospital</p>
                <br />
                <p>Your email is:  -> ${user.email}</p>
                <br/>
                <p>Your Password is: -> ${pass}</p>
            `;
  }

  // the url is passed as pass
  if (type === "restPassword") {
    html = `<h1>Reset Password</h1>
    <p>to reset your password go the next link, it's valid for 10 minutes only</p>
    <br/>
    <a href=${pass}>Link</a>
    `;
  }
  return html;
};

module.exports = sendEmail;
