const Favorite = require("../models/Favorite");

exports.toggleFavorite = async (req, res) => {
  const { userEmail, adId } = req.body;

  // Log the request body
  console.log("Request Body:", req.body);

  if (!userEmail || !adId) {
    return res.status(400).json({ message: "userEmail and adId are required." });
  }

  try {
    const existingFavorite = await Favorite.findOne({ userEmail, adId });

    if (existingFavorite) {
      await Favorite.deleteOne({ userEmail, adId });
      return res.status(200).json({ message: "Ad removed from favorites." });
    } else {
      const newFavorite = new Favorite({ userEmail, adId });
      await newFavorite.save();
      return res.status(201).json({ message: "Ad added to favorites." });
    }
  } catch (error) {
    console.error("Error in toggleFavorite:", error);
    res.status(500).json({ message: "Error toggling favorite." });
  }
};

exports.getUserFavorites = async (req, res) => {
    const { userEmail } = req.params; // Retrieve email from route params.
    console.log("Fetching favorites for userEmail:", userEmail);
    try {
      const favorites = await Favorite.find({ userEmail }).populate("adId");
      const favoriteAds = favorites.map((fav) => fav.adId); // Extract ad details.
  
      res.status(200).json(favoriteAds);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching favorites." });
    }
  };

  exports.checkFavoriteStatus = async (req, res) => {
    const { userEmail, adId } = req.body;
  
    try {
      const existingFavorite = await Favorite.findOne({ userEmail, adId });
      const isFavorited = !!existingFavorite;
  
      res.status(200).json({ isFavorited });
    } catch (error) {
      console.error("Error checking favorite status:", error);
      res.status(500).json({ message: "Error checking favorite status." });
    }
  };
  