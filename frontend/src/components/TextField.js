import React from "react";
import 'assets/css/components';

export default function TextField ({onChange, value, label, id, isRequired, type, isReadOnly, isDisabled, isInline, autoComplete }){
  return(
    <div className={`TextField__container ${isInline ? 'TextField__inline' : ''}`}>
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
          readOnly={isReadOnly}
          disabled={isDisabled}
          autoComplete={autoComplete}
        />
    </div>
  );
};