import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./LeafletMap.css";

const LeafletMap = ({ selectedCity }) => {
  const [cityCoordinates, setCityCoordinates] = useState([20.5937, 78.9629]); // Default: India

  const cityLocations = {
    Dharwad: [15.4577, 75.0078],
    Bangalore: [12.9716, 77.5946],
    Mumbai: [19.0760, 72.8777],
    Pune: [18.5196, 73.8550],
    Belagavi: [15.8496, 74.4977],
    Hubli: [15.3647, 75.1269],
    Mysore: [12.2958, 76.6394],
    Mangalore: [12.9141, 74.8560],
    Kolhapur: [16.7010, 74.2433],
    Nagpur: [21.1466, 79.0882],
    Nashik: [19.9975, 73.7910],
    Aurangabad: [19.8762, 75.3433],
    Thane: [19.2183, 72.9784],
    Solapur: [17.6890, 75.9064]
  };

  useEffect(() => {
    if (selectedCity && cityLocations[selectedCity]) {
      setCityCoordinates(cityLocations[selectedCity]);
    } else {
      setCityCoordinates([20.5937, 78.9629]); // Default to India if city is not found
    }
  }, [selectedCity]);

  return (
    <div>
      <h2>Map of {selectedCity || "India"}</h2>
      <MapContainer center={cityCoordinates} zoom={12} style={{ height: "400px", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={cityCoordinates}>
          <Popup>{selectedCity || "Select a city to view its location"}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default LeafletMap;
