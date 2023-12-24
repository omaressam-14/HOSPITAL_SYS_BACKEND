const mongoose = require("mongoose");

const roomSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please provide a name for the room"],
      unique: true,
      trim: true,
    },
    patients: {
      type: [mongoose.Types.ObjectId],
      ref: "User",
    },
    isFull: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["regular", "special"],
      default: "regular",
    },
    numberOfBeds: {
      type: Number,
      require: [true, "you should provide the number of beds in the room"],
    },
  },
  { timestamps: true }
);


roomSchema.post(/^findOne(?!AndDelete)/, async function (doc) {
	
  doc.isFull = doc.patients.length >= doc.numberOfBeds;
  await doc.save();
});


roomSchema.pre("save", async function (next) {
  this.isFull = this.patients.length >= this.numberOfBeds;
  next();
});

roomSchema.pre(/^find/, function (next) {
  this.populate({ path: "patients", select: "name photo age phone email" });
  next();
});

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;
