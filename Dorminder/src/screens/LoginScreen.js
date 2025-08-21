// src/screens/LoginScreen.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import InputField from "../components/InputField";
import CustomButton from "../components/CustomButton";

export default function LoginScreen({ navigation }) {
  const handleLogin = () => {
    Alert.alert("Login", "Login functionality would go here!");
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

      <Text style={styles.title}>Login</Text>

      <InputField placeholder="Email" />
      <InputField placeholder="Password" secureTextEntry />

      <CustomButton
        title="Login"
        onPress={handleLogin}
        bgColor="#3b82f6"
      />

      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}
        style={styles.linkContainer}
      >
        <Text style={styles.linkText}>Don't have an account? Register</Text>
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
    marginBottom: 24,
    color: "#1f2937",
    alignSelf: "flex-start",
    width: "100%",
    marginLeft: 10,
  },
  linkContainer: {
    marginTop: 16,
  },
  linkText: {
    color: "#3b82f6",
    fontSize: 16,
  },
});
