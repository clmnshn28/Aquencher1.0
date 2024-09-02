import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoFilterSharp } from 'react-icons/io5';
import 'assets/css/admin';

import * as images from 'assets/images';
import DropdownFilter from 'components/DropdownFilter';
import RequestItem from 'components/RequestItem';

export const RequestsAdmin = () =>{

  const [requests, setRequests] = useState([
    {id: 1, name: 'Miguel Angelo Barruga', address: '146 Dama De Notche Street, Bulihan', slimQuantity: 3, roundQuantity: 3, requestType: 'Refill', status: false },
    {id: 2, name: 'Celmin Shane Quizon', address: '123 Dama De Notche Street, Bulihan', slimQuantity: 4, roundQuantity: 5, requestType: 'Return', status: false },
    {id: 3, name: 'Karen Joyce Joson', address: '145 Dama De Notche Street, Bulihan', slimQuantity: 1, roundQuantity: 8, requestType: 'Borrow', status: false },
    {id: 4, name: 'Francis Harvey Soriano', address: '156 Dama De Notche Street, Bulihan', slimQuantity: 0, roundQuantity: 7, requestType: 'Borrow', status: false },
  ]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRequests, setFilteredRequests] = useState(requests);

  const [filters, setFilters] = useState({
    requestType: '',
    gallonType: '',
    address: '',
  });

  const handleClearFilters = () => {
    setFilters({
      requestType: '',
      gallonType: '',
      address: '',
    });
    setSearchQuery('');
    setFilteredRequests(requests); // Reset
    setActiveDropdown(null); 
  };

  const handleSearch = () => {
    if (searchQuery !== '') {
      const results = requests.filter((request) => 
        request.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredRequests(results);
    }
  };

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredRequests(requests);
    }
  }, [searchQuery, requests]);


  const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters,
        [name]: value,
      };

      // Automatically filter requests based on the updated filters
      const results = requests.filter((request) => {
        return (
          (updatedFilters.requestType === '' || request.requestType === updatedFilters.requestType) &&
          (updatedFilters.gallonType === '' || 
            (updatedFilters.gallonType === 'Slim' && request.slimQuantity > 0) || 
            (updatedFilters.gallonType === 'Round' && request.roundQuantity > 0)
          ) &&
          (updatedFilters.address === '' || request.address.toLowerCase().includes(updatedFilters.address.toLowerCase()))
        );
      });
      
      setFilteredRequests(results);
      return updatedFilters;
    });
    setActiveDropdown(null);
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleAccept = (id) =>{
    console.log("handleAccept called with ID:", id); 
  };

  const handleDecline = (id) =>{
    console.log("handleDecline called with ID:", id); 
  };

  return (

    <>
      <div className="RequestsAdmin__header">
        <h2 className="RequestsAdmin__header-text">Requests</h2>
        <Link to="/admin/requests/all-requests"  className='RequestsAdmin__link'>
          <p className="RequestsAdmin__text">All Requests</p>
        </Link>
        <Link to="/admin/requests/queue"  className='RequestsAdmin__link'>
          <p className="RequestsAdmin__queue-text">Queue</p>
        </Link>
        <Link to="/admin/requests/completed"  className='RequestsAdmin__link'>
          <p className="RequestsAdmin__complete-text">Completed</p>
        </Link>
      </div>

      <div className="RequestsAdmin__filter-container">
        <div className="RequestsAdmin__search-bar-container">
          <input 
            type="text" 
            placeholder="Search" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
          <button className="RequestsAdmin__search-button" onClick={handleSearch}>
            <img src={images.searchIcon} alt="Search Icon" />
          </button>
        </div>
        <IoFilterSharp  className="RequestsAdmin__filter-icon" />
        <DropdownFilter
          label="Transaction Type"
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
          label="Gallon Type"
          isOpen={activeDropdown === 'gallonType'}
          toggleDropdown={()=> toggleDropdown('gallonType')}
          options={[
            {label: 'Slim', value: 'Slim'},
            {label: 'Round', value: 'Round'},
          ]}
          onOptionSelect={(value) => handleFilterChange('gallonType', value)}
        />
        <DropdownFilter
          label="Address"
          isOpen={activeDropdown === 'address'}
          toggleDropdown={() => toggleDropdown('address')}
          options={requests.map((request) => ({ label: request.address, value: request.address }))}
          onOptionSelect={(value) => handleFilterChange('address', value)}
        />
        {(searchQuery || filters.requestType || filters.gallonType || filters.address) && (
          <button className="RequestsAdmin__clear-filters-button" onClick={handleClearFilters}>
            CLEAR
          </button>
        )}
      </div>

      <div className="RequestsAdmin__container">
        {filteredRequests.length === 0 ? (
          <div className="RequestsAdmin__not-found">
            <span>No requests found.</span>
          </div>
        ) : (
        filteredRequests.map((request) =>(
          <RequestItem
          key={request.id}
          name={request.name}
          address={request.address}
          slimQuantity={request.slimQuantity}
          roundQuantity={request.roundQuantity}
          requestType={request.requestType}
          status={request.status}
          onAccept={()=> handleAccept(request.id)}
          onDecline={()=> handleDecline(request.id)}
          />
          ))
        )}
      </div>
      
    </>

  );
}
