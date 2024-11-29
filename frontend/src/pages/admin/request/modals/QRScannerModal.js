import React, {useState} from 'react';
import Modal from 'components/Modal';
import QrReader from 'react-qr-scanner';

export const QRScannerModal = ({isOpen, onClose, onConfirm}) =>{
    const [error, setError] = useState(null);

    const handleScan = (data) => {
        if (data) {
            try {
                const parsedData = JSON.parse(data.text || data); 

                if (parsedData.ID && parsedData.Name && parsedData.Contact && parsedData.Address) {
                    setError(null); 
                    onConfirm(parsedData); // Trigger parent callback only for valid data
                } else {
                    setError('The QR code is missing required fields: Name, Contact, or Address.');
                }
            } catch (err) {
                setError('Invalid QR code format. Please ensure it is properly encoded.');
            }
        }
    };
    
    const handleError = (error) => {
        setError(error.message || 'An error occurred with the QR scanner.');
    };

    const handleBack = () =>{
        onClose();
        setError(null);
    }
      
    if(!isOpen) return null;

    return(
        <Modal>
            <div className="QRScannerModal__content">
                <button className="QRScannerModal__close" onClick={handleBack}>&times;</button>
                <h2>Scan QR Code</h2>
                <div className="QRScannerModal__scanner">
                    <QrReader
                        delay={500}
                        className="QRScannerModal__scanner-camera"
                        onError={handleError}
                        onScan={handleScan}
                    />
                    {error && (
                        <p className="QRScannerModal__error">
                            Error: {error.message || 'Something went wrong while scanning.'}
                        </p>
                    )}
                </div>
            </div>
        </Modal>
    );

};