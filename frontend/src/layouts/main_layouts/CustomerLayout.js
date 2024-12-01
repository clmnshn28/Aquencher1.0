import "assets/css/customer";
import React, {useState, useEffect, useRef } from "react";
import {Link, Outlet, useLocation, useNavigate} from 'react-router-dom';
import { useAuth } from "context/AuthContext";
import * as images from 'assets/images';
import { TbLogout, TbLogs } from "react-icons/tb";
import { RxGear } from "react-icons/rx";
import { MdOutlineQrCode2 } from "react-icons/md";
import axios from 'axios';
import {API_URL} from 'constants';
import { formatDistanceToNow, parseISO } from 'date-fns';
import Pusher from 'pusher-js';
import { CustomerQRModal } from "./modals/CustomerQRModal";

export const CustomerLayout = () =>{
  const navigate = useNavigate();
  const { signOut, authUserObj, setAuthUserObj, user  } = useAuth(); 
  
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [subAccountSidebarVisible, setSubAccountSidebarVisible] = useState(false);
  const [highlightedAccountTab, setHighlightedAccountTab] = useState('');
  const [lastOpenedDropdown, setLastOpenedDropdown] = useState(null);
  const [isOpenQrModal, setIsOpenQrModal] = useState(false);

  const toggleSidebar = () => {
    setSidebarMinimized(!sidebarMinimized);
    if (!sidebarMinimized) {
      // Store the last opened dropdown
      setLastOpenedDropdown(
        subAccountSidebarVisible ? 'account' : null
      );
        // Close sub sidebars
      setSubAccountSidebarVisible(false);
    }else{
      // Reopen the last opened dropdown
      if (lastOpenedDropdown === 'account') {
        setSubAccountSidebarVisible(true);
        setHighlightedAccountTab('CustomerLayout__sub-highlighted-delivery');
      }
    }
  };

  const toggleSubSidebarAccount = () => {
    if (sidebarMinimized) {
      setSidebarMinimized(false);
      setSubAccountSidebarVisible(true);
      setHighlightedAccountTab('CustomerLayout__sub-highlighted-delivery');
    } else {
      setSubAccountSidebarVisible(!subAccountSidebarVisible);
      setHighlightedAccountTab(subAccountSidebarVisible ? '' : 'CustomerLayout__sub-highlighted-delivery');
    }
  };

  
  const toggleDropdown = () =>{
    setDropdownVisible(!dropdownVisible);
  };

  const toggleNotifications = () => {
    setNotificationsVisible(!notificationsVisible);
    fetchNotifications();
  };


  const handleSeeAllClick = () => {
    setNotificationsVisible(false);
  };

  const handleAccountSettingsClick = () => {
    setDropdownVisible(false);
  };

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (!event.target.closest('.CustomerLayout__user-profile-container') && !event.target.closest('.CustomerLayout__profile-dropdown')) {
        setDropdownVisible(false);
      }
      if (!event.target.closest('.CustomerLayout__Notification') && !event.target.closest('.CustomerLayout__notifications-view')) {
        setNotificationsVisible(false);
      }
    };
    document.addEventListener('click', handleDocumentClick);
    return () => document.removeEventListener('click', handleDocumentClick);
  }, [setDropdownVisible, setNotificationsVisible]);



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
    const channel = pusher.subscribe(`customer.${user.id}.notifications`);

    // Listen for the 'new-notification' event
    channel.bind('my-event', (data) => {
      setNotifications((prevNotifications) => [data.notification, ...prevNotifications]);
    });

    return () => {
      // Unsubscribe from the channel when the component unmounts
      pusher.unsubscribe(`customer.${user.id}.notifications`);
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
    } else if (currentPath.includes('requests')) {
      setHighlightedTab('requests');
    } else if (currentPath.includes('transactions')) {
      setHighlightedTab('transactions');
    } else if (currentPath.includes('concerns')) {
      setHighlightedTab('concerns');
    } else if (currentPath.includes('account-settings/my-profile')) {
      setHighlightedTab('account');
    }else if (currentPath.includes('activity-logs')) {
      setHighlightedTab('logs');
    }
  }, [location]);

  // this for mobile view
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);

  const toggleSidebarMobile = () => {
    setSidebarOpenMobile(!sidebarOpenMobile);
  }; 

  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.querySelector('.CustomerLayout__side-bar');
      if (sidebar && !sidebar.contains(event.target) && sidebarOpenMobile) {
        setSidebarOpenMobile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpenMobile]);

// for user fetch and picture
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
        const response = await axios.get(`${API_URL}/api/customer/notifications`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}` 
            }
        });
        const sortedNotifications = response.data.data.sort((a, b) => {
            return new Date(b.created_at) - new Date(a.created_at);
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

  const handleNotificationClick = async (notification) => {
    setNotifications(notifications.map((n) =>
        n.id === notification.id ? { ...n, is_read: true } : n
    ));

    try {
        await axios.put(`${API_URL}/api/customer/notifications/${notification.id}/read`, null, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}` 
            }
        });

        let route = '/customer/dashboard'; 
        if (notification.subject.includes("Concern")) {
            route = '/customer/concerns';
        } else if (notification.subject.includes("Announcement")) {
            route = '/customer/dashboard';
        } else if (notification.subject.includes("Request")) {
            route = '/customer/transactions';
        }

        navigate(route);
        setNotificationsVisible(false);
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

  const handleSignOut = () => {
    signOut(navigate);
  };

  const handleQR = () =>{
    fetchUserData();
    setIsOpenQrModal(true);
  };

  return(
    <div className={`CustomerLayout__dashboard-container ${sidebarMinimized ? 'CustomerLayout__sidebar-minimized' : ''}`}>
      <div 
        className={`CustomerLayout__sidebar-overlay ${sidebarOpenMobile ? 'open' : ''}`} 
        onClick={toggleSidebarMobile}
      ></div>
      <div className="CustomerLayout__dashboard-header">
        <div className="CustomerLayout__logo-section">
          <button className="CustomerLayout__hamburger-icon"onClick={toggleSidebarMobile}>
            <img src={images.hamburgerIconClose} alt="Hamburger Menu"/>  
          </button> 
          <img className="CustomerLayout__Aquencher-Logo" src={images.loginLogo} alt="Aquencher Logo" />
        </div>
        <div className="CustomerLayout__admin-profile">
          
          <div className="CustomerLayout__notif-container">
            <img className="CustomerLayout__Notification" src={images.notificationClose} alt="Notification"  onClick={toggleNotifications}  />
            {notifications.some(notification => !notification.is_read) && <div className="Layout_blue-circle"></div>}
            {notificationsVisible && (
              <>
                <div className={`CustomerLayout__notif-backdrop ${notificationsVisible ? 'visible' : ''}`} ></div>
              
                <div className="CustomerLayout__notifications-view">
                  <div className="CustomerLayout__notifications-header">
                    <p className="CustomerLayout__notification-title-header">Notifications</p>
                    <Link to="notifications" className="CustomerLayout__see-all-button" onClick={handleSeeAllClick}>See all</Link>
                  </div>
                  {notifications.length === 0 ? (
                    <p className="no-notifications-message">No notifications available.</p>
                  ) : (
                      <>
                      <p className="CustomerLayout__notification-earlier-header">Earlier</p>
                      {notifications.map((notification, index) => (
                        <div key={index} className="Notification__border-bottom">
                          <div className={`CustomerLayout__notification-details-header ${notification.is_read ? '' : 'CustomerLayout__new-notification'}`} onClick={() => handleNotificationClick(notification)}>
                            <p className="CustomerLayout__notification-subject-header">{notification.subject}</p>
                            <p className="CustomerLayout__notification-description-header">{notification.description}</p>
                            <p className="CustomerLayout__notification-time-header">{formatTimeAgo(notification.created_at)}</p>
                            {notification.is_read ? '' : <div className="CustomerLayout__blue-circle"></div>}
                          </div>
                        </div>
                      ))}
                      </>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="CustomerLayout__qr-container" onClick={handleQR}>
            <MdOutlineQrCode2 className="CustomerLayout__qr-icon"/>
          </div>
          <div className="CustomerLayout__user-profile-container" onClick={toggleDropdown}>
            <img className="CustomerLayout__profile" src={profilePic} alt="Profile" />
            <span className="CustomerLayout__name">{users.fname}</span>
            <img className="CustomerLayout__dropArrow" src={images.dropArrow} alt="drop Arrow" />
            {dropdownVisible && (
              <>
                <div className={`CustomerLayout__notif-backdrop ${dropdownVisible ? 'visible' : ''}`} ></div>
              
                <div  className="CustomerLayout__profile-dropdown">
                  <Link className="CustomerLayout__link">
                    <img className="CustomerLayout__image-dropdown" src={profilePic} alt="Account Profile" />
                    <span className="CustomerLayout__profile-name">{users.fname}</span>
                  </Link>
                  <Link to="account-settings/my-profile" onClick={handleAccountSettingsClick} >
                    <img className="CustomerLayout__setting-dropdown" src={images.accountSettingDropdown} alt="Account Settings" />
                    Account Settings
                  </Link>
                  <Link onClick={handleSignOut}>
                    <img className="CustomerLayout__logout-dropdown" src={images.logoutDropdown} alt="Logout Logo" />
                    Logout
                  </Link>
                </div>
              </>
              )}
          </div>

        </div>
      </div>

    <div className={`CustomerLayout__side-bar ${sidebarMinimized ? 'CustomerLayout__minimized' : ''}  ${sidebarOpenMobile ? 'open' : ''}`}>
      <button className="CustomerLayout__sidebar-toggle-button" onClick={toggleSidebar}>
        <img src={sidebarMinimized ? images.sidebarButtonOpen : images.sidebarButton} alt="button" />
      </button>
      <div className="CustomerLayout__cons-logo"></div>
      {/* <button className="CustomerLayout__hamburger-menu" onClick={toggleSidebarMobile}>
        <img src={images.hamburgerIconOpen} alt="Hamburger Menu"/>  
      </button>  */}
      <ul>
        <Link to="dashboard" className={`CustomerLayout__link-sidebar ${highlightedTab === 'dashboard'? 'CustomerLayout__highlighted' : ''}`}>
          <li>
            <img className="CustomerLayout__sidebaricon" 
            src={highlightedTab === 'dashboard'? images.dashboardIconOpen :images.dashboardIconClose} 
            alt="Dashboard" />
            <span className="CustomerLayout__sidebar-text">Dashboard</span>
          </li>
        </Link>
        <Link to="notifications" className={`CustomerLayout__link-sidebar ${highlightedTab === 'notifications'? 'CustomerLayout__highlighted' : ''}`}>
          <li>
            <img className="CustomerLayout__sidebaricon" 
            src={highlightedTab === 'notifications'? images.notificationIconOpen : images.notificationIconClose} 
            alt="Notifications" />
            <span className="CustomerLayout__sidebar-text">Notifications</span>
          </li>
        </Link>
        <Link to="requests" className={`CustomerLayout__link-sidebar ${highlightedTab === 'requests'? 'CustomerLayout__highlighted' : ''}`}>
          <li>
            <img className="CustomerLayout__sidebaricon" 
            src={highlightedTab === 'requests'? images.deliveryIconOpen :images.deliveryIconClose} 
            alt="Requests" />
            <span className="CustomerLayout__sidebar-text">Requests</span>
          </li>
        </Link>
        <Link to="transactions" className={`CustomerLayout__link-sidebar ${highlightedTab === 'transactions'? 'CustomerLayout__highlighted' : ''}`}>
          <li>
            <img className="CustomerLayout__sidebaricon" 
            src={highlightedTab === 'transactions'? images.transactionIconOpen : images.transactionIconClose} 
            alt="Transactions" />
            <span className="CustomerLayout__sidebar-text">Transactions</span>
          </li>
        </Link>
        <Link to="concerns" className={`CustomerLayout__link-sidebar ${highlightedTab === 'concerns'? 'CustomerLayout__highlighted' : ''}`}>
          <li>
            <img className="CustomerLayout__sidebaricon" 
            src={highlightedTab === 'concerns'? images.concernIconOpen :images.concernIconClose} 
            alt="Concerns" />
            <span className="CustomerLayout__sidebar-text">Concerns</span>
          </li>
        </Link>
        <li className={`CustomerLayout__link-sidebar CustomerLayout__sub-delivery
          ${highlightedTab === 'account' || highlightedTab === 'logs' ? 'CustomerLayout__highlighted' : highlightedAccountTab}`} 
          onClick={toggleSubSidebarAccount}>
          <img className="CustomerLayout__sidebaricon" 
          src={highlightedTab === 'account' || highlightedTab === 'logs' ? images.accountIconOpen : images.accountIconClose} 
          alt="Account" />
          <span className="CustomerLayout__sidebar-text">Account</span>
          <img
              className="CustomerLayout__sidebar-dropdown"
              src={subAccountSidebarVisible ? 
                (highlightedTab === 'account' || highlightedTab === 'logs'  ? images.blueSidebarDropdownOpen : images.sidebarDropdownOpen) : 
                ( highlightedTab === 'account' || highlightedTab === 'logs'  ? images.blueSidebarDropdownClose : images.sidebarDropdownClose)}
              alt="dropdown"
            />
        </li>
        {subAccountSidebarVisible && (
        <ul>
          <Link to="account-settings/my-profile" className='CustomerLayout__link-sub-sidebar'>
            <li className={`CustomerLayout__sub-sidebar ${highlightedTab === 'account'? 'CustomerLayout__selected' : ''}`}>
              <div className={`CustomerLayout__task-container  ${highlightedTab === 'account'? 'CustomerLayout__sub-highlighted' : ''} `}>
                <RxGear  className={`CustomerLayout__sub-sidebaricon ${highlightedTab === 'account'? 'CustomerLayout__sub-highlighted' : ''} `}/>
                <span className="CustomerLayout__sidebar-text account-settings-text">Account Settings</span>
              </div>
            </li>
          </Link>
        </ul>
        )}
        <Link onClick={handleSignOut}  className={`CustomerLayout__link-sidebar logout `}>
          <li>
            <TbLogout  className="CustomerLayout__sidebaricon"/>
            <span className="CustomerLayout__sidebar-text">Sign out</span>
          </li>
        </Link>
      </ul>
    </div>
    <div className={`CustomerLayout__dashboard-content ${sidebarMinimized ? 'CustomerLayout__content-minimized' : ''}`}>
      <Outlet/>
    </div>
    
    <CustomerQRModal
      isOpen={isOpenQrModal}
      onClose={() => setIsOpenQrModal(false)}
      userDetails = {users}
    />
  </div>

  );
};