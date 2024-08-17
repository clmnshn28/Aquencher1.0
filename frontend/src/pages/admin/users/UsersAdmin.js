import "assets/css/UsersAdmin.css"
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {NewUserModal,DeactivationModal} from './modals'; 

import defaultAvatar from 'assets/images/default-avatar.jpg';
import searchIcon from 'assets/images/search-icon.png';
import filterIcon from 'assets/images/filter-icon.png';
import searchBlackIcon from 'assets/images/black-search-icon.png';
import userDots from 'assets/images/user-dots.png';

export const UsersAdmin = () => {

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const users = [
    { fullName: 'Karen Joyce Joson', username: '@karenjoycrjoson', phone: '09123892012', address: '12 Everlasting St. Bulihan', dateRegistered: 'January 5, 2024', status: 'Active', avatar: defaultAvatar },
    { fullName: 'Celmin Shane Quizon', username: '@clmnshn', phone: '09123098971', address: 'Malolos, Bulacan', dateRegistered: 'January 15, 2024', status: 'Active', avatar: defaultAvatar },
    { fullName: 'Miguel Angelo Barruga', username: '@barrugs', phone: '09123098971', address: 'Malolos, Bulacan', dateRegistered: 'January 15, 2024', status: 'Active', avatar: defaultAvatar },
    { fullName: 'Francis Harvey Soriano', username: '@harvey', phone: '09123098971', address: 'Malolos, Bulacan', dateRegistered: 'January 15, 2024', status: 'Active', avatar: defaultAvatar },
  ];
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  const [isDeactivationModalOpen, setIsDeactivationModalOpen] = useState(false); 


  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      setSelectedUsers(users.map((_, index) => index));
    } else {
      setSelectedUsers([]);
    }
  };
  
  const handleCheckboxChange = (index) => {
    if (selectedUsers.includes(index)) {
      setSelectedUsers(selectedUsers.filter((i) => i !== index));
    } else {
      setSelectedUsers([...selectedUsers, index]);
    }
  };

  //filtering search
  const handleSearchClick = () => {
    setFilteredUsers(users.filter((user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) 
    ));
    
  };

  const handleAddUser = (newUser) => {
    setFilteredUsers([...filteredUsers, { ...newUser }]);
  };

  const handleUserDotsClick = (index) => {
    setActiveDropdownIndex(activeDropdownIndex === index ? null : index);
  };

    // Function to handle deactivation modal open
    const handleDeactivateUser = (index) => {
      setActiveDropdownIndex(null); // Close dropdown when opening modal
      setIsDeactivationModalOpen(true);
    };
  
    // Function to confirm deactivation
    const confirmDeactivation = () => {
      // Perform deactivation logic here (e.g., update user status to 'Inactive', etc.)
      console.log('User deactivated'); // Placeholder logic
      setIsDeactivationModalOpen(false); // Close modal after deactivation
    };

  return (

    <div>
        <div className="users-header">
          <h2 className="users-header-text">Users</h2>
          <p className="customer-name-text">Customers</p>
        </div>
        <div className="user-controls">
          <div className="search-bar-container">
            <div className="search-bar">
              <input 
                type="text" 
                placeholder="Search" 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
              />
              <img src={searchBlackIcon} alt="Search" />
            </div>
            <button className="search-button" onClick={handleSearchClick}>
              <img src={searchIcon} alt="Search Icon" />
            </button>
            <button className="filter-button">
              <img src={filterIcon} alt="Filter" />
            </button>
          </div>
          <button className="new-user-button" onClick={() => setIsNewUserModalOpen(true)}>+ New User</button>
        </div>
        <div className="users-table-container">
        <table className="users-table">
              <thead className="users-table-header">
                <tr>
                  <th>
                    <input
                      className="custom-checkbox"
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th>Full Name</th>
                  <th>Username</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Date Registered</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center' }}>
                      No users found.
                    </td>
                  </tr>
                ) :
                 (filteredUsers.map((user, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        className="custom-checkbox"
                        type="checkbox"
                         checked={selectedUsers.includes(index)}
                        onChange={() => handleCheckboxChange(index)}
                      />
                    </td>
                    <td>
                      <div className="user-info">
                        <img className="user-avatar" src={user.avatar} alt={`${user.fullName}'s avatar`} />
                        <span>{user.fullName}</span>
                      </div>
                    </td>
                    <td>{user.username}</td>
                    <td>{user.phone}</td>
                    <td>{user.address}</td>
                    <td>{user.dateRegistered}</td>
                    <td className={`user-status ${user.status.toLowerCase() === 'inactive' ? 'inactive' : ''}`}>
                      {user.status}
                    </td>
                    <td>
                        <div className="user-actions">
                          <img
                            src={userDots}
                            alt="Actions"
                            onClick={() => handleUserDotsClick(index)}
                            className="userDots"
                          />
                          {activeDropdownIndex === index && (
                            <div className="user-dropdown">
                              <Link to={`Customer/Edit`}>Edit</Link>
                              <Link to={`Customer/ViewDetails`}>View Details</Link>
                              <button onClick={() => handleDeactivateUser(index)}>Deactivate</button>
                            </div>
                          )}
                        </div>
                      </td>
                  </tr>
                )))}
              </tbody>
            </table>
        </div>
      {/* NewUserModal component */}
      <NewUserModal
        isOpen={isNewUserModalOpen}
        onClose={() => setIsNewUserModalOpen(false)}
        onAddUser={handleAddUser}
      />
      {/* DeactivationModal component */}
      <DeactivationModal
        isOpen={isDeactivationModalOpen}
        onClose={() => setIsDeactivationModalOpen(false)}
        onConfirm={confirmDeactivation}
      />
    </div>
    
  );
};

