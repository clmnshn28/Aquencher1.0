import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoFilterSharp } from 'react-icons/io5';
import 'assets/css/admin';

import * as images from 'assets/images';
import DropdownFilter from 'components/DropdownFilter';
import RequestItem from 'components/RequestItem';
import SearchBar from 'components/SearchBar';
import { RejectedModal } from './modals';

export const RequestsAdmin = () =>{

  const [requests, setRequests] = useState([
    {id: 1, fname: 'Karen Joyce', lname: 'Joson',  house_number: '045', street: 'Dama De Notche Street', barangay: 'Bulihan', municipality_city: 'Malolos', province: 'Bulacan', postal_code: '3000', slimQuantity: 3, roundQuantity: 3, requestType: 'Refill', status: false, contactNumber: '09123892012', date: '2024-09-14', time: '9:00 AM', image: images.defaultAvatar},
    {id: 2, fname: 'Celmin Shane', lname: 'Quizon', house_number: '065', street: 'Dama De Notche Street', barangay: 'Bulihan', municipality_city: 'Malolos', province: 'Bulacan', postal_code: '3000', slimQuantity: 4, roundQuantity: 0, requestType: 'Return', status: false, contactNumber: '09123892012', date: '2024-09-14', time: '9:00 AM', image: images.defaultAvatar },
    {id: 3, fname: 'Miguel Angelo', lname: 'Barruga', house_number: '255', street: 'Dama De Notche Street', barangay: 'Bulihan', municipality_city: 'Malolos', province: 'Bulacan', postal_code: '3000', slimQuantity: 1, roundQuantity: 8, requestType: 'Borrow', status: false, contactNumber: '09123892012', date: '2024-09-14', time: '9:00 AM', image: images.defaultAvatar},
    {id: 4, fname: 'Francis Harvey', lname: 'Soriano', house_number: '085', street: 'Dama De Notche Street', barangay: 'Bulihan', municipality_city: 'Malolos', province: 'Bulacan', postal_code: '3000', slimQuantity: 0, roundQuantity: 7, requestType: 'Borrow', status: false, contactNumber: '09123892012', date: '2024-09-14', time: '9:00 AM', image: images.defaultAvatar },
  ]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRequests, setFilteredRequests] = useState(requests);
  const [isRejectedModalOpen, setIsRejectedModalOpen] = useState(false);
  const [rejectedRequestDetails, setRejectedRequestDetails] = useState(null);

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
      const results = requests.filter((request) => {
        const fullName = `${request.fname} ${request.lname}`.toLowerCase();
        const fullAddress = `${request.house_number} ${request.street}, ${request.barangay}`.toLowerCase();
    
        // Search by both name and address
        return (
            fullName.includes(searchQuery.toLowerCase()) || 
            fullAddress.includes(searchQuery.toLowerCase())
        );
    });
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
          ) 
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

  // filter date
  const today = new Date().toDateString();
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toDateString();
  
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() - 2); // Everything older than yesterday

   const filterByDate = (dateString, requestsList) => {
    return requestsList.filter(request => new Date(request.date).toDateString() === dateString);
  };

  const requestsToday = filterByDate(today, filteredRequests);
  const requestsYesterday = filterByDate(yesterday, filteredRequests);
  const requestsOlder = filteredRequests.filter(request => new Date(request.date) < thresholdDate);
  

  // function to decline/rejected button and open modal
  const handleDecline = (id) =>{
    const requestDetails = requests.find(request => request.id === id);
    setRejectedRequestDetails(requestDetails);
    setIsRejectedModalOpen(true);
  };

  // function to confirm reject
  const confirmRejected = (id) => {
    console.log('Request Rejected'); 
    setIsRejectedModalOpen(false);
  };


  // function accept button
  const handleAccept = (id) =>{
    console.log("handleAccept called with ID:", id); 
  };

  const formatAddress = (request) => {
    const { house_number, street, barangay} = request;
    return `${house_number} ${street}, ${barangay}`;
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
        <Link to="/admin/requests/rejected-requests"  className='RequestsAdmin__link'>
          <p className="RequestsAdmin__rejected-requests">Rejected Request</p>
        </Link>
      </div>

      <div className="RequestsAdmin__filter-container">
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
        {(searchQuery || filters.requestType || filters.gallonType) && (
          <button className="RequestsAdmin__clear-filters-button" onClick={handleClearFilters}>
            CLEAR
          </button>
        )}
      </div>

      <div className="RequestsAdmin__container">
        <div className="RequestsAdmin__section">
          <h3>Today</h3>
          {requestsToday.length > 0 ? (
            requestsToday.map(request => (
              <RequestItem
                key={request.id}
                name={`${request.fname} ${request.lname}`}
                address={formatAddress(request)}
                slimQuantity={request.slimQuantity}
                roundQuantity={request.roundQuantity}
                requestType={request.requestType}
                status={request.status}
                contact={request.contactNumber}
                date={request.date}
                time={request.time}
                image={request.image}
                onDecline={() => handleDecline(request.id)}
                onAccept={() => handleAccept(request.id)}
              />
            ))
          ) : (
            <p className='RequestsAdmin__no-request'>No requests for Today</p>
          )}
        </div>

        <div className="RequestsAdmin__section">
          <h3>Yesterday</h3>
          {requestsYesterday.length > 0 ? (
            requestsYesterday.map(request => (
              <RequestItem
                key={request.id}
                name={`${request.fname} ${request.lname}`}
                address={formatAddress(request)}
                slimQuantity={request.slimQuantity}
                roundQuantity={request.roundQuantity}
                requestType={request.requestType}
                status={request.status}
                contact={request.contactNumber}
                date={request.date}
                time={request.time}
                image={request.image}
                onDecline={() => handleDecline(request.id)}
                onAccept={() => handleAccept(request.id)}
              />
            ))
          ) : (
            <p className='RequestsAdmin__no-request'>No requests for Yesterday</p>
          )}
        </div>
        
        <div className="RequestsAdmin__section">
          <h3>Older</h3>
          {requestsOlder.length > 0 ? (
            requestsOlder.map(request => (
              <RequestItem
                key={request.id}
                name={`${request.fname} ${request.lname}`}
                address={formatAddress(request)}
                slimQuantity={request.slimQuantity}
                roundQuantity={request.roundQuantity}
                requestType={request.requestType}
                status={request.status}
                contact={request.contactNumber}
                date={request.date}
                time={request.time}
                image={request.image}
                onDecline={() => handleDecline(request.id)}
                onAccept={() => handleAccept(request.id)}
              />
            ))
          ) : (
            <p className='RequestsAdmin__no-request'>No requests for Older dates</p>
          )}
        </div>
        
      </div>
      <RejectedModal
        isOpen={isRejectedModalOpen}
        onClose={() => setIsRejectedModalOpen(false)}
        onConfirm={confirmRejected}
        rejectedDetails={rejectedRequestDetails}
      />
    </>

  );
}
