import React from "react";
import 'assets/css/modals';
import Modal from "components/Modal";


export const PasswordResetModal = ({isOpen, onClose}) =>{

    if(!isOpen) return null;

    return(
        <Modal>
            <div className="SubmittedModal__container">
                <h2 className="SubmittedModal__title">Password Reset Successful!</h2>
                <p className="SubmittedModal__message">
                    Your password has been successfully reset. <span> You can now log in with your new password.</span>
                </p>
                <button className="SubmittedModal__close-button" onClick={onClose}>
                    Close
                </button>
            </div>
        </Modal>
    );
};
