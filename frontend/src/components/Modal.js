import React from 'react';

export default function Modal({children}){
 return(
  <div className="modal-overlay">
    {children}
  </div>
 );
};