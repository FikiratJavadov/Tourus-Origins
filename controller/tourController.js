const Tour = require("../model/tour");
const GlobalFilter = require("../utils/GlobalFilter");

exports.getAllTours = async (req, res) => {
  //!MongoDb object
  // let tours = Tour.find();

  const tours = new GlobalFilter(Tour.find(), req.query);
  tours.filter().sort().fields().paginate();



  try {
    const allData = await tours.query;

    res.json({
      success: true,
      length: allData.length,
      data: {
        tours: allData,
      },
    });
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
};

exports.getOneTour = (req, res, next) => {
  try {
    const id = req.params.id;

    const tour = tours.find((t) => t.id == id);

    if (!tour) return res.send({ success: false, message: "Invalid ID" });

    res.json({ success: true, data: { tour } });
  } catch (error) {
    res.json({
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
