import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import {
  loginWithEmail,
  sendPasswordResetEmail,
} from "@/authentication/authService";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await loginWithEmail(email, password);
      setError("");
      console.log("Logged in successfully");
      router.push("/home");
    } catch (err) {
      setError("Invalid email or password");
      console.log(err);
    }
  };

  const handleForgotPassword = async () => {
    setModalVisible(true);
  };

  const handleSendPasswordResetEmail = async () => {
    try {
      await sendPasswordResetEmail(resetEmail);
      setMessage("Password reset email sent");
      setError("");
      setModalVisible(false);
    } catch (err) {
      setError("Error sending password reset email");
      setMessage("");
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name="log-in-outline" size={30} color="black" />
      <Text style={styles.title}>Welcome to Tourific</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => router.replace("/register")}
      >
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.linkButton}
        onPress={handleForgotPassword}
      >
        <Text style={styles.linkText}>Forgot Password?</Text>
      </TouchableOpacity>

      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Reset Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#aaa"
            value={resetEmail}
            onChangeText={setResetEmail}
            autoCapitalize="none"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSendPasswordResetEmail}
          >
            <Text style={styles.buttonText}>Send Email</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.linkText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    height: 45,
    backgroundColor: "#1e90ff",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    flexDirection: "row",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  linkButton: {
    marginTop: 10,
  },
  linkText: {
    color: "#1e90ff",
    fontSize: 16,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "black",
  },
});

export default LoginScreen;
