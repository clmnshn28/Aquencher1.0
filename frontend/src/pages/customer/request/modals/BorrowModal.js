import React, { useEffect, useState } from "react";
import 'assets/css/customer';
import Modal from "components/Modal";
import * as images from 'assets/images';
import axios from 'axios';
import {API_URL} from 'constants';

export const BorrowModal = ({isOpen, onClose, onConfirm, items, setItems}) =>{
    
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);
    const [borrowLimits, setBorrowLimits] = useState({ 1: 0, 2: 0 });  

    useEffect(() => {
        const updateIsMobile = () => {
            setIsMobile(window.innerWidth <= 767);
        };
        
        window.addEventListener("resize", updateIsMobile);
        return () => window.removeEventListener("resize", updateIsMobile);
    }, []);
    
    useEffect(() => {
        if (isOpen) {
            fetchBorrowLimits(); 
        }
    }, [isOpen]);

    const fetchBorrowLimits = async () => {
        try {
            const response = await axios.get(API_URL +'/api/customer/borrow-limits',{
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            }); 
            const { slim_gallons, round_gallons } = response.data.data[0];
            setBorrowLimits({ 1: slim_gallons, 2: round_gallons });
        } catch (error) {
            console.error("Error fetching borrow limits:", error);
        }
    };
    
    const getLimitForItem = (id) => borrowLimits[id] || 0;

    // incrementing and decrementing quantity
    const handleIncrement = (id) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id && item.quantity < getLimitForItem(id) && item.quantity <= item.availableStock 
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
    const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
    const isSubmitDisabled = totalPrice === 0 || items.some(
        item => item.quantity > 0 && (item.quantity >= getLimitForItem(item.id) || item.quantity > item.availableStock)
    );
    

    if (!isOpen) return null;
   
    const content =(
        <div className="BorrowModal__content">
            <button className="BorrowModal__close" onClick={onClose}>&times;</button>
            <div className="BorrowModal__header-container">
                <img src={images.borrowIconOpen} alt="Borrow Icon" />
                <h2>Borrow</h2>  
            </div>
            <p className="BorrowModal__header-description">Submit a request to borrow a water container from the delivery service.</p>

            {items.map((item) => (
                <div key={item.id} className="BorrowModal__item">
                    <img src={item.image} alt={item.name} className="BorrowModal__item-image" />
                    <div className="BorrowModal__item-info">
                        <h3>{item.name}</h3>
                        <p>₱{item.price.toFixed(2)}/Borrow Gallon</p>
                        <div className="BorrowModal__item-quantity">
                            <button
                                className="BorrowModal__quantity-btn"
                                onClick={() => handleDecrement(item.id)}
                                disabled={item.quantity === 0}
                            >-</button>
                            <span>{item.quantity}</span>
                            <button
                                className="BorrowModal__quantity-btn"
                                onClick={() => handleIncrement(item.id)}
                                disabled={item.quantity >= getLimitForItem(item.id) || item.quantity > item.availableStock}
                            >+</button>
                        </div>
                        {item.quantity >= getLimitForItem(item.id) ? (
                            <div className="BorrowModal__limit">Borrowing limit exceeded.</div>
                        ) : item.quantity > item.availableStock ? (
                            <div className="BorrowModal__limit">Currently out of stock.</div>
                        ) : null}
                    </div>
                    <p className="BorrowModal__item-total">₱{(item.price * item.quantity).toFixed(2)}</p>
                </div>
            ))}

            <div className="BorrowModal__total-container">
                <p>Total ({totalQuantity} {totalQuantity > 1 ? 'items' : 'item'}) :</p>
                <p className="BorrowModal__total"> ₱{totalPrice.toFixed(2)}</p>
            </div>

            <button className="BorrowModal__submit" 
            onClick={onConfirm}
            disabled={isSubmitDisabled}
            >
                Submit Borrow Request
            </button>
        </div>
    );

    return isMobile ? (
        <div className="BorrowModal__mobile">
            {content}
        </div>
    ) : (
        <Modal>
            {content}
        </Modal>
    );
};