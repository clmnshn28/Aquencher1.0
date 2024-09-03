import React from "react";


export default function ButtonGroup ({onSave, onCancel}){

  return(
    <div className="ButtonGroup__container">
      <button type="button" className="ButtonGroup__pass-cancel" onClick={onCancel} >Cancel</button>
      <button type="submit" className="ButtonGroup__pass-save" onClick={onSave}>Save</button>
    </div>
  );
}