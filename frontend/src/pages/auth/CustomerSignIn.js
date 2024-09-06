import React, { useEffect, useState } from 'react';
import "assets/css/auth"
import * as images from 'assets/images';
import { useAuth } from 'context/AuthContext';

import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import { Link, useNavigate } from 'react-router-dom';

export const CustomerSignIn = () =>{
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
    signIn(username, password, '/api/login/customer');
  };

  const navigateToCustomer = () => {
    if (user && user.token) {
      navigate('/customer/dashboard');
    }
  };

  useEffect(() => {
    navigateToCustomer()
  }, [ user ]);

  return(
    <div className="signin-wrapper">
      <div className="login-container">
        <img className="loginlogo" src={images.loginLogo} alt="AquencherLogo" />
        <div className="login-box">
          <div className="input-container">
            <h1 className='login'>Login</h1>
            
            <form onSubmit={handleSubmit} action="" method="post" className='signin-form'>
              <div className="input-field">
                <input
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
              </div>

              <div className="form-footer">
                <label>
                  <input type="checkbox" /> Remember me
                </label>
                <a className="forgot" href="#">Forgot password?</a>
              </div>
              <button className='signinButton' type="submit">Login</button>
            </form>
            <p className="signup-text">Don't have an account? <Link to="sign-up">Sign Up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}

