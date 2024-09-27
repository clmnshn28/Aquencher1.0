import React from "react";
import 'assets/css/customer';
import Modal from "components/Modal";


export const AnnouncementViewModal = ({isOpen, onClose, announcement}) =>{

    if(!isOpen || !announcement) return null;

    return(
        <Modal onClick={onClose}>
            <div className="AnnouncementViewModal__container"  onClick={e => e.stopPropagation()}>
                <h2 className="AnnouncementViewModal__header">{announcement.title}</h2>
                <div className="AnnouncementViewModal__announcement-section">
                    <p className="AnnouncementViewModal__greeting">
                       Dear Valued Customers,
                    </p>
                    <p className="AnnouncementViewModal__summary">
                        {announcement.summary}
                    </p>

                    <div className="AnnouncementViewModal__footer">
                        <p className="AnnouncementViewModal__footer-closing">Best Regards,</p>
                        <p className="AnnouncementViewModal__footer-name">Celmin Shane Quizon</p>
                        <p className="AnnouncementViewModal__footer-role">Admin</p>
                        <p className="AnnouncementViewModal__footer-company">Po’s Purified Drinking Water and Refilling Hub</p>
                    </div>
                </div>  
            </div>
        </Modal>
    );
};