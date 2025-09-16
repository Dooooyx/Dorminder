import React from 'react';

const PasswordStrengthIndicator = ({ password, showRequirements = false }) => {
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let score = 0;
    const requirements = {
      length: password.length >= 12,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    };

    // Calculate score
    Object.values(requirements).forEach(met => {
      if (met) score++;
    });

    // Determine strength level
    if (score < 3) return { strength: 1, label: 'Weak', color: 'bg-red-500' };
    if (score < 4) return { strength: 2, label: 'Fair', color: 'bg-yellow-500' };
    if (score < 5) return { strength: 3, label: 'Good', color: 'bg-blue-500' };
    return { strength: 4, label: 'Strong', color: 'bg-green-500' };
  };

  const { strength, label, color } = getPasswordStrength(password);
  const isWeak = strength <= 2;

  return (
    <div className="mt-2">
      {/* Password Strength Bar */}
      <div className="flex space-x-1 mb-2">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded ${
              level <= strength 
                ? color 
                : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Strength Label */}
      <div className="flex items-center justify-between text-sm">
        <span className={`font-medium ${
          strength <= 2 ? 'text-red-600' : 
          strength === 3 ? 'text-blue-600' : 
          'text-green-600'
        }`}>
          {label}
        </span>
        {isWeak && (
          <span className="text-red-500 text-xs">
            Password too weak
          </span>
        )}
      </div>

      {/* Requirements List */}
      {showRequirements && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Password Requirements:
          </p>
          <ul className="space-y-1 text-sm">
            <li className={`flex items-center ${
              password.length >= 12 ? 'text-green-600' : 'text-red-500'
            }`}>
              <span className="mr-2">
                {password.length >= 12 ? '✓' : '✗'}
              </span>
              At least 12 characters
            </li>
            <li className={`flex items-center ${
              /[a-z]/.test(password) ? 'text-green-600' : 'text-red-500'
            }`}>
              <span className="mr-2">
                {/[a-z]/.test(password) ? '✓' : '✗'}
              </span>
              One lowercase letter
            </li>
            <li className={`flex items-center ${
              /[A-Z]/.test(password) ? 'text-green-600' : 'text-red-500'
            }`}>
              <span className="mr-2">
                {/[A-Z]/.test(password) ? '✓' : '✗'}
              </span>
              One uppercase letter
            </li>
            <li className={`flex items-center ${
              /\d/.test(password) ? 'text-green-600' : 'text-red-500'
            }`}>
              <span className="mr-2">
                {/\d/.test(password) ? '✓' : '✗'}
              </span>
              One number
            </li>
            <li className={`flex items-center ${
              /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'text-green-600' : 'text-red-500'
            }`}>
              <span className="mr-2">
                {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? '✓' : '✗'}
              </span>
              One special character
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
