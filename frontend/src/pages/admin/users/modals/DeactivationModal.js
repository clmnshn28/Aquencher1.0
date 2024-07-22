import React from 'react';
import 'assets/css/DeactivationModal.css';
import Modal from 'components/Modal';

export const DeactivationModal = ({ isOpen, onClose, onConfirm }) => {
  
  if (!isOpen) return null;

  return (
    <Modal>
      <div className="deactivation-content">
        {/* <span className="deactivation-close" onClick={onClose}>&times;</span> */}
        <h2 className='deactivation-header'>Deactivate Customer Account</h2>
        <p>Are you sure you want to deactivate this account?</p>
        <p>This action will prevent the worker from <br/> accessing the system.</p>
        <div className="deactivation-modal-actions">
          <button className="deactivation-cancel-btn" onClick={onClose}>Cancel</button>
          <button className="deactivation-confirm-btn" onClick={onConfirm}>Deactivate</button>
        </div>
      </div>
    </Modal>
  );
};

