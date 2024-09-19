import "assets/css/admin"
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import AccountInfoSection from "components/AccountInfoSection";
import * as images from 'assets/images';
import { EditAccountInfoModal, EditProfileModal } from "./modals";


export const AccountSettingsAdmin = () =>{

  const [personalInfoItems, setPersonalInfoItems] = useState([
    { label: 'Firstname', value: 'Celmin Shane' },
    { label: 'Lastname', value: 'Quizon' },
    { label: 'Username', value: 'clmnshn28' },
    { label: 'Phone', value: '09675710874' }
  ]);

  const [addressInfoItems, setAddressInfoItems] = useState([
    { label: 'Home number', value: '12' },
    { label: 'Street Address', value: 'Everlasting St.' },
    { label: 'Barangay', value: 'Bulihan' },
    { label: 'Municipality/City', value: 'Malolos' },
    { label: 'Province', value: 'Bulacan' },
    { label: 'Postal Code', value: '3000' }
  ]);

  // Destructure to avoid redundancy
  const { value: firstname } = personalInfoItems.find(item => item.label === 'Firstname') || {};
  const { value: lastname } = personalInfoItems.find(item => item.label === 'Lastname') || {};
  const { value: username } = personalInfoItems.find(item => item.label === 'Username') || {};


  const [ editInfoModal, setEditInfoModal] = useState(false);
  const [currentInfo, setCurrentInfo] = useState([]);
  const [modalTitle, setModalTitle] = useState('');

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
   const confirmProfilePicModal = (newProfilePic) => {
    setProfilePicModal(false);
    if (newProfilePic) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(newProfilePic);
    } else {
      setProfilePic(images.defaultAvatar);
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
                @{username}
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
          defaultAvatar={images.defaultAvatar}      
        />
      </>
 
  );
}
