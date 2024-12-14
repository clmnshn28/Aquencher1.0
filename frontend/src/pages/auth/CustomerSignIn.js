import React, { useEffect, useState } from 'react';
import "assets/css/auth"
import * as images from 'assets/images';
import { useAuth } from 'context/AuthContext';

import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import { Link, useNavigate } from 'react-router-dom';

export const CustomerSignIn = () =>{
  const navigate = useNavigate();
  const { user, signIn, error, clearError  } = useAuth();

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
    await signIn(username, password, '/api/login/customer', rememberMe);
  
  };

  useEffect(() => {
    if (user && user.token) {
      navigate('/customer/dashboard');
    }
  }, [ user, navigate ]);

  const handleLinkClick = () => {
    clearError();
  };

  return(
    <div className="CustomerSignIn__wrapper" style={{ backgroundImage: `url(${images.backgroundFeatures})` }}>
      <div className="CustomerSignIn__container">
      <h1 className='CustomerSignIn__header'>Login Account</h1>
        <div className="CustomerSignIn__white-box">
            <form onSubmit={handleSubmit} className='CustomerSignIn__form'>
              <div className="input-field">
                <input
                  // id='input-username'
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder=" "
                  required
                />
                <label>Username</label>
              </div>
              <div className="input-field password-input">
                <input
                //  id='input-password'
                  type={showPassword ? 'text' : 'password'} // Conditionally show/hide password
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder=" "
                  required
                />
                <label>Password</label>
                <span className="toggle-password" onClick={togglePasswordVisibility}>
                  {/* Toggle between eye and crossed eye icons based on showPassword state */}
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
                {error && <p className="CustomerSignIn__error-message">{error}</p>} 
              </div>
              <div className="CustomerSignIn__form-footer">
                <label>
                  <input type="checkbox" checked={rememberMe} onChange={handleRememberMeChange} /> Remember me
                </label>
                <Link className="CustomerSignIn__forgot" to="/forgot-password" onClick={handleLinkClick}>
                  Forgot password?
                </Link>
              </div>
              <button className='CustomerSignIn__btn' type="submit">Login</button>
            </form>
            <p className="CustomerSignIn__sign-up">Don't have an account? <Link to="/customer/sign-up" onClick={handleLinkClick}>Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
}

