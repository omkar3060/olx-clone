import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const location = useLocation();

    // Extract chatRoomId from the URL query string
    const chatRoomId = new URLSearchParams(location.search).get('chatRoomId');

    useEffect(() => {
        // Fetch messages for the selected chat room
        const fetchMessages = async () => {
            if (!chatRoomId) return;

            try {
                const response = await axios.get(`http://localhost:5000/api/chats/${chatRoomId}`);
                setMessages(response.data.messages);
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            }
        };

        fetchMessages();
    }, [chatRoomId]);

    const handleSendMessage = async () => {
        try {
            const senderId = localStorage.getItem('userEmail'); // Get sender ID (email)

            if (!senderId) {
                alert('User not logged in.');
                return;
            }

            const response = await axios.post(
                `http://localhost:5000/api/chats/${chatRoomId}/messages`,
                { text: newMessage, senderId }
            );

            setMessages([...messages, response.data]);
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <div className="chat-page">
            <h2>Chat Room</h2>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className="message">
                        <strong>{msg.senderId}:</strong> {msg.text}
                    </div>
                ))}
            </div>
            <div className="send-message">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatPage;
