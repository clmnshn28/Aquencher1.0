import React from "react";
import 'assets/css/components';

export default function TextArea ({label, id, isRequired, ...otherProps }){
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
            {...otherProps} 
        />
      </div>
    </>
  );
};