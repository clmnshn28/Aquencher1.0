import "assets/css/admin"
import React, { useState, useEffect, useRef  } from 'react';
import { Link } from 'react-router-dom'; 
import axios from 'axios';
import {API_URL} from 'constants';

export const NotificationAdmin = () => {

  const [notifications, setNotifications] = useState([]);
  const initialFetchDone = useRef(false);

  useEffect(() => {
    if (!initialFetchDone.current) {
      fetchNotificationData();
      initialFetchDone.current = true;
    }
  }, []);
  
  const fetchNotificationData = async () => {
     await axios.get(`${API_URL}/api/admin/notifications`,{
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
      }
    })
      .then(response => {
        setNotifications(response.data.data);
      })
      .catch(error => {
        console.error("There was an error fetching the notifications!", error);
      });

  }


  const handleNotificationClick = (notification) => {
  
    const notificationIds = notification.batch_id.map(n => n.id);

    const notificationData = {
      notification_ids: notificationIds,
    };

    axios.post(`${API_URL}/api/admin/notifications/read`, notificationData, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
      }
    })
    .then(() => {
      setNotifications(notifications.map(n => {
        if (n.batch_id === notification.batch_id) {
          return { ...n, is_read: true };
        }
        return n;
      }));
    })
    .catch(error => {
      console.error(`There was an error marking notifications as read!`, error);
    });
   
  };

  return (

    <div>
      <div className="notification-container">
        <h2 className="notification-title">Notifications</h2>
        {notifications.length === 0 ? (
          <p className="no-notifications-message">No notifications available.</p>
        ) : (
          <>
            <h3 className="notification-earlier">Earlier</h3>
            {notifications.map((notification, index) => (
              <div key={index} className="notification-border-bottom">
                <div className={`notification-details ${notification.is_read ? '' : 'new-notification'}`} onClick={() => handleNotificationClick(notification)}>
                  <p className="notification-subject">{notification.subject}</p>
                  <p className="notification-description">{notification.description}</p>
                  <p className="notification-click-all">
                    Click here to{' '}
                    {notification.type === 'Refill' ? (
                      <Link to="/admin/requests/all-requests" className="link-no-underline">view all refill requests</Link>
                    ) : notification.type === 'Borrow' ? (
                      <Link to="/admin/requests/all-requests" className="link-no-underline">view all borrow requests</Link>
                    ) : notification.type === 'Return' ? (
                      <Link to="/admin/requests/all-requests" className="link-no-underline">view all return requests</Link>
                    ) :  notification.type === 'Concern' ? (
                      <Link to="/admin/concerns" className="link-no-underline">view all customer concerns</Link>
                    ) : null}
                    .
                  </p>
                  <p className="notification-time">{notification.time}</p>
                  {notification.is_read ? '' : <div className="blue-circle"></div>}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
