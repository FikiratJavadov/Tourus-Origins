const mongoose = require("mongoose");

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name must be defined!"],
      unique: true,
    },

    duration: {
      type: Number,
      required: [true, "Duration must be defined!"],
    },

    maxGroupSize: {
      type: Number,
      required: [true, "Group size must be defined!"],
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "difficult"],
      default: "easy",
    },

    ratingsAverage: {
      type: Number,
      required: [true, "Rating must be defined!"],
    },

    ratingsQuantity: {
      type: Number,
    },
    price: {
      type: Number,
      required: [true, "Price must be defined!"],
    },

    summary: {
      type: String,
      required: [true, "Summary must be defined!"],
    },

    description: {
      type: String,
    },

    imageCover: {
      type: String,
      required: [true, "Image cover must be defined!"],
    },

    images: {
      type: [String],
    },
    startDates: {
      type: [Date],
      required: [true, "Date must be defined!"],
    },
  },
  { timestamps: true }
);

const Tour = mongoose.model("tour", tourSchema);

module.exports = Tour;
