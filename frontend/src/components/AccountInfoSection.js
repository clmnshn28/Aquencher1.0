import React, { useState, useEffect } from "react";
import * as images from 'assets/images';

import Modal from "components/Modal";
import TextField from 'components/TextField';
import ButtonGroup from "./ButtonGroup";

export default function AccountInfoSection({title, infoItems}){

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (infoItems) {
      const initialFormData = {};
      infoItems.forEach(row => {
        row.forEach(item => {
          initialFormData[item.label] = item.value;
          console.log("result :"+ initialFormData[item.label]);
        });
      });
      setFormData(initialFormData);
    }
  }, [infoItems]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (id, value) => {
    console.log(`handleInputChange: id=${id}, value=${value}`);
    setFormData({ ...formData, [id]: value });
  };

  const handleSave = () => {
    const form = document.querySelector('.edit-modal-content'); // Get the form element
    if (form.reportValidity()) {
      console.log("Saved data:", formData);
      setIsModalOpen(false);
    }
  };
  
  return(
    <div className="AccountInfoSection__container">
      <div className="AccountInfoSection__section">
        <h3 className="edit-header-info">{title}</h3>
        {infoItems.map((row, rowIndex) => (
          <div className="AccountInfoSection__row" key={rowIndex}>
            {row.map((item, itemIndex) => (
              <div className="AccountInfoSection__item" key={itemIndex}>
                <span className="AccountInfoSection__detail-name">{item.label}</span>
                <p className="AccountInfoSection__details-editable">{item.value}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
      <button className="AccountInfoSection__edit-btn" onClick={handleOpenModal}>
        Edit
        <img className="AccountInfoSection__button-icon" src={images.editProfile} alt="Edit Profile Icon" />
      </button>
      
      {isModalOpen && (
        <Modal>
          <form className="AccountInfoSection__modal-content">
            <h2 className='AccountInfoSection__user-header'>{title}</h2>
            <div className="AccountInfoSection__center-container">
              {infoItems.map((row, rowIndex) => (
                <div className="AccountInfoSection__form-edit-container" key={rowIndex}>
                  {row.map((item, itemIndex) => (
                    <TextField
                      key={itemIndex}
                      label={item.label}
                      id={item.label}
                      value={formData[item.label]}
                      onChange={(e) => handleInputChange(item.label, e.target.value)}
                      type="text"
                      isRequired
                    />
                  ))}
                </div>
              ))}
            </div>
            <ButtonGroup onCancel={handleCloseModal} onSave={handleSave}/>
          </form>
        </Modal>
      )}
    </div>
  );
};