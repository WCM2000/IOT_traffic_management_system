const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const APIFeatures = require("./../utils/apiFeatures");

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    if (!doc) {
      return next(
        new AppError("There was an error creating the document...", 500)
      );
    }

    res.status(201).json({
      status: "success",
      message: "document created successfully...",
      doc,
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = await Model.findById(req.params.id);

    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that Id ...", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Document found...",
      doc,
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter;

    if (req.params.id) filter = { user: req.params.id };
    console.log(req.query);

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // console.log(features);

    const doc = await features.query;

    let count = await new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields();

    let totalCount = await count.query.countDocuments();

    res.status(200).json({
      status: "success",
      message: `${doc.length} documents found...`,
      results: doc.length,
      totalCount,
      doc,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that Id....", 404));
    }

    res.status(200).json({
      status: "success",
      message: "Document updated successfully...",

      doc,
    });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next("No document found with that Id...", 404);
    }

    res.status(200).json({
      status: "success",
      message: "Document deleted successfully...",
    });
  });
