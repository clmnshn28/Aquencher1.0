import React from "react";

export default function PasswordRequirements({newPassword}){

  const isPasswordRequirementMet = (requirement) => {
    switch (requirement) {
      case 'Be 8-100 characters long':
        return newPassword.length >= 8 && newPassword.length <= 100;
      case 'Contain at least one uppercase and one lowercase letter':
        return /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword);
      case 'Contain at least one number or special character':
        return /\d/.test(newPassword) || /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
      default:
        return false;
    }
  };

  const getRequirementIcon = (requirement) => {
    return isPasswordRequirementMet(requirement) ? <span className='check'>&#10004;</span> : <span className='wrong'>&#10005;</span>;
  };

  return(
    <>
      <p >Your password must include the following:</p>
      <ul>
        <li>{getRequirementIcon('Be 8-100 characters long')} Be 8-100 characters long</li>
        <li>{getRequirementIcon('Contain at least one uppercase and one lowercase letter')}Contain at least one uppercase and one lowercase letter</li>
        <li>{getRequirementIcon('Contain at least one number or special character')} Contain at least one number or special character</li>
      </ul>
    </>
  );
};