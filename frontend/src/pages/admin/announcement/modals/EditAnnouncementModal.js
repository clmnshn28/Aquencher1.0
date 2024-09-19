import React from "react";
import 'assets/css/modals';

import Modal from "components/Modal";
import TextField from "components/TextField";
import TextArea from "components/TextArea";
import ButtonGroup from "components/ButtonGroup";


export const EditAnnouncementModal = ({isOpen, onClose, onConfirm, announcementTitle, announcementSummary, onTitleChange, onSummaryChange}) => {


    if(!isOpen) return null;

    return(
        <Modal>
            <div className="CreateAnnouncementModal__container">
                   <h2 className="CreateAnnouncementModal__header">Create Announcement</h2>
                <form onSubmit={onConfirm}  >
                    <div className="CreateAnnouncementModal__form-container">
                        <p className="CreateAnnouncementModal__description">
                            Fill in the subject and body of the announcement. Click publish to make it visible on the customer dashboard.
                        </p>
                        <div className="CreateAnnouncementModal__form-group">
                           <div className="CreateAnnouncementModal__title">
                                <TextField 
                                    label='Announcement Title' 
                                    id='announcementTitle' 
                                    name='announcementTitle' 
                                    value={announcementTitle} 
                                    onChange={onTitleChange}
                                    type='text'
                                    isRequired
                                    required
                                    autoComplete='off'
                                    style={{ border: '1.5px solid #0174CF'}}
                                />
                            </div>
                            <TextArea 
                                label='Summary' 
                                id='summary' 
                                name='summary' 
                                value={announcementSummary} 
                                onChange={onSummaryChange}
                                type='text'
                                placeholder='Write your announcement here...'
                                isRequired
                                required
                                style={{ height: '150px', border: '1.5px solid #0174CF'}}
                            />
                            <div className="CreateAnnouncementModal__form-actions">
                                <ButtonGroup  
                                    onCancel={onClose}
                                    saveText="Save Changes"
                                    saveButtonColor="#0174CF" 
                                
                                />
                            </div>
                        </div>
                        
                    </div>
                </form>  

            </div>
        </Modal>
    );
};