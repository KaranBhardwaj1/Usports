import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { router } from "expo-router";
import { Image } from "react-native";

export default function Dashboard() {
  const theme = useColorScheme();
  const isDark = theme === "dark";

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    router.replace("/login");
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
  uSports
</Text>
      <Text
        style={[
          styles.title,
          { color: isDark ? "#ffffff" : "#000000",
            marginTop: 30,
           },
        ]}
      >
       Sports Dashboard
      </Text>

      {/* View Equipment Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#007bff" }]}
        onPress={() => router.push("/equipment")}
      >
        <Text style={styles.buttonText}>View Equipments</Text>
      </TouchableOpacity>

      {/* Book Pool Button */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#007bff" }]}
        onPress={() => router.push("/pool")}
      >
        <Text style={styles.buttonText}>Book Pool</Text>
      </TouchableOpacity>

      <TouchableOpacity 
      style={[styles.button, { backgroundColor: "#007bff" }]}
      onPress={() => router.push("/live")}>
  <Text style={styles.buttonText}>Live Scores</Text>
</TouchableOpacity>

       <TouchableOpacity 
      style={[styles.button, { backgroundColor: "#007bff" }]}
      onPress={() => router.push("/invite")}>
  <Text style={styles.buttonText}>Invite</Text>
</TouchableOpacity>


      {/* Logout Button */}
      <TouchableOpacity
        style={[styles.logout, { backgroundColor: "#e60000" }]}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Logout</Text>
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
    fontSize: 22,
    marginBottom: 30,
    textAlign: "center",
    fontWeight: "bold",
  },
  button: {
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  logout: {
    padding: 15,
    marginTop: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
  },
  logo: {
  width: 60,
  height: 60,
  alignSelf:"center",
  marginBottom: 10,
},
});