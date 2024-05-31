import React, { useState } from "react";
import {
  View,
  TextInput,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { registerWithEmail } from "@/authentication/authService";
import * as ImagePicker from "expo-image-picker";
import { Photo } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import Spinner from "react-native-loading-spinner-overlay";

const RegisterScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [avatar, setAvatar] = useState<Photo | null>(null);
  const [error, setError] = useState("");
  const [passwordErrors, setPasswordErrors] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!validateEmail(email)) {
      setError("Invalid email format");
      return;
    }
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 8 characters long and contain an uppercase letter, a lowercase letter, and a number",
      );
      return;
    }
    if (!validateDate(dateOfBirth)) {
      setError("Invalid date of birth format. Use YYYY-MM-DD.");
      return;
    }

    setLoading(true); // Show loading spinner

    try {
      const userCredential = await registerWithEmail(email, password);
      const user = userCredential.user;

      // Upload user data to MongoDB
      const response = await fetch("http://localhost:3000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName,
          email,
          password,
          firstName,
          lastName,
          dateOfBirth,
          avatar,
        }),
      });
      setLoading(false); // Hide loading spinner

      if (response.status === 409) {
        setError("Username or email is already in use");
        console.log(error);
        return;
      }

      if (!response.ok) {
        throw new Error("Error creating user in MongoDB");
      }

      setError("");
      console.log("Registered successfully");
      router.replace("/login");
    } catch (err) {
      setLoading(false); // Hide loading spinner in case of error
      console.log(err);
    }
  };

  const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    const length = password.length >= 8;
    const uppercase = /[A-Z]/.test(password);
    const lowercase = /[a-z]/.test(password);
    const number = /\d/.test(password);

    setPasswordErrors({ length, uppercase, lowercase, number });

    return length && uppercase && lowercase && number;
  };

  const validateDate = (date: string) => {
    const re = /^\d{4}-\d{2}-\d{2}$/;
    if (!re.test(date)) return false;
    const parsedDate = new Date(date);
    return !isNaN(parsedDate.getTime());
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar({
        url: result.assets[0].uri,
        width: result.assets[0].width,
        height: result.assets[0].height,
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Spinner
        visible={loading}
        textContent={"Loading..."}
        textStyle={styles.spinnerTextStyle}
      />
      <Ionicons name="person-add" size={25} color="black" />
      <Text style={styles.title}>Create a Tourific Account</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#aaa"
        value={userName}
        onChangeText={setUserName}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="#aaa"
        value={firstName}
        onChangeText={setFirstName}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="#aaa"
        value={lastName}
        onChangeText={setLastName}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Date of Birth (YYYY-MM-DD)"
        placeholderTextColor="#aaa"
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
        autoCapitalize="none"
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
      <View style={styles.passwordRequirements}>
        <Text
          style={[
            styles.requirement,
            { color: passwordErrors.length ? "green" : "red" },
          ]}
        >
          • At least 8 characters
        </Text>
        <Text
          style={[
            styles.requirement,
            { color: passwordErrors.uppercase ? "green" : "red" },
          ]}
        >
          • At least one uppercase letter
        </Text>
        <Text
          style={[
            styles.requirement,
            { color: passwordErrors.lowercase ? "green" : "red" },
          ]}
        >
          • At least one lowercase letter
        </Text>
        <Text
          style={[
            styles.requirement,
            { color: passwordErrors.number ? "green" : "red" },
          ]}
        >
          • At least one number
        </Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Ionicons name="image-outline" size={24} color="#fff" />
        <Text style={styles.buttonText}>Pick an Avatar</Text>
      </TouchableOpacity>
      {avatar ? (
        <Image source={{ uri: avatar.url }} style={styles.avatar} />
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => router.replace("/login")}
      >
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  spinnerTextStyle: {
    color: "#FFF",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
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
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  passwordRequirements: {
    width: "auto",
    alignItems: "flex-start",
    marginBottom: 12,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  requirement: {
    marginBottom: 4,
  },
});

export default RegisterScreen;
