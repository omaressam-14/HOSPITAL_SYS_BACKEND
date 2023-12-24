const mongoose = require("mongoose");
const { default: slugify } = require("slugify");

const departmentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "the department name should be provided"],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
    },
    slug: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

departmentSchema.pre("save", function (next) {
  this.slug = slugify(this.name);
  next();
});

departmentSchema.pre(/^find/, function (next) {
  this.populate({
    path: "doctors",
    select: "name age rating ratingQuantity photo -__t",
  });

  next();
});

// make virtual property for department model that get all the doctors which
// there department matches the id
departmentSchema.virtual("doctors", {
  ref: "Doctor",
  foreignField: "department",
  localField: "_id",
});

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
