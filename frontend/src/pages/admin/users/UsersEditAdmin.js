import "assets/css/UsersEditAdmin.css"
import React, { useState } from 'react';
import {  useNavigate  } from 'react-router-dom';

import defaultAvatar from 'assets/images/default-avatar.jpg';
import backEditButton from 'assets/images/user-edit-back.png';
import resetPassword from 'assets/images/reset-password.png';
import AccountInfoSection from "components/AccountInfoSection";
import PasswordRequirements from "components/PasswordRequirements";
import TextField from "components/TextField";
import ButtonGroup from "components/ButtonGroup";

export const UsersEditAdmin = () =>{
  const navigate = useNavigate();

  const user = {
    firstname: 'Karen Joyce',
    lastname: 'Joson',
    profilePicture: defaultAvatar,
    username: '@karenjoycejoson'
  };

  const personalInfoItems = [
    [
      {label: 'Firstname', value: 'Karen Joyce'},
      {label: 'Lastname', value: 'Joson'},
      {label: 'Username', value: 'karenjoycejoson' },
      {label: 'Phone', value: '09123892012'}
    ]
  ];

  const addressInfoItems =[
    [
      { label: 'Home number', value: '123' },
      { label: 'Street Address', value: 'Sampaguita St.' },
      { label: 'Barangay', value: 'Bulihan' },
      { label: 'City', value: 'Malolos' }
    ]
  ];

  const [showResetPassword , setShowResetPassword] = useState(false);
  const [newPassword , setNewPassword] = useState('');
  const [newConfirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleShowResetPassword = () =>{
    setShowResetPassword(true);
  };

  const handlePasswordChange = (e) =>{
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) =>{
    setConfirmPassword(e.target.value);
  };

  const handleCancel = () =>{
    setShowResetPassword(false);
    setNewPassword(''); 
    setConfirmPassword(''); 
    setError('');
  }

  const handleSubmitResetPassword = (e) =>{

    e.preventDefault();

    if (!isPasswordRequirementMet('Be 8-100 characters long') ||
        !isPasswordRequirementMet('Contain at least one uppercase and one lowercase letter') ||
        !isPasswordRequirementMet('Contain at least one number or special character')) {
      setError('Password does not meet the requirements');
      return;
    }

    if (newPassword !== newConfirmPassword) {
      setError('Passwords do not match');
      return; 
    }

    console.log("Reset Password Submitted!!!");

  }

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
    <div>
      <div className="users-edit-profile-header">
        <img className="user-edit-avatar" src={defaultAvatar} alt="User Avatar" />
        <div className="user-edit-details">
          <h2 className="user-edit-name">
            {personalInfoItems[0].find(item => item.label === 'Firstname').value} {personalInfoItems[0].find(item => item.label === 'Lastname').value}
          </h2>
          <p className="user-edit-username">
            @{personalInfoItems[0].find(item => item.label === 'Username').value}
          </p>
        </div>
        <img className="user-back-btn" src={backEditButton} alt="Back Button" onClick={() => navigate(-1)}/>
      </div>
      
      <div className="user-account-edit-container">
        <AccountInfoSection title="Personal Information" infoItems={personalInfoItems} />
        <AccountInfoSection title="Address" infoItems={addressInfoItems} />

        <div className="edit-user-container password">
          <button className="reset-password-btn" onClick={handleShowResetPassword}>
            <img className="reset-icon" src={resetPassword} alt="reset Icon"/>
            Reset Password
          </button>
          {showResetPassword &&(
            <form className="user-reset-password-form" onSubmit={handleSubmitResetPassword}>
              <div className="input-change-container">
                <TextField label='Password' type="password" value={newPassword} onChange={handlePasswordChange} isRequired/>
                <TextField label="Confirm Password" type="password" value={newConfirmPassword} onChange={handleConfirmPasswordChange} isRequired  error={error}/>
                {error && <span className="editUser-error">{error}</span>}
              </div>
              <div className="reset-password-requirements">
                <PasswordRequirements newPassword={newPassword}/>
              </div>
              <ButtonGroup onCancel={handleCancel} onSave={()=> console.log("Clicked")}/>
            </form>
          )}
        </div>
      </div>
    
    </div>
  );
}
