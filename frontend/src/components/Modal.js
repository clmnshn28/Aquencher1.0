import React from 'react';
import'assets/css/components';

export default function Modal({children}){
 return(
  <div className="Modal__overlay">
    {children}
  </div>
 );
};