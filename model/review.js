const mongoose = require("mongoose");
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
  this.populate("creator").populate("tour");
  next();
});

const Review = mongoose.model("review", reviewSchema);

module.exports = Review;
