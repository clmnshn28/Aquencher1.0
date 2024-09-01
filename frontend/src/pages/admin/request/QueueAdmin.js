import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { IoFilterSharp } from 'react-icons/io5';
import 'assets/css/admin';

import * as images from 'assets/images';
import DropdownFilter from 'components/DropdownFilter';
import QueueItem from "components/QueueItem";

export const QueueAdmin = () =>{

    const [queues, setQueues] = useState([
        { id: 1, name: 'Miguel Angelo Barruga', address: '146 Dama De Notche Street, Bulihan', slimQuantity: 3, roundQuantity: 3, requestType: 'Refill', status: false, isAccepted: false},
        { id: 2, name: 'Celmin Shane Quizon', address: '123 Dama De Notche Street, Bulihan', slimQuantity: 4, roundQuantity: 5, requestType: 'Return', status: false, isAccepted: false },
        { id: 3, name: 'Karen Joyce Joson', address: '145 Dama De Notche Street, Bulihan', slimQuantity: 1, roundQuantity: 8, requestType: 'Borrow', status: false, isAccepted: false },
        { id: 4, name: 'Francis Harvey Soriano', address: '156 Dama De Notche Street, Bulihan', slimQuantity: 0, roundQuantity: 7, requestType: 'Borrow', status: false, isAccepted: false },
    ]);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState({
        requestType: '',
        gallonType: '',
        address: '',
    });
  const [filteredPickupRequests, setFilteredPickupRequests] = useState([]);
    const [filteredDeliverRequests, setFilteredDeliverRequests] = useState([]);

    // manually trigger the search
    const handleSearch = () => {
        const applyFilters = (requests) => {
            return requests.filter(queue => {
                return (
                    (filters.requestType === '' || queue.requestType === filters.requestType) &&
                    (filters.gallonType === '' ||
                        (filters.gallonType === 'Slim' && queue.slimQuantity > 0) ||
                        (filters.gallonType === 'Round' && queue.roundQuantity > 0)
                    ) &&
                    (filters.address === '' || queue.address.toLowerCase().includes(filters.address.toLowerCase())) &&
                    (searchQuery === '' || queue.name.toLowerCase().includes(searchQuery.toLowerCase()))
                );
            });
        };

        const pickupRequests = queues.filter(queue =>
            (queue.requestType === 'Refill' && !queue.isAccepted) ||
            (queue.requestType === 'Return' && queue.status !== 'Completed')
        );

        const deliverRequests = queues.filter(queue =>
            (queue.requestType === 'Refill' && queue.isAccepted && queue.status !== 'Completed') ||
            (queue.requestType === 'Borrow' && queue.status !== 'Completed')
        );

        setFilteredPickupRequests(applyFilters(pickupRequests));
        setFilteredDeliverRequests(applyFilters(deliverRequests));
    };

     //  reset filtered requests if the search query is cleared
    useEffect(() => {
        if (searchQuery === '') {
            setFilteredPickupRequests(queues.filter(queue =>
                (queue.requestType === 'Refill' && !queue.isAccepted) ||
                (queue.requestType === 'Return' && queue.status !== 'Completed')
            ));
            setFilteredDeliverRequests(queues.filter(queue =>
                (queue.requestType === 'Refill' && queue.isAccepted && queue.status !== 'Completed') ||
                (queue.requestType === 'Borrow' && queue.status !== 'Completed')
            ));
        } 
    }, [searchQuery, queues]);

    // apply filters on component mount and when filters change
    useEffect(() => {
        const applyFilters = (requests) => {
            return requests.filter(queue => {
                return (
                    (filters.requestType === '' || queue.requestType === filters.requestType) &&
                    (filters.gallonType === '' ||
                        (filters.gallonType === 'Slim' && queue.slimQuantity > 0) ||
                        (filters.gallonType === 'Round' && queue.roundQuantity > 0)
                    ) &&
                    (filters.address === '' || queue.address.toLowerCase().includes(filters.address.toLowerCase()))
                );
            });
        };

        const pickupRequests = queues.filter(queue =>
            (queue.requestType === 'Refill' && !queue.isAccepted) ||
            (queue.requestType === 'Return' && queue.status !== 'Completed')
        );

        const deliverRequests = queues.filter(queue =>
            (queue.requestType === 'Refill' && queue.isAccepted && queue.status !== 'Completed') ||
            (queue.requestType === 'Borrow' && queue.status !== 'Completed')
        );

        setFilteredPickupRequests(applyFilters(pickupRequests));
        setFilteredDeliverRequests(applyFilters(deliverRequests));
    }, [filters, queues]);


    const handleClearFilters = () =>{
        setFilters({
            requestType: '',
            gallonType: '',
            address: '',
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

    const handleAccept = (id) => {
        console.log("handleAccept queue called with ID:", id);     
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
            </div>

            <div className="QueueAdmin__filter-container">
                <div className="QueueAdmin__search-bar-container">
                    <input 
                        type="text" 
                        placeholder="Search" 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                    />
                    <button className="QueueAdmin__search-button" onClick={handleSearch}>
                        <img src={images.searchIcon} alt="Search Icon" />
                    </button>
                </div>
                <IoFilterSharp  className="QueueAdmin__filter-icon" />
                <DropdownFilter
                    label="Transaction Type"
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
                    label="Gallon Type"
                    isOpen={activeDropdown === 'gallonType'}
                    toggleDropdown={()=> toggleDropdown('gallonType')}
                    options={[
                        {label: 'Slim', value: 'Slim'},
                        {label: 'Round', value: 'Round'},
                    ]}
                    onOptionSelect={(value) => handleFilterChange('gallonType', value)}
                />
                <DropdownFilter
                    label="Address"
                    isOpen={activeDropdown === 'address'}
                    toggleDropdown={() => toggleDropdown('address')}
                    options={queues.map((request) => ({ label: request.address, value: request.address }))}
                    onOptionSelect={(value) => handleFilterChange('address', value)}
                />
                {(searchQuery || filters.requestType || filters.gallonType || filters.address) && (
                    <button className="QueueAdmin__clear-filters-button" onClick={handleClearFilters}>
                        CLEAR
                    </button>
                )}
            </div>

            <div className="QueueAdmin__container">
                <div className="QueueAdmin__pickup-section">
                    <div className="QueueAdmin__title">
                        <h2>Pickup</h2>
                    </div>
                    {filteredPickupRequests.length === 0 ? (
                        <div className="RequestsAdmin__not-found">
                            <span>No pickup requests found.</span>
                        </div>
                    ) : (
                        filteredPickupRequests.map((queue) =>(
                            <QueueItem
                                key={queue.id}
                                name={queue.name}
                                address={queue.address}
                                slimQuantity={queue.slimQuantity}
                                roundQuantity={queue.roundQuantity}
                                requestType={queue.requestType}
                                status={queue.status}
                                onAccept={()=> handleAccept(queue.id)}
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
                            <span>No deliver requests found.</span>
                        </div>
                    ) : (
                        filteredDeliverRequests.map((queue) =>(
                            <QueueItem
                                key={queue.id}
                                name={queue.name}
                                address={queue.address}
                                slimQuantity={queue.slimQuantity}
                                roundQuantity={queue.roundQuantity}
                                requestType={queue.requestType}
                                status={queue.status}
                                onAccept={()=> handleAccept(queue.id)}
                            />
                        ))
                    )}
                    
                </div>
            </div>
        </>
    );
};