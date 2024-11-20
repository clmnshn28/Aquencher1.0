import React, { useState, useEffect, useRef  } from 'react';
import { IoFilterSharp} from 'react-icons/io5';
import { IoIosArrowRoundBack, IoIosArrowRoundForward  } from "react-icons/io";
import "assets/css/admin"
import axios from 'axios';
import {API_URL} from 'constants';

import SearchBar from 'components/SearchBar';
import DropdownFilter from 'components/DropdownFilter';
import { ConcernItem } from 'components/ConcernItem';
import { ConcernSpecific } from 'components/ConcernSpecific';


export const ConcernsAdmin = () =>{
  
  const [concerns, setConcerns] = useState([]);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredConcerns, setFilteredConcerns] = useState(concerns);
  const [selectedConcern, setSelectedConcern] = useState(null); 
  const [isAccepting, setIsAccepting] = useState(false);
  const initialFetchDone = useRef(false);
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(()=>{
    if (!initialFetchDone.current) {  
      fetchConcern();
      initialFetchDone.current = true;
    }
  },[]);

  const fetchConcern = async () =>{
    try{
      const response = await axios.get(API_URL + '/api/admin/concern',{
        headers: {
          'Authorization' : `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
        },
    });

    const concernWithUpdatedDateTime = response.data.data.map((concern) => {
        const updatedAt = new Date(concern.created_at);
        const hasReply = concern.replies && concern.replies.length > 0; 
        const customerDetails = {
          id: concern.customer.id,
          fname: concern.customer.fname,
          lname: concern.customer.lname,
          email: concern.customer.email,
          image: concern.customer.image,
      };
      const adminDetails = {
          id: concern.admin.id,
          fname: concern.admin.fname,
          lname: concern.admin.lname,
          email: concern.admin.email,
          image: concern.admin.image,
      };

        return {
          ...concern,
          time: updatedAt,
          customer: customerDetails, 
          admin: adminDetails,
          isNew: concern.is_read === 0,
          hasReply, 
        };
      }).sort((a, b) => b.time - a.time);
      setConcerns( concernWithUpdatedDateTime);
    }catch(error){
      console.error('Error fetching concerns:', error);
    }
};

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedConcerns = filteredConcerns.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(filteredConcerns.length / ITEMS_PER_PAGE);


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
            const fullName = `${concern.customer.fname} ${concern.customer.lname}`.toLowerCase();
        
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
          (updatedFilters.concernType === '' || concern.concern_type === updatedFilters.concernType)
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

  const handleConcernClick = async (concern) => {
    setIsAccepting(true);
    try {
      await axios.put(`${API_URL}/api/admin/concern/${concern.id}/read`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
        },
      });
  
      const updatedConcerns = concerns.map((c) => 
        c.id === concern.id ? { ...c, isNew: false } : c
      );
      setConcerns(updatedConcerns);
      setSelectedConcern(concern);  // Set the clicked concern
    } catch (error) {
      console.error('Error marking concern as read:', error);
    }finally {
      setIsAccepting(false);
    }
  };

  const handleBackClick = () => {
    setSelectedConcern(null);  // Go back to the list view
  };

  const markAsResolved = (concernId) => {
    setConcerns((prevConcerns) =>
      prevConcerns.map((concern) =>
        concern.id === concernId ? { ...concern, hasReply: true } : concern
      )
    );
  };

  return (
    <>
      <div className="ConcernAdmin__header">
        <h2 className="ConcernAdmin__header-text" onClick={()=>fetchConcern()}>Customer Concerns</h2>
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
            {paginatedConcerns.length === 0 ? (
              searchQuery || filters.concernType ? (
                <div className="ConcernAdmin__item-not-found">No concerns found</div>
              ) : (
                <div className="ConcernAdmin__item-available">No concerns available</div>
              )
            ) : (
              paginatedConcerns.map((concern) => (
                <ConcernItem
                  key={concern.id}
                  fname={concern.customer.fname}
                  lname={concern.customer.lname}
                  requestType={concern.concern_type}
                  subject={concern.subject}
                  message={concern.content}
                  time={concern.time}
                  isNew={concern.isNew}
                  hasReply={concern.hasReply} 
                  isAdmin={true}
                  onClick={() => handleConcernClick(concern)}
                  acceptDisabled={isAccepting}
                />
              ))
            )}
          </div>
          {filteredConcerns.length > ITEMS_PER_PAGE && (
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
      ) : (
        <>
          <ConcernSpecific 
            selectedConcern={selectedConcern}
            handleBackClick={handleBackClick}
            isAdmin={true}
            markAsResolved={markAsResolved}
          />
        </>
      )}

    </>
  );
}
