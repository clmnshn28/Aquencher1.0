import "assets/css/admin"
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { IoFilterSharp } from 'react-icons/io5';
import { FaPhoneAlt, FaUserEdit } from "react-icons/fa";
import { BsPersonFillSlash } from "react-icons/bs";
import { PiMapPinAreaDuotone } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';

import * as images from 'assets/images';
import {NewUserModal,DeactivationModal} from './modals'; 
import SearchBar from "components/SearchBar";
import DropdownFilter from "components/DropdownFilter";

export const UsersAdmin = () => {

    const [users, setUsers] = useState([
        { id: 1, fname: 'Karen Joyce', lname: 'Joson', username: '@karenjoycrjoson', contactNumber: '09123892012', address: '146 Dama De Notche Street, Bulihan', status: 'Active', avatar: images.defaultAvatar },
        { id: 2, fname: 'Celmin Shane', lname: 'Quizon', username: '@clmnshn', contactNumber: '09123098971', address: '136 Dama De Notche Street, Bulihan', status: 'Inactive', avatar: images.defaultAvatar },
        { id: 3, fname: 'Miguel Angelo', lname: 'Barruga', username: '@barrugs', contactNumber: '09123098971', address: '246 Dama De Notche Street, Bulihan', status: 'Active', avatar: images.defaultAvatar },
        { id: 4, fname: 'Francis Harvey', lname: 'Soriano', username: '@harvey', contactNumber: '09123098971', address: '075 Dama De Notche Street, Bulihan', status: 'Active', avatar: images.defaultAvatar },
    ]);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredUsers, setFilteredUsers] = useState(users);

    const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
    const [isDeactivationModalOpen, setIsDeactivationModalOpen] = useState(false); 


    const [filters, setFilters] = useState({
        status: '',
        address: '',
    });
    
    // clear
    const handleClearFilters = () => {
        setFilters({
            status: '',
            address: '',
        });
        setSearchQuery('');
        setFilteredUsers(users); // Reset
        setActiveDropdown(null); 
    };

    // search filter
    const handleSearch = () => {
        if (searchQuery !== '') {
          const results = users.filter((user) => 
           `${user.fname} ${user.lname}`.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setFilteredUsers(results);
        }
      };
    
    useEffect(() => {
        if (searchQuery === '') {
          setFilteredUsers(users);
        }
    }, [searchQuery, users]);

    // dropdown filter 
    const handleFilterChange = (name, value) => {
        setFilters((prevFilters) => {
          const updatedFilters = {
            ...prevFilters,
            [name]: value,
          };
    
          // Automatically filter users based on the updated filters
          const results = users.filter((request) => {
            return (
              (updatedFilters.status === '' || request.status === updatedFilters.status) &&
              (updatedFilters.address === '' || request.address.toLowerCase().includes(updatedFilters.address.toLowerCase()))
            );
          });
          
          setFilteredUsers(results);
          return updatedFilters;
        });
        setActiveDropdown(null);
    };

    // reveal or not in filter dropdown
    const toggleDropdown = (dropdown) => {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };


    // new user add
    const handleAddUser = (newUser) => {
        setFilteredUsers([...filteredUsers, { ...newUser }]);
    };

    const navigate = useNavigate();
    // user edit 
    const handleEditClick = () => {
        navigate(`/admin/users/customer/edit`);
    };

    // user view details 
    const handleViewDetailsClick = () => {
        navigate(`/admin/users/customer/view-details`);
    };

    // user deactivate
    const handleDeactivationClick = (user) => {
        setIsDeactivationModalOpen(true);
    };

      
    // Function to confirm deactivation
    const confirmDeactivation = () => {
        console.log('User deactivated'); 
        setIsDeactivationModalOpen(false); // Close modal 
    };


    return(
        <>
            <div className="UsersAdmin__header">
                <h2 className="UsersAdmin__header-text">Users</h2>
                <Link to="/admin/users/customers"  className='UsersAdmin__link'>
                    <p className="UsersAdmin__customers-text">Customers</p>
                </Link>
                <Link to="/admin/users/deactivated-accounts"  className='UsersAdmin__link'>
                    <p className="UsersAdmin__deactivated-text">Deactivated Accounts</p>
                </Link>
            </div>
            <div className="UsersAdmin__controls">
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    handleSearch={handleSearch}
                />  
                <IoFilterSharp  className="UsersAdmin__filter-icon" />
                <DropdownFilter
                    label="Status"
                    isOpen={activeDropdown === 'status'}
                    toggleDropdown={()=>toggleDropdown('status')}
                    options={[
                        {label: 'Active', value: 'Active'},
                        {label: 'Inactive', value: 'Inactive'},
                    ]}
                    onOptionSelect={(value) => handleFilterChange('status', value)}
                /> 
                <DropdownFilter
                    label="Address"
                    isOpen={activeDropdown === 'address'}
                    toggleDropdown={() => toggleDropdown('address')}
                    options={users.map((user) => ({ label: user.address, value: user.address }))}
                    onOptionSelect={(value) => handleFilterChange('address', value)}
                />
                 {(searchQuery || filters.status || filters.address) && (
                    <button className="RequestsAdmin__clear-filters-button" onClick={handleClearFilters}>
                        CLEAR
                    </button>
                )}
                <button className="UsersAdmin__new-user-button" onClick={() => setIsNewUserModalOpen(true)}>
                    + New User
                </button>
            </div>
            <div className="UsersAdmin__table-container">
                <table className="UsersAdmin__table">
                    <thead className="UsersAdmin__table-header">
                        <tr>
                            <th style={{paddingLeft: '40px'}}>Full Name</th>
                            <th>Username</th>
                            <th>Contact</th>
                            <th style={{textAlign: 'center'}}>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{textAlign: 'center'}}>
                                    No users found
                                </td>
                            </tr>
                        ):(
                            filteredUsers.map((user) =>(
                                <tr key={user.id}>
                                    <td  style={{paddingLeft: '40px'}}>
                                        <div className="UsersAdmin__info">
                                            <img className="UsersAdmin__avatar" src={user.avatar} alt="Customer Image"/>
                                            <span>{`${user.fname} ${user.lname}`}</span>
                                        </div>
                                    </td>
                                    <td>{user.username}</td>
                                    <td>
                                        <div>
                                            <p className="UserAdmin__address">
                                                <PiMapPinAreaDuotone className="UserAdmin__address-icon" />
                                                {user.address}
                                            </p>
                                            <p className="UserAdmin__phone">
                                                <FaPhoneAlt />
                                                {user.contactNumber}
                                            </p>
                                        </div>
                                    </td>
                                    <td style={{textAlign: 'center'}}>
                                        <span 
                                            className={`UsersAdmin__dot ${user.status === 'Active' ? 'UsersAdmin__active' : 'UsersAdmin__inactive'}`} 
                                        />
                                    </td>
                                    <td>
                                        <div className="UserAdmin__actions">
                                            <button className="UserAdmin__edit" onClick={() => handleEditClick(user)}>
                                                <FaUserEdit/>
                                            </button>
                                            {/* <button className="UserAdmin__view" onClick={() => handleViewDetailsClick(user)}>
                                                <BsFillPersonLinesFill/>
                                            </button> */}
                                            <button className="UserAdmin__delete" onClick={()=> handleDeactivationClick(user)}>
                                                <BsPersonFillSlash/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
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
        </>
    );
};