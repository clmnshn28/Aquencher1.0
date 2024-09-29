import React, {useState} from 'react';
import { format, formatDistanceToNow } from 'date-fns';
import { IoArrowBackCircle } from 'react-icons/io5';
import { AiFillMessage } from 'react-icons/ai';
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import * as images from 'assets/images'; 
import Modal from './Modal';
import TextArea from './TextArea';


export const ConcernSpecific = ({ selectedConcern, handleBackClick, isAdmin  }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [isReplying, setIsReplying] = useState(false); 
    const [currentImage, setCurrentImage] = useState('');
    const [replyContent, setReplyContent] = useState('');  
    const [replies, setReplies] = useState([]); 

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

    const handleSendClick = (e) => {
        e.preventDefault();
        const now = new Date();

        const formattedTime = format(now, 'h:mm a'); 
        const timeAgo = formatDistanceToNow(now, { addSuffix: true }); 
        const formattedTimeAgo = timeAgo.replace(/^about\s/, ''); 
        const formattedDay = format(now, 'EEE');
        const formattedDate = format(now, 'MMM d, yyyy'); 
    
        const timeDifference = Date.now() - now.getTime();

        const formattedReplyTime = timeDifference < 86400000 
        ? `${formattedTime} (${formattedTimeAgo})` 
        : `${formattedDay}, ${formattedDate}, ${formattedTime} (${formattedTimeAgo})`;

        setReplies([{ content: replyContent, time: formattedReplyTime }, ...replies]);
        setIsReplying(false);
        setReplyContent(''); 
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
                            selectedConcern.requestType === 'Refill' ? images.refillIconOpen :
                            selectedConcern.requestType === 'Borrow' ? images.borrowIconRed : images.returnIconGreen 
                        } 
                        alt="" />
                    <span>Concern: {selectedConcern.requestType} - <i style={{color: '#9c9c9c'}}>"{selectedConcern.subject}"</i></span>
                </div>

                <div className="ConcernAdmin__specific-details">
                    <div className="ConcernAdmin__customer-info">
                        <img 
                            src={images.defaultAvatar} 
                            alt="Customer Avatar" 
                        />
                        <div className="ConcernAdmin__info">
                            <span className="ConcernAdmin__customer-name">
                            {selectedConcern.fname} {selectedConcern.lname}
                            <span className="ConcernAdmin__email">
                                &lt;{selectedConcern.email || 'customer email'}&gt;
                            </span>
                            </span>
                            <span className="ConcernAdmin__to-admin">to admin</span>
                        </div>
                    </div>
                    <span className="ConcernAdmin__timestamp">{formatTimeDisplay(selectedConcern.time)}</span>
                </div>

                <div className="ConcernAdmin__specific-content">
                    {selectedConcern.message}
                    {selectedConcern.attachments && selectedConcern.attachments.length > 0 && (
                    <div className="ConcernAdmin__attachments">
                        <h4>Attachments:</h4>
                        <div className="ConcernAdmin__attachment-list">
                        {selectedConcern.attachments.map((attachment, index) => (
                            <img 
                            key={index} 
                            src={attachment} 
                            alt={`Attachment ${index + 1}`} 
                            className="ConcernAdmin__attachment-image" 
                            onClick={() => handleImageClick(attachment)}
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
                    <img src={images.defaultAvatar} alt="User Avatar" />
                    <div className="ConcernAdmin__info">
                        <span className="ConcernAdmin__reply-name">
                        {selectedConcern.fname} {selectedConcern.lname}
                        </span>
                        <span className="ConcernAdmin__reply-email">
                            &lt;{selectedConcern.email || 'customer email'}&gt;
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
        {replies.length > 0 && (
            <>
                {replies.map((reply, index) => (
                    <div  key={index}className="ConcernAdmin__reply-box">
                        <div className="ConcernAdmin__reply-item">
                            <div className="ConcernAdmin__reply-info">
                                <img src={images.defaultAvatar} alt="User Avatar" />
                                <div className="ConcernAdmin__info">
                                    <span className="ConcernAdmin__reply-name">
                                        Celmin Shane Quizon
                                        <span className='ConcernAdmin__reply-admin'>(Admin)</span>
                                    </span>
                                    <span className="ConcernAdmin__reply-email">
                                        &lt;celminshanequizon@gmail.com&gt;
                                    </span>
                                </div>
                                <span className="ConcernAdmin__reply-time">{reply.time}</span>
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
