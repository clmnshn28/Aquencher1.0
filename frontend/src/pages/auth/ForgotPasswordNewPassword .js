import React, { useState } from 'react';
import "assets/css/auth"
import { useNavigate, useLocation } from 'react-router-dom';
import * as images from 'assets/images';
import { IoArrowBackCircleOutline } from "react-icons/io5";
import PasswordRequirements from 'components/PasswordRequirements';
import { PasswordResetModal } from './modals/PasswordResetModal';
import axios from 'axios';
import {API_URL} from 'constants';

export const ForgotPasswordNewPassword = () => {
    const location = useLocation();
    const { email } = location.state || { email: 'example@example.com' };

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); 
    const [isSuccessResetOpen, setIsSuccessResetOpen] = useState(false);
    
    const handleBackClick = () => {
        navigate('/forgot-password'); 
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
      };
    
      const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
      };
    
    const handleSubmit = async (e) => {
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
      
        try {
            await axios.post(`${API_URL}/api/forgot-password/reset-password`, {
                email, 
                password,
                password_confirmation: confirmPassword,
            });
            setIsSuccessResetOpen(true);
        } catch (error) {

            setError(error.response.data.message || 'Failed to reset password');
        }
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

    const closeModalAndRedirect = () => {
        setIsSuccessResetOpen(false);
        navigate('/customer/sign-in');
    };
      
    return (
        <div className="CustomerSignIn__wrapper" style={{ backgroundImage: `url(${images.backgroundFeatures})` }}>
            <div className="ForgotPassword__new-container">
            <IoArrowBackCircleOutline className="ForgotPassword__back-btn" onClick={handleBackClick}/>
            <h2>Reset Your Password</h2>
      
            <form onSubmit={handleSubmit} className="ForgotPassword__form-otp">
                <div className="input-field">
                    <input
                    //  id='input-new-password'
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    placeholder=' '
                    />
                    <label>New Password</label>
                </div>
                <div className="input-field">
                    <input
                    // id='input-confirm-new-password'
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                    placeholder=' '
                    />
                    <label>Confirm New Password</label>
                </div>
                <div className="ForgotPassword__password-instruction">
                    <PasswordRequirements newPassword={password}/>
                </div>
                {error && <p className="ForgotPassword__password-error">{error}</p>}
                <div className="ForgotPassword__btn-group">
                    <button type="submit" className='ForgotPassword__new-submit'>Reset Password</button>
                    <button type="button" className='ForgotPassword__new-back' onClick={handleBackClick}>Back </button>
                </div>
            </form>
            </div>
            <PasswordResetModal
                isOpen={isSuccessResetOpen}
                onClose={closeModalAndRedirect}
            />
        </div>
    );

};