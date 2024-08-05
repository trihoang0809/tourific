import React, { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import {
  loginWithEmail,
  sendPasswordResetEmail,
} from "@/authentication/authService";
import { Ionicons } from "@expo/vector-icons";
import Modal from "react-native-modal";
import { LinearGradient } from "expo-linear-gradient";

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
      router.replace("/home");
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
    <LinearGradient
      colors={["#e6f7ff", "#ffe6f7", "#ffffff"]}
      style={styles.container}
    >
      <View style={styles.form}>
        <Image
          style={styles.logo}
          source={require("@/assets/Tourific Logo.png")}
        />
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
          <Text style={styles.buttonText}>Log in</Text>
        </TouchableOpacity>
        <View style={styles.forgotPwContainer}>
          <TouchableOpacity
            style={styles.linkButton}
            onPress={handleForgotPassword}
          >
            <Text style={styles.linkText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.signUpContainer}>
          <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => router.replace("/register")}
          >
            <Text style={styles.signUpText}>
              Don't have an account? Sign up
            </Text>
          </TouchableOpacity>
        </View>
        <Modal isVisible={isModalVisible}>
          <LinearGradient
            colors={["#e6f7ff", "#ffe6f7", "#ffffff"]}
            style={styles.modalContent}
          >
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
          </LinearGradient>
        </Modal>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  logo: {
    width: 180,
    height: 70,
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
    marginBottom: 10,
    cursor: "pointer",
  },
  linkText: {
    color: "#1e90ff",
    fontSize: 12,
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "white",
    padding: 22,
    borderRadius: 4,
    // borderColor: "rgba(0, 0, 0, 0.1)",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "black",
  },
  forgotPwContainer: {
    marginBottom: 20,
  },
  signUpContainer: {
    position: "absolute",
    bottom: 20,
    width: "100%",
    alignItems: "center",
  },
  signUpButton: {
    borderWidth: 1,
    borderColor: "#1e90ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  signUpText: {
    color: "#1e90ff",
    fontSize: 14,
  },
});

export default LoginScreen;
