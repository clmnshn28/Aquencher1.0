import "assets/css/ChangePasswordAdmin.css"
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const ChangePasswordAdmin = () =>{

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
 
  // checking if password match and met the requirement
  const changePasswordSubmit = (e) => {
    e.preventDefault();
    
    if (!isPasswordRequirementMet('Be 8-100 characters long') ||
      !isPasswordRequirementMet('Contain at least one uppercase and one lowercase letter') ||
      !isPasswordRequirementMet('Contain at least one number or special character')) {
      setError('Password does not meet the requirements');
      return;
    }
    if (password !== confirmPassword) {
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
        return password.length >= 8 && password.length <= 100;
      case 'Contain at least one uppercase and one lowercase letter':
        return /[A-Z]/.test(password) && /[a-z]/.test(password);
      case 'Contain at least one number or special character':
        return /\d/.test(password) || /[!@#$%^&*(),.?":{}|<>]/.test(password);
      default:
        return false;
    }
  };
  const getRequirementIcon = (requirement) => {
    return isPasswordRequirementMet(requirement) ? <span className='check'>&#10004;</span> : <span className='wrong'>&#10005;</span>;
  };


  return (
    <div className="bgChange-container" >
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
        <form onSubmit={changePasswordSubmit} className="form-changepass">
        <div className="form-group">
          <label className="change-pass-text" htmlFor="currentPassword">Current Password</label>
          <input 
            type="password" 
            id="currentPassword" 
            name="currentPassword" 
            className="change-pass-input"
            required 
          />
        </div>
        <div className="form-group">
          <label className="change-pass-text" htmlFor="newPassword">New Password</label>
          <input 
            type="password" 
            id="newPassword" 
            name="newPassword" 
            className="change-pass-input"
            required 
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="change-pass-text" htmlFor="confirmNewPassword">Confirm New Password</label>
          <input 
            type="password" 
            id="confirmNewPassword" 
            name="confirmNewPassword" 
            className="change-pass-input"
            required 
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
            {error && <span className="changePass-error">{error}</span>}
        </div>
        <div className="change-password-requirements">
          <p >Your password must include the following:</p>
          <ul>
            <li>{getRequirementIcon('Be 8-100 characters long')} Be 8-100 characters long</li>
            <li>{getRequirementIcon('Contain at least one uppercase and one lowercase letter')}Contain at least one uppercase and one lowercase letter</li>
            <li>{getRequirementIcon('Contain at least one number or special character')} Contain at least one number or special character</li>
          </ul>
        </div>
        <button className="change-pass-btn" type="submit">Change Password</button>
        </form>
      </div>
    </div>

  );
}
