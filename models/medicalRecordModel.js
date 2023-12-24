const mongoose = require("mongoose");

const medicalRecordSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctor: {
      type: mongoose.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    diagnose: {
      type: String,
      required: [true, "The Medical Record Should Have Diagnose"],
    },
    medicines: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Medicine",
      },
    ],
    isFinished: {
      type: Boolean,
      default: false,
    },
    endDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

medicalRecordSchema.pre(/^find/, function (next) {
  this.populate({
    path: "medicines",
    select: "name price photo",
  });
  this.populate({
	  path : "patient",
	  select : "photo name",
  });
  
  this.populate({
	  path: "doctor",
	  select: "photo name"
  })
  next();
});

const MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);

module.exports = MedicalRecord;
