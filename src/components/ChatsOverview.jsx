import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ChatsOverview.css'; // Add this CSS file for styling
import ChatPage from './ChatPage'; // Import ChatPage component

const ChatsOverview = () => {
    const [chats, setChats] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch all chats for the user
        const fetchAdDetails = async (adId) => {
            try {
                const response = await axios.get(`http://localhost:5000/api/ads/id/${adId}`);
                return response.data.title; // Assuming the ad API returns { title: "Ad Title" }
            } catch (error) {
                console.error(`Failed to fetch ad details for adId ${adId}:`, error);
                return 'Untitled Ad'; // Fallback title
            }
        };
        
        const fetchChats = async () => {
            const userId = localStorage.getItem('userEmail');
            if (!userId) {
                alert('User not logged in.');
                return;
            }
        
            try {
                const response = await axios.get(`http://localhost:5000/api/chats/user/${userId}/chats`);
                const chatsWithTitles = await Promise.all(
                    response.data.map(async (chat) => ({
                        ...chat,
                        adTitle: await fetchAdDetails(chat.adId),
                    }))
                );
                setChats(chatsWithTitles);
            } catch (error) {
                console.error('Failed to fetch chats:', error);
            }
        };        

        fetchChats();
    }, []);

    const handleChatClick = (chatId) => {
        // Set the selected chat ID and update the URL with the chatRoomId parameter
        setSelectedChatId(chatId);
        navigate(`?chatRoomId=${chatId}`);
    };

    return (
        <div className="chats-overview-container">
            {/* Left-side chat list */}
            <div className="chat-list">
                <h2>Inbox</h2>
                {chats.length > 0 ? (
                    chats.map((chat) => (
                        <div
                            key={chat._id}
                            className={`chat-item ${selectedChatId === chat._id ? 'active' : ''}`}
                            onClick={() => handleChatClick(chat._id)}
                        >
                            <p>
                                <strong>Ad:</strong> {chat.adTitle || 'Untitled Ad'} {/* Display ad title */}
                            </p>
                            <p>
                                <strong>Seller:</strong> {chat.sellerId}
                            </p>
                        </div>
                    ))
                ) : (
                    <p>No chats found.</p>
                )}
            </div>

            {/* Right-side chat display */}
            <div className="chat-display">
                {selectedChatId ? (
                    <ChatPage chatRoomId={selectedChatId} />
                ) : (
                    <p>Select a chat to view messages</p>
                )}
            </div>
        </div>
    );
};

export default ChatsOverview;
