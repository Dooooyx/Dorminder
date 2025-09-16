import React, { useState } from 'react';
import showIcon from '../assets/icons/ic_show.png';
import hideIcon from '../assets/icons/ic_hide.png';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

const PasswordField = ({ 
  id, 
  label, 
  placeholder, 
  value, 
  onChange, 
  required = false,
  className = '',
  labelClassName = '',
  inputClassName = '',
  showLabel = true,
  showStrengthIndicator = false
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={className}>
      {showLabel && label && (
        <label htmlFor={id} className={`block text-xl font-normal text-gray-800 ${labelClassName}`}>
          {label}:
        </label>
      )}
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id={id}
          className={`w-full px-4 py-3 pr-12 text-xl font-normal bg-gray-100 border-0 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${inputClassName}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-200 rounded transition-colors"
          onClick={() => setShowPassword(!showPassword)}
        >
          <img 
            src={showPassword ? hideIcon : showIcon} 
            alt={showPassword ? 'Hide password' : 'Show password'}
            className="w-5 h-5"
          />
        </button>
      </div>
      
      {/* Password Strength Indicator */}
      {showStrengthIndicator && (
        <PasswordStrengthIndicator 
          password={value} 
          showRequirements={value.length > 0}
        />
      )}
    </div>
  );
};

export default PasswordField;
