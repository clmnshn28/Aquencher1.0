import "assets/css/AccountSettingsAdmin.css"
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import defaultAvatar from 'assets/images/default-avatar.jpg';
import editProfile from 'assets/images/edit-profile.png';
import MainContent from "components/MainContent";
import AccountInfoSection from "components/AccountInfoSection";

export const AccountSettingsAdmin = () =>{

  const personalInfoItems = [
    [
      {label: 'Firstname', value: 'Celmin Shane'},
      {label: 'Lastname', value: 'Quizon'},
      {label: 'Username', value: 'clmnshn28' },
      {label: 'Phone', value: '09675710874'}
    ]
  ];

  const addressInfoItems =[
    [
      { label: 'Home number', value: '12' },
      { label: 'Street Address', value: 'Everlasting St.' },
      { label: 'Barangay', value: 'Bulihan' },
      { label: 'City', value: 'Malolos' }
    ]
  ];

  return (

      <MainContent>
        <div className="account-settings-container">
          <h1 className="account-settings-header-text">Account Setting</h1>
          <Link to="/Admin/Account/Settings/MyProfile">
            <p className="account-settings-profile-text">My Profile</p>
          </Link>
          <Link to="/Admin/Account/Settings/ChangePassword">
            <p className="account-settings-password-text">Change Password</p>
          </Link>
        </div>

        <div className="admin-account-edit-container">
          <div className="edit-account-container">
            <img className="edit-profile-image" src={defaultAvatar} alt="Profile Picture" />
            <div className="name-username-container">
              <p className="name-admin-account">
                {personalInfoItems[0].find(item => item.label === 'Firstname').value} {personalInfoItems[0].find(item => item.label === 'Lastname').value}
              </p>
              <p className="username-admin-account">
                @{personalInfoItems[0].find(item => item.label === 'Username').value}
              </p>
              <button className="button-edit-profile-image">
                Edit
                <img className="edit-profile-button-icon" src={editProfile} alt="Edit Profile Icon" />
              </button>
            </div>
          </div>
          <AccountInfoSection title="Personal Information" infoItems={personalInfoItems} />
          <AccountInfoSection title="Address" infoItems={addressInfoItems} />
        </div>
      </MainContent>
 
  );
}
