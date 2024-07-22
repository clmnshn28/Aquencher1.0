

export default function NewUserTextField ({onChange, value, label, isRequired, type}){
  return(
    <>
      <label className='newUser-label'>{label} 
        {isRequired ? <span className="required-field" > * </span> : ''}
      :
      </label> 
      <input className='newUser-input'
        type={type} 
        value={value} 
        onChange={onChange} 
        required= {isRequired}
        />
    </>
  );
};