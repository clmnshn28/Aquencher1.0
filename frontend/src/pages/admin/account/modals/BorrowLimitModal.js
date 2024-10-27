import React, {useState} from "react";
import 'assets/css/modals';
import Modal from "components/Modal";
import ButtonGroup from "components/ButtonGroup";
import TextField from "components/TextField";
import * as images from 'assets/images';

export const BorrowLimitModal = ({isOpen, onClose, onConfirm, slimGallons, roundGallons, setSlimGallons, setRoundGallons }) =>{


    if(!isOpen) return null;

    return(
        <Modal>
            <form onSubmit={(e) => { e.preventDefault(); onConfirm(); }} className="BorrowLimitModal__container">
                <h2>Borrow Limits Per Customer</h2>
                <div className="BorrowLimitModal__edit-section">
                    <div className="BorrowLimitModal__time-picker-container">
                        <div className="BorrowLimitModal__time-picker-item">
                            <img src={images.returnSlim} alt="Slim Gallon Icon"/>
                            <TextField 
                                label='Slim Gallons :' 
                                id='slimGallon'
                                name='slimGallon' 
                                value={slimGallons} 
                                onChange={(e) => setSlimGallons(e.target.value)} 
                                type='text' 
                                isRequired
                                required 
                                autoComplete='off'
                                isInline={true}
                                
                            />
                        </div>
                        <div className="BorrowLimitModal__time-picker-item">
                            <img src={images.returnRound} alt="Slim Gallon Icon"/>
                            <TextField 
                                label='Slim Gallons :' 
                                id='slimGallon'
                                name='slimGallon' 
                                value={roundGallons} 
                                onChange={(e) => setRoundGallons(e.target.value)} 
                                type='text' 
                                isRequired
                                required 
                                autoComplete='off'
                                isInline={true}
                            
                            />
                        </div>
                    </div>
                </div>
                <ButtonGroup
                    onCancel={onClose}
                    saveText='Save Changes'
                    saveButtonColor='#0174CF'
                />
            </form>
        </Modal>
    );
};
