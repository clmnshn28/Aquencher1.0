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
import RequestItem from "components/RequestItem";
import SearchBar from "components/SearchBar";

export const CompletedAdmin = () =>{

    const [requests, setRequests] = useState([]);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredRequests, setFilteredRequests] = useState([]);

    useEffect(()=>{
        fetchGallonsRequest();
      },[])
  
    const fetchGallonsRequest = async () =>{
        try{
        const response = await axios.get(API_URL + '/api/gallon-delivery/completed',{
            headers: {
            'Authorization' : `Bearer ${localStorage.getItem('token')}`,
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

    const formatAddress = (request) => {
        const { house_number, street, barangay} = request;
        return `${house_number} ${street}, ${barangay}`;
    }
    
    const handleExportToPDF = () => {
        const doc = new jsPDF('landscape');
        const tableColumn = ["Full Name", "Address", "Slim Gallons", "Round Gallons", "Request Type", "Status", "Date/Time"];
        const tableRows = [];
        const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

        filteredRequests.forEach((request) => {
            const fullName = `${request.fname} ${request.lname}`;
            const address = formatAddress(request);
            const dateTime = `${request.date}\n${request.time}`;
            const rowData = [
                fullName,
                address,
                request.slimQuantity,
                request.roundQuantity,
                capitalize(request.request_type),
                capitalize(request.gallon_delivery_status),
                dateTime,
            ];
            tableRows.push(rowData);
        });

        if (tableRows.length > 0) {
            doc.setFont("Helvetica", "bold").setFontSize(20);
            doc.setTextColor(0, 105, 217);
            doc.text("Completed Gallon Delivery Requests", doc.internal.pageSize.getWidth() / 2, 16, { align: "center" });
            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 20,
                theme: 'striped',
                styles: {
                    cellPadding: 3,
                    fontSize: 10,
                    halign: 'center', 
                    valign: 'middle', 
                },
                headStyles: {
                    fillColor: [0, 105, 217],
                    fontSize: 11,
                },
            });
        } else {
            doc.text("No data available", 14, 16);
        }
        doc.save("Completed_Gallon_Delivery_Requests.pdf");
    };  

    return(
        <>
            <div className="CompletedAdmin__header">
                <h2 className="CompletedAdmin__header-text">Requests</h2>
                <Link to="/admin/requests/all-requests"  className='CompletedAdmin__link'>
                    <p className="CompletedAdmin__text">All Requests</p>
                </Link>
                <Link to="/admin/requests/queue"  className='CompletedAdmin__link'>
                    <p className="CompletedAdmin__queue-text">Queue</p>
                </Link>
                <Link to="/admin/requests/completed"  className='CompletedAdmin__link'>
                    <p className="CompletedAdmin__complete-text">Completed</p>
                </Link>
                <Link to="/admin/requests/rejected-requests"  className='RequestsAdmin__link'>
                    <p className="RequestsAdmin__rejected-requests">Rejected Request</p>
                </Link>
            </div>

            <div className="CompletedAdmin__filter-container">
                <div className="UsersAdmin__controls-filter">
                    <SearchBar
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        handleSearch={handleSearch}
                    />
                    <IoFilterSharp  className="CompletedAdmin__filter-icon" />
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
                        <button className="CompletedAdmin__clear-filters-button" onClick={handleClearFilters}>
                            CLEAR
                        </button>
                    )}
                </div>
                <button className="UsersAdmin__pdf-button" onClick={handleExportToPDF}>
                    <FaFilePdf className="UsersAdmin__pdf-icon" /> Export to PDF
                </button>
            </div>

            <div className="CompletedAdmin__container">
                {filteredRequests.length === 0 ? (
                    <div className="RequestsAdmin__not-found">
                        <span>No completed requests </span>
                    </div>
                ) : (
                    filteredRequests.map((request) =>(
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
                        />  
                    ))
                )}
            </div>


        </>
    );
};