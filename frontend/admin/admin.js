const API = "https://your-app.onrender.com/api";
const token = localStorage.getItem("token");

/* ===============================
   LOAD EQUIPMENT (ADMIN LIST)
================================ */
function loadEquipment() {
  fetch(`${API}/equipment`, {
    headers: { Authorization: token }
  })
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("equipmentList");
      const select = document.getElementById("equipmentSelect");

      list.innerHTML = "";
      select.innerHTML = "";

      data.forEach(item => {
        // admin toggle list
        list.innerHTML += `
          <div>
            <b>${item.name}</b> -
            <span>${item.available ? "Available" : "Not Available"}</span>
            <button onclick="toggleAvailability('${item._id}', ${item.available})">
              Toggle
            </button>
          </div>
          <hr>
        `;

        // dropdown (ONLY AVAILABLE)
        if (item.available) {
          const option = document.createElement("option");
          option.value = item._id;
          option.textContent = item.name;
          select.appendChild(option);
        }
      });
    });
}

/* ===============================
   ADD EQUIPMENT
================================ */
function addEquipment() {
  const name = document.getElementById("equipName").value;

  fetch(`${API}/equipment/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({ name, available: true })
  })
    .then(res => res.text())
    .then(msg => {
      alert(msg);
      loadEquipment();
    });
}

/* ===============================
   TOGGLE AVAILABILITY
================================ */
function toggleAvailability(id, currentStatus) {
  fetch(`${API}/equipment/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({ available: !currentStatus })
  })
    .then(res => res.text())
    .then(() => loadEquipment());
}

/* ===============================
   ASSIGN EQUIPMENT
================================ */
function assign() {
  const equipmentId = document.getElementById("equipmentSelect").value;
  const universityId = document.getElementById("universityId").value;

  if (!equipmentId || !universityId) {
    alert("Fill all fields");
    return;
  }

  fetch(`${API}/assignment/assign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token
    },
    body: JSON.stringify({ equipmentId, universityId })
  })
    .then(res => res.text())
    .then(msg => {
      alert(msg);
      loadAssignments();
      loadEquipment(); // refresh availability
    });
}

/* ===============================
   LOAD ACTIVE ASSIGNMENTS
================================ */
function loadAssignments() {
  fetch(`${API}/assignment/active`, {
    headers: {
      Authorization: token
    }
  })
  .then(res => res.json())
  .then(data => {
    const table = document.getElementById("assignmentTable");
    table.innerHTML = "";

    data.forEach(a => {
      table.innerHTML += `
        <tr>
          <td>${a.equipmentId?.name || "N/A"}</td>
          <td>${a.universityId}</td>
          <td>${new Date(a.assignedAt).toLocaleString()}</td>
          <td>
            <button onclick="returnEquipment('${a._id}')">
              Return
            </button>
          </td>
        </tr>
      `;
    });
  })
  .catch(err => {
    console.error("Error loading assignments:", err);
  });
}

/* ===============================
   RETURN EQUIPMENT
================================ */
function returnEquipment(id) {
  fetch(`${API}/assignment/return/${id}`, {
    method: "POST",
    headers: { Authorization: token }
  })
    .then(res => res.text())
    .then(() => {
      alert("Equipment returned");
      loadAssignments();
      loadEquipment();
    });
}

function loadPoolBookings() {
  fetch("https://your-app.onrender.com/api/pool/admin/bookings", {
    headers: {
      Authorization: localStorage.getItem("token")
    }
  })
    .then(res => res.json())
    .then(data => {
      const table = document.getElementById("poolBookings");
      table.innerHTML = "";

      data.forEach(b => {
  table.innerHTML += `
    <tr>
      <td>${b.tableNumber}</td>
      <td>${b.name}</td>
      <td>${b.universityId}</td>
      <td>${new Date(b.startTime).toLocaleString()}</td>
      <td>${new Date(b.endTime).toLocaleString()}</td>
      <td>₹${b.amount}</td>
      <td>${b.paymentStatus}</td>
    </tr>
  `;
});

    });
}


/* ===============================
   INITIAL LOAD
================================ */
loadEquipment();
loadAssignments();

// AUTO REFRESH POOL BOOKINGS EVERY 10 SECONDS

window.onload = () => {
  loadPoolBookings();
};

setInterval(() => {
 loadPoolBookings();
}, 10000);


