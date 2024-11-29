import React from "react";
import 'assets/css/customer';
import Modal from "components/Modal";
import ButtonGroup from "components/ButtonGroup";

export const ConfirmationModal = ({isOpen, onClose, onConfirm, image, title, message, isProcessing}) =>{

    // const [note, setNote] = useState('');

    const handleCancel = () => {
        // setNote(''); 
        onClose(); 
    };
    
    const handleConfirm = () =>{
        onConfirm();
        // setNote('');
    };

    if (!isOpen) return null;

    return(
        <Modal>
            <div className="ConfirmationModal__content">
                <div className="ConfirmationModal__header-container">
                    <img src={image} alt={`${title} Icon`}  />
                    <h2>{title}</h2>   
                </div>
                <p className="ConfirmationModal__message">{message}</p>
                {/* <div className='ConfirmationModal__note-section'>
                    <TextArea
                        className="TextArea" 
                        value={note}
                        onChange={(e)=> setNote(e.target.value)}
                        placeholder="Optional: Enter your message here"
                    />
                </div> */}
                <div className="ConfirmationModal__actions">
                    <ButtonGroup
                        onCancel={handleCancel}
                        onSave={handleConfirm}
                        disabled={isProcessing}
                        saveText={isProcessing ? 'Processing...' : 'Confirm'}
                        saveButtonColor='#0174CF'
                    />
                </div>
            </div>
        </Modal>
    );
};