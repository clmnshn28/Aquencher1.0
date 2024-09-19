import React,{useState, useEffect} from "react";
import 'assets/css/modals';
import Modal from "components/Modal";
import ButtonGroup from "components/ButtonGroup";
import TextField from "components/TextField";



export const EditAccountInfoModal = ({isOpen, onClose, onConfirm , infoItems , title}) =>{

    // Initialize formData with infoItems
  const [formData, setFormData] = useState(infoItems || []);

  useEffect(() => {
    // Update formData when infoItems changes
    setFormData(infoItems || []);
  }, [infoItems]);


    // Handle input changes
    const handleInputChange = (label, value) => {
        setFormData(prevData =>
          prevData.map(item =>
            item.label === label ? { ...item, value } : item
          )
        );
      };

    if(!isOpen) return null;

    return(
        <Modal>
            <form onSubmit={(e) => { e.preventDefault(); onConfirm(formData); }}  className="EditAccountInfoModal__container">
                <h2>{title}</h2>
                <div className="EditAccountInfoModal__edit-section">
                    <div className="EditAccountInfoModal__textfield-container">
                        {formData.map((item, index) => (
                            <TextField
                                key={index}
                                label={item.label}
                                id={item.label}
                                value={item.value}
                                onChange={(e) => handleInputChange(item.label, e.target.value)}
                                type="text"
                                autocomplete='off'
                                isRequired
                                required
                                isInline={true}
                                readOnly={item.label === 'Municipality/City' || item.label === 'Province' || item.label === 'Postal Code'} 
                            />
                        ))}
                    </div>
                </div>
                <ButtonGroup
                    onCancel={onClose}
                    saveButtonColor='#0174CF'
                    saveText='Save Changes'
                /> 
            </form>
        </Modal>
    );
};