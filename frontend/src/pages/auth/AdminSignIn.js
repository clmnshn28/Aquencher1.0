import React, { useEffect, useState } from 'react';
import "assets/css/auth"
import * as images from 'assets/images';
import { useAuth } from 'context/AuthContext';

import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import { Link, useNavigate } from 'react-router-dom';

export const AdminSignIn = () =>{
    const navigate = useNavigate();
    const { user, signIn } = useAuth();

    // for label of input field 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

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
        await signIn(username, password, '/api/login/admin');
    };

    useEffect(() => {
        if (user && user.token) {
            navigate('/admin/dashboard');
        }
    }, [ user, navigate ]);

    return(
        <div className="AdminSignIn__wrapper">
            <div className="AdminSignIn__container">
                <img className="AdminSignIn__logo" src={images.loginLogo} alt="AquencherLogo" />
                <div className="AdminSignIn__box">
                    <div className="AdminSignIn__input-container">
                        <h1 className='AdminSignIn__title'>Login</h1>
                        
                        <form onSubmit={handleSubmit} action="" method="post" className='AdminSignIn__form'>
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
                            </div>

                            <div className="AdminSignIn__form-footer">
                                <label>
                                    <input type="checkbox" /> Remember me
                                </label>
                                <a className="AdminSignIn__forgot" href="#">Forgot password?</a>
                            </div>
                            <button className='AdminSignIn__Button' type="submit">Login</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

