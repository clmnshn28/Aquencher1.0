import "assets/css/admin"
import React, { useState } from 'react';

import * as images from 'assets/images';

export const DashboardAdmin = () => {

  return (

    <div>
      <h2 className="welcome">Welcome, Admin!</h2>
      <div className="first-content">
        <div className="summary">
            <div className="summary-item">
              <div className="summary-title">Employee Total</div>
              <div className="summary-value">0</div>
            </div>
            <div className="summary-item">
              <div className="summary-title">Available Gallons</div>
              <div className="summary-value">0</div>
            </div>
            <div className="summary-item">
              <div className="summary-title">Total Refilled Gallons</div>
              <div className="summary-value">0</div>
            </div>
            <div className="summary-item">
              <div className="summary-title">Borrowed Gallons</div>
              <div className="summary-value">0</div>
            </div>
            <div className="time-date-container">
              <div className="time">00:00 NN</div>
              <div className="date">MM / DD / YYYY</div>
            </div>
          </div>
      </div>
      <div className="second-content">
        <div className="left-content">
          <div className="delivery">
            <h3 className="delivery-text">Delivery</h3>
            <div className="delivery-item-container">
              <div className="delivery-item">
                <img className="delivery-image" src={images.complete} alt=" Complete Image" />
                <div className="delivery-info">
                  <div className="delivery-title">Completed Delivery</div>
                  <div className="delivery-value">0</div>
                </div>
              </div>
              <div className="delivery-item">
                <img className="delivery-image" src={images.queue} alt=" Queue Image" />
                <div className="delivery-info">
                  <div className="delivery-title">Queue</div>
                  <div className="delivery-value">0</div>
                </div>
              </div>
              <div className="delivery-item">
                <img className="delivery-image" src={images.complete} alt=" Request Image" />
                <div className="delivery-info"> 
                  <div className="delivery-title">Requests</div>
                  <div className="delivery-value">0</div>
                </div>
              </div>
            </div>
            
          </div>
          <div className="graph-container">
            <p>REFILLED AND BORROWED GALLON PER MONTH</p>
          </div>
        </div>
        <div className="right-content">
          <div className="returned-gallon-container">
            <p>RETURNED GALLONS</p>
          </div>
        </div>
      </div>

    </div>

  );
};
