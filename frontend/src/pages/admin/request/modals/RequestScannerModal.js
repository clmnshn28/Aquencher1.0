import React, {useState, useEffect} from 'react';
import Modal from 'components/Modal';
import ButtonGroup from 'components/ButtonGroup';
import CustomDropdown from 'components/CustomDropdown'; 
import axios from 'axios';
import {API_URL} from 'constants';
import * as images from 'assets/images';


export const RequestScannerModal = ({isOpen, onClose, onConfirm, userDetails }) =>{
    
    const [requestType, setRequestType] = useState('');
    const [gallonTypes, setGallonTypes] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [borrowedGallons, setBorrowedGallons] = useState({ slim: 0, round: 0 });
    const [borrowLimits, setBorrowLimits] = useState({ 1: 0, 2: 0 });  

    useEffect(() => {
        if (isOpen) {
            fetchProducts();  
        }
    }, [isOpen]);


    const fetchProducts = async () => {
        try {
            const response = await axios.get(API_URL + '/api/admin/products', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
                }
            });
            const fetchedProducts = response.data.data;

            const updatedItems = fetchedProducts.map((product) => ({
                id: product.id,
                name: product.item_name,
                price: product.price,
                quantity: 0,
                availableStock: product.available_stock,
                image: product.id === 1 ? images.pickSlim : images.pickRound,
            }));

            setGallonTypes(updatedItems); 
        } catch (error) {
            console.error('Error fetching products', error);
        }
    };

    const fetchBorrowedGallons = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/admin/borrowed-gallons/${userDetails.ID}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
                },
               
            });
    
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

            setGallonTypes((prevItems) =>
                prevItems.map((item) => {
                  if (item.id === 1) {
                    return { ...item, quantity: slim };
                  } else if (item.id === 2) {
                    return { ...item, quantity: round };
                  }
                  return item;
                })
            );

        } catch (error) {
            console.error('Error fetching borrowed gallons', error);
        }
    };

    const fetchBorrowLimits = async () => {
        try {
            const response = await axios.get(API_URL +'/api/admin/borrow-limits',{
                headers:{
                    'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
                }
            }); 
            const { slim_gallons, round_gallons } = response.data.data[0];
            setBorrowLimits({ 1: slim_gallons, 2: round_gallons });
        } catch (error) {
            console.error("Error fetching borrow limits:", error);
        }
    };
    
    
    const handleRequestTypeChange = (value) => {
        setRequestType(value);
    
        if (value === 'return') {
            fetchBorrowedGallons(); 
        }else if (value === 'borrow') {
            fetchBorrowLimits();
            setGallonTypes((prevTypes) =>
                prevTypes.map((type) => ({ ...type, quantity: 0 }))
            );
        }else {
            setGallonTypes((prevTypes) =>
                prevTypes.map((type) => ({ ...type, quantity: 0 }))
            );
        }
    };


    const requestTypeOptions = [
        { value: 'refill', title: 'Refill', description: 'Request a refill of your gallons.' },
        { value: 'borrow', title: 'Borrow', description: 'Refilled borrow gallons for personal use.' },  // Updated description
        { value: 'return', title: 'Return', description: 'Return the borrowed gallons.' },
    ];

    const handleIncrement = (id) => {
        setGallonTypes((prevTypes) =>
            prevTypes.map((type) =>
                type.id === id ? { ...type, quantity: type.quantity + 1 } : type
            )
        );
    };

    const handleDecrement = (id) => {
        setGallonTypes((prevTypes) =>
            prevTypes.map((type) =>
                type.id === id && type.quantity > 0
                    ? { ...type, quantity: type.quantity - 1 }
                    : type
            )
        );
    };

    const getLimitForItem = (id) => borrowLimits[id] || 0;

    const totalPrice = gallonTypes.reduce((total, type) => total + type.price * type.quantity, 0);
    const totalQuantity = gallonTypes.reduce((acc, item) => acc + item.quantity, 0);
    
    const handleCancel = () => {
        onClose(); 
        setRequestType(''); 
        setGallonTypes((prevTypes) =>
            prevTypes.map((type) => ({ ...type, quantity: 0 }))
        );
    };


    const handleConfirm = async () =>{
        setIsSubmitting(true);


        try {
            const gallonData = [];
                
            gallonTypes.forEach(item => {
                if (item.quantity > 0) { 
                    gallonData.push({
                        gallon_id: item.id, 
                        quantity: item.quantity,
                    });
                }
            });

            await axios.post(API_URL + '/api/admin/gallon-request', {
                customer_id: userDetails.ID,
                request_type: requestType,
                data: gallonData 
                }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
                    },
            });

            onConfirm();
            setRequestType(''); 
            setGallonTypes((prevTypes) =>
                prevTypes.map((type) => ({ ...type, quantity: 0 }))
            );

        } catch (error) {
            console.error('Error storing data', error);
        }finally {
            setIsSubmitting(false);
        }
    };
    
    const isSubmitDisabled = !requestType || !gallonTypes.some((item) => item.quantity > 0);

    if(!isOpen) return null;
    
    return(
        <Modal>
            <div className="QRScannerModal__content">
                <h2>Request Details</h2>
                <div className="RequestScannerModal__details">
                    <div className="RequestScannerModal__user-info">
                        {userDetails ? (
                        <>
                            <p>
                            <strong>Name:</strong> <span>{userDetails.Name}</span>
                            </p>
                            <p>
                            <strong>Contact:</strong> <span>{userDetails.Contact}</span>
                            </p>
                            <p>
                            <strong>Address:</strong>
                            <span>{userDetails.Address}</span>
                            </p>
                        </>
                        ) : (
                        <p>No details available</p>
                        )}
                    </div>
                    <div className="RequestScannerModal__requestType-info">
                        <label><strong>Request Type:</strong> </label>
                        <div className="RequestScannerModal__requestType-width">
                            <CustomDropdown 
                                value={requestType}
                                onChange={handleRequestTypeChange}
                                options={requestTypeOptions}
                                defaultText="Select Request Type"
                            />
                        </div>
                    </div>
                    <div className="RequestScannerModal__gallon-list">
                        <p><strong>Gallon Type:</strong></p>
                        {gallonTypes.map((gallon) => (
                            <div key={gallon.id} className="RequestScannerModal__item-info">
                                <div className="RequestScannerModal__item-name">
                                    <img src={gallon.image} alt={gallon.name} className="RequestScannerModal__item-image" />
                                    <div>
                                        <h3>{gallon.name}</h3>
                                        <p>
                                            {requestType === 'return' ? (
                                                'Return Gallon'
                                            ) : (
                                                `₱${gallon.price.toFixed(2)}/${requestType === 'refill' ? 'Refill' : requestType === 'borrow' ? 'Borrow' : ''}Gallon`
                                            )}
                                        </p>
                                        {requestType === 'borrow' && (
                                            gallon.quantity > getLimitForItem(gallon.id) ? (
                                                <div className="RequestScannerModal__item-limit">Borrowing limit exceeded.</div>
                                            ) : gallon.quantity > gallon.availableStock ? (
                                                <div className="RequestScannerModal__item-limit">Currently out of stock.</div>
                                            ) : null
                                        )}
                                    </div>
                                </div>
                                <div className="RequestScannerModal__item-quantity">
                                    <button
                                        className="quantity-btn"
                                        onClick={() => handleDecrement(gallon.id)}
                                        disabled={gallon.quantity === 0}
                                    >
                                        -
                                    </button>
                                    <span>{gallon.quantity}</span>
                                    <button
                                        className="quantity-btn"
                                        onClick={() => handleIncrement(gallon.id)}
                                        disabled={
                                            requestType === 'borrow' 
                                              ? (gallon.quantity > getLimitForItem(gallon.id) || gallon.quantity > gallon.availableStock)
                                              : requestType === 'return'
                                              ? gallon.quantity >= (gallon.id === 1 ? borrowedGallons.slim : borrowedGallons.round)
                                              : false
                                          }
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="RequestScannerModal__total-container">
                        <p>Total ({totalQuantity} {totalQuantity > 1 ? 'items' : 'item'}) :</p>
                        <p className="RequestScannerModal__total"> ₱{totalPrice.toFixed(2)}</p>
                    </div>
                </div>
                <ButtonGroup
                    onCancel={handleCancel}
                    onSave={handleConfirm}
                    saveText= "Submit"
                    saveButtonColor="#0174CF"
                    disabled={isSubmitting || isSubmitDisabled}
                />
            </div>
       
        </Modal>
    );
};