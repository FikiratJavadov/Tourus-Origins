const router = require("express").Router();
const tourController = require("../controller/tourController");
const { top5Middleware } = require("../middleware/top5");
const protectAuth = require("../middleware/protectAuth");
const roleAccess = require("../middleware/roleAccess");

router.get(
  "/",
  protectAuth,

  tourController.getAllTours
);

router.get("/top-5", top5Middleware, tourController.getAllTours);
router.get("/statistic", tourController.getStatistics);
router.get("/monthly-plan/:year", tourController.getMontlyPlan);

router.get("/:id", protectAuth, tourController.getOneTour);
router.post("/", protectAuth, tourController.createTour);
router.patch(
  "/:id",
  protectAuth,
  roleAccess("admin", "guide"),
  tourController.updateTour
);
router.delete(
  "/:id",
  protectAuth,
  roleAccess("admin"),
  tourController.deleteTour
);

module.exports = router;
