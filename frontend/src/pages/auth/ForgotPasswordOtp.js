import React, { useState, useEffect } from 'react';
import "assets/css/auth"
import { useNavigate, useLocation } from 'react-router-dom';
import * as images from 'assets/images';
import { IoArrowBackCircleOutline } from "react-icons/io5";
import axios from 'axios';
import {API_URL} from 'constants';

export const ForgotPasswordOtp = () => {
    const location = useLocation();
    const { email } = location.state || { email: 'example@example.com' }; 
    
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(59); // Timer for resending code
    const navigate = useNavigate();
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        // Countdown logic for the resend timer
        const countdown = setInterval(() => {
            if (timer > 0) {
                setTimer(timer - 1);
            }
        }, 1000);

        return () => clearInterval(countdown);
    }, [timer]);


    const maskEmail = (email) => {
        const [localPart, domain] = email.split('@');
        const maskedLocalPart = `${localPart[0]}****${localPart.slice(-1)}`;
        return `${maskedLocalPart}@${domain}`;
    };


    const handleCodeChange = (e) => {
        setCode(e.target.value);
    };

    const handleBackClick = async () => {
        try {
            await axios.post(`${API_URL}/api/forgot-password/delete-otp`, { email });
        } catch (error) {
            console.error('Error deleting OTP:', error);
        }
        navigate('/forgot-password');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(`${API_URL}/api/forgot-password/verify-otp`, { email, otp_code: code });

            navigate('/forgot-password/new-password', { state: { email } });
            
        } catch (error) {
            setError(error.response.data.message ||  'Invalids OTP');
        }
    };

    const handleResendCode = async () => {
        if (timer === 0) {
            setIsResending(true); 
            try {
                await axios.post(`${API_URL}/api/forgot-password/send-otp`, { email });
                setTimer(59); 
            } catch (error) {
                setError('An error occurred while resending the OTP.');
            }finally {
                setIsResending(false); 
            }
        }
    };


    return (
        <div className="CustomerSignIn__wrapper" style={{ backgroundImage: `url(${images.backgroundFeatures})` }}>
            <div className="ForgotPassword__container">
            <IoArrowBackCircleOutline className="ForgotPassword__back-btn" onClick={handleBackClick}/>
            <h2>Enter Confirmation Code</h2>
             <p>Enter the 6-digit code we sent to {maskEmail(email)}</p>
            <p className="ForgotPassword__minute-send">
                It may take up to a minute for you to receive this code.
                {timer > 0 ? (
                    <span className="ForgotPassword__resend-time"> Resend code in 0:{timer < 10 ? `0${timer}` : timer}</span>
                ) : (
                    <button type="button" className="ForgotPassword__resend-btn" onClick={handleResendCode} disabled={isResending}>
                        Resend code
                    </button>
                )}
            </p>
            <form onSubmit={handleSubmit} className="ForgotPassword__form-otp">
                <div className="input-field">
                    <input
                    type="text"
                    value={code}
                    onChange={handleCodeChange}
                    required
                    placeholder=' '
                    maxLength={6}
                    />
                    <label>Enter code</label>
                </div>
                {error && <p className="ForgotPassword__error">{error}</p>}
                <div className="ForgotPassword__btn-group">
                    <button type="submit" className='ForgotPassword__submit'>Verify OTP</button>
                    <button type="button" className='ForgotPassword__back' onClick={handleBackClick}>Back </button>
                </div>
            </form>
            </div>
        </div>
    );
}