  import React, { useState, useEffect, useRef  } from 'react';
  import { Link } from 'react-router-dom';
  import { IoFilterSharp } from 'react-icons/io5';
  import 'assets/css/admin';
  import axios from 'axios';
  import {API_URL} from 'constants';
  import { format } from 'date-fns';
  import { useAuth } from "context/AuthContext";

  import * as images from 'assets/images';
  import DropdownFilter from 'components/DropdownFilter';
  import RequestItem from 'components/RequestItem';
  import SearchBar from 'components/SearchBar';
  import { RejectedModal, InsufficientModal } from './modals';
 
  export const RequestsAdmin = () =>{
    const { authUserObj, setAuthUserObj } = useAuth(); 

    const [requests, setRequests] = useState([]);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredRequests, setFilteredRequests] = useState([]);
    const [isRejectedModalOpen, setIsRejectedModalOpen] = useState(false);
    const [rejectedRequestDetails, setRejectedRequestDetails] = useState(null);
    const [products, setProducts] = useState([]);
    const [isBorrowInsufficient, setIsBorrowInsufficient] = useState(false);
    const [isAccepting, setIsAccepting] = useState(false);
    const initialFetchDone = useRef(false);

    useEffect(()=>{
      if (!initialFetchDone.current) {
        if (authUserObj.products.length === 0) fetchProduct();
        fetchGallonsRequest();
        initialFetchDone.current = true;
      }
    },[])

    const fetchProduct = async () =>{
      try{

        const responseProduct = await axios.get(API_URL +'/api/admin/products', {
          headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}` 
          }
        });
        setAuthUserObj(prevState => ({
          ...prevState,
          products: responseProduct
        }));

        setProducts(responseProduct.data.data); 

      }catch(error){
        console.error('Error fetching gallon delivery requests:', error);
      }
  };

    const fetchGallonsRequest = async () =>{
        try{
          const response = await axios.get(API_URL + '/api/gallon-delivery/pending',{
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
            };
          });

          setRequests(requestsWithUpdatedDateTime);
          setFilteredRequests(requestsWithUpdatedDateTime);
        }catch(error){
          console.error('Error fetching gallon delivery requests:', error);
        }
    };


    const [filters, setFilters] = useState({
      requestType: '',
      gallonType: '',
    });

    const handleClearFilters = () => {
      setFilters({
        requestType: '',
        gallonType: '',
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
    const handleDecline = (requestDetails) =>{
      setRejectedRequestDetails(requestDetails);
      setIsRejectedModalOpen(true);
    };

    // function to confirm reject
    const confirmRejected = async (rejectionReason) => {
        try{
          await axios.put(`${API_URL}/api/gallon-delivery/${rejectedRequestDetails.gallon_delivery_id}/decline`,{
            reason: rejectionReason,
            refill_id: rejectedRequestDetails.refill_id,
            borrow_id: rejectedRequestDetails.borrow_id,
            returned_id: rejectedRequestDetails.returned_id,
            gallon_type: rejectedRequestDetails.request_type,
          },{
              headers:{
                'Authorization' : `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
              },
          });
        setFilteredRequests((prevFiltered) => 
            prevFiltered.filter(request => request.gallon_delivery_id !== rejectedRequestDetails.gallon_delivery_id)
        );
          console.log('Request Rejected');
        }catch(error){
          console.log('Error rejecting the request: ', error);
        }finally{
          setIsRejectedModalOpen(false);
          setRejectedRequestDetails(null); 
        }

    };


    // function accept button
    const handleAccept = async (requestDetails) =>{
      setIsAccepting(true); 

        try{
          const { gallon_delivery_id, request_type, borrow_id, refill_id, returned_id, slimQuantity, roundQuantity } = requestDetails;

          const borrowData = [
            { gallon_id: 1, quantity: slimQuantity, available_stock: products.find(p => p.id === 1)?.available_stock || 0 },
            { gallon_id: 2, quantity: roundQuantity, available_stock: products.find(p => p.id === 2)?.available_stock || 0 }
          ].filter(item => item.quantity > 0);

          if (request_type === 'borrow') {
            const insufficientStock = borrowData.some(item => item.quantity > item.available_stock);
      
            if (insufficientStock) {
              setIsBorrowInsufficient(true);
              setIsAccepting(false);
              return; // Stop execution if stock is insufficient
            }
          }

          await axios.put(`${API_URL}/api/gallon-delivery/${gallon_delivery_id}/queueing`, {
            gallon_type: request_type,
            refill_id: refill_id,
            borrow_id: borrow_id,
            returned_id: returned_id,
            data: borrowData,
          },{
              headers:{
                'Authorization' : `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
              },
          });
          setFilteredRequests((prevFiltered) => 
            prevFiltered.filter(request => request.gallon_delivery_id !== gallon_delivery_id)
        );
        }catch(error){
            console.error('Error rejecting the request: ', error);
        } finally {
          setIsAccepting(false);
        }

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
              requestsToday.map((request) => (
                <RequestItem
                  key={request.gallon_delivery_id}
                  name={`${request.fname} ${request.lname}`}
                  address={formatAddress(request)}
                  slimQuantity={request.slimQuantity}
                  roundQuantity={request.roundQuantity}
                  requestType={request.request_type}
                  status={request.gallon_delivery_status }
                  contact={request.contact_number}
                  date={request.date}
                  time={request.time}
                  image={request.image ? `${API_URL}/storage/images/${request.image}` : images.defaultAvatar}
                  onDecline={() => handleDecline(request)}
                  onAccept={() => handleAccept(request)}
                  acceptDisabled={isAccepting}
                />
              ))
            ) : (
              <p className='RequestsAdmin__no-request'>No requests for Today</p>
            )}
          </div>

          <div className="RequestsAdmin__section">
            <h3>Yesterday</h3>
            {requestsYesterday.length > 0 ? (
              requestsYesterday.map((request)  => (
                <RequestItem
                  key={request.gallon_delivery_id}
                  name={`${request.fname} ${request.lname}`}
                  address={formatAddress(request)}
                  slimQuantity={request.slimQuantity}
                  roundQuantity={request.roundQuantity}
                  requestType={request.request_type}
                  status={request.gallon_delivery_status }
                  contact={request.contact_number}
                  date={request.date}
                  time={request.time}
                  image={request.image ? `${API_URL}/storage/images/${request.image}` : images.defaultAvatar}
                  onDecline={() => handleDecline(request)}
                  onAccept={() => handleAccept(request)}
                  acceptDisabled={isAccepting}
                />
              ))
            ) : (
              <p className='RequestsAdmin__no-request'>No requests for Yesterday</p>
            )}
          </div>
          
          <div className="RequestsAdmin__section">
            <h3>Older</h3>
            {requestsOlder.length > 0 ? (
              requestsOlder.map((request)  => (
                <RequestItem
                  key={request.gallon_delivery_id}
                  name={`${request.fname} ${request.lname}`}
                  address={formatAddress(request)}
                  slimQuantity={request.slimQuantity}
                  roundQuantity={request.roundQuantity}
                  requestType={request.request_type}
                  status={request.gallon_delivery_status}
                  contact={request.contact_number}
                  date={request.date}
                  time={request.time}
                  image={request.image ? `${API_URL}/storage/images/${request.image}` : images.defaultAvatar}
                  onDecline={() => handleDecline(request)}
                  onAccept={() => handleAccept(request)}
                  acceptDisabled={isAccepting}
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
        <InsufficientModal
          isOpen = {isBorrowInsufficient}
          onClose = {()=> setIsBorrowInsufficient(false)}       
        />
      </>

    );
  }
