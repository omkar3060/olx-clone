const mongoose = require("mongoose");

const AdSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  images: [
    {
      data: String, // Base64 image data
      contentType: String, // Image MIME type (e.g., image/jpeg)
    },
  ],
  email: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Ad", AdSchema);
