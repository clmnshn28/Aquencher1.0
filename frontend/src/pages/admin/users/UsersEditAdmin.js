import "assets/css/UsersEditAdmin.css"
import React, { useState } from 'react';
import {  useNavigate  } from 'react-router-dom';

import defaultAvatar from 'assets/images/default-avatar.jpg';
import editProfile from 'assets/images/edit-profile.png';
import backEditButton from 'assets/images/user-edit-back.png';
import resetPassword from 'assets/images/reset-password.png';

export const UsersEditAdmin = () =>{
  const navigate = useNavigate();

  const user = {
    firstname: 'Karen Joyce',
    lastname: 'Joson',
    phone: '09123892012',
    address: {
      homeNumber: '123',
      streetAddress: 'Sampaguita St.',
      barangay: 'Bulihan',
      city: 'Malolos',
      province: 'Bulacan',
      postalCode: '2011'
    },
    profilePicture: defaultAvatar,
    username: '@karenjoycejoson'
  };

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
  
  const getRequirementIcon = (requirement) => {
    return isPasswordRequirementMet(requirement) ? <span className='check'>&#10004;</span> : <span className='wrong'>&#10005;</span>;
  };

  return (
    <div className="bgEditUser-container">
      <div className="users-edit-profile-header">
        <img className="user-edit-avatar" src={user.profilePicture} alt="User Avatar" />
        <div className="user-edit-details">
          <h2 className="user-edit-name">{user.firstname} {user.lastname}</h2>
          <p className="user-edit-username">{user.username}</p>
        </div>
        <img className="user-back-btn" src={backEditButton} alt="Back Button" onClick={() => navigate(-1)}/>
      </div>
      
      <div className="user-account-edit-container">
        <div className="edit-user-container">
          <div className="user-personal-info">
            <h3 className="user-edit-header-info">Personal Information</h3>
            <div className="user-info-row">
              <div className="user-info-item">
                <span className="user-info-detail-name">Firstname</span>
                <p className="user-info-details-editable">{user.firstname}</p>
              </div>
              <div className="user-info-item">
                <span className="user-info-detail-name">Lastname</span>
                <p className="user-info-details-editable">{user.lastname}</p>
              </div>
              <div className="user-info-item">
                <span className="user-info-detail-name">Phone</span>
                <p className="user-info-details-editable">{user.phone}</p>
              </div>
            </div>
          </div>
          <button className="button-edit-user-info">
            Edit
            <img className="edit-profile-button-icon" src={editProfile} alt="Edit Profile Icon" />
          </button>
        </div>

        <div className="edit-user-container">
          <div className="user-address-info">
            <h3 className="user-edit-header-info">Address</h3>
            <div className="user-info-row">
              <div className="user-info-item">
                <span className="user-info-detail-name">Home number</span>
                <p className="user-info-details-editable">{user.address.homeNumber}</p>
              </div>
              <div className="user-info-item">
                <span className="user-info-detail-name">Street Address</span>
                <p className="user-info-details-editable">{user.address.streetAddress}</p>
              </div>
            </div>
            <div className="user-info-row">
              <div className="user-info-item">
                <span className="user-info-detail-name">Barangay</span>
                <p className="user-info-details-editable">{user.address.barangay}</p>
              </div>
              <div className="user-info-item">
                <span className="user-info-detail-name">City</span>
                <p className="user-info-details-editable">{user.address.city}</p>
              </div>
            </div>
            <div className="user-info-row">
              <div className="user-info-item">
                <span className="user-info-detail-name">Province</span>
                <p className="user-info-details-editable">{user.address.province}</p>
              </div>
              <div className="user-info-item">
                <span className="user-info-detail-name">Postal Code</span>
                <p className="user-info-details-editable">{user.address.postalCode}</p>
              </div>
            </div>
          </div>
          <button className="button-edit-user-info">
            Edit
            <img className="edit-profile-button-icon" src={editProfile} alt="Edit Profile Icon" />
          </button>
        </div>

        <div className="edit-user-container password">
          <button className="reset-password-btn" onClick={handleShowResetPassword}>
            <img className="reset-icon" src={resetPassword} alt="reset Icon"/>
            Reset Password
          </button>
          {showResetPassword &&(
            <div className="user-reset-password-form">
              <div className="reset-input-container">
                <label className="reset-label-pass">Password</label>
                <input className="reset-input-pass" 
                type="password" 
                value={newPassword} 
                onChange={handlePasswordChange}
                required />
              </div>
              <div className="reset-input-container">
                <label className="reset-label-pass">Confirm Password</label>
                <input className="reset-input-pass"
                type="password" 
                value={newConfirmPassword} 
                onChange={handleConfirmPasswordChange} 
                required/>
                 {error && <span className="editUser-error">{error}</span>}
              </div>
              <div className="reset-password-requirements">
                <p >Your password must include the following:</p>
                <ul>
                  <li>{getRequirementIcon('Be 8-100 characters long')} Be 8-100 characters long</li>
                  <li>{getRequirementIcon('Contain at least one uppercase and one lowercase letter')}Contain at least one uppercase and one lowercase letter</li>
                  <li>{getRequirementIcon('Contain at least one number or special character')} Contain at least one number or special character</li>
                </ul>
              </div>
              <div className="reset-button-container">
                <button className="reset-button-pass cancel" onClick={handleCancel}>Cancel</button>
                <button className="reset-button-pass save" onClick={handleSubmitResetPassword}>Save</button>
              </div>
            </div>
          )}
        </div>
      </div>
    
    </div>
  );
}
