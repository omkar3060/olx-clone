import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const userEmail = localStorage.getItem("userEmail"); // Fetch email from localStorage
        const response = await fetch(`http://localhost:5000/api/favorites/user/${userEmail}`);
        const data = await response.json();

        if (response.ok) {
          setFavorites(data);
        } else {
          console.error("Failed to fetch favorites:", data.message);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) return <Typography>Loading favorites...</Typography>;

  if (favorites.length === 0) {
    return (
      <Box textAlign="center" mt={4}>
        <Typography variant="h5">You have no favorites yet!</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "1200px", mx: "auto", p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold", textAlign: "center" }}>
        My Favorites
      </Typography>
      <Grid container spacing={3}>
        {favorites.map((ad) => (
          <Grid item xs={12} sm={6} md={4} key={ad._id}>
            <Card
              sx={{
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                borderRadius: 2,
                "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.15)" },
              }}
            >
              <CardMedia
                component="div"
                sx={{
                  height: 200,
                  backgroundImage: `url(data:${ad.images[0].contentType};base64,${ad.images[0].data})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <CardContent>
                <Typography
                  variant="h6"
                  sx={{
                    mb: 1,
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {ad.title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1, color: "text.secondary" }}>
                  ₹ {ad.price.toLocaleString()}
                </Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => navigate(`/ads/id/${ad._id}`)}
                  >
                    View Details
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Favorites;
