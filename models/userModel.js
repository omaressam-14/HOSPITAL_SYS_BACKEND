const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  postalCode: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
});

/////////// USER SCHEMA ///////////////////

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "the user should have name"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "the user should have phone number"],
      unique: true,
    },
    address: addressSchema,
    email: {
      type: String,
      required: [true, "the user should have email"],
      unique: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
	  required : [true , "you should provide the gender"]
    },
    role: {
      type: String,
      enum: ["user", "admin", "doctor", "nurse"],
      default: "user",
    },
    age: {
      type: Number,
      required: [true, "the user should have age"],
    },
    photo: {
      type: String,
      default: "default.jpg",
    },
    password: {
      type: String,
      required: [true, "please enter the password"],
      min: [8, "please enter at least 8 characters"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "please enter password confirmation"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "the password confirm and password is not matching",
      },
      select: false,
    },
    passwordChangedAt: {
      type: Date,
    },
    passwordResetToken: String,
    passwordResetTokenExpire: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  plainPassword,
  hashPassword
) {
  return await bcrypt.compare(plainPassword, hashPassword);
};

userSchema.methods.changePasswordAfter = function (iat) {
  const changedAt = new Date(this.passwordChangedAt).getTime() / 1000 - 100;
  return changedAt > iat;
};

userSchema.methods.createResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  // create reset token
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // expires after 10 minutes
  this.passwordResetTokenExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

exports.userSchema;
const Address = mongoose.model("Address", addressSchema);
const User = mongoose.model("User", userSchema);

module.exports = User;
