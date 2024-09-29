import React,{useState} from "react";
import { BiSolidMessage } from "react-icons/bi";
import 'assets/css/customer';

import * as images from 'assets/images';
import { ConcernItem } from "components/ConcernItem";
import { ConcernSpecific } from 'components/ConcernSpecific'; 
import { NewConcernModal, SubmittedModal } from "./modals";

export const Concern = () =>{
    const [concerns, setConcerns] = useState([
        { id: 1, fname: 'Francis Harvey', lname: 'Soriano', email: 'francissoriano@gmail.com', requestType: 'Refill', subject: 'Leaking Gallon Issue', message: 'I am reaching out regarding a refill request. Unfortunately, the gallon I received is leaking.', time: new Date('2024-09-25T20:20'), isNew: true, attachments: [images.pickSlim, images.pickRound] },
        { id: 2, fname: 'Francis Harvey', lname: 'Soriano', email: 'francissoriano@gmail.com', requestType: 'Borrow', subject: 'Unconfirmed Gallon Request', message: 'My request for a new gallon has not been confirmed yet. Please provide an update.', time: new Date('2024-09-25T12:12'), isNew: true, attachments: [] },
        { id: 3, fname: 'Francis Harvey', lname: 'Soriano', email: 'francissoriano@gmail.com', requestType: 'Refill', subject: 'Delayed Gallon Delivery', message: 'The gallons were not delivered on the promised date. Please assist.', time: new Date('2024-09-21T12:12'), isNew: true, attachments: [] },
        { id: 4, fname: 'Francis Harvey', lname: 'Soriano', email: 'francissoriano@gmail.com', requestType: 'Refill', subject: 'Delayed Gallon Delivery', message: 'I am reaching out regarding a refill request. Unfortunately, the gallon I received is leaking.', time: new Date('2024-08-21T12:16'), isNew: false, attachments: [] },
        { id: 5, fname: 'Francis Harvey', lname: 'Soriano', email: 'francissoriano@gmail.com', requestType: 'Refill', subject: 'Water Quality Concern', message: 'The water quality this time seems different. Kindly check if it meets the standard.', time: new Date('2024-08-19T10:32'), isNew: false, attachments: [] },
        { id: 6, fname: 'Francis Harvey', lname: 'Soriano', email: 'francissoriano@gmail.com', requestType: 'Refill', subject: 'Special Delivery Time Request', message: 'I would like to request a special delivery time for my next order.', time: new Date('2024-07-11T12:14'), isNew: false, attachments: [] }
    ]);
    const [selectedConcern, setSelectedConcern] = useState(null); 
    const [isSharing, setIsSharing] = useState(false); 
    const [isSubmitted, setIsSubmitted] = useState(false); 

    const handleConcernClick = (concern) => {
        // mark the clicked concern as "not new"
        const updatedConcerns = concerns.map((c) => 
          c.id === concern.id ? { ...c, isNew: false } : c
        );
        setConcerns(updatedConcerns);
        setSelectedConcern(concern);  
    };

    const handleBackClick = () => {
        setSelectedConcern(null);  
    };

    // for the share your concern button
    const handleConfirmShare = (newConcern) => {
        setConcerns([
            {
                id: concerns.length + 1,
                fname: 'Francis Harvey', 
                lname: 'Soriano',
                email: 'francissoriano@gmail.com', 
                requestType: newConcern.type === 'refill' ? 'Refill' : newConcern.type === 'borrow' ? 'Borrow' : 'Return', // Map type to requestType
                subject: newConcern.subject,
                message: newConcern.summary,
                time: new Date(), 
                isNew: true,
                attachments: newConcern.image.length > 0 ? newConcern.image : []
            },
            ...concerns
        ]);
        setIsSharing(false);
        setIsSubmitted(true); 
    };


    return(
        <>
            <div className="Concern__header">
                <h2 className="Concern__header-text">Customer Concerns</h2>
                <p className="Concern__description">
                    Configure key business functions such as pickup and delivery, borrowing limits, and operating hours
                </p>
                {!selectedConcern && !isSharing && (
                    <button className="Concern__share-btn" onClick={()=> setIsSharing(true)} >
                        <BiSolidMessage className="Concern__share-icon" />
                        Share Your Concerns
                    </button>
                )}
            </div>
            {!selectedConcern && !isSharing  ? (
                <div className="Concern__container">
                    {concerns.length === 0 ? (
                        <div className="ConcernAdmin__item-available">No concerns available</div>
                    ) : (
                        concerns.map((concern) => (
                            <ConcernItem
                                key={concern.id}
                                requestType={concern.requestType}
                                subject={concern.subject}
                                message={concern.message}
                                time={concern.time}
                                isNew={concern.isNew}
                                onClick={() => handleConcernClick(concern)}
                            />
                        ))
                    )}
                </div>
            ) : (
                selectedConcern ? (
                    <ConcernSpecific 
                        selectedConcern={selectedConcern} 
                        handleBackClick={handleBackClick} 
                    />
                ) : (
                    <NewConcernModal
                        isOpen={isSharing}
                        onClose={()=>setIsSharing(false)}
                        onConfirm={handleConfirmShare}
                    />
                )
            )}
            <SubmittedModal
                isOpen={isSubmitted} 
                onClose={() => setIsSubmitted(false)} 
            />

        </>
    );
};