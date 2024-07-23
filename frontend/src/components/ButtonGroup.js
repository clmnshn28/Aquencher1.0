import React from "react";


export default function ButtonGroup ({onSave, onCancel}){

  return(
    <div className="reset-button-container">
      <button type="button" className="reset-button-pass cancel" onClick={onCancel} >Cancel</button>
      <button type="submit" className="reset-button-pass save" onClick={onSave}>Save</button>
    </div>
  );
}