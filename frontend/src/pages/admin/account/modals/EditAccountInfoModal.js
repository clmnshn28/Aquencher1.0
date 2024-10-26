import React,{useState, useEffect} from "react";
import 'assets/css/modals';
import Modal from "components/Modal";
import ButtonGroup from "components/ButtonGroup";
import TextField from "components/TextField";
import axios from 'axios';
import {API_URL} from 'constants';


export const EditAccountInfoModal = ({isOpen, onClose, onConfirm , infoItems , title}) =>{

    // Initialize formData with infoItems
  const [formData, setFormData] = useState(infoItems || []);
  const [contactError, setContactError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [usernameError, setUsernameError] = useState('');

  useEffect(() => {
    // Update formData when infoItems changes
    setFormData(infoItems || []);
  }, [infoItems]);


    // Handle input changes
    const handleInputChange = (label, value) => {
      let newContactError = contactError;
      let newEmailError = emailError;
  
      if (label === 'Contact No.') {
          if (!/^\d+$/.test(value)) {
              newContactError = 'Contact number must be numeric';
          } else if (value.length !== 11) {
              newContactError = 'Contact number must be 11 digits';
          } else {
              newContactError = ''; // Reset error if valid
          }
      } 
  
      if (label === 'Email') {
          // Validate email format
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
              newEmailError = 'Please enter a valid email address';
          } else {
              newEmailError = ''; // Reset error if valid
          }
      }
      
  
      setContactError(newContactError);
      setEmailError(newEmailError);

      setFormData(prevData =>
        prevData.map(item =>
          item.label === label ? { ...item, value } : item
        )
      );
    };

    const handleCloseEdit = () =>{
      setContactError('');
      setEmailError('');
      setUsernameError('');
      onClose();
    }

    const handleSubmitEdit = async (e) =>{
      e.preventDefault();
      
      if (contactError || emailError) {
        return; 
      }
      
      // Get the current customer's email and username
      const currentEmail = infoItems.find(item => item.label === 'Email')?.value;
      const currentUsername = infoItems.find(item => item.label === 'Username')?.value;

      // Check for existing email and username
      const email = formData.find(item => item.label === 'Email')?.value;
      const username = formData.find(item => item.label === 'Username')?.value;

      try {
        if (title === 'Personal Information') {
          await axios.post(`${API_URL}/api/validate`, { 
            email, 
            username,
            currentEmail, // Add current user's email
            currentUsername // Add current user's username
            }, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}` 
              }
          });
        }
      
        // If no validation errors, proceed with confirmation
        onConfirm(formData);
      } catch (error) {
        if (error.response && error.response.status === 422) {
          const errors = error.response.data.errors;
          if (errors.email) {
              setEmailError(errors.email[0]);
          }
          if (errors.username) {
              setUsernameError(errors.username[0]);
          }
        } else {
            console.error('Error validating user:', error);
        }
      }
    };

    if(!isOpen) return null;

    return(
        <Modal>
            <form onSubmit={handleSubmitEdit}  className="EditAccountInfoModal__container">
                <h2>{title}</h2>
                <div className="EditAccountInfoModal__edit-section">
                    <div className="EditAccountInfoModal__textfield-container">
                        {formData.map((item, index) => (
                            <TextField
                                key={index}
                                label={`${item.label} :`}
                                id={item.label}
                                value={item.value}
                                onChange={(e) => handleInputChange(item.label, e.target.value)}
                                type={item.label === 'Email' ? 'email' : 'text'}
                                autoComplete='off'
                                isRequired={!(item.label === 'Municipality/City' || item.label === 'Province' || item.label === 'Postal Code')}
                                required={!(item.label === 'Municipality/City' || item.label === 'Province' || item.label === 'Postal Code')}
                                isInline={true}
                                readOnly={item.label === 'Municipality/City' || item.label === 'Province' || item.label === 'Postal Code'} 
                            />
                        ))}
                         {contactError && <span className="EditAccountInfoModal__contact-error">{contactError}</span>}
                         {emailError && <span className="EditAccountInfoModal__email-error">{emailError}</span>}
                         {usernameError && <span className="EditAccountInfoModal__username-error">{usernameError}</span>}
                    </div>
                </div>
                <ButtonGroup
                    onCancel={handleCloseEdit}
                    saveButtonColor='#0174CF'
                    saveText='Save Changes'
                /> 
            </form>
        </Modal>
    );
};