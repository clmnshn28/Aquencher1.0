import React, {useState} from "react";
import "assets/css/Notification.css";
import "assets/css/ResponsiveNotification.css";

export const Notification = () =>{

    const [notifications, setNotifications] = useState([
        {subject: 'Pickup Request Confirmation', description: "Your pickup request for refilling has been accepted! We wil start collecting water gallon at 9:10 AM", time: '10 Minutes ago', isNew: true},
        {subject: 'Borrowed Gallon', description: "You have borrowed gallons from PO's Purified Drinking Water & Refilling Hub. Please return them by [Date] to avoid additional charges.", time: '5 hours ago', isNew: true},
        {subject: 'Pickup Request Confirmation', description: "Your pickup request for refilling has been accepted! We wil start collecting water gallon at 9:10 AM", time: '10 Minutes ago', isNew: false},
        {subject: 'Pickup Request Confirmation', description: "Your pickup request for refilling has been accepted! We wil start collecting water gallon at 9:10 AM", time: '10 Minutes ago', isNew: true},
    ]);

    const handleNotificationClick = (index) => {
        setNotifications(notifications.map((notification, i) =>
            i === index ? {...notification, isNew: false} : notification
        ));
    };

    return(
        <>
        <div className="Notification__container">
            <h2 className="Notification__title">Notifications</h2>
            <h3 className="Notification__earlier">Earlier</h3>
            {notifications.map((notification, index) =>(
                <div key={index} className="Notification__border-bottom">
                    <div className={`Notification__details ${notification.isNew ? 'Notification__new-notification' : ''}`} onClick={() => handleNotificationClick(index)} >
                        <p className="Notification__subject">{notification.subject}</p>
                        <p className="Notification__description">{notification.description}</p>
                        <p className="Notification__time">{notification.time}</p>
                        {notification.isNew && <div className="Notification__blue-circle"/>}
                    </div>
                </div>
            ))}
        </div>
        </>
    );
};