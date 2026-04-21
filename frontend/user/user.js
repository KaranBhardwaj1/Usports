const API = "https://usports.onrender.com/api";
const token = localStorage.getItem("token");


function show(sectionId) {
  document.getElementById("equip").style.display = "none";
  document.getElementById("pool").style.display = "none";
  document.getElementById("live").style.display = "none";
  document.getElementById("invite").style.display = "none";
  document.getElementById(sectionId).style.display = "block";
}


/* LOAD EQUIPMENT */
function loadEquip() {
  fetch(`${API}/equipment`)
    .then(res => res.json())
    .then(data => {
      document.getElementById("equip").innerHTML =
        "<h2>Equipments</h2>" +
        data.map(e => `
          <p>
            ${e.name} - ${e.available ? "Available" : "Not Available"}
            <button onclick="request('${e._id}')">Request</button>
          </p>
        `).join("");
    });
}

/* REQUEST EQUIPMENT */
function request(id) {
  fetch(`${API}/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({
      equipmentId: id,
      universityId: localStorage.getItem("universityId")
    })
  }).then(() => alert("Request sent"));
}

/* LOAD REQUESTS */
function loadRequests() {
  fetch(`${API}/request/my`, {
    headers: { Authorization: token }
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("req").innerHTML =
        "<h2>My Requests</h2>" +
        data.map(r => `
          <p>${r.equipmentId.name} - ${r.status}</p>
        `).join("");
    });
}




function loadPoolStatus() {
  fetch("https://usports.onrender.com/api/pool/status")
    .then(res => res.json())
    .then(data => {
      const statusDiv = document.getElementById("poolStatus");
      const msg = document.getElementById("poolMessage");
      const btn = document.getElementById("bookBtn");

      statusDiv.innerHTML = "";

      let availableCount = 0;

      data.forEach(t => {
        statusDiv.innerHTML += `
          <p>
            Pool Table ${t.tableNumber} :
            <b>${t.available ? "Available" : "Booked"}</b>
          </p>
        `;

        if (t.available) availableCount++;
      });

      // DISABLE LOGIC
      if (availableCount === 0) {
        btn.disabled = true;
        msg.innerText = "All pool tables are currently booked.";
      } else {
        btn.disabled = false;
        msg.innerText = "";
      }
    });
}


function payAndBook() {
  const name = document.getElementById("poolName").value;
  const universityId = document.getElementById("poolUniversityId").value;

  if (!name || !universityId) {
    alert("Please fill all details");
    return;
  }

  fetch("https://usports.onrender.com/api/pool/book", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    },
    body: JSON.stringify({
      name,
      universityId
    })
  })
    .then(res => res.text())
    .then(msg => {
      alert(msg);
      loadPoolStatus();
    });
}

function loadUserEquipments() {
  fetch("https://usports.onrender.com/api/equipment", {
    headers: {
      Authorization: localStorage.getItem("token")
    }
  })
    .then(res => res.json())
    .then(data => {
      const div = document.getElementById("equip");

      if (data.length === 0) {
        div.innerHTML = "<p>No equipments found</p>";
        return;
      }

      div.innerHTML = `
        <h2>Equipments</h2>
        <div class="equip-flex">
          ${data.map(e => `
            <div class="equip-card">
              
              <!-- IMAGE SPACE (you add image file) -->
              <img src="imagess/${e.name.toLowerCase()}.png" 
                   alt="${e.name}" 
                   class="equip-img">

              <h3>${e.name}</h3>

              <p class="${e.available ? 'available' : 'not-available'}">
                ${e.available ? 'Available' : 'Not Available'}
              </p>

            </div>
          `).join("")}
        </div>
      `;
    });
}

const socket = io("https://usports.onrender.com");
const SCORE_API = "https://usports.onrender.com/api/score";

// LIVE
socket.on("scoreUpdated", (data) => {
  show("live");     // 🔥 auto open
  renderLive(data);
});
socket.on("scoreCreated", renderLive);

function renderLive(match) {
  const div = document.getElementById("liveScoresContainer");

  if (!match) {
    div.innerHTML = "<p>No Match Found</p>";
    return;
  }

  // 🔥 COMMON HEADER
  let content = `
    <h3>${match.status === "Live" ? "🔴 LIVE" : "✅ Finished"} - ${match.tournament}</h3>
    <h2>${match.teamA} vs ${match.teamB}</h2>
  `;

  // 🏏 CRICKET
  if (match.sport === "cricket") {

    const oversA = (match.oversA || 0).toFixed(1);
    const oversB = (match.oversB || 0).toFixed(1);

    const runsA = match.runsA || 0;
    const wicketsA = match.wicketsA || 0;

    const runsB = match.runsB || 0;
    const wicketsB = match.wicketsB || 0;

    const innings = match.innings || 1;

    content += `
      <p>${match.teamA}: ${runsA}/${wicketsA} (${oversA})</p>
      <p>${match.teamB}: ${runsB}/${wicketsB} (${oversB})</p>
      <h4>Innings: ${innings}</h4>
    `;

    // 🎯 TARGET (only during live 2nd innings)
    if (innings === 2 && match.status === "Live") {
      content += `<p>🎯 Target: ${runsA + 1}</p>`;
    }

    // 🏆 WINNER
    if (match.status === "Finished") {
      let winner = "";

      if (runsA > runsB) {
        winner = match.teamA;
      } else if (runsB > runsA) {
        winner = match.teamB;
      } else {
        winner = "Match Draw";
      }

      content += `<h2>🏆 Winner: ${winner}</h2>`;
    }
  }

  // ⚽ FOOTBALL
  if (match.sport === "football") {
    content += `
      <h1>${match.scoreA || 0} : ${match.scoreB || 0}</h1>
    `;

    if (match.status === "Finished") {
      let winner = "";

      if (match.scoreA > match.scoreB) {
        winner = match.teamA;
      } else if (match.scoreB > match.scoreA) {
        winner = match.teamB;
      } else {
        winner = "Draw";
      }

      content += `<h2>🏆 Winner: ${winner}</h2>`;
    }
  }

  div.innerHTML = content;
}

async function loadLiveOnStart() {
  const res = await fetch(`${SCORE_API}/live`);
  const data = await res.json();
  renderLive(data);
}

// HISTORY
async function loadHistory() {
  try {
    const res = await fetch(`${SCORE_API}/history`);
    const data = await res.json();

    const div = document.getElementById("history");

    if (!data || data.length === 0) {
      div.innerHTML = "<p>No previous matches</p>";
      return;
    }

    div.innerHTML = data.map(m => {

      // 🏏 CRICKET DATA FIX
      if (m.sport === "cricket") {

        const oversA = (m.oversA || 0).toFixed(1);
        const oversB = (m.oversB || 0).toFixed(1);

        const runsA = m.runsA || 0;
        const wicketsA = m.wicketsA || 0;

        const runsB = m.runsB || 0;
        const wicketsB = m.wicketsB || 0;

        // 🏆 WINNER
        let winner = "";
        if (runsA > runsB) {
          winner = m.teamA;
        } else if (runsB > runsA) {
          winner = m.teamB;
        } else {
          winner = "Match Draw";
        }

        return `
          <div class="card">
            <h3>${m.tournament}</h3>
            <p>${m.teamA} vs ${m.teamB}</p>

            <p>${m.teamA}: ${runsA}/${wicketsA} (${oversA})</p>
            <p>${m.teamB}: ${runsB}/${wicketsB} (${oversB})</p>

            <p>🏆 Winner: ${winner}</p>
          </div>
        `;
      }

      // ⚽ FOOTBALL
      if (m.sport === "football") {

        const scoreA = m.scoreA || 0;
        const scoreB = m.scoreB || 0;

        let winner = "";
        if (scoreA > scoreB) {
          winner = m.teamA;
        } else if (scoreB > scoreA) {
          winner = m.teamB;
        } else {
          winner = "Draw";
        }

        return `
          <div class="card">
            <h3>${m.tournament}</h3>
            <p>${m.teamA} vs ${m.teamB}</p>

            <p>${scoreA} : ${scoreB}</p>

            <p>🏆 Winner: ${winner}</p>
          </div>
        `;
      }

    }).join("");

  } catch (err) {
    console.error(err);
  }
}

async function sendInvite() {

  const name = localStorage.getItem("name");
  const sport = document.getElementById("sportInput").value;
  const message = document.getElementById("inviteMsg").value;

  const data = { name, sport, message };

  // SAVE TO DB
  const res = await fetch("https://usports.onrender.com/api/invite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const savedInvite = await res.json();

  // SEND SOCKET
  socket.emit("sendInvite", savedInvite);
}

async function loadInvites() {

  const res = await fetch("https://usports.onrender.com/api/invite");
  const data = await res.json();

  const div = document.getElementById("inviteBox");

  div.innerHTML = data.map(i => `
    <div class="invite-card">
      <h3>${i.sport}</h3>
      <p><b>${i.name}</b></p>
      <p>${i.message}</p>
      <small>${data.time || new Date().toLocaleTimeString()}</small>
    </div>
  `).join("");
}

socket.on("receiveInvite", (data) => {

  const div = document.getElementById("inviteBox");
  const time = new Date(data.time).toLocaleTimeString();

  div.innerHTML += `
    <div class="invite-card">
      <h3>📢 ${data.sport} Invite</h3>
      <p><b>${data.name}</b> invited:</p>
      <p>${data.message}</p>
      <small>${data.time}</small>
    </div>
  `;
});


// AUTO REFRESH POOL STATUS EVERY 10 SECONDS
window.onload = () => {
  show("live");  
  loadUserEquipments();
  loadPoolStatus();
  loadLiveOnStart();
  loadHistory();
  loadInvites();
};

setInterval(() => {
  loadUserEquipments();
  loadPoolStatus();
  loadLiveOnStart();
  loadHistory();
}, 10000);



