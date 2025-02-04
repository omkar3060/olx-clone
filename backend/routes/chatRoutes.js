const express = require('express');
const Chat = require('../models/Chat'); // Mongoose model
const router = express.Router();

// Create or get chat room
router.post('/', async (req, res) => {
  const { sellerId, adId, buyerId } = req.body; // Extract buyerId from request body

  try {
    // Check if chat room already exists
    let chat = await Chat.findOne({ sellerId, buyerId, adId });

    if (!chat) {
      // Create a new chat room
      chat = new Chat({
        sellerId,
        buyerId,
        adId,
        messages: [],
      });
      await chat.save();
    }

    res.status(200).json({ chatRoomId: chat._id });
  } catch (error) {
    console.error('Error creating/getting chat room:', error);
    res.status(500).json({ error: 'Failed to initiate chat' });
  }
});

// Route to get all messages for a specific chat room
router.get('/:chatRoomId', async (req, res) => {
    const { chatRoomId } = req.params;
  
    try {
      const chat = await Chat.findById(chatRoomId);
  
      if (!chat) {
        return res.status(404).json({ error: 'Chat room not found' });
      }
  
      res.status(200).json({ messages: chat.messages });
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      res.status(500).json({ error: 'Failed to fetch chat messages' });
    }
  });
  
  // Route to add a new message to a specific chat room
  router.post('/:chatRoomId/messages', async (req, res) => {
    const { chatRoomId } = req.params;
    const { text } = req.body;
    const senderId = req.body.senderId || 'Unknown'; // Replace with authenticated user in real application
  
    if (!text) {
      return res.status(400).json({ error: 'Message text is required' });
    }
  
    try {
      const chat = await Chat.findById(chatRoomId);
  
      if (!chat) {
        return res.status(404).json({ error: 'Chat room not found' });
      }
  
      const newMessage = { senderId, text };
      chat.messages.push(newMessage); // Add new message to the chat room
      await chat.save();
  
      res.status(201).json(newMessage);
    } catch (error) {
      console.error('Error adding message to chat room:', error);
      res.status(500).json({ error: 'Failed to add message' });
    }
  });

  // Route to fetch messages for a specific ad between a buyer and seller
router.get('/ad/:adId', async (req, res) => {
    const { adId } = req.params;
    const { buyerId, sellerId } = req.query; // Extract buyerId and sellerId from query params

    if (!buyerId || !sellerId) {
        return res.status(400).json({ error: 'Buyer ID and Seller ID are required' });
    }

    try {
        const chat = await Chat.findOne({ adId, buyerId, sellerId });

        if (!chat) {
            return res.status(404).json({ error: 'No chat found for the specified ad, buyer, and seller' });
        }

        res.status(200).json({ messages: chat.messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// Fetch all chats for a user (buyer or seller)
router.get('/user/:userId/chats', async (req, res) => {
    const { userId } = req.params;

    try {
        const chats = await Chat.find({
            $or: [{ buyerId: userId }, { sellerId: userId }],
        });

        res.status(200).json(chats);
    } catch (error) {
        console.error('Error fetching chats:', error);
        res.status(500).json({ error: 'Failed to fetch chats' });
    }
});


module.exports = router;
