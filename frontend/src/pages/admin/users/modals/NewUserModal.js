import React, { useState } from 'react';
import 'assets/css/modals';

import * as images from 'assets/images';

import Modal from 'components/Modal';
import TextField from 'components/TextField';
import PasswordRequirements from 'components/PasswordRequirements';

export const NewUserModal = ({isOpen, onClose, onAddUser}) => {

  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [street, setStreet] = useState('');
  const [barangay, setBarangay] = useState('');
  const [municipalityCity, setMunicipalityCity] = useState('Malolos');
  const [province, setProvince] = useState('Bulacan');
  const [postalCode, setPostalCode] = useState('3000');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState(images.defaultAvatar);
  
  const [error, setError] = useState('');
  
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError('');
  };
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setError('');
  };

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

    console.log('Form submitted');

    const usernameWithAt = `@${username}`;

    const newUser = {
      fname, 
      lname,
      contactNumber,
      address: `${houseNumber} ${street} ${barangay} ${municipalityCity} ${province}`,
      username: usernameWithAt,
      password,
      avatar,
      status: 'Inactive' 

    };
    onAddUser(newUser);
    onClose();
    resetForm();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFname('');
    setLname('');
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
    setAvatar(images.defaultAvatar);
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
                <img className='NewUserModal__avatar-preview' src={avatar} alt="Avatar Preview" />
                <label htmlFor="file-upload" className='NewUserModal__upload-label'>
                  <img className='NewUserModal__upload-photo-icon' src={images.uploadPhoto} alt="upload Photo" />
                  Upload Photo
                </label>
                <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
              </div>
            </div>     
            <div className="NewUserModal__input-container">
              <div className='NewUserModal__name-container'>
                <TextField label="First Name"  id="fname" name="fname" value={fname} onChange={(e) => setFname(e.target.value)} type="text" isRequired />
                <TextField label="Last Name" id="lname" name="lname" value={lname} onChange={(e) => setLname(e.target.value)} type="text" isRequired />
              </div>
              <TextField label="Contact Number"  id="contactNumber" name="contactNumber" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} type="text" isRequired />
              <div className='NewUserModal__address-container'>
                <p>Address</p>
                <div className='NewUserModal__address-subsection'>
                  <TextField label="House No."  id="houseNumber" name="houseNumber" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} type="text"  />
                  <TextField label="Street"  id="street" name="street" value={street} onChange={(e) => setStreet(e.target.value)} type="text"  />
                  <TextField label="Barangay"  id="barangay" name="barangay" value={barangay} onChange={(e) => setBarangay(e.target.value)} type="text"  />
                </div>
                <div className='NewUserModal__address-subsection'>
                  <TextField label="Municipality/City"  id="municipalityCity" name="municipalityCity" value='Malolos' onChange={(e) => setMunicipalityCity(e.target.value)} type="text"  isReadOnly/>
                  <TextField label="Province"  id="province" name="province" value="Bulacan" onChange={(e) => setProvince(e.target.value)} type="text"  isReadOnly/>
                  <TextField label="Postal Code"  id="postalCode" name="postalCode" value="3000" onChange={(e) => setPostalCode(e.target.value)} type="text"  isReadOnly/>
                </div>
              </div>

              <TextField label="Username"  id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} type="text" isRequired />
              <TextField label="Password"  id="password" name="password" value={password} onChange={handlePasswordChange} type="password" isRequired />
              <TextField label="Confirm Password"  id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={handleConfirmPasswordChange} type="password" isRequired />
              {error && <span className="NewUserModal__error">{error}</span>}
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