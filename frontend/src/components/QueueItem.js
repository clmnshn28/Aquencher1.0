import React from "react";
import 'assets/css/components';
import { MdAccessTime } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { PiMapPinAreaDuotone } from "react-icons/pi";

import * as images from 'assets/images';

export default function QueueItem ({id, name, address, slimQuantity, roundQuantity, requestType, contact, date, time, image, onAccept}){
    const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    return(
        <div className="QueueItem__item">
            <div className={`QueueItem__request-type ${requestType.toLowerCase()}`}>
                <img 
                src={
                    requestType === 'refill' ? images.refillIconOpen :
                    requestType === 'borrow' ? images.borrowIconRed : images.returnIconGreen 
                } 
                alt={`${capitalize(requestType)} Icon`} />
                <span>{capitalize(requestType)}</span>
            </div>
            <div className="QueueItem__date-time">
                <span>{date}</span>
                <span>{time}</span>
            </div>
            
            <div className='QueueItem__customer-info'>
                <img src={image} alt="Customer Image" />
                <div className="QueueItem__info">
                    <span>{name}</span>
                    <div className="QueueItem__address-info">
        
                        <div className="QueueItem__location">
                            <PiMapPinAreaDuotone className="QueueAdmin__address-icon" />
                            <p className="QueueItem__specific-address">
                                {address}
                            </p>
                        </div>
                        <p className="QueueItem__city-province">
                            Malolos, Bulacan
                        </p>
                        <p className="QueueAdmin__phone">
                            <FaPhoneAlt />
                            {contact}
                        </p>
                    </div>
                </div>
            </div>
            <div className="QueueItem__quantities">
                <div className={`QueueItem__quantity-item ${slimQuantity > 0 ? '' : 'hidden'} `} >
                    <img src={images.returnSlim} alt="Slim Gallon" />
                    <span>{slimQuantity}</span>
                </div>
                <div className={`QueueItem__quantity-item ${roundQuantity > 0 ? '' : 'hidden'}`}>
                    <img src={images.returnRound} alt="Round Gallon" />
                    <span>{roundQuantity}</span>
                </div>
            </div>
            <div className="QueueItem__duration">
                <p>{capitalize(requestType)} Duration</p>
                <div className="QueueItem__time-duration">
                    <div className="QueueItem__time-icon">
                        <MdAccessTime className='QueueItem__time-logo'/>
                        <span>20:00</span>
                    </div>
                    <span>m</span>
                </div>
            </div>
            <div className="QueueItem__status">
                <button className="QueueItem__status-button QueueItem__accept" onClick={()=> onAccept(id)} >
                    &#10004;
                </button>
            </div>
        </div>
    );
};