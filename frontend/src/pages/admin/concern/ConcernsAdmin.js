import "assets/css/admin"
import React, { useState } from 'react';

import * as images from 'assets/images';

export const ConcernsAdmin = () =>{
  
  const [concerns, setConcerns] = useState([
    { name: 'Karen Joyce Joson', message: 'Good day! Your service in refilling our gallons is excellent. The response to our requests is quick and efficient. Thank you for your excellent service!', time: '1 day ago' },
    { name: 'Celmin Shane', message: 'The system is user-friendly and efficient. No major issues encountered. Keep up the good work!', time: '1 day ago' },
    { name: 'Hong Hae In', message: 'Good day! Your service in refilling our gallons is excellent. The response to our requests is quick and efficient. Thank you for your excellent service!', time: '1 day ago' },
    { name: 'Baek Hyun Woo', message: 'Good day! Your service in refilling our gallons is excellent. The response to our requests is quick and efficient. Thank you for your excellent service!', time: '1 day ago' },
    { name: 'Im Sol', message: 'Good day! Your service in refilling our gallons is excellent. The response to our requests is quick and efficient. Thank you for your excellent service!', time: '1 day ago' },
    { name: 'Ryu Sun Jae', message: 'Good day! Your service in refilling our gallons is excellent. The response to our requests is quick and efficient. Thank you for your excellent service!', time: '1 day ago' }
  ]);
  const [concernDropdownVisible, setConcernDropdownVisible] = useState(false);
  const [concernSelectedFilter, setConcernSelectedFilter] = useState('All');
  const [concernFilterIconOpen, setConcernFilterIconOpen] = useState(false); 


// filter concern
  const toggleFilterDropdown = () => {
    setConcernDropdownVisible(!concernDropdownVisible);
    setConcernFilterIconOpen(!concernFilterIconOpen);
  };

  const handleFilterSelect = (filter) => {
    setConcernSelectedFilter(filter);
    setConcernDropdownVisible(false);
  };

  return (
    <div>
      <div className="concerns-container">
        <div className="concerns-header">
          <h2 className="concerns-header-text">Concerns</h2>
          <div className="concerns-filter-dropdown" onClick={toggleFilterDropdown}>
            <span className="final-concern-filter">{concernSelectedFilter}</span>
            <img
              className={`concern-filter-open ${concernFilterIconOpen ? 'open' : ''}`} // Apply different class for open state
              src={`${concernFilterIconOpen ? images.concernFilterClose : images.concernFilterOpen}`}
              alt="Dropdown Arrow"
            />
            {concernDropdownVisible && (
              <div className="filter-options">
                {['All', 'New'].map(filter => (
                  <div 
                  className={`selected-concern-list ${concernSelectedFilter === filter ? 'selected-concern' : ''}`}
                  key={filter} 
                  onClick={() => handleFilterSelect(filter)}
                  >{filter}</div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="concerns-list">
          {concerns.map((concern, index) => (
            <div key={index} className="concern-item">
              <img className="concern-avatar" src={images.defaultAvatar} alt="" />
              <div className="concern-details">
                <p className="concern-name">{concern.name}</p>
                <p className="concern-message">{concern.message}</p>
                <p className="concern-time">{concern.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
