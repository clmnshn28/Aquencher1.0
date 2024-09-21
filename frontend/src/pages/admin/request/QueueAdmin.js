import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { IoFilterSharp } from 'react-icons/io5';
import 'assets/css/admin';

import * as images from 'assets/images';
import DropdownFilter from 'components/DropdownFilter';
import QueueItem from "components/QueueItem";
import SearchBar from "components/SearchBar";

export const QueueAdmin = () =>{

    const [queues, setQueues] = useState([
        {id: 1, fname: 'Karen Joyce', lname: 'Joson',  house_number: '045', street: 'Dama De Notche Street', barangay: 'Bulihan', municipality_city: 'Malolos', province: 'Bulacan', postal_code: '3000', slimQuantity: 3, roundQuantity: 3, requestType: 'Refill', status: true, contactNumber: '09123892012', date: '2024-09-14', time: '9:00 AM', image: images.defaultAvatar},
        {id: 2, fname: 'Celmin Shane', lname: 'Quizon', house_number: '065', street: 'Dama De Notche Street', barangay: 'Bulihan', municipality_city: 'Malolos', province: 'Bulacan', postal_code: '3000', slimQuantity: 4, roundQuantity: 0, requestType: 'Return', status: true, contactNumber: '09123892012', date: '2024-09-14', time: '9:00 AM', image: images.defaultAvatar },
        {id: 3, fname: 'Miguel Angelo', lname: 'Barruga', house_number: '255', street: 'Dama De Notche Street', barangay: 'Bulihan', municipality_city: 'Malolos', province: 'Bulacan', postal_code: '3000', slimQuantity: 1, roundQuantity: 8, requestType: 'Borrow', status: true, contactNumber: '09123892012', date: '2024-09-14', time: '9:00 AM', image: images.defaultAvatar},
        {id: 4, fname: 'Francis Harvey', lname: 'Soriano', house_number: '085', street: 'Dama De Notche Street', barangay: 'Bulihan', municipality_city: 'Malolos', province: 'Bulacan', postal_code: '3000', slimQuantity: 0, roundQuantity: 7, requestType: 'Borrow', status: true, contactNumber: '09123892012', date: '2024-09-14', time: '9:00 AM', image: images.defaultAvatar },
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
                const fullName = `${queue.fname} ${queue.lname}`.toLowerCase(); 
                const fullAddress = `${queue.house_number} ${queue.street}, ${queue.barangay}`.toLowerCase();
            
                return (
                    (filters.requestType === '' || queue.requestType === filters.requestType) &&
                    (filters.gallonType === '' ||
                        (filters.gallonType === 'Slim' && queue.slimQuantity > 0) ||
                        (filters.gallonType === 'Round' && queue.roundQuantity > 0)
                    ) &&
                    ( fullName.includes(searchQuery.toLowerCase()) || fullAddress.includes(searchQuery.toLowerCase())) 
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
                    ) 
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


    const formatAddress = (queue) => {
        const { house_number, street, barangay} = queue;
        return `${house_number} ${street}, ${barangay}`;
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
           
                {(searchQuery || filters.requestType || filters.gallonType) && (
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
                            <span>No pickup requests found</span>
                        </div>
                    ) : (
                        filteredPickupRequests.map((queue) =>(
                            <QueueItem
                                key={queue.id}
                                name={`${queue.fname} ${queue.lname}`}
                                address={formatAddress(queue)}
                                slimQuantity={queue.slimQuantity}
                                roundQuantity={queue.roundQuantity}
                                requestType={queue.requestType}
                                contact={queue.contactNumber}
                                status={queue.status}
                                date={queue.date}
                                time={queue.time}
                                image={queue.image}
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
                            <span>No deliver requests found</span>
                        </div>
                    ) : (
                        filteredDeliverRequests.map((queue) =>(
                            <QueueItem
                                key={queue.id}
                                name={`${queue.fname} ${queue.lname}`}
                                address={formatAddress(queue)}
                                slimQuantity={queue.slimQuantity}
                                roundQuantity={queue.roundQuantity}
                                requestType={queue.requestType}
                                contact={queue.contactNumber}
                                status={queue.status}
                                date={queue.date}
                                time={queue.time}
                                image={queue.image}
                                onAccept={()=> handleAccept(queue.id)}
                            />
                        ))
                    )}
                    
                </div>
            </div>
        </>
    );
};