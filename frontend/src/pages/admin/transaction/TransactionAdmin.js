import "assets/css/TransactionAdmin.css"
import React, { useState } from 'react';

import defaultAvatar from 'assets/images/default-avatar.jpg';
import searchIcon from 'assets/images/search-icon.png';
import filterIcon from 'assets/images/filter-icon.png';
import searchBlackIcon from 'assets/images/black-search-icon.png';

export const TransactionAdmin = () => {

  const transactionLogs = [
    { avatar: defaultAvatar, fullName: 'Karen Joyce Joson', transactionType: 'Sale', gallonType: 'Purified Blue Slim Gallon', quantity: '3 gallons', status: 'Complete', date: '2024-01-05', time: '10:30 AM'  },
    { avatar: defaultAvatar, fullName: 'Celmin Shane Quizon', transactionType: 'Purchase', gallonType: 'Dispenser Bottle Refill', quantity: '2 gallons', status: 'Pending', date: '2024-01-15', time: '11:45 AM' },
    { avatar: defaultAvatar, fullName: 'Miguel Angelo Barruga', transactionType: 'Sale', gallonType: 'Purified Blue Slim Gallon', quantity: '1 gallon', status: 'Complete', date: '2024-01-15', time: '02:20 PM' },
    { avatar: defaultAvatar, fullName: 'Francis Harvey Soriano', transactionType: 'Purchase', gallonType: 'Purified Blue Slim Gallon', quantity: '5 gallons', status: 'Queue', date: '2024-01-20', time: '09:00 AM' },
  ];

  const [filteredUsers, setFilteredUsers] = useState(transactionLogs);
  const [searchQuery, setSearchQuery] = useState("");

  //filtering search
  const handleSearchClick = () => {
    setFilteredUsers(transactionLogs.filter((log) =>
      log.fullName.toLowerCase().includes(searchQuery.toLowerCase()) 
    ));
   
  };

  return (

    <div>
      <div className="transactions-header">
        <h2 className="transactions-header-text">Transactions</h2>
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
      </div>
      <div className="users-table-container">
        <table className="transactions-table">
          <thead className="transactions-table-header">
            <tr>
              <th>Customer Name</th>
              <th>Transaction Type</th>
              <th>Gallon Type</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Date/Time</th>
            </tr>
          </thead>
          <tbody>
          {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center' }}>
                  No transaction found.
                </td>
              </tr>
            ) :
              ( filteredUsers.map((log, index) => (
                <tr key={index}>
                  <td className="customer-name">
                    <div className="transaction-info">
                      <img className="user-avatar" src={log.avatar} alt={`${log.fullName}'s avatar`} />
                      {log.fullName}
                    </div>
                  </td>
                  <td>{log.transactionType}</td>
                  <td>{log.gallonType}</td>
                  <td>{log.quantity}</td>
                  <td>{log.status}</td>
                  <td className='transaction-date-time'>
                    <div>{log.date}</div>
                    <div>{log.time}</div>
                  </td>
                </tr>
              )))}
          </tbody>
        </table>
      </div>
    </div>

  );
};
