const router = require("express").Router();
const tourController = require("../controller/tourController");

const top5Middleware = (req, res, next) => {
  req.query.sort = "price -ratingsAverage";
  req.query.limit = 5;
  next()
};

router.get("/", tourController.getAllTours);
router.get("/top-5", top5Middleware, tourController.getAllTours);
router.get("/:id", tourController.getOneTour);
router.post("/", tourController.createTour);

module.exports = router;
