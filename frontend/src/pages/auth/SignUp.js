import React, { useState } from 'react';
import "assets/css/auth"
import { Link, useNavigate  } from 'react-router-dom';
import * as images from 'assets/images';
import PasswordRequirements from 'components/PasswordRequirements';
import axios from 'axios';
import {API_URL} from 'constants';
import { TermsAndCondition, SuccessModal } from './modals';

export const SignUp = () =>{
  const navigate = useNavigate(); 

  // for label of input field 
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const [showTermsModal, setShowTermsModal] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setError('');
  };

  const toCamelCase = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };


  const handleCloseModal = () => {
    setShowTermsModal(false);
    setIsTermsChecked(false); // Uncheck the sign-up form checkbox when modal closes
  };

  const handleTermsChecked = (checked) => {
    setIsTermsChecked(checked); // Update the sign-up checkbox based on the modal checkbox
    setShowTermsModal(false); // Close modal smoothly
  };  

  const handleCheckboxClick = (e) => {
    e.preventDefault(); // Prevent the checkbox from being directly checked
    setShowTermsModal(true); // Open the modal
  };


  // checking if password match and met the requirement
  const handleSubmit =  async (e) => {
    e.preventDefault();
    setLoading(true);

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

    const camelCaseFname = toCamelCase(fname);
    const camelCaseLname = toCamelCase(lname);  

    try {
      await axios.post(`${API_URL}/api/register`, {
        fname: camelCaseFname,
        lname: camelCaseLname,
        email,
        username,
        password,
        c_password: confirmPassword,  
      });
  
      setShowSuccessModal(true); 

      // Clear the form fields and error message
      setFname('');
      setLname('');
      setEmail('');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setError('');
      setEmailError('');
      setUsernameError('');
      
    } catch (error) {
      if (error.response && error.response.data) {
        // Check if validation errors are present
        if (error.response.data.data) {
          if (error.response.data.data.username) {
            setUsernameError(error.response.data.data.username[0]); 
            return;// Set the first username error
          }
          if (error.response.data.data.email) {
            setEmailError(error.response.data.data.email[0]); 
            return; // Set the first email error
          }
        } else if (error.response.data.message) {
          setError(error.response.data.message);
          return; 
        }
      }
    } finally {
      setLoading(false);
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

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/customer/sign-in');
  };

  return (
    <div className="SignUp__wrapper" style={{ backgroundImage: `url(${images.backgroundFeatures})` }}>
      <div className="SignUp__container">
        <h1 className='SignUp__header'>Create Account</h1>
        <div className="SignUp__white-box">   
          <form onSubmit={handleSubmit} className='SignUp__form'>
            <div className="input-field">
              <input
                type="text"
                value={fname}
                onChange={(e) => setFname(e.target.value)}
                placeholder=" "
                required
              />
              <label>Firstname</label>
            </div>
            <div className="input-field">
              <input
                type="text"
                value={lname}
                onChange={(e) => setLname(e.target.value)}
                placeholder=" "
                required
              />
              <label>Lastname</label>
            </div>
            <div className="input-field">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                required
              />
              <label>Email</label>
              {emailError && <span className="SignUp__email-error">{emailError}</span>}
            </div>
            <div className="input-field">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder=" "
                required
              />
              <label>Username</label>
              {usernameError && <span className="SignUp__username-error">{usernameError}</span>}
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
              <label   onClick={handleCheckboxClick} >
                <input 
                  type="checkbox" 
                  required
                  checked={isTermsChecked} 
                /> 
                I agree to  <a className="agreement" onClick={()=> setShowTermsModal(true)}> Terms of Service and Privacy Policy</a>
              </label>
            </div>
            <button className='signupButton' type="submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <p className="signin-text">Already have an account?  <Link to="/customer/sign-in">Sign In</Link></p>
        </div>
      </div>
   
        <TermsAndCondition 
          isOpen = {showTermsModal}
          onClose={handleCloseModal} 
          onTermsChecked={handleTermsChecked} 
        />
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={handleSuccessModalClose}
          title="Account Created"
          message="Please check your email to verify your account."
        />
    </div>
  );

}
