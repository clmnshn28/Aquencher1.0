import "assets/css/admin"

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const CreateAnnouncementAdmin = () =>{

  const createhandleSubmit = (event) => {
    event.preventDefault();
    console.log('Form submitted!');
  };

  return (
    <div>
      <div className="create-announcement-container">
        <h1  className="create-announcement-header">Create Announcement</h1>
        <form onSubmit={createhandleSubmit} className="create-form-submit" >
          <div className="create-announcement-form-container">
            <div className="create-announcement-form-group">
              <label htmlFor="announcementTitle">Announcement Title</label>
              <input type="text" id="announcementTitle" name="announcementTitle" required/>
            </div>
            <div className="create-announcement-form-group summary-group">
              <label htmlFor="summary">Summary</label>
              <textarea id="summary" name="summary" placeholder="Write your announcement here..." required></textarea>
            </div>
          </div>
          <div className="create-announcement-form-actions">
            <Link to="/admin/announcements" className="btn btn-cancel">Cancel</Link>
            <button type="submit" className="btn btn-publish">Publish</button>
          </div>
        </form>  
      </div>
    </div>
  );
}
 