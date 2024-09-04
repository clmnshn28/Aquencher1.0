import React from "react";
import 'assets/css/admin';

export default function TextField ({onChange, value, label, id, isRequired, type, }){
  return(
    <>
      <label className='TextField__label' htmlFor={id}>{label} 
        {isRequired ? <span className="TextField__required-field" > * </span> : ''}
      :
      </label> 
        <input
          className="TextField__input"
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          required={isRequired}
        />
    </>
  );
};