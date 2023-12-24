const mongoose = require("mongoose");
const Doctor = require("../models/doctorModel");

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "the review should belong to user"],
    },
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
      required: [true, "the review should belong to doctor"],
    },
    review: {
      type: String,
      required: [true, "the review should have review"],
      minLength: 4,
    },
    rating: {
      type: Number,
      required: [true, "you should provide the rating to the review"],
      min: [1, "the rating should be at least 1"],
      max: [5, "the maximum rating is 5"],
    },
  },
  { timestamps: true }
);

reviewSchema.index({ user: 1, doctor: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

reviewSchema.statics.calcAvgRating = async function (userId) {
  const stats = await this.aggregate([
    {
      $match: { doctor: userId },
    },
    {
      $group: {
        _id: "$doctor",
        avgRating: { $avg: "$rating" },
        nRatings: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await Doctor.findByIdAndUpdate(userId, {
      rating: stats[0].avgRating,
      ratingQuantity: stats[0].nRatings,
    });
  } else {
    await Doctor.findByIdAndUpdate(userId, { rating: 4.5, ratingQuantity: 0 });
  }
};

reviewSchema.post("save", function () {
  this.constructor.calcAvgRating(this.doctor);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  // get instance of the doc to get the product id
  const curDoc = await this.model.findOne(this.getQuery());
  // save the doc to pass it
  this.ddoc = curDoc;
  // save the prod id
  this.docId = curDoc.doctor;
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // use the model to access calcAvg
  await this.ddoc.constructor.calcAvgRating(this.docId);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
