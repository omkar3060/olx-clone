import React, { useState, useEffect } from "react";
import "./FeaturedProducts.css"; // Optional: Add styles for this component
import axios from "axios"; // Ensure axios is installed and imported
import { useNavigate } from "react-router-dom";

const FeaturedProducts = ({ selectedLocation }) => {
  const [ads, setAds] = useState([]);
  const navigate = useNavigate();

  const featuredProducts = [
    {
      id: 1,
      title: "IPhone 14 Pro",
      price: "999",
      image:
        "https://www.appleservicecenternehruplace.in/wp-content/uploads/2022/09/Apple-iPhone-14-Pro-Price-in-Delhi-Nehru-Place.jpg",
    },
    {
      id: 2,
      title: "Gaming Laptop",
      price: "1500",
      image:
        "https://media.istockphoto.com/id/1399174861/photo/gaming-laptop-computer-isolated-on-white.jpg?s=612x612&w=0&k=20&c=mBDSW82ipuMBFNqXZ5iq0PJwd_tl23XvEEnPkvaLRlA=",
    },
    {
      id: 3,
      title: "Mountain Bike",
      price: "350",
      image:
        "https://ahoybikes.com/wp-content/uploads/2022/10/A-360-Red-27.5-Inch-Mountain-Bike-By-Ahoy-Bikes.jpg.webp",
    },
    {
      id: 4,
      title: "Sofa Set",
      price: "450",
      image:
        "https://www.lakdi.com/cdn/shop/files/5_Seater_Sofa_Set_with_Wooden_base_-_-3745419.jpg?v=1735642270",
    },
  ];

  // Fetch ads when the component mounts
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/ads/locsearch?location=${selectedLocation}`
        );
        setAds(response.data);
      } catch (error) {
        console.error("Error fetching ads:", error);
      }
    };

    if (selectedLocation) {
      fetchAds();
    }
  }, [selectedLocation]);

  const handleProClick = (productId) => {
    navigate(`/addetails/${productId}`);
  };

  const combinedProducts = [...featuredProducts, ...ads];
  console.log(combinedProducts);

  return (
    <div className="featured-products">
      <h2>Fresh Recommendations</h2>
      <div className="product-grid">
        {combinedProducts.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => handleProClick(product._id)}
          >
            <img className="proimage" src={product.image} alt={product.title} />
            <h3>{"$ " + product.price}</h3>
            <strong>{product.title}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;
