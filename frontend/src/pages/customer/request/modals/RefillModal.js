import React, {useState, useEffect} from "react";
import 'assets/css/customer';
import Modal from "components/Modal";
import * as images from 'assets/images';


export const RefillModal = ({isOpen, onClose, onConfirm, items, setItems}) =>{

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

    useEffect(() => {
        const updateIsMobile = () => {
            setIsMobile(window.innerWidth <= 767);
        };
        
        window.addEventListener("resize", updateIsMobile);
        return () => window.removeEventListener("resize", updateIsMobile);
    }, []);
    
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

    const content = (
            <div className="RefillModal__content">
                <button className="RefillModal__close" onClick={onClose}>&times;</button>
                <div className="RefillModal__header-container">
                    <img src={images.refillIconOpen} alt="Refill Icon" />
                    <h2>Refill</h2>  
                </div>
                <p className="RefillModal__header-description">Submit a request for your gallons to be picked up for a refill.</p>

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
                    Submit Refill Request
                </button>
            </div>
    );

    return isMobile ? (
        <div className="RefillModal__mobile">
            {content}
        </div>
    ) : (
        <Modal>
            {content}
        </Modal>
    );
};