import React,{useState, useEffect} from "react";
import { BiSolidMessage } from "react-icons/bi";
import { IoImagesSharp, IoArrowBackCircle } from "react-icons/io5";
import 'assets/css/modals';
import axios from 'axios';
import {API_URL} from 'constants';

import Modal from "components/Modal";
import TextField from "components/TextField";
import CustomDropdown from "components/CustomDropdown";
import TextArea from "components/TextArea";

export const NewConcernModal = ({isOpen, onClose, onConfirm}) =>{

    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

    useEffect(() => {
        const updateIsMobile = () => {
            setIsMobile(window.innerWidth <= 767);
        };
        
        window.addEventListener("resize", updateIsMobile);
        return () => window.removeEventListener("resize", updateIsMobile);
    }, []);

    const options = [
        { value: 'Refill', title: 'Refill'},
        { value: 'Borrow', title: 'Borrow'},
        { value: 'Return', title: 'Return'},
    ];
    const [type, setType] = useState('');
    const [subject, setSubject] = useState('');
    const [summary, setSummary] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [imageFiles, setImageFiles] = useState([]); 
    const [imageError, setImageError] = useState('');

    const handleCancelShare = () => {
        setSubject('');
        setType('');
        setSummary('');
        setIsExpanded(false);
        setImageFiles([]);
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!type) {
            alert("Please select a type for your concern."); // You can replace this with a more elegant solution if needed
            return;
        }

        const formData = new FormData();
        formData.append('subject', subject);
        formData.append('concern_type', type);
        formData.append('content', summary);

        // Append images to the FormData
        imageFiles.forEach((image) => {
            formData.append('images[]', image.file); 
        });

        try{
            await axios.post(API_URL + '/api/customer/concern',formData,{
            headers: {
              'Authorization' : `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'multipart/form-data',
            },
        });

        onConfirm();
        handleCancelShare();
        }catch(error){
            console.error('Error fetching concerns:', error.response ? error.response.data : error.message);
        }
    };

    const handleDropdownChange = (selectedValue) => {
        setType(selectedValue);
        setIsExpanded(true); 
    };
  
    
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const validImages = [];
        const errors = []; 

        files.forEach((file) => {
            // Check if file size exceeds 2048 KB (2 MB)
            if (file.size > 2048 * 1024) {
                errors.push(`${file.name} must not be exceed 2048 kilobytes(2 MB).`);
            } else {
                validImages.push({
                    file,
                    name: file.name,
                    size: (file.size / 1024).toFixed(2) + ' KB'
                });
            }
        });

        setImageFiles((prevImages) => [...prevImages, ...validImages]); 
        setImageError(errors); 
};


    if(!isOpen) return null;

    const content = (
        <div className="NewConcernModal__container">
            {isMobile ? (
                <IoArrowBackCircle className="NewConcernAdmin__back-icon" onClick={handleCancelShare} />
            ) : (
                <button className="NewConcernModal__close" onClick={handleCancelShare}>&times;</button>
            )}
            <h2 className="NewConcernModal__header">Share Your Concerns</h2>
            <form onSubmit={handleSubmit} className="NewConcernModal__form-container" >  
                <div className="NewConcernModal__form-group">
                    <div className="NewConcernModal__title">
                        <TextField  
                            id='subject' 
                            name='subject' 
                            value={subject} 
                            onChange={(e) => setSubject(e.target.value)}
                            type='text'
                            placeholder='Subject'
                            required
                            autoComplete='off'
                            style={{height: '35px',border: '1px solid #d2d2d2'}}
                        /> 
                        <div
                            style={{ width: isMobile ? '100%' : isExpanded ? '40%' : '100%' }}
                            className="NewConcernModal__drop-div"
                        >
                            <CustomDropdown
                                value={type} 
                                onChange={handleDropdownChange}
                                options={options}
                                defaultText = 'Select the type for your concern'
                            />    
                        </div>
                    </div> 
                    <div className="NewConcernModal__summary">
                        <TextArea 
                            id='summary' 
                            name='summary' 
                            value={summary} 
                            onChange={(e) => setSummary(e.target.value)}
                            type='text'
                            placeholder='Write your concern here...'
                            required
                            style={{ height: '100px', border: 'none'}}
                        /> 
                        <div className="NewConcernModal__image-container">
                            {imageFiles.map((imageData, index) => (
                                <div key={index} className="NewConcernModal__image-file">
                                    <span>{imageData.name} ({imageData.size})</span>
                                    <button type="button" onClick={() => {
                                        setImageFiles(imageFiles.filter((_, i) => i !== index)); // Remove image from list
                                    }}>
                                        &times;
                                    </button>
                                </div>
                            ))}
                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                                id="file-input"
                                multiple // Allow multiple files to be selected
                            />
                            {imageError && <span className="NewConcernModal__image-error">{imageError}</span>}
                        </div>
                    </div>
                    <div className="NewConcern__reply-actions">
                        <button type='submit' className="NewConcern__send-button">
                            <BiSolidMessage className="NewConcern__share-icon" />
                            Send
                        </button>
                        <label htmlFor="file-input" className="NewConcernModal__add-image-btn">
                            <IoImagesSharp className="NewConcernModal__add-image-icon" />
                        </label>
                    </div>
                </div>
            </form>   
        </div>
    );
    return isMobile ? (
        <div className="NewConcernModal__not-modal">
            {content}
        </div>
    ) : (
        <Modal>
            {content}
        </Modal>
    );
};