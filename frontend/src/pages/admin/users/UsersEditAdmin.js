import "assets/css/UsersEditAdmin.css"
import React, { useState } from 'react';

import defaultAvatar from 'assets/images/default-avatar.jpg';

export const UsersEditAdmin = () =>{

  const user = {
    firstname: 'Karen Joyce',
    lastname: 'Joson',
    phone: '09123892012',
    address: {
      homeNumber: '123',
      streetAddress: 'Sampaguita St.',
      barangay: 'Bulihan',
      city: 'Malolos',
      province: 'Bulacan',
      postalCode: '2011'
    },
    profilePicture: defaultAvatar,
    username: '@karenjoycejoson'
  };

  return (
    <div>
      <div className="users-edit-profile-header">
        <img className="user-edit-avatar" src={user.profilePicture} alt="User Avatar" />
        <div className="user-edit-details">
          <h2 className="user-edit-name">{user.firstname} {user.lastname}</h2>
          <p className="user-edit-username">{user.username}</p>
        </div>
      </div>
      
    
    </div>
  );
}
