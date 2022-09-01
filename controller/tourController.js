const Tour = require("../model/tour");
const GlobalFilter = require("../utils/GlobalFilter");

exports.getAllTours = async (req, res) => {
  //!MongoDb object
  // let tours = Tour.find();

  const tours = new GlobalFilter(Tour.find(), req.query);
  tours.filter().sort().fields().paginate();

  try {
    const allData = await tours.query;

    res.status(201).json({
      success: true,
      length: allData.length,
      data: {
        tours: allData,
      },
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error,
    });
  }
};

exports.getOneTour = async (req, res, next) => {
  try {
    const id = req.params.id;

    const tour = await Tour.findById(id);

    if (!tour)
      return res.status(404).json({ success: false, message: "Invalid ID" });

    res.json({ success: true, data: { tour } });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error,
    });
  }
};

exports.createTour = async (req, res, next) => {
  try {
    const newTour = await Tour.create(req.body);

    console.log("here");

    res.json({
      success: true,
      data: {
        newTour,
      },
    });
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const id = req.params.id;

    const updatedTour = await Tour.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedTour)
      return res.send({ success: false, message: "Invalid ID" });

    res.json({ success: true, data: { updatedTour } });
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedTour = await Tour.findByIdAndRemove(id);

    if (!deletedTour)
      return res.send({ success: false, message: "Invalid ID" });

    res.json({ success: true });
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
};

exports.getStatistics = async (req, res) => {
  console.log("here");

  try {
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
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
};

exports.getMontlyPlan = async (req, res) => {
  const year = parseInt(req.params.year);

  try {
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
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
};
