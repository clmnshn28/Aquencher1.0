import React from "react";
import 'assets/css/customer';
import Modal from "components/Modal";
import ButtonGroup from "components/ButtonGroup";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import * as images from 'assets/images';
import {API_URL} from 'constants';

export const ConfirmationModal = ({isOpen, onClose, onConfirm, requestDetails , isProcessing}) =>{

    const handleCancel = () => {
        onClose(); 
    };
    
    const handleConfirm = () =>{
        onConfirm();
    };

    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    if (!isOpen) return null;

    return(
        <Modal>
            <div className="ConfirmationModal__content">
                <div className="ConfirmationModal__header-container">
                    <TbRosetteDiscountCheckFilled  className="ConfirmationModal__header-icon"/>
                    <h2>Confirm Request</h2>   
                </div>
                <p className="ConfirmationModal__message">Are you sure you want to accept this request?</p>
                <div className='AdminConfirmationModal__user-section'>
                    <img 
                        src={requestDetails.image ? `${API_URL}/storage/images/${requestDetails.image}` : images.defaultAvatar} 
                        alt={`${requestDetails.fname}'s Avatar`}
                        className="AdminConfirmationModal__user-avatar"
                    />
                    <div className='AdminConfirmationModal__user-info'>
                        <p className='AdminConfirmationModal__fullName'>{`${requestDetails.fname} ${requestDetails.lname}`}</p>

                        <div className='AdminConfirmationModal__request-details'>
                            <p className='AdminConfirmationModal__detail-label'>Request Type:</p>
                            <div className={`AdminConfirmationModal__request-type ${requestDetails.request_type.toLowerCase()}`}>
                                <img 
                                    src={
                                        requestDetails.request_type === 'refill' ? images.refillIconOpen :
                                        requestDetails.request_type === 'borrow' ? images.borrowIconRed : 
                                        images.returnIconGreen 
                                    } 
                                    alt={`${requestDetails.request_type} Icon`} 
                                    className='AdminConfirmationModal__request-icon'
                                />
                                <span className='AdminConfirmationModal__request-type-text'>{capitalize(requestDetails.request_type)}</span>
                            </div>
                        </div>
                        
                        <div className='AdminConfirmationModal__quantity-details'>
                            <div className={`AdminConfirmationModal__quantity-item ${requestDetails.slimQuantity > 0 ? '' : 'hidden'}`}>
                                <span className='AdminConfirmationModal__quantity-label'>Slim Quantity:</span>
                                <span className='AdminConfirmationModal__quantity-value'>{requestDetails.slimQuantity}</span>
                            </div>
                            <div className={`AdminConfirmationModal__quantity-item ${requestDetails.roundQuantity > 0 ? '' : 'hidden'}`}>
                                <span className='AdminConfirmationModal__quantity-label'>Round Quantity:</span>
                                <span className='AdminConfirmationModal__quantity-value'>{requestDetails.roundQuantity}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="AdminConfirmationModal__actions">
                    <ButtonGroup
                        onCancel={handleCancel}
                        onSave={handleConfirm}
                        disabled={isProcessing}
                        saveText={isProcessing ? 'Processing...' : 'Confirm'}
                        saveButtonColor='#0174CF'
                    />
                </div>
            </div>
        </Modal>
    );
};