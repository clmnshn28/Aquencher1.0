import React, { useState } from "react";
import 'assets/css/modals';
import {API_URL} from 'constants';

import * as images from 'assets/images';
import Modal from "components/Modal";
import ButtonGroup from "components/ButtonGroup";
import TextArea from "components/TextArea";

export const RejectedModal = ({isOpen, onClose, onConfirm, rejectedDetails}) =>{

    const [reason, setReason] = useState('');

    const handleCancel = () => {
        setReason(''); 
        onClose(); 
    };
    
    const handleConfirm = () =>{
        onConfirm(reason);
        setReason('');
    };
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    if(!isOpen || !rejectedDetails) return null;

    return(
        <Modal>
            <div className="RejectedModal__content">
                <h2 className='RejectedModal__header'>Reject Customer Request</h2>

                <div className='RejectedModal__user-section'>
                    <img 
                        src={rejectedDetails.image ? `${API_URL}/storage/images/${rejectedDetails.image}` : images.defaultAvatar} 
                        alt={`${rejectedDetails.fname}'s Avatar`}
                        className="RejectedModal__user-avatar"
                    />
                    <div className='RejectedModal__user-info'>
                        <p className='RejectedModal__fullName'>{`${rejectedDetails.fname} ${rejectedDetails.lname}`}</p>

                        <div className='RejectedModal__request-details'>
                            <p className='RejectedModal__detail-label'>Request Type:</p>
                            <div className={`RejectedModal__request-type ${rejectedDetails.request_type.toLowerCase()}`}>
                                <img 
                                    src={
                                        rejectedDetails.request_type === 'refill' ? images.refillIconOpen :
                                        rejectedDetails.request_type === 'borrow' ? images.borrowIconRed : 
                                        images.returnIconGreen 
                                    } 
                                    alt={`${rejectedDetails.request_type} Icon`} 
                                    className='RejectedModal__request-icon'
                                />
                                <span className='RejectedModal__request-type-text'>{capitalize(rejectedDetails.request_type)}</span>
                            </div>
                        </div>
                        
                        <div className='RejectedModal__quantity-details'>
                            <div className={`RejectedModal__quantity-item ${rejectedDetails.slimQuantity > 0 ? '' : 'hidden'}`}>
                                <span className='RejectedModal__quantity-label'>Slim Quantity:</span>
                                <span className='RejectedModal__quantity-value'>{rejectedDetails.slimQuantity}</span>
                            </div>
                            <div className={`RejectedModal__quantity-item ${rejectedDetails.roundQuantity > 0 ? '' : 'hidden'}`}>
                                <span className='RejectedModal__quantity-label'>Round Quantity:</span>
                                <span className='RejectedModal__quantity-value'>{rejectedDetails.roundQuantity}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='RejectedModal__reason-section'>
                    <TextArea
                        label="Reason :"
                        id="reason"
                        value={reason}
                        onChange={(e)=> setReason(e.target.value)}
                        style={{height: '55px'}}
                        // isRequired
                        placeholder="Provide your reason"
                    />
                     {!reason && <p className="RejectedModal__error-message">**Reason is required to reject.**</p>}
                </div>

                <div className="RejectedModal__modal-actions">
                    <ButtonGroup
                        onCancel={handleCancel}
                        onSave={handleConfirm}
                        saveText='Reject'
                        saveButtonColor='#9E1616'
                        disabled={!reason} 
                    />
                </div>
            </div>
        </Modal>
    );
};