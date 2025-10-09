// src/screens/LoginScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator } from "react-native";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";
import { authService } from "../services/auth";
import { fonts } from "../utils/fonts";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Check if user is already logged in
  useEffect(() => {
    const unsubscribe = authService.addAuthStateListener((user, role) => {
      if (user && role === 'tenant') {
        navigation.replace("TenantDashboard");
      }
    });

    return unsubscribe;
  }, [navigation]);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await authService.signIn(email.trim(), password);
      
      if (result.success) {
        // Check if user is a tenant
        if (result.role === 'tenant') {
          navigation.replace("TenantDashboard");
        } else {
          setError("Access denied. This app is for tenants only.");
          await authService.signOut();
        }
      } else {
        setError(result.error || "Login failed. Please try again.");
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Email Required", "Please enter your email address first.");
      return;
    }

    try {
      const result = await authService.resetPassword(email.trim());
      if (result.success) {
        Alert.alert(
          "Password Reset", 
          "Password reset email sent! Please check your inbox and follow the instructions."
        );
      } else {
        Alert.alert("Error", result.error || "Failed to send reset email. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.");
      console.error("Reset password error:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo/logo_dorminder.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Image
        source={require("../assets/images/login_img.png")}
        style={styles.banner}
        resizeMode="contain"
      />

      <Text style={styles.title}>LOGIN</Text>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      <Text style={styles.InputLabel}>Email Address:</Text>
      <InputField
        placeholder="Email Address"
        placeholderTextColor="#9CA3AF"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setError(""); // Clear error when user types
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      <Text style={styles.InputLabel}>Password:</Text>
      <InputField
        placeholder="Password"
        placeholderTextColor="#9CA3AF"
        secureTextEntry
        showPasswordToggle
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setError(""); // Clear error when user types
        }}
        editable={!loading}
      />

      <View style={styles.linkRow}>
        <TouchableOpacity onPress={handleForgotPassword} disabled={loading}>
          <Text style={[styles.linkMuted, loading && styles.disabledText]}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      <CustomButton 
        title={loading ? "Logging In..." : "Log In"} 
        onPress={handleLogin} 
        bgColor="#EE6C4D"
        disabled={loading}
      />

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#EE6C4D" />
        </View>
      )}

      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    backgroundColor: "white",
    padding: 24,
    paddingTop: 48,
  },
  logo: {
    width: 160,
    height: 80,
    marginBottom: 16,
  },
  banner: {
    width: "100%",
    height: 250,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.bold,
    marginBottom: 6,
    color: "#1f2937",
    alignSelf: "stretch",
  },
  InputLabel: {
    fontSize: 16,
    fontFamily: fonts.medium,
    marginBottom: 6,
    color: "#1f2937",
    alignSelf: "stretch",
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
  },
  linkAccent: {
    color: "#EE6C4D",
    fontSize: 12,
    fontFamily: fonts.medium,
    textDecorationLine: "underline",
  },
  linkMuted: {
    color: "#6b7280",
    fontSize: 12,
    fontFamily: fonts.regular,
  },
  errorContainer: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignSelf: "stretch",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 14,
    textAlign: "center",
  },
  disabledText: {
    opacity: 0.5,
  },
  loadingContainer: {
    marginTop: 16,
    alignItems: "center",
  },
});