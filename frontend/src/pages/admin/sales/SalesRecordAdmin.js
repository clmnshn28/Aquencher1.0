import React,{useState, useEffect, useRef} from "react";
import 'assets/css/admin';
import SearchBar from 'components/SearchBar';
import DropdownFilter from 'components/DropdownFilter';
import { useAuth } from "context/AuthContext";

import axios from 'axios';
import {API_URL} from 'constants';
import { format } from 'date-fns';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { IoFilterSharp } from 'react-icons/io5';
import { MdOutlineArrowDropDown, MdArrowDropUp } from "react-icons/md";
import { IoIosArrowRoundBack, IoIosArrowRoundForward  } from "react-icons/io";
import { RiFileExcel2Fill } from "react-icons/ri";
import DatePicker from "react-datepicker"; // Import DatePicker component
import "react-datepicker/dist/react-datepicker.css";

export const SalesRecordAdmin = () =>{
    const { user  } = useAuth();

    const [transactionLogs, setTransactionLogs] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const initialFetchDone = useRef(false);

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
    },[]);

    
    const fetchTransactionRequest = async () => {
        try {
            const response = await axios.get(API_URL + '/api/gallon-delivery', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
                },
            });

            const inventoryResponse = await axios.get(API_URL + '/api/admin/products', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
                },
            });
            const products = inventoryResponse.data.data;
            const slimProduct = products.find(product => product.id === 1);
            const roundProduct = products.find(product => product.id === 2);


            const salesRecords = response.data.data
                .filter(record => record.request_type !== 'return' && 
                    record.gallon_delivery_status === 'completed')
                .reduce((acc, record) => {
                    const customerKey = `${record.customer_id}-${record.fname}-${record.lname}`;
                    
                    if (!acc[customerKey]) {
                        acc[customerKey] = {
                            date: record.created_at,
                            fullName: `${record.fname} ${record.lname}`,
                            slimQuantity: 0,
                            roundQuantity: 0,
                            slimPrice: 0,
                            roundPrice: 0,
                            requestTypes: new Set(),
                            totalSaleAmount: 0
                        };
                    }

                    const quantities = record.quantities.split(', ').reduce((q, item) => {
                        const [productId, quantity] = item.split(': ');
                        q[productId] = quantity !== 'None' ? parseInt(quantity) : 0;
                        return q;
                    }, {});

                    const sale = acc[customerKey];
                    
                    if (quantities['1'] > 0) {
                        sale.slimQuantity += quantities['1'];
                        sale.slimPrice += quantities['1'] * (slimProduct?.price || 0);
                    }

                    if (quantities['2'] > 0) {
                        sale.roundQuantity += quantities['2'];
                        sale.roundPrice += quantities['2'] * (roundProduct?.price || 0);
                    }

                    sale.requestTypes.add(capitalize(record.request_type));
                    sale.totalSaleAmount = sale.slimPrice + sale.roundPrice;

                    return acc;
                }, {});

            const processedSales = Object.values(salesRecords).map(sale => ({
                ...sale,
                requestType: Array.from(sale.requestTypes)
                .sort((a, b) => {
                    const order = ['Borrow', 'Refill'];
                    return order.indexOf(a) - order.indexOf(b);
                })
                .join(', ')
            }));

            setTransactionLogs(processedSales);
            setFilteredTransactions(processedSales);

        
        } catch (error) {
            console.error('Error fetching gallon delivery requests:', error);
        }
    };


    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    
    const paginatedTransactions = filteredTransactions.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    
    const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);

    
    const [filters, setFilters] = useState({
        gallonType: '', 
    });

    // clear
    const handleClearFilters = () => {
        setFilters({
            gallonType: '',
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
        return transaction.fullName.toLowerCase().includes(searchQuery.toLowerCase());
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
            (updatedFilters.gallonType === '' || 
                (updatedFilters.gallonType === 'Slim' && transaction.slimQuantity > 0) || 
                (updatedFilters.gallonType === 'Round' && transaction.roundQuantity > 0)
            ) 
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
            filtered = filtered.filter(transaction => new Date(transaction.date) >= new Date(startDate));
        }
        if (endDate) {
            filtered = filtered.filter(transaction => new Date(transaction.date) <= new Date(endDate));
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

  
    const handleExportExcel = async () => {
        if (filteredTransactions.length === 0) {
            alert('No data available for export.');
            return;
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Sales Record');

         // Add a merged header row
        worksheet.mergeCells('A1:H1'); 
        const mainHeaderTitleCell = worksheet.getCell('A1');
        mainHeaderTitleCell.value = "Po's Purified Drinking Water & Refilling Hub";
        mainHeaderTitleCell.font = { bold: true, size: 21, color: { argb: 'FFFFFF' } }; // Blue text color
        mainHeaderTitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        mainHeaderTitleCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '0174CF' } 
        };

        // Add a merged header row
        worksheet.mergeCells('A2:H2'); 
        const headerTitleCell = worksheet.getCell('A2');
        headerTitleCell.value = 'SALES RECORD';
        headerTitleCell.font = { bold: true, size: 16, color: { argb: 'FFFFFF' } }; // Blue text color
        headerTitleCell.alignment = { horizontal: 'center', vertical: 'middle' };
        headerTitleCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '0174CF' } 
        };

        worksheet.addRow([]);
        // worksheet.addRow([]);
        

        // Add Date Generated row ========>
        const dateGenerated = new Date();
        const dateGeneratedRow = worksheet.addRow(['Report Generated On:', format(dateGenerated, 'yyyy-MM-dd hh:mm a'), '', '', '', '', '', '']);
        dateGeneratedRow.getCell(1).font = { bold: true, size: 12, color: { argb: 'FFFFFF' } }; // 'Date Generated' cell
        dateGeneratedRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
        dateGeneratedRow.getCell(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '0174CF' },
        };
        dateGeneratedRow.getCell(1).border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
        };

        dateGeneratedRow.getCell(2).font = { size: 12 }; // Date value cell
        dateGeneratedRow.getCell(2).alignment = { horizontal: 'left', vertical: 'middle' };
        dateGeneratedRow.getCell(2).border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
        };
        dateGeneratedRow.getCell(2).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'EEF7FF' } 
        };

        // Apply no borders to the empty cells in the total row
        dateGeneratedRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            if (colNumber > 2) { 
                cell.border = {}; 
            }
        });

        // Add "Generated By" row ========>
        const generatedByRow = worksheet.addRow(['Reported By:', `${user.fname} ${user.lname}`, '', '', '', '', '', '']);
        generatedByRow.getCell(1).font = { bold: true, size: 12, color: { argb: 'FFFFFF' } };
        generatedByRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
        generatedByRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0174CF' } };
        generatedByRow.getCell(1).border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
        };

        generatedByRow.getCell(2).font = { size: 12 };
        generatedByRow.getCell(2).alignment = { horizontal: 'left', vertical: 'middle' };
        generatedByRow.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'EEF7FF' } };
        generatedByRow.getCell(2).border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
        };

        // After the 'Generated By' row, add a date range row
        if (startDate || endDate) {
            const dateRangeRow = worksheet.addRow([
                'Date Range:', 
                `${startDate ? format(startDate, 'MMM dd, yyyy') : 'Start'} to ${endDate ? format(endDate, 'MMM dd, yyyy') : 'End'}`, 
                '', '', '', '', '', ''
            ]);
            
            // Style similar to other header rows
            dateRangeRow.getCell(1).font = { bold: true, size: 12, color: { argb: 'FFFFFF' } };
            dateRangeRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
            dateRangeRow.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0174CF' } };
            dateRangeRow.getCell(1).border = {
                top: { style: 'thin' },
                bottom: { style: 'thin' },
                left: { style: 'thin' },
                right: { style: 'thin' },
            };
            dateRangeRow.getCell(2).font = { size: 10 };
            dateRangeRow.getCell(2).alignment = { horizontal: 'left', vertical: 'middle' };
            dateRangeRow.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'EEF7FF' } };
            dateRangeRow.getCell(2).border = {
                top: { style: 'thin' },
                bottom: { style: 'thin' },
                left: { style: 'thin' },
                right: { style: 'thin' },
            };
        }
        // Add total row ========>
        const total = filteredTransactions.reduce((sum, t) => sum + t.totalSaleAmount, 0);
        const totalRow = worksheet.addRow(['Grand Total:', `₱${total.toFixed(2)}`,'', '', '', '', '', '']);
            
        // Apply styles for the 'TOTAL' and amount cells
        totalRow.getCell(1).font = { bold: true, size: 12, color: { argb: 'FFFFFF' } }; // 'TOTAL:' cell
        totalRow.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
        totalRow.getCell(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: '0174CF' } 
        };
        totalRow.getCell(1).border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
        };

        totalRow.getCell(2).font = { bold: true, size: 12 }; // Amount cell
        totalRow.getCell(2).alignment = { horizontal: 'left', vertical: 'middle' };
        totalRow.getCell(2).border = {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' },
        };
        totalRow.getCell(2).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'EEF7FF' } 
        };

        // Apply no borders to the empty cells in the total row
        totalRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            if (colNumber > 2) { // Skip 'TOTAL' and amount cells
                cell.border = {}; // No border for empty cells
            }
        });
    
        worksheet.addRow([]);

        // Add headers
        const headers = [
            'Date',
            'Customer Name',
            'Request Type',
            'Total Quantity (Slim)',
            'Total Price (Slim)',
            'Total Quantity (Round)',
            'Total Price (Round)',
            'Total Sale Amount',
        ];

        worksheet.addRow(headers);

        // Style the header row
        // const headerRow = worksheet.getRow(8);
        const headerRow = worksheet.getRow((startDate || endDate) ? 9 : 8);
        headerRow.eachCell((cell) => {
            cell.font = { bold: true, size: 12,  color: { argb: 'FFFFFF' }  };
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: '0174CF' } 
            };
            cell.border = {
                top: { style: 'thin',  color: { argb: '0174CF' }  },
                bottom: { style: 'thin',  color: { argb: '0174CF' }  },
                left: { style: 'thin',  color: { argb: '0174CF' }  },
                right: { style: 'thin',  color: { argb: '0174CF' }  },
            };
        });

        // Add transaction data
        filteredTransactions.forEach((transaction) => {
            const row = worksheet.addRow([
                format(new Date(transaction.date), 'yyyy-MM-dd'),
                transaction.fullName,
                transaction.requestType,
                transaction.slimQuantity > 0 ? transaction.slimQuantity : '-',
                transaction.slimPrice > 0 ? `₱${transaction.slimPrice.toFixed(2)}` : '-',
                transaction.roundQuantity > 0 ? transaction.roundQuantity : '-',
                transaction.roundPrice > 0 ? `₱${transaction.roundPrice.toFixed(2)}` : '-',
                `₱${transaction.totalSaleAmount.toFixed(2)}`,
            ]);
            // Set font size for data rows
            row.eachCell((cell) => {
                cell.font = { size: 12 };
                cell.alignment = { horizontal: 'center', vertical: 'middle' };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'EEF7FF' } 
                };
                cell.border = {
                    top: { style: 'thin' },
                    bottom: { style: 'thin' },
                    left: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });
        });

        worksheet.eachRow((row) => {
            row.height = 25;
        });
        worksheet.getRow(1).height = 40;
        worksheet.getRow(2).height = 30;
       
        // Adjust column widths for better readability
        worksheet.columns.forEach((column) => {
            column.width = 25;
        });

        // Export to Excel
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), 'SalesRecord.xlsx');
    };


    return(
        <>
            <div className="TransactionAdmin__header">
                <h2 className="TransactionAdmin__header-text">Sales</h2>
            </div>
            <div className="TransactionAdmin__filter-container">
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    handleSearch={handleSearch}
                />
                <IoFilterSharp  className="RequestsAdmin__filter-icon" />
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
      
                {(searchQuery || filters.gallonType|| startDate || endDate) && (
                    <button className="RequestsAdmin__clear-filters-button" onClick={handleClearFilters}>
                        CLEAR
                    </button>
                )}
                <button className="TransactionAdmin__excel-button" onClick={handleExportExcel}>
                    <RiFileExcel2Fill className="UsersAdmin__pdf-icon" /> Export to XLSX
                </button>
            </div>
            <div className="TransactionAdmin__table-container">
                <table className="SalesRecordAdmin__table">
                    <thead className="SalesRecordAdmin__table-header">
                        <tr>
                            <th>Date</th>
                            <th>Customer Name</th>
                            <th>Request Type</th>
                            <th>Total Quantity<br/>(Slim)</th>
                            <th>Total Price<br/>(Slim)</th>
                            <th>Total Quantity<br/>(Round)</th>
                            <th>Total Price<br/>(Round)</th>
                            <th>Total Sale Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                    {transactionLogs.length === 0 ? (
                        <tr>
                            <td colSpan="8" style={{ textAlign: 'center' }}>
                                <span className="Transaction__not-found">
                                    No sales record 
                                </span>
                            </td>
                        </tr>
                    ) : paginatedTransactions.length === 0 ? (
                        <tr>
                            <td colSpan="8" style={{ textAlign: 'center' }}>
                            <span className="Transaction__not-found">
                                No sales record found
                            </span>
                            </td>
                        </tr>
                        ) :
                        ( paginatedTransactions.map((transaction, index) => (
                            <tr key={index}>
                                <td>{format(new Date(transaction.date), 'yyyy-MM-dd')}</td>
                                <td>{transaction.fullName}</td>
                                <td>{transaction.requestType}</td>
                                <td>{transaction.slimQuantity > 0 ? transaction.slimQuantity : <span className="SalesRecordAdmin__table-no-gallons">-</span>}</td>
                                <td>{transaction.slimPrice > 0 ? `₱${transaction.slimPrice.toFixed(2)}`  : '-'}</td>
                                <td>{transaction.roundQuantity > 0 ? transaction.roundQuantity : '-'}</td>
                                <td>{transaction.roundPrice > 0 ? `₱${transaction.roundPrice.toFixed(2)}`  : '-'}</td>
                                <td>₱{transaction.totalSaleAmount.toFixed(2)}</td>
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
        
        </>
    );
};
