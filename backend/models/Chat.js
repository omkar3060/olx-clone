const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    senderId: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const chatSchema = new mongoose.Schema({
  sellerId: { type: String, required: true },
  buyerId: { type: String, required: true },
  adId: { type: String, required: true },
  messages: [messageSchema],
});

module.exports = mongoose.model('Chat', chatSchema);
