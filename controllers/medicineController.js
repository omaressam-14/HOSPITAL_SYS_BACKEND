const Medicine = require("../models/medicineModel");
const medicineModel = require("../models/medicineModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const handleFactory = require("./handleFactory");

exports.getAllMedicines = handleFactory.getAll(medicineModel);

exports.createMedicine = catchAsync(async (req, res, next) => {
  if (req.file) {
    req.body.photo = req.file.filename;
  }
  const medicine = await Medicine.create(req.body);

  res.status(201).json({
    status: "success",
    data: medicine,
  });
});

exports.getMedicine = handleFactory.getOne(medicineModel);

exports.updateMedicine = catchAsync(async (req, res, next) => {
  if (req.file) {
    req.body.photo = req.file.filename;
  }
  const medicine = await Medicine.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!medicine)
    return next(new AppError("cannot find the medicine you search for", 404));

  res.status(200).json({
    status: "success",
    data: medicine,
  });
});

exports.deleteMedicine = handleFactory.deleteOne(medicineModel);
