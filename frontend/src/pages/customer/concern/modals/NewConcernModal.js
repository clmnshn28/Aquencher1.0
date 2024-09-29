import React,{useState, useEffect} from "react";
import { BiSolidMessage } from "react-icons/bi";
import { IoImagesSharp, IoArrowBackCircle } from "react-icons/io5";
import 'assets/css/modals';

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
        { value: 'refill', title: 'Refill'},
        { value: 'borrow', title: 'Borrow'},
        { value: 'return', title: 'Return'},
    ];
    const [type, setType] = useState('');
    const [subject, setSubject] = useState('');
    const [summary, setSummary] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [imageFiles, setImageFiles] = useState([]); 

    const handleCancelShare = () => {
        setSubject('');
        setType('');
        setSummary('');
        setIsExpanded(false);
        setImageFiles([]);
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!type) {
            alert("Please select a type for your concern."); // You can replace this with a more elegant solution if needed
            return; // Prevent form submission
        }
        const imageUrls = imageFiles.map(image => image.url);
        onConfirm({ subject, type, summary, image: imageUrls });
        setSubject('');
        setType('');
        setSummary('');
        setIsExpanded(false);
        setImageFiles([]);
    };

    const handleDropdownChange = (selectedValue) => {
        setType(selectedValue);
        setIsExpanded(true); 
    };
  
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const validImages = files.map(file => ({
            url: URL.createObjectURL(file),
            name: file.name,
            size: (file.size / 1024).toFixed(2) + ' KB'
        }));
    
        setImageFiles(prevImages => [...prevImages, ...validImages]); // Add valid images
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