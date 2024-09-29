import React, {useState} from 'react';
import 'assets/css/modals';
import Modal from 'components/Modal';
import CustomDropdown from 'components/CustomDropdown';
import ButtonGroup from 'components/ButtonGroup';

export const DeactivationModal = ({ isOpen, onClose, onConfirm }) => {
  
  const options = [
    { value: 'inactivity', title: 'Inactivity', description: 'The account has been inactive for an extended period.' },
    { value: 'violation', title: 'Violation of Terms', description: 'The customer has violated the terms of service.' },
  ];

  const [reason, setReason] = useState('');

  const handleCancel = () => {
    setReason(''); 
    onClose(); 
  };

  const handleConfirm = () =>{
    setReason('');
    const selectedOption = options.find(option => option.value === reason);
    if (selectedOption) {
        onConfirm(selectedOption); // Pass the whole selected option
    }
  };

  if (!isOpen) return null;

  return (
    <Modal>
      <div className="DeactivationModal__content">
        <h2 className='DeactivationModal__header'>Deactivate Customer Account</h2>
        <p>Are you sure you want to deactivate this account?</p>
        <p>This action will prevent the customer from <br/> accessing the system.</p>

        <div className='DeactivationModal__dropdown-container'>
          <CustomDropdown
            value={reason} 
            onChange={setReason}
            options={options}
            defaultText = 'Select the reason for account deactivation'
          />
        </div>

        <div className="DeactivationModal__modal-actions">
          <ButtonGroup
            onCancel={handleCancel}
            onSave={handleConfirm}
            saveText='Deactivate'
            saveButtonColor='#9E1616'
            disabled={!reason} 
          />
        </div>
      </div>
    </Modal>
  );
};

