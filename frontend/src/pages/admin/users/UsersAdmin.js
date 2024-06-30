import "assets/css/UsersAdmin.css"
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {NewUserModal,DeactivationModal} from './modals'; 

import loginLogo from 'assets/images/loginLogo.png';
import notificationClose from 'assets/images/notificationClose.png';
import defaultAvatar from 'assets/images/default-avatar.jpg';
import dashboardIconClose from 'assets/images/dashboard.png';
import notificationIconClose from 'assets/images/notification.png';
import usersIconOpen from 'assets/images/users-open.png';
import transactionIconClose from 'assets/images/transactions.png';
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

export const UsersAdmin = () => {

  const [sidebarMinimized, setSidebarMinimized] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [notifications, setNotifications] = useState([
    { subject: 'Request for Customer Account Deactivation', description: 'Karen Joyce Joson has requested the deletion of account.', time: '10 minutes ago', isNew: true },
    { subject: 'Borrow Request', description: 'Karen Joyce Joson requested to borrow 3 gallons of Po\'s Purified Blue Slim Gallon with Faucet Refill (20L/5gal)', time: '12 minutes ago', isNew: true },
    { subject: 'Borrow Request', description: 'John Smith requested to borrow 2 gallons of Po\'s Purified Dispenser Bottle Refill 18.9L', time: '12 minutes ago', isNew: false },
    { subject: 'System Update', description: 'System will be offline temporarily. Update is scheduled for tomorrow at 10:00 AM. Please plan your tasks accordingly.', time: '12 minutes ago', isNew: false },
  ]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const users = [
    { fullName: 'Karen Joyce Joson', username: '@karenjoycrjoson', phone: '09123892012', address: '12 Everlasting St. Bulihan', dateRegistered: 'January 5, 2024', status: 'Active', avatar: defaultAvatar },
    { fullName: 'Celmin Shane Quizon', username: '@clmnshn', phone: '09123098971', address: 'Malolos, Bulacan', dateRegistered: 'January 15, 2024', status: 'Active', avatar: defaultAvatar },
    { fullName: 'Miguel Angelo Barruga', username: '@barrugs', phone: '09123098971', address: 'Malolos, Bulacan', dateRegistered: 'January 15, 2024', status: 'Active', avatar: defaultAvatar },
    { fullName: 'Francis Harvey Soriano', username: '@harvey', phone: '09123098971', address: 'Malolos, Bulacan', dateRegistered: 'January 15, 2024', status: 'Active', avatar: defaultAvatar },
  ];
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [searchNotFound, setSearchNotFound] = useState(false);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  const [isDeactivationModalOpen, setIsDeactivationModalOpen] = useState(false); 

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


  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedUsers(users.map((_, index) => index));
    } else {
      setSelectedUsers([]);
    }
  };
  
  const handleCheckboxChange = (index) => {
    if (selectedUsers.includes(index)) {
      setSelectedUsers(selectedUsers.filter((i) => i !== index));
    } else {
      setSelectedUsers([...selectedUsers, index]);
    }
  };

  //filtering search
  const handleSearchClick = () => {
    setFilteredUsers(users.filter((user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) 
    ));
    
  };

  const handleAddUser = (newUser) => {
    setFilteredUsers([...filteredUsers, { ...newUser }]);
  };

  const handleUserDotsClick = (index) => {
    setActiveDropdownIndex(activeDropdownIndex === index ? null : index);
  };

    // Function to handle deactivation modal open
    const handleDeactivateUser = (index) => {
      setActiveDropdownIndex(null); // Close dropdown when opening modal
      setIsDeactivationModalOpen(true);
    };
  
    // Function to confirm deactivation
    const confirmDeactivation = () => {
      // Perform deactivation logic here (e.g., update user status to 'Inactive', etc.)
      console.log('User deactivated'); // Placeholder logic
      setIsDeactivationModalOpen(false); // Close modal after deactivation
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
            <Link to="/Admin/Notifications" className="see-all-button">See all</Link>
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
              <Link to="/Admin/Profile" className="link">
                <img className="image-dropdown" src={defaultAvatar} alt="Account Profile" />
                <span className="profile-name">Celmin Shane</span>
              </Link>
              <Link to="/Admin/Account/Settings/MyProfile" >
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
        <Link to="/Admin/Dashboard" className='link-sidebar'>
          <li>
            <img className="sidebaricon" src={dashboardIconClose} alt="Dashboard" />
            <span className="sidebar-text">Dashboard</span>
          </li>
        </Link>
        <Link to="/Admin/Notifications" className='link-sidebar'>
          <li>
            <img className="sidebaricon" src={notificationIconClose} alt="Notifications" />
            <span className="sidebar-text">Notifications</span>
          </li>
        </Link>
        <Link to="/Admin/Users" className='link-sidebar highlighted'>
          <li>
            <img className="sidebaricon" src={usersIconOpen} alt="Users" />
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
            <Link to="/Admin/Delivery/Task">
            <li  className='delivery-sub-sidebar'>
              <div className="task-container ">
                <img className="sub-sidebaricon" src={deliveryTaskClose} alt="Tasks" />
                <span className="sidebar-text">Tasks</span>
              </div>
            </li>
            </Link>
            <Link to="/Admin/Delivery/Queue">
            <li className='delivery-sub-sidebar'>
              <div className="task-container">
                <img className="sub-sidebaricon" src={deliveryRequestClose} alt="Requests" />
                <span className="sidebar-text">Requests</span>
                </div>
            </li>
            </Link>
          </ul>
        )}
        <Link to="/Admin/Transactions" className='link-sidebar'>
          <li>
            <img className="sidebaricon" src={transactionIconClose} alt="Transactions" />
            <span className="sidebar-text">Transactions</span>
          </li>
        </Link>
        <Link to="/Admin/Inventory" className='link-sidebar'>
          <li>
            <img className="sidebaricon" src={inventoryIconClose} alt="Inventory" />
            <span className="sidebar-text">Inventory</span>
          </li>
        </Link>
        <Link to="/Admin/Announcements" className='link-sidebar'>
          <li>
            <img className="sidebaricon" src={announcementsIconClose} alt="Announcements" />
            <span className="sidebar-text">Announcements</span>
          </li>
        </Link>
        <Link to="/Admin/Concerns" className='link-sidebar'>
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
          <Link to="/Admin/Account/Settings/MyProfile" className='link-sub-sidebar'>
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
        <div className="users-header">
          <h2 className="users-header-text">Users</h2>
          <p className="customer-name-text">Customers</p>
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
          <button className="new-user-button" onClick={() => setIsNewUserModalOpen(true)}>+ New User</button>
        </div>
        <div className="users-table-container">
        <table className="users-table">
              <thead className="users-table-header">
                <tr>
                  <th>
                    <input
                      className="custom-checkbox"
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Full Name</th>
                  <th>Username</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Date Registered</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center' }}>
                      No users found.
                    </td>
                  </tr>
                ) :
                 (filteredUsers.map((user, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        className="custom-checkbox"
                        type="checkbox"
                         checked={selectedUsers.includes(index)}
                        onChange={() => handleCheckboxChange(index)}
                      />
                      {activeDropdownIndex === index && (
                        <div className="user-dropdown">
                          <Link to={`/Admin/Users/Customer/Edit`}>Edit</Link>
                          <Link to={`/Admin/Users/Customer/Edit`}>View Details</Link>
                          <button onClick={() => handleDeactivateUser(index)}>Deactivate</button>
                        </div>
                      )}
                      </td>
                  </tr>
                )))}
              </tbody>
            </table>
        </div>
    
    </div>
     {/* NewUserModal component */}
    <NewUserModal
      isOpen={isNewUserModalOpen}
      onClose={() => setIsNewUserModalOpen(false)}
      onAddUser={handleAddUser}
    />
    {/* DeactivationModal component */}
    <DeactivationModal
        isOpen={isDeactivationModalOpen}
        onClose={() => setIsDeactivationModalOpen(false)}
        onConfirm={confirmDeactivation}
      />
  </div>
  );
};

