import React from "react";
import 'assets/css/customer';
import Modal from "components/Modal";
import { PiSealWarning } from "react-icons/pi";

export const TypeConcernModal = ({isOpen, onClose}) =>{

    if (!isOpen) return null;

    return(
        <Modal>
            <div className="AddressPromptModal__content">
                <PiSealWarning className="AddressPromptModal__icon"/>
                <p className="AddressPromptModal__message">Please select a type for your concern.</p>
                <div className="AddressPromptModal__actions">
                   <button className="AddressPromptModal__cancel" onClick={onClose}>
                        Close
                   </button>
                </div>
            </div>
        </Modal>
    );

};