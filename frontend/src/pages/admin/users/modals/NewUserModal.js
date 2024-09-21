import React, { useState } from 'react';
import 'assets/css/modals';
import axios from 'axios';
import {API_URL} from 'constants';
import { useAuth } from 'context/AuthContext';

import * as images from 'assets/images';
import Modal from 'components/Modal';
import TextField from 'components/TextField';
import PasswordRequirements from 'components/PasswordRequirements';

export const NewUserModal = ({isOpen, onClose, onAddUser}) => {
  const { user } = useAuth();

  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [street, setStreet] = useState('');
  const [barangay, setBarangay] = useState('');
  const [municipalityCity, setMunicipalityCity] = useState('Malolos');
  const [province, setProvince] = useState('Bulacan');
  const [postalCode, setPostalCode] = useState('3000');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState({ file: null, preview: null });
  
  const [error, setError] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [imageError, setImageError] = useState('');
  const [contactError, setContactError] = useState('');
  const [emailError, setEmailError] = useState('');
  
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setUsernameError('');
  };

  const handleContactChange = (e) => {
    setContactNumber(e.target.value);
    setContactError('');
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailError('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setError('');
  };

  // check contact
  const validateContactNumber = (number) => {
    if (!/^\d+$/.test(number)) {
      return 'Contact No. must be numeric';
    }
    if (number.length !== 11) {
      return 'Contact No. must be 11 digits';
    }
    return ''; 
  };

  // for uploading image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    // Check if file exists
    if (file) {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (validTypes.includes(file.type)) {
        setImageError('');
  
        // Update the file object for submission
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatar({
            file: file, // The File object
            preview: reader.result // Data URL for preview
          });
        };
        reader.readAsDataURL(file); // Read the file as a data URL
      } else {
        setAvatar({ file: null, preview: null });
        setImageError('Please upload a valid image file (PNG, JPG, JPEG)');
      }
    } else {
      setImageError('Please select a file.');
    }
  };

  const resetForm = () => {
    setFname('');
    setLname('');
    setEmail('');
    setContactNumber('');
    setHouseNumber('');
    setStreet('');
    setBarangay('');
    setMunicipalityCity('Malolos');
    setProvince('Bulacan');
    setPostalCode('3000');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setAvatar({ file: null, preview: null });
    setError('');
    setImageError('');
    setContactError(''); 
    setUsernameError('');
  };

  const handleClose = () => {
    resetForm(); 
    onClose();   
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
  
  // submit new user
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate contact number
    const contactValidationError = validateContactNumber(contactNumber);
    if (contactValidationError) {
      setContactError(contactValidationError);
      return; 
    } else {
      setContactError(''); 
    }
    
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


    // Create a new FormData object to prepare data for API request
    const formData = new FormData();
    // Append individual form fields to the FormData object.
    formData.append('fname', fname);
    formData.append('lname', lname);
    formData.append('email', email);
    formData.append('contact_number', contactNumber);
    formData.append('house_number', houseNumber);
    formData.append('street', street);
    formData.append('barangay', barangay);
    formData.append('municipality_city', municipalityCity);
    formData.append('province', province);
    formData.append('postal_code', postalCode);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('c_password', confirmPassword);

    // Use the File object from avatar
    if (avatar.file) {
      formData.append('image', avatar.file);
    } else {
      const response = await fetch(images.defaultAvatar);
      const blob = await response.blob();
      formData.append('image', blob, 'defaultAvatar.png');
    }

    try {
      await axios.post(API_URL + '/api/customers', formData,{
        headers:{
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${user.token}`,
        }
      });

      onClose();
      resetForm(); 
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

    }

  };

  if (!isOpen) return null;

  return(
    <Modal>
      <div className="NewUserModal__content">
        <button className="NewUserModal__close" onClick={handleClose}>&times;</button>
        <h2 className='NewUserModal__header'>New User</h2>
        <form onSubmit={handleSubmit}  className="NewUserModal__form-container">
          <div className="NewUserModal__flex-container">
            <div className="NewUserModal__avatar-section">
              <div className="NewUserModal__avatar-wrapper">
                <img 
                  className='NewUserModal__avatar-preview' 
                  src={avatar.preview || images.defaultAvatar } 
                  alt="Avatar Preview" 
                />
                <label htmlFor="file-upload" className='NewUserModal__upload-label'>
                  <img className='NewUserModal__upload-photo-icon' src={images.uploadPhoto} alt="upload Photo" />
                  Upload Photo
                </label>
                <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                {imageError && <span className="NewUserModal__image-error">{imageError}</span>}
              </div>
            </div>     
            <div className="NewUserModal__input-container">
              <div className='NewUserModal__name-container'>
                <TextField label="First Name"  id="fname" name="fname" value={fname} onChange={(e) => setFname(e.target.value)} type="text" autoComplete='off' isRequired required/>
                <TextField label="Last Name" id="lname" name="lname" value={lname} onChange={(e) => setLname(e.target.value)} type="text" autoComplete='off' isRequired required/>
              </div>
              <div className='NewUserModal__name-container'>
                <TextField label="Email"  id="email" name="email" value={email} onChange={handleEmailChange} type="email" autoComplete='off' isRequired required/>
                <TextField label="Contact No."  id="contactNumber" name="contactNumber" value={contactNumber} onChange={handleContactChange} type="text" autoComplete='off' isRequired required/>
              </div>
              {contactError && <span className="NewUserModal__contact-error">{contactError}</span>}
              {emailError && <span className="NewUserModal__email-error">{emailError}</span>}
              <div className='NewUserModal__address-container'>
                <p>Address</p>
                <div className='NewUserModal__address-subsection'>
                  <TextField label="House No."  id="houseNumber" name="houseNumber" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} type="text" autoComplete='off'  />
                  <TextField label="Street"  id="street" name="street" value={street} onChange={(e) => setStreet(e.target.value)} type="text" autoComplete='off'  />
                  <TextField label="Barangay"  id="barangay" name="barangay" value={barangay} onChange={(e) => setBarangay(e.target.value)} type="text" autoComplete='off'  />
                </div>
                <div className='NewUserModal__address-subsection'>
                  <TextField label="Municipality/City"  id="municipalityCity" name="municipalityCity" value='Malolos' onChange={(e) => setMunicipalityCity(e.target.value)} type="text"  isReadOnly/>
                  <TextField label="Province"  id="province" name="province" value="Bulacan" onChange={(e) => setProvince(e.target.value)} type="text"  isReadOnly/>
                  <TextField label="Postal Code"  id="postalCode" name="postalCode" value="3000" onChange={(e) => setPostalCode(e.target.value)} type="text"  isReadOnly/>
                </div>
              </div>

              <TextField label="Username"  id="username" name="username" value={username} onChange={handleUsernameChange} type="text" autoComplete='off' isRequired required/>
              <TextField label="Password"  id="password" name="password" value={password} onChange={handlePasswordChange} type="password" autoComplete='off' isRequired required/>
              <TextField label="Confirm Password"  id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={handleConfirmPasswordChange} type="password" autoComplete='off' isRequired required/>
              {error && <span className="NewUserModal__error">{error}</span>}
              {usernameError && <span className="NewUserModal__username-error">{usernameError}</span>}
            </div>
          </div>
          <button className='NewUserModal__add-user-btn' type="submit">Add User</button>

          <div className="NewUserModal__password-requirements">
           <PasswordRequirements newPassword={password}/>
          </div>
        </form>
      </div>
    </Modal>
  );

}