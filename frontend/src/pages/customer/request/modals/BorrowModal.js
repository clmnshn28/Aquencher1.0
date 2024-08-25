import React from "react";
import 'assets/css/customer';
import Modal from "components/Modal";
import * as images from 'assets/images';

export const BorrowModal = ({isOpen, onClose, onConfirm, items, setItems}) =>{
    
    // incrementing and decrementing quantity
    const handleIncrement = (id) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id 
                    ? { ...item, quantity: item.quantity + 1 } 
                    : item
            )
        );
    };

    const handleDecrement = (id) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id && item.quantity > 0
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
    const isSubmitDisabled = totalPrice === 0;

    if (!isOpen) return null;
   
    return(
        <Modal>
        <div className="RefillModal__content">
            <button className="RefillModal__close" onClick={onClose}>&times;</button>
            <div className="RefillModal__header-container">
                <img src={images.borrowIconOpen} alt="Borrow Icon" />
                <h2>Borrow</h2>  
            </div>
            <p className="RefillModal__header-description">Submit a request to borrow a water container temporarily from the delivery service.</p>

            {items.map((item) => (
                <div key={item.id} className="RefillModal__item">
                    <img src={item.image} alt={item.name} className="RefillModal__item-image" />
                    <div className="RefillModal__item-info">
                        <h3>{item.name}</h3>
                        <p>₱{item.price.toFixed(2)}/Refill Gallon</p>
                        <div className="RefillModal__item-quantity">
                            <button
                                className="quantity-btn"
                                onClick={() => handleDecrement(item.id)}
                                disabled={item.quantity === 0}
                            >-</button>
                            <span>{item.quantity}</span>
                            <button
                                className="quantity-btn"
                                onClick={() => handleIncrement(item.id)}
                            >+</button>
                        </div>
                    </div>
                    <p className="RefillModal__item-total">₱{(item.price * item.quantity).toFixed(2)}</p>
                </div>
            ))}

            <div className="RefillModal__total-container">
                <p>Total ({items.reduce((acc,item) => acc + item.quantity,0)} item) :</p>
                <p className="RefillModal__total"> ₱{totalPrice.toFixed(2)}</p>
            </div>

            <button className="RefillModal__submit" 
            onClick={onConfirm}
            disabled={isSubmitDisabled}
            >
                Submit Borrow Request
            </button>
        </div>
    </Modal>
    );
};