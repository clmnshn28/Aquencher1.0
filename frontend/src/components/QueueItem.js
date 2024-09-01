import React from "react";
import { MdAccessTime } from "react-icons/md";

import * as images from 'assets/images';

export default function QueueItem ({id, name, address, slimQuantity, roundQuantity, requestType, status, onAccept}){

    return(
        <div className="QueueItem__item">
            <div className={`QueueItem__request-type ${requestType.toLowerCase()}`}>
                <img 
                src={
                    requestType === 'Refill' ? images.refillIconOpen :
                    requestType === 'Borrow' ? images.borrowIconRed : images.returnIconGreen 
                } 
                alt={`${requestType} Icon`} />
                <span>{requestType}</span>
            </div>
            
            <div className='QueueItem__customer-info'>
                <img src={images.defaultAvatar} alt="Customer Image" />
                <div className="QueueItem__info">
                    <span>{name}</span>
                    <div className="QueueItem__address-info">
                        <div className="QueueItem__location">
                            <img src={images.locationAddress} alt="Location Icon" />
                            <p className="QueueItem__specific-address">
                                {address}
                            </p>
                        </div>
                        <p className="QueueItem__city-province">
                            Malolos, Bulacan
                        </p>
                    </div>
                </div>
            </div>
            <div className="QueueItem__quantities">
                <div className="QueueItem__quantity-item">
                    <img src={images.returnSlim} alt="Slim Gallon" />
                    <span>{slimQuantity}</span>
                </div>
                <div className="QueueItem__quantity-item">
                    <img src={images.returnRound} alt="Slim Gallon" />
                    <span>{roundQuantity}</span>
                </div>
            </div>
            <div className="QueueItem__duration">
                <p>{requestType} Duration</p>
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