import "assets/css/admin"
import React, { useState, useEffect, useRef  } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { RiInboxUnarchiveFill } from "react-icons/ri";
import { IoArrowBackCircle } from "react-icons/io5";
import { IoIosArrowRoundBack, IoIosArrowRoundForward  } from "react-icons/io";
import axios from 'axios';
import {API_URL} from 'constants';
import { format } from 'date-fns';
import { Tooltip as ReactTooltip } from 'react-tooltip';

import { ReactivateAnnouncementModal } from "./modals/ReactivateAnnouncementModal";

export const ArchiveAnnouncement = () =>{
    const navigate = useNavigate();
    const [archivedAnnouncements, setArchivedAnnouncements] = useState([]);
    const [unarchiveModalOpen, setUnarchiveModalOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [isAccepting, setIsAccepting] = useState(false);
    const initialFetchDone = useRef(false);
    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const paginatedAnnouncement = archivedAnnouncements.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const totalPages = Math.ceil(archivedAnnouncements.length / ITEMS_PER_PAGE);


    useEffect(() => {
        if (!initialFetchDone.current) {
            fetchArchivedAnnouncements();
            initialFetchDone.current = true;
        }   
    }, []);
    
    const fetchArchivedAnnouncements = async () => {
        try {
          const response = await axios.get(API_URL + '/api/admin/announcement/archived', {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
            },
          });
          const formattedAnnouncements = response.data.data.map(announcement => ({
            ...announcement,
            date: format(new Date(announcement.updated_at), 'yyyy-MM-dd'),
            time: format(new Date(announcement.updated_at), 'hh:mm a'),
          }));
          setArchivedAnnouncements(formattedAnnouncements);
        } catch (error) {
          console.error('Error fetching archived announcements:', error);
        }
    };

    const handleUnarchiveClick = (announcement) => {
        setSelectedAnnouncement(announcement);
        setUnarchiveModalOpen(true); 
    };

    const confirmUnarchive = async () => {
        setIsAccepting(true); 
        try {
            await axios.put(`${API_URL}/api/admin/announcement/restore/${selectedAnnouncement.id}`, {}, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
                },
            });
            setArchivedAnnouncements(prev => prev.filter(a => a.id !== selectedAnnouncement.id));
            setUnarchiveModalOpen(false);  
            setSelectedAnnouncement(null);  
        } catch (error) {
            console.error('Error unarchiving announcement:', error);
        }finally {
            setIsAccepting(false);
        }
        
    };

    const handleArchiveNavigation = () => {
        navigate('/admin/announcements');
      };

    return(
        <>  
            <div className="ArchiveAnnouncement__container">
                <div className="ArchiveAnnouncement__header-container">
                    <IoArrowBackCircle className="ArchiveAnnouncement__back-icon" onClick={handleArchiveNavigation} />
                    <h2>Archived Announcement</h2>
                </div>
                <table className="AnnouncementAdmin__table">
                    <thead  className="AnnouncementAdmin__table-header">
                        <tr>
                        <th>Date/Time</th>
                        <th>{archivedAnnouncements.length > 1 ? 'Announcements' : 'Announcement'}</th>
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
                                    className="AnnouncementAdmin__delete" 
                                    onClick={()=> handleUnarchiveClick(announcement)}
                                    data-tooltip-id="archive-tooltip"
                                    data-tooltip-content="Unarchive"
                                    >
                                        <RiInboxUnarchiveFill />
                                    </button>
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
                {archivedAnnouncements.length > ITEMS_PER_PAGE && (
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

            <ReactivateAnnouncementModal
                isOpen={unarchiveModalOpen}
                onClose={() => setUnarchiveModalOpen(false)}
                onConfirm={confirmUnarchive} 
                title={selectedAnnouncement?.title}
                acceptDisabled={isAccepting}
            />
        </>
    );
};