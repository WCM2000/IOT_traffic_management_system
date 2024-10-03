const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// user scheama
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name..."],
    },
    email: {
      type: String,
      required: [true, "Please tell us your email..."],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please enter a valid email address..."],
    },
    policeId: {
      type: String,
      required: [true, "Please tell us your police id"],
      unique: true,
    },
    policeStationName: {
      type: String,
    },
    police: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Police",
        // required: [true, "Appointment must belong to a hospital"],
      },
    ],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    images: [String],
    password: {
      type: String,
      required: [true, "Please choose a password..."],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your password..."],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "Passwords are not the same",
      },
    },
    passwordChangedAt: Date,
  },
  {
    timestamps: true,
  }
);

userSchema.pre(/^findOne/, function (next) {
  this.populate({
    path: "police",
    // select: '-__v -passwordChangedAt',
  });
  next();
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 2000;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000.1
    );
    return JWTTimestamp < changedTimestamp;
  }
};

const User = mongoose.model("User", userSchema);
module.exports = User;
