const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name must be defined!"],
      unique: true,
      trim: true,
    },

    duration: {
      type: Number,
      required: [true, "Duration must be defined!"],
    },

    maxGroupSize: {
      type: Number,
      required: [true, "Group size must be defined!"],
    },

    startLocation: {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      description: String,
      coordinates: [Number],
      address: String,
    },

    difficulty: {
      type: String,
      enum: ["easy", "medium", "difficult"],
      default: "easy",
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
    },

    ratingsQuantity: {
      type: Number,
    },
    slug: String,
    price: {
      type: Number,
      required: [true, "Price must be defined!"],
    },

    priceDiscount: {
      type: Number,
      validate: {
        validator: function (el) {
          return this.price > el;
        },

        message: "Discount of ({VALUE}) can not exceed the price",
      },
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

    locations: [
      {
        // type: {
        //   place: String,
        place: String, // },
        coordinates: [Number],
        description: String,
        day: String,
      },
    ],

    guides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],

    delted: {
      type: Boolean,
      default: false,
    },

    images: {
      type: [String],
    },
    startDates: {
      type: [Date],
      required: [true, "Date must be defined!"],
    },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

//!Virtuals

tourSchema.index({ startLocation: "2dsphere" });

tourSchema.virtual("week").get(function () {
  return this.duration / 7;
});

tourSchema.virtual("reviews", {
  ref: "review",
  foreignField: "tour",
  localField: "_id",
});

//!pre/post save - middleware

tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, "-");
  this.start = Date.now();
  next();
});

tourSchema.post("save", function (document, next) {
  this.slug = slugify(this.name, "-");
  console.log(Date.now() - this.start);
  next();
});

//!pre/post find

tourSchema.pre("find", function (next) {
  this.find({ delted: false });
  next();
});

//!pre/post aggregate

tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { delted: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model("tour", tourSchema);

module.exports = Tour;
