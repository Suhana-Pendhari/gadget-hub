import React, { useEffect } from 'react';
import '../AdminStyles/Messages.css';
import Navbar from '../components/Navbar';
import PageTitle from '../components/PageTitle';
import Footer from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { Delete, Visibility, Close } from '@mui/icons-material';
import axios from 'axios';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import AdminQuickMenu from '../components/AdminQuickMenu';

function Messages() {
    const [messages, setMessages] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [selectedMessage, setSelectedMessage] = React.useState(null);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/v1/contact/all');
            if (data.success) {
                setMessages(data.contacts);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch messages', {
                position: 'top-center',
                autoClose: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this message?')) {
            try {
                const { data } = await axios.delete(`/api/v1/contact/${id}`);
                if (data.success) {
                    toast.success('Message deleted successfully', {
                        position: 'top-center',
                        autoClose: 3000
                    });
                    fetchMessages();
                }
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete message', {
                    position: 'top-center',
                    autoClose: 3000
                });
            }
        }
    };

    return (
        <>
            <Navbar />
            <AdminQuickMenu />
            <PageTitle title="Contact Messages" />
            {loading ? (
                <Loader />
            ) : messages.length > 0 ? (
                <div className="messages-container">
                    <h1>Contact Messages</h1>
                    <div className="table-responsive">
                        <table className="messages-table">
                            <thead>
                                <tr>
                                    <th>Sr No</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Message</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {messages.map((message, index) => (
                                    <tr key={message._id}>
                                        <td>{index + 1}</td>
                                        <td>{message.name}</td>
                                        <td>{message.email}</td>
                                        <td>{message.phone || 'N/A'}</td>
                                        <td className="message-preview">{message.message.substring(0, 50)}...</td>
                                        <td>{message.createdAt ? new Date(message.createdAt).toLocaleString() : 'N/A'}</td>
                                        <td className="action-column">
                                            <button 
                                                className="action-btn view-icon"
                                                onClick={() => setSelectedMessage(message)}
                                                title="View full message"
                                            >
                                                <Visibility />
                                            </button>
                                            <button 
                                                className="action-btn delete-icon"
                                                onClick={() => handleDelete(message._id)}
                                                title="Delete message"
                                            >
                                                <Delete />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="no-messages">
                    <p className="no-message-text">No messages received yet</p>
                </div>
            )}

            {/* Message Detail Modal */}
            {selectedMessage && (
                <div className="modal-overlay" onClick={() => setSelectedMessage(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Message Details</h2>
                            <button 
                                className="close-btn"
                                onClick={() => setSelectedMessage(null)}
                            >
                                <Close />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="detail-field">
                                <label>Name:</label>
                                <p>{selectedMessage.name}</p>
                            </div>
                            <div className="detail-field">
                                <label>Email:</label>
                                <p>{selectedMessage.email}</p>
                            </div>
                            <div className="detail-field">
                                <label>Phone:</label>
                                <p>{selectedMessage.phone || 'N/A'}</p>
                            </div>
                            <div className="detail-field">
                                <label>Sent Date:</label>
                                <p>{selectedMessage.createdAt ? new Date(selectedMessage.createdAt).toLocaleString() : 'N/A'}</p>
                            </div>
                            <div className="detail-field message-full">
                                <label>Message:</label>
                                <p>{selectedMessage.message}</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button 
                                className="close-message-btn"
                                onClick={() => setSelectedMessage(null)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}

export default Messages;