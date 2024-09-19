import React, {useState} from "react";
import 'assets/css/modals';
import Modal from "components/Modal";
import ButtonGroup from "components/ButtonGroup";
import { Switch } from "components/Switch";
import { TimePicker } from "components/TimePicker";

import { MdAdd } from "react-icons/md";
import { LuTrash2 } from "react-icons/lu";

export const BusinessHoursModal = ({isOpen, onClose, onConfirm, businessHours, setBusinessHours}) =>{
 
    const [activeDropdown, setActiveDropdown] = useState(null);  // Track active dropdown


    // toggle open or closed
    const handleToggleOpen = (index) => {
        const newHours = [...businessHours];
        newHours[index].open = !newHours[index].open;   // Toggle the open/closed state
        if (newHours[index].open && newHours[index].timeSlots.length === 0) {  // if opening the day and no time slots exist, create a default time slot
            newHours[index].timeSlots.push({ start:{ hour: 12, minute: 0, period: 'AM' }, end: { hour: 12, minute: 0, period: 'PM' } });
        }
        setBusinessHours(newHours);
    };
    
    // add a time slot
    const handleAddTimeSlot = (dayIndex) => {
        const newHours = [...businessHours];
        newHours[dayIndex].timeSlots.push({ start:{ hour: 12, minute: 0, period: 'AM' }, end: { hour: 12, minute: 0, period: 'PM' } }); // Add a default time slot
        setBusinessHours(newHours);
    };

    // remove a time slot
    const handleRemoveTimeSlot = (dayIndex, slotIndex) => {
        const newHours = [...businessHours];
        newHours[dayIndex].timeSlots.splice(slotIndex, 1);
        setBusinessHours(newHours);
    };

    // Handles updating the time in the businessHours state for a specific day and time slot
    const handleTimeChange = (newTime, type, dayIndex, slotIndex) => {
        const updatedHours = [...businessHours];
        updatedHours[dayIndex].timeSlots[slotIndex][type] = newTime;
        setBusinessHours(updatedHours);
    };

    // Toggles the dropdown visibility for a specific day and time slot
    const toggleDropdown = (dayIndex, slotIndex) => {
        const dropdownKey = `${dayIndex}-${slotIndex}`;
        setActiveDropdown(activeDropdown === dropdownKey ? null : dropdownKey);
    };


    
    if(!isOpen) return null;

    return(
        <Modal>
            <div className="BusinessHoursModal__container">
                <h2>Business Hours</h2>
                <div className="BusinessHoursModal__edit-section">
                    <div className="BusinessHoursModal__hours-content">
                        {businessHours.map((day, dayIndex) => (
                            <div key={day.day} className="BusinessHoursModal__day">
                                <label className="BusinessHoursModal__label" >{day.day}</label>

                                {day.open && (
                                    <div className="BusinessHoursModal__time-section">
                                        {day.timeSlots.map((slot, slotIndex) => (                                   
                                            <div key={slotIndex} className="BusinessHoursModal__time-slot">
                                                <TimePicker
                                                    selectedTime={slot.start}
                                                    onChange={(newTime) => handleTimeChange(newTime, 'start', dayIndex, slotIndex)}
                                                    isOpen={activeDropdown === `${dayIndex}-${slotIndex}-start`}  // Control the dropdown state
                                                    toggleDropdown={() => toggleDropdown(dayIndex, `${slotIndex}-start`)}
                                                    format='12-hour'
                                                />

                                                <span className="time-line"/>

                                                <TimePicker
                                                    selectedTime={slot.end}
                                                    onChange={(newTime) => handleTimeChange(newTime, 'end', dayIndex, slotIndex)}
                                                    isOpen={activeDropdown === `${dayIndex}-${slotIndex}-end`}  // Control the dropdown state
                                                    toggleDropdown={() => toggleDropdown(dayIndex, `${slotIndex}-end`)}
                                                    format='12-hour'
                                                />

                                                {slotIndex > 0 ? (
                                                    <button
                                                        className="BusinessHoursModal__remove-slot"
                                                        onClick={() => handleRemoveTimeSlot(dayIndex, slotIndex)}
                                                    >
                                                        <LuTrash2 className="BusinessHoursModal__icon-delete" />
                                                    </button>
                                                ):(
                                                    <button 
                                                    className="BusinessHoursModal__add-slot" 
                                                    onClick={() => handleAddTimeSlot(dayIndex)}
                                                    style={{ display: day.timeSlots.length === 0 || day.timeSlots.length === slotIndex + 1 ? "flex" : "none" }}
                                                    >
                                                        <MdAdd className="BusinessHoursModal__icon-add" />
                                                    </button>
                                                )}
                                                
                                            </div>                            
                                        ))}
                                    </div>
                                )}
               
                                <div className="BusinessHoursModal__switch-section">
                                    <Switch
                                        checked={day.open}
                                        onChange={() => handleToggleOpen(dayIndex)}
                                    />
                                     <span
                                        style={{
                                            fontWeight: day.open ? '600' : '500',
                                            color: day.open ? '#2a2929' : '#ADAFB0',
                                        }}
                                    >
                                        {day.open ? "Open" : "Closed"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <ButtonGroup
                    onCancel={onClose}
                    onSave={onConfirm}
                    saveText='Save Changes'
                    saveButtonColor='#0174CF'
                />
            </div> 
        </Modal>
    );
};