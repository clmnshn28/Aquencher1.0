import React from "react";
import { format } from 'date-fns'; 
import { BiMessage } from "react-icons/bi";
import { IoPersonCircleOutline } from "react-icons/io5";
import { RiLockPasswordLine } from "react-icons/ri";
import { MdOutlineWaterDrop } from "react-icons/md";
import 'assets/css/customer';

export const ActivityLogs = () =>{
    const activityLogData = [
        {
            id: 1,
            timestamp: '2024-10-02T08:00:00',
            type: 'Password Change',
            message: 'You have successfully changed your password.',
        },
        {
            id: 2,
            timestamp: '2024-09-31T16:03:00',
            type: 'Concern Submitted',
            message: 'You have submitted a concern regarding a delay in your water delivery...',
        },
        {
            id: 3,
            timestamp: '2024-09-14T14:05:00',
            type: 'Profile Update',
            message: 'You have updated your contact information, including your phone number and address.',
        },
        {
            id: 4,
            timestamp: '2024-10-01T09:00:00',
            type: 'Order Placed',
            message: 'You have placed an order for 2 Round Gallons and 1 Slim Gallon.',
        },
        {
            id: 5,
            timestamp: '2024-09-28T10:30:00',
            type: 'Gallon Borrowed',
            message: 'You have borrowed 1 Slim Gallon.',
        },
        {
            id: 6,
            timestamp: '2024-09-29T11:15:00',
            type: 'Gallon Returned',
            message: 'You have returned 2 Round Gallons.',
        },
    ];

    const sortedActivityLogData = activityLogData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return format(date, 'MMM d, yyyy'); // Format: Oct 2, 2024
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return format(date, 'h:mm a'); // Format: 8:00 AM
    };


    return(
        <>
            <div className="ActivityLogs__header">
                <h2 className="ActivityLogs__header-text">Activity Logs</h2>
            </div>

            <div className="ActivityLogs__container">
                {sortedActivityLogData.map((log, index) => (
                    <div className="ActivityLogs__item" key={log.id}>
                        <div className="ActivityLogs__item-date">
                            <span>{formatDate(log.timestamp)}</span>
                            <span>{formatTime(log.timestamp)}</span>
                        </div>
                        <div className="ActivityLogs__item-content">
                            {log.type.includes("Password") && <RiLockPasswordLine className="ActivityLogs__item-icon" />}
                            {log.type.includes("Concern") && <BiMessage className="ActivityLogs__item-icon" />}
                            {log.type.includes("Profile") && <IoPersonCircleOutline className="ActivityLogs__item-icon" />}
                            {(log.type.includes("Order") || log.type.includes("Gallon")) && <MdOutlineWaterDrop className="ActivityLogs__item-icon" />}
                            <div
                                className={`ActivityLogs__line 
                                    ${index === 0 ? 'ActivityLogs__line-first' : ''}
                                    ${index === sortedActivityLogData.length - 1 ? 'ActivityLogs__line-last' : ''}
                                `}
                            ></div>
                        </div>

                        <div className="ActivityLogs__item-info">
                            <span className="ActivityLogs__item-title">{log.type}</span>
                            <span className="ActivityLogs__item-desc">{log.message}</span>
                        </div>
                    </div>
                ))}
            </div>    
        </>
    );
};