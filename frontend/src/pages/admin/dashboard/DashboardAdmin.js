import "assets/css/admin"
import React, { useState, useEffect , useRef} from 'react';
import { Doughnut, Line } from "react-chartjs-2";
import 'chart.js/auto';
import axios from 'axios';
import {API_URL} from 'constants';
import * as images from 'assets/images';
import { StockInfo } from "components/StockInfo";

export const DashboardAdmin = () => {

  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const initialFetchDone = useRef(false);
  
  useEffect(() => {
    if (!initialFetchDone.current) {
      fetchProducts();
      fetchDashboardData();
      initialFetchDone.current = true;
    }
    updateTimeAndDate();
    const intervalId = setInterval(updateTimeAndDate, 1000); // update every second

    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, []);

  const updateTimeAndDate = () => {
    const now = new Date();
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };

    setCurrentTime(now.toLocaleTimeString('en-US', timeOptions));
    setCurrentDate(now.toLocaleDateString('en-US', dateOptions));
  };

  const [availableStock, setAvailableStock] = useState({ slim: 0, round: 0 });
  const [borrowedQuantity, setBorrowedQuantity] = useState({ slim: 0, round: 0 });
  const [doughnutData, setDoughnutData] = useState({
    labels: ['Slim Gallons', 'Round Gallons'],
    datasets: [{ data: [0, 0], backgroundColor: ['#014377', '#1BABE9'], hoverBackgroundColor: ['#014377', '#1BABE9'] }],
  });
  const [lineData, setLineData] = useState({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      { label: 'Refilled Gallons', data: Array(12).fill(0), fill: false, backgroundColor: '#0071CA', borderColor: '#0071CA' },
      { label: 'Borrowed Gallons', data: Array(12).fill(0), fill: false, backgroundColor: '#A4D3FF', borderColor: '#A4D3FF' },
    ],
  });


  const fetchProducts = async () =>{
      try{
          const response = await axios.get(API_URL +'/api/admin/products', {
              headers: {
              'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}` 
              }
          });

          const products = response.data.data;
          const blueSlim = products.find(product => product.id === 1);
          const roundGallon = products.find(product => product.id === 2);


          setAvailableStock({
            slim: blueSlim ? blueSlim.available_stock : 0,
            round: roundGallon ? roundGallon.available_stock : 0 
          });
    
          setBorrowedQuantity({
            slim: blueSlim ? blueSlim.borrowed : 0, 
            round: roundGallon ? roundGallon.borrowed : 0
          });
          
      }catch(error){
          console.error('Error fetching users', error);
      }
  }; 

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(API_URL + '/api/admin/dashboard-data', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}` }
      });
      const { returnedGallons, refilledGallons, borrowedGallons } = response.data.data;
      
      // Update doughnut chart data
      setDoughnutData(prevState => ({
        ...prevState,
        datasets: [{
          ...prevState.datasets[0],
          data: [
            returnedGallons.find(item => item.type === 'Slim')?.total || 0,
            returnedGallons.find(item => item.type === 'Round')?.total || 0
          ]
        }]
      }));

      // Update line chart data
      setLineData(prevState => ({
        ...prevState,
        datasets: [
          {
            ...prevState.datasets[0],
            data: prevState.labels.map((_, index) => 
              refilledGallons.find(item => item.month === index + 1)?.total || 0
            )
          },
          {
            ...prevState.datasets[1],
            data: prevState.labels.map((_, index) => 
              borrowedGallons.find(item => item.month === index + 1)?.total || 0
            )
          }
        ]
      }));
    } catch(error) {
      console.error('Error fetching dashboard data', error);
    }
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
          <h3 className="DashboardAdmin__time-text">{currentTime}</h3>
          <p className="DashboardAdmin__date-text">{currentDate}</p>
        </div>
        <div className="DashboardAdmin__stock-info">
          <StockInfo
            image={images.returnSlim}
            title='Slim Gallons'
            availableStock={availableStock.slim}
            borrowedQuantity={borrowedQuantity.slim}
          />
          <StockInfo
            image={images.returnRound}
            title='Round Gallons'
            availableStock={availableStock.round}
            borrowedQuantity={borrowedQuantity.round}
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
