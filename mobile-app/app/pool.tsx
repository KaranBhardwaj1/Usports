import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";

const API = "http://10.236.94.158:5000/api"; // 🔴 CHANGE THIS

interface PoolTable {
  _id: string;
  tableNumber: number;
  available: boolean;
}

export default function PoolScreen() {
    const theme = useColorScheme();
    const isDark = theme === "dark";
  const router = useRouter();

  const [name, setName] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [tables, setTables] = useState<PoolTable[]>([]);

  /* ===============================
     LOAD TABLE STATUS
  =============================== */
  const loadStatus = async () => {
    try {
      const res = await fetch(`${API}/pool/status`);
      const data = await res.json();
      setTables(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  /* ===============================
     GO TO PAYMENT SCREEN
  =============================== */
  const goToPayment = () => {
    if (!name || !universityId) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    router.push({
      pathname: "/payment",
      params: { name, universityId },
    });
  };

  return (
    <View style={[styles.container,
        { backgroundColor: isDark ? "#121212" : "#ffffff" },
    ]}>
      <Text style={[styles.title,
        { color: isDark ? "#ffffff" : "#000000" }
      ]}>Pool Table Booking</Text>

      <TextInput
        placeholder="Enter your name"
        placeholderTextColor={isDark ? "#aaaaaa" : "#666666"}
        style={[styles.input,
            {
            color: isDark ? "#ffffff" : "#000000",
            backgroundColor: isDark ? "#1e1e1e" : "#f2f2f2",
            borderColor: isDark ? "#333333" : "#cccccc",
          },
        ]}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Enter University ID"
        placeholderTextColor={isDark ? "#aaaaaa" : "#666666"}
        style={[styles.input,
            {
            color: isDark ? "#ffffff" : "#000000",
            backgroundColor: isDark ? "#1e1e1e" : "#f2f2f2",
            borderColor: isDark ? "#333333" : "#cccccc",
          },
        ]}
        value={universityId}
        onChangeText={setUniversityId}
      />

      <Text style={styles.subtitle}>Table Status</Text>

      <FlatList
        data={tables}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <Text style={[styles.tableText,
            {
            color: isDark ? "#ffffff" : "#000000",
            
          },
          ]}>
            Table {item.tableNumber} :{" "}
            <Text
              style={{
                color: item.available ? "lime" : "red",
                fontWeight: "bold",
              }}
            >
              {item.available ? "Available" : "Booked"}
            </Text>
          </Text>
        )}
      />

      <TouchableOpacity style={styles.button} onPress={goToPayment}>
        <Text style={[styles.buttonText,
            { color: "#ffffff", fontWeight: "bold" }
        ]}>
          Pay ₹50 & Book (1 Hour)
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    padding: 20,
    paddingTop:40,
    paddingBottom:50,
    
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    
    marginBottom: 20,
  },
  subtitle: {
    
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    
  },
  tableText: {
    
    marginVertical: 4,
  },
  button: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    
    textAlign: "center",
    fontWeight: "bold",
  },
});