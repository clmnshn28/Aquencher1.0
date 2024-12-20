import React, { useState, useEffect, useRef  } from 'react';
import { IoFilterSharp } from 'react-icons/io5';
import {FaFilePdf} from "react-icons/fa";
import "assets/css/admin";
import axios from 'axios';
import {API_URL} from 'constants';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useAuth } from "context/AuthContext";
import * as images from 'assets/images';
import SearchBar from 'components/SearchBar';
import DropdownFilter from 'components/DropdownFilter';
import { TransactionDetailsModal } from "./modals/TransactionDetailsModal";
import { MdOutlineArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { IoIosArrowRoundBack, IoIosArrowRoundForward  } from "react-icons/io";
import DatePicker from "react-datepicker"; // Import DatePicker component
import "react-datepicker/dist/react-datepicker.css";

export const TransactionAdmin = () => {
  const {user } = useAuth(); 

  const [transactionLogs, setTransactionLogs] = useState([]);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const initialFetchDone = useRef(false);
  const [openTransactionModal, isOpenTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const ITEMS_PER_PAGE = 15;
  const [currentPage, setCurrentPage] = useState(1);

  const [showDatePicker, setShowDatePicker] = useState(false); 
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(()=>{
    if (!initialFetchDone.current) {
      fetchTransactionRequest();
      initialFetchDone.current = true;
    }
  },[])

  const fetchTransactionRequest = async () =>{
      try{
        const response = await axios.get(API_URL + '/api/gallon-delivery',{
          headers: {
            'Authorization' : `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
          },
        });

        const inventoryResponse = await axios.get(API_URL + '/api/admin/products',{
          headers: {
          'Authorization' : `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
          },
        });
        const products = inventoryResponse.data.data;
        const slimProduct = products.find(product => product.id === 1);
        const roundProduct = products.find(product => product.id === 2);

        const requestsWithUpdatedDateTime = response.data.data
        .map((request) => {
          const createdAt = new Date(request.created_at);
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

          let status = request.gallon_delivery_status;
          if (status === 'pickup' || status === 'deliver') {
            status = 'in progress';
          }

          const slimTotalPrice = slimQuantity * slimProduct.price;
          const roundTotalPrice = roundQuantity * roundProduct.price;
          const totalPrice = slimTotalPrice + roundTotalPrice;

          return {
            ...request,
            date: formattedDate, 
            time: formattedTime, 
            slimQuantity,
            roundQuantity,
            totalPrice,
            updatedAt,
            createdAt,
            status,
          };
        }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        setTransactionLogs(requestsWithUpdatedDateTime);
        setFilteredTransactions(requestsWithUpdatedDateTime);
      }catch(error){
        console.error('Error fetching gallon delivery requests:', error);
      }
  };

  const getStatusColor = (value) =>{
    if(value === 'Pending') return '#F58E2F';
    if(value === 'In Progress') return '#0174CF';
    if (value === 'Completed') return '#169D00';
    return '#898988';
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedTransactions = filteredTransactions.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);


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
    setStartDate(null);
    setEndDate(null);
    setShowDatePicker(false);
  };

  // search filter
  const handleSearch = () =>{
    if(searchQuery !== ''){
      const result = transactionLogs.filter((transaction) =>{
        const fullName = `${transaction.fname} ${transaction.lname}`.toLowerCase();
        return (
          fullName.includes(searchQuery.toLowerCase())  
      );
    });
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
          (updatedFilters.requestType === '' || transaction.request_type === updatedFilters.requestType) &&
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

    // Filter transactions by date range
    const handleDateFilterChange = () => {
      let filtered = [...transactionLogs];
      if (startDate) {
        filtered = filtered.filter(transaction => new Date(transaction.updatedAt) >= new Date(startDate));
      }
      if (endDate) {
        filtered = filtered.filter(transaction => new Date(transaction.updatedAt) <= new Date(endDate));
      }
      setFilteredTransactions(filtered);
    };
  
    useEffect(() => {
      handleDateFilterChange();
    }, [startDate, endDate]);

    const toggleDatePicker = () => {
      setShowDatePicker(!showDatePicker); 
    };

  const capitalize = (str) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  }

  const openModal = (transaction) => {
    setSelectedTransaction(transaction);
    isOpenTransactionModal(true);
  };

  const closeModal = () => {
    isOpenTransactionModal(false);
    setSelectedTransaction(null);
  };

  const handleExportToPDF = () => {
    if (filteredTransactions.length === 0) {
      alert("No data available to export.");
      return;
    }

    const doc = new jsPDF('landscape');
    const imgData = images.loginLogo;

    const sortByDate = (transactions) => {
      return transactions.sort((a, b) => {
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);
          return dateA - dateB; // Sort in ascending order
      });
    };
  
    const createTable = ( transactions, startY) => {
      doc.autoTable({
          startY,
          head: [['Date/Time', 'Customer Name', 'Request Type', 'Gallon Type', 'Price', 'Status']],
          body: transactions.map(transaction => {
            const dateTime = `${transaction.date}\n${transaction.time}`;
            const fullName = `${transaction.fname} ${transaction.lname}`;
            const gallonType = [];
            const price = transaction.request_type === 'return' ? "-" : `${transaction.totalPrice}.00`;
            
            if (transaction.slimQuantity > 0) {
                gallonType.push(`Slim: ${transaction.slimQuantity}`);
            }
            
            if (transaction.roundQuantity > 0) {
                gallonType.push(`Round: ${transaction.roundQuantity}`);
            }
            
            return [
                dateTime,
                fullName,
                capitalize(transaction.request_type),
                gallonType.join(', '),
                price,
                capitalize(transaction.status),
            ];
        }),
        theme: 'striped',
        styles: {
            cellPadding: 2,
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
      });
    };
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
      doc.text("Customer Transaction Details", doc.internal.pageSize.getWidth() / 2, 18, { align: "center" });

      // Type of Report
      doc.setFontSize(10);
      const reportTypeY = 15;
      const reportTypeText = "Transaction Activity Report"; 

      doc.setFont("Helvetica", "bold");
      const reportTypeLabelX = doc.internal.pageSize.getWidth() - 26; 
      const reportTypeValueX = doc.internal.pageSize.getWidth() - 20; 

      doc.text("Report Type:", reportTypeLabelX, reportTypeY, { align: "right" });
      doc.setFont("Helvetica", "normal");
      doc.text(reportTypeText, reportTypeValueX, reportTypeY + 5, { align: "right" });
    }

    const sortedTransactions = sortByDate(filteredTransactions); 
    
    createTable( sortedTransactions, 28);

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
        doc.text(`Page ${i}`, doc.internal.pageSize.getWidth() - 18, doc.internal.pageSize.getHeight() - 10, { align: "right" });
    }
    doc.save(`Customer_Transactions_${formattedDateTime}.pdf`);
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
        <DropdownFilter
          label={filters.status || "Status"}
          isOpen={activeDropdown === 'status'}
          toggleDropdown={()=> toggleDropdown('status')}
          options={[
            {label: 'Completed', value: 'completed'},
            {label: 'In Progress', value: 'in progress'},
            {label: 'Pending', value: 'pending'},
            {label: 'Cancelled', value: 'cancelled'},
          ]}
           classExpand='DropdownFilter__expand'
          onOptionSelect={(value) => handleFilterChange('status', value)}
        />
        <div className="date-filter-container" onClick={toggleDatePicker}>
            DATE
            {showDatePicker ? (
                <MdArrowDropUp className="DropdownFilter__dropdown-icon" />
            ) : (
                <MdOutlineArrowDropDown className="DropdownFilter__dropdown-icon" />
            )}
            {showDatePicker && (
              <div className="date-filter-section" onClick={(e)=>e.stopPropagation() }>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  placeholderText="Start Date"
                  dateFormat="yyyy-MM-dd"
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  placeholderText="End Date"
                  dateFormat="yyyy-MM-dd"
                />
              </div>
            )}
       
        </div>
      
        {(searchQuery || filters.requestType || filters.gallonType || filters.status || startDate || endDate) && (
          <button className="RequestsAdmin__clear-filters-button" onClick={handleClearFilters}>
            CLEAR
          </button>
        )}
        <button className="TransactionAdmin__pdf-button" onClick={handleExportToPDF}>
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
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
          {paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center' }}>
                  <span className="TransactionAdmin__not-found">
                    No transactions
                  </span>
                </td>
              </tr>
            ) :
              ( paginatedTransactions.map((transaction) => (
                <tr key={transaction.gallon_delivery_id} onClick={()=> openModal(transaction)} className="Transaction__table-row">
                  <td  style={{paddingLeft: '40px'}}>
                    <div className='TransactionAdmin__date-time'>
                      <span className="TransactionAdmin__date">{transaction.date}</span>
                      <span className="TransactionAdmin__time">{transaction.time}</span>
                    </div> 
                  </td>
                  <td>
                    <div className="TransactionAdmin__info">
                      <img className="TransactionAdmin__avatar" src={transaction.image ? `${API_URL}/storage/images/${transaction.image}` : images.defaultAvatar} alt={`${transaction.fname}'s avatar`} />
                      {`${transaction.fname} ${transaction.lname}`}
                    </div>
                  </td>
                  <td>{capitalize(transaction.request_type)}</td>
                  <td>
                    {transaction.slimQuantity > 0 && (
                      <span className={`quantity-label ${transaction.roundQuantity > 0 ? '' : 'padding-left-25'}`}>
                        Slim: {transaction.slimQuantity}{transaction.slimQuantity && transaction.roundQuantity > 0 ? ', ' : ''}
                      </span>
                    )}
                    {transaction.roundQuantity > 0 && (
                      <span  className={`quantity-label ${transaction.slimQuantity > 0 ? '' : 'padding-left-20'}`}>
                        Round: {transaction.roundQuantity}
                      </span>
                    )} 
                  </td>
                  <td>{transaction.request_type === 'return' ? <span className="Transaction__no-message">-</span> : `₱${transaction.totalPrice.toFixed(2)}`}</td>
                  <td style={{color: getStatusColor(capitalize(transaction.status))}}>{capitalize(transaction.status)}</td>
                </tr>
              )))}
          </tbody>
        </table>
        {filteredTransactions.length > ITEMS_PER_PAGE && (
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

      </div>
      <TransactionDetailsModal
          isOpen={openTransactionModal}
          onClose={closeModal}
          transaction={selectedTransaction}
      />
    </>
  );
};
