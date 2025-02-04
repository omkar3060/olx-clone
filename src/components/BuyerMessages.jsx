import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BuyerMessages = ({ adId, sellerId }) => {
    const [messages, setMessages] = useState([]);
    const buyerId = localStorage.getItem('userEmail'); // Get buyer's email from local storage
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/chats/ad/${adId}`, {
                    params: { sellerId, buyerId },
                });
                setMessages(response.data.messages);
            } catch (err) {
                console.error('Failed to fetch messages:', err);
                setError('Failed to fetch messages. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [adId, sellerId, buyerId]);

    if (loading) {
        return <p>Loading messages...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <h2>Messages for Ad {adId}</h2>
            {messages.length > 0 ? (
                messages.map((msg, index) => (
                    <p key={index}>
                        <strong>{msg.senderId}:</strong> {msg.text}
                    </p>
                ))
            ) : (
                <p>No messages found for this ad.</p>
            )}
        </div>
    );
};

export default BuyerMessages;
