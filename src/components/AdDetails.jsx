import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Grid,
  Stack,
  IconButton,
  Toolbar,
  AppBar,
  Divider,
} from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const AdDetails = () => {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const navigate = useNavigate();
  const [sellerId, setSellerId] = useState('');

  const handleChatClick = async () => {
    try {
      const buyerId = localStorage.getItem('userEmail'); // Fetch buyerId from local storage

      if (!buyerId) {
        alert('User not logged in. Please log in to chat with the seller.');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/chats', { sellerId, adId: id, buyerId });
      const { chatRoomId } = response.data;

      // Navigate to the chat page
      navigate(`/inbox?chatRoomId=${chatRoomId}`);
    } catch (error) {
      console.error('Failed to initiate chat:', error);
      alert('Unable to initiate chat. Please try again.');
    }
  };

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/ads/id/${id}`);
        const data = await response.json();
        setAd(data);
        setSellerId(data.email);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching ad data:", error);
        setLoading(false);
      }
    };

    fetchAd();
  }, [id]);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail"); // Get userEmail from localStorage
        const response = await fetch(`http://localhost:5000/api/favorites/check`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail,
            adId: id,
          }),
        });

        const result = await response.json();

        if (response.ok) {
          setIsFavorited(result.isFavorited); // Set the favorite status
        } else {
          console.error("Failed to fetch favorite status:", result.message);
        }
      } catch (error) {
        console.error("Error fetching favorite status:", error);
      }
    };

    fetchFavoriteStatus();
  }, [id]);



  if (loading) return <Typography>Loading ad details...</Typography>;
  if (!ad) return <Typography>Ad not found</Typography>;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    beforeChange: (_, next) => setCurrentSlide(next),
  };

  const handleFavorite = async () => {
    const userEmail = localStorage.getItem("userEmail"); // Fetch userEmail from localStorage

    console.log("Sending data to backend:", { userEmail, adId: id }); // Log the payload

    try {
      const response = await fetch("http://localhost:5000/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userEmail, // Ensure userEmail is sent
          adId: id,  // Ensure adId is sent
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setIsFavorited((prev) => !prev); // Toggle the state
        alert(result.message);
      } else {
        console.error("Backend Error:", result);
        alert(result.message || "Failed to update favorites.");
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <>
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{
          borderBottom: '1px solid rgba(0,0,0,0.12)',
          backgroundColor: 'white'
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Ad Details
          </Typography>x
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: "1200px", mx: "auto", p: { xs: 2, md: 4 } }}>
        <Grid container spacing={3}>
          {/* Left section with image and description */}
          <Grid item xs={12} md={8}>
            <Box
              sx={{
                bgcolor: "white",
                borderRadius: 2,
                overflow: "hidden",
                mb: 3,
                boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                position: "relative",
              }}
            >
              {/* Slider Component */}
              <Slider {...sliderSettings} ref={sliderRef}>
                {ad.images?.map((img, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: "100%",
                      height: { xs: "300px", md: "500px" },
                      backgroundImage: `url(data:${img.contentType};base64,${img.data})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      position: "relative",
                    }}
                  >
                    <Typography
                      variant="subtitle1"
                      sx={{
                        position: "absolute",
                        bottom: 10,
                        right: 10,
                        bgcolor: "rgba(0, 0, 0, 0.6)",
                        color: "white",
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "0.9rem",
                      }}
                    >
                      {index + 1} / {ad.images?.length}
                    </Typography>

                  </Box>

                ))}
              </Slider>

              {/* Arrows */}
              <IconButton
                onClick={() => sliderRef.current.slickPrev()}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: 10,
                  transform: "translateY(-50%)",
                  bgcolor: "white",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                  "&:hover": { bgcolor: "#f0f0f0" },
                  zIndex: 2,
                }}
              >
                &#8249; {/* Left arrow */}
              </IconButton>
              <IconButton
                onClick={() => sliderRef.current.slickNext()}
                sx={{
                  position: "absolute",
                  top: "50%",
                  right: 10,
                  transform: "translateY(-50%)",
                  bgcolor: "white",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                  "&:hover": { bgcolor: "#f0f0f0" },
                  zIndex: 2,
                }}
              >
                &#8250; {/* Right arrow */}
              </IconButton>
            </Box>
            <Box
              sx={{
                bgcolor: "white",
                borderRadius: 2,
                p: 3,
                mb: 3,
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                Description
              </Typography>
              <Typography sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                {ad.description}
              </Typography>
            </Box>
          </Grid>


          {/* Right section with details and seller info */}
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                bgcolor: "white",
                borderRadius: 2,
                p: 3,
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                mb: 3
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Typography variant="h4" sx={{ fontWeight: "bold" }}>
                  ₹ {ad.price?.toLocaleString()}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <IconButton
                    size="small"
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.04)'
                      }
                    }}
                  >
                    <ShareIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.04)'
                      }
                    }}
                  >

                    <IconButton
                      size="small"
                      onClick={handleFavorite}
                      sx={{
                        color: isFavorited ? "red" : "inherit",
                        "&:hover": {
                          backgroundColor: "rgba(0,0,0,0.04)",
                        },
                      }}
                    >
                      {isFavorited ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>


                  </IconButton>
                </Stack>
              </Stack>

              <Typography variant="h6" sx={{ mb: 2 }}>
                {ad.title}
              </Typography>

              <Stack
                direction="row"
                justifyContent="space-between"
                sx={{ mb: 2, color: "text.secondary" }}
              >
                <Typography>{ad.location}</Typography>
                <Typography>
                  {new Date(ad.date).toLocaleDateString()}
                </Typography>
              </Stack>

              <Divider sx={{ my: 3 }} />

              {/* Seller section */}
              <Box sx={{ mb: 3 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{ mb: 2 }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography sx={{ color: "white" }}>
                      {ad.seller?.name?.charAt(0) || "S"}
                    </Typography>
                  </Box>
                  <Typography variant="h6">{ad.seller?.name || "Seller"}</Typography>
                </Stack>

                <Stack spacing={2}>
                  <button
                    onClick={handleChatClick}
                    style={{
                      borderRadius: '8px',
                      padding: '12px 24px',
                      fontSize: '16px',
                      backgroundColor: '#1976d2',
                      color: '#fff',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Chat with seller
                  </button>

                  
                </Stack>
              </Box>

              {/* Details section */}
              <Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
                  Details
                </Typography>
                <Stack spacing={2}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ color: "text.secondary" }}
                  >
                    <Typography>Brand</Typography>
                    <Typography sx={{ fontWeight: 500 }}>{ad.brand}</Typography>
                  </Stack>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    sx={{ color: "text.secondary" }}
                  >
                    <Typography>Category</Typography>
                    <Typography sx={{ fontWeight: 500 }}>{ad.category}</Typography>
                  </Stack>
                </Stack>
              </Box>
            </Box>

            {/* Map section moved below seller info */}
            <Box
              sx={{
                bgcolor: "white",
                borderRadius: 2,
                p: 3,
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
              }}
            >
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                <LocationOnIcon color="primary" />
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Location
                </Typography>
              </Stack>
              <Box
                sx={{
                  height: "300px",
                  borderRadius: 1,
                  overflow: "hidden",
                  border: '1px solid rgba(0,0,0,0.12)'
                }}
              >
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  title="location"
                  src={`https://maps.google.com/maps?q=${ad.location}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                />
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default AdDetails;