import React, {useState} from "react";
import 'assets/css/modals';

import Modal from "components/Modal";
import ButtonGroup from "components/ButtonGroup";
import { TimePicker } from "components/TimePicker";


export const PickupDeliveryTimeModal = ({isOpen, onClose, onConfirm,  pickupTime, deliveryTime, setPickupTime, setDeliveryTime  }) =>{

    const [isPickupTimeOpen, setIsPickupTimeOpen] = useState(false);
    const [isDeliveryTimeOpen, setIsDeliveryTimeOpen] = useState(false);

    if(!isOpen) return null;

    return(
        <Modal>
            <div className="PickupDeliveryTimeModal__container">
                <h2>Pickup and Delivery Time</h2>
                <div className="PickupDeliveryTimeModal__edit-section">
                    <div className="PickupDeliveryTimeModal__time-picker-container">
                        <div className="PickupDeliveryTimeModal__time-picker-item">
                            <h3>Estimated Pickup Time</h3>
                            <TimePicker 
                                selectedTime={pickupTime} 
                                onChange={setPickupTime} 
                                isOpen={isPickupTimeOpen} 
                                toggleDropdown={setIsPickupTimeOpen} 
                                format='minute-second'
                                className='TimePicker__minute-second'
                            />
                        </div>

                        <div className="PickupDeliveryTimeModal__time-picker-item">
                            <h3>Estimated Delivery Time</h3>
                            <TimePicker 
                                selectedTime={deliveryTime} 
                                onChange={setDeliveryTime} 
                                isOpen={isDeliveryTimeOpen} 
                                toggleDropdown={setIsDeliveryTimeOpen} 
                                format='minute-second'
                                className='TimePicker__minute-second'
                            />
                        </div>
                        
                    </div>
                </div>
                <ButtonGroup
                    onCancel={onClose}
                    onSave={onConfirm}
                    saveText='Save Changes'
                    saveButtonColor='#0174CF'
                />
            </div>
        </Modal>
    );
};