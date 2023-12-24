const mongoose = require("mongoose");
const User = require("./userModel");

const doctorSchema = mongoose.Schema(
  {
    department: {
      type: mongoose.Types.ObjectId,
      ref: "Department",
      required: [true, "You should provide the department"],
    },
    salary: {
      type: Number,
      required: true,
    },

    rating: {
      type: Number,
      default: 4.5,
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
    role: {
      type: String,
      default: "doctor",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// doctorSchema.virtual("nurses", {
//   ref: "Nurse",
//   foreignField: "doctor",
//   localField: "_id",
// });

doctorSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "doctor",
  localField: "_id",
});

const Doctor = User.discriminator("Doctor", doctorSchema);

module.exports = Doctor;
