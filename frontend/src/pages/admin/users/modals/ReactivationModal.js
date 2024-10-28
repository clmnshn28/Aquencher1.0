import React from 'react';
import 'assets/css/modals';
import Modal from 'components/Modal';
import ButtonGroup from 'components/ButtonGroup';

export const ReactivationModal = ({ isOpen, onClose, onConfirm, userId, fName, lName, acceptDisabled }) => {

  const handleConfirm = () => {
    onConfirm(userId, fName, lName);
  };

  if (!isOpen) return null;

  return (
    <Modal>
      <div className="ReactivationModal__content">
        <h2 className='ReactivationModal__header'>Reactivate Customer Account</h2>
        <p>Are you sure you want to Reactivate this account?</p>
        
        <div className='ReactivationModal__customer-container'>
          <div className='ReactivationModal__customer-info'>
            <span className='ReactivationModal__label'>Customer ID:</span>
            <span className='ReactivationModal__value'>{userId}</span>
          </div>
          <div className='ReactivationModal__customer-info'>
            <span className='ReactivationModal__label'>Customer Name:</span>
            <span className='ReactivationModal__value'>{`${fName} ${lName}`}</span>
          </div>
        </div>


        <div className="ReactivationModal__modal-actions">
          <ButtonGroup
            onCancel={onClose}
            onSave={handleConfirm}
            saveText='Reactivate'
            saveButtonColor='#0174CF'
            disabled={acceptDisabled} 
          />
        </div>
      </div>
    </Modal>
  );
};

