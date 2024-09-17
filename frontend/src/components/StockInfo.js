import React from "react";
import 'assets/css/components';

export const StockInfo = ({image, title, availableStock, borrowableStock, borrowedQuantity}) =>{
    return(
        <div className="DashboardAdmin__stock-column">
            <div className="DashboardAdmin__stock-item">
                <img 
                    src={image} 
                    alt="Gallon" 
                    className="DashboardAdmin__stock-icon"
                />
                <h4 className="DashboardAdmin__stock-title">{title}</h4>
                <p className="DashboardAdmin__stock-label">Total Available Stock</p>
                <p className="DashboardAdmin__stock-value">{availableStock}</p>
            </div>
            <div className="DashboardAdmin__stock-item">
                <p className="DashboardAdmin__stock-label">Borrowable Stock</p>
                <p className="DashboardAdmin__stock-value">{borrowableStock}</p>
                <p className="DashboardAdmin__stock-label">Borrowed Quantity</p>
                <p className="DashboardAdmin__stock-value">{borrowedQuantity}</p>
            </div>
      </div>
    );
};