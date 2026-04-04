import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = "http://192.168.31.182:5000/api"; // change to your IP

export default function PaymentScreen() {
  const { name, universityId } = useLocalSearchParams();
  const router = useRouter();

  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!selectedMethod) {
      Alert.alert("Select Payment Method");
      return;
    }

    setLoading(true);

    const token = await AsyncStorage.getItem("token");

    try {
      const res = await fetch(`${API}/pool/book`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token || "",
        },
        body: JSON.stringify({ name, universityId }),
      });

      const data = await res.json();

      if (res.ok) {
        Alert.alert("Payment Successful 🎉", "Table Booked!");
        router.replace("/pool");
      } else {
        Alert.alert("Error", data);
      }
    } catch (err) {
      Alert.alert("Server Error");
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Online Payment</Text>
      <Text style={styles.amount}>Amount: ₹50</Text>

      <Text style={styles.subtitle}>Select Payment Method</Text>

      <View style={styles.logoContainer}>
        <TouchableOpacity onPress={() => setSelectedMethod("gpay")}>
          <Image
            source={require("../assets//images/gpay.png")}
            style={[
              styles.logo,
              selectedMethod === "gpay" && styles.selectedLogo,
            ]}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSelectedMethod("phonepe")}>
          <Image
            source={require("../assets/images/phonepe.png")}
            style={[
              styles.logo,
              selectedMethod === "phonepe" && styles.selectedLogo,
            ]}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSelectedMethod("paytm")}>
          <Image
            source={require("../assets/images/paytm.png")}
            style={[
              styles.logo,
              selectedMethod === "paytm" && styles.selectedLogo,
            ]}
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setSelectedMethod("upi")}>
          <Image
            source={require("../assets/images/upi.png")}
            style={[
              styles.logo,
              selectedMethod === "upi" && styles.selectedLogo,
            ]}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.payText}>Pay Now</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#121212",
    paddingTop:60,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  amount: {
    fontSize: 18,
    color: "lime",
    marginBottom: 20,
  },
  subtitle: {
    color: "#fff",
    marginBottom: 10,
  },
  logoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 50,
    resizeMode: "contain",
  },
  selectedLogo: {
    borderWidth: 2,
    borderColor: "lime",
    borderRadius: 6,
  },
  payButton: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 8,
  },
  payText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});