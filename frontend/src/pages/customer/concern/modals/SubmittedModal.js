import React from "react";
import 'assets/css/modals';
import Modal from "components/Modal";


export const SubmittedModal = ({isOpen, onClose}) =>{

    if(!isOpen) return null;

    return(
        <Modal>
            <div className="SubmittedModal__container">
                <h2 className="SubmittedModal__title">Concern Submitted Successfully!</h2>
                <p className="SubmittedModal__message">
                    Thank you for taking the time to share your <span>thoughts with us.</span>
                </p>
                <button className="SubmittedModal__close-button" onClick={onClose}>
                    Close
                </button>
            </div>
        </Modal>
    );
};
