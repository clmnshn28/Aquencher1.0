import "assets/css/ChangePasswordAdmin.css"

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PasswordRequirements from "components/PasswordRequirements";
import TextField from "components/TextField";

export const ChangePasswordAdmin = () =>{

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
 

  const handleCurrentPasswordChange = (e) =>{
    setCurrentPassword(e.target.value);
  };

  const handleConfirmNewPasswordChange = (e) =>{
    setConfirmNewPassword(e.target.value);
    setError('');
  };

  const handleNewPasswordChange = (e) =>{
    setNewPassword(e.target.value);
    setError('');
  };


  // checking if password match and met the requirement
  const changePasswordSubmit = (e) => {
    e.preventDefault();
    
    if (!isPasswordRequirementMet('Be 8-100 characters long') ||
      !isPasswordRequirementMet('Contain at least one uppercase and one lowercase letter') ||
      !isPasswordRequirementMet('Contain at least one number or special character')) {
      setError('Password does not meet the requirements');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError('Passwords do not match');
      return; 
    }

    // Proceed with form submission
    setError(''); 

    console.log('Form submitted');
  };

  // checking requirement in password
  const isPasswordRequirementMet = (requirement) => {
    switch (requirement) {
      case 'Be 8-100 characters long':
        return newPassword.length >= 8 && newPassword.length <= 100;
      case 'Contain at least one uppercase and one lowercase letter':
        return /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword);
      case 'Contain at least one number or special character':
        return /\d/.test(newPassword) || /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
      default:
        return false;
    }
  };

  return (
    <div >
      <div className="account-settings-container">
        <h1 className="account-settings-header-text">Account Setting</h1>
        <Link to="/Admin/Account/Settings/MyProfile">
          <p className="account-settings-profile-text-change">My Profile</p>
        </Link>
        <Link to="/Admin/Account/Settings/ChangePassword">
          <p className="account-settings-password-text-change">Change Password</p>
        </Link>
      </div>
      <div className="admin-account-edit-container-change">
        <form onSubmit={changePasswordSubmit} className="form-change-container">
          <div className="input-change-container">
            <TextField label="Current Password" id="currentPassword" name="currentPassword" value={currentPassword} onChange={handleCurrentPasswordChange} type="password" isRequired />
            <TextField label="New Password" id="newPassword" name="newPassword" value={newPassword} onChange={handleNewPasswordChange} type="password" isRequired />
            <TextField label="Confirm New Password" id="confirmNewPassword" name="confirmNewPassword" value={confirmNewPassword} onChange={handleConfirmNewPasswordChange} type="password" isRequired />
            {error && <span className="changePass-error">{error}</span>}
          </div>
  
          <div className="change-password-requirements">
            <PasswordRequirements newPassword={newPassword} />
          </div>
          <button className="change-pass-btn" type="submit">Change Password</button>
        </form>
      </div>
    </div>

  );
}
