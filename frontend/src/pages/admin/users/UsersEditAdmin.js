import "assets/css/admin"
import React, { useState } from 'react';
import {  useNavigate  } from 'react-router-dom';

import * as images from 'assets/images';

import AccountInfoSection from "components/AccountInfoSection";
import PasswordRequirements from "components/PasswordRequirements";
import TextField from "components/TextField";
import ButtonGroup from "components/ButtonGroup";
import { ResetPasswordConfirmationModal } from "./modals";

export const UsersEditAdmin = () =>{
  const navigate = useNavigate();

  const [personalInfoItems, setPersonalInfoItems] = useState([
    [
      { label: 'Firstname', value: 'Karen Joyce' },
      { label: 'Lastname', value: 'Joson' },
      { label: 'Username', value: 'karenjoycejoson' },
      { label: 'Phone', value: '09123892012' }
    ]
  ]);

  const [addressInfoItems, setAddressInfoItems] = useState([
    [
      { label: 'Home number', value: '123' },
      { label: 'Street Address', value: 'Sampaguita St.' },
      { label: 'Barangay', value: 'Bulihan' },
      { label: 'Municipality/City', value: 'Malolos' },
      { label: 'Province', value: 'Bulacan'},
      { label: 'Postal Code', value: '3000'},
    ]
  ]);

  const [showResetPassword , setShowResetPassword] = useState(false);
  const [newPassword , setNewPassword] = useState('');
  const [newConfirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

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
    setError('');
    setShowConfirmationModal(true); 
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

  const handleConfirmPasswordReset = () => {
    console.log("Reset Password Submitted!!!");
    setShowConfirmationModal(false);
    handleCancel();
  };

  const username = personalInfoItems[0].find(item => item.label === 'Username').value;
  return (
    <>
      <div className="UserEditAdmin__profile-header">
        <img className="UserEditAdmin__avatar" src={images.defaultAvatar} alt="User Avatar" />
        <div className="UserEditAdmin__details">
          <h2 className="UserEditAdmin__name">
            {personalInfoItems[0].find(item => item.label === 'Firstname').value} {personalInfoItems[0].find(item => item.label === 'Lastname').value}
          </h2>
          <p className="UserEditAdmin__username">
            @{personalInfoItems[0].find(item => item.label === 'Username').value}
          </p>
        </div>
        <img className="UserEditAdmin__back-btn" src={images.backEditButton} alt="Back Button" onClick={() => navigate(-1)}/>
      </div>
      
      <div className="UserEditAdmin__account-container">
        <AccountInfoSection title="Personal Information" infoItems={personalInfoItems} />
        <AccountInfoSection title="Address" infoItems={addressInfoItems} />

        <div className="UserEditAdmin__password-container">
          <button className="UserEditAdmin__reset-button" onClick={handleShowResetPassword}>
            <img className="UserEditAdmin__reset-icon" src={images.resetPassword} alt="reset Icon"/>
            Reset Password
          </button>
          {showResetPassword &&(
            <form className="UserEditAdmin__password-form" onSubmit={handleSubmitResetPassword}>
              <div className="UserEditAdmin__input-group">
                <TextField label='Password' type="password" value={newPassword} onChange={handlePasswordChange} isRequired/>
                <TextField label="Confirm Password" type="password" value={newConfirmPassword} onChange={handleConfirmPasswordChange} isRequired  error={error}/>
                {error && <span className="UserEditAdmin__error">{error}</span>}
              </div>
              <div className="UserEditAdmin__password-requirements">
                <PasswordRequirements newPassword={newPassword}/>
              </div>
              <ButtonGroup 
                onCancel={handleCancel} 
                onSave={handleSubmitResetPassword} 
                saveText="Save" 
                saveButtonColor="#0174CF" 
              />
            </form>
          )}
        </div>
      </div>
      <ResetPasswordConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={handleConfirmPasswordReset}
        username={username}
      />
    </>
  );
}
