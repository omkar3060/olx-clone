import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./FetchAds.module.css"; // Import CSS module

function FetchAds() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserAds = async () => {
      const email = localStorage.getItem("userEmail"); // Get email from local storage
      if (!email) {
        setError("You must be logged in to view your ads.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:5000/api/ads/email/${email}`
        );

        if (response.data && Array.isArray(response.data)) {
          setAds(response.data); // Handle array directly
        } else {
          throw new Error("Unexpected response structure");
        }
      } catch (err) {
        setError("Failed to fetch ads. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAds();
  }, []);

  if (loading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles["ads-container"]}>
      <h2>Your Ads</h2>
      {ads.length === 0 ? (
        <p>You have not posted any ads yet.</p>
      ) : (
        <ul className={styles["ads-list"]}>
          {ads.map((ad) => (
            <li key={ad._id} className={styles["ad-item"]}>
              <h3>{ad.title}</h3>
              <p>{ad.description}</p>
              <p>
                <strong>Price:</strong> ₹{ad.price.toLocaleString()}
              </p>
              <p>
                <strong>Category:</strong> {ad.category}
              </p>
              <p>
                <strong>Location:</strong> {ad.location}
              </p>
              {ad.images && ad.images.length > 0 ? (
                <div className={styles["ad-images"]}>
                  {ad.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={`data:${img.contentType};base64,${img.data}`}
                      alt={ad.title}
                      className={styles["ad-image"]}
                    />
                  ))}
                </div>
              ) : (
                <p className={styles["no-image"]}>No images available</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FetchAds;
