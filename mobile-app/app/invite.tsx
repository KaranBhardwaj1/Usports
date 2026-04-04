import { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, FlatList, useColorScheme, } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { io } from "socket.io-client";
import { useFocusEffect } from "@react-navigation/native";

const socket = io("https://your-app.onrender.com"); // 🔥 YOUR IP

export default function InviteScreen() {
  const theme = useColorScheme(); // light or dark
  const isDark = theme === "dark";

  const [sport, setSport] = useState("");
  const [message, setMessage] = useState("");
  const [invites, setInvites] = useState<any[]>([]);

 
  // 🔥 RECEIVE INVITES
 useEffect(() => {

  loadInvites(); // 👈 VERY IMPORTANT

  const handleInvite = (data: any) => {
    console.log("Socket invite:", data);
    setInvites(prev => [data, ...prev]);
  };

  socket.on("receiveInvite", handleInvite);

  return () => {
    socket.off("receiveInvite", handleInvite);
  };

}, []);


const loadInvites = async () => {
  try {
    const res = await fetch("http://192.168.31.182:5000/api/invite");
    const data = await res.json();

    setInvites(data); // ✅ important
  } catch (err) {
    console.log("Error loading invites", err);
  }
};



  // 🔥 SEND INVITE
  const sendInvite = async () => {

  const name = await AsyncStorage.getItem("name");

  if (!name || !sport || !message) {
    alert("Fill all fields");
    return;
  }

  const data = {
    name,
    sport,
    message
  };

  try {
    // ✅ SAVE IN DATABASE FIRST
    const res = await fetch("http://192.168.31.182:5000/api/invite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const savedInvite = await res.json();

    // ✅ THEN SEND VIA SOCKET
    socket.emit("sendInvite", savedInvite);

    setSport("");
    setMessage("");

  } catch (err) {
    console.log(err);
  }
};

  return (
    <View style={styles.container}>

      <Text style={styles.heading}>Invite Players</Text>

      <TextInput
        placeholder="Sport (Football, Cricket)"
        placeholderTextColor={isDark ? "#aaaaaa" : "#666666"}
        value={sport}
        onChangeText={setSport}
        style={[styles.input,
          {
            color: isDark ? "#ffffff" : "#000000",
            backgroundColor: isDark ? "#1e1e1e" : "#f2f2f2",
            borderColor: isDark ? "#333333" : "#cccccc",
          },
        ]}
      />

      <TextInput
        placeholder="Message"
        placeholderTextColor={isDark ? "#aaaaaa" : "#666666"}
        value={message}
        onChangeText={setMessage}
        style={[styles.input,
          {
            color: isDark ? "#ffffff" : "#000000",
            backgroundColor: isDark ? "#1e1e1e" : "#f2f2f2",
            borderColor: isDark ? "#333333" : "#cccccc",
          },
        ]}
      />

      <Button title="Send Invite" onPress={sendInvite} />

      <FlatList
  data={invites}
  keyExtractor={(item) => item._id || Math.random().toString()}
  renderItem={({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>📢 {item.sport}</Text>
      <Text><Text style={{fontWeight:"bold"}}>{item.name}</Text> invited:</Text>
      <Text>{item.message}</Text>
      <Text style={styles.time}>{item.time}</Text>
    </View>
  )}
/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10
  },

  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginTop: 10,
    borderRadius: 10,
    elevation: 3
  },

  title: {
    fontWeight: "bold",
    fontSize: 16
  },

  time: {
    fontSize: 12,
    color: "gray"
  }
});
