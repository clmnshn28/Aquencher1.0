import "assets/css/admin"
import React, { useState } from 'react';
import { MdOutlineDelete, MdOutlineEdit } from "react-icons/md";
import { RiDeleteBin6Fill } from "react-icons/ri";

import * as images from 'assets/images';
import { CreateAnnouncementModal, DeleteAnnouncementModal } from "./modals";
import { EditAnnouncementModal } from "./modals/EditAnnouncementModal";

export const AnnouncementAdmin = () =>{

  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Water Quality Inspection', summary: 'Reminder: Water quality inspection scheduled for next week.' },
    { id: 2, title: 'Maintenance Downtime', summary: 'Planned maintenance on water refilling machines this Friday.' },
    { id: 3, title: 'New Water Delivery Service', summary: 'We are introducing a new water delivery service starting next month.' },
    { id: 4, title: 'Employee Training Session', summary: 'Mandatory training session on safety protocols for all staff.' },
    { id: 5, title: 'Customer Feedback', summary: 'Encouraging all customers to fill out the feedback form after their next refill.' }
  ]);

  const [createAnnouncement, setCreateAnnouncement] = useState(false);
  const [editAnnouncement, setEditAnnouncement] = useState(false);
  const [deleteAnnouncement, setDeleteAnnouncement] = useState(false);

  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementSummary, setAnnouncementSummary] = useState('');
  const [selectedTitle, setSelectedTitle] = useState('');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

  const handleAnnouncementTitleChange = (e) => setAnnouncementTitle(e.target.value);
  const handleAnnouncementSummaryChange = (e) => setAnnouncementSummary(e.target.value);


  // delete announcement
  const handleDeleteClick = (title) => {
    setSelectedTitle(title);
    setDeleteAnnouncement(true);
  };

  const handleDeleteConfirm = () =>{
    setDeleteAnnouncement(false);
    setAnnouncements(announcements.filter(a => a.title !== selectedTitle));

  };

  // edit announcement
  const handleEditClick = (announcement) => {
    setSelectedAnnouncement(announcement);
    setAnnouncementTitle(announcement.title);
    setAnnouncementSummary(announcement.summary);
    setEditAnnouncement(true);
  };


  // submit for submit and cancel announcement
  const AnnounceCancel = () => {
    setAnnouncementTitle('');
    setAnnouncementSummary('');
    setCreateAnnouncement(false);
    setEditAnnouncement(false);
  };

  const AnnounceSubmit = (event) =>{
    event.preventDefault();
    if (editAnnouncement) {
      // update existing announcement
      setAnnouncements(announcements.map(a =>
        a.id === selectedAnnouncement.id
          ? { ...a, title: announcementTitle, summary: announcementSummary }
          : a
      ));
    } else {
      // create new announcement
      setAnnouncements([ {
        id: announcements.length + 1,
        title: announcementTitle,
        summary: announcementSummary
      },
       ...announcements
    ]);
    }
    AnnounceCancel();
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
              <th>Announcement</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {announcements.length === 0 ? (
              <tr>
                <td colSpan="3">
                  <div className="AnnouncementAdmin__no-announcements">
                    No announcements available.
                  </div>
                </td>
              </tr>
            ) : (
              announcements.map((announcement) =>  (
                <tr key={announcement.id}>
                  <td>9:00 AM<br />2024-01-02</td>
                  <td>
                    <h3 className="AnnouncementAdmin__title">{announcement.title}</h3>
                    <p className="AnnouncementAdmin__summary">
                    {announcement.summary}
                    </p>
                  </td>
                  <td>
                    <div className="AnnouncementAdmin__actions">
                      <button className="AnnouncementAdmin__edit" onClick={() => handleEditClick(announcement)}>
                        <MdOutlineEdit/>
                      </button>
                      <button className="AnnouncementAdmin__delete" onClick={()=> handleDeleteClick(announcement.title)}>
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
        onConfirm ={AnnounceSubmit}
        announcementTitle ={announcementTitle}
        announcementSummary ={announcementSummary}
        handleAnnouncementTitleChange = {handleAnnouncementTitleChange}
        handleAnnouncementSummaryChange = {handleAnnouncementSummaryChange}
      />

      <EditAnnouncementModal
        isOpen={editAnnouncement}
        onClose={AnnounceCancel}
        onConfirm={AnnounceSubmit}
        announcementTitle={announcementTitle}
        announcementSummary={announcementSummary}
        handleAnnouncementTitleChange={handleAnnouncementTitleChange}
        handleAnnouncementSummaryChange={handleAnnouncementSummaryChange}
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
