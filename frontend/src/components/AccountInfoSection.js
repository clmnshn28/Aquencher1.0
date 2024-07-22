import React from "react";
import editProfile from 'assets/images/edit-profile.png';

export default function AccountInfoSection({title, infoItems}){

  return(
    <div className="edit-account-container">
      <div className="info-section">
        <h3 className="edit-header-info">{title}</h3>
        {infoItems.map((row, rowIndex) => (
          <div className="info-row" key={rowIndex}>
            {row.map((item, itemIndex) => (
              <div className="info-item" key={itemIndex}>
                <span className="info-detail-name">{item.label}</span>
                <p className="info-details-editable">{item.value}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
      <button className="button-edit-personal-info">
        Edit
        <img className="edit-profile-button-icon" src={editProfile} alt="Edit Profile Icon" />
      </button>

    </div>
  );
};