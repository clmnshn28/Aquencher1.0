import React,{useState, useEffect} from "react";
import 'assets/css/modals';
import Modal from "components/Modal";
import ButtonGroup from "components/ButtonGroup";
import TextField from "components/TextField";



export const EditAccountInfoModal = ({isOpen, onClose, onConfirm , infoItems , title}) =>{

    // Initialize formData with infoItems
  const [formData, setFormData] = useState(infoItems || []);
  const [contactError, setContactError] = useState('');
  const [emailError, setEmailError] = useState('');
  
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
      onClose();
    }

    const handleSubmitEdit = (e) =>{
      e.preventDefault();
      
      if (contactError || emailError) {
        return; 
      }
      
      onConfirm(formData);
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