const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// case schema
const caseSchema = new mongoose.Schema(
  {
    receivedTime: {
      type: String,
      required: [true, "Recieved time is required.."],
    },
    active: {
      type: Boolean,
      enum: [true, false],
      default: true,
    },
    checked: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    qued: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    quedDate: {
      type: Date,
    },
    checkedDate: {
      type: Date,
    },
    warrentedDate: {
      type: Date,
    },
    // validate: {
    //     validator: function (el) {
    //       return el === this.password;
    //     },
    //     message: 'passwords are not the same',
    //   },
    warrented: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    unregisterd: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    warrentClosedDate: {
      type: Date,
    },

    receivedDate: {
      type: String,
    },
    cameraLocation: {
      type: String,
    },
    recievedVehicleNumber: {
      type: String,
    },

    vehicleNumber: {
      type: String,
      //   required: [true, "Plese add you Vehicle Numeber"],
    },
    currentOwner: {
      type: String,
      //   required: [true, "Plese add you Current Owner"],
    },
    currentOwnerCity: {
      type: String,
      //   required: [true, "Plese add current owner city"],
    },
    currentOwnerAddress: {
      type: String,
      //   required: [true, "Plese add current owner address"],
    },
    conditionsAndNotes: {
      type: String,
      // required: [true, "Plese add current owner address"],
    },
    make: {
      type: String,
      // required: [true, "Plese add current owner address"],
    },
    model: {
      type: String,
      // required: [true, "Plese add current owner address"],
    },
    yearOfManufacture: {
      type: String,
      // required: [true, "Plese add current owner address"],
    },
    dateOfRegistration: {
      type: String,
      // required: [true, "Plese add current owner address"],
    },
    engineCapacity: {
      type: String,
      // required: [true, "Plese add current owner address"],
    },
    fuelType: {
      type: String,
      // required: [true, "Plese add current owner address"],
    },
    statusWhenRegisterd: {
      type: String,
      // required: [true, "Plese add current owner address"],
    },
    crType: {
      type: String,
      // required: [true, "Plese add current owner address"],
    },
    typeOfBody: {
      type: String,
      // required: [true, "Plese add current owner address"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// caseSchema.pre("save", function (next) {
//   if (!this.isModified("password") || this.isNew) return next();

//   this.passwordChangedAt = Date.now() - 2000;
//   next();
// });

caseSchema.pre(/^find/, function (next) {
  let qued = new Date(this.quedDate);
  let today = new Date();
  if (qued.getDate() + 7 > today) {
    this.warrented = true;
  }
  //   this.find({ active: { $ne: false } });
  next();
});

const Case = mongoose.model("Case", caseSchema);
module.exports = Case;
