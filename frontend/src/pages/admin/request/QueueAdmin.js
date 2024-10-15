import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { IoFilterSharp } from 'react-icons/io5';
import {FaFilePdf} from "react-icons/fa";
import 'assets/css/admin';
import axios from 'axios';
import {API_URL} from 'constants';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as images from 'assets/images';
import DropdownFilter from 'components/DropdownFilter';
import QueueItem from "components/QueueItem";
import SearchBar from "components/SearchBar";

export const QueueAdmin = () =>{

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

    useEffect(()=>{
        fetchGallonsRequest();
    },[])
  
    const fetchGallonsRequest = async () =>{
        try{
            const pickupResponse = await axios.get(`${API_URL}/api/gallon-delivery/pickup`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
    
            const deliverResponse = await axios.get(`${API_URL}/api/gallon-delivery/deliver`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
            });
         
            const responseProduct = await axios.get(API_URL +'/api/admin/products', {
                headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
                }
              });
              console.log("PROD: ", responseProduct.data.data)
              setProducts(responseProduct.data.data); 
    
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
        try{

            const { gallon_delivery_id, request_type, refill_id, borrow_id, returned_id, slimQuantity, roundQuantity, gallon_delivery_status } = requestDetails;

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
            },{
                headers:{
                'Authorization' : `Bearer ${localStorage.getItem('token')}`,
                },
            });
            fetchGallonsRequest(); 

        }catch(error){
            console.error('Error rejecting the request: ', error);
        }
    };


    const formatAddress = (queue) => {
        const { house_number, street, barangay} = queue;
        return `${house_number} ${street}, ${barangay}`;
    };

    const handleExportToPDF = () => {
        const doc = new jsPDF();
        const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(); 
        
        const sortByAddress = (requests) => {
            return requests.sort((a, b) => {
                const addressA = formatAddress(a).toLowerCase();
                const addressB = formatAddress(b).toLowerCase();
                return addressA.localeCompare(addressB);
            });
        };

        const createTable = (title, requests, startY) => {
            doc.setFont("Helvetica", "bold").setFontSize(12);
            doc.setTextColor(0, 105, 217);
            doc.text(title, doc.internal.pageSize.getWidth() / 2, startY - 4, { align: "center" });
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
                    fontSize: 9,
                    halign: 'center',
                    valign: 'middle',
                },
                headStyles: {
                    fillColor: [0, 105, 217],
                    fontSize: 10,
                },
                margin: { top: 35, left: 5, right: 5 },
            }); 
        };

        // Add Title
        doc.setTextColor(0, 105, 217);
        doc.setFont("Helvetica", "bold").setFontSize(15);
        doc.text('Gallon Delivery Requests', doc.internal.pageSize.getWidth() / 2, 15, { align: "center" });

        const sortedPickupRequests = sortByAddress(filteredPickupRequests);
        const sortedDeliverRequests = sortByAddress(filteredDeliverRequests);

        createTable('Pickup Requests', sortedPickupRequests, 26);

        //(Add New Page)
        doc.addPage();
        createTable('Deliver Requests', sortedDeliverRequests, 20);
        
        doc.save('gallon_delivery_requests.pdf');
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
                                onAccept={()=> handleAccept(queue)}
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
                                onAccept={()=> handleAccept(queue)}
                            />
                        ))
                    )}
                    
                </div>
            </div>
        </>
    );
};