const router = require("express").Router({ mergeParams: true });
const reviewController = require("../controller/reviewController");
const protectAuth = require("../middleware/protectAuth");
const roleAccess = require("../middleware/roleAccess");

router.get("/", reviewController.getReviews);
router.post(
  "/",
  protectAuth,
  roleAccess("user"),
  reviewController.createReview
);
router.delete(
  "/:id",
  protectAuth,
  roleAccess("user"),
  reviewController.deleteReview
);

module.exports = router;
