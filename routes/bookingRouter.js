const router = require("express").Router({ mergeParams: true });
const bookingController = require("../controller/bookingController");
const protectAuth = require("../middleware/protectAuth");

router.post("/checkout/:tourId", protectAuth, bookingController.checkout);
router.post("/", protectAuth, bookingController.createBooking);

module.exports = router;
