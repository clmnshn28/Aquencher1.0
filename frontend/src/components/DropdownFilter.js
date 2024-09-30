import React from "react";
import 'assets/css/components';
import { MdOutlineArrowDropDown, MdArrowDropUp } from "react-icons/md";


export default function DropdownFilter({label, isOpen, toggleDropdown, options, onOptionSelect, classExpand }){

    return(
        <div className="DropdownFilter__dropdown">
            <button className="DropdownFilter__filter-button"
            onClick={toggleDropdown}
            >
                {label.toUpperCase()}
                {isOpen ? (
                    <MdArrowDropUp className="DropdownFilter__dropdown-icon" />
                ) : (
                    <MdOutlineArrowDropDown className="DropdownFilter__dropdown-icon" />
                )}
            </button>
            {isOpen && (
            <div className={`DropdownFilter__dropdown-content ${classExpand}`}>
                {options.map((option,index)=>(
                    <button 
                    key={index} 
                    onClick={() => onOptionSelect(option.value)}>
                        {option.label}
                    </button>
                ))}
            </div>
            )}
        </div>
    );
};