import "assets/css/admin"
import React, { useState, useEffect, useRef  } from 'react';
import { MdOutlineEdit } from "react-icons/md";
import { format } from 'date-fns';
import axios from 'axios';
import {API_URL} from 'constants';

import * as images from 'assets/images';
import { EditInventoryModal } from "./modals/EditInventoryModal";

export const InventoryAdmin = () =>{

  const [inventoryItems, setInventoryItems] = useState([]);
  const [EditInventory, setEditInventory] = useState(false);

  const [selectedInventory, setSelectedInventory] = useState(null);
  const [inventory, setInventory] = useState({
    itemName: '', initialStock: '', price: '',
  });
  const [isAccepting, setIsAccepting] = useState(false);
  const initialFetchDone = useRef(false);

  useEffect(()=>{
    if (!initialFetchDone.current) {
      fetchInventory();
      initialFetchDone.current = true;
    }
  },[]);

  const fetchInventory  = async () =>{
    try{
      const response = await axios.get(API_URL + '/api/admin/products',{
        headers: {
          'Authorization' : `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`
        }
      });
      const updatedItems = response.data.data.map(item => ({
        ...item,
        status: item.available_stock > 0 ? 'Available' : 'Out of Stock',
      }));

      setInventoryItems(updatedItems);
    }catch(error){
      console.error('Error fetching users', error);
    }
  };

  const handleItemNameChange = (e) => setInventory(prevState => ({ ...prevState, itemName: e.target.value || '' }));
  const handleInitialStockChange = (e) => setInventory(prevState => ({ ...prevState, initialStock: e.target.value || '' }));
  const handlePriceChange = (e) => setInventory(prevState => ({ ...prevState, price: e.target.value || '' }));
  
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
      itemName: inventory.item_name, 
      initialStock: inventory.initial_stock, 
      price: inventory.price,
      borrowed: inventory.borrowed, 
      availableStock: inventory.available_stock, 
      status: inventory.status, 
      lastUpdated: formatDate(inventory.updated_at)
    });
    setEditInventory(true);
  };

  // confirm Edit Inventory
  const handleInventorySubmit = async (e) =>{
    e.preventDefault();
    setIsAccepting(true); 
    try{

      const newAvailableStock = inventory.initialStock - (selectedInventory.borrowed || 0);
      const updatedStatus = newAvailableStock > 0 ? 'Available' : 'Out of Stock';

      const response = await axios.put(API_URL + `/api/admin/products/${selectedInventory.id}`,{
        item_name: inventory.itemName, 
        initial_stock: inventory.initialStock, 
        price: inventory.price,
        available_stock: newAvailableStock,
        status: updatedStatus,
        },{
          headers:{
            'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
          },
      });

      
      const updatedItem = response.data.data;

      const updatedItems = inventoryItems.map(item =>
          item.id === selectedInventory.id ? { ...item, ...updatedItem, status: updatedStatus} : item
      );

      setInventoryItems(updatedItems);
      setSelectedInventory(null);
      setEditInventory(false);
  
    }catch(error){
      console.log('Error updating inventory item: ', error);
    }finally {
      setIsAccepting(false);
    }

  };
  
  const formatDate = (dateString) => {
    return format(new Date(dateString), 'yyyy-MM-dd hh:mm a'); 
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
              <th>Borrowed</th>
              <th>Available Stock</th>
              <th>Status</th>
              <th>Last Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {inventoryItems.map((inventory) =>(
              <tr key={inventory.id}>
                <td>{inventory.item_name}</td>
                <td>{inventory.initial_stock}</td>
                <td>₱{parseInt(inventory.price).toFixed(2)}</td>
                <td>{inventory.borrowed}</td>
                <td>{inventory.available_stock}</td>
                <td  style={{color: inventory.status === 'Available' ? '#007bff' : '#9E1616'}}>
                  {inventory.status}
                </td>
                <td>
                <div>{format(new Date(inventory.updated_at), 'yyyy-MM-dd')}</div>
                <div>{format(new Date(inventory.updated_at), 'hh:mm a')}</div>
                </td>
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
                style={{ color: getStockColor(inventory.available_stock) }}
                >
                  {inventory.available_stock}
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
        inventoryBorrowed = {inventory.borrowed} 
        inventoryAvailableStock = {inventory.availableStock}
        inventoryStatus = {inventory.status}
        inventoryLastUpdated = {inventory.lastUpdated}

        onItemNameChange={handleItemNameChange}
        onInitialStockChange ={handleInitialStockChange}
        onPriceChange = {handlePriceChange}
        acceptDisabled={isAccepting}
      />
    </>
  );
}

