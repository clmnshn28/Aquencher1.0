import "assets/css/admin"
import React, { useState, useEffect, useRef  } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { MdOutlineEdit } from "react-icons/md";
import { IoArchive } from "react-icons/io5";
import { IoIosArrowRoundBack, IoIosArrowRoundForward  } from "react-icons/io";
import axios from 'axios';
import {API_URL} from 'constants';
import { format } from 'date-fns';
import { Tooltip as ReactTooltip } from 'react-tooltip';

import * as images from 'assets/images';
import { CreateAnnouncementModal, DeleteAnnouncementModal,EditAnnouncementModal } from "./modals";

export const AnnouncementAdmin = () =>{
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);

  const [createAnnouncement, setCreateAnnouncement] = useState(false);
  const [editAnnouncement, setEditAnnouncement] = useState(false);
  const [deleteAnnouncement, setDeleteAnnouncement] = useState(false);

  const [announcement, setAnnouncement] = useState({ title: '', summary: '' });
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [isAccepting, setIsAccepting] = useState(false);
  const initialFetchDone = useRef(false);
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedAnnouncement = announcements.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(announcements.length / ITEMS_PER_PAGE);

  useEffect(()=>{
    if (!initialFetchDone.current) {
      fetchAnnouncement();
      initialFetchDone.current = true;
    }
  },[])

  const fetchAnnouncement = async () =>{
    try{
      const response = await axios.get(API_URL + '/api/admin/announcement',{
        headers: {
          'Authorization' : `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
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
    setIsAccepting(true); 

      try{
        await axios.put(API_URL + '/api/admin/announcement',{
          title: announcement.title,
          content: announcement.summary,
        },{
          headers: {
            'Authorization' : `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
          },
        });

        AnnounceCancel();
        fetchAnnouncement();
      }catch(error){
        console.error('Error Create Announcement: ',error);
      }finally {
        setIsAccepting(false);
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
    setIsAccepting(true); 
      try{
        await axios.put(`${API_URL}/api/admin/announcement/${selectedAnnouncement.id}`,{
          title: announcement.title,
          content: announcement.summary,
        },{
          headers: {
            'Authorization' : `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
          },
        });
        setSelectedAnnouncement(null);
      AnnounceCancel();
      fetchAnnouncement();
      }catch(error){
        console.error('Error Create Announcement: ',error);
      }finally {
        setIsAccepting(false);
      }
  };

  // delete announcement
  const handleDeleteClick = (announcement) => {
    setSelectedAnnouncement(announcement); 
    setSelectedTitle(announcement.title);
    setDeleteAnnouncement(true);
  };

  const handleArchiveClick  = async () =>{
    setIsAccepting(true); 
    try {
      await axios.delete(`${API_URL}/api/admin/announcement/${selectedAnnouncement.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
        },
      });
      
      setAnnouncements(announcements.filter(a => a.id !== selectedAnnouncement.id));
      setDeleteAnnouncement(false);
    } catch (error) {
      console.error('Error deleting announcement:', error);
    }finally {
      setIsAccepting(false);
    }
  };

  const handleArchiveNavigation = () => {
    navigate('/admin/announcements/archive');
  };

  return (
    <>
      <div className="AnnouncementAdmin__container">
        <button className="AnnouncementAdmin__archive-button"  onClick={handleArchiveNavigation}>
          <IoArchive className="AnnouncementAdmin__archive-icon" /> Archive
        </button>
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
            {paginatedAnnouncement.length === 0 ? (
              <tr>
                <td colSpan="3">
                  <div className="AnnouncementAdmin__no-announcements">
                    No announcements
                  </div>
                </td>
              </tr>
            ) : (
              paginatedAnnouncement.map((announcement) =>  (
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
                      <button 
                      className="AnnouncementAdmin__edit" 
                      onClick={() => handleEditClick(announcement)}
                      data-tooltip-id="edit-tooltip"
                      data-tooltip-content="Edit"
                      >
                        <MdOutlineEdit/>
                      </button>
                      <button 
                      className="AnnouncementAdmin__delete" 
                      onClick={()=> handleDeleteClick(announcement)}
                      data-tooltip-id="archive-tooltip"
                      data-tooltip-content="Archive"
                      >
                        <IoArchive />
                      </button>
                      <ReactTooltip
                          id="edit-tooltip"
                          place="top"
                          className="custom-tooltip" 
                      />
                      <ReactTooltip
                          id="archive-tooltip"
                          place="top"
                          className="custom-tooltip" 
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {announcements.length > ITEMS_PER_PAGE && (
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
      <CreateAnnouncementModal
        isOpen ={createAnnouncement}
        onClose ={AnnounceCancel}
        onConfirm ={CreateAnnounceSubmit}
        announcementTitle ={announcement.title}
        announcementSummary ={announcement.summary}
        onTitleChange={handleTitleChange}
        onSummaryChange={handleSummaryChange}
        acceptDisabled={isAccepting}
      />

      <EditAnnouncementModal
        isOpen={editAnnouncement}
        onClose={AnnounceCancel}
        onConfirm={UpdateAnnounceSubmit}
        announcementTitle={announcement.title}
        announcementSummary={announcement.summary}
        onTitleChange={handleTitleChange}
        onSummaryChange={handleSummaryChange}
        acceptDisabled={isAccepting}
      />

      <DeleteAnnouncementModal
        isOpen={deleteAnnouncement}
        onClose={() => setDeleteAnnouncement(false)}
        onConfirm={handleArchiveClick }
        title={selectedTitle}
        acceptDisabled={isAccepting}
      />
    </>
  );
}
