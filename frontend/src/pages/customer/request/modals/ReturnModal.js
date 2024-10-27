import React, {useState, useEffect} from "react";
import 'assets/css/customer';
import Modal from "components/Modal";
import * as images from 'assets/images';
import axios from 'axios';
import { API_URL } from 'constants';  

export const ReturnModal = ({isOpen, onClose, onConfirm,  items, setItems}) => {

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);    
    const [borrowedGallons, setBorrowedGallons] = useState({ slim: 0, round: 0 });

    useEffect(() => {
        const updateIsMobile = () => {
            setIsMobile(window.innerWidth <= 767);
        };

        window.addEventListener("resize", updateIsMobile);
        return () => window.removeEventListener("resize", updateIsMobile);
    }, []);

    useEffect(() => {
        if (isOpen) {
            axios.get(`${API_URL}/api/borrowed-gallons`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}` 
                }
            })
                .then(response => {
                    const borrowedData = response.data.data;
                    let slim = 0;
                    let round = 0;

                    borrowedData.forEach(borrow => {
                        borrow.borrow_details.forEach(detail => {
                            if (detail.shop_gallon_id === 1) {
                                slim += detail.quantity;
                            } else if (detail.shop_gallon_id === 2) {
                                round += detail.quantity;
                            }
                        });
                    });

                    setBorrowedGallons({ slim, round });

                    setItems((prevItems) =>
                        prevItems.map((item) => {
                          if (item.id === 1) {
                            return { ...item, quantity: slim };
                          } else if (item.id === 2) {
                            return { ...item, quantity: round };
                          }
                          return item;
                        })
                      );
            
                })
                .catch(error => {
                    console.error("Error fetching borrowed gallons", error);
                });
        }
    }, [isOpen, setItems]);
    
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
    const totalQuantity = items.reduce((total, item) => total + item.quantity, 0);
    
    if(!isOpen) return null;
  
    const content = (
        <div className="ReturnModal__content">
                <button className="ReturnModal__close" onClick={onClose}>&times;</button>
                <div className="ReturnModal__header-container">
                    <img src={images.returnIconOpen} alt="Return Icon" />
                    <h2>Return</h2>  
                </div>
                <p className="ReturnModal__header-description">Return an empty water container to the delivery service.</p>
                <div className="ReturnModal__quantities">
                    <h3 className="ReturnModal__quantities-title">Your Borrowed Gallon{(borrowedGallons.slim > 0 && borrowedGallons.round > 0) ? "s" : ""}</h3>
                    {borrowedGallons.slim > 0 && (
                        <div className="ReturnModal__quantity-item">
                            <img src={images.returnSlim} alt="Slim Gallon" />
                            <span>{borrowedGallons.slim}</span>
                        </div>
                    )}
                    
                    {borrowedGallons.round > 0 && (
                        <div className="ReturnModal__quantity-item">
                            <img src={images.returnRound} alt="Round Gallon" />
                            <span>{borrowedGallons.round}</span>
                        </div>
                    )}
                </div>
                {items.filter(item => (item.id === 1 ? borrowedGallons.slim > 0 : borrowedGallons.round > 0)).map((item) =>  (
                    <div key={item.id} className="ReturnModal__item">
                        <img src={item.image} alt={item.name} className="ReturnModal__item-image" />
                        <div className="ReturnModal__item-info">
                            <h3>{item.name}</h3>
                            <div className="ReturnModal__item-quantity">
                                <button
                                    className="ReturnModal__quantity-btn"
                                    onClick={() => handleDecrement(item.id)}
                                    disabled={item.quantity === 0}
                                >-</button>
                                <span>{item.quantity}</span>
                                <button
                                    className="ReturnModal__quantity-btn"
                                    onClick={() => handleIncrement(item.id)}
                                    disabled={item.quantity >= (item.id === 1 ? borrowedGallons.slim : borrowedGallons.round)}
                                >+</button>
                            </div>
                        </div>
                      
                    </div>
                ))}

                <button className="ReturnModal__submit" 
                onClick={onConfirm}
                disabled={totalQuantity === 0} 
                >
                    Submit Return Request
                </button>
            </div>
    );

    return isMobile ?(
        <div className="ReturnModal__mobile">
            {content}
        </div>
    ):(
        <Modal>
            {content}
        </Modal>
    );
};