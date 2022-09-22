const Review = require("../model/review");
const { asyncCatch } = require("../utils/asyncCatch");
const GlobalError = require("../error/GlobalError");

exports.getReviews = asyncCatch(async (req, res, next) => {
  const reviews = await Review.find({ tour: req.params.tourId });

  res.json({
    success: true,
    reviews,
  });
});

exports.createReview = asyncCatch(async (req, res, next) => {
  const review = await Review.create(req.body);

  res.json({
    success: true,
    review,
  });
});
