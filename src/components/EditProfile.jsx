import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EditProfile.css";

function EditProfile() {
  const userEmail = localStorage.getItem("userEmail"); // Fetch userEmail from localStorage
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    username: "",
    aboutMe: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(true);

  // Fetch profile data from the backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userEmail}`); // Backend API call
        setProfileData(response.data); // Set fetched profile data
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userEmail]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/api/users/${userEmail}`, profileData); // Update profile in the backend
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="edit-profile-container">
  <div className="side-navigation">
  <button
  className="view-profile-btn"
  onClick={() => {
    window.location.href = "/view-profile"; // Redirect to the ViewProfile page
  }}
>
  View profile
</button>
    <p className="profile-picture-text">Profile picture</p>
  </div>

  <div className="form-container">
    <h1>Edit Profile</h1>

    <h2>Basic Information</h2>
    <div className="profile-section">
      <label htmlFor="name">Name:</label>
      <input
        type="text"
        id="name"
        name="name"
        placeholder="Enter your full name"
        value={profileData.name}
        onChange={handleInputChange}
      />
      <p className="char-count">{profileData.name.length} / 30</p>
    </div>
    <div className="profile-section">
      <label htmlFor="aboutMe">About me (optional):</label>
      <textarea
        id="aboutMe"
        name="aboutMe"
        placeholder="Share something about yourself..."
        value={profileData.aboutMe}
        onChange={handleInputChange}
      />
      <p className="char-count">{profileData.aboutMe.length} / 200</p>
    </div>

    <h2>Contact Information</h2>
    <div className="profile-section">
      <label htmlFor="phoneNumber">Phone Number:</label>
      <input
        type="text"
        id="phoneNumber"
        name="phoneNumber"
        placeholder="+91"
        value={profileData.phoneNumber}
        onChange={handleInputChange}
      />
      <p className="verified-status">Yay! Your number is verified.</p>
    </div>
    <div className="profile-section">
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        name="email"
        value={profileData.email}
        onChange={handleInputChange}
        disabled // Email should not be editable
      />
      <p className="email-info">
        Your email is never shared with external parties.
      </p>
    </div>

    <button className="save-btn" onClick={handleSave}>
      Save Changes
    </button>
  </div>
</div>

  );
}

export default EditProfile;
