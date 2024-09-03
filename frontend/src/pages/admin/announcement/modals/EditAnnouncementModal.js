import React from "react";
import 'assets/css/admin';

import Modal from "components/Modal";
import TextField from "components/TextField";


export const EditAnnouncementModal = ({isOpen, onClose, onConfirm, announcementTitle, announcementSummary, handleAnnouncementTitleChange, handleAnnouncementSummaryChange}) => {


    if(!isOpen) return null;

    return(
        <Modal>
            <div className="CreateAnnouncementModal__container">
                <h1  className="CreateAnnouncementModal__header">Edit Announcement</h1>
                <form onSubmit={onConfirm} className="CreateAnnouncementModal__form-submit" >
                    <div className="CreateAnnouncementModal__form-container">
                        <div className="CreateAnnouncementModal__form-group">
                            <TextField 
                                label='Announcement Title' 
                                id='announcementTitle' 
                                name='announcementTitle' 
                                value={announcementTitle} 
                                onChange={handleAnnouncementTitleChange}
                                type='text'
                                isRequired
                            />
                        </div>
                        <div className="CreateAnnouncementModal__summary-group">
                            <TextField 
                                label='Summary' 
                                id='summary' 
                                name='summary' 
                                value={announcementSummary} 
                                onChange={handleAnnouncementSummaryChange}
                                type='text'
                                isTextArea ={true}
                                placeholder='Write your announcement here...'
                                isRequired
                            />
                        </div>
                    </div>
                    <div className="CreateAnnouncementModal__form-actions">
                        <button type="button" className="CreateAnnouncementModal__cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className=" CreateAnnouncementModal__publish">Publish</button>
                    </div>
                </form>  
            </div>
        </Modal>
    );
};