const Tour = require("../model/tour");
const GlobalFilter = require("../utils/GlobalFilter");
const { asyncCatch } = require("../utils/asyncCatch");
const GlobalError = require("../error/GlobalError");
const { deleteOne, getOne } = require("../utils/factory");

exports.getAllTours = asyncCatch(async (req, res) => {
  const tours = new GlobalFilter(Tour.find(), req.query);
  tours.filter().sort().fields().paginate();

  const allData = await tours.query;

  res.status(201).json({
    success: true,
    length: allData.length,
    data: {
      tours: allData,
    },
  });
});

exports.getOneTour = getOne(Tour);

// asyncCatch

exports.createTour = asyncCatch(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.json({
    success: true,
    data: {
      newTour,
    },
  });
});

exports.updateTour = asyncCatch(async (req, res) => {
  const id = req.params.id;

  const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!updatedTour) return next(new GlobalError("`Invalid ID`", 404));

  res.json({ success: true, data: { updatedTour } });
});

exports.deleteTour = deleteOne(Tour);

exports.getStatistics = asyncCatch(async (req, res) => {
  const aggregateData = await Tour.aggregate([
    {
      $group: {
        _id: "$difficulty",
        tourSum: { $sum: 1 },
        maxPrice: { $max: "$price" },
        minPrice: { $min: "$price" },
        averageRating: { $avg: "$ratingsAverage" },
      },
    },

    {
      $sort: {
        tourSum: -1,
      },
    },
  ]);

  res.json({
    success: true,
    data: aggregateData,
    length: aggregateData.length,
  });
});

exports.getMontlyPlan = asyncCatch(async (req, res) => {
  const year = parseInt(req.params.year);

  const data = await Tour.aggregate([
    {
      $unwind: "$startDates",
    },

    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },

    {
      $group: {
        _id: { $month: "$startDates" },
        sum: { $sum: 1 },
        tours: { $push: "$name" },
        people: { $sum: "$maxGroupSize" },
      },
    },

    {
      $addFields: {
        month: "$_id",
      },
    },

    {
      $project: {
        _id: 0,
      },
    },

    {
      $sort: {
        sum: -1,
      },
    },
  ]);

  res.json({
    success: true,
    data: data,
    length: data.length,
  });
});

exports.getWithin = asyncCatch(async (req, res) => {
  const { radius, latlog } = req.params;
  const [lat, log] = latlog.split(",");

  const r = radius / 6371;

  const data = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[log, lat], r] } },
  });

  res.json({
    success: true,
    data: data,
    length: data.length,
  });
});
