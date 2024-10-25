import React, {useState, useEffect} from "react";
import "assets/css/customer";
import axios from 'axios';
import {API_URL} from 'constants';
import { formatDistanceToNow, parseISO } from 'date-fns';

export const Notification = () =>{

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/customer/notifications`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}` 
                }
            });
            const sortedNotifications = response.data.data.sort((a, b) => {
                return new Date(b.updated_at) - new Date(a.updated_at);
            });

            setNotifications(sortedNotifications);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };



    const handleNotificationClick = async (notification) => {
        setNotifications(notifications.map((n) =>
            n.id === notification.id ? { ...n, is_read: true } : n
        ));

        try {
            // Call the API to mark the notification as read
            await axios.put(`${API_URL}/api/customer/notifications/${notification.id}/read`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}` 
                }
            });
        } catch (error) {
            console.error('Error marking notification as read:', error);
            setNotifications(notifications.map((n) =>
                n.id === notification.id ? { ...n, is_read: false } : n
            ));
        }
    };

    const formatTimeAgo = (time) => {
        return formatDistanceToNow(parseISO(time), { addSuffix: true });
    };

    return(
        <>
        <div className="Notification__container">
            <h2 className="Notification__title">Notifications</h2>
            {notifications.length === 0 ? (
                <p className="no-notifications-message">No notifications available.</p>
            ) : (
                <>
                    <h3 className="Notification__earlier">Earlier</h3>
                    {notifications.map((notification) =>(
                        <div key={notification.id} className="Notification__border-bottom">
                            <div className={`Notification__details ${notification.is_read ? '' : 'Notification__new-notification'}`} onClick={() => handleNotificationClick(notification)} >
                                <p className="Notification__subject">{notification.subject}</p>
                                <p className="Notification__description">{notification.description}</p>
                                <p className="Notification__time">{formatTimeAgo(notification.updated_at)}</p>
                                {notification.is_read ? '' : <div className="Notification__blue-circle"/>}
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
        </>
    );
};