import React from "react";
import 'assets/css/components';
import { PiMapPinAreaDuotone } from "react-icons/pi";
import { FaPhoneAlt } from "react-icons/fa";

import * as images from 'assets/images';

export default function RejectedItem({id, name, address, slimQuantity, roundQuantity, requestType, contact, date, time}){
    
    return(
        <div className="RequestsItem__item">
            <div className="RequestsItem__request-details">
                <div className={`RequestsItem__request-type ${requestType.toLowerCase()}`}>
                    <img 
                    src={
                        requestType === 'Refill' ? images.refillIconOpen :
                        requestType === 'Borrow' ? images.borrowIconRed : images.returnIconGreen 
                    } 
                    alt={`${requestType} Icon`} />
                    <span>{requestType}</span>
                </div>  
                <div className="RequestsItem__date-time">
                    <span>{date}</span>
                    <span>{time}</span>
                </div>
            </div>
            
            <div className='RequestItem__customer-info'>
                <img src={images.defaultAvatar} alt="Customer Image" />
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
                    <p>Invalid contact information</p>
               </div>
            </div>
      </div>
    );
};