import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Image } from "react-native";

const API = "https://usports.onrender.com/api/auth";

export default function Login() {
  const theme = useColorScheme(); // light or dark
  const isDark = theme === "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "All fields required");
      return;
    }

    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        Alert.alert("Login Failed", data.message || "Invalid credentials");
        return;
      }

      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("name", data.name);
      router.replace("/dashboard");
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
    { color: isDark ? "#ffffff" : "#000000"},
  ]}
>
  USports
</Text>
      <Text
        style={[
          styles.title,
          { color: isDark ? "#ffffff" : "#000000",
            marginTop: 80,
           },
        ]}
      >
        Login
      </Text>

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
        style={[
          styles.loginBtn,
          { backgroundColor: "#e60000" },
        ]}
        onPress={handleLogin}
      >
        <Text style={{ color: "#ffffff", fontWeight: "bold" }}>
          Login
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerBtn}
        onPress={() => router.push("/register" as any)}
      >
        <Text
          style={[
            styles.registerText,
            { color: isDark ? "#4da6ff" : "#007bff" },
          ]}
        >
          New user? Register here
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
  loginBtn: {
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 5,
  },
  registerBtn: {
    marginTop: 20,
    alignItems: "center",
  },
  registerText: {
    fontWeight: "bold",
  },
  logo: {
  width: 60,
  height: 60,
  alignSelf: "center",
  marginBottom: 10,
},
});
