const catchAsync = require("../utils/catchAsync");
const doctorModel = require("../models/doctorModel");
const nurseModel = require("../models/nurseModel");
const sendEmail = require("../utils/email");
const MedicalRecord = require("../models/medicalRecordModel");
const AppError = require("../utils/appError");

exports.createEmployee = catchAsync(async (req, res, next) => {
  let employee =
    req.body.role === "doctor"
      ? await doctorModel.create(req.body)
      : await nurseModel.create(req.body);

  sendEmail(
    employee.email,
    "You Are Added To The Stuff",
    "newEmployee",
    employee,
    req.body.password
  );

  res.status(200).json({
    status: "success",
    message: `the new ${employee.role} has been created and the email sent to him`,
    data: {
      employee,
    },
  });
});

exports.getDoctorsStats = catchAsync(async (req, res, next) => {
  req.query.sort = "-rating,salary";
  req.query.fields = "name,salary,rating,photo,ratingQuantity,phone,email";
  next();
});

exports.getPatientsStats = catchAsync(async (req, res, next) => {
  const stats = await MedicalRecord.aggregate([
    {
      $match: {},
    },
    {
      $group: {
        _id: "$isFinished",
        count: { $sum: 1 },
      },
    },
  ]);

  if (!stats) return next(new AppError(`Can't find patients stats`, 404));

  res.status(200).json({
    status: "success",
    data: stats,
  });
});
