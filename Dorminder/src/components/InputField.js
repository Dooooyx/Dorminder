// src/components/InputField.js
import React, { useState } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from "react-native";

export default function InputField({ 
  placeholder, 
  secureTextEntry = false, 
  showPasswordToggle = false,
  ...textInputProps 
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        style={styles.input}
        {...textInputProps}
      />
      {showPasswordToggle && secureTextEntry && (
        <TouchableOpacity
          style={styles.passwordToggle}
          onPress={togglePasswordVisibility}
        >
          <Text style={styles.passwordToggleText}>
            {isPasswordVisible ? 'Hide' : 'Show'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 8,
    position: 'relative',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#d1d5db',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'white',
    fontSize: 16,
    paddingRight: 60, // Space for password toggle
  },
  passwordToggle: {
    position: 'absolute',
    right: 12,
    top: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  passwordToggleText: {
    color: '#3182CE',
    fontSize: 14,
    fontWeight: '600',
  },
});