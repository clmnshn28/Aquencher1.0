import React from "react";

export default function UserPasswordField({label, type, value, onChange, isRequired, error}){

  return(
    <div className="reset-input-container">
      <label className="reset-label-pass">{label}</label>
      <input 
      className="reset-input-pass" 
      type={type}
      value={value} 
      onChange={onChange}
      required= {isRequired}
      />
       {error && <span className="editUser-error">{error}</span>}
    </div>
  );

};