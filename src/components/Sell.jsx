import React, { useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import "./Sell.css";
import imageCompression from "browser-image-compression";

const categories = [
  { name: "Cars", icon: "🚗" },
  { name: "Properties", icon: "🏠" },
  { name: "Mobiles", icon: "📱" },
  { name: "Jobs", icon: "💼" },
  { name: "Bikes", icon: "🚴‍♂️" },
  { name: "Electronics", icon: "💻" },
  { name: "Furniture", icon: "🛋️" },
  { name: "Fashion", icon: "👗" },
  { name: "Books", icon: "📚" },
  { name: "Pets", icon: "🐾" },
];

function Sell() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    location: "",
    images: [],
  });

  const [step, setStep] = useState(1); // Step 1: Select Category, Step 2: Fill Form

  const handleCategorySelect = (category) => {
    setFormData({ ...formData, category });
    setStep(2); // Move to the form
  };

  const handleDrop = async (acceptedFiles) => {
    for (const file of acceptedFiles) {
      if (formData.images.length >= 5) {
        alert("You can upload a maximum of 5 images.");
        return;
      }

      // Validate file size
      if (file.size > 3.75 * 1024 * 1024) {
        alert(`${file.name} exceeds the maximum allowed size of 3.75 MB.`);
        return;
      }

      try {
        // Compress the image
        const compressedFile = await imageCompression(file, {
          maxSizeMB: 1, // Compress to 1 MB
          maxWidthOrHeight: 1024, // Resize to max 1024px
        });

        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, compressedFile], // Store compressed file objects
        }));
      } catch (error) {
        console.error("Error compressing image:", error);
        alert("Failed to compress image. Please try again.");
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("userEmail");
    if (!email) {
      alert("You must be logged in to post an ad.");
      return;
    }

    const adData = new FormData();
    adData.append("title", formData.title);
    adData.append("description", formData.description);
    adData.append("price", formData.price);
    adData.append("category", formData.category);
    adData.append("location", formData.location);
    adData.append("email", email);
    formData.images.forEach((image) => adData.append("images", image)); // Append File objects

    try {
      const response = await axios.post("http://localhost:5000/api/ads", adData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Ad posted successfully!");
    } catch (error) {
      console.error("Error posting ad:", error);
      alert("Failed to post ad. Please try again.");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: "image/*",
  });

  return (
    <div className="sell-container">
      <h2>Post Your Ad</h2>

      {step === 1 && (
        <div className="category-selection">
          <h3>Choose a Category</h3>
          <div className="categories-grid">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="category-card"
                onClick={() => handleCategorySelect(cat.name)}
              >
                <span className="category-icon">{cat.icon}</span>
                <p>{cat.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
      <form onSubmit={handleSubmit} className="ad-details-form">
      <p className="selected-category">
        Selected Category: <strong>{formData.category}</strong>
      </p>

      {/* Title */}
      <div className="form-group">
        <label htmlFor="title">Ad Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Mention the key features of your item"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      {/* Description */}
      <div className="form-group">
        <label htmlFor="description">Description *</label>
        <textarea
          id="description"
          name="description"
          placeholder="Include condition, features, and reason for selling"
          maxLength="4096"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <p className="char-counter">{`${formData.description.length} / 4096`}</p>
      </div>

      {/* Price */}
      <div className="form-group">
        <label htmlFor="price">Price *</label>
        <div className="price-input-wrapper">
          <span className="currency-symbol">₹</span>
          <input
            type="number"
            id="price"
            name="price"
            placeholder="Enter price"
            value={formData.price}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Location */}
      <div className="form-group">
        <label htmlFor="location">Location *</label>
        <input
          type="text"
          id="location"
          name="location"
          placeholder="Enter location"
          value={formData.location}
          onChange={handleChange}
          required
        />
      </div>

      {/* Image Upload */}
      <div className="form-group image-upload">
        <label>Upload Images (Max: 5)</label>
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <p>Drag and drop images here, or click to select files</p>
        </div>
        <div className="image-grid">
          {formData.images.map((file, index) => (
            <div className="image-box" key={index}>
              <img
                src={URL.createObjectURL(file)}
                alt={`Preview ${index}`}
                className="preview-image"
              />
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="submit-btn">
        Post
      </button>
    </form>
      )}
    </div>
  );
}

export default Sell;
