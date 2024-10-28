import "assets/css/admin"
import React, { useState, useEffect, useRef  } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {API_URL} from 'constants';

import AccountInfoSection from "components/AccountInfoSection";
import * as images from 'assets/images';
import { EditAccountInfoModal, EditProfileModal } from "./modals";


export const AccountSettingsAdmin = () =>{

  const [personalInfoItems, setPersonalInfoItems] = useState([]);
  const [addressInfoItems, setAddressInfoItems] = useState([]);
  const initialFetchDone = useRef(false);

  useEffect(() => {
    if (!initialFetchDone.current) {
      fetchUserData();
      initialFetchDone.current = true;
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(API_URL + '/api/user/display', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}` // Assuming you store the token in localStorage
        }
      });
      const userData = response.data.data;
      
      setProfilePic(userData.image ? `${API_URL}/storage/images/${userData.image}` : images.defaultAvatar);

      setPersonalInfoItems([
        { label: 'Firstname', value: userData.fname },
        { label: 'Lastname', value: userData.lname },
        { label: 'Username', value: userData.username },
        { label: 'Contact No.', value: userData.contact_number },
        { label: 'Email', value: userData.email },
      ]);

      setAddressInfoItems([
        { label: 'House number', value: userData.house_number },
        { label: 'Street', value: userData.street },
        { label: 'Barangay', value: userData.barangay },
        { label: 'Municipality/City', value: userData.municipality_city },
        { label: 'Province', value: userData.province },
        { label: 'Postal Code', value: userData.postal_code }
      ]);

    } catch (error) {
      console.error('Error fetching user data:', error);

    }
  };

  // Destructure to avoid redundancy
  const { value: firstname } = personalInfoItems.find(item => item.label === 'Firstname') || {};
  const { value: lastname } = personalInfoItems.find(item => item.label === 'Lastname') || {};
  const { value: username } = personalInfoItems.find(item => item.label === 'Username') || {};


  const [ editInfoModal, setEditInfoModal] = useState(false);
  const [currentInfo, setCurrentInfo] = useState([]);
  const [modalTitle, setModalTitle] = useState('');

  const toCamelCase = (str) => {
    return str
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // <====== EDIT INPUT INFO MODAL  ===========>
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

  // <====== EDIT PROFILE MODAL  ===========>
  const [profilePicModal, setProfilePicModal] = useState(false); // State for profile picture modal
  const [profilePic, setProfilePic] = useState(images.defaultAvatar);

  // Open the profile picture modal
  const openProfilePicModal = () => {
    setProfilePicModal(true);
  };

  // Close the profile picture modal
  const closeProfilePicModal = () => {
    setProfilePicModal(false);
  };

   // Confirm the profile picture modal
   const confirmProfilePicModal = async (newProfilePic) => {
    setProfilePicModal(false);
    if (newProfilePic) {
      const reader = new FileReader();
       reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(newProfilePic);

      const formData = new FormData();
      formData.append('image', newProfilePic); 

      try {
        await axios.post(`${API_URL}/api/user/update-image`, formData, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data', 
          },
        });

       
      } catch (error) {
        console.error('Error updating profile picture:', error.response?.data || error.message);
      }
    } else {
      setProfilePic(images.defaultAvatar);
    }
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

      await axios.put(`${API_URL}/api/user/update`, updatedData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        }
      });
      
    } catch (error) {
      console.error('Error updating user data:', error.response?.data || error.message);
    }
  };

  return (
      <>
        <div className="AccountSettingsAdmin__container">
          <h1 className="AccountSettingsAdmin__header-text">Account Settings</h1>
          <Link to="/admin/account-settings/my-profile">
            <p className="AccountSettingsAdmin__profile-text">My Profile</p>
          </Link>
          <Link to="/admin/account-settings/change-password">
            <p className="AccountSettingsAdmin__password-text">Change Password</p>
          </Link>
        </div>

        <div className="AccountSettingsAdmin__setting-container">
          <div className="AccountSettingsAdmin__profile-container">
            <img className="AccountSettingsAdmin__profile-image" src={profilePic} alt={`${firstname} Profile`} />
            <div className="AccountSettingsAdmin__profile-info">
              <p className="AccountSettingsAdmin__name">
                {firstname} {lastname}
              </p>
              <p className="AccountSettingsAdmin__username">
                {username ? `@${username}` : ''}
              </p>
              <button className="AccountSettingsAdmin__edit-button" onClick={openProfilePicModal}>
                Edit
                <img className="AccountSettingsAdmin__button-icon" src={images.editProfile} alt="Edit Profile Icon" />
              </button>
            </div>
          </div>

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
        </div>

        <EditAccountInfoModal
          isOpen={editInfoModal}
          onClose={closeEditInfoModal}
          onConfirm={confirmEditInfoModal}
          infoItems={currentInfo}
          title={modalTitle}
        />

        <EditProfileModal
          isOpen={profilePicModal}
          onClose={closeProfilePicModal}
          onConfirm={confirmProfilePicModal}  
          defaultAvatar={profilePic}      
        />
      </>
 
  );
}
