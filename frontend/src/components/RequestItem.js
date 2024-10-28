import React from "react";
import 'assets/css/components';
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { PiMapPinAreaDuotone } from "react-icons/pi";
import { FaPhoneAlt } from "react-icons/fa";

import * as images from 'assets/images';

export default function RequestItem({id, name, address, slimQuantity, roundQuantity, requestType, status,contact, date, time, image, onAccept, onDecline, acceptDisabled }){
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    return(
        <div className="RequestsItem__item">
            <div className="RequestsItem__request-details">
                <div className={`RequestsItem__request-type ${requestType.toLowerCase()}`}>
                    <img 
                    src={
                        requestType === 'refill' ? images.refillIconOpen :
                        requestType === 'borrow' ? images.borrowIconRed : images.returnIconGreen 
                    } 
                    alt={`${requestType} Icon`} />
                    <span>{capitalize(requestType)}</span>
                </div>  
                <div className="RequestsItem__date-time">
                    <span>{date}</span>
                    <span>{time}</span>
                </div>
            </div>
            
            <div className='RequestItem__customer-info'>
                <img src={image} alt="Customer Image" />
                <div>
                    <span>{name}</span>
                    <p className="RequestAdmin__phone">
                        <FaPhoneAlt />
                        {contact}
                    </p>
                </div>
               
            </div>
            <div className="RequestItem__address-info">
                <p  className="RequestItem__specific-address">
                <PiMapPinAreaDuotone className="UserAdmin__address-icon" /> {address}
                </p>
                <p className="RequestItem__city-province">
                    Malolos, Bulacan
                </p>
            </div>
            <div className="RequestItem__quantities">
                <div className={`RequestItem__quantity-item ${slimQuantity > 0 ? '' : 'hidden'}`}>
                    <img src={images.returnSlim} alt="Slim Gallon" />
                    <span>{slimQuantity}</span>
                </div>
                <div className={`RequestItem__quantity-item ${roundQuantity > 0 ? '' : 'hidden'}`}>
                    <img src={images.returnRound} alt="Round Gallon" />
                    <span>{roundQuantity}</span>
                </div>
            </div>
            <div className="RequestItem__status">
                {status !== 'completed' ? (
                    <>
                        <button className="RequestItem__status-button RequestItem__decline" onClick={()=>onDecline(id)} >
                            &#10005;
                        </button>
                        <button className="RequestItem__status-button RequestItem__accept" onClick={()=>onAccept(id)} disabled={acceptDisabled}>
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