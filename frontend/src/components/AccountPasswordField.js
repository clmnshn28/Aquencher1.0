
import React from 'react';

export default function AccountPasswordField({label, type, value, onChange, isRequired, id, error}){

  return(
    <div className="form-group">
      <label className="change-pass-text"  htmlFor={id}>{label}</label>
      <input 
        type={type}
        id={id} 
        name={id}
        className="change-pass-input"
        value={value}
        onChange={onChange}
        required= {isRequired}
      />
       {error && <span className="changePass-error">{error}</span>}
    </div>
  );
};