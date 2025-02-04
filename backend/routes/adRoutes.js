const express = require("express");
const router = express.Router();
const multer = require("multer");
const Ad = require("../models/Ad");

// Configure multer for file uploads
// Configure multer for in-memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPG, PNG, and GIF are allowed."));
    }
  },
});

// Route to post an ad with images
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    console.log("Request body:", req.body); // Debug request body
    console.log("Uploaded files:", req.files); // Debug uploaded files

    const { title, description, price, category, location, email } = req.body;

    // Convert uploaded images to Base64
    const images = req.files.map((file) => ({
      data: file.buffer.toString("base64"), // Convert buffer to Base64
      contentType: file.mimetype, // Store file type
    }));

    const ad = new Ad({
      title,
      description,
      price,
      category,
      location,
      images, // Save images as Base64
      email,
    });

    await ad.save();
    res.status(201).json({ message: "Ad posted successfully", ad });
  } catch (error) {
    console.error("Error posting ad:", error);
    res.status(500).json({ message: "Failed to post ad" });
  }
});
// Route to fetch all ads with optional category and search filtering
router.get("/", async (req, res) => {
  const { category, search } = req.query;

  try {
    let filter = {};

    if (category && category !== "All Categories") {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const ads = await Ad.find(filter);
    res.status(200).json(ads);
  } catch (error) {
    console.error("Error fetching ads:", error);
    res.status(500).json({ message: "Failed to fetch ads" });
  }
});

// Route to fetch an ad by ID
router.get("/id/:id", async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({ error: "Ad not found" });
    }
    res.status(200).json(ad);
  } catch (error) {
    console.error("Error fetching ad by ID:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to fetch ads by email
router.get("/email/:email", async (req, res) => {
  try {
    const ads = await Ad.find({ email: req.params.email });
    if (!ads.length) {
      return res.status(404).json({ message: "No ads found for this email" });
    }
    res.status(200).json(ads);
  } catch (error) {
    console.error("Error fetching ads by email:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Route to get search suggestions
router.get("/suggestions", async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const suggestions = await Ad.find({
      title: { $regex: query, $options: "i" },
    })
      .select("title")
      .limit(10);

    res.status(200).json(suggestions);
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    res.status(500).json({ message: "Failed to fetch suggestions" });
  }
});

module.exports = router;
