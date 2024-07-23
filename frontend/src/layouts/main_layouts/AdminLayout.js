import "assets/css/index.css"
import "assets/css/DashboardAdmin.css"
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation  } from 'react-router-dom';

import loginLogo from 'assets/images/loginLogo.png';
import notificationClose from 'assets/images/notificationClose.png';
import defaultAvatar from 'assets/images/default-avatar.jpg';
import dashboardIconOpen from 'assets/images/dashboard-open.png';
import dashboardIconClose from 'assets/images/dashboard.png';
import notificationIconOpen from 'assets/images/notification-open.png';
import notificationIconClose from 'assets/images/notification.png';
import usersIconOpen from 'assets/images/users-open.png';
import usersIconClose from 'assets/images/users.png';
import deliveryIconOpen from 'assets/images/delivery-open.png';
import deliveryIconClose from 'assets/images/delivery.png';
import deliveryTaskOpen from 'assets/images/task-open.png'; 
import deliveryTaskClose from 'assets/images/task.png'; 
import deliveryRequestClose from 'assets/images/concerns.png'; // can be change
import transactionIconOpen from 'assets/images/transactions-open.png';
import transactionIconClose from 'assets/images/transactions.png';
import inventoryIconOpen from 'assets/images/inventory-open.png';
import inventoryIconClose from 'assets/images/inventory.png';
import announcementIconOpen from 'assets/images/announcement-open.png';
import announcementIconClose from 'assets/images/announcement.png';
import concernIconOpen from 'assets/images/concerns-open.png';
import concernIconClose from 'assets/images/concerns.png';
import accountIconOpen from 'assets/images/account-open.png';
import accountIconClose from 'assets/images/account.png';
import accountSettingIconClose from 'assets/images/settings.png';
import accountSettingIconOpen from 'assets/images/settings-open.png';

import adminLogo from 'assets/images/AdminLogo.png';
import sidebarButton from 'assets/images/sidebar-button.png';
import sidebarButtonOpen from 'assets/images/sidebar-button-open.png';

import dropArrow from 'assets/images/dropArrow.png';
import logoutDropdown from 'assets/images/logout-dropdown.png';
import accountSettingDropdown from 'assets/images/account-dropdown.png';

import sidebarDropdownClose from 'assets/images/close-sub-sidebar.png';
import sidebarDropdownOpen from 'assets/images/open-sub-sidebar.png';
import blueSidebarDropdownClose from 'assets/images/selected-close-sub.png';
import blueSidebarDropdownOpen from 'assets/images/selected-open-sub.png';

export const AdminLayout = () => {

  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [notifications, setNotifications] = useState([
    { subject: 'Request for Customer Account Deactivation', description: 'Karen Joyce Joson has requested the deletion of account.', time: '10 minutes ago', isNew: true },
    { subject: 'Borrow Request', description: 'Karen Joyce Joson requested to borrow 3 gallons of Po\'s Purified Blue Slim Gallon with Faucet Refill (20L/5gal)', time: '12 minutes ago', isNew: true },
    { subject: 'Borrow Request', description: 'John Smith requested to borrow 2 gallons of Po\'s Purified Dispenser Bottle Refill 18.9L', time: '12 minutes ago', isNew: false },
    { subject: 'System Update', description: 'System will be offline temporarily. Update is scheduled for tomorrow at 10:00 AM. Please plan your tasks accordingly.', time: '12 minutes ago', isNew: false },
  ]);
  const [subDeliverySidebarVisible, setSubDeliverySidebarVisible] = useState(false);
  const [highlightedDeliveryTab, setHighlightedDeliveryTab] = useState('');
  const [subAccountSidebarVisible, setSubAccountSidebarVisible] = useState(false);
  const [highlightedAccountTab, setHighlightedAccountTab] = useState('');
  const [lastOpenedDropdown, setLastOpenedDropdown] = useState(null);

  const toggleSidebar = () => {

    setSidebarMinimized(!sidebarMinimized);
 
    if (!sidebarMinimized) {
      // Store the last opened dropdown
      setLastOpenedDropdown(
        subDeliverySidebarVisible ? 'delivery' : subAccountSidebarVisible ? 'account' : null
      );
      // Close all sub sidebars
      setSubDeliverySidebarVisible(false);
      setSubAccountSidebarVisible(false);

    } else {
      // Reopen the last opened dropdown
      if (lastOpenedDropdown === 'delivery') {
        setSubDeliverySidebarVisible(true);
        setHighlightedDeliveryTab('sub-highlighted-delivery');
      } else if (lastOpenedDropdown === 'account') {
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

  const toggleSubSidebarDelivery = () => {
    if (sidebarMinimized) {
      setSidebarMinimized(false);
      setSubDeliverySidebarVisible(true);
      setHighlightedDeliveryTab('sub-highlighted-delivery');
      setSubAccountSidebarVisible(false);
      setHighlightedAccountTab('');
    } else {
      setSubDeliverySidebarVisible(!subDeliverySidebarVisible);
      if (!subDeliverySidebarVisible) {
        setSubAccountSidebarVisible(false);
        setHighlightedAccountTab('');
      }
      setHighlightedDeliveryTab(subDeliverySidebarVisible ? '' : 'sub-highlighted-delivery');
    }
  };

  const toggleSubSidebarAccount = () => {
    if (sidebarMinimized) {
      setSidebarMinimized(false);
      setSubAccountSidebarVisible(true);
      setHighlightedAccountTab('sub-highlighted-delivery');
      setSubDeliverySidebarVisible(false);
      setHighlightedDeliveryTab('');
    } else {
      setSubAccountSidebarVisible(!subAccountSidebarVisible);
      if (!subAccountSidebarVisible) {
        setSubDeliverySidebarVisible(false);
        setHighlightedDeliveryTab('');
      }
      setHighlightedAccountTab(subAccountSidebarVisible ? '' : 'sub-highlighted-delivery');
    }
  };

  const location = useLocation();
  const [highlightedTab, setHighlightedTab] = useState('');

  useEffect(() => {
    const currentPath = location.pathname;

    if (currentPath.includes('Dashboard')) {
      setHighlightedTab('dashboard');
    } else if (currentPath.includes('Notifications')) {
      setHighlightedTab('notifications');
    } else if (currentPath.includes('Users')) {
      setHighlightedTab('users');
    } else if (currentPath.includes('Delivery')) {
      setHighlightedTab('task');
    } else if (currentPath.includes('Transactions')) {
      setHighlightedTab('transactions');
    } else if (currentPath.includes('Inventory')) {
      setHighlightedTab('inventory');
    } else if (currentPath.includes('Announcements')) {
      setHighlightedTab('announcement');
    }else if (currentPath.includes('Concerns')) {
      setHighlightedTab('concerns');
    } else if (currentPath.includes('Account')) {
      setHighlightedTab('account');
    }
  }, [location]);

  return (

  <div className={`dashboard-container ${sidebarMinimized ? 'sidebar-minimized' : ''}`}>
    <div className="dashboard-header">
      <img className="Aquencher-Logo" src={loginLogo} alt="Aquencher Logo" />
      <div className="admin-profile">
        <img className="Notification" src={notificationClose} alt="Notification"  onClick={toggleNotifications}  />
        {notificationsVisible && (
        <div className="notifications-view">
          <div className="notifications-header">
            <p className="notification-title-header">Notifications</p>
            <Link to="Notifications" className="see-all-button">See all</Link>
          </div>
          <p className="notification-earlier-header">Earlier</p>
          {notifications.map((notification, index) => (
            <div key={index} className={`notification-details-header ${notification.isNew ? 'new-notification' : ''}`} onClick={() => handleNotificationClick(index)}>
              <p className="notification-subject-header">{notification.subject}</p>
              <p className="notification-description-header">{notification.description}</p>
              <p className="notification-time-header">{notification.time}</p>
              {notification.isNew && <div className="blue-circle"></div>}
            </div>
          ))}
        </div>
      )}
        <div className="user-profile-container" onClick={toggleDropdown}>
          <img className="profile" src={defaultAvatar} alt="Profile" />
          <span className="name">Celmin Shane</span>
          <img className="dropArrow" src={dropArrow} alt="drop Arrow" />
        </div>
        {dropdownVisible && (
            <div  className="profile-dropdown">
              <Link to="Profile" className="link">
                <img className="image-dropdown" src={defaultAvatar} alt="Account Profile" />
                <span className="profile-name">Celmin Shane</span>
              </Link>
              <Link to="Account/Settings/MyProfile" >
                <img className="setting-dropdown" src={accountSettingDropdown} alt="Account Settings" />
                Account Settings
              </Link>
              <Link to="/" >
                <img className="logout-dropdown" src={logoutDropdown} alt="Logout Logo" />
                Logout
              </Link>
            </div>
          )}
      </div>
    </div>

    <div className={`side-bar ${sidebarMinimized ? 'minimized' : ''}`}>
      <button className="sidebar-toggle-button" onClick={toggleSidebar}>
        <img src={sidebarMinimized ? sidebarButtonOpen : sidebarButton} alt="button" />
      </button>
      <img className="adminlogo" src={adminLogo} alt="AdminLogo" />
      <ul>
        <Link to="Dashboard" className={`link-sidebar ${highlightedTab === 'dashboard'? 'highlighted' : ''}`}>
          <li>
            <img className="sidebaricon" 
            src={highlightedTab === 'dashboard'? dashboardIconOpen :dashboardIconClose} 
            alt="Dashboard" />
            <span className="sidebar-text">Dashboard</span>
          </li>
        </Link>
        <Link to="Notifications" className={`link-sidebar ${highlightedTab === 'notifications'? 'highlighted' : ''}`}>
          <li>
            <img className="sidebaricon" 
            src={highlightedTab === 'notifications'? notificationIconOpen : notificationIconClose} 
            alt="Notifications" />
            <span className="sidebar-text">Notifications</span>
          </li>
        </Link>
        <Link to="Users" className={`link-sidebar ${highlightedTab === 'users'? 'highlighted' : ''}`}>
          <li>
            <img className="sidebaricon" 
            src={highlightedTab === 'users'? usersIconOpen : usersIconClose} 
            alt="Users" />
            <span className="sidebar-text">Users</span>
          </li>
        </Link>
        <li className={`link-sidebar sub-delivery 
          ${highlightedTab === 'task' || highlightedTab === 'delivery'? 'highlighted' : highlightedDeliveryTab}`} 
          onClick={toggleSubSidebarDelivery}>
          <img className="sidebaricon" 
          src={highlightedTab === 'task' || highlightedTab === 'delivery'? deliveryIconOpen :deliveryIconClose} 
          alt="Delivery" />
          <span className="sidebar-text">Requests</span>
          <img
            className="sidebar-dropdown"
            src={subDeliverySidebarVisible ? 
              (highlightedTab === 'task' || highlightedTab === 'delivery' ? blueSidebarDropdownClose : sidebarDropdownClose) : 
              (highlightedTab === 'task' || highlightedTab === 'delivery' ? blueSidebarDropdownOpen : sidebarDropdownOpen)}
            alt="dropdown"
          />
        </li>
        {subDeliverySidebarVisible && (
          <ul>
            <Link to="Delivery/Task">
            <li className={`sub-sidebar ${highlightedTab === 'task'? 'selected' : ''}`}  >
              <div className={`task-container ${highlightedTab === 'task'? 'sub-highlighted' : ''} `}>
                <img className="sub-sidebaricon" 
                src={highlightedTab === 'task'? deliveryTaskOpen :deliveryTaskClose} 
                alt="Tasks" />
                <span className="sidebar-text">Tasks</span>
              </div>
            </li>
            </Link>
            <Link to="Delivery/Request">
            <li className={`sub-sidebar ${highlightedTab === 'request'? 'selected' : ''}`} >
              <div className={`task-container  ${highlightedTab === 'request'? 'sub-highlighted' : ''} `}>
                <img className="sub-sidebaricon" 
                src={deliveryRequestClose} 
                alt="Requests" />
                <span className="sidebar-text">Requests</span>
                </div>
            </li>
            </Link>
          </ul>
        )}
        <Link to="Transactions" className={`link-sidebar ${highlightedTab === 'transactions'? 'highlighted' : ''}`}>
          <li>
            <img className="sidebaricon" 
            src={highlightedTab === 'transactions'? transactionIconOpen : transactionIconClose} 
            alt="Transactions" />
            <span className="sidebar-text">Transactions</span>
          </li>
        </Link>
        <Link to="Inventory" className={`link-sidebar ${highlightedTab === 'inventory'? 'highlighted' : ''}`}>
          <li>
            <img className="sidebaricon" 
            src={highlightedTab === 'inventory'? inventoryIconOpen :inventoryIconClose} 
            alt="Inventory" />
            <span className="sidebar-text">Inventory</span>
          </li>
        </Link>
        <Link to="Announcements" className={`link-sidebar ${highlightedTab === 'announcement'? 'highlighted' : ''}`}>
          <li>
            <img className="sidebaricon" 
            src={highlightedTab === 'announcement'? announcementIconOpen :announcementIconClose} 
            alt="Announcements" />
            <span className="sidebar-text">Announcements</span>
          </li>
        </Link>
        <Link to="Concerns" className={`link-sidebar ${highlightedTab === 'concerns'? 'highlighted' : ''}`}>
          <li>
            <img className="sidebaricon" 
            src={highlightedTab === 'concerns'? concernIconOpen :concernIconClose} 
            alt="Concerns" />
            <span className="sidebar-text">Concerns</span>
          </li>
        </Link>
        <li className={`link-sidebar sub-delivery
          ${highlightedTab === 'account'? 'highlighted' : highlightedAccountTab}`} 
          onClick={toggleSubSidebarAccount}>
          <img className="sidebaricon" 
          src={highlightedTab === 'account'? accountIconOpen : accountIconClose} 
          alt="Account" />
          <span className="sidebar-text">Account</span>
          <img
              className="sidebar-dropdown"
              src={subAccountSidebarVisible ? 
              (highlightedTab === 'account' ? blueSidebarDropdownClose : sidebarDropdownClose) : 
              ( highlightedTab === 'account' ? blueSidebarDropdownOpen : sidebarDropdownOpen)}
              alt="dropdown"
            />
        </li>
        {subAccountSidebarVisible && (
        <ul>
          <Link to="Account/Settings/MyProfile" className='link-sub-sidebar'>
            <li className={`sub-sidebar ${highlightedTab === 'account'? 'selected' : ''}`}>
              <div className={`task-container  ${highlightedTab === 'account'? 'sub-highlighted' : ''} `}>
                <img className="sub-sidebaricon account-settings-icon" 
                src={highlightedTab === 'account'? accountSettingIconOpen : accountSettingIconClose} 
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
      <div className="bg-content">
        <Outlet/>
      </div>
    </div>
   
  </div>
  );
};
