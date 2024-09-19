import React from "react";
import 'assets/css/components';


export const Switch = ({checked, onChange}) =>{
    return(
        <>
            <label className="Switch__content">
                <input type="checkbox" checked={checked} onChange={onChange} />
                <span className="Switch__slider"></span>
            </label>  
        </>
    );
};