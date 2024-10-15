import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'assets/css/admin';

import PasswordRequirements from "components/PasswordRequirements";
import TextField from "components/TextField";
import axios from 'axios';
import {API_URL} from 'constants';

export const ChangePassword = () =>{
    
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [currentError, setCurrentError] = useState('');

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

    // checking if password match and met the requirement
    const changePasswordSubmit = async (e) => {
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
        try {
            await axios.post(`${API_URL}/api/user/change-password`, {
                current_password: currentPassword,
                new_password: newPassword,
                confirm_new_password: confirmNewPassword
            }, {
                headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
        
            alert('Password changed successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setError('');
            setCurrentError('');
        } catch (error) {
            if (error.response && error.response.data) {
                setCurrentError(error.response.data.data?.current_password || 'An error occurred');
            } else {
                setError('An error occurred');
            }
        }
    };
    
    return(
        <>
            <div className="AccountSettingsAdmin__container">
                <h1 className="AccountSettingsAdmin__header-text">Account Settings</h1>
                <Link to="/customer/account-settings/my-profile">
                    <p className="AccountSettingsAdmin__profile-text-change">My Profile</p>
                </Link>
                <Link to="/customer/account-settings/change-password">
                    <p className="AccountSettingsAdmin__password-text-change">Change Password</p>
                </Link>
            </div>
            <div className="ChangePasswordAdmin__password-container">
                <form onSubmit={changePasswordSubmit} className="ChangePasswordAdmin__form">
                    <div className="ChangePasswordAdmin__input-container">
                        <TextField label="Current Password :" id="currentPassword" name="currentPassword" value={currentPassword} onChange={handleCurrentPasswordChange} type="password" isRequired required/>
                        <TextField label="New Password :" id="newPassword" name="newPassword" value={newPassword} onChange={handleNewPasswordChange} type="password" isRequired required/>
                        <TextField label="Confirm New Password :" id="confirmNewPassword" name="confirmNewPassword" value={confirmNewPassword} onChange={handleConfirmNewPasswordChange} type="password" isRequired required/>
                        {error && <span className="ChangePasswordAdmin__error">{error}</span>}
                        {currentError && <span className="ChangePasswordAdmin__current-error">{currentError}</span>}
                    </div>
            
                    <div className="change-password-requirements">
                        <PasswordRequirements newPassword={newPassword} />
                    </div>
                    <button className="ChangePasswordAdmin__pass-btn" type="submit">Change Password</button>
                </form>
            </div>
        
        </>
    );
};