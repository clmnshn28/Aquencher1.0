import React from "react";
import 'assets/css/customer';
import Modal from "components/Modal";


export const ConfirmationModal = ({isOpen, onClose, onConfirm, image, title, message}) =>{

    if (!isOpen) return null;

    return(
        <Modal>
            <div className="ConfirmationModal__content">
                <div className="ConfirmationModal__header-container">
                    <img src={image} alt={`${title} Icon`}  />
                    <h2>{title}</h2>   
                </div>
                <p className="ConfirmationModal__message">{message}</p>
                <div className="ConfirmationModal__actions">
                <button className="ConfirmationModal__cancel" onClick={onClose}>Cancel</button>
                    <button className="ConfirmationModal__confirm" onClick={onConfirm}>Confirm</button>
                </div>
            </div>
        </Modal>
    );
};