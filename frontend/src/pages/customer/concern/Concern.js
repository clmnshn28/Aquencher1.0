import React,{useState, useEffect} from "react";
import { BiSolidMessage } from "react-icons/bi";
import 'assets/css/customer';
import axios from 'axios';
import {API_URL} from 'constants';

import { ConcernItem } from "components/ConcernItem";
import { ConcernSpecific } from 'components/ConcernSpecific'; 
import { NewConcernModal, SubmittedModal } from "./modals";

export const Concern = () =>{
    const [concerns, setConcerns] = useState([]);
    const [selectedConcern, setSelectedConcern] = useState(null); 
    const [isSharing, setIsSharing] = useState(false); 
    const [isSubmitted, setIsSubmitted] = useState(false); 

    useEffect(()=>{
        fetchConcern();
    },[])

    const fetchConcern = async () =>{
        try{
          const response = await axios.get(API_URL + '/api/customer/concern',{
            headers: {
              'Authorization' : `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
            },
        });

        const { data } = response.data; 
        const customerDetails = {
            id: data.id,
            fname: data.fname,
            lname: data.lname,
            email: data.email,
            image: data.image,
        };


        const concernWithUpdatedDateTime = data.concerns.map((concern) => {
            const updatedAt = new Date(concern.updated_at);

            const adminDetails = {
                id: concern.admin.id,
                fname: concern.admin.fname,
                lname: concern.admin.lname,
                email: concern.admin.email,
                image: concern.admin.image,
              };

            console.log('THIS SHIT:', adminDetails )
            
            return {
              ...concern,
              time: updatedAt,
              admin: adminDetails,
              customer: customerDetails, 
            };
          }).sort((a, b) => b.time - a.time);
          setConcerns( concernWithUpdatedDateTime);
        }catch(error){
          console.error('Error fetching concerns:', error);
        }
    };


    const handleConcernClick = (concern) => {
        setSelectedConcern(concern);  
    };

    const handleBackClick = () => {
        setSelectedConcern(null);  
    };

    // for the share your concern button
    const handleConfirmShare = () => {
        setIsSharing(false);
        setIsSubmitted(true); 
        fetchConcern();
    };


    return(
        <>
            <div className="Concern__header">
                <h2 className="Concern__header-text">Customer Concerns</h2>
                <p className="Concern__description">
                    If you have any comments, concerns, or if you need help with your requests, let us know.
                    We're committed to assisting you and delivering quality service!
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
                                requestType={concern.concern_type}
                                subject={concern.subject}
                                message={concern.content}
                                time={concern.time}
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