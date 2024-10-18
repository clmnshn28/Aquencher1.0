import React from "react";
import 'assets/css/admin';

import * as images from 'assets/images';

export const ConcernItem = ({fname, lname,requestType, subject, message, time, isNew, isAdmin, onClick}) =>{
    
    const formatTimeDisplay = (time) => {
        const now = new Date();
        const concernDate = new Date(time);
        const diffInHours = (now - concernDate) / (1000 * 60 * 60); // Calculate the difference in hours
    
        if (diffInHours < 24) {
            // If the concern is new (within 24 hours)
            return concernDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
        } else {
            // If the concern is older than 24 hours
            return concernDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    return(
        <div className={`ConcernAdmin__item ${isNew ? 'ConcernAdmin__new-message' : ''}`}  onClick={onClick}>
            {isAdmin && (
                <div className="ConcernAdmin__name">
                    {fname} {lname}
                </div>
            )}
            <div className="ConcernAdmin__Message">
                <img src={
                     requestType === 'Refill' ? images.refillIconOpen :
                     requestType === 'Borrow' ? images.borrowIconRed : images.returnIconGreen 
                } 
                alt={`${requestType} Icon`} />
                <span className="ConcernAdmin__subject">{subject}</span> -
                <span className="ConcernAdmin__message">{message}</span>
            </div>
            <div className="ConcernAdmin__time">
            <span className={`Dashboard__new-indicator ${isNew ? '' : 'Dashboard__unread-new'}`}>New</span>
                {formatTimeDisplay(time)}
            </div>
        </div>
    );
};