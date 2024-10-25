import React, { useEffect, useState } from 'react';
import "assets/css/auth"
import * as images from 'assets/images';
import { useAuth } from 'context/AuthContext';

import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import { Link, useNavigate } from 'react-router-dom';

export const AdminSignIn = () =>{
    const navigate = useNavigate();
    const { user, signIn, error, clearError } = useAuth();

    // for label of input field 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleRememberMeChange = (e) => {
      setRememberMe(e.target.checked);
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    // this for the toggle password
    const [showPassword, setShowPassword] = useState(false); // State to track if password should be shown or hidden

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        await signIn(username, password, '/api/login/admin', rememberMe);
    };

    useEffect(() => {
        if (user && user.token) {
            navigate('/admin/dashboard');
        }
    }, [ user, navigate ]);

    const handleLinkClick = () => {
        clearError();
      };

    return(
        <div className="AdminSignIn__wrapper" style={{ backgroundImage: `url(${images.backgroundFeatures})` }}>
            <div className="AdminSignIn__container">
            <h1 className='AdminSignIn__title'> Admin Login</h1>
                <div className="AdminSignIn__box">
                    <form onSubmit={handleSubmit} className='AdminSignIn__form'>
                    <div className="AdminSignIn__input-field">
                        <input
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                        placeholder=" "
                        required
                        />
                        <label>Username</label>
                    </div>
                    <div className="AdminSignIn__input-field password-input">
                        <input
                        type={showPassword ? 'text' : 'password'} // Conditionally show/hide password
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder=" "
                        required
                        />
                        <label>Password</label>
                        <span className="AdminSignIn__toggle-password" onClick={togglePasswordVisibility}>
                        {/* Toggle between eye and crossed eye icons based on showPassword state */}
                        {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </span>
                        {error && <p className="CustomerSignIn__error-message">{error}</p>} 
                    </div>
                    <div className="AdminSignIn__form-footer">
                        <label>
                        <input type="checkbox" checked={rememberMe} onChange={handleRememberMeChange}/> Remember me
                        </label>
                        <Link className="AdminSignIn__forgot"  to="/forgot-password" onClick={handleLinkClick}>
                            Forgot password?
                        </Link>
                    </div>
                    <button className='AdminSignIn__Button' type="submit">Login</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

