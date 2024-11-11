import React from 'react';
import Modal from 'components/Modal';


export const SuccessModal = ({isOpen, onClose, title, message}) =>{

    if(!isOpen) return null;

    return(
        <Modal>
            <div className="SuccessModal__container">
                <h2 className="SubmittedModal__title">{title}</h2> 
                <p className="SubmittedModal__message">
                    {message}
                </p>
                <button className="SubmittedModal__close-button" onClick={onClose}>
                    Close
                </button>  
            </div>  
        </Modal>
    );
};