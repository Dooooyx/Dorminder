// src/screens/LoginScreen.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleLogin = () => {
    navigation.replace("TenantDashboard");
  };
  const handleGoogleLogin = () => {
    Alert.alert("Google Login", "Google login functionality would go here!");
  };
  const handleForgotPassword = () => {
    Alert.alert("Forgot Password", "Password reset functionality would go here!");
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

      <Text style={styles.InputLabel}>Email Address:</Text>
      <InputField
        placeholder="Email Address"
        placeholderTextColor="#9CA3AF"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={styles.InputLabel}>Password:</Text>
      <InputField
        placeholder="Password"
        placeholderTextColor="#9CA3AF"
        secureTextEntry
        showPasswordToggle
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.linkRow}>
        <Text>
          <Text style={styles.linkMuted}>Don't have an Account? </Text>
          <Text style={styles.linkAccent} onPress={() => navigation.navigate("Register")}>Register</Text>
        </Text>
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.linkMuted}>Forgot password?</Text>
        </TouchableOpacity>
      </View>

      <CustomButton title="Log In" onPress={handleLogin} bgColor="#EE6C4D" />

      <Text style={styles.orText}>OR</Text>

      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <Image
          source={{ uri: 'https://developers.google.com/identity/images/g-logo.png' }}
          style={styles.googleIcon}
        />
        <Text style={styles.googleButtonText}>Log In with Google</Text>
      </TouchableOpacity>

      
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
    fontWeight: "bold",
    marginBottom: 6,
    color: "#1f2937",
    alignSelf: "stretch",
  },
  InputLabel: {
    fontSize: 16,
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
    textDecorationLine: "underline",
  },
  linkMuted: {
    color: "#6b7280",
    fontSize: 12,
  },
  orText: {
    textAlign: "center",
    color: "#6b7280",
    fontSize: 16,
    marginBottom: 6,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "white",
    width: "100%",
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleButtonText: {
    color: "#1f2937",
    fontSize: 16,
  },
});