import React, { useState, useEffect } from 'react';
import { IoFilterSharp} from 'react-icons/io5';
import "assets/css/admin"

import * as images from 'assets/images';
import SearchBar from 'components/SearchBar';
import DropdownFilter from 'components/DropdownFilter';
import { ConcernItem } from 'components/ConcernItem';
import { ConcernSpecific } from 'components/ConcernSpecific';


export const ConcernsAdmin = () =>{
  
  const [concerns, setConcerns] = useState([
    { id: 1, fname: 'Karen Joyce', lname: 'Joson', email: 'karenjoycejoson@gmail.com', requestType: 'Refill', subject: 'Leaking Gallon Issue', message: 'I am reaching out regarding a refill request. Unfortunately, the gallon I received is leaking.', time: new Date('2024-09-25T20:20'), isNew: true, attachments: [images.pickSlim, images.pickRound] },
    { id: 2, fname: 'Francis Harvey', lname: 'Soriano', email: 'francissoriano@gmail.com', requestType: 'Borrow', subject: 'Unconfirmed Gallon Request', message: 'My request for a new gallon has not been confirmed yet. Please provide an update.', time: new Date('2024-09-25T12:12'), isNew: true, attachments: [] },
    { id: 4, fname: 'Miguel Angelo', lname: 'Barruga', email: 'miguelbarruga@gmail.com', requestType: 'Refill', subject: 'Delayed Gallon Delivery', message: 'The gallons were not delivered on the promised date. Please assist.', time: new Date('2024-09-21T12:12'), isNew: true, attachments: [] },
    { id: 5, fname: 'Mark David', lname: 'Basinillo', email: 'markbasinillo@gmail.com', requestType: 'Refill', subject: 'Delayed Gallon Delivery', message: 'I am reaching out regarding a refill request. Unfortunately, the gallon I received is leaking.', time: new Date('2024-08-21T12:16'), isNew: false, attachments: [] },
    { id: 6, fname: 'Andrea Joy', lname: 'Dela Torre', email: 'andredelatorre@gmail.com', requestType: 'Refill', subject: 'Water Quality Concern', message: 'The water quality this time seems different. Kindly check if it meets the standard.', time: new Date('2024-08-19T10:32'), isNew: false, attachments: [] },
    { id: 7, fname: 'Neil Carlo', lname: 'Zapanta', email: 'neilzapanta@gmail.com', requestType: 'Refill', subject: 'Special Delivery Time Request', message: 'I would like to request a special delivery time for my next order.', time: new Date('2024-07-11T12:14'), isNew: false, attachments: [] }
  ]);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredConcerns, setFilteredConcerns] = useState(concerns);
  const [selectedConcern, setSelectedConcern] = useState(null); 

  const [filters, setFilters] = useState({
    concernType: '',
  });

  const handleClearFilters = () => {
    setFilters({
      concernType: '',
    });
    setSearchQuery('');
    setFilteredConcerns(concerns); // Reset
    setActiveDropdown(null); 
  };

  const handleSearch = () => {
    if (searchQuery !== '') {
        const results = concerns.filter((concern) => {
            const fullName = `${concern.fname} ${concern.lname}`.toLowerCase();
        
            // Search by name
            return (
                fullName.includes(searchQuery.toLowerCase())
            );
        });
      setFilteredConcerns(results);
    }
  };

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredConcerns(concerns);
    }
  }, [searchQuery, concerns]);

const handleFilterChange = (name, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = {
        ...prevFilters,
        [name]: value,
      };

      // Automatically filter requests based on the updated filters
      const results = concerns.filter((concern) => {
        return (
          (updatedFilters.concernType === '' || concern.requestType === updatedFilters.concernType)
        );
      });
      
      setFilteredConcerns(results);
      return updatedFilters;
    });
    setActiveDropdown(null);
  };

  const toggleDropdown = (dropdown) => {
      setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleConcernClick = (concern) => {
    // mark the clicked concern as "not new"
    const updatedConcerns = concerns.map((c) => 
      c.id === concern.id ? { ...c, isNew: false } : c
    );
    setConcerns(updatedConcerns);
    setSelectedConcern(concern);  // Set the clicked concern
  };

  const handleBackClick = () => {
    setSelectedConcern(null);  // Go back to the list view
  };


  return (
    <>
      <div className="ConcernAdmin__header">
        <h2 className="ConcernAdmin__header-text">Customer Concerns</h2>
      </div>
      {!selectedConcern ? (
        <>
          <div className="ConcernAdmin__filter-container">
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
            />
            <IoFilterSharp className="ConcernAdmin__filter-icon" />
            <DropdownFilter
              label={filters.concernType || 'Concern Type'}
              isOpen={activeDropdown === 'concernType'}
              toggleDropdown={() => toggleDropdown('concernType')}
              options={[
                { label: 'Refill', value: 'Refill' },
                { label: 'Return', value: 'Return' },
                { label: 'Borrow', value: 'Borrow' },
              ]}
              onOptionSelect={(value) => handleFilterChange('concernType', value)}
            />
            {(searchQuery || filters.concernType) && (
              <button className="ConcernAdmin__clear-filters-button" onClick={handleClearFilters}>
                CLEAR
              </button>
            )}
          </div>

          <div className="ConcernAdmin__container">
            {filteredConcerns.length === 0 ? (
              searchQuery || filters.concernType ? (
                <div className="ConcernAdmin__item-not-found">No concerns found</div>
              ) : (
                <div className="ConcernAdmin__item-available">No concerns available</div>
              )
            ) : (
              filteredConcerns.map((concern) => (
                <ConcernItem
                  key={concern.id}
                  fname={concern.fname}
                  lname={concern.lname}
                  requestType={concern.requestType}
                  subject={concern.subject}
                  message={concern.message}
                  time={concern.time}
                  isNew={concern.isNew}
                  isAdmin={true}
                  onClick={() => handleConcernClick(concern)}
                />
              ))
            )}
          </div>
        </>
      ) : (
        <>
          <ConcernSpecific 
            selectedConcern={selectedConcern}
            handleBackClick={handleBackClick}
            isAdmin={true}
          />
        </>
      )}

    </>
  );
}
