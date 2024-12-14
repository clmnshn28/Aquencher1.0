import React,{useState, useEffect, useRef } from "react";
import 'assets/css/customer';
import axios from 'axios';
import {API_URL} from 'constants';
import { format } from 'date-fns';
import { IoIosArrowRoundBack, IoIosArrowRoundForward  } from "react-icons/io";

import DropdownFilter from 'components/DropdownFilter';
import { TransactionDetailsModal } from "./modals/TransactionDetailsModal";


export const Transaction = () =>{

    const [transactionLogs, setTransactionLogs] = useState([]);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const initialFetchDone = useRef(false);
    const [openTransactionModal, isOpenTransactionModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(()=>{
        if (!initialFetchDone.current) {
            fetchTransactionRequest();
            initialFetchDone.current = true;
        }
    },[])
    
    const fetchTransactionRequest = async () =>{
        try{
        const response = await axios.get(API_URL + '/api/customer/transactions',{
            headers: {
            'Authorization' : `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
            },
        });
        const inventoryResponse = await axios.get(API_URL + '/api/products',{
            headers: {
            'Authorization' : `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
            },
        });
        const products = inventoryResponse.data.data;
        const slimProduct = products.find(product => product.id === 1);
        const roundProduct = products.find(product => product.id === 2);


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
        setFilteredTransactions(transactionLogs); // Reset
        setActiveDropdown(null); 
    };
    
       
      
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

    return(
        <>
            <div className="Transaction__header">
                <h2 className="Transaction__header-text">Transactions</h2>
            </div>
            <div className="Transaction__filter-container">
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
                onOptionSelect={(value) => handleFilterChange('status', value)}
                classExpand='DropdownFilter__expand'
                />
                {( filters.requestType || filters.gallonType || filters.status) && (
                <button className="RequestsAdmin__clear-filters-button" onClick={handleClearFilters}>
                    CLEAR
                </button>
                )}
            </div>

            <div className="Transaction__table-container">
                <table className="Transaction__table">
                    <thead className="Transaction__table-header">
                        <tr>
                        <th>Date Requested</th>
                        <th>Request Type</th>
                        <th>Gallon Type</th>
                        <th>Price</th>
                        <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                    {transactionLogs.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center' }}>
                                <span className="Transaction__not-found">
                                    No transactions 
                                </span>
                            </td>
                        </tr>
                    ) : paginatedTransactions.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center' }}>
                            <span className="Transaction__not-found">
                                No transactions found
                            </span>
                            </td>
                        </tr>
                        ) :
                        ( paginatedTransactions.map((transaction) => (
                            <tr key={transaction.gallon_delivery_id} onClick={()=> openModal(transaction)} className="Transaction__table-row">
                                <td>
                                    <div className='Transaction__date-time'>
                                        <span className="Transaction__date">{transaction.date}</span>
                                        <span className="Transaction__time">{transaction.time}</span>
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