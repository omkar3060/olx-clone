import React, { useState } from "react";
import Slider from "react-slick";
import "./LoginSignupPopup.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const LoginSignupPopup = ({ onClose, onLoginSuccess }) => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Image data for the carousel
  const carouselImages = [
    {
      src: "https://statics.olx.in/external/base/img/loginEntryPointPost.webp",
      alt: "Sell items easily",
      caption: "Sell items easily with OLX.",
    },
    {
      src: "https://statics.olx.in/external/base/img/loginEntryPointFavorite.webp",
      alt: "Save your favorites",
      caption: "Save and access your favorites.",
    },
    {
      src: "https://statics.olx.in/external/base/img/loginEntryPointChat.webp",
      alt: "Chat with buyers",
      caption: "Chat with buyers securely.",
    },
  ];

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const endpoint = isSignUpMode
      ? "http://localhost:5000/api/users/signup"
      : "http://localhost:5000/api/users/login";
  
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert(result.message); 
        localStorage.setItem("userEmail", formData.email); // Save email in local storage
        onLoginSuccess(); // Handle login success
        onClose(); // Close the popup
      } else {
        alert(result.error || "An error occurred"); // Display error message
      }
    } catch (error) {
      alert("Network error: Unable to connect to the server.");
    }
  };  

  // Slider settings for react-slick
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-popup" onClick={onClose}>
          &times;
        </button>
        
        {/* Image Carousel */}
        <Slider {...sliderSettings} className="carousel">
          {carouselImages.map((image, index) => (
            <div key={index} className="carousel-slide">
              <img src={image.src} alt={image.alt} className="carousel-image" />
              <p className="carousel-caption">{image.caption}</p>
            </div>
          ))}
        </Slider>

        <div className="popup-header">
          <p>
            {isSignUpMode
              ? "Sign up to start your journey with OLX!"
              : "Close deals from the comfort of your home."}
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <button type="submit" className="submit-btn">
            {isSignUpMode ? "Sign Up" : "Login"}
          </button>
        </form>

        <div className="popup-footer">
          {isSignUpMode ? (
            <p>
              Already have an account?{" "}
              <span
                className="toggle-auth-mode"
                onClick={() => setIsSignUpMode(false)}
              >
                Login
              </span>
            </p>
          ) : (
            <>
              <p>OR</p>
              <button className="google-btn">Continue with Google</button>
              <p>
                New to OLX?{" "}
                <span
                  className="toggle-auth-mode"
                  onClick={() => setIsSignUpMode(true)}
                >
                  Sign Up
                </span>
              </p>
            </>
          )}
          <p className="privacy-text">
            By continuing, you accept OLX's{" "}
            <a href="#">Terms & Conditions</a> and <a href="#">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSignupPopup;
