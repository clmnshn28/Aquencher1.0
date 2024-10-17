import React from "react";
import 'assets/css/customer';
import Modal from "components/Modal";
import { format } from 'date-fns';

export const AnnouncementViewModal = ({isOpen, onClose, announcement}) =>{

    if(!isOpen || !announcement) return null;
 
    const readStatuses = announcement.read_status;

    return(
        <Modal onClick={onClose}>
            <div className="AnnouncementViewModal__container"  onClick={e => e.stopPropagation()}>
                <h2 className="AnnouncementViewModal__header">{announcement.title}</h2>
                <div className="AnnouncementViewModal__announcement-section">
                    <div className="AnnouncementViewModal__announce-sub-header">
                        <span className="AnnouncementViewModal__greeting">
                            Dear Valued Customers,
                        </span> 
                        <span className="AnnouncementViewModal__date-modal">
                            {format(announcement.date, 'yyyy MMM dd, hh:mm a')}
                        </span>
                    </div>
                    
                    <p className="AnnouncementViewModal__summary">
                        {announcement.content}
                    </p>

                    <div className="AnnouncementViewModal__footer">
                        <p className="AnnouncementViewModal__footer-closing">Best Regards,</p>
                        <p className="AnnouncementViewModal__footer-name">
                            {readStatuses[0].admin.fname} {readStatuses[0].admin.lname}
                        </p>
                        <p className="AnnouncementViewModal__footer-role">Admin</p>
                        <p className="AnnouncementViewModal__footer-company">Po’s Purified Drinking Water and Refilling Hub</p>
                    </div>
                </div>  
            </div>
        </Modal>
    );
};