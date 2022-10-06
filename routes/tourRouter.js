const router = require("express").Router();
const tourController = require("../controller/tourController");
const reviewController = require("../controller/reviewController");
const { top5Middleware } = require("../middleware/top5");
const protectAuth = require("../middleware/protectAuth");
const roleAccess = require("../middleware/roleAccess");
const reviewRouter = require("./reviewRouter");

router.use("/:tourId/review", reviewRouter);

router.get("/", tourController.getAllTours);

router.get("/top-5", top5Middleware, tourController.getAllTours);
router.get("/statistic", tourController.getStatistics);
router.get(
  "/monthly-plan/:year",
  protectAuth,
  roleAccess("guide", "lead-guide"),
  tourController.getMontlyPlan
);

router.get("/withinRadius/:radius/location/:latlog", tourController.getWithin);
router.get("/:id", tourController.getOneTour);

//* Portected and Role middlewares
router.use(protectAuth);
router.use(roleAccess("admin"));

router.post("/", tourController.createTour);
router.patch("/:id", tourController.updateTour);
router.delete("/:id", tourController.deleteTour);

module.exports = router;
