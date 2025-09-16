import React, { useState } from 'react';

const TermsModal = ({ isOpen, onClose, isAgreed = false, onAccept, onDecline }) => {
  const [isChecked, setIsChecked] = useState(isAgreed);

  const handleAccept = () => {
    if (onAccept) {
      onAccept(isChecked);
    }
    onClose();
  };

  const handleDecline = () => {
    if (onDecline) {
      onDecline();
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0"
        style={{ backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      ></div>
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-gray-800">Terms & Conditions</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">1. Introduction</h3>
                <p className="text-gray-600 leading-relaxed">
                  Welcome to Dorminder, a dormitory management platform. By creating an account, you agree to be bound by these Terms and Conditions.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">2. Eligibility</h3>
                <p className="text-gray-600 leading-relaxed">
                  To register as a landlord, you must be:
                </p>
                <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                  <li>Legal owner or authorized representative of the property</li>
                  <li>At least 18 years of age</li>
                  <li>Legally capable of entering into contracts</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">3. Landlord Obligations</h3>
                <p className="text-gray-600 leading-relaxed">
                  As a registered landlord, you agree to:
                </p>
                <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                  <li>Provide accurate and complete property information</li>
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Keep property listings current and up-to-date</li>
                  <li>Treat tenants fairly and professionally</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">4. Property Listings</h3>
                <p className="text-gray-600 leading-relaxed">
                  Property listings must include truthful descriptions, accurate photos, and complete rental details. Dorminder reserves the right to review, edit, or remove inappropriate listings. Landlords are responsible for the accuracy of their listings.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">5. Payments and Fees</h3>
                <p className="text-gray-600 leading-relaxed">
                  Dorminder may charge service fees, subscription fees, or commissions for platform usage. All fees will be clearly disclosed before any charges are made.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">6. Tenant Interactions</h3>
                <p className="text-gray-600 leading-relaxed">
                  Rental agreements are between landlord and tenant. Dorminder is not responsible for unpaid rent, property damages, or disputes between landlords and tenants.
                </p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">7. Prohibited Conduct</h3>
                <p className="text-gray-600 leading-relaxed">
                  Landlords must not:
                </p>
                <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
                  <li>Post false or misleading information</li>
                  <li>Use Dorminder for non-dormitory management purposes</li>
                  <li>Engage in harassment, abuse, or discrimination</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">8. Liability Disclaimer</h3>
                <p className="text-gray-600 leading-relaxed">
                  Dorminder is a platform provider and does not guarantee tenant performance, payments, or occupancy. We are not liable for financial losses, damages, or disputes arising from rental agreements.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">9. Data and Privacy</h3>
                <p className="text-gray-600 leading-relaxed">
                  Landlord and tenant information is processed according to Dorminder's Privacy Policy. Landlords must use tenant data only for legitimate rental purposes.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">10. Account Termination</h3>
                <p className="text-gray-600 leading-relaxed">
                  Dorminder may suspend or terminate accounts for violations of these terms. Landlords may close their accounts if no disputes or obligations remain.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">11. Amendments</h3>
                <p className="text-gray-600 leading-relaxed">
                  Dorminder reserves the right to revise these terms. Continued use of the platform implies acceptance of updated terms.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">12. Governing Law</h3>
                <p className="text-gray-600 leading-relaxed">
                  These terms are governed by the laws of the Republic of the Philippines.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 font-medium">
                  By registering as a landlord on Dorminder, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.
                </p>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center mb-6">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                />
                <span className="text-gray-700">
                  I have read, understood, and agree to the <span className="text-blue-600 underline cursor-pointer">Terms & Conditions</span>
                </span>
              </label>
            </div>

            <div className="flex justify-center items-center space-x-4">
              <button 
                onClick={handleAccept}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!isChecked}
              >
                Accept & Continue
              </button>
              <span className="text-gray-500 font-medium">OR</span>
              <button 
                onClick={handleDecline}
                className="px-8 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
