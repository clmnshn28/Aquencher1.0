import React from 'react';
import Modal from 'components/Modal';


export const SuccessModal = ({isOpen, onClose, title, message}) =>{

    if(!isOpen) return null;

    return(
        <Modal>
            <div className="SuccessModal__container">
                <h2 className="SubmittedModal__title">{title}</h2> 
                <p className="SubmittedModal__messages">
                    {message}
                </p>
                <p className="SubmittedModal__note">
                    <b>Note:</b> It may take 3 to 5 minutes to receive the email verification.
                </p>
                <button className="SubmittedModal__close-buttons" onClick={onClose}>
                    Close
                </button>  
            </div>  
        </Modal>
    );
};