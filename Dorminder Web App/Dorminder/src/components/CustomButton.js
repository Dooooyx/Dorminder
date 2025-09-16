// src/components/CustomButton.js
import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function CustomButton({ title, onPress, bgColor = "#3b82f6", disabled = false }) {
  return (
    <TouchableOpacity
      onPress={disabled ? null : onPress}
      style={[
        styles.button, 
        { backgroundColor: disabled ? "#9CA3AF" : bgColor },
        disabled && styles.disabledButton
      ]}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, disabled && styles.disabledText]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  disabledText: {
    opacity: 0.8,
  },
});
