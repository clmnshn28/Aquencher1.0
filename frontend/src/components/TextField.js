import React from "react";
import 'assets/css/admin';

export default function TextField ({onChange, value, label, id, isRequired, type, placeholder, isTextArea=false}){
  return(
    <>
      <label className='TextField__label' htmlFor={id}>{label} 
        {isRequired ? <span className="TextField__required-field" > * </span> : ''}
      :
      </label> 
      {isTextArea ? (
        <textarea
          className="TextField__textarea"
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          required={isRequired}
          placeholder={placeholder}
        />
      ) : (
        <input
          className="TextField__input"
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          required={isRequired}
        />
      )}
    </>
  );
};