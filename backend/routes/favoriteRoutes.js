const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteController");

// Add or remove ad from favorites
router.post("/favorites", favoriteController.toggleFavorite);

// Get all favorites for a user
router.get("/favorites/user/:userEmail", favoriteController.getUserFavorites);

router.post("/favorites/check", favoriteController.checkFavoriteStatus);

module.exports = router;
