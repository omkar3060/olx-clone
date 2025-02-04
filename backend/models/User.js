const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Add this field for secure passwords
  username: { type: String },
  aboutMe: { type: String, default: "" },
  phoneNumber: { type: String, default: "" },
});

module.exports = mongoose.model("User", UserSchema);
