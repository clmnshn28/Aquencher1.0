import React from "react";
import 'assets/css/modals';

import ButtonGroup from "components/ButtonGroup";
import Modal from "components/Modal";


export const ResetPasswordConfirmationModal = ({isOpen, onClose, onConfirm, username }) =>{

    if(!isOpen) return null;

    return(
        <Modal>
            <div className="ResetPasswordConfirmationModal__content">
                <h2 className='ResetPasswordConfirmationModal__header'>Confirm Password Reset</h2>
                <p> Are you sure you want to reset the password? <br/> This action cannot be undone.</p>
        
                <div className="ResetPasswordConfirmationModal__modal-actions">
                    <ButtonGroup
                        onSave={onConfirm}
                        onCancel={onClose}
                        saveText="Confirm"
                        saveButtonColor='#0174CF'
                    /> 
                </div>
            </div>
        </Modal>
    );
};