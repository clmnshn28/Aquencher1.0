import React, {useState, useEffect} from "react";
import 'assets/css/modals';

import * as images from 'assets/images';
import Modal from "components/Modal";
import ButtonGroup from "components/ButtonGroup";


export const EditProfileModal = ({isOpen, onClose, onConfirm, defaultAvatar }) =>{
    
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 767);

    useEffect(() => {
        const updateIsMobile = () => {
            setIsMobile(window.innerWidth <= 767);
        };
        
        window.addEventListener("resize", updateIsMobile);
        return () => window.removeEventListener("resize", updateIsMobile);
    }, []);
    
    const [avatar, setAvatar] = useState({ file: null, preview: null });
    const [imageError, setImageError] = useState('');


    // for uploading image
    const handleFileChange = (e) => {
    const file = e.target.files[0];
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    // Check if file exists
    if (file) {
        // Validate file type
        if (!validTypes.includes(file.type)) {
            setImageError('Please upload a valid image file (PNG, JPG, JPEG)');
            setAvatar({ file: null, preview: null });
            return;
        }

        // Validate file size (limit to 2MB)
        if (file.size > 2048 * 1024) {
            setImageError(`${file.name} must not exceed 2048 kilobytes (2 MB).`);
            setAvatar({ file: null, preview: null });
            return;
        }

        // Clear error and update the file object for submission
        setImageError('');
        const reader = new FileReader();
        reader.onloadend = () => {
            setAvatar({
                file: file, // The File object
                preview: reader.result // Data URL for preview
            });
        };
        reader.readAsDataURL(file); // Read the file as a data URL
        } else {
        setImageError('Please select a file.');
        }
    };

    const closeProfilePicModal = () => {
        setAvatar({ file: null, preview: defaultAvatar }); 
        onClose(); 
        setImageError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(avatar.file);
        setImageError('');
    }

    if(!isOpen) return null;

    const content =(
        <div className="EditAccountInfoModal__container">
            <h2>Edit Profile Picture</h2>
            <div className="EditAccountInfoModal__edit-section">
                <div className="EditProfileModal__avatar-wrapper">
                    <img 
                        className='EditProfileModal__avatar-preview' 
                        src={avatar.preview || defaultAvatar  } 
                        alt="Avatar Preview" 
                    />
                    <label htmlFor="file-upload" className='EditProfileModal__upload-label'>
                        <img className='EditProfileModal__upload-photo-icon' src={images.uploadPhoto} alt="upload Photo" />
                        Upload Photo
                    </label>
                    <input id="file-upload" type="file" accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange} style={{ display: 'none' }} />
                    {imageError && <span className="EditProfileModal__image-error">{imageError}</span>}
                </div>
            </div>
            <ButtonGroup
                onCancel={closeProfilePicModal}
                onSave={handleSubmit}
                saveButtonColor='#0174CF'
                saveText='Save Changes'
            />
        </div>
    );

    return isMobile ? (
        <div>
            {content}
        </div>
    ) : (
        <Modal>
            {content}
        </Modal>
    );
};