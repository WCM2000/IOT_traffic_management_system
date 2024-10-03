const mongoose = require("mongoose");

const policeSchema = new mongoose.Schema(
  {
    policeStationName: {
      type: String,
      required: [true, "Police station must have a name"],
    },
    city: {
      type: String,
      required: [true, "Police station must have a city"],
    },
    description: {
      type: String,
      required: [true, "Recieved time is required.."],
    },
    oicName: {
      type: String,
      required: [true, "Police station must have a OIC"],
    },
    oicId: {
      type: String,
      required: [true, "OIC must have a ID"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// policeSchema.pre("save", function (next) {
//   if (!this.isModified("password") || this.isNew) return next();

//   this.passwordChangedAt = Date.now() - 2000;
//   next();
// });

const Police = mongoose.model("Police", policeSchema);
module.exports = Police;
