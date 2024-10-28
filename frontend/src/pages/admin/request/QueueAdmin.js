import React, {useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { IoFilterSharp } from 'react-icons/io5';
import {FaFilePdf} from "react-icons/fa";
import 'assets/css/admin';
import axios from 'axios';
import {API_URL} from 'constants';
import { useAuth } from "context/AuthContext";

import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as images from 'assets/images';
import DropdownFilter from 'components/DropdownFilter';
import QueueItem from "components/QueueItem";
import SearchBar from "components/SearchBar";
import { RejectedModal } from './modals';

export const QueueAdmin = () =>{
    const { authUserObj, setAuthUserObj } = useAuth(); 
    
    const [queues, setQueues] = useState([]);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        requestType: '',
        gallonType: '',
    });
    const [filteredPickupRequests, setFilteredPickupRequests] = useState([]);
    const [filteredDeliverRequests, setFilteredDeliverRequests] = useState([]);
    const [products, setProducts] = useState([]);
    const [isRejectedModalOpen, setIsRejectedModalOpen] = useState(false);
    const [rejectedQueueDetails, setRejectedQueueDetails] = useState(null);
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
             
        setProducts(responseProduct.data.data);

        setAuthUserObj(prevState => ({
            ...prevState,
            products: responseProduct
        }));
  
  
        }catch(error){
          console.error('Error fetching gallon delivery requests:', error);
        }
    };

    const fetchGallonsRequest = async () =>{
        try{
            const pickupResponse = await axios.get(`${API_URL}/api/gallon-delivery/pickup`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
                },
            });
    
            const deliverResponse = await axios.get(`${API_URL}/api/gallon-delivery/deliver`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
                },
            });
    
            const combinedRequests = [...pickupResponse.data.data, ...deliverResponse.data.data];

        const requestsWithUpdatedDateTime =combinedRequests.map((queue) => {
            const updatedAt = new Date(queue.updated_at);
            const formattedDate = format(updatedAt, 'yyyy-MM-dd');
            const formattedTime = format(updatedAt, 'hh:mm a');

            let slimQuantity = 0;
            let roundQuantity = 0;
    
            const quantitiesArray = queue.quantities.split(', ');
            quantitiesArray.forEach(quantity => {
                // Extract key and value
                const [key, value] = quantity.split(': ').map(str => str.trim());
                // Assign values based on key
                if (key === '1') slimQuantity = parseInt(value) || 0;
                if (key === '2') roundQuantity = parseInt(value) || 0;
            });

            return {
            ...queue,
            date: formattedDate, 
            time: formattedTime, 
            slimQuantity,
            roundQuantity,
            };
        });

        setQueues(requestsWithUpdatedDateTime);
        }catch(error){
        console.error('Error fetching gallon delivery requests:', error);
        }
    };

    // Reset or apply filters based on search query
    const pickupRequests = queues.filter(queue =>
        (queue.request_type === 'refill' && queue.gallon_delivery_status === 'pickup') ||
        (queue.request_type === 'return' &&  queue.gallon_delivery_status === 'pickup')
    );

    const deliverRequests = queues.filter(queue =>
        (queue.request_type === 'refill' && queue.gallon_delivery_status === 'deliver') ||
        (queue.request_type === 'borrow' &&  queue.gallon_delivery_status === 'deliver')
    );

    // manually trigger the search
    const handleSearch = () => {
        const applyFilters = (requests) => {
            return requests.filter(queue => {
                const fullName = `${queue.fname} ${queue.lname}`.toLowerCase(); 
                const fullAddress = `${queue.house_number} ${queue.street}, ${queue.barangay}`.toLowerCase();
            
                return (
                    ( fullName.includes(searchQuery.toLowerCase()) || fullAddress.includes(searchQuery.toLowerCase())) 
                );
            });
        };
        setFilteredPickupRequests(applyFilters(pickupRequests));
        setFilteredDeliverRequests(applyFilters(deliverRequests));
    };

    // apply filters on component mount and when filters change or search query is cleared
    useEffect(() => {
        const applyFilters = (requests) => {
            return requests.filter(queue => {
                return (
                    (filters.requestType === '' || queue.request_type === filters.requestType) &&
                    (filters.gallonType === '' ||
                        (filters.gallonType === 'Slim' && queue.slimQuantity > 0) ||
                        (filters.gallonType === 'Round' && queue.roundQuantity > 0)
                    ) 
                );
            });
        };
    
        if (searchQuery === '') {
            setFilteredPickupRequests(applyFilters(pickupRequests));
            setFilteredDeliverRequests(applyFilters(deliverRequests));
        } 

    }, [searchQuery, filters, queues]);
    

    const handleClearFilters = () =>{
        setFilters({
            requestType: '',
            gallonType: '',
        });
        setSearchQuery('');
        setActiveDropdown(null);
    };

    const handleFilterChange = (name, value) =>{
        setFilters((prevFilters)=>{
            const updatedFilters = {
                ...prevFilters,
                [name]: value,
            };
            return updatedFilters;
        });
        setActiveDropdown(null);
    };
 
    
    const toggleDropdown = (dropdown) => {
        setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
    };

    const handleAccept = async (requestDetails) => {
        setIsAccepting(true); 

        try{

            const { gallon_delivery_id, customer_id, request_type, refill_id, borrow_id, returned_id, slimQuantity, roundQuantity, gallon_delivery_status } = requestDetails;

            const returnedData = [
                { gallon_id: 1, quantity: slimQuantity, available_stock: products.find(p => p.id === 1)?.available_stock || 0 },
                { gallon_id: 2, quantity: roundQuantity, available_stock: products.find(p => p.id === 2)?.available_stock || 0 }
            ].filter(item => item.quantity > 0);

            await axios.put(`${API_URL}/api/gallon-delivery/${gallon_delivery_id}/completed`, {
                gallon_type: request_type,
                gallon_status: gallon_delivery_status,
                refill_id: refill_id,
                borrow_id: borrow_id,
                returned_id: returned_id, 
                data: returnedData,
                customer_id: customer_id,
            },{
                headers:{
                'Authorization' : `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
                },
            });
            fetchGallonsRequest(); 

        }catch(error){
            console.error('Error rejecting the request: ', error);
        }finally {
            setIsAccepting(false);
        }
    };

    // function to decline/rejected button and open modal
    const handleDecline = (queueDetails) =>{
        setRejectedQueueDetails(queueDetails);
        setIsRejectedModalOpen(true);
    };
  
    // function to confirm reject
    const confirmRejected = async (rejectionReason) => {
          try{
            await axios.put(`${API_URL}/api/gallon-delivery/${rejectedQueueDetails.gallon_delivery_id}/decline`,{
              reason: rejectionReason,
              refill_id: rejectedQueueDetails.refill_id,
              borrow_id: rejectedQueueDetails.borrow_id,
              returned_id: rejectedQueueDetails.returned_id,
              gallon_type: rejectedQueueDetails.request_type,
            },{
                headers:{
                  'Authorization' : `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
                },
            });

            if (rejectedQueueDetails.gallon_delivery_status === 'pickup') {
                setFilteredPickupRequests(prevFiltered => 
                    prevFiltered.filter(request => request.gallon_delivery_id !== rejectedQueueDetails.gallon_delivery_id)
                );
            } else if (rejectedQueueDetails.gallon_delivery_status === 'deliver') {
                setFilteredDeliverRequests(prevFiltered => 
                    prevFiltered.filter(request => request.gallon_delivery_id !== rejectedQueueDetails.gallon_delivery_id)
                );
            }
            console.log('Request Rejected');
          }catch(error){
            console.log('Error rejecting the request: ', error);
          }finally{
            setIsRejectedModalOpen(false);
            setRejectedQueueDetails(null); 
          }
  
    };

    const formatAddress = (queue) => {
        const { house_number, street, barangay} = queue;
        return `${house_number} ${street}, ${barangay}`;
    };

    const handleExportToPDF = () => {
        if (queues.length === 0) {
            alert("No data available to export.");
            return;
        }

        const doc = new jsPDF();
        const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(); 
        const imgData = images.loginLogo;
        
        const sortByAddress = (requests) => {
            return requests.sort((a, b) => {
                const addressA = formatAddress(a).toLowerCase();
                const addressB = formatAddress(b).toLowerCase();
                return addressA.localeCompare(addressB);
            });
        };

        const createTable = (title, requests, startY) => {
            doc.setFont("Helvetica", "bold").setFontSize(13);
            doc.setTextColor(0, 105, 217);
            doc.text(title, doc.internal.pageSize.getWidth() / 2, startY -4, { align: "center" });
            doc.autoTable({
                startY,
                head: [['Name', 'Address', 'Contact', 'Slim Quantity', 'Round Quantity', 'Request Type', 'Status', 'Date/Time']],
                body: requests.map(queue => [
                    `${queue.fname} ${queue.lname}`,
                    formatAddress(queue),
                    queue.contact_number,
                    queue.slimQuantity,
                    queue.roundQuantity,
                    capitalize(queue.request_type),
                    capitalize(queue.gallon_delivery_status),
                    `${queue.date} ${queue.time}`
                ]),
                theme: 'striped',
                styles: {
                    cellPadding: 3,
                    fontSize: 10,
                    halign: 'center',
                    valign: 'middle',
                    lineColor: [154, 154, 154], 
                    lineWidth: 0.1, 
                },
                headStyles: {
                    fillColor: [0, 105, 217],
                    fontSize: 10,
                },
                margin: { top: 35, left: 5, right: 5 },
            }); 
        };

        const getCurrentDateTime = () => {
            const now = new Date();
            return format(now, 'MM-dd-yyyy hh:mm a');
        };
    
        const formattedDateTime = getCurrentDateTime();
        // Date time
        doc.setFontSize(9);
        doc.setFont("Helvetica", "normal");
        doc.setTextColor(195, 195, 195);
        const dateTimeX = doc.internal.pageSize.getWidth() - 5; 
        doc.text(`Report Generated On: ${formattedDateTime}`, dateTimeX, 5, { align: 'right' });
    
        doc.addImage(imgData, 'PNG', 20, 3, 30, 23);

        // Report Header
        doc.setFont("Helvetica", "bold").setFontSize(20);
        doc.setTextColor(0, 105, 217);
        doc.text("Gallon Delivery Requests", doc.internal.pageSize.getWidth() / 2, 18, { align: "center" });

        // Type of Report
        doc.setFontSize(9);
        const reportTypeY = 15;
        const reportTypeText = "In Progress Requests Report"; 

        doc.setFont("Helvetica", "bold");
        const reportTypeLabelX = doc.internal.pageSize.getWidth() - 21; 
        const reportTypeValueX = doc.internal.pageSize.getWidth() - 10; 

        doc.text("Report Type:", reportTypeLabelX, reportTypeY, { align: "right" });
        doc.setFont("Helvetica", "normal");
        doc.text(reportTypeText, reportTypeValueX, reportTypeY + 5, { align: "right" });
  
        const sortedPickupRequests = sortByAddress(filteredPickupRequests);
        const sortedDeliverRequests = sortByAddress(filteredDeliverRequests);

        createTable('Pickup Requests', sortedPickupRequests, 30);
        //(Add New Page)
        doc.addPage();
        createTable('Deliver Requests', sortedDeliverRequests, 20);

        const pageCount = doc.internal.getNumberOfPages(); // Get total pages
        for (let i = 1; i <= pageCount; i++) { // Start from the second page
            doc.setPage(i); // Set the current page
            doc.setFontSize(11);
            doc.setFont("Helvetica", "bold");
            doc.text(`Page ${i}`, doc.internal.pageSize.getWidth() - 18, doc.internal.pageSize.getHeight() - 13, { align: "right" });
        }
        doc.save(`Gallon_Delivery_Requests_${formattedDateTime}.pdf`);
    };

    return(
        <>
            <div className="QueueAdmin__header">
                <h2 className="QueueAdmin__header-text">Requests</h2>
                <Link to="/admin/requests/all-requests"  className='QueueAdmin__link'>
                    <p className="QueueAdmin__text">All Requests</p>
                </Link>
                <Link to="/admin/requests/queue"  className='QueueAdmin__link'>
                    <p className="QueueAdmin__queue-text">Queue</p>
                </Link>
                <Link to="/admin/requests/completed"  className='QueueAdmin__link'>
                    <p className="QueueAdmin__complete-text">Completed</p>
                </Link>
                <Link to="/admin/requests/rejected-requests"  className='RequestsAdmin__link'>
                    <p className="RequestsAdmin__rejected-requests">Rejected Request</p>
                </Link>
            </div>

            <div className="QueueAdmin__filter-container">
                <div className="UsersAdmin__controls-filter">
                    <SearchBar
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        handleSearch={handleSearch}
                    />
                    <IoFilterSharp  className="QueueAdmin__filter-icon" />
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
                        <button className="QueueAdmin__clear-filters-button" onClick={handleClearFilters}>
                            CLEAR
                        </button>
                    )}
                </div>
                <button className="UsersAdmin__pdf-button" onClick={handleExportToPDF}>
                    <FaFilePdf className="UsersAdmin__pdf-icon" /> Export to PDF
                </button>
            </div>

            <div className="QueueAdmin__container">
                <div className="QueueAdmin__pickup-section">
                    <div className="QueueAdmin__title">
                        <h2>Pickup</h2>
                    </div>
                    {filteredPickupRequests.length === 0 ? (
                        <div className="RequestsAdmin__not-found">
                            <span>No pickup requests</span>
                        </div>
                    ) : (
                        filteredPickupRequests.map((queue) =>(
                            <QueueItem
                                key={queue.gallon_delivery_id}
                                name={`${queue.fname} ${queue.lname}`}
                                address={formatAddress(queue)}
                                slimQuantity={queue.slimQuantity}
                                roundQuantity={queue.roundQuantity}
                                requestType={queue.request_type}
                                contact={queue.contact_number}
                                status={queue.gallon_delivery_status}
                                date={queue.date}
                                time={queue.time}
                                image={queue.image ? `${API_URL}/storage/images/${queue.image}` : images.defaultAvatar}
                                onDecline={() => handleDecline(queue)}
                                onAccept={()=> handleAccept(queue)}
                                acceptDisabled={isAccepting}
                            />
                        ))
                    )}

                </div>
                <div className="QueueAdmin__deliver-section">
                    <div className="QueueAdmin__title">
                        <h2>Deliver</h2>
                    </div>
                    {filteredDeliverRequests.length === 0 ? (
                        <div className="RequestsAdmin__not-found">
                            <span>No deliver requests</span>
                        </div>
                    ) : (
                        filteredDeliverRequests.map((queue) =>(
                            <QueueItem
                                key={queue.gallon_delivery_id}
                                name={`${queue.fname} ${queue.lname}`}
                                address={formatAddress(queue)}
                                slimQuantity={queue.slimQuantity}
                                roundQuantity={queue.roundQuantity}
                                requestType={queue.request_type}
                                contact={queue.contact_number}
                                status={queue.gallon_delivery_status }
                                date={queue.date}
                                time={queue.time}
                                image={queue.image ? `${API_URL}/storage/images/${queue.image}` : images.defaultAvatar}
                                onDecline={() => handleDecline(queue)}
                                onAccept={()=> handleAccept(queue)}
                                acceptDisabled={isAccepting}
                            />
                        ))
                    )}
                    
                </div>
            </div>

            <RejectedModal
                isOpen={isRejectedModalOpen}
                onClose={() => setIsRejectedModalOpen(false)}
                onConfirm={confirmRejected}
                rejectedDetails={rejectedQueueDetails}
            />
        </>
    );
};