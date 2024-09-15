import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { IoFilterSharp } from 'react-icons/io5';
import 'assets/css/admin';

import DropdownFilter from 'components/DropdownFilter';
import RejectedItem from 'components/RejectedItem';
import SearchBar from 'components/SearchBar';


export const RejectedAdmin = () =>{
    const [requests, setRequests] = useState([
        {id: 1, name: 'Miguel Angelo Barruga', address: '146 Dama De Notche Street, Bulihan', slimQuantity: 3, roundQuantity: 3, requestType: 'Refill', status: 'rejected', contactNumber: '09123892012', date: '2024-09-13', time: '9:00 AM' },
        {id: 2, name: 'Celmin Shane Quizon', address: '123 Dama De Notche Street, Bulihan', slimQuantity: 4, roundQuantity: 5, requestType: 'Return', status: 'rejected', contactNumber: '09123892012', date: '2024-09-13', time: '9:00 AM' },
        {id: 3, name: 'Karen Joyce Joson', address: '145 Dama De Notche Street, Bulihan', slimQuantity: 1, roundQuantity: 8, requestType: 'Borrow', status: 'rejected', contactNumber: '09123892012', date: '2024-09-13', time: '9:00 AM' },
        {id: 4, name: 'Francis Harvey Soriano', address: '156 Dama De Notche Street, Bulihan', slimQuantity: 0, roundQuantity: 7, requestType: 'Borrow', status: 'rejected', contactNumber: '09123892012', date: '2024-09-13', time: '9:00 AM' },
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


    return(
        <>
            <div className="RejectedAdmin__header">
                <h2 className="RejectedAdmin__header-text">Requests</h2>
                <Link to="/admin/requests/all-requests"  className='RejectedAdmin__link'>
                    <p className="RejectedAdmin__text">All Requests</p>
                </Link>
                <Link to="/admin/requests/queue"  className='RejectedAdmin__link'>
                    <p className="RejectedAdmin__queue-text">Queue</p>
                </Link>
                <Link to="/admin/requests/completed"  className='RejectedAdmin__link'>
                    <p className="RejectedAdmin__complete-text">Completed</p>
                </Link>
                <Link to="/admin/requests/rejected-requests"  className='RejectedAdmin__link'>
                    <p className="RejectedAdmin__rejected-requests">Rejected Request</p>
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
                label="Request Type"
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

            <div className="CompletedAdmin__container">
                {filteredRequests.length === 0 ? (
                    <div className="RequestsAdmin__not-found">
                        <span>No rejected requests found.</span>
                    </div>
                ) : (
                    filteredRequests.map((request, index) =>(
                        <RejectedItem
                            key={index}
                            name={request.name}
                            address={request.address}
                            slimQuantity={request.slimQuantity}
                            roundQuantity={request.roundQuantity}
                            requestType={request.requestType}
                            contact={request.contactNumber}
                            date={request.date}
                            time={request.time}
                        />  
                    ))
                )}
            </div>
        </>
    );
};