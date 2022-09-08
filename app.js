const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config({ path: "./condig.env" });

const GlobalError = require("./error/GlobalError");
const globaleErrorHandler = require("./error/errorHandler");

//!Routers:
const tourRouter = require("./routes/tourRouter");
const userRouter = require("./routes/userRouter");

const app = express();

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use((req, res, next) => {
  console.log("Node.js'e salam deyersen");
  next();
});

app.use("/tour", tourRouter);
app.use("/user", userRouter);

app.use((req, res, next) => {
  next(new GlobalError(`${req.originalUrl} does not exist!`, 500));
});

//! Global Error Handler
app.use(globaleErrorHandler);

//! Start application:
const DB = process.env.DB_STRING.replace("<password>", process.env.DB_PASSWORD);

mongoose.connect(DB, (err) => {
  if (err) return console.log(err);

  console.log("MongoDb connected.");

  const PORT = process.env.PORT;
  app.listen(PORT, () => console.log(`Server running on port: ${PORT}.`));
});
