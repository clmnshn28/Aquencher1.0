import React from "react";
import 'assets/css/components';
import { PiMapPinAreaDuotone } from "react-icons/pi";
import { FaPhoneAlt } from "react-icons/fa";

import * as images from 'assets/images';

export default function RejectedItem({ name, address, slimQuantity, roundQuantity, requestType, contact, image, date, time, reason}){
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
                    alt={`${capitalize(requestType)} Icon`} />
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
            <div className="RequestItem__reason-container">
               <div className="RequestItem__reason-section">
                    <p>Reason:</p>
                    <p>{reason}</p>
               </div>
            </div>
      </div>
    );
};