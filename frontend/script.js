const API = "https://usports.onrender.com//api";

// REGISTER
function register() {
  fetch(`${API}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    })
  })
  .then(res => res.text())
  .then(data => {
    alert(data);
    window.location.href = "index.html";
  });
}

// LOGIN

function login() {
  fetch("https://usports.onrender.com//api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    })
  })
  .then(res => {
    if (!res.ok) {
      return res.text().then(msg => { throw new Error(msg); });
    }
    return res.json();
  })
  .then(data => {
    alert("Login successful");

    // store token
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("name", data.name); // 👈 ADD THIS

    if (data.role === "admin") {
      window.location.href = "admin/admin.html";
    } else {
      window.location.href = "user/user.html";
    }
  })
  .catch(err => {
    alert("Login failed: " + err.message);
  });
}

