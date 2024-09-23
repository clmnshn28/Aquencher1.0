import "assets/css/admin"
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { IoFilterSharp } from 'react-icons/io5';
import { FaPhoneAlt, FaUserEdit } from "react-icons/fa";
import { BsPersonFillSlash } from "react-icons/bs";
import { PiMapPinAreaDuotone } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {API_URL} from 'constants';

import * as images from 'assets/images';
import {NewUserModal,DeactivationModal} from './modals'; 
import SearchBar from "components/SearchBar";
import DropdownFilter from "components/DropdownFilter";

export const UsersAdmin = () => {

    const [users, setUsers] = useState([]);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);

    const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
    const [isDeactivationModalOpen, setIsDeactivationModalOpen] = useState(false); 
    const [filters, setFilters] = useState({status: ''});
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(()=>{
      const fetchUsers = async () =>{
        try{
            const response = await axios.get(API_URL +'/api/customers');
            setUsers(response.data.data);
            setFilteredUsers(response.data.data);
        }catch(error){
            console.error('Error fetching users', error);
        }
      }; 
        fetchUsers();
       
    },[]);
    
    // clear
    const handleClearFilters = () => {
        setFilters({status: ''});
        setSearchQuery('');
        setFilteredUsers(users); // Reset
        setActiveDropdown(null); 
    };

    // search filter
    const handleSearch = () => {
        if (searchQuery !== '') {
            const results = users.filter((user) => {
                const fullName = `${user.fname} ${user.lname}`.toLowerCase();
                const fullAddress = `${user.house_number} ${user.street}, ${user.barangay}`.toLowerCase();
            
                // Search by both name and address
                return (
                    fullName.includes(searchQuery.toLowerCase()) || 
                    fullAddress.includes(searchQuery.toLowerCase())
                );
            });
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
          const results = users.filter((user) => {  
            if (updatedFilters.status === 'Active') {
                return user.is_online  === 1;
            } else if (updatedFilters.status === 'Inactive') {
                return user.is_online === 0;
            } else {
                return true;
            }  
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
    const handleEditClick = (userId) => {
        navigate(`/admin/users/customer/edit/${userId}`);
    };

    // user view details 
    const handleViewDetailsClick = () => {
        navigate(`/admin/users/customer/view-details`);
    };

    // user deactivate
    const handleDeactivationClick = (user) => {
        setIsDeactivationModalOpen(true);
        setSelectedUser(user); 
    };

      
    // Function to confirm deactivation
    const confirmDeactivation = (selectedOption) => {
        if (selectedUser) {
            handleDeactivateUser(selectedUser.id, selectedOption.title, selectedOption.description);
        }
        setIsDeactivationModalOpen(false); // Close modal 
    };

    const handleDeactivateUser = async (userId, title, description) => {
        try {
            await axios.put(`${API_URL}/api/customers/${userId}/deactivate`, { title, description });
            setFilteredUsers((prev) => prev.filter(u => u.id !== selectedUser.id));
        } catch (error) {
            console.error('Error deactivating user:', error);
        }
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
                    label={filters.status || "Status"}
                    isOpen={activeDropdown === 'status'}
                    toggleDropdown={()=>toggleDropdown('status')}
                    options={[
                        {label: 'Active', value: 'Active'},
                        {label: 'Inactive', value: 'Inactive'},
                    ]}
                    onOptionSelect={(value) => handleFilterChange('status', value)}
                /> 
              
                 {(searchQuery || filters.status ) && (
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
                            <th>Email</th>
                            <th>Contact</th>
                            <th style={{textAlign: 'center'}}>Status</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{textAlign: 'center', color: 'rgba(67, 65, 65, 0.5)'}}>
                                    No users found
                                </td>
                            </tr>
                        ):(
                            filteredUsers.map((user) =>(
                                <tr key={user.id}>
                                    <td  style={{paddingLeft: '40px'}}>
                                        <div className="UsersAdmin__info">
                                            <img className="UsersAdmin__avatar" src={user.image ? `${API_URL}/storage/images/${user.image}` : images.defaultAvatar} alt="Customer Image"/>
                                            <span>{`${user.fname} ${user.lname}`}</span>
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <div>
                                            <p className="UserAdmin__address">
                                                <PiMapPinAreaDuotone className="UserAdmin__address-icon" />
                                                {user.house_number && user.street ? 
                                                    `${user.house_number} ${user.street}, ${user.barangay}` : 
                                                    user.barangay
                                                }
                                            </p>
                                            <p className="UserAdmin__phone">
                                                <FaPhoneAlt />
                                                {user.contact_number}
                                            </p>
                                        </div>
                                    </td>
                                    <td style={{textAlign: 'center'}}>
                                        <span 
                                            className={`UsersAdmin__dot ${user.is_online ? 'UsersAdmin__active' : 'UsersAdmin__inactive'}`}   
                                        />   
                                    </td>
                                    <td>
                                        <div className="UserAdmin__actions">
                                            <button className="UserAdmin__edit" onClick={() => handleEditClick(user.id)}>
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