const mongoose = require("mongoose");
require("dotenv").config({ path: "./condig.env" });
const Tour = require("../model/tour");
const fs = require("fs");

//! Start application:

console.log(process.env.DB_STRING);
const DB = process.env.DB_STRING.replace("<password>", process.env.DB_PASSWORD);

mongoose.connect(DB, (err) => {
  if (err) return console.log(err);

  const data = JSON.parse(fs.readFileSync("./tours-data.json"));

  async function importData() {
    try {
      await Tour.create(data);
      console.log("MongoDb data imported");
    } catch (error) {
      console.log(error);
    }

    process.exit();
  }

  async function deleteData() {
    try {
      await Tour.deleteMany();
      console.log("MongoDb data deleted");
    } catch (error) {
      console.log(error);
    }
    process.exit();
  }

  if (process.argv[2] === "import") {
    importData();
  } else if (process.argv[2] === "delete") {
    deleteData();
  }
});
