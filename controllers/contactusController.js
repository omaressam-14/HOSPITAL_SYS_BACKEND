const { createTransport } = require("nodemailer");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
require("dotenv").config();

const transporter = createTransport({
  host: process.env.NODEMAILER_HOST,
  port: process.env.NODEMAILER_PORT,
  secure: true,
  auth: {
    user: process.env.NODEMAILER_USER,
    pass: process.env.NODEMAILER_PASS,
  },
});

exports.sendEmailToAdmin = catchAsync(async (req, res, next) => {
  const mail_option = {
    from: req.body.email,
    to: process.env.NODEMAILER_USER,
    subject: `Message from Hospital System : ${req.body.subject}`,
    text: req.body.message,
  };

  transporter.sendMail(mail_option, (error, info) => {
    if (error) {
      return next(new AppError("cannot send the email", 400));
    } else {
      res.status(200).json({
        status: "success",
        message: "the email sent successfully",
      });
    }
  });
});
