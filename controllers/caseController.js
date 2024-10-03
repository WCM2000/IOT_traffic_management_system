const Case = require("../models/caseModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const factory = require("./handlerFactory");
const axios = require("axios");
const moment = require("moment");
require("moment-timezone");

exports.createCase = factory.createOne(Case);
exports.getAllCases = factory.getAll(Case);
exports.getOneCase = factory.getOne(Case);
exports.updateOneCase = factory.updateOne(Case);
exports.deleteOneCase = factory.deleteOne(Case);

exports.handleNumberPlate = catchAsync(async (req, res, next) => {
  console.log(req.params);
  let tempDate = new Date();

  let a = moment.tz(tempDate, "Asia/Colombo").format();

  // console.log(new Date(a).toISOString().split("T")[0]);
  console.log(a.toString().split("T")[1]);
  console.log(a.toString().split("T")[0]);
  console.log("old date ", new Date().toISOString().split("T")[0]);
  // console.log(a.toISOString().split("T")[0]);
  // console.log();
  // console.log(a.split("T")[1]);
  // console.log(a.split("T")[0]);
  // let receivedTime = new Date().toISOString().split("T")[1];
  // let receivedDate = new Date().toISOString().split("T")[0];
  // let tempRec = `${
  //   new Date(a).toISOString().split("T")[1].split(".")[0].split(":")[0]
  // }:${new Date(a).toISOString().split("T")[1].split(".")[0].split(":")[1]}`;
  // console.log(tempRec);
  let tempTime = `${a.toString().split("T")[1].split(":")[0]}:${
    a.toString().split("T")[1].split(":")[1]
  }`;
  console.log(tempTime);
  let receivedTime = tempTime;
  let receivedDate = a.toString().split("T")[0];
  // let receivedDate = new Date(a).toISOString().split("T")[0];
  let recievedVehicleNumber = "cab3205" || req.params.vehicleNumber;
  let cameraLocation = req.params.city;

  let fetchedData;
  let url = `${process.env.TRAFFIC_API}/vehicles`;

  await axios(url, {
    method: "GET",
    params: {
      vehicleNumber: recievedVehicleNumber,
    },
  }).then((data) => {
    // console.log(data.data.doc.length);
    // console.log(data.results != 0);
    if (data.data.doc.length > 0) {
      fetchedData = data.data;
      delete fetchedData.doc[0]._id;
      delete fetchedData.doc[0].id;
    }
    // fetchedData.doc[0]._id = undefined;
    // fetchedData.doc[0].id = undefined;
  });
  let data =
    fetchedData && fetchedData.doc.length > 0
      ? {
          receivedTime,
          receivedDate,
          recievedVehicleNumber,
          cameraLocation,
          ...fetchedData.doc[0],
          qued: true,
          quedDate: receivedDate,
          quedTime: receivedTime,
        }
      : {
          receivedTime,
          receivedDate,
          recievedVehicleNumber,
          cameraLocation,
          unregisterd: true,
          qued: true,
          quedDate: receivedDate,
          quedTime: receivedTime,
        };

  const doc = await Case.create(data);
  if (!doc) {
    next(new AppError("There was a error getting data from api..", 400));
  }
  res.status(200).json({
    status: "success",
    doc,
  });
  //   const doc = await Case.create();
});
exports.handleNumberPlateSearch = catchAsync(async (req, res, next) => {
  console.log(req.params);
  let receivedTime = new Date().toISOString().split("T")[1];
  let receivedDate = new Date().toISOString().split("T")[0];
  let recievedVehicleNumber = req.params.vehicleNumber;
  let cameraLocation = req.params.city;

  let fetchedData;
  let url = `${process.env.TRAFFIC_API}/vehicles/search`;

  await axios(url, {
    method: "GET",
    params: {
      vehicleNumber: recievedVehicleNumber,
    },
  }).then((data) => {
    // console.log(data.data.doc.length);
    // console.log(data.results != 0);
    if (data.data.doc.length > 0) {
      fetchedData = data.data;
      delete fetchedData.doc[0]._id;
      delete fetchedData.doc[0].id;
    }
    // fetchedData.doc[0]._id = undefined;
    // fetchedData.doc[0].id = undefined;
  });
  let data =
    fetchedData && fetchedData.doc.length > 0
      ? {
          receivedTime,
          receivedDate,
          recievedVehicleNumber,
          cameraLocation,
          ...fetchedData.doc[0],
          qued: true,
          quedDate: receivedDate,
          quedTime: receivedTime,
        }
      : {
          receivedTime,
          receivedDate,
          recievedVehicleNumber,
          cameraLocation,
          unregisterd: true,
          qued: true,
          quedDate: receivedDate,
          quedTime: receivedTime,
        };

  const doc = await Case.create(data);
  if (!doc) {
    next(new AppError("There was a error getting data from api..", 400));
  }
  res.status(200).json({
    status: "success",
    doc,
  });
  //   const doc = await Case.create();
});

exports.searchCases = catchAsync(async (req, res, next) => {
  const { search } = req.query;
  let date = new Date();
  //   console.log(date.setHours(0, 0, 0));
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
    await Case.find({
      arrived: true,
      // appointmentDate: [gte]date,
      // "appointmentDate[lte]": date2,
      $or: [
        //   name: { $regex: search, $options: "i" },
        { currentOwner: { $regex: search, $options: "i" } },
        { vehicleNumber: { $regex: search, $options: "i" } },
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
exports.searchCityCases = catchAsync(async (req, res, next) => {
  const { search, city } = req.query;
  // console.log(typeof id, typeof search);
  if (search.length != 0) {
    await Case.find({
      $and: [
        //   name: { $regex: search, $options: "i" },
        { currentOwner: { $regex: search, $options: "i" } },
        { currentOwnerCity: { $regex: city, $options: "i" } },
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

exports.getCasesCountByDate = catchAsync(async (req, res, next) => {
  stats = await Case.aggregate([
    { $group: { _id: "$recievedDate", count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    status: "success",
    message: "done..",
    stats,
  });
});
exports.getCasesCountByTime = catchAsync(async (req, res, next) => {
  stats = await Case.aggregate([
    { $group: { _id: "$recievedTime", count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    status: "success",
    message: "done..",
    stats,
  });
});
exports.getCasesCountByVehicleNumber = catchAsync(async (req, res, next) => {
  stats = await Case.aggregate([
    { $group: { _id: "$vehicleNumber", count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    status: "success",
    message: "done..",
    stats,
  });
});
exports.getCasesCountByCity = catchAsync(async (req, res, next) => {
  stats = await Case.aggregate([
    { $group: { _id: "$currentOwnerCity", count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    status: "success",
    message: "done..",
    stats,
  });
});
exports.getCasesActiveCount = catchAsync(async (req, res, next) => {
  stats = await Case.aggregate([
    { $group: { _id: "$active", count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    status: "success",
    message: "done..",
    stats,
  });
});
exports.getCasesActiveCount = catchAsync(async (req, res, next) => {
  stats = await Case.aggregate([
    { $group: { _id: "$active", count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    status: "success",
    message: "done..",
    stats,
  });
});
exports.getCasesByWarrented = catchAsync(async (req, res, next) => {
  stats = await Case.aggregate([
    { $group: { _id: "$warrented", count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    status: "success",
    message: "done..",
    stats,
  });
});
exports.getCasesCountByOwner = catchAsync(async (req, res, next) => {
  stats = await Case.aggregate([
    { $group: { _id: "$currentOwner", count: { $sum: 1 } } },
  ]);

  res.status(200).json({
    status: "success",
    message: "done..",
    stats,
  });
});

// aggregate funcitons
exports.getCaseStatsByYeartoBeDiscontinued = catchAsync(
  async (req, res, next) => {
    let year = new Date().getFullYear();
    // let hospitalId = req.query.hospitalId;

    // let month = req.query.month;
    //   const getDaysInMonth = (year, month) => {
    //     return new Date(year, month, 0).getDate();
    //   };
    let MonthSForYear = 12;
    // console.log(MonthSForYear);

    let currentDay = `${year}-${01}-${01}`;
    // let nextDay;

    let nextDay;
    let stats;
    let countArray = [];

    // let ObjectId = new mongoose.Types.ObjectId(hospitalId);

    // let ObjectId = new mongoose.Types.ObjectId("641ffecd4e86b8852a090c16");

    let data = [];

    for (let i = 1; i <= MonthSForYear; i++) {
      // console.log(`${year}-${i}-${01}T00:00:00.000Z`);
      // console.log(`${year}-${i + 1}-${01}T00:00:00.000Z`);
      // currentDay = new Date(Date.UTC(`${year}-${i}-${01}`));
      // nextDay = new Date(Date.UTC(`${year}-${i + 1}-${01}`));
      currentDay = new Date(Date.UTC(year, i, 01, 0, 0, 0, 0));
      nextDay = new Date(Date.UTC(year, i + 1, 01, 0, 0, 0, 0));
      let nextDayNew = new Date(
        new Date(currentDay).setMonth(currentDay.getMonth() + 1)
      );

      // ---date object
      // console.log(currentDay);
      // console.log(nextDay);
      // console.log(
      //   new Date(new Date(currentDay).setMonth(currentDay.getMonth() + 1))
      // );

      // stats = await Appointment.find({
      //   hospitals: { $in: "641ffecd4e86b8852a090c16" },
      //   appointmentDate: { $gte: currentDay },
      //   appointmentDate: { $lte: nextDayNew },
      // });

      // console.log(stats.length);

      stats = await Case.aggregate([
        {
          $match: {
            // $and: [
            recievedDate: { $gte: currentDay, $lte: nextDayNew },
            // { hospitals: { $in: [ObjectId] } },
            // ],
            // hospitals: "642a5e5683051d9a2c583fc6",
            // appointmentTime: { $gte: timeArray[i], $lte: timeArray[i + 1] },
          },
        },
        // {
        //   $match: {
        //     appointmentDate: { $gte: currentDay, $lte: nextDayNew },
        //     // hospitals: "642a5e5683051d9a2c583fc6",
        //     // appointmentTime: { $gte: timeArray[i], $lte: timeArray[i + 1] },
        //   },
        // },
        { $group: { _id: null, count: { $sum: 1 } } },
      ]);

      // if (stats.length != 0) {
      //   console.log(stats.length);
      //   countArray.push(stats.length);
      //   console.log(stats);
      // } else {
      //   countArray.push(0);
      // }

      // stats = "";
      // console.log(stats);

      data.push(stats);

      if (stats && stats[0] && stats[0].count != undefined) {
        countArray.push(stats[0].count);
      } else {
        countArray.push(0);
      }
    }

    res.status(200).json({
      status: "success",
      // results: stats.length,
      // data: {
      stats,
      countArray,
      data,
      // },
    });
  }
);
exports.getCaseStatsByYear = catchAsync(async (req, res, next) => {
  let year = new Date().getFullYear();
  let month = new Date().getMonth();
  // let hospitalId = req.query.hospitalId;

  // let month = req.query.month;
  //   const getDaysInMonth = (year, month) => {
  //     return new Date(year, month, 0).getDate();
  //   };
  // let MonthSForYear = 12;
  // console.log(MonthSForYear);

  let currentDay = `${year}-${month}-${01}`;
  // let nextDay;

  let nextDay;
  let stats;
  let countArray = [];

  // let ObjectId = new mongoose.Types.ObjectId(hospitalId);

  // let ObjectId = new mongoose.Types.ObjectId("641ffecd4e86b8852a090c16");

  let data = [];

  // for (let i = 1; i <= MonthSForYear; i++) {
  // console.log(`${year}-${i}-${01}T00:00:00.000Z`);
  // console.log(`${year}-${i + 1}-${01}T00:00:00.000Z`);
  // currentDay = new Date(Date.UTC(`${year}-${i}-${01}`));
  // nextDay = new Date(Date.UTC(`${year}-${i + 1}-${01}`));

  for (let i = 1; i <= 12; i++) {
    currentDay = new Date(Date.UTC(year, i, 01, 0, 0, 0, 0));
    nextDay = new Date(Date.UTC(year, i + 1, 01, 0, 0, 0, 0));
    let nextDayNew = new Date(
      new Date(currentDay).setMonth(currentDay.getMonth() + 1)
    );
    // ---date object
    // console.log(currentDay);
    // console.log(nextDay);
    // console.log(
    //   new Date(new Date(currentDay).setMonth(currentDay.getMonth() + 1))
    // );

    // stats = await Appointment.find({
    //   hospitals: { $in: "641ffecd4e86b8852a090c16" },
    //   appointmentDate: { $gte: currentDay },
    //   appointmentDate: { $lte: nextDayNew },
    // });

    console.log(currentDay, nextDay);

    stats = await Case.aggregate([
      {
        $match: {
          // $and: [
          receivedDate: {
            $gte: currentDay.toISOString(),
            $lte: nextDayNew.toISOString(),
          },
          // { hospitals: { $in: [ObjectId] } },
          // ],
          // hospitals: "642a5e5683051d9a2c583fc6",
          // appointmentTime: { $gte: timeArray[i], $lte: timeArray[i + 1] },
        },
      },
      // {
      //   $match: {
      //     appointmentDate: { $gte: currentDay, $lte: nextDayNew },
      //     // hospitals: "642a5e5683051d9a2c583fc6",
      //     // appointmentTime: { $gte: timeArray[i], $lte: timeArray[i + 1] },
      //   },
      // },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    // if (stats.length != 0) {
    //   console.log(stats.length);
    //   countArray.push(stats.length);
    //   console.log(stats);
    // } else {
    //   countArray.push(0);
    // }

    // stats = "";
    // console.log(stats);

    data.push(stats);

    if (stats && stats.length > 0 && stats[0].count) {
      countArray.push(stats[0].count);
    } else {
      countArray.push(0);
    }
  }

  res.status(200).json({
    status: "success",
    // results: stats.length,
    // data: {
    stats,
    countArray,
    data,
    // },
  });
});
exports.getCaseCaseCountByWeekDays = catchAsync(async (req, res, next) => {
  let year = new Date().getFullYear();
  let month = new Date().getMonth();
  // let hospitalId = req.query.hospitalId;

  // let month = req.query.month;
  //   const getDaysInMonth = (year, month) => {
  //     return new Date(year, month, 0).getDate();
  //   };
  // let MonthSForYear = 12;
  // console.log(MonthSForYear);

  let currentDay = `${year}-${month}-${01}`;
  // let nextDay;

  let nextDay;
  let stats;
  let countArray = [];

  let startOfWeek = moment().startOf("isoweek").toDate();
  let endOfWeek = moment().endOf("isoweek").toDate();
  console.log(startOfWeek.getDate(), endOfWeek.getDate());

  let data = [];

  for (let i = startOfWeek.getDate(); i <= endOfWeek.getDate(); i++) {
    currentDay = new Date(Date.UTC(year, month, i, 0, 0, 0, 0));
    nextDay = new Date(Date.UTC(year, month, i + 1, 0, 0, 0, 0));
    let nextDayNew = new Date(
      new Date(currentDay).setDate(currentDay.getDate() + 1)
    );
    // ---date object
    // console.log(currentDay);
    // console.log(nextDay);
    // console.log(
    //   new Date(new Date(currentDay).setMonth(currentDay.getMonth() + 1))
    // );

    // stats = await Appointment.find({
    //   hospitals: { $in: "641ffecd4e86b8852a090c16" },
    //   appointmentDate: { $gte: currentDay },
    //   appointmentDate: { $lte: nextDayNew },
    // });

    console.log(currentDay, nextDay);

    stats = await Case.aggregate([
      {
        $match: {
          // $and: [
          receivedDate: {
            $gte: currentDay.toISOString(),
            $lte: nextDayNew.toISOString(),
          },
          // { hospitals: { $in: [ObjectId] } },
          // ],
          // hospitals: "642a5e5683051d9a2c583fc6",
          // appointmentTime: { $gte: timeArray[i], $lte: timeArray[i + 1] },
        },
      },
      // {
      //   $match: {
      //     appointmentDate: { $gte: currentDay, $lte: nextDayNew },
      //     // hospitals: "642a5e5683051d9a2c583fc6",
      //     // appointmentTime: { $gte: timeArray[i], $lte: timeArray[i + 1] },
      //   },
      // },
      { $group: { _id: null, count: { $sum: 1 } } },
    ]);

    // if (stats.length != 0) {
    //   console.log(stats.length);
    //   countArray.push(stats.length);
    //   console.log(stats);
    // } else {
    //   countArray.push(0);
    // }

    // stats = "";
    // console.log(stats);

    data.push(stats);

    if (stats && stats.length > 0 && stats[0].count) {
      countArray.push(stats[0].count);
    } else {
      countArray.push(0);
    }
  }

  res.status(200).json({
    status: "success",
    // results: stats.length,
    // data: {
    stats,
    countArray,
    data,
    // },
  });
});

exports.getCaseCountByDailyHours = catchAsync(async (req, res, next) => {
  let date = new Date();
  let date2 = new Date();
  date = date.setUTCHours(0, 0, 0, 0);
  date = new Date(date);
  date2 = date2.setUTCHours(0, 0, 0, 0);
  date2 = new Date(date2);
  date2 = date2.setDate(date.getDate() + 1);
  // console.log(typeof date, typeof date2);
  date = date.toISOString();
  // console.log(new Date(date2).toISOString());
  date2 = new Date(date2).toISOString();
  // console.log(date);
  // console.log(date2);
  date = new Date(date);
  date2 = new Date(date2);
  // const stats = await Appointment.find(
  //   // {
  //   //   "appointmentDate[gte]": date,
  //   //   "appointmentDate[gte]": date2,
  //   // },
  //   { appointmentDate: { $gte: date, $lte: date2 } }
  // );

  const timeArray = [
    "00:00",
    "01:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ];

  let countArray = [];

  for (let i = 0; i < timeArray.length; i++) {
    const stats = await Case.aggregate([
      {
        $match: {
          receivedTime: { $gte: date, $lte: date2 },
          receivedTime: { $gte: timeArray[i], $lte: timeArray[i + 1] },
        },
      },
      { $group: { _id: null, count: { $sum: 1 } } },
      // {
      //   $match: {
      //     appointmentDate: {
      //       $gte: date,
      //       // $lte: date2,
      //     },
      //   },
      // },
      // {
      //   $group: {
      //     _id: { $toUpper: "$appointmentDate" },
      //     numAppointments: { $sum: 1 },

      //     // numRatings: { $sum: "$ratingsQuantity" },
      //     // avgRating: { $avg: "$ratingsAverage" },
      //     // avgPrice: { $avg: "$price" },
      //     // minPrice: { $min: "$price" },
      //     // maxPrice: { $max: "$price" },
      //   },
      // },
      // {
      //   $match: {
      //     appointmentDate: {
      //       $gte: date,
      //       $lte: date2,
      //     },
      //   },
      // },

      // {
      //   $sort: { avgPrice: 1 },
      // },
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
    ]);
    if (stats[0] != undefined) {
      console.log(stats[0].count);
      countArray.push(stats[0].count);
    } else {
      countArray.push(0);
    }
    // console.log(stats[0].count);
  }

  // const stats = await Appointment.aggregate([
  //   {
  //     $match: {
  //       appointmentDate: { $gte: date, $lte: date2 },
  //       appointmentTime: { $gte: "13:00", $lte: "14:00" },
  //     },
  //   },
  //   { $group: { _id: null, count: { $sum: 1 } } },
  //   // {
  //   //   $match: {
  //   //     appointmentDate: {
  //   //       $gte: date,
  //   //       // $lte: date2,
  //   //     },
  //   //   },
  //   // },
  //   // {
  //   //   $group: {
  //   //     _id: { $toUpper: "$appointmentDate" },
  //   //     numAppointments: { $sum: 1 },

  //   //     // numRatings: { $sum: "$ratingsQuantity" },
  //   //     // avgRating: { $avg: "$ratingsAverage" },
  //   //     // avgPrice: { $avg: "$price" },
  //   //     // minPrice: { $min: "$price" },
  //   //     // maxPrice: { $max: "$price" },
  //   //   },
  //   // },
  //   // {
  //   //   $match: {
  //   //     appointmentDate: {
  //   //       $gte: date,
  //   //       $lte: date2,
  //   //     },
  //   //   },
  //   // },

  //   // {
  //   //   $sort: { avgPrice: 1 },
  //   // },
  //   // {
  //   //   $match: { _id: { $ne: 'EASY' } }
  //   // }
  // ]);

  res.status(200).json({
    status: "success",
    // results: stats.length,
    // data: {
    countArray,
    // },
  });
});

//  ---------------------working one newly found aggregate query-----------------------

// exports.getCaseCountByDailyHours = catchAsync(async (req, res, next) => {
//   const stats = await Case.aggregate([
//     // {
//     //   $match: {
//     //     receivedTime: { $gte: date, $lte: date2 },
//     //     receivedTime: { $gte: timeArray[i], $lte: timeArray[i + 1] },
//     //   },
//     // },
//     {
//       $group: {
//         _id: { $dateTrunc: { date: "$createdAt", unit: "hour" } },
//         count: { $sum: 1 },
//       },
//     },
//     // -----------------working------------------------
//     // {
//     //   $match: {
//     //     createdAt: {
//     //       $gt: moment().startOf("hour").subtract(24, "hours").toDate(),
//     //     },
//     //   },
//     // },
//     // {
//     //   $group: {
//     //     _id: {
//     //       y: { $year: "$createdAt" },
//     //       m: { $month: "$createdAt" },
//     //       d: { $dayOfMonth: "$createdAt" },
//     //       h: { $hour: "$createdAt" },
//     //     },
//     //     count: { $sum: 1 },
//     //   },
//     // },
//     // -----------------working------------------------
//     // {
//     //   $match: {
//     //     appointmentDate: {
//     //       $gte: date,
//     //       // $lte: date2,
//     //     },
//     //   },
//     // },
//     // {
//     //   $group: {
//     //     _id: { $toUpper: "$appointmentDate" },
//     //     numAppointments: { $sum: 1 },
//     //     // numRatings: { $sum: "$ratingsQuantity" },
//     //     // avgRating: { $avg: "$ratingsAverage" },
//     //     // avgPrice: { $avg: "$price" },
//     //     // minPrice: { $min: "$price" },
//     //     // maxPrice: { $max: "$price" },
//     //   },
//     // },
//     // {
//     //   $match: {
//     //     appointmentDate: {
//     //       $gte: date,
//     //       $lte: date2,
//     //     },
//     //   },
//     // },
//     // {
//     //   $sort: { avgPrice: 1 },
//     // },
//     // {
//     //   $match: { _id: { $ne: 'EASY' } }
//     // }
//   ]);
//   // if (stats[0] != undefined) {
//   //   console.log(stats[0].count);
//   //   countArray.push(stats[0].count);
//   // } else {
//   //   countArray.push(0);
//   // }

//   res.status(200).json({
//     status: "success",
//     // results: stats.length,
//     // data: {
//     // countArray,
//     stats,
//     // },
//   });
// });

// --------------------------------------------------END------------------------------------------------------

// working --------------------------

// --------------------------------------------------------END -------------------------------------------------

// exports.getCaseCountByDailyHours = catchAsync(async (req, res, next) => {
//   let year = new Date().getFullYear();
//   let month = new Date().getMonth();
//   // let hospitalId = req.query.hospitalId;

//   // let month = req.query.month;
//   //   const getDaysInMonth = (year, month) => {
//   //     return new Date(year, month, 0).getDate();
//   //   };
//   // let MonthSForYear = 12;
//   // console.log(MonthSForYear);

//   // let currentDay = `${year}-${month}-${01}`;
//   // let nextDay;

//   let nextDay;
//   let stats;
//   let countArray = [];

//   let startOfWeek = moment().startOf("isoweek").toDate();
//   let endOfWeek = moment().endOf("isoweek").toDate();
//   console.log(startOfWeek.getDate(), endOfWeek.getDate());

//   let data = [];

//   var start = moment().startOf("day").utcOffset(0); // set to 12:00 am today
//   start.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
//   var end = moment().endOf("day").utcOffset(0); // set to 23:59 pm today
//   end.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
//   let currentDay = moment.utc().startOf("day").toDate(); // set to 12:00 am today
//   let nextDayNew = moment.utc().endOf("day").toDate(); // set to 23:59 pm today
//   console.log(start.toDate(), end.toDate(), "579");

//   currentDay = start;
//   for (let i = 1; i <= 24; i++) {
//     console.log(start);
//     end = moment(start).add(1, "h").toDate();

//     // startTime = start.split("T")[1];
//     // endTime = end.split("T")[1];
//     // end = new Date(start.setUTCHours(start.getUTCHours() + 1)).toISOString();
//     // ---date object
//     // console.log(currentDay);
//     // console.log(nextDay);
//     // console.log(
//     //   new Date(new Date(currentDay).setMonth(currentDay.getMonth() + 1))
//     // );

//     // stats = await Appointment.find({
//     //   hospitals: { $in: "641ffecd4e86b8852a090c16" },
//     //   appointmentDate: { $gte: currentDay },
//     //   appointmentDate: { $lte: nextDayNew },
//     // });

//     console.log(
//       // start.toISOString().split("T")[1],
//       // end.toISOString().split("T")[1],
//       start,
//       end
//     );

//     stats = await Case.aggregate([
//       {
//         $match: {
//           // $and: [
//           //   // {
//           //   //   receivedDate: {
//           //   //     $gte: currentDay.toISOString(),
//           //   //     $lte: nextDayNew.toISOString(),
//           //   //   },
//           //   // },
//           //   {
//           recievedTime: {
//             $gte: start.toISOString().split("T")[1],
//             $lte: end.toISOString().split("T")[1],
//           },
//           //   },
//           // ],
//           // hospitals: "642a5e5683051d9a2c583fc6",
//           // appointmentTime: { $gte: timeArray[i], $lte: timeArray[i + 1] },
//         },
//       },
//       // {
//       //   $match: {
//       //     appointmentDate: { $gte: currentDay, $lte: nextDayNew },
//       //     // hospitals: "642a5e5683051d9a2c583fc6",
//       //     // appointmentTime: { $gte: timeArray[i], $lte: timeArray[i + 1] },
//       //   },
//       // },
//       { $group: { _id: null, count: { $sum: 1 } } },
//     ]);

//     // if (stats.length != 0) {
//     //   console.log(stats.length);
//     //   countArray.push(stats.length);
//     //   console.log(stats);
//     // } else {
//     //   countArray.push(0);
//     // }

//     // stats = "";
//     // console.log(stats);

//     start = end;

//     data.push(stats);

//     if (stats && stats.length > 0 && stats[0].count) {
//       countArray.push(stats[0].count);
//     } else {
//       countArray.push(0);
//     }
//   }

//   res.status(200).json({
//     status: "success",
//     // results: stats.length,
//     // data: {
//     stats,
//     countArray,
//     data,
//     // },
//   });
// });

// --------------------------------------END______________________________________________________
