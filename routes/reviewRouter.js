const router = require("express").Router();
const reviewController = require("../controller/reviewController");
const protectAuth = require("../middleware/protectAuth");

router.get("/:tourId", protectAuth, reviewController.getReviews);
router.post("/", protectAuth, reviewController.createReview);

module.exports = router;


