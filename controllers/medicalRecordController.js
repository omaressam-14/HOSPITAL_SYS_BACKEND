const MedicalRecord = require("../models/medicalRecordModel");
const handleFactory = require("../controllers/handleFactory");
const catchAsync = require("../utils/catchAsync");

exports.getDoctorPatient = catchAsync(async (req, res, next) => {
  req.body.doctor = req.user.id;
  req.body.patient = req.params.userId;
  next();
});

exports.createMedicalRecord = handleFactory.createOne(MedicalRecord);
exports.deleteMedicalRecord = handleFactory.deleteOne(MedicalRecord);
exports.updateMedicalRecord = handleFactory.updateOne(MedicalRecord);
exports.getAllMedicalRecords = handleFactory.getAll(MedicalRecord);
exports.getMedicalRecord = handleFactory.getOne(MedicalRecord);

exports.getAllUserMedicalRecords = catchAsync(async (req, res, next) => {
  const data = await MedicalRecord.find({
    patient: req.params.userId,
  });

  res.status(200).json({
    status: "success",
    results: data.length,
    data: data,
  });
});
