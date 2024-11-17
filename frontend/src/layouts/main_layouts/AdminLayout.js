import "assets/css/admin";
import React, { useState, useEffect, useRef } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from "context/AuthContext";
import * as images from 'assets/images';
import axios from 'axios';
import {API_URL} from 'constants';
import Pusher from 'pusher-js';

export const AdminLayout = () => {
  const navigate = useNavigate();
  const { signOut, authUserObj, setAuthUserObj, user } = useAuth(); 

  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [subAccountSidebarVisible, setSubAccountSidebarVisible] = useState(false);
  const [highlightedAccountTab, setHighlightedAccountTab] = useState('');
  const [lastOpenedDropdown, setLastOpenedDropdown] = useState(null);

  const toggleSidebar = () => {

    setSidebarMinimized(!sidebarMinimized);
 
    if (!sidebarMinimized) {
      // Store the last opened dropdown
      setLastOpenedDropdown(
         subAccountSidebarVisible ? 'account' : null
      );
      // Close all sub sidebars
      setSubAccountSidebarVisible(false);

    } else {
      // Reopen the last opened dropdown
      if (lastOpenedDropdown === 'account') {
        setSubAccountSidebarVisible(true);
        setHighlightedAccountTab('sub-highlighted-delivery');
      }
    }
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const toggleNotifications = () => {
    setNotificationsVisible(!notificationsVisible);
  };

  const handleSeeAllClick = () => {
    setNotificationsVisible(false);
  };

  const handleAccountSettingsClick = () => {
    setDropdownVisible(false);
  };

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (!event.target.closest('.user-profile-container') && !event.target.closest('.profile-dropdown')) {
        setDropdownVisible(false);
      }
      if (!event.target.closest('.Notification') && !event.target.closest('.notifications-view')) {
        setNotificationsVisible(false);
      }
    };
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [setDropdownVisible, setNotificationsVisible]);


  const toggleSubSidebarAccount = () => {
    if (sidebarMinimized) {
      setSidebarMinimized(false);
      setSubAccountSidebarVisible(true);
      setHighlightedAccountTab('sub-highlighted-delivery');
    } else {
      setSubAccountSidebarVisible(!subAccountSidebarVisible);
      setHighlightedAccountTab(subAccountSidebarVisible ? '' : 'sub-highlighted-delivery');
    }
  };

  const location = useLocation();
  const [highlightedTab, setHighlightedTab] = useState('');
  const initialFetchDone = useRef(false);

  useEffect(()=>{

    // Initialize Pusher
    const pusher = new Pusher('2943d7a33567caa26551', {
      cluster: 'ap3',
      encrypted: true,
      auth: {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
        },
      },
    });

    // Subscribe to the notification channel
    const channel = pusher.subscribe('admin-notifications');

    // Listen for the 'new-notification' event
    channel.bind('my-event', () => {
      fetchNotifications();
    });

    return () => {
      // Unsubscribe from the channel when the component unmounts
      pusher.unsubscribe('admin-notifications');
    };
  },[]);

  useEffect(() => {
    const currentPath = location.pathname;

    if (!initialFetchDone.current) {
      if (Object.keys(authUserObj.user).length === 0) fetchUserData();
      if (authUserObj.notifications.length === 0) fetchNotifications();
      initialFetchDone.current = true;
    }

    if (currentPath.includes('dashboard')) {
      setHighlightedTab('dashboard');
    } else if (currentPath.includes('notifications')) {
      setHighlightedTab('notifications');
    } else if (currentPath.includes('users')) {
      setHighlightedTab('users');
    } else if (currentPath.includes('requests')) {
      setHighlightedTab('requests');
    } else if (currentPath.includes('transactions')) {
      setHighlightedTab('transactions');
    } else if (currentPath.includes('inventory')) {
      setHighlightedTab('inventory');
    } else if (currentPath.includes('announcements')) {
      setHighlightedTab('announcement');
    }else if (currentPath.includes('concerns')) {
      setHighlightedTab('concerns');
    } else if (currentPath.includes('account-settings/my-profile')) {
      setHighlightedTab('account');
    }else if (currentPath.includes('operational-settings')) {
      setHighlightedTab('operational');
    }
  }, [location]);

  const [users, setUser] = useState({});
  const [profilePic, setProfilePic] = useState(images.defaultAvatar); 


  const fetchUserData = async () => {
    try {
      const response = await axios.get(API_URL + '/api/user/display', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}` // Assuming you store the token in localStorage
        }
      });
      const userData = response.data.data;

      setAuthUserObj(prevState => ({
        ...prevState,
        user: userData
      }));

      setUser(userData);
      setProfilePic(userData.image ? `${API_URL}/storage/images/${userData.image}` : images.defaultAvatar);

    } catch (error) {
      console.error('Error fetching user data:', error);

    }
  };

  const fetchNotifications = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/admin/notifications`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}` 
            }
        });
        const sortedNotifications = response.data.data.sort((a, b) => {
            return new Date(b.updated_at) - new Date(a.updated_at);
        });

        setAuthUserObj(prevState => ({
          ...prevState,
          notifications: sortedNotifications
        }));

        setNotifications(sortedNotifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
    }
};



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
}



  const handleSignOut = () => {
    signOut(navigate);
  };

  return (

  <div className={`dashboard-container ${sidebarMinimized ? 'sidebar-minimized' : ''}`}>
    <div className="dashboard-header">
      <img className="Aquencher-Logo" src={images.loginLogo} alt="Aquencher Logo" />
      <div className="admin-profile">
        <div className="notif-container">
          <img className="Notification" src={images.notificationClose} alt="Notification"  onClick={toggleNotifications}  />
          {notifications.some(notification => !notification.is_read) && <div className="Layout_blue-circle"></div>}
          {notificationsVisible && (
            <>
              <div className={`CustomerLayout__notif-backdrop ${notificationsVisible ? 'visible' : ''}`} ></div>
              
              <div className="notifications-view">
                <div className="notifications-header">
                  <p className="notification-title-header">Notifications</p>
                  <Link to="notifications" className="see-all-button"  onClick={handleSeeAllClick}>See all</Link>
                </div>
                {notifications.length === 0 ? (
                  <p className="no-notifications-message">No notifications available.</p>
                ) : (
                  <>
                    <p className="notification-earlier-header">Earlier</p>
                    {notifications.map((notification, index) => (
                      <div key={index} className="notification-border-bottom">
                        <div className={`notification-details-header  ${notification.is_read ? '' : 'new-notification'}`} onClick={() => handleNotificationClick(notification)}>
                          <p className="notification-subject-header ">{notification.subject}</p>
                          <p className="notification-description-header ">{notification.description}</p>
                          <p className="notification-click-all">
                            Click here to{' '}
                            {notification.type === 'Refill' ? (
                              <Link to="/admin/requests/all-requests" className="link-no-underline" onClick={() => setNotificationsVisible(false)}>view all refill requests</Link>
                            ) : notification.type === 'Borrow' ? (
                              <Link to="/admin/requests/all-requests" className="link-no-underline" onClick={() => setNotificationsVisible(false)}>view all borrow requests</Link>
                            ) : notification.type === 'Return' ? (
                              <Link to="/admin/requests/all-requests" className="link-no-underline" onClick={() => setNotificationsVisible(false)}>view all return requests</Link>
                            ) :  notification.type === 'Concern' ? (
                              <Link to="/admin/concerns" className="link-no-underline" onClick={() => setNotificationsVisible(false)}>view all customer concerns</Link>
                            ) : null}
                            .
                          </p>
                          <p className="notification-time-header ">{notification.time}</p>
                          {notification.is_read ? '' : <div className="blue-circle"></div>}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </>
          )}
        </div>
        <div className="user-profile-container" onClick={toggleDropdown}>
          <img className="profile" src={profilePic} alt="Profile" />
          <span className="name">{users.fname}</span>
          <img className="dropArrow" src={images.dropArrow} alt="drop Arrow" />
        </div>
        {dropdownVisible && (
          <>
            <div className={`CustomerLayout__notif-backdrop ${dropdownVisible ? 'visible' : ''}`} ></div>
              
            <div  className="profile-dropdown">
              <Link className="link">
                <img className="image-dropdown" src={profilePic} alt="Account Profile" />
                <span className="profile-name">{users.fname}</span>
              </Link>
              <Link to="account-settings/my-profile" onClick={handleAccountSettingsClick}>
                <img className="setting-dropdown" src={images.accountSettingDropdown} alt="Account Settings" />
                Account Settings
              </Link>
              <Link onClick={handleSignOut}>
                <img className="logout-dropdown" src={images.logoutDropdown} alt="Logout Logo" />
                Logout
              </Link>
            </div>
          </>
          )}
      </div>
    </div>

    <div className={`side-bar ${sidebarMinimized ? 'minimized' : ''}`}>
      <button className="sidebar-toggle-button" onClick={toggleSidebar}>
        <img src={sidebarMinimized ? images.sidebarButtonOpen : images.sidebarButton} alt="button" />
      </button>
      <img className="adminlogo" src={images.adminLogo} alt="AdminLogo" />
      <ul>
        <Link to="dashboard" className={`link-sidebar ${highlightedTab === 'dashboard'? 'highlighted' : ''}`}>
          <li>
            <img className="sidebaricon" 
            src={highlightedTab === 'dashboard'? images.dashboardIconOpen :images.dashboardIconClose} 
            alt="Dashboard" />
            <span className="sidebar-text">Dashboard</span>
          </li>
        </Link>
        <Link to="notifications" className={`link-sidebar ${highlightedTab === 'notifications'? 'highlighted' : ''}`}>
          <li>
            <img className="sidebaricon" 
            src={highlightedTab === 'notifications'? images.notificationIconOpen : images.notificationIconClose} 
            alt="Notifications" />
            <span className="sidebar-text">Notifications</span>
          </li>
        </Link>
        <Link to="users/customers" className={`link-sidebar ${highlightedTab === 'users'? 'highlighted' : ''}`}>
          <li>
            <img className="sidebaricon" 
            src={highlightedTab === 'users'? images.usersIconOpen : images.usersIconClose} 
            alt="Users" />
            <span className="sidebar-text">Users</span>
          </li>
        </Link>
        <Link to="requests/all-requests" className={`link-sidebar ${highlightedTab === 'requests'? 'highlighted' : ''}`}>
          <li>
            <img className="sidebaricon" 
            src={highlightedTab === 'requests'? images.deliveryIconOpen : images.deliveryIconClose} 
            alt="Requests" />
            <span className="sidebar-text">Requests</span>
          </li>
        </Link>
        <Link to="transactions" className={`link-sidebar ${highlightedTab === 'transactions'? 'highlighted' : ''}`}>
          <li>
            <img className="sidebaricon" 
            src={highlightedTab === 'transactions'? images.transactionIconOpen : images.transactionIconClose} 
            alt="Transactions" />
            <span className="sidebar-text">Transactions</span>
          </li>
        </Link>
        <Link to="inventory" className={`link-sidebar ${highlightedTab === 'inventory'? 'highlighted' : ''}`}>
          <li>
            <img className="sidebaricon" 
            src={highlightedTab === 'inventory'? images.inventoryIconOpen :images.inventoryIconClose} 
            alt="Inventory" />
            <span className="sidebar-text">Inventory</span>
          </li>
        </Link>
        <Link to="announcements" className={`link-sidebar ${highlightedTab === 'announcement'? 'highlighted' : ''}`}>
          <li>
            <img className="sidebaricon" 
            src={highlightedTab === 'announcement'? images.announcementIconOpen :images.announcementIconClose} 
            alt="Announcements" />
            <span className="sidebar-text">Announcements</span>
          </li>
        </Link>
        <Link to="concerns" className={`link-sidebar ${highlightedTab === 'concerns'? 'highlighted' : ''}`}>
          <li>
            <img className="sidebaricon" 
            src={highlightedTab === 'concerns'? images.concernIconOpen :images.concernIconClose} 
            alt="Concerns" />
            <span className="sidebar-text">Concerns</span>
          </li>
        </Link>
        <li className={`link-sidebar sub-delivery
          ${highlightedTab === 'account' || highlightedTab === 'operational' ? 'highlighted' : highlightedAccountTab}`} 
          onClick={toggleSubSidebarAccount}>
          <img className="sidebaricon" 
          src={highlightedTab === 'account' || highlightedTab === 'operational' ? images.accountIconOpen : images.accountIconClose} 
          alt="Account" />
          <span className="sidebar-text">Account</span>
          <img
              className="sidebar-dropdown"
              src={subAccountSidebarVisible ? 
              (highlightedTab === 'account' || highlightedTab === 'operational' ? images.blueSidebarDropdownOpen : images.sidebarDropdownOpen) : 
              ( highlightedTab === 'account' || highlightedTab === 'operational' ? images.blueSidebarDropdownClose : images.sidebarDropdownClose)}
              alt="dropdown"
            />
        </li>
        {subAccountSidebarVisible && (
        <ul>
          <Link to="account-settings/my-profile" className='link-sub-sidebar'>
            <li className={`sub-sidebar ${highlightedTab === 'account'? 'selected' : ''}`}>
              <div className={`task-container  ${highlightedTab === 'account'? 'sub-highlighted' : ''} `}>
                <img className="sub-sidebaricon account-settings-icon" 
                src={highlightedTab === 'account'? images.accountSettingIconOpen : images.accountSettingIconClose} 
                alt="Account Settings" />
                <span className="sidebar-text account-settings-text">Account Settings</span>
              </div>
            </li>
          </Link>
          <Link to="operational-settings" className='link-sub-sidebar'>
            <li className={`sub-sidebar ${highlightedTab === 'operational'? 'selected' : ''}`}>
              <div className={`task-container  ${highlightedTab === 'operational'? 'sub-highlighted' : ''} `}>
                <img className="sub-sidebaricon account-settings-icon" 
                src={highlightedTab === 'operational'? images.accountSettingIconOpen : images.accountSettingIconClose} 
                alt="Operational Settings" />
                <span className="sidebar-text account-settings-text">Operational Settings</span>
              </div>
            </li>
          </Link>
        </ul>
        )}
      </ul>
    </div>
    <div className={`dashboard-content ${sidebarMinimized ? 'content-minimized' : ''}`}>
      <Outlet/>
    </div>
   
  </div>
  );
};
