import React from 'react';

const PasswordValidationPopup = ({ isOpen, onClose, password }) => {
  if (!isOpen) return null;

  const requirements = {
    length: password.length >= 12,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  };

  const metRequirements = Object.values(requirements).filter(Boolean).length;
  const isValid = metRequirements >= 4 && requirements.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-40"
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-md w-full mx-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Password Requirements
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Password Strength Indicator */}
        <div className="mb-4">
          <div className="flex space-x-1 mb-2">
            {[1, 2, 3, 4].map((level) => {
              let color = 'bg-gray-200';
              if (level <= metRequirements) {
                if (metRequirements < 3) color = 'bg-red-500';
                else if (metRequirements < 4) color = 'bg-yellow-500';
                else if (metRequirements < 5) color = 'bg-blue-500';
                else color = 'bg-green-500';
              }
              return (
                <div
                  key={level}
                  className={`h-2 flex-1 rounded ${color}`}
                />
              );
            })}
          </div>
          <div className="text-center">
            <span className={`text-sm font-medium ${
              metRequirements < 3 ? 'text-red-600' : 
              metRequirements < 4 ? 'text-yellow-600' : 
              metRequirements < 5 ? 'text-blue-600' : 
              'text-green-600'
            }`}>
              {metRequirements < 3 ? 'Weak' : 
               metRequirements < 4 ? 'Fair' : 
               metRequirements < 5 ? 'Good' : 
               'Strong'}
            </span>
          </div>
        </div>

        {/* Requirements List */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Your password must include:
          </p>
          
          <div className="space-y-2">
            <div className={`flex items-center ${
              requirements.length ? 'text-green-600' : 'text-red-500'
            }`}>
              <span className="mr-3 text-lg">
                {requirements.length ? '✓' : '✗'}
              </span>
              <span className="text-sm">At least 12 characters</span>
            </div>
            
            <div className={`flex items-center ${
              requirements.lowercase ? 'text-green-600' : 'text-red-500'
            }`}>
              <span className="mr-3 text-lg">
                {requirements.lowercase ? '✓' : '✗'}
              </span>
              <span className="text-sm">One lowercase letter (a-z)</span>
            </div>
            
            <div className={`flex items-center ${
              requirements.uppercase ? 'text-green-600' : 'text-red-500'
            }`}>
              <span className="mr-3 text-lg">
                {requirements.uppercase ? '✓' : '✗'}
              </span>
              <span className="text-sm">One uppercase letter (A-Z)</span>
            </div>
            
            <div className={`flex items-center ${
              requirements.number ? 'text-green-600' : 'text-red-500'
            }`}>
              <span className="mr-3 text-lg">
                {requirements.number ? '✓' : '✗'}
              </span>
              <span className="text-sm">One number (0-9)</span>
            </div>
            
            <div className={`flex items-center ${
              requirements.special ? 'text-green-600' : 'text-red-500'
            }`}>
              <span className="mr-3 text-lg">
                {requirements.special ? '✓' : '✗'}
              </span>
              <span className="text-sm">One special character (!@#$%^&*)</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isValid 
                ? 'bg-green-600 text-white hover:bg-green-700' 
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
            disabled={!isValid}
          >
            {isValid ? 'Password is Valid' : 'Complete Requirements'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordValidationPopup;
