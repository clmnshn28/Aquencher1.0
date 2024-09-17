import React from "react";
import 'assets/css/modals';
import Modal from "components/Modal";
import ButtonGroup from "components/ButtonGroup";
import { RiErrorWarningLine } from "react-icons/ri";

export const DeleteAnnouncementModal = ({isOpen, onClose, onConfirm, title}) =>{

    if(!isOpen) return null;

    return(
        <Modal>
            <div className="DeleteAnnouncementModal__content">
                <h2 className='DeleteAnnouncementModal__header'>Deletion Announcement</h2>
                <p>Are you sure you want to delete this announcement?</p>
                <p className="DeleteAnnouncementModal__announcementTitle">
                    Announcement Title:
                </p>
                <p><b><em>{title}</em></b></p><br/>
                <div className="DeleteAnnouncementModal__warning">
                    <RiErrorWarningLine  className="DeleteAnnouncementModal__warning-icon"/>
                    <i><b>Warning :</b> Deleting this announcement is permanent and cannot be undone.</i>
                </div>
                <div className="DeleteAnnouncementModal__actions">
                    <ButtonGroup  
                        onSave={onConfirm}
                        onCancel={onClose}
                        saveText="Delete"
                        saveButtonColor="#9E1616" 
                    />
                </div>
            </div>
        </Modal>
    );
};