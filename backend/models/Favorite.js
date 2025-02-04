const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema({
  userEmail: { type: String, required: true }, // Storing email as a string.
  adId: { type: mongoose.Schema.Types.ObjectId, ref: "Ad", required: true },
});

module.exports = mongoose.model("Favorite", favoriteSchema);
