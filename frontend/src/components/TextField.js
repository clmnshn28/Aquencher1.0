import React from "react";
import 'assets/css/components';

export default function TextField ({label, id, isRequired, isInline, ...otherProps }){
  return(
    <div className={`TextField__container ${isInline ? 'TextField__inline' : ''}`}>
      <label className='TextField__label' htmlFor={id}>
        {label}
        {isRequired ? <span className="TextField__required-field" > * </span> : ''}
      :
      </label> 
        <input
          className="TextField__input"
          id={id}
          {...otherProps}
        />
    </div>
  );
};