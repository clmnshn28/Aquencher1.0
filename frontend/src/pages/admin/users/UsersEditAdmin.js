import "assets/css/admin"
import React, { useEffect, useState, useRef} from 'react';
import {  useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {API_URL} from 'constants';
import * as images from 'assets/images';

import AccountInfoSection from "components/AccountInfoSection";
import PasswordRequirements from "components/PasswordRequirements";
import TextField from "components/TextField";
import ButtonGroup from "components/ButtonGroup";
import { SuccessModal } from "components/SuccessModal";
import { ResetPasswordConfirmationModal, EditCustomerInfoModal } from "./modals";


export const UsersEditAdmin = () =>{
  const navigate = useNavigate();
  const { userId } = useParams(); // Get userId from the URL
  const [personalInfoItems, setPersonalInfoItems] = useState([]);
  const [addressInfoItems, setAddressInfoItems] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState(images.defaultAvatar); // Initialize with default avatar

  const initialFetchDone = useRef(false);

  useEffect(() => {
    if (!initialFetchDone.current) {
      fetchUserData();
      initialFetchDone.current = true;
    }
  }, [userId]); 
  
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/customers/${userId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}` 
        }
    });
      const customerData = response.data.data;
  
       // Check if customerData.image exists, otherwise use defaultAvatar
      const imageUrl = customerData.image ? `${API_URL}/storage/images/${customerData.image}` : images.defaultAvatar;
      setAvatarUrl(imageUrl);

      // Update state with the fetched user data
      setPersonalInfoItems([
        { label: 'Firstname', value: customerData.fname },
        { label: 'Lastname', value: customerData.lname },
        { label: 'Username', value: customerData.username },
        { label: 'Contact No.', value: customerData.contact_number },
        { label: 'Email', value: customerData.email },
      ]);

      setAddressInfoItems([
        { label: 'House number', value: customerData.house_number },
        { label: 'Street', value: customerData.street },
        { label: 'Barangay', value: customerData.barangay },
        { label: 'Municipality/City', value: customerData.municipality_city },
        { label: 'Province', value: customerData.province },
        { label: 'Postal Code', value: customerData.postal_code },
      ]);
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
  };

    // Destructure to avoid redundancy
    const { value: firstname } = personalInfoItems.find(item => item.label === 'Firstname') || {};
    const { value: lastname } = personalInfoItems.find(item => item.label === 'Lastname') || {};
    const { value: username } = personalInfoItems.find(item => item.label === 'Username') || {};
  

  const [showResetPassword , setShowResetPassword] = useState(false);
  const [newPassword , setNewPassword] = useState('');
  const [newConfirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const handleShowResetPassword = () =>{
    setShowResetPassword(true);
  };

  const handlePasswordChange = (e) =>{
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) =>{
    setConfirmPassword(e.target.value);
  };

  const handleCancel = () =>{
    setShowResetPassword(false);
    setNewPassword(''); 
    setConfirmPassword(''); 
    setError('');
  }

  const handleSubmitResetPassword = (e) =>{

    e.preventDefault();

    if (!isPasswordRequirementMet('Be 8-100 characters long') ||
        !isPasswordRequirementMet('Contain at least one uppercase and one lowercase letter') ||
        !isPasswordRequirementMet('Contain at least one number or special character')) {
      setError('Password does not meet the requirements');
      return;
    }

    if (newPassword !== newConfirmPassword) {
      setError('Passwords do not match');
      return; 
    }
    setError('');
    
    setShowConfirmationModal(true); 
  }

   // checking requirement in password
   const isPasswordRequirementMet = (requirement) => {
    switch (requirement) {
      case 'Be 8-100 characters long':
        return newPassword.length >= 8 && newPassword.length <= 100;
      case 'Contain at least one uppercase and one lowercase letter':
        return /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword);
      case 'Contain at least one number or special character':
        return /\d/.test(newPassword) || /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
      default:
        return false;
    }
  };

  const handleConfirmPasswordReset = async () => {
    try {
        await axios.put(`${API_URL}/api/customers/${userId}/reset-password`, { password: newPassword, c_password: newConfirmPassword  }, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}` 
          }
      });
        setIsSuccessModalOpen(true);
    } catch (error) {
        console.error('Error resetting password:', error.response?.data || error.message);
        setError('Failed to reset password. Please try again.');
    } finally {
        setShowConfirmationModal(false);
        handleCancel();
    }
  };


  const toCamelCase = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // ===============================
  const [ editInfoModal, setEditInfoModal] = useState(false);
  const [currentInfo, setCurrentInfo] = useState([]);
  const [modalTitle, setModalTitle] = useState('');

  // open the modal info
  const openEditInfoModal = (info, title) => {
    setCurrentInfo(info);
    setModalTitle(title);
    setEditInfoModal(true); 
  };

  // Close the modal info
   const closeEditInfoModal = () => {
    setEditInfoModal(false);
    setCurrentInfo([]); 
  };

  
  // Confirm the modal info
  const confirmEditInfoModal = (updatedInfo) => {
    if (modalTitle === 'Personal Information') {
      setPersonalInfoItems(updatedInfo);
    } else if (modalTitle === 'Address Information') {
      setAddressInfoItems(updatedInfo);
    }
    handleSubmitUpdate(updatedInfo);
    setEditInfoModal(false);
  };

  const handleSubmitUpdate = async (updatedInfo) => { 

    try {
      const updatedData = {
        fname: toCamelCase(updatedInfo.find(item => item.label === 'Firstname')?.value ||  personalInfoItems.find(item => item.label === 'Firstname').value),
        lname: toCamelCase(updatedInfo.find(item => item.label === 'Lastname')?.value || personalInfoItems.find(item => item.label === 'Lastname').value),
        username: updatedInfo.find(item => item.label === 'Username')?.value || personalInfoItems.find(item => item.label === 'Username').value,
        contact_number: updatedInfo.find(item => item.label === 'Contact No.')?.value || personalInfoItems.find(item => item.label === 'Contact No.').value,
        email: updatedInfo.find(item => item.label === 'Email')?.value || personalInfoItems.find(item => item.label === 'Email').value,
        house_number: updatedInfo.find(item => item.label === 'House number')?.value || addressInfoItems.find(item => item.label === 'House number').value,
        street: toCamelCase(updatedInfo.find(item => item.label === 'Street')?.value || addressInfoItems.find(item => item.label === 'Street').value) ,
        barangay: toCamelCase(updatedInfo.find(item => item.label === 'Barangay')?.value || addressInfoItems.find(item => item.label === 'Barangay').value) , 
        municipality_city: updatedInfo.find(item => item.label === 'Municipality/City')?.value || addressInfoItems.find(item => item.label === 'Municipality/City').value,
        province: updatedInfo.find(item => item.label === 'Province')?.value ||  addressInfoItems.find(item => item.label === 'Province').value,
        postal_code: updatedInfo.find(item => item.label === 'Postal Code')?.value ||  addressInfoItems.find(item => item.label === 'Postal Code').value,
      };
      await axios.put(`${API_URL}/api/customers/${userId}`, updatedData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}` 
        }
      });
      fetchUserData();
    } catch (error) {
      console.error('Error updating user data:', error.response?.data || error.message);
    }
 
  };


  return (
    <>
      <div className="UserEditAdmin__profile-header">
        <img className="UserEditAdmin__avatar" src={avatarUrl} alt="User Avatar" />
        <div className="UserEditAdmin__details">
          <h2 className="UserEditAdmin__name">
            {firstname} {lastname}
          </h2>
          <p className="UserEditAdmin__username">
            {username ? `@${username}` : ''}
          </p>
        </div>
        <img className="UserEditAdmin__back-btn" src={images.backEditButton} alt="Back Button" onClick={() => navigate(-1)}/>
      </div>
      
      <div className="UserEditAdmin__account-container">
          <AccountInfoSection 
            title="Personal Information" 
            infoItems={personalInfoItems} 
            onEditClick={() => openEditInfoModal(personalInfoItems, "Personal Information")}
          />

          <AccountInfoSection 
            title="Address Information" 
            infoItems={addressInfoItems} 
            onEditClick={() => openEditInfoModal(addressInfoItems, "Address Information")}
          />

        <div className="UserEditAdmin__password-container">
          <button className="UserEditAdmin__reset-button" onClick={handleShowResetPassword}>
            <img className="UserEditAdmin__reset-icon" src={images.resetPassword} alt="reset Icon"/>
            Reset Password
          </button>
          {showResetPassword &&(
            <form className="UserEditAdmin__password-form" onSubmit={handleSubmitResetPassword}>
              <div className="UserEditAdmin__input-group">
                <TextField label='Password :' type="password" value={newPassword} onChange={handlePasswordChange} isRequired/>
                <TextField label="Confirm Password :" type="password" value={newConfirmPassword} onChange={handleConfirmPasswordChange} isRequired  error={error}/>
                {error && <span className="UserEditAdmin__error">{error}</span>}
              </div>
              <div className="UserEditAdmin__password-requirements">
                <PasswordRequirements newPassword={newPassword}/>
              </div>
              <ButtonGroup 
                onCancel={handleCancel} 
                onSave={handleSubmitResetPassword} 
                saveText="Save" 
                saveButtonColor="#0174CF" 
              />
            </form>
          )}
        </div>
      </div>
      <ResetPasswordConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={handleConfirmPasswordReset}
        username={username}
      />
      <EditCustomerInfoModal
        isOpen={editInfoModal}
        onClose={closeEditInfoModal}
        onConfirm={confirmEditInfoModal}
        infoItems={currentInfo}
        title={modalTitle}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Password Change Successful"
        message="The password has been changed successfully."
      />
    </>
  );
}
