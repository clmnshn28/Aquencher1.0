import 'assets/css/admin';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const DeliveryTaskAdmin = () =>{

  const [tasks, setTasks] = useState([
    { date: '2024-07-02', time: '9:00 AM', customerName: 'Customer Name', transactionType: 'Transaction Type', gallonType: 'Gallon Type', quantity: 'Quantity', status: 'Completed' },
    { date: '2024-07-02', time: '9:00 AM', customerName: 'Customer Name', transactionType: 'Transaction Type', gallonType: 'Gallon Type', quantity: 'Quantity', status: 'Completed' },
    { date: '2024-07-02', time: '9:00 AM', customerName: 'Customer Name', transactionType: 'Transaction Type', gallonType: 'Gallon Type', quantity: 'Quantity', status: 'Completed' },
    { date: '2024-07-02', time: '9:00 AM', customerName: 'Customer Name', transactionType: 'Transaction Type', gallonType: 'Gallon Type', quantity: 'Quantity', status: 'Completed' },
    { date: '2024-07-02', time: '9:00 AM', customerName: 'Customer Name', transactionType: 'Transaction Type', gallonType: 'Gallon Type', quantity: 'Quantity', status: 'Complete' },
    { date: '2024-07-02', time: '9:00 AM', customerName: 'Customer Name', transactionType: 'Transaction Type', gallonType: 'Gallon Type', quantity: 'Quantity', status: 'Complete' },
    { date: '2024-07-02', time: '9:00 AM', customerName: 'Customer Name', transactionType: 'Transaction Type', gallonType: 'Gallon Type', quantity: 'Quantity', status: 'Complete' },
    { date: '2024-07-02', time: '9:00 AM', customerName: 'Customer Name', transactionType: 'Transaction Type', gallonType: 'Gallon Type', quantity: 'Quantity', status: 'Complete' },
]);

  return (

    <div>
      <div className="delivery-header">
        <h2 className="delivery-header-text">Task</h2>
        <Link to="/admin/delivery/task"  className='delivery-queue-link'>
          <p className="delivery-queue-text">Delivery Queue</p>
        </Link>
        <Link to="/admin/delivery/requests"  className='delivery-request-link'>
        <p className="delivery-request-text">Requests</p>
        </Link>
      </div>
      <div className="queue-container">
        <table className="queue-table">
          <thead className="queue-table-header">
            <tr>
              <th>Date/Time</th>
              <th>Customer Name</th>
              <th>Transaction Type</th>
              <th>Gallon Type</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr key={index}>
                <td className='queue-date-time'>
                  <div>{task.time}</div>
                  <div>{task.date}</div>
                </td>
                <td>{task.customerName}</td>
                <td>{task.transactionType}</td>
                <td>{task.gallonType}</td>
                <td>{task.quantity}</td>
                <td>
                  <div className={task.status === 'Completed' ? 'status-completed' : 'status-complete'}>
                    {task.status}
                  </div> 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  );
}
