// ============================
// Global variable to track selected payment
// ============================


let selectedPayment = null;

// ============================
// Function to validate Mobile and go to Payment
// ============================
function checkMobile() {
  const phoneInput = document.getElementById("phone");
  const phoneValue = phoneInput.value.replace(/\D/g, "").slice(-10); // only digits
  const phonePattern = /^[789]\d{9}$/;
  const isValidPhone = phonePattern.test(phoneValue);

  if (isValidPhone) {
    // Mark mobile heading completed
    document.getElementById("mobile-heading").classList.add("completed");
    document.getElementById("mobile-check").style.display = "inline";

    // Show Payment section
    nextSection("payment-section");
  } else {
    alert("Please enter a valid 10-digit phone number");
  }
}

// ============================
// Function to navigate between sections
// ============================
function navigateToSection(sectionId) {
  const currentSection = document.querySelector(
    "div[id$='-section']:not([style*='display: none'])"
  ).id;

  // If current is mobile, validate first
  if (currentSection === "mobile-section" && sectionId === "payment-section") {
    checkMobile();
    return;
  }

  nextSection(sectionId);
}

// ============================
// Function to show a section and hide others
// ============================
function nextSection(sectionId) {
  document.getElementById("mobile-section").style.display = "none";
  document.getElementById("payment-section").style.display = "none";

  document.getElementById(sectionId).style.display = "block";
}

// ============================
// Open / Close modal
// ============================
function openModal() {
  document.getElementById("modal").style.display = "block";
}

function closeModal() {
  window.history.back(); // or document.getElementById("modal").style.display = "none";
}

// ============================
// Payment Box Selection
// ============================
function setupPaymentBoxes() {
  const boxes = document.querySelectorAll(".payment-box");

  boxes.forEach(box => {
    box.addEventListener("click", () => {
      // Remove highlight from all boxes
      boxes.forEach(b => b.style.border = "2px solid #333");

      // Highlight selected box
      box.style.border = "2px solid #00FF00"; // green border

      // Store selected payment method
      selectedPayment = box.querySelector("span").innerText;
    });
  });
}

// ============================
// Submit Order
// ============================
function submitOrder() {
  if (!selectedPayment) {
    alert("Please select a payment method.");
    return;
  }

  const name = localStorage.getItem("poolName");
  const universityId = localStorage.getItem("poolUniversityId");
  const amount = localStorage.getItem("poolAmount");

  if (!name || !universityId) {
    alert("Booking details missing");
    return;
  }

  // 🔥 FINAL BOOKING (AFTER PAYMENT)
  fetch("http://localhost:5000/api/pool/book", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token")
    },
    body: JSON.stringify({
      name,
      universityId,
      amount,
      paymentMethod: selectedPayment
    })
  })
    .then(res => res.json())
    .then(data => {
      alert("Payment successful & Pool booked!");

      // cleanup
      localStorage.removeItem("poolName");
      localStorage.removeItem("poolUniversityId");
      localStorage.removeItem("poolAmount");

      // back to user dashboard
      window.location.href = "/frontend/user/user.html";
    })
    .catch(err => {
      console.error(err);
      alert("Booking failed");
    });
}


  // 🔹 MOCK PAYMENT SUCCESS
  console.log("Payment Success:", {
    phone,
    paymentMethod: selectedPayment
  });

  // 🔹 CALL BACKEND TO BOOK POOL
  fetch("http://localhost:5000/api/pool/book", {
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
      alert("Payment successful & Pool booked!");

      // cleanup
      localStorage.removeItem("poolName");
      localStorage.removeItem("poolUniversityId");

      // redirect back to user dashboard
      window.location.href = "/user.html";
    })
    .catch(err => {
      console.error(err);
      alert("Booking failed after payment");
    });



  const phone = document.getElementById("phone").value.replace(/\D/g, "").slice(-10);

  // Log details (replace with actual payment logic)
  console.log("Order Details:", {
    phone,
    paymentMethod: selectedPayment
  });

  alert("Payment done successfully using " + selectedPayment + "!");


// ============================
// Phone Input Formatting
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const phoneInput = document.getElementById("phone");
  const prefix = "+91 ";

  phoneInput.value = prefix;

  phoneInput.addEventListener("focus", () => {
    if (!phoneInput.value.startsWith(prefix)) {
      phoneInput.value = prefix;
    }
  });

  phoneInput.addEventListener("input", () => {
    let input = phoneInput.value.slice(prefix.length);
    input = input.replace(/\D/g, "").slice(0, 10);
    phoneInput.value = prefix + input;
  });

  // Enter key triggers Continue
  document.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      const activeElement = document.activeElement;
      if (activeElement.tagName === "INPUT") {
        event.preventDefault();
        checkMobile();
      }
    }
  });

  // Initialize payment boxes
  setupPaymentBoxes();
});
