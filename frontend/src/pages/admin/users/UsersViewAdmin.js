import 'assets/css/UsersViewAdmin.css';
import React, { useState } from 'react';
import {  useNavigate  } from 'react-router-dom';

import { defaultAvatar, backEditButton, totalTransaction, totalRefill, totalBorrow, totalReturn } from 'assets/images';

export const UsersViewAdmin = () =>{
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('all');

  const handleClickTab = (tab) =>{
    setActiveTab(tab);
  };

  return(
    <div>
      <div className="users-view-profile-header">
        <div className="users-view-item">
          <img className="users-view-image" src={totalTransaction} alt=" Complete Image" />
          <div className="users-view-info">
            <div className="users-view-title">Total Transactions</div>
            <div className="users-view-value">0</div>
          </div>
        </div>
        <div className="users-view-item">
          <img className="users-view-image" src={totalRefill} alt=" Queue Image" />
          <div className="users-view-info">
            <div className="users-view-title">Total Refilled Gallons</div>
            <div className="users-view-value">0</div>
          </div>
        </div>
        <div className="users-view-item">
          <img className="users-view-image" src={totalBorrow} alt=" Request Image" />
          <div className="users-view-info"> 
            <div className="users-view-title">Borrowed Gallons</div>
            <div className="users-view-value">0</div>
          </div>
        </div>
        <div className="users-view-item">
          <img className="users-view-image" src={totalReturn} alt=" Request Image" />
          <div className="users-view-info"> 
            <div className="users-view-title">Returned Gallons</div>
            <div className="users-view-value">0</div>
          </div>
        </div>
        <img className="user-back-btn-view" src={backEditButton} alt="Back Button" onClick={() => navigate(-1)}/>
      </div>

      <div className="users-view-profile-body">
        <p className='customer-view-header-text'>Customer Information</p>
        <div className='users-view-details-container'>
          <div className='users-view-left-container'>
            <div className='users-all-details-content'>
              <p className='users-view-info'>Customer ID</p>
              <p className='users-view-editable'>POS12345</p>

              <p className='users-view-info'>Username</p>
              <p className='users-view-editable'>karenjoyce22</p>

              <p className='users-view-info'>Address</p>
              <p className='users-view-editable'>123 Sampaguita St. Guinhawa, Malolos, Bulacan</p>

              <p className='users-view-info'>Contact</p>
              <p className='users-view-editable'>09083721891</p>

              <p className='users-view-info'>Registration Date</p>
              <p className='users-view-editable'>Sept 23, 2023</p>

              <div className='users-image-cons'>
                <img className='users-photo' src={defaultAvatar}/>
                <div class="user-indicator">
                  <span class="user-active-dot"></span>
                  <span class="user-active-name">Active</span>
                </div>
              </div>
            </div>
            <p className='customer-view-header-text activity'>Recent Activity</p>
            <div className='users-activity-details-content'>
                
            </div>
          </div>
          <div className='users-view-right-container'>
            <p className='customer-view-header-text transaction'>Transactions</p>
            <div className='transaction-tab-container'>
              <button 
              className={`transaction-tab ${activeTab === 'all' ? 'active' : ''}`}
              onClick={()=> handleClickTab('all')}
              >All</button>
              <button 
              className={`transaction-tab ${activeTab === 'refill' ? 'active' : ''}`}
              onClick={()=>handleClickTab('refill')}
              >Refill</button>
              <button 
              className={`transaction-tab ${activeTab === 'borrowed' ? 'active' : ''}`}
              onClick={()=> handleClickTab('borrowed')}
              >Borrowed</button>
              <button 
              className={`transaction-tab ${activeTab === 'return' ? 'active' : ''}`}
              onClick={()=> handleClickTab('return')}
              >Return</button>
            </div>
            <div className='users-transaction-details-content'>
              {/* {activeTab === 'all' && <AllTransactions />}
              {activeTab === 'refill' && <RefillTransactions />}
              {activeTab === 'borrowed' && <BorrowedTransactions />}
              {activeTab === 'return' && <ReturnTransactions />} */}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};