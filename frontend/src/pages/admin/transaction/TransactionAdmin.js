import "assets/css/TransactionAdmin.css"
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import loginLogo from 'assets/images/loginLogo.png';
import notificationClose from 'assets/images/notificationClose.png';
import defaultAvatar from 'assets/images/default-avatar.jpg';
import dashboardIconClose from 'assets/images/dashboard.png';
import notificationIconClose from 'assets/images/notification.png';
import usersIconClose from 'assets/images/users.png';
import transactionIconOpen from 'assets/images/transactions-open.png';
import inventoryIconClose from 'assets/images/inventory.png';
import announcementsIconClose from 'assets/images/announcement.png';
import concernsIconClose from 'assets/images/concerns.png';

import adminLogo from 'assets/images/AdminLogo.png';
import sidebarButton from 'assets/images/sidebar-button.png';
import sidebarButtonOpen from 'assets/images/sidebar-button-open.png';

import dropArrow from 'assets/images/dropArrow.png';
import logoutDropdown from 'assets/images/logout-dropdown.png';
import accountSettingDropdown from 'assets/images/account-dropdown.png';
import searchIcon from 'assets/images/search-icon.png';
import filterIcon from 'assets/images/filter-icon.png';
import searchBlackIcon from 'assets/images/black-search-icon.png';

import deliveryIcon from 'assets/images/delivery.png';
import sidebarDropdownClose from 'assets/images/close-sub-sidebar.png';
import sidebarDropdownOpen from 'assets/images/open-sub-sidebar.png';
import deliveryTaskClose from 'assets/images/task.png'; 
import deliveryRequestClose from 'assets/images/concerns.png';
import accountIcon from 'assets/images/account.png';
import accountSettingIconClose from 'assets/images/settings.png';

export const TransactionAdmin = () => {

  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [notifications, setNotifications] = useState([
    { subject: 'Request for Customer Account Deactivation', description: 'Karen Joyce Joson has requested the deletion of account.', time: '10 minutes ago', isNew: true },
    { subject: 'Borrow Request', description: 'Karen Joyce Joson requested to borrow 3 gallons of Po\'s Purified Blue Slim Gallon with Faucet Refill (20L/5gal)', time: '12 minutes ago', isNew: true },
    { subject: 'Borrow Request', description: 'John Smith requested to borrow 2 gallons of Po\'s Purified Dispenser Bottle Refill 18.9L', time: '12 minutes ago', isNew: false },
    { subject: 'System Update', description: 'System will be offline temporarily. Update is scheduled for tomorrow at 10:00 AM. Please plan your tasks accordingly.', time: '12 minutes ago', isNew: false },
  ]);
  const [searchQuery, setSearchQuery] = useState("");

  const transactionLogs = [
    { avatar: defaultAvatar, fullName: 'Karen Joyce Joson', transactionType: 'Sale', gallonType: 'Purified Blue Slim Gallon', quantity: '3 gallons', status: 'Complete', date: '2024-01-05', time: '10:30 AM'  },
    { avatar: defaultAvatar, fullName: 'Celmin Shane Quizon', transactionType: 'Purchase', gallonType: 'Dispenser Bottle Refill', quantity: '2 gallons', status: 'Pending', date: '2024-01-15', time: '11:45 AM' },
    { avatar: defaultAvatar, fullName: 'Miguel Angelo Barruga', transactionType: 'Sale', gallonType: 'Purified Blue Slim Gallon', quantity: '1 gallon', status: 'Complete', date: '2024-01-15', time: '02:20 PM' },
    { avatar: defaultAvatar, fullName: 'Francis Harvey Soriano', transactionType: 'Purchase', gallonType: 'Purified Blue Slim Gallon', quantity: '5 gallons', status: 'Queue', date: '2024-01-20', time: '09:00 AM' },
  ];

  const [filteredUsers, setFilteredUsers] = useState(transactionLogs);
  const [searchNotFound, setSearchNotFound] = useState(false);

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


  //filtering search
  const handleSearchClick = () => {
    setFilteredUsers(transactionLogs.filter((log) =>
      log.fullName.toLowerCase().includes(searchQuery.toLowerCase()) 
    ));
   
  };

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
            <Link to="/notifications" className="see-all-button">See all</Link>
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
              <Link to="/Profile" className="link">
                <img className="image-dropdown" src={defaultAvatar} alt="Account Profile" />
                <span className="profile-name">Celmin Shane</span>
              </Link>
              <Link to="/Settings" >
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
        <Link to="/Dashboard" className='link-sidebar'>
          <li>
            <img className="sidebaricon" src={dashboardIconClose} alt="Dashboard" />
            <span className="sidebar-text">Dashboard</span>
          </li>
        </Link>
        <Link to="/Notifications" className='link-sidebar'>
          <li>
            <img className="sidebaricon" src={notificationIconClose} alt="Notifications" />
            <span className="sidebar-text">Notifications</span>
          </li>
        </Link>
        <Link to="/Users" className='link-sidebar '>
          <li>
            <img className="sidebaricon" src={usersIconClose} alt="Users" />
            <span className="sidebar-text">Users</span>
          </li>
        </Link>
        <li className={`link-sidebar sub-delivery ${highlightedDeliveryTab}`} 
            onClick={toggleSubSidebarDelivery}>
            <img className="sidebaricon" src={deliveryIcon} alt="Delivery" />
            <span className="sidebar-text">Delivery</span>
            <img
              className="sidebar-dropdown"
              src={subDeliverySidebarVisible ? sidebarDropdownClose : sidebarDropdownOpen}
              alt="dropdown"
            />
        </li>
        {subDeliverySidebarVisible && (
          <ul className="sub-sidebar">
            <Link to="/Delivery/Task">
            <li  className='delivery-sub-sidebar'>
              <div className="task-container ">
                <img className="sub-sidebaricon" src={deliveryTaskClose} alt="Tasks" />
                <span className="sidebar-text">Tasks</span>
              </div>
            </li>
            </Link>
            <Link to="/Delivery/Queue">
            <li className='delivery-sub-sidebar'>
              <div className="task-container">
                <img className="sub-sidebaricon" src={deliveryRequestClose} alt="Requests" />
                <span className="sidebar-text">Requests</span>
                </div>
            </li>
            </Link>
          </ul>
        )}
        <Link to="/Transactions" className='link-sidebar highlighted'>
          <li>
            <img className="sidebaricon" src={transactionIconOpen} alt="Transactions" />
            <span className="sidebar-text">Transactions</span>
          </li>
        </Link>
        <Link to="/Inventory" className='link-sidebar'>
          <li>
            <img className="sidebaricon" src={inventoryIconClose} alt="Inventory" />
            <span className="sidebar-text">Inventory</span>
          </li>
        </Link>
        <Link to="/Announcements" className='link-sidebar'>
          <li>
            <img className="sidebaricon" src={announcementsIconClose} alt="Announcements" />
            <span className="sidebar-text">Announcements</span>
          </li>
        </Link>
        <Link to="/Concerns" className='link-sidebar'>
          <li>
            <img className="sidebaricon" src={concernsIconClose} alt="Concerns" />
            <span className="sidebar-text">Concerns</span>
          </li>
        </Link>
        <li className={`link-sidebar sub-delivery ${highlightedAccountTab}`} 
            onClick={toggleSubSidebarAccount}>
          <img className="sidebaricon" src={accountIcon} alt="Account" />
          <span className="sidebar-text">Account</span>
          <img
              className="sidebar-dropdown"
              src={subAccountSidebarVisible ? sidebarDropdownClose : sidebarDropdownOpen}
              alt="dropdown"
            />
        </li>
        {subAccountSidebarVisible && (
        <ul>
          <Link to="/Account/Settings/MyProfile" className='link-sub-sidebar'>
            <li className='sub-sidebar selected'>
              <div className="task-container ">
                <img className="sub-sidebaricon account-settings-icon" src={accountSettingIconClose} alt="Tasks" />
                <span className="sidebar-text account-settings-text">Account Settings</span>
              </div>
            </li>
          </Link>
        </ul>
        )}
      </ul>
    </div>
    <div className={`dashboard-content ${sidebarMinimized ? 'content-minimized' : ''}`}>
      <div className="transactions-header">
        <h2 className="transactions-header-text">Transactions</h2>
      </div>
      <div className="user-controls">
        <div className="search-bar-container">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
            <img src={searchBlackIcon} alt="Search" />
          </div>
          <button className="search-button" onClick={handleSearchClick}>
            <img src={searchIcon} alt="Search Icon" />
          </button>
          <button className="filter-button">
            <img src={filterIcon} alt="Filter" />
          </button>
        </div>
      </div>
      <div className="users-table-container">
        <table className="transactions-table">
          <thead className="transactions-table-header">
            <tr>
              <th>Customer Name</th>
              <th>Transaction Type</th>
              <th>Gallon Type</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Date/Time</th>
            </tr>
          </thead>
          <tbody>
          {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>
                  No transaction found.
                </td>
              </tr>
            ) :
              ( filteredUsers.map((log, index) => (
                <tr key={index}>
                  <td className="customer-name">
                    <div className="transaction-info">
                      <img className="user-avatar" src={log.avatar} alt={`${log.fullName}'s avatar`} />
                      {log.fullName}
                    </div>
                  </td>
                  <td>{log.transactionType}</td>
                  <td>{log.gallonType}</td>
                  <td>{log.quantity}</td>
                  <td>{log.status}</td>
                  <td className='transaction-date-time'>
                    <div>{log.date}</div>
                    <div>{log.time}</div>
                  </td>
                </tr>
              )))}
          </tbody>
        </table>
      </div>
    </div>

  </div>
  );
};