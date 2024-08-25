import React, {useState} from "react";
import "assets/css/customer";
import * as images from 'assets/images';

import { RefillModal, BorrowModal, ReturnModal, ConfirmationModal} from "./modals";

const RequestBox = ({ icon, selectedIcon, title, description, onClick, isSelected}) => (
    <div className={`Request__box ${isSelected ? 'Request__box-selected' : ''}`} 
    onClick={onClick}
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

    const initialItems = [
        {
            id: 1,
            name: "Po's Purified\nDispenser Bottle Refill 18.9L",
            price: 25,
            quantity: 0,
            image: images.pickRound
        },
        {
            id: 2,
            name: "Po's Purified\nBlue Slim Gallon with Faucet Refill (20L/5gal)",
            price: 25,
            quantity: 0,
            image: images.pickSlim
        },
    ];

    
    const [isRefillModalOpen, setIsRefillModalOpen] = useState(false);
    const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [confirmationDetails, setConfirmationDetails] = useState({});
    const [items, setItems] = useState(initialItems);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const [gallonData, setGallonData] = useState([
        {blueRound: 1, blueSlim: 0, status: "Return"},
        {blueRound: 2, blueSlim: 3, status: "Pending"},
        {blueRound: 5, blueSlim: 4, status: "Returned"},
        {blueRound: 0, blueSlim: 4, status: "Returned"},
        {blueRound: 6, blueSlim: 0, status: "Returned"},
        {blueRound: 2, blueSlim: 2, status: "Returned"},
        {blueRound: 5, blueSlim: 4, status: "Returned"},
        {blueRound: 0, blueSlim: 4, status: "Returned"},
        {blueRound: 6, blueSlim: 0, status: "Returned"},
        {blueRound: 2, blueSlim: 2, status: "Returned"},
    ]);
    const [selectedGallonIndex, setSelectedGallonIndex] = useState(null);


    // Function refill
    const confirmRefill = () => {

        setConfirmationDetails({
            image: images.refillIconOpen,
            title: "Confirm Refill Request",
            message: "Note: Once confirmed, the refill request cannot be canceled.",
            onConfirm: () =>{
                console.log('Refill :', items); 
                setItems(initialItems); // Reset items to their initial state
                setIsRefillModalOpen(false); // Close modal after refill
                setIsConfirmationModalOpen(false); //close the confirm modal
                setSelectedRequest(null); // reset the selected request
        
            }
        });
        setIsConfirmationModalOpen(true);
    };

    const handleCloseRefillModal = () => {
        setItems(initialItems); 
        setIsRefillModalOpen(false);
        setSelectedRequest(null); 
    };

    //Function borrow
    const confirmBorrow = () =>{

        setConfirmationDetails({
            image: images.borrowIconOpen,
            title: "Confirm Borrow Request",
            message: "Note: Once confirmed, the borrow request cannot be canceled.",
            onConfirm: () =>{
                console.log('Borrow :', items);
                setItems(initialItems);
                setIsBorrowModalOpen(false);
                setIsConfirmationModalOpen(false);
                setSelectedRequest(null);
            }
        });
        setIsConfirmationModalOpen(true);
    };

    const handleCloseBorrowModal = () => {
        setItems(initialItems);
        setIsBorrowModalOpen(false);
        setSelectedRequest(null); 
    };

    //Function return
    const confirmReturn = () =>{

        setConfirmationDetails({
            image: images.returnIconOpen,
            title: "Confirm Return Request",
            message: "Note: Once confirmed, the return request cannot be canceled.",
            onConfirm: () =>{
                if (selectedGallonIndex !== null) {
                    const updatedData = gallonData.map((item, index) => {
                        if (index === selectedGallonIndex) {
                            return { ...item, status: 'Pending' };
                        }
                        return item;
                    });
                    setGallonData(updatedData);
                }
                setIsConfirmationModalOpen(false);
            }
        });
        setIsConfirmationModalOpen(true);
    };

    const handleCloseReturnModal = () =>{
        setIsReturnModalOpen(false);
        setSelectedRequest(null);
    };

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
                    onClick={()=>{
                        setSelectedRequest('refill');
                        setIsRefillModalOpen(true);
                    }}
                    isSelected={selectedRequest === 'refill'}// Apply conditional styling
                />
                <RequestBox
                    icon={images.borrowIcon}
                    selectedIcon = {images.borrowIconOpen}
                    title='Borrow'
                    description='Borrow a water container temporarily from the delivery service.'
                    onClick={()=>{
                        setSelectedRequest('borrow');
                        setIsBorrowModalOpen(true);
                    }}
                    isSelected={selectedRequest === 'borrow'} 
                />
                <RequestBox
                    icon={images.returnIcon}
                    selectedIcon = {images.returnIconOpen}
                    title="Return"
                    description="Return an empty water container to the delivery service."
                    onClick={()=>{
                        setSelectedRequest('return');
                        setIsReturnModalOpen(true);
                    }}
                    isSelected={selectedRequest === 'return'}
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
                gallonData={gallonData}
                setSelectedGallonIndex={setSelectedGallonIndex}
            />

            {/*Confirmation component */}
            <ConfirmationModal
                isOpen = {isConfirmationModalOpen}
                onClose = {()=> setIsConfirmationModalOpen(false)}
                onConfirm = {confirmationDetails.onConfirm}
                image = {confirmationDetails.image}
                title = {confirmationDetails.title}
                message = {confirmationDetails.message}
            />

        </>
    );
};