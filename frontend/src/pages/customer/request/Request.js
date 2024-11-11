import React, {useState, useEffect, useRef } from "react";
import "assets/css/customer";
import * as images from 'assets/images';
import axios from 'axios';
import {API_URL} from 'constants';

import { RefillModal, BorrowModal, ReturnModal, ConfirmationModal, AddressPromptModal} from "./modals";
import { SuccessModal } from "components/SuccessModal";

const RequestBox = ({ icon, selectedIcon, title, description, onClick, isSelected, disabled, availableStock, borrowedGallons }) => (
    <div className={`Request__box ${isSelected ? 'Request__box-selected' : ''} 
    ${disabled && title === 'Borrow' && availableStock ? 'Request__box-disabled' : ''}
    ${disabled && title === 'Return' && borrowedGallons ? 'Request__box-disabled' : ''}`} 
    onClick={!disabled ? onClick : undefined} 
    >
        <img 
        src={isSelected ? selectedIcon :icon} 
        alt={`${title} Icon`} 
        />
        <p className={`Request__box-title ${isSelected ? 'Request__box-title-selected' : ''}`}>
            {title}
        </p>
        <p className={`Request__box-description ${isSelected ? 'Request__box-description-selected' : ''}`}>
            {description}
        </p>
    </div>
);

export const Request = () =>{

    const [isRefillModalOpen, setIsRefillModalOpen] = useState(false);
    const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [borrowedGallons, setBorrowedGallons] = useState(0);

    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [confirmationDetails, setConfirmationDetails] = useState({});
    const [items, setItems] = useState([]);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false); 
    const [isAddressPromptOpen, setIsAddressPromptOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successTitle, setSuccessTitle] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const initialFetchDone = useRef(false);

    useEffect(()=>{
        if (!initialFetchDone.current) {
             fetchProducts();
            fetchBorrowedGallons();
            initialFetchDone.current = true;
        }
    },[]);

    const fetchProducts = async () =>{
        try{
            const response = await axios.get(API_URL +'/api/products', {
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


            setItems(updatedItems);
        }catch(error){
            console.error('Error fetching users', error);
        }
    }; 

    const checkUserAddress = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/user/address/check`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
                }
            });
            return response.data; 
        } catch (error) {
            console.error('Error checking user address:', error.response?.data || error.message);
        }
    };

    const handleRequestSelection = (requestType) => {
        setSelectedRequest(requestType);

        setIsRefillModalOpen(requestType === 'refill');
        setIsBorrowModalOpen(requestType === 'borrow');
        setIsReturnModalOpen(requestType === 'return');
    };

 // Function refill
 const confirmRefill = async () => {
    const addressCheck = await checkUserAddress();
    if (!addressCheck) {
         setIsAddressPromptOpen(true);
        return;
    }
    setConfirmationDetails({
        image: images.refillIconOpen,
        title: "Confirm Refill Request",
        message: "Note: This action cannot be undone once confirmed",
        onConfirm: async () =>{
            setIsProcessing(true);
            try{
                const refillData = [];
                
                items.forEach(item => {
                    if (item.quantity > 0) { 
                        refillData.push({
                            gallon_id: item.id, 
                            quantity: item.quantity,
                        });
                    }
                });

                await axios.post(API_URL + '/api/refill', {
                    data: refillData 
                    }, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
                        },
                });

                setSuccessTitle('Refill Request Successful');
                setSuccessMessage('Your refill request has been processed successfully.');
                setIsSuccessModalOpen(true); 

                setIsRefillModalOpen(false); // Close modal after refill
                setIsConfirmationModalOpen(false); //close the confirm modal
                setSelectedRequest(null);     // reset the selected request
                setItems(items.map(item => ({ ...item, quantity: 0 })));

            }catch(error){
                console.error('Error refilling: ', error.response?.data || error.message);
            }finally {
                setIsProcessing(false); 
            }
        }
    });
    setIsConfirmationModalOpen(true);
};

const handleCloseRefillModal = () => {
    setItems(items.map(item => ({ ...item, quantity: 0 }))); 
    setIsRefillModalOpen(false);
    setSelectedRequest(null); 
};

//Function borrow
const confirmBorrow = async () =>{
    const addressCheck = await checkUserAddress();
    if (!addressCheck) {
        setIsAddressPromptOpen(true);
        return;
    }
    setIsConfirmationModalOpen(true);
    setConfirmationDetails({
        image: images.borrowIconOpen,
        title: "Confirm Borrow Request",
        message: "Note: This action cannot be undone once confirmed.",
        onConfirm: async () =>{
            setIsProcessing(true);
            try{
                const borrowData = [];
                
                items.forEach(item => {
                    if (item.quantity > 0) { 
                        borrowData.push({
                            gallon_id: item.id, 
                            quantity: item.quantity,
                            available_stock: item.availableStock, 
                        });
                    }
                });

                await axios.post(API_URL + '/api/borrow', {
                    data: borrowData 
                    }, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
                        },
                });

                setSuccessTitle('Borrow Request Successful');
                setSuccessMessage('Your borrow request has been processed successfully.');
                setIsSuccessModalOpen(true); 

                setIsBorrowModalOpen(false);
                setIsConfirmationModalOpen(false);
                setSelectedRequest(null);
                setItems(items.map(item => ({ ...item, quantity: 0 })));

            }catch(error){
                console.error('Error borrowing: ', error.response?.data || error.message);
            }finally {
                setIsProcessing(false); 
            }
        }
    });
};

const handleCloseBorrowModal = () => {
    setItems(items.map(item => ({ ...item, quantity: 0 })));
    setIsBorrowModalOpen(false);
    setSelectedRequest(null); 
};

// this for returned request to check if have borrowed
const fetchBorrowedGallons = async () => {
    try {
        const response = await axios.get(`${API_URL}/api/borrowed-gallons`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
            }
        });
        const totalBorrowed = response.data.data.reduce((total, item) => {
            return total + item.borrow_details.reduce((sum, detail) => sum + detail.quantity, 0);
        }, 0);

        setBorrowedGallons(totalBorrowed);
    } catch (error) {
        console.error('Error fetching borrowed gallons:', error.response?.data || error.message);
    }
};

//Function return
const confirmReturn = async () =>{
    const addressCheck = await checkUserAddress();
    if (!addressCheck) {
        setIsAddressPromptOpen(true);
        return;
    }
    setConfirmationDetails({
        image: images.returnIconOpen,
        title: "Confirm Return Request",
        message: "Note: This action cannot be undone once confirmed",
        onConfirm: async () =>{
            setIsProcessing(true);
            try{
                const returnedData = [];
                
                items.forEach(item => {
                    if (item.quantity > 0) { 
                        returnedData.push({
                            gallon_id: item.id, 
                            quantity: item.quantity,
                        });
                    }
                });

                await axios.post(API_URL + '/api/returned', {
                    data: returnedData 
                    }, {
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
                        },
                });

                setSuccessTitle('Return Request Successful');
                setSuccessMessage('Your return request has been processed successfully.');
                setIsSuccessModalOpen(true); 

                setIsReturnModalOpen(false);
                setIsConfirmationModalOpen(false); 
                setSelectedRequest(null); 
                setItems(items.map(item => ({ ...item, quantity: 0 })));

            }catch(error){
                console.error('Error returning: ', error.response?.data || error.message);
            }finally {
                setIsProcessing(false); 
            }
        }
    });
    setIsConfirmationModalOpen(true);
};

const handleCloseReturnModal = () =>{
    setItems(items.map(item => ({ ...item, quantity: 0 })));
    setIsReturnModalOpen(false);
    setSelectedRequest(null);
};

    const handleCloseSuccessModal = () => {
        setIsSuccessModalOpen(false); // Close SuccessModal
    };

    const isModalOpen = isRefillModalOpen || isBorrowModalOpen || isReturnModalOpen ;
    const isBorrowDisabled = !items.some(item => item.availableStock > 0);
    const isReturnDisabled = Number(borrowedGallons) === 0; 

    return(
        <>
            <div className="Request__header">
                <img className="Request__header-icon" src={images.requestDropHeader} alt="Request Icon" />
                <div className="Request__header-text-container">
                    <p className="Request__header-title">Refill & Return Request</p>
                    <p className="Request__header-description">(Request Refill, Borrow Gallons, Return Gallons)</p>
                </div>
            </div>
            <div className="Request__action-box-container">
                <RequestBox
                    icon={images.refillIcon}
                    selectedIcon = {images.refillIconOpen}
                    title='Refill'
                    description='Submit a request for your gallons to be picked up for a refill.'
                    onClick={()=>handleRequestSelection('refill')}
                    isSelected={selectedRequest === 'refill'} // Apply conditional styling
                    disabled={isModalOpen} 
                />
                <RequestBox
                    icon={images.borrowIcon}
                    selectedIcon = {images.borrowIconOpen}
                    title='Borrow'
                    description='Borrow a water container temporarily from the delivery service.'
                    onClick={()=>handleRequestSelection('borrow')}
                    isSelected={selectedRequest === 'borrow'} 
                    disabled={isModalOpen || isBorrowDisabled} 
                    availableStock ={isBorrowDisabled}
                />
                <RequestBox
                    icon={images.returnIcon}
                    selectedIcon = {images.returnIconOpen}
                    title="Return"
                    description="Return an empty water container to the delivery service."
                    onClick={()=>handleRequestSelection('return')}
                    isSelected={selectedRequest === 'return'}
                    disabled={isModalOpen  || isReturnDisabled} 
                    borrowedGallons={isReturnDisabled}
                />
            </div>

            {/*Refill component */}
            <RefillModal
                isOpen = {isRefillModalOpen}
                onClose = {handleCloseRefillModal}
                onConfirm = {confirmRefill}
                items = {items}
                setItems = {setItems}
            />

            {/*Borrow component */}
            <BorrowModal
                isOpen = {isBorrowModalOpen}
                onClose = {handleCloseBorrowModal}
                onConfirm = {confirmBorrow}
                items = {items}
                setItems = {setItems}
            />

            {/*Return component */}
            <ReturnModal
                isOpen = {isReturnModalOpen}
                onClose = {handleCloseReturnModal}
                onConfirm = {confirmReturn}
                items = {items}
                setItems = {setItems}
            />

            {/*Confirmation component */}
            <ConfirmationModal
                isOpen = {isConfirmationModalOpen}
                onClose = {()=> setIsConfirmationModalOpen(false)}
                onConfirm = {confirmationDetails.onConfirm}
                image = {confirmationDetails.image}
                title = {confirmationDetails.title}
                message = {confirmationDetails.message}
                isProcessing={isProcessing} 
            />

            <AddressPromptModal
                isOpen = {isAddressPromptOpen}
                onClose = {()=> setIsAddressPromptOpen(false)}            
            />

            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={handleCloseSuccessModal}
                title={successTitle}
                message={successMessage}
            />

        </>
    );
};