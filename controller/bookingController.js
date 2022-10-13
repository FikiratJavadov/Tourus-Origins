const User = require("../model/user");
const { asyncCatch } = require("../utils/asyncCatch");
const GlobalError = require("../error/GlobalError");
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const Tour = require("../model/tour");

exports.checkout = asyncCatch(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);

  //Checkout
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
        price_data: {
          currency: "usd",
          product_data: {
            name: tour.name,
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1,
      },
    ],

    payment_method_types: ["card"],
    mode: "payment",
    // client_reference_id: req.params.tourId,
    customer_creation: "always",
    customer_reference: tour._id,
    customer_email: req.user.email,
    success_url: `http://localhost:3000`,
    cancel_url: `http://localhost:3000/error`,
  });

  res.status(201).json({ success: true, session });
});

exports.createBooking = asyncCatch(async (req, res, next) => {
    
});
