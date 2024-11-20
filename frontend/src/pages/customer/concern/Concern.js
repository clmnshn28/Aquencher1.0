import React,{useState, useEffect, useRef } from "react";
import { BiSolidMessage } from "react-icons/bi";
import { IoIosArrowRoundBack, IoIosArrowRoundForward  } from "react-icons/io";
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
    const initialFetchDone = useRef(false);
    const ITEMS_PER_PAGE = 10;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(()=>{
        if (!initialFetchDone.current) {
            fetchConcern();
            initialFetchDone.current = true;
        }
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
            const updatedAt = new Date(concern.created_at);
            const hasReply = concern.replies && concern.replies.length > 0; 
            const adminDetails = {
                id: concern.admin.id,
                fname: concern.admin.fname,
                lname: concern.admin.lname,
                email: concern.admin.email,
                image: concern.admin.image,
              };

            
            return {
              ...concern,
              time: updatedAt,
              admin: adminDetails,
              customer: customerDetails, 
              hasReply, 
            };
          }).sort((a, b) => b.time - a.time);
          setConcerns( concernWithUpdatedDateTime);
        }catch(error){
          console.error('Error fetching concerns:', error);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const paginatedConcerns = concerns.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const totalPages = Math.ceil(concerns.length / ITEMS_PER_PAGE);


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
                <h2 className="Concern__header-text" onClick={()=>fetchConcern()}>Customer Concerns</h2>
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
                <>
                <div className="Concern__container">
                    {paginatedConcerns.length === 0 ? (
                        <div className="ConcernAdmin__item-available">No concerns available</div>
                    ) : (
                        paginatedConcerns.map((concern) => (
                            <ConcernItem
                                key={concern.id}
                                requestType={concern.concern_type}
                                subject={concern.subject}
                                message={concern.content}
                                time={concern.time}
                                hasReply={concern.hasReply} 
                                onClick={() => handleConcernClick(concern)}
                            />
                        ))
                    )}
                </div>
                {concerns.length > ITEMS_PER_PAGE && (
                    <div className="Transaction__pagination">
                        <button 
                            className="pagination-arrow" 
                            disabled={currentPage === 1} 
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            <IoIosArrowRoundBack  className="pagination-arrow-icon"/>
                        </button>
                        <span className="pagination-number">
                            {currentPage} of {totalPages}
                        </span>
                        <button 
                            className="pagination-arrow" 
                            disabled={currentPage === totalPages} 
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                        <IoIosArrowRoundForward className="pagination-arrow-icon"/>
                        </button>
                    </div>
                )}
                </>
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