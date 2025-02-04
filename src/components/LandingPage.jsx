import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LandingPage.css";
import LoginSignupPopup from "./LoginSignupPopup";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Card, CardMedia, CardContent, Typography, Grid, Box, Container } from "@mui/material";
import { Button } from "@mui/material";
import BuyerMessages from "./BuyerMessages";

function LandingPage() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [ads, setAds] = useState([]);
  const [suggestions, setSuggestions] = useState([]); // For search suggestions
  const [searchQuery, setSearchQuery] = useState(""); // User's search query
  const [selectedCategory, setSelectedCategory] = useState(""); // Track the selected category
  const [error, setError] = useState(null); // Track errors
  const navigate = useNavigate();
  const [redirectToSell, setRedirectToSell] = useState(false);
  const languages = ["ENGLISH", "ESPAÑOL", "FRANÇAIS", "DEUTSCH"];
  const [selectedLanguage, setSelectedLanguage] = useState("ENGLISH");
  const userId = localStorage.getItem("userEmail");
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [showChats, setShowChats] = useState(false);

  const categories = [
    "All Categories",
    "Cars",
    "Bikes",
    "Mobiles",
    "Electronics",
    "Furniture",
    "Fashion",
    "Books",
    "Pets",
  ];

  // Fetch Ads
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const endpoint =
          selectedCategory && selectedCategory !== "All Categories"
            ? `http://localhost:5000/api/ads?category=${selectedCategory}`
            : "http://localhost:5000/api/ads";

        const response = await axios.get(endpoint);
        setAds(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching ads:", error);
        setError("Failed to fetch ads. Please try again later.");
      }
    };

    fetchAds();
  }, [selectedCategory]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/chats/user/${userId}/chats`);
        setChats(response.data);
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    };

    fetchChats();
  }, [userId]);


  // Handle search query change and fetch suggestions
  const handleSearchChange = async (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query.length > 1) {
      try {
        const response = await axios.get(`http://localhost:5000/api/ads?search=${query}`);
        setSuggestions(response.data); // Update suggestions based on the query
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  // Handle search submission
  const handleSearchSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.get(`http://localhost:5000/api/ads?search=${searchQuery}`);
      setAds(response.data); // Update ads with search results
      setSuggestions([]); // Clear suggestions after search
    } catch (error) {
      console.error("Error fetching search results:", error);
      setError("Failed to fetch search results. Please try again later.");
    }
  };

  // Other functionalities
  const handleCategoryChange = (event) => setSelectedCategory(event.target.value);
  const handleLoginClick = () => setIsPopupVisible(true);
  const handleClosePopup = () => setIsPopupVisible(false);
  const handleSellClick = () => {
    if (!isLoggedIn) {
      alert("Please log in to post an Ad.");
      setRedirectToSell(true);
      setIsPopupVisible(true);
    } else {
      navigate("/sell");
    }
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false");
  };
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    setIsPopupVisible(false);
    if (redirectToSell) {
      navigate("/sell");
      setRedirectToSell(false);
    }
  };

    // Handle chat selection
    const handleChatClick = (chat) => {
      setSelectedChat(chat); // Set the selected chat for viewing messages
    };
  
    // Toggle chats
    const handleViewChats = () => {
      setShowChats(!showChats); // Toggle between viewing and hiding chats
    };

  return (
    <div>
      {/* Header */}
      <header className="header">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlb21KJRogcAvRRwHp41h0Ax3zCFKCFXy7QZ4n3IVjE1g4K4eNyvl3_iHd8kA_AEE7xh0&usqp=CAU"
          alt="OLX logo"
          id="logo"
        />

        <select className="location-selector">
          <option value="">Select Location</option>
          <option value="Dharwad">Dharwad</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Mumbai">Mumbai</option>
        </select>
        <select className="category-select" onChange={handleCategoryChange}>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <form className="searchBar" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Find Cars, Mobile Phones and more..."
            className="search-bar"
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button type="submit" className="sebtn"></button>
        </form>
        <div className="language-selector">
          <button className="lan-btn">
            {selectedLanguage}
            <div className="arrow"></div>
          </button>

          <div className="dropdown-menu">
            {languages.map((lang) => (
              <div
                key={lang}
                onClick={() => setSelectedLanguage(lang)} // Selects language on click
              >
                {lang}
              </div>
            ))}
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion._id}
                className={`suggestion-item ${index === 0 ? "active" : ""}`} // Optionally highlight the first suggestion
                onClick={() => {
                  setSearchQuery(suggestion.title);
                  setSuggestions([]);
                  handleSearchSubmit(new Event("submit"));
                }}
              >
                {suggestion.title}
              </div>
            ))}
          </div>
        )}

        {/* Favorites Icon */}
      <button
        className="favorite-btn"
        onClick={() => navigate(`/favorites/user/:userEmail`)}
      >
        Fav
      </button>

          <button
        className="favorite-btn"
        onClick={() => navigate(`inbox`)}
      >
        msg
      </button>

        {!isLoggedIn ? (
          <button className="login-btn" onClick={handleLoginClick}>
            Login
          </button>
        ) : (
          <div className="profile-menu">
            <button className="profile-btn">Profile</button>
            <div className="profile-dropdown">
              <div className="h3">
                <h3>Your Name</h3>
              </div>

              {/* Edit Profile Link */}
              <Link to="/users/:userEmail" className="prof-edit">
                View and Edit Profile
              </Link>

              <hr className="hor-line" />

              {/* My Ads Link */}
              <Link to="/fetch-ads/email">
                <span>
                  <img
                    src="https://statics.olx.in/external/base/img/myAds.svg"
                    className="prof-img"
                    alt=""
                  />
                </span>
                My Ads
              </Link>

              <a href="#">
                <span>
                  <svg
                    width="23px"
                    height="23px"
                    viewBox="0 0 1024 1024"
                    data-aut-id="icon"
                    className="prof-img"
                    fillRule="evenodd"
                  >
                    <path
                      className="rui-w4DG7"
                      d="M426.667 42.667h170.667l42.667 42.667-42.667 42.667h256l42.667 42.667v768l-42.667 42.667h-682.667l-42.667-42.667v-768l42.667-42.667h256l-42.667-42.667 42.667-42.667zM213.333 896h597.333v-682.667h-597.333v682.667zM469.333 426.667v-85.333h256v85.333h-256zM298.667 426.667v-85.333h85.333v85.333h-85.333zM469.333 597.333v-85.333h256v85.333h-256zM298.667 597.333v-85.333h85.333v85.333h-85.333zM469.333 768v-85.333h256v85.333h-256zM298.667 768v-85.333h85.333v85.333h-85.333z"
                    ></path>
                  </svg>
                </span>
                Buy Business Packages
              </a>

              <a href="#">
                <span>
                  <svg
                    width="23px"
                    height="23px"
                    viewBox="0 0 1024 1024"
                    data-aut-id="icon"
                    className="prof-img"
                    fillRule="evenodd"
                  >
                    <path
                      className="rui-w4DG7"
                      d="M899.285 256l39.381 39.083v476.501l-39.381 39.083h-774.571l-39.381-39.083v-476.501l39.381-39.083h774.571zM853.461 511.573h-681.6v213.632h681.6v-213.632zM693.205 618.411h76.459l34.901 32.213-34.901 32.213h-128.896l-34.901-32.213 34.901-32.213h52.437zM853.461 341.248h-681.387v86.357l681.387-2.347v-84.053z"
                    ></path>
                  </svg>
                </span>
                Bought Packages and Billing
              </a>

              <hr className="Hor-line" />

              <a href="#">
                <span>
                  <svg
                    width="23px"
                    height="23px"
                    viewBox="0 0 1024 1024"
                    data-aut-id="icon"
                    className="prof-img"
                    fillRule="evenodd"
                  >
                    <path
                      className="rui-w4DG7"
                      d="M550.789 744.728c0 21.41-17.377 38.789-38.789 38.789s-38.789-17.377-38.789-38.789 17.377-38.789 38.789-38.789 38.789 17.377 38.789 38.789zM686.546 415.030c0 82.89-58.105 152.513-135.757 170.201v43.131l-38.789 38.789-38.789-38.789v-77.575l38.789-38.789c53.489 0 96.97-43.481 96.97-96.97s-43.481-96.97-96.97-96.97-96.97 43.481-96.97 96.97l-38.789 38.789-38.789-38.789c0-96.232 78.312-174.546 174.546-174.546s174.546 78.312 174.546 174.546zM512 861.090c-192.505 0-349.090-156.626-349.090-349.090 0-192.505 156.587-349.090 349.090-349.090 192.466 0 349.090 156.587 349.090 349.090 0 192.466-156.626 349.090-349.090 349.090zM512 85.333c-235.288 0-426.667 191.379-426.667 426.667s191.379 426.667 426.667 426.667 426.667-191.379 426.667-426.667-191.379-426.667-426.667-426.667z"
                    ></path>
                  </svg>
                </span>
                Help
              </a>

              <a href="#">
                <span>
                  <svg
                    viewBox="0 0 1024 1024"
                    data-aut-id="icon"
                    className="prof-img"
                    fillRule="evenodd"
                  >
                    <path
                      className="rui-w4DG7"
                      d="M873.997 456.711H819.182C811.047 414.001 794.347 374.323 770.704 339.651L809.444 300.892V259.727L767.653 217.918H726.489L687.73 256.677C653.058 233.054 613.38 216.334 570.67 208.199V153.384L541.552 124.266H482.455L453.337 153.384V208.199C410.628 216.334 370.949 233.054 336.277 256.677L297.518 217.918H256.334L214.544 259.727V300.892L253.303 339.651C229.661 374.323 212.96 414.001 204.825 456.711H150.011L120.893 485.829V544.926L150.011 574.044H204.825C212.96 616.753 229.661 656.431 253.303 691.103L214.544 729.863V771.047L256.334 812.837H297.518L336.277 774.078C370.949 797.72 410.628 814.421 453.337 822.556V877.37L482.455 906.488H541.552L570.67 877.37V822.556C613.38 814.421 653.058 797.72 687.73 774.078L726.489 812.837H767.653L809.444 771.047V729.863L770.704 691.103C794.347 656.431 811.047 616.753 819.182 574.044H873.997L903.115 544.926V485.829L873.997 456.711ZM512.004 750.044C382.605 750.044 277.337 644.776 277.337 515.377C277.337 385.978 382.605 280.711 512.004 280.711C641.403 280.711 746.67 385.978 746.67 515.377C746.67 644.776 641.403 750.044 512.004 750.044ZM512.004 350.839C421.266 350.839 347.463 424.641 347.463 515.379C347.463 606.117 421.266 679.92 512.004 679.92C602.741 679.92 676.544 606.117 676.544 515.379C676.544 424.641 602.741 350.839 512.004 350.839ZM512.004 601.697C464.405 601.697 425.685 562.977 425.685 515.379C425.685 467.781 464.405 429.061 512.004 429.061C559.602 429.061 598.322 467.781 598.322 515.379C598.322 562.977 559.602 601.697 512.004 601.697Z"
                    ></path>
                  </svg>
                </span>
                Settings
              </a>

              {/* Logout Button */}
              <button onClick={handleLogout}>
                <span>
                  <svg
                    width="23px"
                    height="23px"
                    viewBox="0 0 1024 1024"
                    data-aut-id="icon"
                    className="prof-img"
                    fillRule="evenodd"
                  >
                    <path
                      className="rui-w4DG7"
                      d="M128 85.333l-42.667 42.667v768l42.667 42.667h768l42.667-42.667v-213.333l-42.667-42.667-42.667 42.667v170.667h-682.667v-682.667h682.667v170.667l42.667 42.667 42.667-42.667v-213.333l-42.667-42.667h-768zM494.336 298.667l-183.168 183.168v60.331l183.168 183.168h60.331v-60.331l-110.336-110.336h323.669l42.667-42.667-42.667-42.667h-323.669l110.336-110.336v-60.331h-60.331z"
                    ></path>
                  </svg>
                </span>
                Logout
              </button>
            </div>
          </div>

        )}

        <button className="gradient-border-button" onClick={handleSellClick}>
          <span>+</span>
          SELL
        </button>
        
      </header>
      

      {/* Featured Products */}
      <section className="featured-products">
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" sx={{ mb: 4, fontWeight: "bold", textAlign: "center" }}>
            {selectedCategory || "All Categories"}
          </Typography>
          {error ? (
            <Typography color="error" variant="h6" textAlign="center">
              {error}
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {ads.map((ad) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={ad._id}>
                  <Link to={`/ads/id/${ad._id}`} style={{ textDecoration: "none" }}>
                    <Card
                      sx={{
                        borderRadius: 3,
                        boxShadow: 2,
                        transition: "transform 0.3s, box-shadow 0.3s",
                        "&:hover": {
                          transform: "scale(1.02)",
                          boxShadow: 4,
                        },
                      }}
                    >
                      {/* Image Section */}
                      <CardMedia
                        component="img"
                        height="250"
                        image={
                          ad.images && ad.images.length > 0
                            ? `data:${ad.images[0].contentType};base64,${ad.images[0].data}`
                            : "/default-image.jpg" // Fallback if no image exists
                        }
                        alt={ad.title}
                        sx={{
                          objectFit: "cover", // Prevent zoom-in effect
                        }}
                      />

                      {/* Content Section */}
                      <CardContent>
                        <Typography
                          variant="h6"
                          color="green"
                          sx={{ fontWeight: "bold", mb: 1 }}
                        >
                          {"₹ " + ad.price}
                        </Typography>
                        <Typography
                          variant="body1"
                          color="text.primary"
                          noWrap
                          sx={{ fontSize: "1rem" }}
                        >
                          {ad.title}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mt: 2,
                            color: "text.secondary",
                            fontSize: "0.85rem",
                          }}
                        >
                          <Typography variant="caption">{ad.location}</Typography>
                          <Typography variant="caption">{new Date(ad.date).toLocaleDateString()}</Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </section>;

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 OLX Clone. All Rights Reserved.</p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a> | <a href="#">Terms of Use</a> |{" "}
          <a href="#">Contact Us</a>
        </div>
      </footer>

      {isPopupVisible && (
        <LoginSignupPopup onClose={handleClosePopup} onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default LandingPage;
