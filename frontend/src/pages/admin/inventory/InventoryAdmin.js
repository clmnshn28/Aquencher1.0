import "assets/css/admin"
import React, { useState } from 'react';
import { MdOutlineEdit } from "react-icons/md";

import * as images from 'assets/images';
import { EditInventoryModal } from "./modals/EditInventoryModal";

export const InventoryAdmin = () =>{

  const [inventoryItems, setInventoryItems] = useState([
    {id: 1, itemName:'Blue Slim Gallon with Faucet Refill (20L/5gal)', initialStock: 0, price: 0, borrowable: 0, borrowed: 0, returned: 0, availableStock: 0, status: 'none', lastUpdated: '0000-00-00'},
    {id: 2, itemName:'Round Gallon Dispenser Refill 18.9L', initialStock: 0, price: 0, borrowable: 0, borrowed: 0, returned: 0, availableStock: 0, status: 'none', lastUpdated: '0000-00-00'},
  ]);
  const [EditInventory, setEditInventory] = useState(false);

  const [selectedInventory, setSelectedInventory] = useState(null);
  const [inventory, setInventory] = useState({
    itemName: '', initialStock: '', price: '',
    borrowable: '',borrowed:'', returned: '',
    availableStock: '', status: '', lastUpdated: '' 
  });

  const handleItemNameChange = (e) => setInventory(prevState => ({ ...prevState, itemName: e.target.value || '' }));
  const handleInitialStockChange = (e) => setInventory(prevState => ({ ...prevState, initialStock: parseInt(e.target.value) || '' }));
  const handlePriceChange = (e) => setInventory(prevState => ({ ...prevState, price:  parseFloat(e.target.value) || '' }));
  const handleBorrowableChange = (e) => setInventory(prevState => ({ ...prevState, borrowable: parseInt(e.target.value) || ''}));

  // color status
  const getStockColor = (value) => {
    if (value > 0) return '#007bff';       
    // if (value > 0) return '#ACA72A';     
    return '#9E1616';                        
  };
  
  // Cancel editing
  const handleInventoryCancel = () =>{
    setEditInventory(false);
    setSelectedInventory(null);
  };

    // Open edit modal
  const handleEditClick = (inventory) => {
    setSelectedInventory(inventory);
    setInventory({
      itemName: inventory.itemName, 
      initialStock: inventory.initialStock, 
      price: inventory.price,
      borrowable: inventory.borrowable,
      borrowed: inventory.borrowed, 
      returned: inventory.returned,
      availableStock: inventory.availableStock, 
      status: inventory.status, 
      lastUpdated: inventory.lastUpdated
    });
    setEditInventory(true);
  };

  // confirm Edit Inventory
  const handleInventorySubmit = (e) =>{
    e.preventDefault();

    const updatedItems = inventoryItems.map(item =>
      item.id === selectedInventory.id ? { ...selectedInventory, ...inventory } : item
    );

    setInventoryItems(updatedItems);  
    setSelectedInventory(null); // set null the item selected
    setEditInventory(false); //close modal

  };

  return (
    <>
      <div className="InventoryAdmin__header">
        <h2 className="InventoryAdmin__header-text">Inventory</h2>
      </div>

      <div className="InventoryAdmin__table-container">
        <table className="InventoryAdmin__table">
          <thead className="InventoryAdmin__table-header">
            <tr>
              <th>Item Name</th>
              <th>Initial Stock</th>
              <th>Price</th>
              <th>Borrowable</th>
              <th>Borrowed</th>
              <th>Returned</th>
              <th>Available Stock</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {inventoryItems.map((inventory) =>(
              <tr key={inventory.id}>
                <td>{inventory.itemName}</td>
                <td>{inventory.initialStock}</td>
                <td>₱{inventory.price.toFixed(2)}</td>
                <td>{inventory.borrowable}</td>
                <td>{inventory.borrowed}</td>
                <td>{inventory.returned}</td>
                <td>{inventory.availableStock}</td>
                <td  style={{color: inventory.status === 'Available' ? '#007bff' : ''}}>
                  {inventory.status}
                </td>
                <td>{inventory.lastUpdated}</td>
                <td>
                  <button className="InventoryAdmin__edit" onClick={() => handleEditClick(inventory)}>
                    <MdOutlineEdit/>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
            
      <div className="InventoryAdmin__summary">
        {inventoryItems.map((inventory) =>(
          <div className="InventoryAdmin__summary-item" key={inventory.id}>
            <img
              src={inventory.id === 1 ? images.returnSlim : images.returnRound}
              alt={inventory.itemName}
              className="InventoryAdmin__summary-icon"
            />
            <div className="InventoryAdmin__summary-item-text">
              <p className="InventoryAdmin__summary-item-name">
                {inventory.id === 1 ? "Slim Gallon" : "Round Gallon"}
              </p>
              <p>
                Total Available Stock: 
                <span
                className="InventoryAdmin__available"  
                style={{ color: getStockColor(inventory.availableStock) }}
                >
                  {inventory.availableStock}
                </span>
              </p>
              <p>
                Borrowable Stock: 
                <span
                className="InventoryAdmin__available"   
                >
                  {inventory.borrowable}
                </span>
              </p>

            </div>
          </div>
        ))}
      </div>

      <EditInventoryModal
        isOpen={EditInventory}
        onClose={handleInventoryCancel}
        onConfirm={handleInventorySubmit}

        inventoryItemName = {inventory.itemName}
        inventoryInitialStock = {inventory.initialStock}
        inventoryPrice = {inventory.price}
        inventoryBorrowable = {inventory.borrowable}
        inventoryBorrowed = {inventory.borrowed}
        inventoryReturned = {inventory.returned}
        inventoryAvailableStock = {inventory.availableStock}
        inventoryStatus = {inventory.status}
        inventoryLastUpdated = {inventory.lastUpdated}

        onItemNameChange={handleItemNameChange}
        onInitialStockChange ={handleInitialStockChange}
        onPriceChange = {handlePriceChange}
        onBorrowableChange = {handleBorrowableChange}
      />
    </>
  );
}

