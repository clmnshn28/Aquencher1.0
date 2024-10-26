import React, { useState } from 'react';
import "assets/css/auth"
import { useNavigate } from 'react-router-dom';
import * as images from 'assets/images';
import { IoArrowBackCircleOutline } from "react-icons/io5";
import axios from 'axios';
import {API_URL} from 'constants';

export const ForgotPasswordEmail = () => {

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [isSending, setIsSending] = useState(false);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleBackClick = () => {
        navigate(-1); 
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSending(true); 

        try {
            await axios.post(`${API_URL}/api/forgot-password/send-otp`, { email });
            
            navigate('/forgot-password/otp', { state: { email } });
           
        } catch (error) {
            setError(error.response.data.message ||  'Failed to send OTP');
        }finally {
            setIsSending(false); 
        }

    }

    return (
        <div className="CustomerSignIn__wrapper" style={{ backgroundImage: `url(${images.backgroundFeatures})` }}>
            <div className="ForgotPassword__container">
            <IoArrowBackCircleOutline className="ForgotPassword__back-btn" onClick={handleBackClick}/>
            <h2>Recover Your Password</h2>
            <p>Enter the email address in your account and we’ll send a confirmation code to reset your password.</p>
            <form onSubmit={handleSubmit} className="ForgotPassword__form">
                <div className="input-field">
                    <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                    placeholder=' '
                    />
                    <label>Enter your email address</label>
                </div>
                {error && <p className="ForgotPassword__error">{error}</p>}
                <div className="ForgotPassword__btn-group">
                    <button 
                        type="submit" 
                        className='ForgotPassword__submit'
                        disabled={isSending}     
                    >
                        {isSending ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                    <button type="button" className='ForgotPassword__back' onClick={handleBackClick}>Back to Sign In</button>
                </div>
            
            </form>
            </div>
        </div>
    );
}