import "assets/css/ConcernsAdmin.css"
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import loginLogo from 'assets/images/loginLogo.png';
import notificationClose from 'assets/images/notificationClose.png';
import defaultAvatar from 'assets/images/default-avatar.jpg';
import dashboardIconClose from 'assets/images/dashboard.png';
import notificationIconClose from 'assets/images/notification.png';
import usersIconClose from 'assets/images/users.png';
import transactionIconClose from 'assets/images/transactions.png';
import inventoryIconClose from 'assets/images/inventory.png';
import announcementsIconClose from 'assets/images/announcement.png';
import concernIconOpen from 'assets/images/concerns-open.png';
import concernFilterOpen from 'assets/images/concern-filter-open.png';
import concernFilterClose from 'assets/images/concern-filter-close.png';
import adminLogo from 'assets/images/AdminLogo.png';
import sidebarButton from 'assets/images/sidebar-button.png';
import sidebarButtonOpen from 'assets/images/sidebar-button-open.png';

import dropArrow from 'assets/images/dropArrow.png';
import logoutDropdown from 'assets/images/logout-dropdown.png';
import accountSettingDropdown from 'assets/images/account-dropdown.png';

import deliveryIcon from 'assets/images/delivery.png';
import sidebarDropdownClose from 'assets/images/close-sub-sidebar.png';
import sidebarDropdownOpen from 'assets/images/open-sub-sidebar.png';
import deliveryTaskClose from 'assets/images/task.png'; 
import deliveryRequestClose from 'assets/images/concerns.png';
import accountIcon from 'assets/images/account.png';
import accountSettingIconClose from 'assets/images/settings.png';

export const ConcernsAdmin = () =>{
  
  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [notifications, setNotifications] = useState([
    { subject: 'Request for Customer Account Deactivation', description: 'Karen Joyce Joson has requested the deletion of account.', time: '10 minutes ago', isNew: true },
    { subject: 'Borrow Request', description: 'Karen Joyce Joson requested to borrow 3 gallons of Po\'s Purified Blue Slim Gallon with Faucet Refill (20L/5gal)', time: '12 minutes ago', isNew: true },
    { subject: 'Borrow Request', description: 'John Smith requested to borrow 2 gallons of Po\'s Purified Dispenser Bottle Refill 18.9L', time: '12 minutes ago', isNew: false },
    { subject: 'System Update', description: 'System will be offline temporarily. Update is scheduled for tomorrow at 10:00 AM. Please plan your tasks accordingly.', time: '12 minutes ago', isNew: false },
  ]);
  const [concerns, setConcerns] = useState([
    { name: 'Karen Joyce Joson', message: 'Good day! Your service in refilling our gallons is excellent. The response to our requests is quick and efficient. Thank you for your excellent service!', time: '1 day ago' },
    { name: 'Celmin Shane', message: 'The system is user-friendly and efficient. No major issues encountered. Keep up the good work!', time: '1 day ago' },
    { name: 'Hong Hae In', message: 'Good day! Your service in refilling our gallons is excellent. The response to our requests is quick and efficient. Thank you for your excellent service!', time: '1 day ago' },
    { name: 'Baek Hyun Woo', message: 'Good day! Your service in refilling our gallons is excellent. The response to our requests is quick and efficient. Thank you for your excellent service!', time: '1 day ago' },
    { name: 'Im Sol', message: 'Good day! Your service in refilling our gallons is excellent. The response to our requests is quick and efficient. Thank you for your excellent service!', time: '1 day ago' },
    { name: 'Ryu Sun Jae', message: 'Good day! Your service in refilling our gallons is excellent. The response to our requests is quick and efficient. Thank you for your excellent service!', time: '1 day ago' }
  ]);
  const [concernDropdownVisible, setConcernDropdownVisible] = useState(false);
  const [concernSelectedFilter, setConcernSelectedFilter] = useState('All');
  const [concernFilterIconOpen, setConcernFilterIconOpen] = useState(false); 

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

// filter concern
  const toggleFilterDropdown = () => {
    setConcernDropdownVisible(!concernDropdownVisible);
    setConcernFilterIconOpen(!concernFilterIconOpen);
  };

  const handleFilterSelect = (filter) => {
    setConcernSelectedFilter(filter);
    setConcernDropdownVisible(false);
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
          <Link to="/Transactions" className='link-sidebar'>
            <li>
              <img className="sidebaricon" src={transactionIconClose} alt="Transactions" />
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
          <Link to="/Concerns" className='link-sidebar highlighted'>
            <li>
              <img className="sidebaricon" src={concernIconOpen} alt="Concerns" />
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
        <div className="concerns-container">
          <div className="concerns-header">
            <h2 className="concerns-header-text">Concerns</h2>
            <div className="concerns-filter-dropdown" onClick={toggleFilterDropdown}>
              <span className="final-concern-filter">{concernSelectedFilter}</span>
              <img
                className={`concern-filter-open ${concernFilterIconOpen ? 'open' : ''}`} // Apply different class for open state
                src={`${concernFilterIconOpen ? concernFilterClose : concernFilterOpen}`}
                alt="Dropdown Arrow"
              />
              {concernDropdownVisible && (
                <div className="filter-options">
                  {['All', 'New'].map(filter => (
                    <div 
                    className={`selected-concern-list ${concernSelectedFilter === filter ? 'selected-concern' : ''}`}
                    key={filter} 
                    onClick={() => handleFilterSelect(filter)}
                    >{filter}</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="concerns-list">
            {concerns.map((concern, index) => (
              <div key={index} className="concern-item">
                <img className="concern-avatar" src={defaultAvatar} alt="" />
                <div className="concern-details">
                  <p className="concern-name">{concern.name}</p>
                  <p className="concern-message">{concern.message}</p>
                  <p className="concern-time">{concern.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}