import React, {useState, useEffect} from "react";
import 'assets/css/customer';
import Modal from "components/Modal";
import * as images from 'assets/images';

export const ReturnModal = ({isOpen, onClose, onConfirm, gallonData}) => {

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

    useEffect(() => {
        const updateIsMobile = () => {
            setIsMobile(window.innerWidth <= 767);
        };

        window.addEventListener("resize", updateIsMobile);
        return () => window.removeEventListener("resize", updateIsMobile);
    }, []);

    const handleButtonClick = (index) => {
        console.log('Selected Gallon Index:', index);
        onConfirm(index); // Open the confirmation modal
    };
    
    if(!isOpen) return null;
  
    const content = (
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
                                        disabled={row.status.toLowerCase() !== "return"}
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
    );

    return isMobile ?(
        <div className="ReturnModal__mobile">
            {content}
        </div>
    ):(
        <Modal>
            {content}
        </Modal>
    );
};