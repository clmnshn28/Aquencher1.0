import React, {useState, useEffect} from 'react';
import Modal from 'components/Modal';
import ButtonGroup from 'components/ButtonGroup'; 
import * as images from 'assets/images';
import TextField from 'components/TextField';

import axios from 'axios';
import {API_URL} from 'constants';
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";


export const RequestWalkInModal = ({isOpen, onClose, onConfirm }) =>{
  
    const [gallonTypes, setGallonTypes] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [street, setStreet] = useState('');
    const [barangay, setBarangay] = useState('');
    const [municipalityCity, setMunicipalityCity] = useState('Malolos');
    const [province, setProvince] = useState('Bulacan');
    const [postalCode, setPostalCode] = useState('3000');
    const [contactError, setContactError] = useState('');

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

    
    const totalPrice = gallonTypes.reduce((total, type) => total + type.price * type.quantity, 0);
    const totalQuantity = gallonTypes.reduce((acc, item) => acc + item.quantity, 0);
    const isSubmitDisabled =  !gallonTypes.some((item) => item.quantity > 0);

    const handleContactChange = (e) => {
        setContactNumber(e.target.value);
        setContactError('');
    };
    
    const resetForm = () => {
        setFname('');
        setLname('');
        setContactNumber('');
        setHouseNumber('');
        setStreet('');
        setBarangay('');
        setMunicipalityCity('Malolos');
        setProvince('Bulacan');
        setPostalCode('3000');
        setContactError(''); 
    };
    
     // check contact
    const validateContactNumber = (number) => {
        if (!/^\d+$/.test(number)) {
            return 'Contact No. must be numeric';
        }
        if (number.length !== 11) {
            return 'Contact No. must be 11 digits';
        }
            return ''; 
    };


    const handleCancel = () => {
        onClose();
        resetForm(); 
        setGallonTypes((prevTypes) =>
            prevTypes.map((type) => ({ ...type, quantity: 0 }))
        );
    };

    const handleAcceptRequest = (e) =>{
        e.preventDefault();

         // Validate contact number
        const contactValidationError = validateContactNumber(contactNumber);
            if (contactValidationError) {
                setContactError(contactValidationError);
            return; 
            } else {
                setContactError(''); 
        }

        setShowConfirmation(true);
    }

    const handleConfirm = async () =>{
        setIsSubmitting(true);

        const gallonData = [];
                
        gallonTypes.forEach(item => {
            if (item.quantity > 0) { 
                gallonData.push({
                    gallon_id: item.id, 
                    quantity: item.quantity,
                });
            }
        });

        try {

            await axios.post(API_URL + '/api/admin/walk-in-request', {
                data: gallonData,
                fname,
                lname,
                contact_number: contactNumber,
                house_number: houseNumber,
                street,
                barangay,
                municipality_city: municipalityCity,
                province,
                postal_code: postalCode,

                }, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
                    },
            });

            onConfirm();
            resetForm();
            setGallonTypes((prevTypes) =>
                prevTypes.map((type) => ({ ...type, quantity: 0 }))
            );
        }catch(error){
            console.error('Error submitting walk-in request:', error);
        }finally {
            setIsSubmitting(false);
            setShowConfirmation(false);
        }
    }

    if(!isOpen) return null;
    return(
        <Modal>
            <form onSubmit={handleAcceptRequest} className="RequestWalkInModal__content">
                <h2>Request Details</h2>
                <div className="RequestWalkInModal__details">
                    <div  className="RequestWalkInModal__details-1">
                        <div className='NewUserModal__name-container'>
                            <TextField label="First Name :"  id="fname" name="fname" value={fname} onChange={(e) => setFname(e.target.value)} type="text" autoComplete='off' isRequired required/>
                            <TextField label="Last Name :" id="lname" name="lname" value={lname} onChange={(e) => setLname(e.target.value)} type="text" autoComplete='off' isRequired required/>
                        </div>
                        <TextField label="Contact No. :"  id="contactNumber" name="contactNumber" value={contactNumber} onChange={handleContactChange} type="text" autoComplete='off' isRequired required/>
                        {contactError && <span className="NewUserModal__contact-error">{contactError}</span>}
                        <div className='NewUserModal__address-container'>
                            <p>Address</p>
                            <div className='NewUserModal__address-subsection'>
                                <TextField label="House No. :"  id="houseNumber" name="houseNumber" value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} type="text" autoComplete='off' isRequired required />
                                <TextField label="Street :"  id="street" name="street" value={street} onChange={(e) => setStreet(e.target.value)} type="text" autoComplete='off' isRequired required />
                                <TextField label="Barangay :"  id="barangay" name="barangay" value={barangay} onChange={(e) => setBarangay(e.target.value)} type="text" autoComplete='off' isRequired required />
                            </div>
                            <div className='NewUserModal__address-subsection'>
                                <TextField label="Municipality/City :"  id="municipalityCity" name="municipalityCity" value='Malolos' onChange={(e) => setMunicipalityCity(e.target.value)} type="text"  readOnly/>
                                <TextField label="Province :"  id="province" name="province" value="Bulacan" onChange={(e) => setProvince(e.target.value)} type="text"  readOnly/>
                                <TextField label="Postal Code :"  id="postalCode" name="postalCode" value="3000" onChange={(e) => setPostalCode(e.target.value)} type="text"  readOnly/>
                            </div>
                        </div>
                    </div>
                    <div className="RequestWalkInModal__line"></div>
                    <div className="RequestWalkInModal__details-2"> 
                        <p className="RequestWalkInModal__requestType">
                            <strong>Request Type:</strong> 
                            <div className={`RequestWalkInModal__gallonType-refill`}>
                                <img 
                                    src={images.refillIconOpen} 
                                    alt={`Refill Icon`} 
                                    className='AdminConfirmationModal__request-icon'
                                />
                                <span className='AdminConfirmationModal__request-type-text'>Refill</span>
                            </div>
                        </p> 
                        <div className="RequestScannerModal__gallon-list">
                            <p className="RequestWalkInModal__gallonType"><strong>Gallon Type:</strong></p>
                            {gallonTypes.map((gallon) => (
                                <div key={gallon.id} className="RequestScannerModal__item-info">
                                    <div className="RequestScannerModal__item-name">
                                        <img src={gallon.image} alt={gallon.name} className="RequestScannerModal__item-image" />
                                        <div>
                                            <h3>{gallon.name}</h3>
                                            <p>
                                                {`₱${gallon.price.toFixed(2)}/Gallon`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="RequestScannerModal__item-quantity">
                                        <button
                                            type='button'
                                            className="quantity-btn"
                                            onClick={() => handleDecrement(gallon.id)}
                                            disabled={gallon.quantity === 0}
                                        >
                                            -
                                        </button>
                                        <span>{gallon.quantity}</span>
                                        <button
                                            type='button'
                                            className="quantity-btn"
                                            onClick={() => handleIncrement(gallon.id)}
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
                </div>
                <ButtonGroup
                    onCancel={handleCancel}
                  
                    saveText= "Submit"
                    saveButtonColor="#0174CF"
                    disabled={isSubmitDisabled}
                />
            </form>
            {showConfirmation && (
                <Modal>
                    <div className="ConfirmationModal__content">
                        <div className="ConfirmationModal__header-container">
                            <TbRosetteDiscountCheckFilled  className="ConfirmationModal__header-icon"/>
                            <h2>Confirm Request</h2>
                        </div>
                        <p  className="ConfirmationModal__message">Note: This action cannot be undone once confirmed.</p>
                        <div className="ConfirmationModal__actions">
                            <ButtonGroup
                                onCancel={() => setShowConfirmation(false)} 
                                onSave={handleConfirm} 
                                saveText="Confirm"
                                saveButtonColor="#0174CF"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                </Modal>
            )}
        </Modal>
    );

};