const { default: mongoose } = require("mongoose");
const Room = require("../models/roomModel");
const roomModel = require("../models/roomModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const handleFactory = require("./handleFactory");

exports.createRoom = handleFactory.createOne(roomModel);
exports.updateRoom = handleFactory.updateOne(roomModel);
exports.deleteRoom = handleFactory.deleteOne(roomModel);
exports.getRoom = handleFactory.getOne(roomModel);
exports.getAllRoom = handleFactory.getAll(roomModel);

exports.addPatientToRoom = catchAsync(async (req, res, next) => {
  const { isFull } = await Room.findById(req.params.id);
  if (isFull)
    return next(
      new AppError(`the room is full and you can't add more patients`, 400)
    );

  const room = await Room.findOneAndUpdate(
    { _id: req.params.id },
    {
      $addToSet: { patients: req.body.patient },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!room)
    return next(new AppError("cannot update the room or cannot find it ", 404));

  res.status(200).json({
    status: "success",
    data: room,
  });
});

exports.removePatientFromRoom = catchAsync(async (req, res, next) => {
  const room = await Room.findOneAndUpdate(
    { _id: req.params.id },
    { $pull: { patients: req.body.patient } },
    { new: true, runValidators: true }
  );

  if (!room) return next(new AppError(`can't find the room`, 404));

  res.status(200).json({
    status: "success",
    message: "The Patient is Removed Successfully",
    data: room,
  });
});
