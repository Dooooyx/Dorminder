// Phone number utilities for Philippine format

// Format phone number for display (+63 XXX XXX XXX)
export const formatPhoneForDisplay = (phoneNumber) => {
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

// Format local number (09XX-XXX-YYYY)
const formatLocalNumber = (number) => {
  const cleanNumber = number.replace(/\D/g, '');
  
  if (cleanNumber.length <= 4) {
    return cleanNumber;
  } else if (cleanNumber.length <= 7) {
    return `${cleanNumber.slice(0, 4)}-${cleanNumber.slice(4)}`;
  } else if (cleanNumber.length <= 11) {
    return `${cleanNumber.slice(0, 4)}-${cleanNumber.slice(4, 7)}-${cleanNumber.slice(7)}`;
  } else {
    return `${cleanNumber.slice(0, 4)}-${cleanNumber.slice(4, 7)}-${cleanNumber.slice(7, 11)}`;
  }
};

// Convert display format to +63 format for storage
export const formatPhoneForStorage = (input) => {
  if (!input) return '';
  
  // Remove all non-digit characters
  const cleanNumber = input.replace(/\D/g, '');
  
  // If it's already in +63 format, return as is
  if (input.startsWith('+63')) {
    return input;
  }
  
  // If it's a local number (starts with 09), convert to +63 format
  if (cleanNumber.startsWith('09') && cleanNumber.length === 11) {
    return '+63' + cleanNumber.slice(1); // Remove 0 and add +63
  }
  
  // If it's 63 format (without +), add the +
  if (cleanNumber.startsWith('63') && cleanNumber.length === 12) {
    return '+' + cleanNumber;
  }
  
  // If it's a valid local number, convert to +63
  if (cleanNumber.length === 11 && cleanNumber.startsWith('09')) {
    return '+63' + cleanNumber.slice(1);
  }
  
  return input; // Return as is if format is unclear
};

// Validate Philippine phone number
export const validatePhilippinePhone = (phoneNumber) => {
  if (!phoneNumber) return false;
  
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  // Check if it's a valid Philippine mobile number
  // +63XXXXXXXXX (12 digits) or 09XXXXXXXXX (11 digits)
  return (
    (phoneNumber.startsWith('+63') && cleanNumber.length === 12) ||
    (cleanNumber.startsWith('09') && cleanNumber.length === 11) ||
    (cleanNumber.startsWith('63') && cleanNumber.length === 12)
  );
};

// Format phone number as user types (for input fields)
export const formatPhoneAsUserTypes = (input) => {
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
