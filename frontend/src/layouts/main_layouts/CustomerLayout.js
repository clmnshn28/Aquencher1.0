import "assets/css/CustomerLayout.css";
import React, {useState, useEffect} from "react";
import {Link, Outlet, useLocation} from 'react-router-dom';

import * as images from 'assets/images';

export const CustomerLayout = () =>{

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
  };

  const handleNotificationClick = (index) => {
    setNotifications(notifications.map((notification, i) => 
      i === index ? { ...notification, isNew: false } : notification
    ));
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

  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);

  const toggleSidebarMobile = () => {
    setSidebarOpenMobile(!sidebarOpenMobile);
  };

  return(
    <div className={`CustomerLayout__dashboard-container ${sidebarMinimized ? 'CustomerLayout__sidebar-minimized' : ''}`}>
      <div className="CustomerLayout__dashboard-header">
        <img className="CustomerLayout__Aquencher-Logo" src={images.loginLogo} alt="Aquencher Logo" />
        <div className="CustomerLayout__admin-profile">
          <div className="CustomerLayout__notif-container">
            <img className="CustomerLayout__Notification" src={images.notificationClose} alt="Notification"  onClick={toggleNotifications}  />
            {notificationsVisible && (
              <div className="CustomerLayout__notifications-view">
                <div className="CustomerLayout__notifications-header">
                  <p className="CustomerLayout__notification-title-header">Notifications</p>
                  <Link to="Notifications" className="CustomerLayout__see-all-button">See all</Link>
                </div>
                <p className="CustomerLayout__notification-earlier-header">Earlier</p>
                {notifications.map((notification, index) => (
                  <div key={index} className={`CustomerLayout__notification-details-header ${notification.isNew ? 'CustomerLayout__new-notification' : ''}`} onClick={() => handleNotificationClick(index)}>
                    <p className="CustomerLayout__notification-subject-header">{notification.subject}</p>
                    <p className="CustomerLayout__notification-description-header">{notification.description}</p>
                    <p className="CustomerLayout__notification-time-header">{notification.time}</p>
                    {notification.isNew && <div className="CustomerLayout__blue-circle"></div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="CustomerLayout__user-profile-container" onClick={toggleDropdown}>
            <img className="CustomerLayout__profile" src={images.defaultAvatar} alt="Profile" />
            <span className="CustomerLayout__name">Beckett</span>
            <img className="CustomerLayout__dropArrow" src={images.dropArrow} alt="drop Arrow" />
            {dropdownVisible && (
                <div  className="CustomerLayout__profile-dropdown">
                  <Link to="Profile" className="CustomerLayout__link">
                    <img className="CustomerLayout__image-dropdown" src={images.defaultAvatar} alt="Account Profile" />
                    <span className="CustomerLayout__profile-name">Beckett</span>
                  </Link>
                  <Link to="Account/Settings/MyProfile" >
                    <img className="CustomerLayout__setting-dropdown" src={images.accountSettingDropdown} alt="Account Settings" />
                    Account Settings
                  </Link>
                  <Link to="/" >
                    <img className="CustomerLayout__logout-dropdown" src={images.logoutDropdown} alt="Logout Logo" />
                    Logout
                  </Link>
                </div>
              )}
          </div>

          <button className="CustomerLayout__hamburger-icon"onClick={toggleSidebarMobile}>
            <img src={images.hamburgerIconClose} alt="Hamburger Menu"/>  
          </button> 
        </div>
      </div>

    <div className={`CustomerLayout__side-bar ${sidebarMinimized ? 'CustomerLayout__minimized' : ''}  ${sidebarOpenMobile ? 'open' : ''}`}>
      <button className="CustomerLayout__sidebar-toggle-button" onClick={toggleSidebar}>
        <img src={sidebarMinimized ? images.sidebarButtonOpen : images.sidebarButton} alt="button" />
      </button>
      <div className="CustomerLayout__cons-logo"></div>
      <button className="CustomerLayout__hamburger-menu" onClick={toggleSidebarMobile}>
        <img src={images.hamburgerIconOpen} alt="Hamburger Menu"/>  
      </button> 
      <ul>
        <Link to="Dashboard" className={`CustomerLayout__link-sidebar ${highlightedTab === 'dashboard'? 'CustomerLayout__highlighted' : ''}`}>
          <li>
            <img className="CustomerLayout__sidebaricon" 
            src={highlightedTab === 'dashboard'? images.dashboardIconOpen :images.dashboardIconClose} 
            alt="Dashboard" />
            <span className="CustomerLayout__sidebar-text">Dashboard</span>
          </li>
        </Link>
        <Link to="Notifications" className={`CustomerLayout__link-sidebar ${highlightedTab === 'notifications'? 'CustomerLayout__highlighted' : ''}`}>
          <li>
            <img className="CustomerLayout__sidebaricon" 
            src={highlightedTab === 'notifications'? images.notificationIconOpen : images.notificationIconClose} 
            alt="Notifications" />
            <span className="CustomerLayout__sidebar-text">Notifications</span>
          </li>
        </Link>
        <Link to="Requests" className={`CustomerLayout__link-sidebar ${highlightedTab === 'requests'? 'CustomerLayout__highlighted' : ''}`}>
          <li>
            <img className="CustomerLayout__sidebaricon" 
            src={highlightedTab === 'requests'? images.deliveryIconOpen :images.deliveryIconClose} 
            alt="Requests" />
            <span className="CustomerLayout__sidebar-text">Requests</span>
          </li>
        </Link>
        <Link to="Transactions" className={`link-sidebar ${highlightedTab === 'transactions'? 'CustomerLayout__highlighted' : ''}`}>
          <li>
            <img className="CustomerLayout__sidebaricon" 
            src={highlightedTab === 'transactions'? images.transactionIconOpen : images.transactionIconClose} 
            alt="Transactions" />
            <span className="CustomerLayout__sidebar-text">Transactions</span>
          </li>
        </Link>
        <Link to="Concerns" className={`CustomerLayout__link-sidebar ${highlightedTab === 'concerns'? 'CustomerLayout__highlighted' : ''}`}>
          <li>
            <img className="CustomerLayout__sidebaricon" 
            src={highlightedTab === 'concerns'? images.concernIconOpen :images.concernIconClose} 
            alt="Concerns" />
            <span className="CustomerLayout__sidebar-text">Concerns</span>
          </li>
        </Link>
        <li className={`CustomerLayout__link-sidebar CustomerLayout__sub-delivery
          ${highlightedTab === 'account'? 'CustomerLayout__highlighted' : highlightedAccountTab}`} 
          onClick={toggleSubSidebarAccount}>
          <img className="CustomerLayout__sidebaricon" 
          src={highlightedTab === 'account'? images.accountIconOpen : images.accountIconClose} 
          alt="Account" />
          <span className="CustomerLayout__sidebar-text">Account</span>
          <img
              className="CustomerLayout__sidebar-dropdown"
              src={subAccountSidebarVisible ? 
              (highlightedTab === 'account' ? images.blueSidebarDropdownClose : images.sidebarDropdownClose) : 
              ( highlightedTab === 'account' ? images.blueSidebarDropdownOpen : images.sidebarDropdownOpen)}
              alt="dropdown"
            />
        </li>
        {subAccountSidebarVisible && (
        <ul>
          <Link to="Account/Settings/MyProfile" className='CustomerLayout__link-sub-sidebar'>
            <li className={`CustomerLayout__sub-sidebar ${highlightedTab === 'account'? 'CustomerLayout__selected' : ''}`}>
              <div className={`CustomerLayout__task-container  ${highlightedTab === 'account'? 'CustomerLayout__sub-highlighted' : ''} `}>
                <img className="CustomerLayout__sub-sidebaricon CustomerLayout__account-settings-icon" 
                src={highlightedTab === 'account'? images.accountSettingIconOpen : images.accountSettingIconClose} 
                alt="Tasks" />
                <span className="CustomerLayout__sidebar-text account-settings-text">Account Settings</span>
              </div>
            </li>
          </Link>
        </ul>
        )}
      </ul>
    </div>
    <div className={`CustomerLayout__dashboard-content ${sidebarMinimized ? 'CustomerLayout__content-minimized' : ''}`}>
      <Outlet/>
    </div>
    
    </div>
  );
};