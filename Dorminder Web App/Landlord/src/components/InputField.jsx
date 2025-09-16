import React from 'react';

const InputField = ({ 
  id, 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  required = false,
  className = '',
  labelClassName = '',
  inputClassName = '',
  showLabel = true
}) => {
  return (
    <div className={className}>
      {showLabel && label && (
        <label htmlFor={id} className={`block text-xl font-normal text-gray-800 ${labelClassName}`}>
          {label}:
        </label>
      )}
      <input
        type={type}
        id={id}
        className={`w-full px-4 py-3 text-xl font-normal bg-gray-100 border-0 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${inputClassName}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default InputField;
