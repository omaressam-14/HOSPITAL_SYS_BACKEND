const userModel = require("../models/userModel");
const AppError = require("../utils/appError");
const handleFactory = require("../controllers/handleFactory");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/userModel");

exports.getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  user.active = false;
  await user.save();
  res.status(200).json({
    status: "success",
    message: "The User Account Has Been Deactivated",
  });
});

/////////Admin Only ////////////////////////////////////
exports.deleteUser = handleFactory.deleteOne(userModel);
exports.updateUser = handleFactory.updateOne(userModel);
exports.getUser = handleFactory.getOne(
  userModel,
  // { path: "nurses" },
  { path: "reviews" }
);
exports.getAllUsers = handleFactory.getAll(userModel);
exports.createUser = catchAsync(async (req, res, next) => {
  res.status(400).json({
    message: `sorry you can't create user from here please go to ${req.originalUrl}/user/signup`,
  });
});
