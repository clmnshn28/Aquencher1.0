import React from "react";
import 'assets/css/admin';

import Modal from "components/Modal";
import TextField from "components/TextField";
import TextArea from "components/TextArea";
import ButtonGroup from "components/ButtonGroup";


export const EditAnnouncementModal = ({isOpen, onClose, onConfirm, announcementTitle, announcementSummary, onTitleChange, onSummaryChange}) => {


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
                                onChange={onTitleChange}
                                type='text'
                                isRequired
                            />
                        </div>
                        <div className="CreateAnnouncementModal__summary-group">
                            <TextArea
                                label='Summary' 
                                id='summary' 
                                name='summary' 
                                value={announcementSummary} 
                                onChange={onSummaryChange}
                                type='text'
                                placeholder='Write your announcement here...'
                                isRequired
                            />
                        </div>
                    </div>
                    <div className="CreateAnnouncementModal__form-actions">
                        <ButtonGroup  
                            onSave={onConfirm}
                            onCancel={onClose}
                            saveText="Publish"
                            saveButtonColor="#0174CF" 
                        />
                    </div>
                </form>  
            </div>
        </Modal>
    );
};