import 'assets/css/DeliveryTaskAdmin.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import loginLogo from 'assets/images/loginLogo.png';
import notificationClose from 'assets/images/notificationClose.png';
import defaultAvatar from 'assets/images/default-avatar.jpg';
import dashboardIconClose from 'assets/images/dashboard.png';
import notificationIconClose from 'assets/images/notification.png';
import usersIconClose from 'assets/images/users.png';
import deliveryIconOpen from 'assets/images/delivery-open.png';
import transactionIconClose from 'assets/images/transactions.png';
import inventoryIconClose from 'assets/images/inventory.png';
import announcementsIconClose from 'assets/images/announcement.png';
import concernsIconClose from 'assets/images/concerns.png';
import accountIconClose from 'assets/images/account.png';
import adminLogo from 'assets/images/AdminLogo.png';
import sidebarButton from 'assets/images/sidebar-button.png';
import sidebarButtonOpen from 'assets/images/sidebar-button-open.png';

import dropArrow from 'assets/images/dropArrow.png';
import logoutDropdown from 'assets/images/logout-dropdown.png';
import accountSettingDropdown from 'assets/images/account-dropdown.png';
import blueSidebarDropdownClose from 'assets/images/selected-close-sub.png';
import blueSidebarDropdownOpen from 'assets/images/selected-open-sub.png';
import deliveryTaskOpen from 'assets/images/task-open.png'; 
import deliveryRequestClose from 'assets/images/concerns.png';


export const DeliveryTaskAdmin = () =>{

  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [notifications, setNotifications] = useState([
    { subject: 'Request for Customer Account Deactivation', description: 'Karen Joyce Joson has requested the deletion of account.', time: '10 minutes ago', isNew: true },
    { subject: 'Borrow Request', description: 'Karen Joyce Joson requested to borrow 3 gallons of Po\'s Purified Blue Slim Gallon with Faucet Refill (20L/5gal)', time: '12 minutes ago', isNew: true },
    { subject: 'Borrow Request', description: 'John Smith requested to borrow 2 gallons of Po\'s Purified Dispenser Bottle Refill 18.9L', time: '12 minutes ago', isNew: false },
    { subject: 'System Update', description: 'System will be offline temporarily. Update is scheduled for tomorrow at 10:00 AM. Please plan your tasks accordingly.', time: '12 minutes ago', isNew: false },
  ]);

  const [tasks, setTasks] = useState([
    { date: '2024-07-02', time: '9:00 AM', customerName: 'Customer Name', transactionType: 'Transaction Type', gallonType: 'Gallon Type', quantity: 'Quantity', status: 'Completed' },
    { date: '2024-07-02', time: '9:00 AM', customerName: 'Customer Name', transactionType: 'Transaction Type', gallonType: 'Gallon Type', quantity: 'Quantity', status: 'Completed' },
    { date: '2024-07-02', time: '9:00 AM', customerName: 'Customer Name', transactionType: 'Transaction Type', gallonType: 'Gallon Type', quantity: 'Quantity', status: 'Completed' },
    { date: '2024-07-02', time: '9:00 AM', customerName: 'Customer Name', transactionType: 'Transaction Type', gallonType: 'Gallon Type', quantity: 'Quantity', status: 'Completed' },
    { date: '2024-07-02', time: '9:00 AM', customerName: 'Customer Name', transactionType: 'Transaction Type', gallonType: 'Gallon Type', quantity: 'Quantity', status: 'Complete' },
    { date: '2024-07-02', time: '9:00 AM', customerName: 'Customer Name', transactionType: 'Transaction Type', gallonType: 'Gallon Type', quantity: 'Quantity', status: 'Complete' },
    { date: '2024-07-02', time: '9:00 AM', customerName: 'Customer Name', transactionType: 'Transaction Type', gallonType: 'Gallon Type', quantity: 'Quantity', status: 'Complete' },
    { date: '2024-07-02', time: '9:00 AM', customerName: 'Customer Name', transactionType: 'Transaction Type', gallonType: 'Gallon Type', quantity: 'Quantity', status: 'Complete' },
]);

const [subDeliverySidebarVisible, setSubDeliverySidebarVisible] = useState(true);
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
            <Link to="/Notifications" className="see-all-button">See all</Link>
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
        <Link to="/Users" className='link-sidebar'>
          <li>
            <img className="sidebaricon" src={usersIconClose} alt="Users" />
            <span className="sidebar-text">Users</span>
          </li>
        </Link>
        <li  className='link-sidebar highlighted sub-delivery' onClick={toggleSubSidebarDelivery}>
          <img className="sidebaricon" src={deliveryIconOpen} alt="Delivery" />
          <span className="sidebar-text">Delivery</span>
          <img
              className="sidebar-dropdown"
              src={subDeliverySidebarVisible ? blueSidebarDropdownOpen : blueSidebarDropdownClose}
              alt="dropdown"
            />
        </li>
        {subDeliverySidebarVisible && (
          <ul>
            <Link to="/Delivery/Task" className='link-sub-sidebar'>
              <li className='sub-sidebar'>
                <div className="task-container sub-highlighted">
                  <img className="sub-sidebaricon" src={deliveryTaskOpen} alt="Tasks" />
                  <span className="sidebar-text">Tasks</span>
                </div>
              </li>
            </Link>
            <Link to="/Delivery/Requests" className='link-sub-sidebar'>
              <li className='sub-sidebar'>
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
        <Link to="/Concerns" className='link-sidebar'>
          <li>
            <img className="sidebaricon" src={concernsIconClose} alt="Concerns" />
            <span className="sidebar-text">Concerns</span>
          </li>
        </Link>
        <Link to="/Account/Settings/MyProfile" className='link-sidebar'>
          <li>
            <img className="sidebaricon" src={accountIconClose} alt="Account" />
            <span className="sidebar-text">Account</span>
          </li>
        </Link>
      </ul>
    </div>
    <div className={`dashboard-content ${sidebarMinimized ? 'content-minimized' : ''}`}>
      <div className="delivery-header">
        <h2 className="delivery-header-text">Task</h2>
        <Link to="/Delivery/Task"  className='delivery-queue-link'>
          <p className="delivery-queue-text">Delivery Queue</p>
        </Link>
        <Link to="/Delivery/Requests"  className='delivery-request-link'>
        <p className="delivery-request-text">Requests</p>
        </Link>
      </div>
      <div className="queue-container">
        <table className="queue-table">
          <thead className="queue-table-header">
            <tr>
              <th>Date/Time</th>
              <th>Customer Name</th>
              <th>Transaction Type</th>
              <th>Gallon Type</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index}>
                <td className='queue-date-time'>
                  <div>{task.time}</div>
                  <div>{task.date}</div>
                </td>
                <td>{task.customerName}</td>
                <td>{task.transactionType}</td>
                <td>{task.gallonType}</td>
                <td>{task.quantity}</td>
                <td>
                  <div className={task.status === 'Completed' ? 'status-completed' : 'status-complete'}>
                    {task.status}
                  </div> 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  </div>
  );
}