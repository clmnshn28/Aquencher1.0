import React, { useState } from 'react';
import 'assets/css/NewUserModal.css';

import defaultAvatar from 'assets/images/default-avatar.jpg';
import uploadPhoto from 'assets/images/uploadPhoto.png';

export const NewUserModal = ({isOpen, onClose, onAddUser}) => {

  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState(defaultAvatar);
  
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
    setAvatar(defaultAvatar);
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
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-modal" onClick={onClose}>&times;</button>
        <h2 className='add-new-user-header'>New User</h2>
        <form onSubmit={handleSubmit}  className="form-container">
          <div className="form-flex-container">
            <div className="avatar-container">
              <img className='new-avatar' src={avatar} alt="Avatar Preview" />
              <label htmlFor="file-upload" className='button-upload-photo'>
                <img className='upload-photo-icon' src={uploadPhoto} alt="upload Photo" />
                Upload Photo
              </label>
              <input id="file-upload" type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
            </div>
            <div className="newUser-input-container">
              <div className="newUser-container">
                <label className='newUser-label'>First Name <span className="required-field"> * </span>:</label> 
                <input className='newUser-input'
                 type="text" 
                 value={firstname} 
                 onChange={handleFirstnameChange} 
                 required />

                <label className='newUser-label'>Last Name <span className="required-field"> * </span>:</label>
                <input className='newUser-input' 
                type="text" 
                value={lastname} 
                onChange={handleLastnameChange} 
                required />
             
                <label className='newUser-label'>Address <span className="required-field"> * </span>:</label>
                <input className='newUser-input' 
                type="text" 
                value={address} 
                onChange={handleAddressChange} 
                required />
              
                <label className='newUser-label'>Phone <span className="required-field">* </span>:</label>
                <input className='newUser-input' 
                type="text" 
                value={phone} 
                onChange={handlePhoneChange} 
                required />
               
                <label className='newUser-label space'>Username <span className="required-field">* </span>:</label>
                <input className='newUser-input' 
                type="text" 
                value={username} 
                onChange={handleUsernameChange} 
                required />
            
                <label className='newUser-label'>Password <span className="required-field">* </span>:</label>
                <input className='newUser-input' 
                type="password" 
                value={password} 
                onChange={handlePasswordChange} 
                required />
                
                <label className='newUser-label'>Confirm Password <span className="required-field">* </span>:</label>
                <input className='newUser-input' 
                type="password" 
                value={confirmPassword} 
                onChange={handleConfirmPasswordChange} 
                required />
                 {error && <span className="newUser-error">{error}</span>}
              </div>
            </div>
          </div>
          <button className='submit-add-user' type="submit">Add User</button>

          <div className="password-requirements">
            <p >Your password must include the following:</p>
            <ul>
              <li>{getRequirementIcon('Be 8-100 characters long')} Be 8-100 characters long</li>
              <li>{getRequirementIcon('Contain at least one uppercase and one lowercase letter')}Contain at least one uppercase and one lowercase letter</li>
              <li>{getRequirementIcon('Contain at least one number or special character')} Contain at least one number or special character</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );

}