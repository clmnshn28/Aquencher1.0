import React from "react";
import 'assets/css/modals';

import Modal from "components/Modal";
import ButtonGroup from "components/ButtonGroup";
import TextField from "components/TextField";

export const EditInventoryModal = ({
    isOpen, onClose, onConfirm,
    onItemNameChange, onInitialStockChange, onPriceChange, onBorrowableChange,
    inventoryItemName, inventoryInitialStock, inventoryPrice, inventoryBorrowable, inventoryBorrowed,
    inventoryReturned, inventoryAvailableStock, inventoryStatus, inventoryLastUpdated}) =>{

    
    if(!isOpen) return null;

    return(
        <>
            <Modal>
                <div className="EditInventoryModal__container">
                    <h2>Edit Inventory Item</h2>
                    <form onSubmit={onConfirm} >
                        <div className="EditInventoryModal__edit-section">
                            <TextField label='Item Name' id='itemName'name='itemName' value={inventoryItemName} onChange={onItemNameChange} type='text' isRequired isInline={true}/>
                            <TextField label='Initial Stock' id='initialStock'name='initialStock' value={inventoryInitialStock} onChange={onInitialStockChange} type='text' isRequired isInline={true}/>
                            <TextField label='Price' id='price'name='price' value={inventoryPrice} onChange={onPriceChange} type='text' isRequired isInline={true}/>
                            <TextField label='Borrowed' id='borrowed'name='borrowed' value={inventoryBorrowed} type='text' isReadOnly isInline={true}/>
                            <TextField label='Returned' id='returned'name='returned' value={inventoryReturned} type='text' isReadOnly isInline={true}/>
                            <TextField label='Available Stock' id='availableStock'name='availableStock' value={inventoryAvailableStock}  type='text' isReadOnly  isInline={true}/>
                            <TextField label='Borrowable Stock' id='borrowable'name='borrowable' value={inventoryBorrowable} onChange={onBorrowableChange} type='text' isRequired  isInline={true}/>
                            <TextField label='Status' id='status'name='status' value={inventoryStatus} type='text' isReadOnly isInline={true}/>
                            <TextField label='Last Update' id='lastUpdate'name='lastUpdate' value={inventoryLastUpdated} type='text' isReadOnly isInline={true}/>
                            <div className="EditInventoryModal__line"></div>
                        </div>
                        <ButtonGroup
                            onCancel={onClose}
                            onSave={onConfirm}
                            saveText='Save Changes'
                            saveButtonColor='#0174CF'
                        />     
                    </form> 
                </div>
            </Modal>
        </>
    );
};