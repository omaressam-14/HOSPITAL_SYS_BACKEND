const catchAsync = require("../utils/catchAsync");
const filterObject = require("../utils/filterObject");
const createSendToken = require("../utils/createSendToken");
const userModel = require("../models/userModel");
const AppError = require("../utils/appError");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const sendEmail = require("../utils/email");
const crypto = require("crypto");

exports.signUp = catchAsync(async (req, res, next) => {
  //   filter the inputs so the user cannot modify the role
  const inputs = filterObject(req.body, "role");
  //creating the user
  const user = await userModel.create(inputs);
  //sending token
  createSendToken(201, user, res);
});

exports.signIn = catchAsync(async (req, res, next) => {
  const user = await userModel
    .findOne({
      email: req.body.email,
    })
    .select("+password");

  if (
    !user ||
    !(await user.correctPassword(`${req.body.password}`, `${user.password}`))
  ) {
    return next(new AppError("Email Or Password is incorrect", 400));
  }

  createSendToken(200, user, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // check if there is token
  let token = req.headers.authorization;
  if (!token && !token?.startsWith("Bearer")) {
    return next(new AppError("Invalid Token Please Login Again", 401));
  }
  token = token.split(" ")[1];
  //verify the token
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  //find the user with that id to check if still exsist
  const user = await userModel.findById(decode.id);
  if (!user) return next(new AppError("Invalid Token Please Login Again", 401));
  //check if the user change the password after token initiate
  if (user.changePasswordAfter(decode.iat)) {
    return next(new AppError("Invalid Token Please Login Again", 401));
  }
  req.user = user;
  next();
});

exports.restrictTo = function (...roles) {
  return catchAsync(async (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError("You Are Not Authorized", 401));
    next();
  });
};

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("You Cannot Update The Password Here", 400));
  }
  const filteredBody = { ...req.body };
  if (req.file) filteredBody.photo = req.file.filename;

  const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const { currentPassword, password, passwordConfirm } = req.body;
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError("Your old Password is wrong", 401));
  }
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordChangedAt = Date.now();

  await user.save();

  createSendToken(200, user, res);
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError("There is no user with this email", 404));

  const token = user.createResetToken();
  await user.save({ runValidators: false });

  try {
    const url = `${req.protocol}://${req.get(
      "host"
    )}/api/user/resetPassword/${token}`;
    sendEmail(req.body.email, "Reset Password", "restPassword", undefined, url);

    res.status(200).json({
      status: "success",
      message: "the email sent",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpire = undefined;
    await user.save({ runValidators: false });
    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError("The Token is invalid or expired", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpire = undefined;
  await user.save();

  createSendToken(200, user, res);
});
