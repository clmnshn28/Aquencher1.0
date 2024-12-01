import React from "react";
import 'assets/css/modals';
import Modal from "components/Modal";


export const TransactionDetailsModal = ({isOpen, onClose, transaction}) =>{

    const capitalize = (str) => {
        return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    }


    if (!isOpen || !transaction) return null;

    return(
        <Modal onClick={onClose}>
            <div className="TransactionDetailsModal__content" onClick={e => e.stopPropagation()}>
                <h2>Transaction Details</h2>
                <div className="TransactionDetailsModal__info-container">
                    <div className="TransactionDetailsModal__info-row">
                        <span className="TransactionDetailsModal__label">Date:</span>
                        <span className="TransactionDetailsModal__value">{transaction.date}</span>
                    </div>
                    <div className="TransactionDetailsModal__info-row">
                        <span className="TransactionDetailsModal__label">Time:</span>
                        <span className="TransactionDetailsModal__value">{transaction.time}</span>
                    </div>
                    <div className="TransactionDetailsModal__info-row">
                        <span className="TransactionDetailsModal__label">Customer Name:</span>
                        <span className="TransactionDetailsModal__value">{transaction.fname} {transaction.lname}</span>
                    </div>
                    <div className="TransactionDetailsModal__info-row">
                        <span className="TransactionDetailsModal__label">Contact Number:</span>
                        <span className="TransactionDetailsModal__value">{transaction.contact_number}</span>
                    </div>
                    <div className="TransactionDetailsModal__info-row">
                        <span className="TransactionDetailsModal__label">Address:</span>
                        <span className="TransactionDetailsModal__value">{transaction.house_number} {transaction.street} {transaction.barangay} {transaction.municipality_city} {transaction.province} {transaction.postal_code}</span>
                    </div>
                    <div className="TransactionDetailsModal__info-row">
                        <span className="TransactionDetailsModal__label">Request Type:</span>
                        <span className="TransactionDetailsModal__value">{capitalize(transaction.request_type)}</span>
                    </div>
                    <div className="TransactionDetailsModal__info-row">
                        <span className="TransactionDetailsModal__label">Quantity:</span>
                        <span className="TransactionDetailsModal__value">
                            {transaction.slimQuantity > 0 && (
                                <span>Slim: {transaction.slimQuantity} </span>
                            )}
                            {transaction.slimQuantity > 0 && transaction.roundQuantity > 0 && ', '}
                            {transaction.roundQuantity > 0 && (
                                <span>Round: {transaction.roundQuantity}</span>
                            )}
                        </span>
                    </div>
                    <div className="TransactionDetailsModal__info-row">
                        <span className="TransactionDetailsModal__label">Total Amount:</span>
                        <span className="TransactionDetailsModal__value">{transaction.request_type === 'return' ? <span className="Transaction__no-message">-</span> : `₱${transaction.totalPrice.toFixed(2)}`}</span>
                    </div>
                    <div className="TransactionDetailsModal__info-row">
                        <span className="TransactionDetailsModal__label">Status:</span>
                        <span className="TransactionDetailsModal__value">{capitalize(transaction.status)}</span>
                    </div>
                    {transaction.status === "cancelled" && (
                        <div className="TransactionDetailsModal__info-row">
                            <span className="TransactionDetailsModal__label">Reason:</span>
                            <span className="TransactionDetailsModal__value">{transaction.reason}</span>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};