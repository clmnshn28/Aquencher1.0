import "assets/css/admin"
import React, { useState, useEffect } from 'react';
import { MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";
import axios from 'axios';
import {API_URL} from 'constants';
import { format } from 'date-fns';

import * as images from 'assets/images';
import { CreateAnnouncementModal, DeleteAnnouncementModal,EditAnnouncementModal } from "./modals";

export const AnnouncementAdmin = () =>{

  const [announcements, setAnnouncements] = useState([]);

  const [createAnnouncement, setCreateAnnouncement] = useState(false);
  const [editAnnouncement, setEditAnnouncement] = useState(false);
  const [deleteAnnouncement, setDeleteAnnouncement] = useState(false);

  const [announcement, setAnnouncement] = useState({ title: '', summary: '' });
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  useEffect(()=>{
    fetchAnnouncement();
  },[])

  const fetchAnnouncement = async () =>{
    try{
      const response = await axios.get(API_URL + '/api/admin/announcement',{
        headers: {
          'Authorization' : `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const announcementWithUpdatedDateTime = response.data.data
      .map((announcement) => {
        const updatedAt = new Date(announcement.updated_at);
        const formattedDate = format(updatedAt, 'yyyy-MM-dd');
        const formattedTime = format(updatedAt, 'hh:mm a');

        return {
          ...announcement,
          date: formattedDate, 
          time: formattedTime, 
          updatedAt
        };
      }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      setAnnouncements( announcementWithUpdatedDateTime);
    }catch(error){
      console.error('Error fetching announcements:', error);
    }
  };

  const handleTitleChange = (e) => setAnnouncement(prevState => ({ ...prevState, title: e.target.value }));
  const handleSummaryChange = (e) => setAnnouncement(prevState => ({ ...prevState, summary: e.target.value }));


  // submit and cancel announcement
  const AnnounceCancel = () => {
    setAnnouncement({ title: '', summary: '' });
    setCreateAnnouncement(false);
    setEditAnnouncement(false);
  };

  // create announcement
  const CreateAnnounceSubmit = async (event) =>{
    event.preventDefault();
      try{
        await axios.put(API_URL + '/api/admin/announcement',{
          title: announcement.title,
          content: announcement.summary,
        },{
          headers: {
            'Authorization' : `Bearer ${localStorage.getItem('token')}`,
          },
        });

        AnnounceCancel();
        fetchAnnouncement();
      }catch(error){
        console.error('Error Create Announcement: ',error);
      }
 
  };

  
  // edit announcement
  const handleEditClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setAnnouncement({ title: announcement.title, summary: announcement.content });
    setEditAnnouncement(true);
  };

  const UpdateAnnounceSubmit = async (event) =>{
    event.preventDefault();
      try{
        await axios.put(`${API_URL}/api/admin/announcement/${selectedAnnouncement.id}`,{
          title: announcement.title,
          content: announcement.summary,
        },{
          headers: {
            'Authorization' : `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setSelectedAnnouncement(null);
      AnnounceCancel();
      fetchAnnouncement();
      }catch(error){
        console.error('Error Create Announcement: ',error);
      }
  };

  // delete announcement
  const handleDeleteClick = (announcement) => {
    setSelectedAnnouncement(announcement); 
    setSelectedTitle(announcement.title);
    setDeleteAnnouncement(true);
  };

  const handleDeleteConfirm = async () =>{
    try {
      await axios.delete(`${API_URL}/api/admin/announcement/${selectedAnnouncement.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      setAnnouncements(announcements.filter(a => a.id !== selectedAnnouncement.id));
      setDeleteAnnouncement(false);
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }
  };

  return (
    <>
      <div className="AnnouncementAdmin__container">
        <button className="AnnouncementAdmin__announcement-button"   onClick={() => setCreateAnnouncement(true)}>
          <img className="AnnouncementAdmin__announcement-icon" src={images.createAnnouncement} alt="Announcement Icon" />
          Create Announcement
        </button>
        <table className="AnnouncementAdmin__table">
          <thead  className="AnnouncementAdmin__table-header">
            <tr>
              <th>Date/Time</th>
              <th>{announcements.length > 1 ? 'Announcements' : 'Announcement'}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {announcements.length === 0 ? (
              <tr>
                <td colSpan="3">
                  <div className="AnnouncementAdmin__no-announcements">
                    No announcements
                  </div>
                </td>
              </tr>
            ) : (
              announcements.map((announcement) =>  (
                <tr key={announcement.id} >
                  <td>{announcement.time}<br />{announcement.date}</td>
                  <td>
                    <h3 className="AnnouncementAdmin__title">{announcement.title}</h3>
                    <p className="AnnouncementAdmin__summary">
                    {announcement.content}
                    </p>
                  </td>
                  <td>
                    <div className="AnnouncementAdmin__actions">
                      <button className="AnnouncementAdmin__edit" onClick={() => handleEditClick(announcement)}>
                        <MdOutlineEdit/>
                      </button>
                      <button className="AnnouncementAdmin__delete" onClick={()=> handleDeleteClick(announcement)}>
                        <RiDeleteBin6Fill/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <CreateAnnouncementModal
        isOpen ={createAnnouncement}
        onClose ={AnnounceCancel}
        onConfirm ={CreateAnnounceSubmit}
        announcementTitle ={announcement.title}
        announcementSummary ={announcement.summary}
        onTitleChange={handleTitleChange}
        onSummaryChange={handleSummaryChange}
      />

      <EditAnnouncementModal
        isOpen={editAnnouncement}
        onClose={AnnounceCancel}
        onConfirm={UpdateAnnounceSubmit}
        announcementTitle={announcement.title}
        announcementSummary={announcement.summary}
        onTitleChange={handleTitleChange}
        onSummaryChange={handleSummaryChange}
      />

      <DeleteAnnouncementModal
        isOpen={deleteAnnouncement}
        onClose={() => setDeleteAnnouncement(false)}
        onConfirm={handleDeleteConfirm}
        title={selectedTitle}
      />
    </>
  );
}
