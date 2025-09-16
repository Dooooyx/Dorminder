import React from 'react';

const CheckboxField = ({ 
  id, 
  checked, 
  onChange, 
  children,
  className = '',
  checkboxClassName = '',
  labelClassName = ''
}) => {
  return (
    <div className={`flex items-start space-x-3 ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className={`mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 ${checkboxClassName}`}
      />
      <label htmlFor={id} className={`text-sm text-gray-600 leading-relaxed ${labelClassName}`}>
        {children}
      </label>
    </div>
  );
};

export default CheckboxField;
