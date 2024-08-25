import React from "react";
import 'assets/css/customer';
import Modal from "components/Modal";
import * as images from 'assets/images';

export const ReturnModal = ({isOpen, onClose, onConfirm, gallonData, setSelectedGallonIndex}) => {

    const handleButtonClick = (index) => {
        setSelectedGallonIndex(index);
        onConfirm(); // Open the confirmation modal
    };

    if(!isOpen) return null;
  
    return(
        <Modal>
            <div className="ReturnModal__content">
                <button className="ReturnModal__close" onClick={onClose}>&times;</button>
                <div className="ReturnModal__header-container">
                    <img src={images.returnIconOpen} alt="Return Icon" />
                    <h2>Return</h2>  
                </div>
                <p className="ReturnModal__header-description">Submit a request for your gallons to be picked up for a refill.</p>

                <div className="ReturnModal__table-container">
                    <table className="ReturnModal__table">
                        <thead>
                            <tr>
                                <th>Gallons</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gallonData.map((row,index) =>(
                                <tr key={index}>
                                    <td className="ReturnModal__gallons-cell">
                                        <div className="ReturnModal__gallon-container">
                                            <div className="ReturnModal__gallon-item">
                                                <img src={images.returnSlim} alt="Blue Slim Gallon" />
                                                <span>{row.blueSlim}</span>
                                            </div>
                                            <div className="ReturnModal__gallon-item">
                                                <img src={images.returnRound} alt="Blue Round Gallon" />
                                                <span>{row.blueRound}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="ReturnModal__status-cell">
                                        <button
                                            className={`ReturnModal__status-button ${row.status.toLowerCase()}`}
                                            onClick={() => handleButtonClick(index)}
                                            disabled={row.status !== "Return"}
                                        >
                                            {row.status}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Modal>
    );
};