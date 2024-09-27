import React from 'react';
import 'assets/css/customer';

export const GallonInfo = ({ image, label, value }) => {
    return (
        <div className="Dashboard__gallon-content">
            <img
                className="Dashboard__gallon-image"
                src={image}
                alt={`${label} Icon`}
            />
            <div className="Dashboard__gallon-info">
                <p>{label}</p>
                <p>{value}</p>
            </div>
        </div>
    );
};
