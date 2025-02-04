import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage"
import Sell from "./components/Sell";
import AdDetails from "./components/AdDetails";
import FetchAds from "./components/FetchAds";
import EditProfile from "./components/EditProfile";
import ViewProfile from "./components/ViewProfile";
import Favorites from "./components/Favorites";
import ChatPage from "./components/ChatPage";
import ChatsOverview from "./components/ChatsOverview";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/sell" element={<Sell />} />
        <Route path="/ads/id/:id" element={<AdDetails />} />
        <Route path="/fetch-ads/email" element={<FetchAds />} />
        <Route path="/users/:userEmail" element={<EditProfile />} />
        <Route path="/view-profile" element={<ViewProfile />} />
        <Route path="/favorites/user/:userEmail" element={<Favorites />} />
        <Route path="/chat/:chatRoomId" element={<ChatPage />} />
        <Route path="/inbox" element={<ChatsOverview />} />
      </Routes>
    </Router>
  );
}

export default App;
