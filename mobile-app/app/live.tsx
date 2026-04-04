import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { io } from "socket.io-client";

const socket = io("http://192.168.31.182:5000"); // 🔥 your IP
const API = "http://192.168.31.182:5000/api/score";

export default function LiveScreen() {
  const [match, setMatch] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    loadLive();
    loadHistory();

    socket.on("scoreUpdated", (data) => {
      setMatch(data);
    });

    return () => {
      socket.off("scoreUpdated");
    };
  }, []);

  // 🔥 LOAD LIVE ON START
  const loadLive = async () => {
    const res = await fetch(`${API}/live`);
    const data = await res.json();
    setMatch(data);
  };

  // 🔥 LOAD HISTORY
  const loadHistory = async () => {
    const res = await fetch(`${API}/history`);
    const data = await res.json();
    setHistory(data);
  };

  return (
    <ScrollView style={styles.container}>
      
      {/* 🔴 LIVE MATCH */}
      <Text style={styles.title}>Live Match</Text>

      {!match ? (
        <Text>No Live Match</Text>
      ) : (
        <View style={styles.card}>
          <Text style={styles.live}>
            {match.status === "Live" ? "🔴 LIVE" : "✅ Finished"} - {match.tournament}
          </Text>

          <Text style={styles.teams}>
            {match.teamA} vs {match.teamB}
          </Text>

          {/* 🏏 CRICKET */}
          {match.sport === "cricket" && (
            <>
              <Text>
                {match.teamA}: {match.runsA || 0}/{match.wicketsA || 0} (
                {(match.oversA || 0).toFixed(1)})
              </Text>

              <Text>
                {match.teamB}: {match.runsB || 0}/{match.wicketsB || 0} (
                {(match.oversB || 0).toFixed(1)})
              </Text>

              <Text>Innings: {match.innings}</Text>

              {match.innings === 2 && (
                <Text>🎯 Target: {(match.runsA || 0) + 1}</Text>
              )}
            </>
          )}

          {/* ⚽ FOOTBALL */}
          {match.sport === "football" && (
            <Text style={styles.score}>
              {match.scoreA || 0} : {match.scoreB || 0}
            </Text>
          )}
        </View>
      )}

      {/* 📜 HISTORY */}
      <Text style={styles.title}>Previous Matches</Text>

      {history.map((m, i) => (
        <View key={i} style={styles.card}>
          <Text>{m.tournament}</Text>
          <Text>{m.teamA} vs {m.teamB}</Text>

          {m.sport === "cricket" ? (
            <>
              <Text>
                {m.teamA}: {m.runsA}/{m.wicketsA} ({(m.oversA || 0).toFixed(1)})
              </Text>
              <Text>
                {m.teamB}: {m.runsB}/{m.wicketsB} ({(m.oversB || 0).toFixed(1)})
              </Text>
            </>
          ) : (
            <Text>{m.scoreA} : {m.scoreB}</Text>
          )}
        </View>
      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },

  live: {
    fontWeight: "bold",
    color: "red",
  },

  teams: {
    fontSize: 18,
    fontWeight: "bold",
  },

  score: {
    fontSize: 24,
    fontWeight: "bold",
  },
});