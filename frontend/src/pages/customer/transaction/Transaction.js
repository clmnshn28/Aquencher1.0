import React,{useState} from "react";
import 'assets/css/customer';

import DropdownFilter from 'components/DropdownFilter';


export const Transaction = () =>{
    const transactionLogs = [
        {id: 1, requestType: 'Refill', slimQuantity: 3, roundQuantity: 3, price: (3 + 3) * 25, status: 'Pending', date: '2024-09-29', time: '9:00 AM' },
        {id: 2, requestType: 'Return', slimQuantity: 0, roundQuantity: 3, price: (0 + 3) * 25, status: 'In Progress', date: '2024-09-29', time: '9:00 AM'},
        {id: 3, requestType: 'Borrow', slimQuantity: 3, roundQuantity: 3, price: (3 + 3) * 25, status: 'Completed', date: '2024-01-15', time: '02:20 PM' },
        {id: 4, requestType: 'Refill', slimQuantity: 3, roundQuantity: 0, price: (3 + 0) * 25, status: 'Cancelled', date: '2024-01-20', time: '09:00 AM' },
    ];
    
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [filteredTransactions, setFilteredTransactions] = useState(transactionLogs);
    
    const getStatusColor = (value) =>{
        if(value === 'Pending') return '#F58E2F';
        if(value === 'In Progress') return '#0174CF';
        if (value === 'Completed') return '#169D00';
        return '#898988';
    }
    
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
              (updatedFilters.requestType === '' || transaction.requestType === updatedFilters.requestType) &&
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
                <DropdownFilter
                label={filters.status || "Status"}
                isOpen={activeDropdown === 'status'}
                toggleDropdown={()=> toggleDropdown('status')}
                options={[
                    {label: 'Completed', value: 'Completed'},
                    {label: 'In Progress', value: 'In Progress'},
                    {label: 'Pending', value: 'Pending'},
                    {label: 'Cancelled', value: 'Cancelled'},
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
                                    No transactions available
                                </span>
                            </td>
                        </tr>
                    ) : filteredTransactions.length === 0 ? (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center' }}>
                            <span className="Transaction__not-found">
                                No transactions found
                            </span>
                            </td>
                        </tr>
                        ) :
                        ( filteredTransactions.map((transaction) => (
                            <tr key={transaction.id}>
                            <td>
                                <div className='Transaction__date-time'>
                                    <span className="Transaction__date">{transaction.date}</span>
                                    <span className="Transaction__time">{transaction.time}</span>
                                </div> 
                            </td>
                            <td>{transaction.requestType}</td>
                            <td>
                                <span> Slim: {transaction.slimQuantity},</span>
                                <span> Round: {transaction.roundQuantity}</span>
                            </td>
                            <td>₱{transaction.price.toFixed(2)}</td>
                            <td style={{color: getStatusColor(transaction.status)}}>{transaction.status}</td>
                            </tr>
                        )))}
                    </tbody>
                </table>
            </div>

        </>
    );
};