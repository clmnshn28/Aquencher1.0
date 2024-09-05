import React from "react";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

import * as images from 'assets/images';

export default function RequestItem({id, name, address, slimQuantity, roundQuantity, requestType, status, onAccept, onDecline}){
    
    return(
        <div className="RequestsItem__item">
            <div className={`RequestsItem__request-type ${requestType.toLowerCase()}`}>
                <img 
                src={
                    requestType === 'Refill' ? images.refillIconOpen :
                    requestType === 'Borrow' ? images.borrowIconRed : images.returnIconGreen 
                } 
                alt={`${requestType} Icon`} />
                <span>{requestType}</span>
            </div>
            <div className='RequestItem__customer-info'>
                <img src={images.defaultAvatar} alt="Customer Image" />
                <span>{name}</span>
            </div>
            <div className="RequestItem__address-info">
                <p className="RequestItem__specific-address">
                    {address}
                </p>
                <p className="RequestItem__city-province">
                    Malolos, Bulacan
                </p>
            </div>
            <div className="RequestItem__quantities">
                {slimQuantity > 0 && (
                    <div className="RequestItem__quantity-item">
                        <img src={images.returnSlim} alt="Slim Gallon" />
                        <span>{slimQuantity}</span>
                    </div>
                )}
                {roundQuantity > 0 && (
                    <div className="RequestItem__quantity-item">
                        <img src={images.returnRound} alt="Round Gallon" />
                        <span>{roundQuantity}</span>
                    </div>
                )}
            </div>
            <div className="RequestItem__status">
                {status === false ? (
                    <>
                        <button className="RequestItem__status-button RequestItem__decline" onClick={()=>onDecline(id)} >
                            &#10005;
                        </button>
                        <button className="RequestItem__status-button RequestItem__accept" onClick={()=>onAccept(id)}>
                            &#10004;
                        </button>
                    </>
                ):(
                    <span className="RequestItem__status-text-completed">
                        <IoCheckmarkCircleOutline  className="RequestItem__status-completed-icon" /> 
                        Completed
                    </span>
                )}
            </div>
      </div>
    );
};