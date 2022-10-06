const cloudinary = require("cloudinary").v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
  secure: true,
  api_key: 555715878749696,
  cloud_name: "duhd2v4qr",
  api_secret: "Pky1r6A-gNorpRZzO0B6Obl7ygw",
});

module.exports = cloudinary;
