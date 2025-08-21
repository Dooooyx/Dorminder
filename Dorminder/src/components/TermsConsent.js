// src/components/TermsConsent.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function TermsConsent({ agreed, onToggle, onOpenTerms, style }) {
  const handleToggle = () => {
    if (typeof onToggle === "function") {
      onToggle(!agreed);
    }
  };

  return (
    <View style={[styles.checkboxContainer, style]}>
      <TouchableOpacity
        onPress={handleToggle}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: agreed }}
        style={styles.checkboxTouch}
      >
        <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
          {agreed && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>

      <Text style={styles.checkboxText}>
        I agree to the {""}
        <Text style={styles.termsLink} onPress={onOpenTerms}>
          Terms & Privacy Policy
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
  },
  checkboxTouch: {
    marginRight: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#d1d5db',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4a6fa5',
    borderColor: '#4a6fa5',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkboxText: {
    fontSize: 14,
    color: '#6b7280',
    flex: 1,
  },
  termsLink: {
    color: '#4a6fa5',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});


