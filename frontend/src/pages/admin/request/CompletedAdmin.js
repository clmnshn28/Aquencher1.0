import React, {useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { IoFilterSharp } from 'react-icons/io5';
import {FaFilePdf} from "react-icons/fa";
import { IoIosArrowRoundBack, IoIosArrowRoundForward  } from "react-icons/io";
import 'assets/css/admin';
import axios from 'axios';
import {API_URL} from 'constants';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useAuth } from "context/AuthContext";

import * as images from 'assets/images';
import DropdownFilter from 'components/DropdownFilter';
import RequestItem from "components/RequestItem";
import SearchBar from "components/SearchBar";

export const CompletedAdmin = () =>{
    const {user } = useAuth(); 

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
        const response = await axios.get(API_URL + '/api/gallon-delivery/completed',{
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

    const paginatedCompletedRequests = filteredRequests.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);


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
        if (filteredRequests.length === 0) {
            alert("No data available to export.");
            return;
        }

        const doc = new jsPDF('landscape');
        const tableColumn = ["Full Name", "Address", "Slim Gallons", "Round Gallons", "Request Type", "Status", "Date/Time"];
        const tableRows = [];
        const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        const imgData = images.loginLogo;

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

        const getCurrentDateTime = () => {
            const now = new Date();
            return format(now, 'MM-dd-yyyy hh:mm a');
        };
    
        const formattedDateTime = getCurrentDateTime();

        const addHeaderText = () => {
            doc.addImage(imgData, 'PNG', 30, 3, 30, 23);
        
            // Report Header
            doc.setFont("Helvetica", "bold").setFontSize(20);
            doc.setTextColor(0, 105, 217);
            doc.text("Gallon Delivery Requests", doc.internal.pageSize.getWidth() / 2, 18, { align: "center" });

            // Type of Report
            doc.setFontSize(10);
            const reportTypeY = 15;
            const reportTypeText = "Completed Requests Report"; 

            doc.setFont("Helvetica", "bold");
            const reportTypeLabelX = doc.internal.pageSize.getWidth() - 28; 
            const reportTypeValueX = doc.internal.pageSize.getWidth() - 20; 

            doc.text("Report Type:", reportTypeLabelX, reportTypeY, { align: "right" });
            doc.setFont("Helvetica", "normal");
            doc.text(reportTypeText, reportTypeValueX, reportTypeY + 5, { align: "right" });

        }

        if (tableRows.length > 0) {
            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 25,
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
                    fontSize: 11,
                },
                margin: { bottom: 16 },
            });

            const marginLeft = 15;
            const marginBottom = doc.internal.pageSize.getHeight() - 5; 
            const addFooterText = () => {
                doc.setFontSize(9);
                doc.setFont("Helvetica", "normal");
                doc.setTextColor(195, 195, 195);
                doc.text(`Report Generated On: ${formattedDateTime}`, marginLeft, marginBottom - 8, { align: 'left' });
                doc.text(`Reported By: ${user.fname} ${user.lname}`, marginLeft, marginBottom - 3, { align: 'left' });
            };

            const pageCount = doc.internal.getNumberOfPages(); // Get total pages
            for (let i = 1; i <= pageCount; i++) { // Start from the second page
                doc.setPage(i); // Set the current page
                addHeaderText();
                addFooterText();
                doc.setFontSize(11);
                doc.setTextColor(0, 105, 217);
                doc.setFont("Helvetica", "bold");
                doc.text(`Page ${i}`, doc.internal.pageSize.getWidth() - 18, doc.internal.pageSize.getHeight() - 13, { align: "right" });
            }
        } else {
            doc.text("No data available", 14, 16);
        }
        doc.save(`Completed_Gallon_Delivery_Requests_${formattedDateTime}.pdf`);
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
                {paginatedCompletedRequests.length === 0 ? (
                    <div className="RequestsAdmin__not-found">
                        <span>No completed requests </span>
                    </div>
                ) : (
                    paginatedCompletedRequests.map((request) =>(
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