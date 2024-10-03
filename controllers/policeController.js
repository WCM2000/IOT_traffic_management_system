const Police = require("../models/policeModel");
const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");

exports.getAllPoliceStations = factory.getAll(Police);
exports.getOnePoliceStation = factory.getOne(Police);
exports.createPoliceStation = factory.createOne(Police);
exports.updatePoliceStation = factory.updateOne(Police);
exports.deletePoliceStation = factory.deleteOne(Police);

exports.policeNameId = catchAsync(async (req, res, next) => {
  const doc = await Police.find({}).select({ policeStationName: 1, _id: 1 });

  if (doc) {
    res.status(200).json({
      status: "success",
      message: `${doc.length} documents found...`,
      results: doc.length,
      doc,
    });
  }
});

exports.searchPolice = catchAsync(async (req, res, next) => {
  const { search } = req.query;
  let date = new Date();

  //   console.log(date.setDate(date.getDate() + 1));
  // console.log(date.setHours(0, 0, 0, 0));
  // console.log(date.toISOString());
  let date2 = new Date();
  // console.log(date2.setHours(0, 0, 0, 0));
  date2 = date2.setDate(date.getDate() + 1);
  // console.log(typeof date, typeof date2);
  date = date.toISOString();
  // console.log(new Date(date2).toISOString());
  date2 = new Date(date2).toISOString();

  //   console.log(req.query);
  if (search.length != 0) {
    await Police.find({
      // arrived: true,
      // appointmentDate: [gte]date,
      // "appointmentDate[lte]": date2,
      $or: [
        //   name: { $regex: search, $options: "i" },
        { policeStationName: { $regex: search, $options: "i" } },
        // { vehicleNumber: { $regex: search, $options: "i" } },
        // { arrived: { $regex: true, $options: "i" } },
        // { _id: { $regex: search, $options: "i" } },
        //   _id: { $regex: search, $options: "i" },
        // { active: { $regex: search, $options: "i" } },
        // { patients: { $regex: search, $options: "i" } },
        // { hospitals: { $regex: search, $options: "i" } },
        // { appointmentDate: { $regex: search, $options: "i" } },
      ],
    })
      .then((data) => {
        res.status(200).json({
          status: "success",
          message: `${data.length} found...`,
          data,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          satus: "failed",
          message: err,
        });
      });
  }
});
