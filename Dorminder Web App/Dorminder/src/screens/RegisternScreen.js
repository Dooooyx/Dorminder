// src/screens/RegisterScreen.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, Image, Modal } from "react-native";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";
import TermsConsent from "../components/TermsConsent";

export default function RegisterScreen({ navigation }) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isTermsVisible, setTermsVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  // Password strength validation
  const validatePassword = (pwd) => {
    const errors = [];
    
    if (pwd.length < 12) {
      errors.push("Minimum 12 characters");
    }
    if (!/[A-Z]/.test(pwd)) {
      errors.push("At least 1 uppercase letter");
    }
    if (!/[a-z]/.test(pwd)) {
      errors.push("At least 1 lowercase letter");
    }
    if (!/\d/.test(pwd)) {
      errors.push("At least 1 number");
    }
    if (!/[!@#$%]/.test(pwd)) {
      errors.push("At least 1 special character (! @ # $ %)");
    }
    
    return errors;
  };

  const getPasswordStrength = (pwd) => {
    const errors = validatePassword(pwd);
    if (errors.length === 0) return { strength: "Strong", color: "#10B981" };
    if (errors.length <= 2) return { strength: "Medium", color: "#F59E0B" };
    return { strength: "Weak", color: "#EF4444" };
  };

  const checkPasswordRequirement = (pwd, requirement) => {
    switch (requirement) {
      case 'length':
        return pwd.length >= 12;
      case 'uppercase':
        return /[A-Z]/.test(pwd);
      case 'lowercase':
        return /[a-z]/.test(pwd);
      case 'number':
        return /\d/.test(pwd);
      case 'special':
        return /[!@#$%]/.test(pwd);
      default:
        return false;
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setPasswordError("");
    
    // Show requirements popup when user starts typing
    if (text.length > 0 && !showPasswordRequirements) {
      setShowPasswordRequirements(true);
    }
    
    // Clear confirm password error when password changes
    if (confirmPassword && text !== confirmPassword) {
      setConfirmPasswordError("Passwords don't match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    
    if (password && text !== password) {
      setConfirmPasswordError("Passwords don't match");
    } else {
      setConfirmPasswordError("");
    }
  };

  const showToast = (message) => {
    Alert.alert("Password Error", message);
  };

  const handleRegister = () => {
    // Validate password
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      showToast(`Password requirements not met:\n• ${passwordErrors.join('\n• ')}`);
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      showToast("Passwords don't match. Please make sure both passwords are identical.");
      return;
    }

    if (!agreedToTerms) {
      Alert.alert("Error", "Please agree to the Terms & Privacy Policy");
      return;
    }
    Alert.alert("Register", "Landlord registration functionality would go here!");
  };

  const passwordErrors = validatePassword(password);
  const passwordStrength = getPasswordStrength(password);

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Logo */}
        <Image
          source={require("../assets/logo/logo_dorminder.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Title */}
        <Text style={styles.title}>Register Now!</Text>
        
        {/* Note */}
        <Text style={styles.note}>
          Note: Registration is for <Text style={styles.noteHighlight}>landlords</Text> only.
        </Text>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>First Name:</Text>
          <InputField placeholder="First Name" />

          <Text style={styles.label}>Last Name:</Text>
          <InputField placeholder="Last Name" />

          <Text style={styles.label}>Middle Initial (Optional):</Text>
          <InputField placeholder="Middle Initial" />

          <Text style={styles.label}>Email Address:</Text>
          <InputField placeholder="Email Address" />

          <Text style={styles.label}>Password:</Text>

          <InputField 
            placeholder="Password" 
            secureTextEntry 
            showPasswordToggle 
            value={password}
            onChangeText={handlePasswordChange}
          />
          
          {/* Password Requirements Popup */}
          {showPasswordRequirements && (
            <View style={styles.requirementsPopup}>
              <Text style={styles.requirementsTitle}>Password Requirements:</Text>
              <View style={styles.requirementItem}>
                <Text style={[
                  styles.requirementIcon,
                  { color: checkPasswordRequirement(password, 'length') ? '#10B981' : '#EF4444' }
                ]}>
                  {checkPasswordRequirement(password, 'length') ? '✓' : '✗'}
                </Text>
                <Text style={styles.requirementText}>Minimum 12 characters</Text>
              </View>
              <View style={styles.requirementItem}>
                <Text style={[
                  styles.requirementIcon,
                  { color: checkPasswordRequirement(password, 'uppercase') ? '#10B981' : '#EF4444' }
                ]}>
                  {checkPasswordRequirement(password, 'uppercase') ? '✓' : '✗'}
                </Text>
                <Text style={styles.requirementText}>At least 1 uppercase letter</Text>
              </View>
              <View style={styles.requirementItem}>
                <Text style={[
                  styles.requirementIcon,
                  { color: checkPasswordRequirement(password, 'lowercase') ? '#10B981' : '#EF4444' }
                ]}>
                  {checkPasswordRequirement(password, 'lowercase') ? '✓' : '✗'}
                </Text>
                <Text style={styles.requirementText}>At least 1 lowercase letter</Text>
              </View>
              <View style={styles.requirementItem}>
                <Text style={[
                  styles.requirementIcon,
                  { color: checkPasswordRequirement(password, 'number') ? '#10B981' : '#EF4444' }
                ]}>
                  {checkPasswordRequirement(password, 'number') ? '✓' : '✗'}
                </Text>
                <Text style={styles.requirementText}>At least 1 number</Text>
              </View>
              <View style={styles.requirementItem}>
                <Text style={[
                  styles.requirementIcon,
                  { color: checkPasswordRequirement(password, 'special') ? '#10B981' : '#EF4444' }
                ]}>
                  {checkPasswordRequirement(password, 'special') ? '✓' : '✗'}
                </Text>
                <Text style={styles.requirementText}>At least 1 special character (! @ # $ %)</Text>
              </View>
            </View>
          )}

          {/* Password Strength Indicator */}
          {password.length > 0 && (
            <View style={styles.strengthContainer}>
              <Text style={styles.strengthLabel}>Password Strength:</Text>
              <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                {passwordStrength.strength}
              </Text>
            </View>
          )}

          <Text style={styles.label}>Confirm Password:</Text>
          <InputField 
            placeholder="Confirm Password" 
            secureTextEntry 
            showPasswordToggle 
            value={confirmPassword}
            onChangeText={handleConfirmPasswordChange}
          />
          
          {/* Confirm Password Error */}
          {confirmPasswordError ? (
            <Text style={styles.errorText}>{confirmPasswordError}</Text>
          ) : null}

          <Text style={styles.label}>Phone Number:</Text>
          <InputField placeholder="Phone Number" keyboardType="phone-pad" />

          <Text style={styles.label}>Boarding House/Dorm Name:</Text>
          <InputField placeholder="Boarding House/Dorm Name" />

          <Text style={styles.label}>Boarding House Address:</Text>
          <InputField placeholder="Boarding House Address" />
        </View>

        {/* Terms and Privacy Policy Checkbox */}
        <TermsConsent
          agreed={agreedToTerms}
          onToggle={setAgreedToTerms}
          onOpenTerms={() => setTermsVisible(true)}
          style={{ width: '100%' }}
        />

        {/* Register Button */}
        <CustomButton 
          title="REGISTER" 
          onPress={handleRegister} 
          bgColor="#e85a4f"
          style={styles.registerButton}
        />

        {/* Login Link */}
        <View style={styles.loginLinkContainer}>
          <Text style={styles.loginText}>Already have an Account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.loginLink}>Log In</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Terms Modal */}
      <Modal
        visible={isTermsVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setTermsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Terms & Privacy Policy</Text>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalText}>
                1. Introduction{'\n\n'}
                Welcome to Dorminder, a dormitory management platform designed to help landlords manage their properties efficiently. By creating an account and listing your property, you agree to be bound by these Terms and Conditions ("Terms").{'\n\n'}
                ⸻{'\n\n'}
                2. Eligibility{'\n'}
                • Only legal owners, administrators, or authorized representatives of dormitories may register as landlords.{"\n"}
                • You must be at least 18 years old and legally capable of entering into a contract.{"\n\n"}
                ⸻{"\n\n"}
                3. Landlord Obligations{"\n\n"}
                As a registered landlord, you agree to:{"\n"}
                1. Provide accurate and updated information about your property.{"\n"}
                2. Comply with local housing, health, and safety regulations.{"\n"}
                3. Keep property listings (pricing, availability, and rules) current.{"\n"}
                4. Treat tenants fairly, without discrimination or abuse.{"\n\n"}
                ⸻{"\n\n"}
                4. Property Listings{"\n"}
                • Listings must include truthful descriptions, photos, and rental details.{"\n"}
                • Dorminder reserves the right to review, edit, or remove listings that are false, misleading, or inappropriate.{"\n"}
                • Landlords are fully responsible for the accuracy of their listings.{"\n\n"}
                ⸻{"\n\n"}
                5. Payments and Fees{"\n"}
                • Dorminder may charge service fees, subscriptions, or commissions for platform use.{"\n"}
                • All fees will be disclosed before application.{"\n"}
                • Landlords are responsible for paying any applicable taxes on rental income.{"\n\n"}
                ⸻{"\n\n"}
                6. Tenant Interactions{"\n"}
                • Rental agreements are strictly between Landlord and Tenant unless Dorminder provides a dedicated payment feature.{"\n"}
                • Dorminder is not responsible for unpaid rent, damages, or tenant disputes.{"\n\n"}
                ⸻{"\n\n"}
                7. Prohibited Conduct{"\n\n"}
                Landlords may not:{"\n"}
                • Post false or fraudulent property information.{"\n"}
                • Use Dorminder for purposes other than dormitory management.{"\n"}
                • Engage in harassment, abuse, or discrimination against tenants or other users.{"\n\n"}
                ⸻{"\n\n"}
                8. Liability Disclaimer{"\n"}
                • Dorminder acts only as a platform provider and does not guarantee tenant performance, payments, or occupancy.{"\n"}
                • Dorminder is not liable for financial losses, damages, or disputes.{"\n\n"}
                ⸻{"\n\n"}
                9. Data and Privacy{"\n"}
                • Landlord and tenant information will be processed according to Dorminder's Privacy Policy.{"\n"}
                • Landlords must use tenant data only for rental-related purposes.{"\n\n"}
                ⸻{"\n\n"}
                10. Account Termination{"\n"}
                • Dorminder may suspend or terminate accounts for violations of these Terms.{"\n"}
                • Landlords may close their accounts at any time, provided no disputes or obligations remain.{"\n\n"}
                ⸻{"\n\n"}
                11. Amendments{"\n\n"}
                Dorminder reserves the right to revise these Terms at any time. Continued use of the platform constitutes acceptance of the updated Terms.{"\n\n"}
                ⸻{"\n\n"}
                12. Governing Law{"\n\n"}
                These Terms are governed by the laws of the Republic of the Philippines.{"\n\n"}
                ⸻{"\n\n"}
                By registering as a landlord on Dorminder, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.modalCloseButton} onPress={() => setTermsVisible(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#f8f9fa',
    padding: 24,
    paddingTop: 48,
  },
  logo: {
    width: 200,
    height: 60,
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4a6fa5',
    marginBottom: 8,
    alignSelf: 'flex-start',
    width: '100%',
  },
  note: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 16,
    alignSelf: 'flex-start',
    width: '100%',
  },
  noteHighlight: {
    fontWeight: 'bold',
    color: '#6b7280',
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 16,
  },
  passwordHint: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  requirementsPopup: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  requirementIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    width: 20,
  },
  requirementText: {
    fontSize: 12,
    color: '#6b7280',
    flex: 1,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  strengthLabel: {
    fontSize: 14,
    color: '#374151',
    marginRight: 8,
  },
  strengthText: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    marginBottom: 8,
  },
  registerButton: {
    width: '100%',
    marginBottom: 24,
  },
  loginLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  loginLink: {
    fontSize: 14,
    color: '#e85a4f',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  modalBody: {
    marginBottom: 16,
  },
  modalText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  modalCloseButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#4a6fa5',
    borderRadius: 6,
  },
  modalCloseText: {
    color: 'white',
    fontWeight: '600',
  },
});