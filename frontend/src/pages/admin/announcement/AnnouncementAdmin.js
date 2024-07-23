import "assets/css/AnnouncementAdmin.css"
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import createAnnouncement from 'assets/images/create-announcement.png';
import inventoryDots from 'assets/images/user-dots.png';

export const AnnouncementAdmin = () =>{


  return (
    <div>
      <div className="announcement-container">
        <Link to="/Admin/Announcements/CreateAnnouncement" >
        <button className="create-announcement-button">
          <img className="create-announcement-icon" src={createAnnouncement} alt="Announcement Icon" />
          Create Announcement
        </button>
        </Link>
        <table className="announcement-table">
          <thead  className="inventory-table-header">
            <tr>
              <th>Date/Time</th>
              <th>Announcement</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {Array(5).fill().map((_, index) => (
              <tr key={index}>
                <td>9:00 AM<br />2024-01-02</td>
                <td>
                  <h3 className="title-announcement">Title</h3>
                  <p className="summary-announcement">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Imperdiet at malesuada quis, suscipit in lorem.</p>
                </td>
                <td>
                  <img 
                  src={inventoryDots} 
                  alt="actions"  
                  className="inventoryDots"/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
