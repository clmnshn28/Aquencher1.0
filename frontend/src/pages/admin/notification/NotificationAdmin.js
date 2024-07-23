import "assets/css/NotificationAdmin.css"

import React, { useState } from 'react';

export const NotificationAdmin = () => {

  const [notifications, setNotifications] = useState([
    { subject: 'Request for Customer Account Deactivation', description: 'Karen Joyce Joson has requested the deletion of account.', time: '10 minutes ago', isNew: true },
    { subject: 'Borrow Request', description: 'Karen Joyce Joson requested to borrow 3 gallons of Po\'s Purified Blue Slim Gallon with Faucet Refill (20L/5gal)', time: '12 minutes ago', isNew: true },
    { subject: 'Borrow Request', description: 'John Smith requested to borrow 2 gallons of Po\'s Purified Dispenser Bottle Refill 18.9L', time: '12 minutes ago', isNew: false },
    { subject: 'System Update', description: 'System will be offline temporarily. Update is scheduled for tomorrow at 10:00 AM. Please plan your tasks accordingly.', time: '12 minutes ago', isNew: false },
  ]);

  const handleNotificationClick = (index) => {
    setNotifications(notifications.map((notification, i) => 
      i === index ? { ...notification, isNew: false } : notification
    ));
  };

  return (

    <div>
      <div className="notification-container">
        <h2 className="notification-title">Notifications</h2>
        <h3 className="notification-earlier">Earlier</h3>
        {notifications.map((notification, index) => (
          <div key={index} className={`notification-details ${notification.isNew ? 'new-notification' : ''}`} onClick={() => handleNotificationClick(index)}>
            <p className="notification-subject">{notification.subject}</p>
            <p className="notification-description">{notification.description}</p>
            <p className="notification-time">{notification.time}</p>
            {notification.isNew && <div className="blue-circle"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};
