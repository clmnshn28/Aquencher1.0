import "assets/css/admin"
import React from 'react';
import { Doughnut, Line } from "react-chartjs-2";
import 'chart.js/auto';

import * as images from 'assets/images';
import { StockInfo } from "components/StockInfo";

export const DashboardAdmin = () => {

  const doughnutData = {
    labels: ['Slim Gallons', 'Round Gallons'],
    datasets: [
      {
        data: [50, 50], // changes in this part
        backgroundColor: ['#014377', '#1BABE9'],
        hoverBackgroundColor: ['#014377', '#1BABE9'],
      },
    ],
  };

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Refilled Gallons',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],// changes in this part
        fill: false,
        backgroundColor: '#0071CA',
        borderColor: '#0071CA',
      },
      {
        label: 'Borrowed Gallons',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,   0], // changes in this part
        fill: false,
        backgroundColor: '#A4D3FF',
        borderColor: '#A4D3FF',
      },
    ],
  };

  const lineOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // hide the legend
      },
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Number of Gallons',
          font: {
            weight: '600',
            family: 'poppins',
          },
          color: '#626262',
        },
        min: 0,
      },
    },
  }


  return (
    <>
      <div className="DashboardAdmin__first-content">
        <h2 className="DashboardAdmin__welcome">
          Welcome, <span style={{ fontWeight: 'bold' }}>Admin</span>
        </h2>
        <div className="DashboardAdmin__time-date">
          <h3 className="DashboardAdmin__time-text">10:46 AM</h3>
          <p className="DashboardAdmin__date-text">Feb 23, 2024</p>
        </div>
        <div className="DashboardAdmin__stock-info">
          <StockInfo
            image={images.returnSlim}
            title='Slim Gallons'
            availableStock={0}
            borrowableStock={0}
            borrowedQuantity={0}
          />
          <StockInfo
            image={images.returnRound}
            title='Round Gallons'
            availableStock={0}
            borrowableStock={0}
            borrowedQuantity={0}
          />
        </div>
      </div>
      <div className="DashboardAdmin__second-content">
        <div className="DashboardAdmin__returned-section">
          <h3 className="DashboardAdmin__header-chart">RETURNED GALLONS</h3>
          <div className="chart-container">
            <Doughnut
              data={doughnutData} 
              options={{
                plugins: {
                  legend: {
                    display: false, // hide the legend
                  },
                },
              }}
            />
          </div>
          <div className="DashboardAdmin__returned-legend">
            <p><span className="DashboardAdmin__legend-dot slim"></span> Slim Gallons</p>
            <p><span className="DashboardAdmin__legend-dot round"></span> Round Gallons</p>
          </div>
        </div>
        
        <div className="DashboardAdmin__refill-borrow-section">
          <h3  className="DashboardAdmin__header-chart">REFILLED AND BORROWED GALLONS PER MONTH</h3>
          <div className="chart-container-small">
            <Line 
              data={lineData} 
              options={lineOptions}
            />
          </div>   
          <div className="DashboardAdmin__refill-borrow-legend">
            <p><span className="DashboardAdmin__refill-borrow-legend-dot refill"></span> Refilled Gallons</p>
            <p><span className="DashboardAdmin__refill-borrow-legend-dot borrow"></span> Borrowed Gallons</p>
          </div>
        </div>
      </div>

    </>
  );
};
