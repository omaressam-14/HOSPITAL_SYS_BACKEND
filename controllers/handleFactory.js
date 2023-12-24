const APIFeatures = require("../utils/apiFeatures");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createOne = function (Model) {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    if (!doc) return next(new AppError("document cannot be create", 400));
    res.status(201).json({
      status: "success",
      data: doc,
    });
  });
};

exports.getOne = function (Model, populateOptions) {
  return catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    // if there is popOptions nest it to the query
    if (populateOptions) query.populate(populateOptions);
    const doc = await query;
    if (!doc) return next(new AppError("can not find the document", 404));

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });
};

exports.deleteOne = function (Model) {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) return next(new AppError("Cannot find document", 404));

    res.status(204).json({
      status: "success",
      message: "the document deleted",
    });
  });
};

exports.updateOne = function (Model) {
  return catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!doc) return next(new AppError("document cannot updated", 400));

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });
};

exports.getAll = function (Model) {
  return catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .limitFields()
      .sort()
      .paginate();

    const data = await features.query;

    res.status(200).json({
      status: "success",
      results: data.length,
      data: data,
    });
  });
};
