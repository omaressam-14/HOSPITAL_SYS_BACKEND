const mongoose = require("mongoose");
const slugify = require("slugify");

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "the medicine must have a name"],
    },
    price: {
      type: Number,
      required: [true, "the medicine should have price"],
      min: [1, "the price should be greater than 1"],
    },
    quantity: {
      type: Number,
      required: [true, "the medicine should have quantity"],
    },
    slug: {
      type: String,
    },
    photo: {
      type: String,
      default: "default.jpg",
    },
  },

  { timestamps: true }
);

medicineSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Medicine = mongoose.model("Medicine", medicineSchema);

module.exports = Medicine;
