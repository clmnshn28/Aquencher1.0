import React from "react";
import 'assets/css/admin';
import * as images from 'assets/images';

export const OperationalSection = ({title, content, className, onEditClick }) =>{

    return(
        <div className="OperationalSettingsAdmin__section">
            <h2>{title}</h2>
            <div className={`OperationalSettingsAdmin__section-content ${className}`}>
                {content}
                <button  className="OperationalSettingsAdmin__edit-btn" onClick={onEditClick} >
                    Edit
                    <img className="OperationalSettingsAdmin__edit-icon" src={images.editProfile} alt="Edit Profile Icon" />
                </button>
            </div>
        </div>
    );
};