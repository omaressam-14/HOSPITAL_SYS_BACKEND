const handleFactory = require("./handleFactory");
const reviewModel = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllReviews = handleFactory.getAll(reviewModel);
exports.getReview = handleFactory.getOne(reviewModel);
exports.deleteReview = handleFactory.deleteOne(reviewModel);

exports.setUserDoctor = catchAsync(async (req, res, next) => {
  req.body.user = req.user.id;
  req.body.doctor = req.params.userId;
  next();
});

exports.createReview = handleFactory.createOne(reviewModel);
exports.updateReview = handleFactory.updateOne(reviewModel);
