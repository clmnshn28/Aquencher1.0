import React from "react";
import 'assets/css/components';

export default function TextArea ({onChange, value, label, id, isRequired, placeholder}){
  return(
    <>
        <label className='TextField__label' htmlFor={id}>{label} 
        {isRequired ? <span className="TextField__required-field" > * </span> : ''}
        :
        </label> 
        <textarea
            className="TextField__textarea"
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            required={isRequired}
            placeholder={placeholder}
        />
    </>
  );
};