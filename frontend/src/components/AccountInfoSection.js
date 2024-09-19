import React, { useState, useEffect } from "react";
import 'assets/css/components';
import * as images from 'assets/images';

export default function AccountInfoSection({title, infoItems, onEditClick}){
  
  return(
    <div className="AccountInfoSection__container">
      <div className="AccountInfoSection__section">
        <h3 className="edit-header-info">{title}</h3>
          <div className="AccountInfoSection__row" >
            {infoItems.map((item, itemIndex) => (
              <div className="AccountInfoSection__item" key={itemIndex}>
                <span className="AccountInfoSection__detail-name">{item.label}</span>
                <p className="AccountInfoSection__details-editable">{item.value}</p>
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