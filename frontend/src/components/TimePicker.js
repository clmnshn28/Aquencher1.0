import React, {useState, useEffect, useRef} from "react";
import 'assets/css/components';
import { MdKeyboardArrowDown } from "react-icons/md";


export const TimePicker = ({selectedTime, onChange, isOpen, toggleDropdown, format, className }) =>{
   
    const [selectedHour, setSelectedHour] = useState(selectedTime.hour || 0);
    const [selectedMinute, setSelectedMinute] = useState(selectedTime.minute || 0);
    const [selectedSecond, setSelectedSecond] = useState(selectedTime.second || 0);
    const [selectedPeriod, setSelectedPeriod] = useState(selectedTime.period || 'AM');
    const timePickerRef = useRef(null); 
 
    useEffect (() =>{
        const handleClickOutside = (e) =>{
            if(timePickerRef.current && !timePickerRef.current.contains(e.target)){
                toggleDropdown(false);
            }
        };

        if(isOpen){
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () =>{
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [isOpen, toggleDropdown])

    const handleTimeChange = (type, value) => {
        if (type === 'hour') {
            setSelectedHour(value);
            onChange({ ...selectedTime, hour: value });
        }
        if (type === 'minute') {
            setSelectedMinute(value);
            onChange({ ...selectedTime, minute: value });
        }
        if (type === 'second') {
            setSelectedSecond(value);
            onChange({ ...selectedTime, second: value });
        }
        if (type === 'period') {
            setSelectedPeriod(value);
            onChange({ ...selectedTime, period: value });
        }
    };

    return(
        <div className="TimePicker__section" ref={timePickerRef}>
            <button 
            className="TimePicker__start-time"
            onClick={toggleDropdown}
            >
                {format === '12-hour'
                    ? `${selectedHour < 10 ? '0' : ''}${selectedHour}:${selectedMinute < 10 ? '0' : ''}${selectedMinute} ${selectedPeriod}`
                    : `${selectedMinute < 10 ? '0' : ''}${selectedMinute}:${selectedSecond < 10 ? '0' : ''}${selectedSecond} m`
                }
                <MdKeyboardArrowDown className="TimePicker__custom-icon" />
            </button>

            {/* Dropdown for selecting time */}
            {isOpen && (
                <div className={`TimePicker__dropdown ${className}`}>

                    {/* Scrollable Hours (only for 12-hour format) */}
                    {format === '12-hour' && (
                        <div className="TimePicker__scroll-column">
                            <div className="TimePicker__label">Hour</div>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
                                <div
                                    key={hour}
                                    className={`TimePicker__scroll-item ${selectedHour === hour ? 'TimePicker__active' : ''}`}
                                    onClick={() => handleTimeChange('hour', hour)}
                                >
                                    {hour < 10 ? '0' + hour : hour}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Scrollable Minutes */}
                    <div className="TimePicker__scroll-column">
                        <div className="TimePicker__label">Minute</div>
                        {Array.from({ length: 60 }, (_, i) => i).map(minute => (
                            <div
                                key={minute}
                                className={`TimePicker__scroll-item ${selectedMinute === minute ? 'TimePicker__active' : ''}`}
                                onClick={() => handleTimeChange('minute', minute)}
                            >
                                {minute < 10 ? '0' + minute : minute}
                            </div>
                        ))}
                    </div>

                    {/* Scrollable Seconds (only for minute:second format) */}
                    {format === 'minute-second' && (
                        <div className="TimePicker__scroll-column">
                            <div className="TimePicker__label">Second</div>
                            {Array.from({ length: 60 }, (_, i) => i).map(second => (
                                <div
                                    key={second}
                                    className={`TimePicker__scroll-item ${selectedSecond === second ? 'TimePicker__active' : ''}`}
                                    onClick={() => handleTimeChange('second', second)}
                                >
                                    {second < 10 ? '0' + second : second}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Scrollable AM/PM (only for 12-hour format) */}
                    {format === '12-hour' && (
                        <div className="TimePicker__scroll-column-period">
                            <div className="TimePicker__label">Period</div>
                            {['AM', 'PM'].map(period => (
                                <div
                                    key={period}
                                    className={`TimePicker__scroll-item ${selectedPeriod === period ? 'TimePicker__active' : ''}`}
                                    onClick={() => handleTimeChange('period', period)}
                                >
                                    {period}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}   
        </div>
    );
};