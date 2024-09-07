import React, { useState } from 'react';
import 'assets/css/components'; 

export default function CustomDropdown ({ value, onChange, options, defaultText }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (option) => {
        onChange(option.value);
        setIsOpen(false);
    };

    return (
        <div className="CustomDropdown">
            <button className="CustomDropdown__button" onClick={() => setIsOpen(!isOpen)}>
                {options.find(opt => opt.value === value)?.title || defaultText}
            </button>
            {isOpen && (
                <div className="CustomDropdown__menu">
                    {options.map((option) => (
                        <div
                        key={option.value}
                        className="CustomDropdown__item"
                        onClick={() => handleSelect(option)}
                        >
                            <div className="CustomDropdown__item-title">{option.title}</div>
                            <div className="CustomDropdown__item-description">{option.description}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};