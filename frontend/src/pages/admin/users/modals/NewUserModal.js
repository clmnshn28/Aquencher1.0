import React, { useState } from 'react';
import 'assets/css/NewUserModal.css';

import * as images from 'assets/images';

import Modal from 'components/Modal';
import TextField from 'components/TextField';
import PasswordRequirements from 'components/PasswordRequirements';

export const NewUserModal = ({isOpen, onClose, onAddUser}) => {

  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState(images.defaultAvatar);
  
  const [error, setError] = useState('');
  
  const handleFirstnameChange = (e) => {
    setFirstName(e.target.value);
  };
  const handleLastnameChange = (e) => {
    setLastName(e.target.value);
  };
  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };
  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };
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
      fullName: `${firstname} ${lastname}`, 
      address,
      phone,
      username: usernameWithAt,
      password,
      avatar,
      dateRegistered: formatDate(new Date()),
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
    setFirstName('');
    setLastName('');
    setAddress('');
    setPhone('');
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setAvatar(images.defaultAvatar);
  };

  const formatDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString(undefined, options);
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

  if (!isOpen) return null;

  return(
    <Modal>
      <div className="modal-content">
        <button className="close-modal" onClick={onClose}>&times;</button>
        <h2 className='add-new-user-header'>New User</h2>
        <form onSubmit={handleSubmit}  className="form-container">
          <div className="form-flex-container">
            <div className="avatar-container">
              <img className='new-avatar' src={avatar} alt="Avatar Preview" />
              <label htmlFor="file-upload" className='button-upload-photo'>
                <img className='upload-photo-icon' src={images.uploadPhoto} alt="upload Photo" />
                Upload Photo
              </label>
              <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            </div>
            <div className="newUser-input-container">
              <div className="newUser-container">
                <TextField label="First Name"  id="firstname" name="firstname" value={firstname} onChange={handleFirstnameChange} type="text" isRequired />
                <TextField label="Last Name" id="lastname" name="lastname" value={lastname} onChange={handleLastnameChange} type="text" isRequired />
                <TextField label="Address"  id="address" name="address" value={address} onChange={handleAddressChange} type="text" isRequired />
                <TextField label="Phone"  id="phone" name="phone" value={phone} onChange={handlePhoneChange} type="text" isRequired />
                <TextField label="Username"  id="username" name="username" value={username} onChange={handleUsernameChange} type="text" isRequired />
                <TextField label="Password"  id="password" name="password" value={password} onChange={handlePasswordChange} type="password" isRequired />
                <TextField label="Confirm Password"  id="confirmPassword" name="confirmPassword" value={confirmPassword} onChange={handleConfirmPasswordChange} type="password" isRequired />
                {error && <span className="newUser-error">{error}</span>}
              </div>
            </div>
          </div>
          <button className='submit-add-user' type="submit">Add User</button>

          <div className="password-requirements">
           <PasswordRequirements newPassword={password}/>
          </div>
        </form>
      </div>
    </Modal>
  );

}