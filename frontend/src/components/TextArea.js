import React from "react";
import 'assets/css/components';

export default function TextArea ({onChange, value, label, id, isRequired, placeholder, height}){
  return(
    <>
      <div className={`TextField__container `}>
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
            style={{ height: height || '100px'}} 
        />
      </div>
    </>
  );
};