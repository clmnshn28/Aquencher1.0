import React, {useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { IoFilterSharp } from 'react-icons/io5';
import { IoIosArrowRoundBack, IoIosArrowRoundForward  } from "react-icons/io";
import 'assets/css/admin';
import axios from 'axios';
import {API_URL} from 'constants';
import { format } from 'date-fns';

import * as images from 'assets/images';
import DropdownFilter from 'components/DropdownFilter';
import RejectedItem from 'components/RejectedItem';
import SearchBar from 'components/SearchBar';


export const RejectedAdmin = () =>{
    const [requests, setRequests] = useState([]);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredRequests, setFilteredRequests] = useState([]);
    const initialFetchDone = useRef(false);
    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(()=>{
        if (!initialFetchDone.current) {
            fetchGallonsRequest();
            initialFetchDone.current = true;
        }
      },[])
  
      const fetchGallonsRequest = async () =>{
          try{
            const response = await axios.get(API_URL + '/api/gallon-delivery/cancelled',{
              headers: {
                'Authorization' : `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
              },
            });
            const requestsWithUpdatedDateTime = response.data.data
            .map((request) => {
              const updatedAt = new Date(request.updated_at);
              const formattedDate = format(updatedAt, 'yyyy-MM-dd');
              const formattedTime = format(updatedAt, 'hh:mm a');
  
              let slimQuantity = 0;
              let roundQuantity = 0;
        
              const quantitiesArray = request.quantities.split(', ');
                quantitiesArray.forEach(quantity => {
                  // Extract key and value
                  const [key, value] = quantity.split(': ').map(str => str.trim());
                  // Assign values based on key
                  if (key === '1') slimQuantity = parseInt(value) || 0;
                  if (key === '2') roundQuantity = parseInt(value) || 0;
              });
  
              return {
                ...request,
                date: formattedDate, 
                time: formattedTime, 
                slimQuantity,
                roundQuantity,
                updatedAt,
              };
            }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  
            setRequests(requestsWithUpdatedDateTime);
            setFilteredRequests(requestsWithUpdatedDateTime);
          }catch(error){
            console.error('Error fetching gallon delivery requests:', error);
          }
      };
  
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const paginatedRejectedRequests = filteredRequests.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);

    
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
                    (updatedFilters.requestType === '' || request.request_type === updatedFilters.requestType) &&
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

    const formatAddress = (request) => {
        const { house_number, street, barangay} = request;
        return `${house_number} ${street}, ${barangay}`;
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
                label={filters.requestType || "Request Type"}
                isOpen={activeDropdown === 'requestType'}
                toggleDropdown={() => toggleDropdown('requestType')}
                options={[
                    { label: 'Refill', value: 'refill' },
                    { label: 'Return', value: 'return' },
                    { label: 'Borrow', value: 'borrow' },
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
           
                {(searchQuery || filters.requestType || filters.gallonType ) && (
                <button className="RequestsAdmin__clear-filters-button" onClick={handleClearFilters}>
                    CLEAR
                </button>
                )}
            </div>

            <div className="CompletedAdmin__container">
                {paginatedRejectedRequests.length === 0 ? (
                    <div className="RequestsAdmin__not-found">
                        <span>No rejected requests</span>
                    </div>
                ) : (
                    paginatedRejectedRequests.map((request) =>(
                        <RejectedItem
                            key={request.gallon_delivery_id}
                            name={`${request.fname} ${request.lname}`}
                            address={formatAddress(request)}
                            slimQuantity={request.slimQuantity}
                            roundQuantity={request.roundQuantity}
                            requestType={request.request_type}
                            contact={request.contact_number}
                            image={request.image ? `${API_URL}/storage/images/${request.image}` : images.defaultAvatar}
                            date={request.date}
                            time={request.time}
                            reason={request.reason}
                        />  
                    ))
                )}
            </div>
            {filteredRequests.length > ITEMS_PER_PAGE && (
            <div className="Transaction__pagination">
                <button 
                    className="pagination-arrow" 
                    disabled={currentPage === 1} 
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    <IoIosArrowRoundBack  className="pagination-arrow-icon"/>
                </button>
                <span className="pagination-number">
                    {currentPage} of {totalPages}
                </span>
                <button 
                    className="pagination-arrow" 
                    disabled={currentPage === totalPages} 
                    onClick={() => handlePageChange(currentPage + 1)}
                >
                <IoIosArrowRoundForward className="pagination-arrow-icon"/>
                </button>
            </div>
        )}
        </>
    );
};