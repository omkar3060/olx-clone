import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ViewProfile.css";

function ViewProfile() {
  const userEmail = localStorage.getItem("userEmail");
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/users/${userEmail}`); // Fetch user data from the backend
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userEmail]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="view-profile-container">
      <div className="profile-header">
        <img
          src={userData.profilePicture || "/default-profile.png"}
          alt="Profile"
          className="profile-picture"
        />
        <h1>{userData.name}</h1>
        <p>Member since {userData.joinDate}</p>
        <div className="social-stats">
          <span>{userData.followers || 0} Followers</span> |{" "}
          <span>{userData.following || 0} Following</span>
        </div>
        <p className="verification-status">
          User verified with {userData.verifiedWith || "Email"}
        </p>
      </div>

      <div className="profile-details">
        <h2>About</h2>
        <p>{userData.aboutMe || "No information provided."}</p>

        <h2>Contact Information</h2>
        <p>
          <strong>Email:</strong> {userData.email}
        </p>
        <p>
          <strong>Phone:</strong> {userData.phoneNumber || "Not provided"}
        </p>
      </div>

      <div className="no-listings">
        <img src="/no-listings.png" alt="No Listings" />
        <h3>You haven't listed anything yet</h3>
        <p>Let go of what you don't use anymore</p>
        <button className="start-selling-btn">Start Selling</button>
      </div>
    </div>
  );
}

export default ViewProfile;
