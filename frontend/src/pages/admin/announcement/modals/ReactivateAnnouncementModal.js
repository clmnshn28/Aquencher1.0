import React from "react";
import 'assets/css/modals';
import Modal from "components/Modal";
import ButtonGroup from "components/ButtonGroup";
import { RiErrorWarningLine } from "react-icons/ri";

export const ReactivateAnnouncementModal = ({isOpen, onClose, onConfirm, title, acceptDisabled }) =>{

    if(!isOpen) return null;

    return(
        <Modal>
            <div className="DeleteAnnouncementModal__content">
                <h2 className='DeleteAnnouncementModal__header'>Unarchive  Announcement</h2>
                <p>Are you sure you want to unarchive this announcement?</p>
                <p className="DeleteAnnouncementModal__announcementTitle">
                    Announcement Title:
                </p>
                <p><b><em>{title}</em></b></p><br/>
                <div className="DeleteAnnouncementModal__warning">
                    <RiErrorWarningLine  className="DeleteAnnouncementModal__warning-icon"/>
                    <i><b>Warning :</b> Unarchiving will restore this announcement to active view.</i>
                </div>
                <div className="DeleteAnnouncementModal__actions">
                    <ButtonGroup  
                        onSave={onConfirm}
                        onCancel={onClose}
                        saveText="Unarchive"
                        saveButtonColor="#0174CF" 
                        disabled={acceptDisabled} 
                    />
                </div>
            </div>
        </Modal>
    );
};