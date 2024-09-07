import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { IoFilterSharp } from 'react-icons/io5';
import { ImLoop } from "react-icons/im";
import 'assets/css/admin';

import * as images from 'assets/images';
import SearchBar from "components/SearchBar";
import { ReactivationModal } from "./modals/ReactivationModal";
import DropdownFilter from "components/DropdownFilter";

export const DeactivatedAccountsAdmin = () =>{

    const [users, setUsers] = useState([
        { id: 1, fname: 'Karen Joyce', lname: 'Joson', username: '@karenjoycrjoson', avatar: images.defaultAvatar, deactivationDate: 'January 20, 2024', reason: 'Customer Request', description: 'The customer has requested to close their account.' },
        { id: 2, fname: 'Celmin Shane', lname: 'Quizon', username: '@clmnshn', avatar: images.defaultAvatar, deactivationDate: 'February 10, 2024', reason: 'Inactivity', description: 'The account has been inactive for an extended period.' },
        { id: 3, fname: 'Miguel Angelo', lname: 'Barruga', username: '@barrugs', avatar: images.defaultAvatar, deactivationDate: 'March 15, 2024', reason: 'Violation of Terms', description: 'The customer has violated the terms of service.' },
        { id: 4, fname: 'Francis Harvey', lname: 'Soriano', username: '@harvey', avatar: images.defaultAvatar, deactivationDate: 'April 5, 2024', reason: 'Customer Request', description: 'The customer has requested to close their account.' },
    ]);

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredUsers, setFilteredUsers] = useState(users);
    const [activeDropdown, setActiveDropdown] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const [filters, setFilters] = useState({
        reason: '',
    });

     // clear
     const handleClearFilters = () => {
        setFilters({
            status: '',
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
              (updatedFilters.reason === '' || request.reason === updatedFilters.reason) 
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
    

    // reactivated user click
    const handleReactivationClick = (user) =>{
        setIsModalOpen(true);
        setSelectedUser(user);
    };

    const handleCloseModal = () =>{
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handleConfirmReactivation = (userId, username) =>{
        setIsModalOpen(false);
        setSelectedUser(null);
        console.log('Reactivating acc for:', userId, username);
    };


    return(
        <>   
            <div className="DeactivatedAccountsAdmin__header">
                <h2 className="DeactivatedAccountsAdmin__header-text">Users</h2>
                <Link to="/admin/users/customers"  className='DeactivatedAccountsAdmin__link'>
                    <p className="DeactivatedAccountsAdmin__customers-text">Customers</p>
                </Link>
                <Link to="/admin/users/deactivated-accounts"  className='DeactivatedAccountsAdmin__link'>
                    <p className="DeactivatedAccountsAdmin__deactivated-text">Deactivated Accounts</p>
                </Link>
            </div>

            <div className="DeactivatedAccountsAdmin__controls">
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    handleSearch={handleSearch}
                />  
                <IoFilterSharp  className="DeactivatedAccountsAdmin__filter-icon" />
                <DropdownFilter
                    label="Reason"
                    isOpen={activeDropdown === 'reason'}
                    toggleDropdown={()=>toggleDropdown('reason')}
                    options={[
                        {label: 'Customer Request', value: 'Customer Request'},
                        {label: 'Inactivity', value: 'Inactivity'},
                        {label: 'Violation of Terms', value: 'Violation of Terms'},
                    ]}
                    onOptionSelect={(value) => handleFilterChange('reason', value)}
                />
            </div>
            <div className="DeactivatedAccountsAdmin__table-container">
                <table className="DeactivatedAccountsAdmin__table">
                    <thead className="DeactivatedAccountsAdmin__table-header">
                        <tr>
                            <th style={{paddingLeft: '40px'}}>Customer ID</th>
                            <th>Username</th>
                            <th>Deactivation Date</th>
                            <th>Reason</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={8} style={{textAlign: 'center'}}> No Deactivated Accounts</td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) =>(
                                <tr key={user.id}>
                                    <td style={{paddingLeft: '40px'}}>{user.id}</td>
                                    <td>
                                        <div className="DeactivatedAccountsAdmin__info">
                                            <img className="DeactivatedAccountsAdmin__avatar" src={user.avatar} alt="Customer Image"/>
                                            <span>{user.username}</span>
                                        </div>
                                    </td>
                                    <td>{user.deactivationDate}</td>
                                    <td>
                                        <div>
                                            <p className="DeactivatedAccountsAdmin__title">{user.reason}</p>
                                            <p className="DeactivatedAccountsAdmin__description">{user.description}</p>
                                        </div>
                                    </td>
                                    <td>
                                        <button className="DeactivatedAccountsAdmin__reactivated" onClick={() => handleReactivationClick(user)}>
                                            <ImLoop/>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            {selectedUser && (
            <ReactivationModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirmReactivation}
                userId={selectedUser.id}
                username={selectedUser.username}
            />
            )}
        </>
    );
};