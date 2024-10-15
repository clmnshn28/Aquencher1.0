import React, { useState, useEffect } from 'react';
import { IoFilterSharp } from 'react-icons/io5';
import {FaFilePdf} from "react-icons/fa";
import "assets/css/admin";

import * as images from 'assets/images';
import SearchBar from 'components/SearchBar';
import DropdownFilter from 'components/DropdownFilter';


export const TransactionAdmin = () => {

  const transactionLogs = [
    {id: 1,  avatar: images.defaultAvatar, fullName: 'Karen Joyce Joson', requestType: 'Refill', slimQuantity: 3, roundQuantity: 3, status: 'Pending', date: '2024-01-02', time: '9:00 AM' },
    {id: 2,  avatar: images.defaultAvatar, fullName: 'Celmin Shane Quizon', requestType: 'Return', slimQuantity: 0, roundQuantity: 3, status: 'In Progress', date: '2024-01-02', time: '9:00 AM'},
    {id: 3,  avatar: images.defaultAvatar, fullName: 'Miguel Angelo Barruga', requestType: 'Borrow', slimQuantity: 3, roundQuantity: 3, status: 'Completed', date: '2024-01-15', time: '02:20 PM' },
    {id: 4,  avatar: images.defaultAvatar, fullName: 'Francis Harvey Soriano', requestType: 'Refill', slimQuantity: 3, roundQuantity: 0, status: 'Cancelled', date: '2024-01-20', time: '09:00 AM' },
  ];

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState(transactionLogs);

  const getStatusColor = (value) =>{
    if(value === 'Pending') return '#F58E2F';
    if(value === 'In Progress') return '#0174CF';
    if (value === 'Completed') return '#169D00';
    return '#898988';
  }

  const [filters, setFilters] = useState({
    requestType: '',
    gallonType: '',
    status: '',
  });

  // clear
  const handleClearFilters = () => {
    setFilters({
        requestType: '',
        gallonType: '',
        status: '',
    });
    setSearchQuery('');
    setFilteredTransactions(transactionLogs); // Reset
    setActiveDropdown(null); 
  };

  // search filter
  const handleSearch = () =>{
    if(searchQuery !== ''){
      const result = transactionLogs.filter((transaction) =>
        transaction.fullName.toLocaleLowerCase().includes(searchQuery.toLocaleLowerCase())
      );
      setFilteredTransactions(result);
    }else {
      setFilteredTransactions(transactionLogs); // Reset when search is cleared
    }
  };

  useEffect(()=>{
    if(searchQuery === ''){
      setFilteredTransactions(transactionLogs);
    }
  },[searchQuery]);
   
  
  // dropdown filter 
  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters,
        [name]: value,
      };

      // Automatically filter requests based on the updated filters
      const results = transactionLogs.filter((transaction) => {
        return (
          (updatedFilters.requestType === '' || transaction.requestType === updatedFilters.requestType) &&
          (updatedFilters.gallonType === '' || 
            (updatedFilters.gallonType === 'Slim' && transaction.slimQuantity > 0) || 
            (updatedFilters.gallonType === 'Round' && transaction.roundQuantity > 0)
          ) && 
          (updatedFilters.status === '' || transaction.status === updatedFilters.status) 
        );
      });
      
      setFilteredTransactions(results);
      return updatedFilters;
    });
    setActiveDropdown(null);
  };

  // reveal or not in filter dropdown
  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  return (
    <>
      <div className="TransactionAdmin__header">
        <h2 className="TransactionAdmin__header-text">Transactions</h2>
      </div>
      <div className="TransactionAdmin__filter-container">
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
        />
        <IoFilterSharp  className="RequestsAdmin__filter-icon" />
        <DropdownFilter
          label={filters.requestType || "Request Type"}
          isOpen={activeDropdown === 'requestType'}
          toggleDropdown={() => toggleDropdown('requestType')}
          options={[
            { label: 'Refill', value: 'Refill' },
            { label: 'Return', value: 'Return' },
            { label: 'Borrow', value: 'Borrow' },
          ]}
          onOptionSelect={(value) => handleFilterChange('requestType', value)}
        />
        <DropdownFilter
          label={filters.gallonType || "Gallon Type"}
          isOpen={activeDropdown === 'gallonType'}
          toggleDropdown={()=> toggleDropdown('gallonType')}
          options={[
            {label: 'Slim', value: 'Slim'},
            {label: 'Round', value: 'Round'},
          ]}
          onOptionSelect={(value) => handleFilterChange('gallonType', value)}
        />
        <DropdownFilter
          label={filters.status || "Status"}
          isOpen={activeDropdown === 'status'}
          toggleDropdown={()=> toggleDropdown('status')}
          options={[
            {label: 'Completed', value: 'Completed'},
            {label: 'In Progress', value: 'In Progress'},
            {label: 'Pending', value: 'Pending'},
            {label: 'Cancelled', value: 'Cancelled'},
          ]}
          onOptionSelect={(value) => handleFilterChange('status', value)}
        />
        {(searchQuery || filters.requestType || filters.gallonType || filters.status) && (
          <button className="RequestsAdmin__clear-filters-button" onClick={handleClearFilters}>
            CLEAR
          </button>
        )}
        <button className="TransactionAdmin__pdf-button" >
          <FaFilePdf className="UsersAdmin__pdf-icon" /> Export to PDF
        </button>
      </div>
      <div className="TransactionAdmin__table-container">
        <table className="TransactionAdmin__table">
          <thead className="TransactionAdmin__table-header">
            <tr>
              <th style={{paddingLeft: '40px'}}>Date/Time</th>
              <th>Customer Name</th>
              <th>Request Type</th>
              <th>Gallon Type</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
          {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  <span className="TransactionAdmin__not-found">
                    No transactions found
                  </span>
                </td>
              </tr>
            ) :
              ( filteredTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td  style={{paddingLeft: '40px'}}>
                    <div className='TransactionAdmin__date-time'>
                      <span className="TransactionAdmin__date">{transaction.date}</span>
                      <span className="TransactionAdmin__time">{transaction.time}</span>
                    </div> 
                  </td>
                  <td>
                    <div className="TransactionAdmin__info">
                      <img className="TransactionAdmin__avatar" src={transaction.avatar} alt={`${transaction.fullName}'s avatar`} />
                      {transaction.fullName}
                    </div>
                  </td>
                  <td>{transaction.requestType}</td>
                  <td>Slim: {transaction.slimQuantity} , Round: {transaction.roundQuantity}</td>
                  <td style={{color: getStatusColor(transaction.status)}}>{transaction.status}</td>
                </tr>
              )))}
          </tbody>
        </table>
      </div>
    </>
  );
};
