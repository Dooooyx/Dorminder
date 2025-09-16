import React, { useState } from 'react';

const PhoneNumberField = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  required = false,
  className = '',
  labelClassName = '',
  inputClassName = '',
  showLabel = true
}) => {
  const [displayValue, setDisplayValue] = useState(value);

  // Format phone number as user types
  const formatPhoneNumber = (input) => {
    // Remove all non-digit characters
    const phoneNumber = input.replace(/\D/g, '');
    
    // Limit to 11 digits (09XX-XXX-YYYY)
    const limitedNumber = phoneNumber.slice(0, 11);
    
    // Format: 09XX-XXX-YYYY
    if (limitedNumber.length <= 4) {
      return limitedNumber;
    } else if (limitedNumber.length <= 7) {
      return `${limitedNumber.slice(0, 4)}-${limitedNumber.slice(4)}`;
    } else {
      return `${limitedNumber.slice(0, 4)}-${limitedNumber.slice(4, 7)}-${limitedNumber.slice(7)}`;
    }
  };

  // Validate phone number format
  const validatePhoneNumber = (phoneNumber) => {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    return cleanNumber.length === 11 && cleanNumber.startsWith('09');
  };

  const handleChange = (e) => {
    const input = e.target.value;
    const formatted = formatPhoneNumber(input);
    
    setDisplayValue(formatted);
    
    // Call parent onChange with the raw number (without formatting)
    const rawNumber = formatted.replace(/\D/g, '');
    onChange({
      target: {
        value: rawNumber
      }
    });
  };

  const handleBlur = () => {
    // Validate on blur
    const isValid = validatePhoneNumber(displayValue);
    if (displayValue && !isValid) {
      // You can add error handling here if needed
    }
  };

  return (
    <div className={className}>
      {showLabel && label && (
        <label htmlFor={id} className={`block text-xl font-normal text-gray-800 ${labelClassName}`}>
          {label}:
        </label>
      )}
      <div className="relative">
        <input
          type="tel"
          id={id}
          className={`w-full px-4 py-3 text-xl font-normal bg-gray-100 border-0 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${inputClassName}`}
          placeholder={placeholder || "09XX-XXX-YYYY"}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          required={required}
          maxLength={13} // 09XX-XXX-YYYY = 13 characters including dashes
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </div>
      </div>
      
      {/* Format hint */}
      <div className="mt-1 text-sm text-gray-500">
        Format: 09XX-XXX-YYYY (11 digits)
      </div>
    </div>
  );
};

export default PhoneNumberField;
