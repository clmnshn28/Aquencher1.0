import React, { useState } from 'react';
import "assets/css/SignUp.css"
import { Link } from 'react-router-dom';

import PasswordRequirements from 'components/PasswordRequirements';

export const SignUp = () =>{
 
  // for label of input field 
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
  const handleFirstnameChange = (e) => {
    setFirstname(e.target.value);
  };
  const handleLastnameChange = (e) => {
    setLastname(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setError('');
  };


  // checking if password match and met the requirement
  const handleSubmit = (e) => {
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
    <div className="signup-wrapper">
      <div className="signup-container">
      <h1 className='signup-header'>Create Account</h1>
      <div className="signup-box">
        <div className="input-container">    
          <form onSubmit={handleSubmit} action="" method="post" className='signup-form'>
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
            <div className="input-field">
              <input
                type="text"
                value={firstname}
                onChange={handleFirstnameChange}
                placeholder=" "
                required
              />
              <label>Firstname</label>
            </div>
            <div className="input-field">
              <input
                type="text"
                value={lastname}
                onChange={handleLastnameChange}
                placeholder=" "
                required
              />
              <label>Lastname</label>
            </div>
            <div className="input-field">
              <input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder=" "
                required
              />
              <label>Password</label>
            </div>
            <div className="input-field">
              <input
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder=" "
                required
              />
              <label>Confirm Password</label>
              {error && <span className="error">{error}</span>}
            </div>
            <div className="password-instruction">
              <PasswordRequirements newPassword={password}/>
            </div>
          
            <div className="form-footer">
              <label>
                <input type="checkbox" required/> I agree to  <a className="agreement" href="#"> Terms of Service and Privacy Policy.</a>
              </label>
            </div>
            <button className='signupButton' type="submit">Sign Up</button>
          </form>
          <p className="signin-text">Already have an account?  <Link to="/">Sign In</Link></p>
        </div>
      </div>
     </div>
    </div>
  );

}
