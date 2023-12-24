const mongoose = require("mongoose");
const { userSchema } = require("./userModel");
const User = require("./userModel");

const nurseSchema = mongoose.Schema(
  {
    salary: {
      type: Number,
      required: true,
    },
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
    },
    role: {
      type: String,
      default: "nurse",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// nurseSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: "doctor",
//     select: "-__v",
//   });
//   next();
// });

const Nurse = User.discriminator("Nurse", nurseSchema);

module.exports = Nurse;
