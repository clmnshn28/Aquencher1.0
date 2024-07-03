import "assets/css/AccountSettingsAdmin.css"
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import defaultAvatar from 'assets/images/default-avatar.jpg';
import editProfile from 'assets/images/edit-profile.png';

export const AccountSettingsAdmin = () =>{

  return (

      <div className="bgaccount-container">
        <div className="account-settings-container">
          <h1 className="account-settings-header-text">Account Setting</h1>
          <Link to="/Admin/Account/Settings/MyProfile">
            <p className="account-settings-profile-text">My Profile</p>
          </Link>
          <Link to="/Admin/Account/Settings/ChangePassword">
            <p className="account-settings-password-text">Change Password</p>
          </Link>
          <Link to="/Admin/Account/Settings/Archive Account">
            <p className="account-settings-archive-text">Archive Account</p>
          </Link>
        </div>

        <div className="admin-account-edit-container">
          <div className="edit-account-container">
            <img className="edit-profile-image" src={defaultAvatar} alt="Profile Picture" />
            <div className="name-username-container">
              <p className="name-admin-account">Celmin Shane Quizon</p>
              <p className="username-admin-account">@clmnshn28</p>
              <button className="button-edit-profile-image">
                Edit
                <img className="edit-profile-button-icon" src={editProfile} alt="Edit Profile Icon" />
              </button>
            </div>
          </div>

          <div className="edit-account-container">
            <div className="personal-info">
              <h3 className="edit-header-info">Personal Information</h3>
              <div className="info-row">
                <div className="info-item">
                  <span className="info-detail-name">Firstname</span>
                  <p className="info-details-editable">Celmin Shane</p>
                </div>
                <div className="info-item">
                  <span className="info-detail-name">Lastname</span>
                  <p className="info-details-editable">Quizon</p>
                </div>
                <div className="info-item">
                  <span className="info-detail-name">Phone</span>
                  <p className="info-details-editable">09123892012</p>
                </div>
              </div>
            </div>
            <button className="button-edit-personal-info">
              Edit
              <img className="edit-profile-button-icon" src={editProfile} alt="Edit Profile Icon" />
            </button>
          </div>
          
          <div className="edit-account-container">
            <div className="address-info">
              <h3 className="edit-header-info">Address</h3>
              <div className="info-row">
                <div className="info-item">
                  <span className="info-detail-name">Home number</span>
                  <p className="info-details-editable">12</p>
                </div>
                <div className="info-item">
                  <span className="info-detail-name">Street Address</span>
                  <p className="info-details-editable">Everlasting St.</p>
                </div>
              </div>
              <div className="info-row">
                <div className="info-item">
                  <span className="info-detail-name">Barangay</span>
                  <p className="info-details-editable">Bulihan</p>
                </div>
                <div className="info-item">
                  <span className="info-detail-name">City</span>
                  <p className="info-details-editable">Malolos</p>
                </div>
              </div>
            </div>
            <button className="button-edit-personal-info">
              Edit
              <img className="edit-profile-button-icon" src={editProfile} alt="Edit Profile Icon" />
            </button>
          </div>

        </div>
      </div>
 
  );
}
