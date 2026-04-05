const socket = io("https://usports.onrender.com");
const API = "https://usports.onrender.com/api/score";

let match = null;

/* ================= LOGIN ================= */
function loginn() {
  fetch("https://usports.onrender.com/api/org/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    })
  })
  .then(res => res.json())
  .then(data => {
     console.log("LOGIN RESPONSE:", data);

    if (data.token) {
      localStorage.setItem("orgToken", data.token);
      window.location.href = "dashboard.html";
    } else {
      alert(data.message || "Login failed ❌");
    }

  })
  .catch(err => {
    console.error(err);
    alert("Server error ❌");
  });
}

/* ================= CREATE MATCH ================= */
async function createMatch(sport) {

  const data = {
    sport,
    tournament: document.getElementById("tournament").value,
    teamA: document.getElementById("teamA").value,
    teamB: document.getElementById("teamB").value,

    status: "Live",
    innings: 1,

    runsA: 0,
    wicketsA: 0,
    oversA: 0,

    runsB: 0,
    wicketsB: 0,
    oversB: 0,

    scoreA: 0,
    scoreB: 0
  };

  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("orgToken")
    },
    body: JSON.stringify(data)
  });

  match = await res.json();

  socket.emit("scoreCreated");

  renderOrgPreview(match);
}

/* ================= UPDATE MATCH ================= */
async function updateMatch() {

  if (!match) return;

  const res = await fetch(`${API}/${match._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + localStorage.getItem("orgToken")
    },
    body: JSON.stringify(match)
  });

  match = await res.json();

  socket.emit("scoreUpdated");

  renderOrgPreview(match);
}

/* ================= CRICKET ================= */
function addRun(x) {
  if (!match) return;

  if (match.innings === 1) {
    match.runsA = (match.runsA || 0) + x;
  } else {
    match.runsB = (match.runsB || 0) + x;
  }

  updateMatch();
}

function addWicket() {
  if (!match) return;

  if (match.innings === 1) {
    match.wicketsA = (match.wicketsA || 0) + 1;
  } else {
    match.wicketsB = (match.wicketsB || 0) + 1;
  }

  updateMatch();
}

function addBall() {
  if (!match) return;

  let overs, overPart, ballPart;

  if (match.innings === 1) {
    overs = match.oversA || 0;
  } else {
    overs = match.oversB || 0;
  }

  overPart = Math.floor(overs);
  ballPart = Math.round((overs - overPart) * 10);

  ballPart++;

  if (ballPart === 6) {
    overPart++;
    ballPart = 0;
  }

  const newOvers = parseFloat(overPart + "." + ballPart);

  if (match.innings === 1) {
    match.oversA = newOvers;
  } else {
    match.oversB = newOvers;
  }

  updateMatch();
}

function changeInnings() {
  if (!match) return;
  match.innings = 2;
  updateMatch();
}

/* ================= FOOTBALL ================= */
function goalA() {
  if (!match) return;
  match.scoreA = (match.scoreA || 0) + 1;
  updateMatch();
}

function goalB() {
  if (!match) return;
  match.scoreB = (match.scoreB || 0) + 1;
  updateMatch();
}

/* ================= FINISH ================= */
function finishMatch() {
  if (!match) return;
  match.status = "Finished";
  updateMatch();
}

/* ================= PREVIEW ================= */
function renderOrgPreview(match) {
  const div = document.getElementById("orgLivePreview");

  if (!div) return;

  if (!match) {
    div.innerHTML = "<p>No Match</p>";
    return;
  }

  let content = `
    <h3>${match.status === "Live" ? "🔴 LIVE" : "✅ Finished"} - ${match.tournament}</h3>
    <h2>${match.teamA} vs ${match.teamB}</h2>
  `;

  // 🏏 CRICKET
  if (match.sport === "cricket") {

    const oversA = (match.oversA || 0).toFixed(1);
    const oversB = (match.oversB || 0).toFixed(1);

    content += `
      <p>${match.teamA}: ${match.runsA || 0}/${match.wicketsA || 0} (${oversA})</p>
      <p>${match.teamB}: ${match.runsB || 0}/${match.wicketsB || 0} (${oversB})</p>
      <p>Innings: ${match.innings || 1}</p>
    `;

    if (match.innings === 2) {
      content += `<p>🎯 Target: ${(match.runsA || 0) + 1}</p>`;
    }
  }

  // ⚽ FOOTBALL
  if (match.sport === "football") {
    content += `<h1>${match.scoreA || 0} : ${match.scoreB || 0}</h1>`;
  }

  div.innerHTML = content;
}

/* ================= SOCKET ================= */
socket.on("scoreUpdated", (data) => {
  match = data;
  renderOrgPreview(data);
});
