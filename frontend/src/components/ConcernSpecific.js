import React, {useState, useEffect} from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { IoArrowBackCircle } from 'react-icons/io5';
import { AiFillMessage } from 'react-icons/ai';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import * as images from 'assets/images'; 
import Modal from './Modal';
import TextArea from './TextArea';
import {API_URL} from 'constants';
import axios from 'axios';

export const ConcernSpecific = ({ selectedConcern, handleBackClick, isAdmin  }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isReplying, setIsReplying] = useState(false); 
    const [currentImage, setCurrentImage] = useState('');
    const [replyContent, setReplyContent] = useState('');  
    const [replies, setReplies] = useState([]);

    useEffect(()=>{
        fetchReplies(); 
    },[]);

    const fetchReplies = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/concern/${selectedConcern.id}/replies`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            
            const sortedReplies = response.data.data.replies.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setReplies(sortedReplies);
        } catch (error) {
            console.error('Error fetching replies:', error);
        }
    };


    const handleReplyChange = (e) => {
        setReplyContent(e.target.value);  
    };

    const handleImageClick = (image) => {
        setCurrentImage(image);
        setModalOpen(true);
    };

    const handleReplyClick = () => {
        setIsReplying(true);
    };

    const handleCancelReply = ()=>{
        setIsReplying(false);
        setReplyContent('');
    }

    const handleSendClick = async (e) => {
        e.preventDefault();
        
        try {
             await axios.post(`${API_URL}/api/concern/${selectedConcern.id}/reply`, {
                content: replyContent
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            fetchReplies(); 
            setIsReplying(false);
            setReplyContent('');
        } catch (error) {
            console.error('Error while sending the reply:', error);
        }
    };

    const formatTimeDisplay = (time) => {
        const concernDate = new Date(time);
        const now = new Date();

        const formattedTime = format(concernDate, 'h:mm a'); // sample 4:30 PM
        const timeAgo = formatDistanceToNow(concernDate, { addSuffix: true }); // sample "23 hours ago"
        const formattedTimeAgo = timeAgo.replace(/^about\s/, '');
        const formattedDay = format(concernDate, 'EEE'); 

        if (now - concernDate < 86400000) {
            return `${formattedTime} (${formattedTimeAgo})`; // sample "4:30 PM (23 hours ago)"
        }
           
        const formattedDate = format(concernDate, 'MMM d'); // sample Sep 26, 2024
        return `${formattedDay}, ${formattedDate}, ${formattedTime} (${formattedTimeAgo})`;
    };
  
    return (
    <>
        <div className="ConcernAdmin__specific-container">
            <div className="ConcernAdmin__specific-item">
                <div className="ConcernAdmin__specific-header">
                    <IoArrowBackCircle className="ConcernAdmin__back-icon" onClick={handleBackClick} />
                    <img 
                        src={
                            selectedConcern.concern_type === 'Refill' ? images.refillIconOpen :
                            selectedConcern.concern_type === 'Borrow' ? images.borrowIconRed : images.returnIconGreen 
                        } 
                        alt="" />
                    <span>Concern: {selectedConcern.concern_type} - <i style={{color: '#9c9c9c'}}>"{selectedConcern.subject}"</i></span>
                </div>

                <div className="ConcernAdmin__specific-details">
                    <div className="ConcernAdmin__customer-info">
                        <img 
                            src={selectedConcern.customer.image ? `${API_URL}/storage/images/${selectedConcern.customer.image}` : images.defaultAvatar}
                            alt="Customer Avatar" 
                        />
                        <div className="ConcernAdmin__info">
                            <span className="ConcernAdmin__customer-name">
                            {selectedConcern.customer.fname} {selectedConcern.customer.lname}
                            <span className="ConcernAdmin__email">
                                &lt;{selectedConcern.customer.email || 'customer email'}&gt;
                            </span>
                            </span>
                            <span className="ConcernAdmin__to-admin">to admin</span>
                        </div>
                    </div>
                    <span className="ConcernAdmin__timestamp">{formatTimeDisplay(selectedConcern.time)}</span>
                </div>

                <div className="ConcernAdmin__specific-content">
                    {selectedConcern.content}
                    {selectedConcern.images && selectedConcern.images.length > 0 && (
                    <div className="ConcernAdmin__attachments">
                        <h4>Attachments:</h4>
                        <div className="ConcernAdmin__attachment-list">
                        {JSON.parse(selectedConcern.images).map((attachment, index) => (
                            <img 
                            key={index} 
                            src={`${API_URL}/storage/images/${attachment}`} 
                            alt={`Attachment ${index + 1}`} 
                            className="ConcernAdmin__attachment-image" 
                            onClick={() => handleImageClick(`${API_URL}/storage/images/${attachment}`)}
                            />
                        ))}
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </div>
        {/* reveal the image in a modal form */}
        {isModalOpen && (
            <Modal onClick={() => setModalOpen(false)}>
                <div onClick={e => e.stopPropagation()}>
                    <img src={currentImage} alt="Expanded" className="ConcernAdmin__see-image"  />
                </div>    
            </Modal>
        )}
        {/* not reveal the button reply if clicked */}
        {isAdmin && !isReplying && ( 
            <div className="ConcernAdmin__reply-container">
                <button 
                    className="ConcernAdmin__reply-button" 
                    onClick={handleReplyClick} 
                >
                    <AiFillMessage className="ConcernAdmin__reply-icon" />
                    Reply to this message
                </button>
            </div>
        )}
        {/* reveal the form container box if clicked */}
        {isReplying && ( 
            <form onSubmit={handleSendClick} className="ConcernAdmin__reply-box">
                <MdOutlineKeyboardBackspace onClick={handleCancelReply} className="ConcernAdmin__reply-back-btn"/>
                <div className="ConcernAdmin__reply-info">
                    <img src={selectedConcern.admin.image ? `${API_URL}/storage/images/${selectedConcern.admin.image}` : images.defaultAvatar} alt="User Avatar" />
                    <div className="ConcernAdmin__info">
                        <span className="ConcernAdmin__reply-name">
                        {selectedConcern.admin.fname} {selectedConcern.admin.lname}
                        </span>
                        <span className="ConcernAdmin__reply-email">
                            &lt;{selectedConcern.admin.email || 'customer email'}&gt;
                        </span>
                    </div>
                </div>
                <TextArea
                    value={replyContent} 
                    onChange={handleReplyChange}
                    type='text'
                    placeholder="Type your reply here..."
                    required
                    style={{ height: '80px', border: '1px solid #ccc'}}
                />
                <div className="ConcernAdmin__reply-actions">
                    <button type='submit' className="ConcernAdmin__send-button">
                        Send
                    </button>
                </div>
            </form>
        )}
        {/* display the send of reply of admin */}
        {replies && replies.length > 0 && (
            <>
                {replies.map((reply, index) => (
                    <div  key={index}className="ConcernAdmin__reply-box">
                        <div className="ConcernAdmin__reply-item">
                            <div className="ConcernAdmin__reply-info">
                                <div className="ConcernAdmin__reply-info-section"> 
                                    <img src={selectedConcern.admin.image ? `${API_URL}/storage/images/${selectedConcern.admin.image}` : images.defaultAvatar} alt="User Avatar" />
                                    <div className="ConcernAdmin__info">
                                        <span className="ConcernAdmin__reply-name">
                                            {selectedConcern.admin.fname} {selectedConcern.admin.lname}
                                            <span className='ConcernAdmin__reply-admin'>(Admin)</span>
                                        </span>
                                        <span className="ConcernAdmin__reply-email">
                                            &lt;{selectedConcern.admin.email || 'customer email'}&gt;
                                        </span>
                                    </div>
                                </div>
                                <span className="ConcernAdmin__reply-time">{formatTimeDisplay(reply.created_at)}</span>
                            </div>      
                            <div className="ConcernAdmin__reply-message">{reply.content}</div>
                        </div>
                    </div>
                ))}
            </>
        )}

    </>
  );
};
