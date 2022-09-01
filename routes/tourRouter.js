const router = require("express").Router();
const tourController = require("../controller/tourController");
const { top5Middleware } = require("../middleware/top5");

router.get("/", tourController.getAllTours);
router.get("/top-5", top5Middleware, tourController.getAllTours);
router.get("/statistic", tourController.getStatistics);
router.get("/monthly-plan/:year", tourController.getMontlyPlan);

router.get("/:id", tourController.getOneTour);
router.post("/", tourController.createTour);
router.patch("/:id", tourController.updateTour);
router.delete("/:id", tourController.deleteTour);

module.exports = router;
