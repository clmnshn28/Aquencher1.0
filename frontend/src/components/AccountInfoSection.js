import React from "react";
import 'assets/css/components';
import * as images from 'assets/images';

export default function AccountInfoSection({title, infoItems, onEditClick}){
  
  const getDisplayValue = (label, value) => {
    if (['House number', 'Street', 'Barangay', 'Contact No.'].includes(label) && !value) {
      return '-';
    }
    return label === 'Username' ? `@${value}` : value;
  };

  return(
    <div className="AccountInfoSection__container">
      <div className="AccountInfoSection__section">
        <h3 className="edit-header-info">{title}</h3>
          <div className="AccountInfoSection__row" >
            {infoItems.map((item, itemIndex) => (
              <div className="AccountInfoSection__item" key={itemIndex}>
                <span className="AccountInfoSection__detail-name">{item.label}</span>
                <p className="AccountInfoSection__details-editable">
                  {getDisplayValue(item.label, item.value)}
                </p>
              </div>
            ))}
          </div>
      </div>
      <button className="AccountInfoSection__edit-btn" onClick={onEditClick}>
        Edit
        <img className="AccountInfoSection__button-icon" src={images.editProfile} alt="Edit Profile Icon" />
      </button>
    </div>
  );
};