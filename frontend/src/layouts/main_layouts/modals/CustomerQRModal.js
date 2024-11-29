import React from "react";
import 'assets/css/customer';
import Modal from "components/Modal";
import { IoArrowBack } from "react-icons/io5";
import { MdOutlineFileDownload } from "react-icons/md";
import axios from 'axios';
import {API_URL} from 'constants';
import * as images from 'assets/images';

export const CustomerQRModal = ({isOpen, onClose, userDetails}) =>{


    const handleDownload = async () => {
        const downloadUrl = `${API_URL}/api/download-qr/${userDetails.qr_code}`;

        try {
          
            const response = await axios.get(downloadUrl, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
                    'Accept': 'application/octet-stream',  
                },
                responseType: 'blob', 
            });

            // Create a URL for the blob (binary data)
            const blob = response.data;
            const blobUrl = URL.createObjectURL(blob);

            // Create a temporary link to trigger the download
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `${userDetails.fname}${userDetails.lname}_QR_Code`; 
            link.click();

            // Clean up the object URL after download
            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Error downloading QR code:', error);
        }
    };

    if(!isOpen) return null;

    return(
        <Modal>
            <div className="CustomerQRModal__qr-content">
                <div className="CustomerQRModal__qr-header">
                    <IoArrowBack className="CustomerQRModal__qr-back" onClick={onClose}/>
                    <span>My QR Code</span>
                </div>
                <div className="CustomerQRModal__qr-code-container">
                    <div className="CustomerQRModal__qr-code-name">
                        <img  
                            className="AccountSettingsAdmin__acc-image" 
                            src={userDetails.image ? `${API_URL}/storage/images/${userDetails.image}` : images.defaultAvatar} 
                            alt="QR Code"
                        />
                        <p>{`${userDetails.fname} ${userDetails.lname}`}</p>
                    </div>
                    <img 
                        className="AccountSettingsAdmin__qr-image" 
                        src={`${API_URL}/storage/qrcodes/${userDetails.qr_code}`} 
                        alt="QR Code" 
                    />
                    <button className="CustomerQRModal__download-btn"  onClick={handleDownload} >
                        <MdOutlineFileDownload className="CustomerQRModal__download-icon" />
                        Download QR Code
                    </button>
                </div>
            </div>
        </Modal>
    );

};