import React from 'react';
import 'assets/css/admin';
import Modal from 'components/Modal';
import ButtonGroup from 'components/ButtonGroup';

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
          <ButtonGroup
            onSave={onConfirm}
            onCancel={onClose}
            saveText="Deactivate"
            saveButtonColor='#9E1616'
          />
        </div>
      </div>
    </Modal>
  );
};

