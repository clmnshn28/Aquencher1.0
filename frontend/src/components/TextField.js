import React from "react";

export default function TextField ({onChange, value, label, id, isRequired, type}){
  return(
    <>
      <label className='newUser-label' htmlFor={id}>{label} 
        {isRequired ? <span className="required-field" > * </span> : ''}
      :
      </label> 
      <input className='newUser-input'
        type={type} 
        id={id} 
        name={id}
        value={value} 
        onChange={onChange} 
        required= {isRequired}
        />
    </>
  );
};