import "assets/css/InventoryAdmin.css"
import React, { useState } from 'react';

import inventoryDots from 'assets/images/user-dots.png';

export const InventoryAdmin = () =>{

  return (
  
    <div>
      <div className="inventory-header">
        <h2 className="inventory-header-text">Inventory</h2>
        <div className="total-gallon-container">
          {/* slim */}
          <div className="slim-gallon-container">
            <div className="final-total-slim">
              <p className="final-total-slim-text">Total Slim Gallon</p>
              <p className="final-total-slim-value">0</p>
            </div>

            <div className="slim-content">
              <div className="final-total-container">
                <p className="final-total-text">Total Available</p>
                <p className="final-total-value">0</p>
              </div>
              <div className="final-total-container">
                <p className="final-total-text">Total Refilled</p>
                <p className="final-total-value">0</p>
              </div>
              <div className="final-total-container">
                <p className="final-total-text">Total Borrowed</p>
                <p className="final-total-value">0</p>
              </div>
            </div>
          </div>
          {/* round */}
          <div className="round-gallon-container">
            <div className="final-total-round">
              <p className="final-total-round-text">Total Round Gallon</p>
              <p className="final-total-round-value">0</p>
            </div>

            <div className="round-content">
              <div className="final-total-container">
                <p className="final-total-text">Total Available</p>
                <p className="final-total-value">0</p>
              </div>
              <div className="final-total-container">
                <p className="final-total-text">Total Refilled</p>
                <p className="final-total-value">0</p>
              </div>
              <div className="final-total-container">
                <p className="final-total-text">Total Borrowed</p>
                <p className="final-total-value">0</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead className="inventory-table-header">
            <tr>
              <th>Gallon Type</th>
              <th>Quantity in Stock</th>
              <th>Price per Gallon</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="name-gallon">Po's Purified Blue Slim Gallon with Faucet Refill (20L/5gal)</td>
              <td>150</td>
              <td>₱25.00</td>
              <td>
                <img 
                src={inventoryDots} 
                alt="actions"  
                className="inventoryDots"/>
              </td>
            </tr>
            <tr>
              <td className="name-gallon">Po’s Purified Round Dispenser Bottle Refill 18.9L</td>
              <td>150</td>
              <td>₱25.00</td>
              <td>
                <img 
                src={inventoryDots} 
                alt="actions"  
                className="inventoryDots"/>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>
  );
}

