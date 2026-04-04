import { useEffect, useState } from "react";
import { Image } from "react-native";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  useColorScheme,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = "https://usports.onrender.com/api/equipment"; // 🔥 put your IP

export default function Equipment() {
  const theme = useColorScheme();
  const isDark = theme === "dark";
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const images: any = {
  cricket: require("../assets/images/cricket.png"),
  football: require("../assets/images/football.png"),
  tabletennis: require("../assets/images/table tennis.png"),
  badminton: require("../assets/images/badminton.png"),
  basketball: require("../assets/images/basket ball.png"),
  volleyball: require("../assets/images/volley ball.png"),
  tablesoccer: require("../assets/images/table soccer.png"),
};

  useEffect(() => {
    fetchEquipment();
  }, []);

  const fetchEquipment = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(API, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setEquipment(data);
      } else {
        console.log("Error:", data);
      }

      setLoading(false);
    } catch (error) {
      console.log("Error:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
  <View style={styles.container}>
    <FlatList
      data={equipment}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
      <View style={styles.card}>

  <Image
    source={
      images[item.name.toLowerCase().replace(/\s/g, "")] 
      // || require("../assets/images/cricket.png") // fallback
    }
    style={styles.image}
  />

  <Text style={styles.name}>{item.name}</Text>

  <Text>
    Status: {item.available ? "Available" : "Not Available"}
  </Text>

</View>
)}
    />
  </View>
);
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  paddingTop: 40, 
},
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    margin: 10,
    borderRadius: 10,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  image: {
  width: "27%",
  height: 70,
  borderRadius: 10,
  marginBottom: 10,
},
});
