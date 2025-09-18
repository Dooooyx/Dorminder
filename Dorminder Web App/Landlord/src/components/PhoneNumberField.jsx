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
  // Format phone number as user types
  const formatPhoneNumber = (input) => {
    // If input starts with +63, keep it and format the rest
    if (input.startsWith('+63')) {
      const digits = input.slice(3).replace(/\D/g, ''); // Get digits after +63
      const limitedDigits = digits.slice(0, 10); // Limit to 10 digits after +63
      
      // Format the digits with spaces: +63 9XXX XXX XXX
      if (limitedDigits.length <= 3) {
        return `+63 ${limitedDigits}`;
      } else if (limitedDigits.length <= 6) {
        return `+63 ${limitedDigits.slice(0, 3)} ${limitedDigits.slice(3)}`;
      } else {
        return `+63 ${limitedDigits.slice(0, 3)} ${limitedDigits.slice(3, 6)} ${limitedDigits.slice(6)}`;
      }
    } else {
      // If user types without +63, add it
      const digits = input.replace(/\D/g, '');
      const limitedDigits = digits.slice(0, 10);
      
      if (limitedDigits.length <= 3) {
        return `+63 ${limitedDigits}`;
      } else if (limitedDigits.length <= 6) {
        return `+63 ${limitedDigits.slice(0, 3)} ${limitedDigits.slice(3)}`;
      } else {
        return `+63 ${limitedDigits.slice(0, 3)} ${limitedDigits.slice(3, 6)} ${limitedDigits.slice(6)}`;
      }
    }
  };

  // Convert +63 format to display format
  const convertToDisplayFormat = (phoneNumber) => {
    if (!phoneNumber) return '+63 ';
    
    // If it's in +63XXXXXXXXX format, convert to +63 XXX XXX XXX
    if (phoneNumber.startsWith('+63') && phoneNumber.length === 13) {
      const digits = phoneNumber.slice(3);
      return `+63 ${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    }
    
    // If it's already in the new format, return as is
    if (phoneNumber.startsWith('+63 ')) {
      return phoneNumber;
    }
    
    // Default to +63 prefix
    return '+63 ';
  };

  const [displayValue, setDisplayValue] = useState(convertToDisplayFormat(value));

  // Validate phone number format
  const validatePhoneNumber = (phoneNumber) => {
    const cleanNumber = phoneNumber.replace(/\D/g, '');
    return cleanNumber.length === 12 && cleanNumber.startsWith('63');
  };

  const handleChange = (e) => {
    const input = e.target.value;
    const formatted = formatPhoneNumber(input);
    
    setDisplayValue(formatted);
    
    // Convert to +63XXXXXXXXX format for storage
    const rawNumber = formatted.replace(/\D/g, '');
    let phoneNumberForStorage = rawNumber;
    
    // Ensure it's in +63XXXXXXXXX format
    if (rawNumber.startsWith('63') && rawNumber.length === 12) {
      phoneNumberForStorage = '+' + rawNumber;
    } else if (rawNumber.length === 10) {
      phoneNumberForStorage = '+63' + rawNumber;
    }
    
    onChange({
      target: {
        value: phoneNumberForStorage
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
          placeholder={placeholder || "+63 9XX XXX XXXX"}
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          required={required}
          maxLength={17} // +63 XXX XXX XXX = 17 characters including spaces
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        </div>
      </div>
      
      {/* Format hint */}
      <div className="mt-1 text-sm text-gray-500">
        Format: +63 9XX XXX XXXX
      </div>
    </div>
  );
};

export default PhoneNumberField;
