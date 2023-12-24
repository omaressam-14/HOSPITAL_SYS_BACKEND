const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema({
  doctor: {
    type: mongoose.Types.ObjectId,
    ref: "Doctor",
  },
  patient: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  date: {
    type: Date,
    required: [true, "You Should define the date of the appointment"],
    default: Date.now,
  },
});

appointmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "doctor",
    select: "name photo",
  });

  this.populate({
    path: "patient",
    select: "name photo",
  });

  next();
  //
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;
