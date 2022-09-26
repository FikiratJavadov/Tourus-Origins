const mongoose = require("mongoose");
const Tour = require("./tour");

const reviewSchema = mongoose.Schema({
  content: {
    type: String,
  },

  rating: {
    type: Number,
    required: [true, "Please provide rating for review"],
    min: 1,
    max: 5,
  },

  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },

  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "tour",
  },
});

reviewSchema.pre(/find/, function (next) {
  this.populate({
    path: "creator",
    select: "-password",
  });
  next();
});

reviewSchema.statics.getAveRating = async function (tourId) {
  const data = await this.aggregate([
    {
      $match: { tour: tourId },
    },

    {
      $group: {
        _id: "$tour",
        ratingQuantity: { $sum: 1 },
        ratingAve: { $avg: "$rating" },
      },
    },
  ]);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsAverage: data[0].ratingAve,
    ratingsQuantity: data[0].ratingQuantity,
  });

  //* Tour
};

reviewSchema.post("save", function (doc) {
  doc.constructor.getAveRating(doc.tour);
});

reviewSchema.post(/^findOneAnd/, function (doc) {
  doc.constructor.getAveRating(doc.tour);
});

const Review = mongoose.model("review", reviewSchema);

module.exports = Review;

//{{domain}}/tour/6310dbbbb3a86c9da2fd4fbb/reviews GET
