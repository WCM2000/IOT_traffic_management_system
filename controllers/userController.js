const User = require("../models/userModel");
const factory = require("./handlerFactory");
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an Image Please upload only an image..", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserImages = upload.fields([{ name: "images", maxCount: 5 }]);

exports.resizeUserImages = catchAsync(async (req, res, next) => {
  console.log(!req.files.images);
  if (!req.files.images) return next();

  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `user-${req.user._id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2400, 1600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${filename}`);

      req.body.images.push(filename);
    })
  );

  next();
});

exports.getAllUsers = factory.getAll(User);
exports.getOneUser = factory.getOne(User);
exports.updateOneUser = factory.updateOne(User);
exports.deleteOneUser = factory.deleteOne(User);
exports.createOneUser = factory.createOne(User);

exports.getImage = catchAsync(async (req, res) => {
  let fileName = req.params.imageName;

  let options = {
    root: path.join(__dirname, "../public/img/users"),
    dotfiles: "deny",
    headers: {
      "x-timestamp": Date.now(),
      "x-sent": true,
    },
  };

  res.sendFile(fileName, options, function (err) {
    if (err) {
      res.status(500).json({
        err,
      });
    } else {
      console.log("Sent:", fileName);
    }
  });
});

exports.searchUsers = catchAsync(async (req, res, next) => {
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
    await User.find({
      // arrived: true,
      // appointmentDate: [gte]date,
      // "appointmentDate[lte]": date2,
      $or: [
        //   name: { $regex: search, $options: "i" },
        { name: { $regex: search, $options: "i" } },

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
