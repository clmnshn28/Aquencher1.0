import React from "react";
import 'assets/css/modals';

import Modal from "components/Modal";
import ButtonGroup from "components/ButtonGroup";
import TextField from "components/TextField";

export const EditInventoryModal = ({
    isOpen, onClose, onConfirm,
    onItemNameChange, onInitialStockChange, onPriceChange,
    inventoryItemName, inventoryInitialStock, inventoryPrice, inventoryBorrowed,
    inventoryAvailableStock, inventoryStatus, inventoryLastUpdated}) =>{

    
    if(!isOpen) return null;

    return(
        <>
            <Modal>
                <div className="EditInventoryModal__container">
                    <h2>Edit Inventory Item</h2>
                    <form onSubmit={onConfirm} >
                        <div className="EditInventoryModal__edit-section">
                            <TextField label='Item Name :' id='itemName'name='itemName' value={inventoryItemName} onChange={onItemNameChange} type='text' isRequired required autoComplete='off' isInline={true}/>
                            <TextField label='Initial Stock :' id='initialStock'name='initialStock' value={inventoryInitialStock} onChange={onInitialStockChange} type='text' isRequired required autoComplete='off' isInline={true}/>
                            <TextField label='Price :' id='price'name='price' value={inventoryPrice} onChange={onPriceChange} type='text' isRequired required autoComplete='off' isInline={true}/>
                            <TextField label='Borrowed :' id='borrowed'name='borrowed' value={inventoryBorrowed} type='text' readOnly isInline={true}/>
                            <TextField label='Available Stock :' id='availableStock'name='availableStock' value={inventoryAvailableStock}  type='text' readOnly  isInline={true}/>
                            <TextField label='Status :' id='status'name='status' value={inventoryStatus} type='text' readOnly isInline={true}/>
                            <TextField label='Last Update :' id='lastUpdate'name='lastUpdate' value={inventoryLastUpdated} type='text' readOnly isInline={true}/>
                            <div className="EditInventoryModal__line"></div>
                        </div>
                        <ButtonGroup
                            onCancel={onClose}
                            saveText='Save Changes'
                            saveButtonColor='#0174CF'
                        />     
                    </form> 
                </div>
            </Modal>
        </>
    );
};