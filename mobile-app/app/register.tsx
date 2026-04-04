import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  useColorScheme,
} from "react-native";
import { router } from "expo-router";
import { Image } from "react-native";

const API = "http://192.168.31.182:5000/api/auth";

export default function Register() {
  const theme = useColorScheme();
  const isDark = theme === "dark";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "All fields required");
      return;
    }

    try {
      const res = await fetch(`${API}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Error", data.message);
        return;
      }

      Alert.alert("Success", "Account created! Please login.");
      router.replace("/login");

    } catch (error) {
      Alert.alert("Error", "Server not reachable");
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#121212" : "#ffffff" },
      ]}
    >
      <Image 
        source={require("../assets/images/logo.png")} 
        style={styles.logo} 
      />
      
      <Text
        style={[
          styles.title,
          { color: isDark ? "#ffffff" : "#000000" },
        ]}
      >
        USports
      </Text>
      <Text
        style={[
          styles.title,
          { color: isDark ? "#ffffff" : "#000000" ,
            marginTop: 80,
          },
        ]}
      >
        Register
      </Text>

      <TextInput
        placeholder="Name"
        placeholderTextColor={isDark ? "#aaaaaa" : "#666666"}
        style={[
          styles.input,
          {
            color: isDark ? "#ffffff" : "#000000",
            backgroundColor: isDark ? "#1e1e1e" : "#f2f2f2",
            borderColor: isDark ? "#333333" : "#cccccc",
          },
        ]}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Email"
        placeholderTextColor={isDark ? "#aaaaaa" : "#666666"}
        style={[
          styles.input,
          {
            color: isDark ? "#ffffff" : "#000000",
            backgroundColor: isDark ? "#1e1e1e" : "#f2f2f2",
            borderColor: isDark ? "#333333" : "#cccccc",
          },
        ]}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor={isDark ? "#aaaaaa" : "#666666"}
        secureTextEntry
        style={[
          styles.input,
          {
            color: isDark ? "#ffffff" : "#000000",
            backgroundColor: isDark ? "#1e1e1e" : "#f2f2f2",
            borderColor: isDark ? "#333333" : "#cccccc",
          },
        ]}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#e60000" }]}
        onPress={handleRegister}
      >
        <Text style={{ color: "#ffffff", fontWeight: "bold" }}>
          Register
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  logo: {
  width: 60,
  height: 60,
  alignSelf: "center",
  marginBottom: 10,
},
});