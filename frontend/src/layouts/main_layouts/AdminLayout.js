import "assets/css/admin";
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation  } from 'react-router-dom';
import { useAuth } from "context/AuthContext";
import * as images from 'assets/images';

export const AdminLayout = () => {

  const { signOut } = useAuth(); 

  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [notifications, setNotifications] = useState([
    { subject: 'Request for Customer Account Deactivation', description: 'Karen Joyce Joson has requested the deletion of account.', time: '10 minutes ago', isNew: true },
    { subject: 'Borrow Request', description: 'Karen Joyce Joson requested to borrow 3 gallons of Po\'s Purified Blue Slim Gallon with Faucet Refill (20L/5gal)', time: '12 minutes ago', isNew: true },
    { subject: 'Borrow Request', description: 'John Smith requested to borrow 2 gallons of Po\'s Purified Dispenser Bottle Refill 18.9L', time: '12 minutes ago', isNew: false },
    { subject: 'System Update', description: 'System will be offline temporarily. Update is scheduled for tomorrow at 10:00 AM. Please plan your tasks accordingly.', time: '12 minutes ago', isNew: false },
  ]);
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

  const handleNotificationClick = (index) => {
    setNotifications(notifications.map((notification, i) => 
      i === index ? { ...notification, isNew: false } : notification
    ));
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

  useEffect(() => {
    const currentPath = location.pathname;

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
    } else if (currentPath.includes('account')) {
      setHighlightedTab('account');
    }
  }, [location]);

  return (

  <div className={`dashboard-container ${sidebarMinimized ? 'sidebar-minimized' : ''}`}>
    <div className="dashboard-header">
      <img className="Aquencher-Logo" src={images.loginLogo} alt="Aquencher Logo" />
      <div className="admin-profile">
        <div className="notif-container">
          <img className="Notification" src={images.notificationClose} alt="Notification"  onClick={toggleNotifications}  />
          {notificationsVisible && (
          <div className="notifications-view">
            <div className="notifications-header">
              <p className="notification-title-header">Notifications</p>
              <Link to="notifications" className="see-all-button"  onClick={handleSeeAllClick}>See all</Link>
            </div>
            <p className="notification-earlier-header">Earlier</p>
            {notifications.map((notification, index) => (
              <div key={index} className="notification-border-bottom">
                <div className={`notification-details-header ${notification.isNew ? 'new-notification' : ''}`} onClick={() => handleNotificationClick(index)}>
                  <p className="notification-subject-header">{notification.subject}</p>
                  <p className="notification-description-header">{notification.description}</p>
                  <p className="notification-time-header">{notification.time}</p>
                  {notification.isNew && <div className="blue-circle"></div>}
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
        <div className="user-profile-container" onClick={toggleDropdown}>
          <img className="profile" src={images.defaultAvatar} alt="Profile" />
          <span className="name">Celmin Shane</span>
          <img className="dropArrow" src={images.dropArrow} alt="drop Arrow" />
        </div>
        {dropdownVisible && (
            <div  className="profile-dropdown">
              <Link className="link">
                <img className="image-dropdown" src={images.defaultAvatar} alt="Account Profile" />
                <span className="profile-name">Celmin Shane</span>
              </Link>
              <Link to="account/settings/my-profile" onClick={handleAccountSettingsClick}>
                <img className="setting-dropdown" src={images.accountSettingDropdown} alt="Account Settings" />
                Account Settings
              </Link>
              <Link to="/" onClick={signOut}>
                <img className="logout-dropdown" src={images.logoutDropdown} alt="Logout Logo" />
                Logout
              </Link>
            </div>
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
        <Link to="users" className={`link-sidebar ${highlightedTab === 'users'? 'highlighted' : ''}`}>
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
          ${highlightedTab === 'account'? 'highlighted' : highlightedAccountTab}`} 
          onClick={toggleSubSidebarAccount}>
          <img className="sidebaricon" 
          src={highlightedTab === 'account'? images.accountIconOpen : images.accountIconClose} 
          alt="Account" />
          <span className="sidebar-text">Account</span>
          <img
              className="sidebar-dropdown"
              src={subAccountSidebarVisible ? 
              (highlightedTab === 'account' ? images.blueSidebarDropdownClose : images.sidebarDropdownClose) : 
              ( highlightedTab === 'account' ? images.blueSidebarDropdownOpen : images.sidebarDropdownOpen)}
              alt="dropdown"
            />
        </li>
        {subAccountSidebarVisible && (
        <ul>
          <Link to="account/settings/my-profile" className='link-sub-sidebar'>
            <li className={`sub-sidebar ${highlightedTab === 'account'? 'selected' : ''}`}>
              <div className={`task-container  ${highlightedTab === 'account'? 'sub-highlighted' : ''} `}>
                <img className="sub-sidebaricon account-settings-icon" 
                src={highlightedTab === 'account'? images.accountSettingIconOpen : images.accountSettingIconClose} 
                alt="Tasks" />
                <span className="sidebar-text account-settings-text">Account Settings</span>
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
