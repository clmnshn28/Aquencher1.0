import React from "react";
import 'assets/css/admin';
import Modal from "components/Modal";
import ButtonGroup from "components/ButtonGroup";

export const DeleteAnnouncementModal = ({isOpen, onClose, onConfirm, title}) =>{

    if(!isOpen) return null;

    return(
        <Modal>
            <div className="DeleteAnnouncementModal__content">
                <h2 className='DeleteAnnouncementModal__header'>Deletion Announcement</h2>
                <p>Are you sure you want to delete this announcement?</p>
                <p><b><em>'{title}'</em></b></p><br/>
                <p>This action cannot be undone.</p>
                <div className="DeleteAnnouncementModal__actions">
                    <ButtonGroup  
                        onSave={onConfirm}
                        onCancel={onClose}
                        saveText="Confirm"
                        saveButtonColor="#9E1616" 
                    />
                </div>
            </div>
        </Modal>
    );
};