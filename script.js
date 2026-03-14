/* script.js */

// --- Mobile Menu Toggle ---
const navMenu = document.getElementById("nav-menu"),
  navToggle = document.getElementById("nav-toggle"),
  navClose = document.getElementById("nav-close");

if (navToggle) {
  navToggle.addEventListener("click", () => {
    navMenu.classList.add("show-menu");
  });
}

if (navClose) {
  navClose.addEventListener("click", () => {
    navMenu.classList.remove("show-menu");
  });
}

// Remove menu on click mobile
const navLink = document.querySelectorAll(".nav-link");

function linkAction() {
  const navMenu = document.getElementById("nav-menu");
  navMenu.classList.remove("show-menu");
}
navLink.forEach((n) => n.addEventListener("click", linkAction));

// --- Sticky Header Background ---
function scrollHeader() {
  const header = document.getElementById("header");
  if (this.scrollY >= 50) header.classList.add("scroll-header");
  else header.classList.remove("scroll-header");
}
window.addEventListener("scroll", scrollHeader);
document.head.insertAdjacentHTML(
  "beforeend",
  `<style>.scroll-header { background-color: #000 !important; box-shadow: 0 2px 10px rgba(0,0,0,0.5); }</style>`,
);

// --- Scroll Reveal Animation ---
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active-anim");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

const animElements = document.querySelectorAll(
  ".section-title, .about-img-box, .about-data, .facility-card, .booking-system, .gallery-item, .testimonial-card, .contact-container",
);

document.head.insertAdjacentHTML(
  "beforeend",
  `
<style>
    .section-title, .about-img-box, .about-data, .facility-card, .booking-system, .gallery-item, .testimonial-card, .contact-container {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
    }
    .active-anim {
        opacity: 1;
        transform: translateY(0);
    }
</style>
`,
);

animElements.forEach((el) => {
  observer.observe(el);
});

/* =========================================
   SPORTS SLOT BOOKING SYSTEM LOGIC
   ========================================= */

// --- Configuration ---
const CONFIG = {
  openingHour: 6,
  closingHour: 26,
  prices: {
    "Box Cricket": 1200,
    Football: 1500,
    Pickleball: 800,
  },
};

// --- DOM Elements ---
const sportSelect = document.getElementById("booking-sport");
const dateInput = document.getElementById("booking-date");
const slotsGrid = document.getElementById("slots-grid");
const selectedDateDisplay = document.getElementById("selected-date-display");
const durationArea = document.getElementById("duration-area");
const durationSelect = document.getElementById("booking-duration");
const customDurationWrapper = document.getElementById(
  "custom-duration-wrapper",
);
const customHoursInput = document.getElementById("custom-hours");
const durationError = document.getElementById("duration-error");

// Summary ELements
const summarySport = document.getElementById("summary-sport");
const summaryDate = document.getElementById("summary-date");
const summaryStartTime = document.getElementById("summary-start-time");
const summaryEndTime = document.getElementById("summary-end-time");
const summaryDuration = document.getElementById("summary-duration");
const summaryRate = document.getElementById("summary-rate");
const summaryPrice = document.getElementById("summary-price");

// Form
const confirmBtn = document.getElementById("confirm-booking-btn");
const detailsForm = document.getElementById("booking-details-form");
const userNameInput = document.getElementById("user-name");
const userPhoneInput = document.getElementById("user-phone");
const userPlayersInput = document.getElementById("user-players");

// Modal
const bookingModal = document.getElementById("booking-modal");
const closeModal = document.getElementById("close-modal");

// --- State ---
let currentBooking = {
  sport: "Box Cricket",
  date: null,
  startTime: null,
  duration: null,
  totalPrice: 0,
};
let currentBookings = [];
let unsubscribe = null;

// --- Firebase Setup ---
// Replace these with your actual Firebase project config settings!
const firebaseConfig = {
  apiKey: "AIzaSyCvOIgGBIEmwlOU53R0iCmrvHXLNjqF-Ec",
  authDomain: "playslot-booking.firebaseapp.com",
  projectId: "playslot-booking",
  storageBucket: "playslot-booking.firebasestorage.app",
  messagingSenderId: "146010584215",
  appId: "1:146010584215:web:3dbfdc85ce911402c0e5d2",
  measurementId: "G-X8HZ77RB2B",
};

// Initialize Firebase once
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// --- Init ---
function initBookingSystem() {
  const today = new Date().toISOString().split("T")[0];
  dateInput.min = today;
  dateInput.value = today;

  sportSelect.addEventListener("change", resetAndUpdate);
  dateInput.addEventListener("change", resetAndUpdate);
  durationSelect.addEventListener("change", handleDurationSelect);
  customHoursInput.addEventListener("change", handleCustomHoursInput);

  detailsForm.addEventListener("submit", handleBookingSubmit);
  closeModal.addEventListener("click", () => {
    bookingModal.classList.remove("active");
    window.location.reload();
  });

  resetAndUpdate();
}

function resetAndUpdate() {
  currentBooking.startTime = null;
  currentBooking.duration = null;
  currentBooking.sport = sportSelect.options[sportSelect.selectedIndex].text;
  currentBooking.date = dateInput.value;

  durationArea.classList.add("hidden");
  customDurationWrapper.classList.add("hidden");
  durationSelect.value = "";
  customHoursInput.value = "";
  confirmBtn.disabled = true;
  confirmBtn.textContent = "Confirm Booking";
  durationError.textContent = "";

  listenForBookings();
}

// --- Logic ---
function listenForBookings() {
  if (unsubscribe) {
    unsubscribe(); // Stop listening to previous query
  }

  if (!currentBooking.date) {
    slotsGrid.innerHTML = "";
    currentBookings = [];
    return;
  }

  slotsGrid.innerHTML = '<div class="slot-loading">Loading slots...</div>';

  unsubscribe = db
    .collection("sportsBookings")
    .where("sport", "==", currentBooking.sport)
    .where("date", "==", currentBooking.date)
    .onSnapshot(
      (snapshot) => {
        currentBookings = [];
        snapshot.forEach((doc) => {
          currentBookings.push(doc.data());
        });
        renderSlots();
        updateSummary();
      },
      (error) => {
        console.error("Error fetching bookings: ", error);
        slotsGrid.innerHTML =
          '<div class="slot-loading">Error loading slots.</div>';
      },
    );
}

function renderSlots() {
  slotsGrid.innerHTML = "";
  selectedDateDisplay.textContent = currentBooking.date
    ? `(${formatDate(currentBooking.date)})`
    : "";

  if (!currentBooking.date) return;

  const bookings = currentBookings;

  for (let h = CONFIG.openingHour; h < CONFIG.closingHour; h++) {
    const slotEl = document.createElement("div");
    slotEl.className = "slot";
    slotEl.textContent = formatTime(h);
    slotEl.dataset.hour = h;

    let isBooked = false;
    for (let b of bookings) {
      const bStartHr = parseTimeStr(b.startTime);
      const bEndHr = bStartHr + b.duration;
      if (h >= bStartHr && h < bEndHr) {
        isBooked = true;
        break;
      }
    }

    if (isBooked) {
      slotEl.classList.add("booked");
      slotEl.title = "Booked";
      slotEl.innerHTML = "Booked";
    } else {
      slotEl.classList.add("available");
      slotEl.addEventListener("click", () => selectStartTime(h));
    }

    slotsGrid.appendChild(slotEl);
  }
}

function parseTimeStr(timeStr) {
  if (!timeStr) return 0;
  const parts = timeStr.trim().split(" ");
  let [hr, min] = parts[0].split(":").map(Number);
  if (parts[1] && parts[1].toUpperCase() === "PM" && hr !== 12) hr += 12;
  if (parts[1] && parts[1].toUpperCase() === "AM" && hr === 12) hr = 0;
  return hr;
}

function selectStartTime(hour) {
  const allSlots = document.querySelectorAll(".slot");
  allSlots.forEach((s) => s.classList.remove("selected"));

  const el = document.querySelector(`.slot[data-hour="${hour}"]`);
  if (el) el.classList.add("selected");

  currentBooking.startTime = hour;
  currentBooking.duration = null;

  durationArea.classList.remove("hidden");
  customDurationWrapper.classList.add("hidden");
  durationSelect.value = "";
  customHoursInput.value = "";
  durationError.textContent = "";

  updateSummary();
}

function handleDurationSelect(e) {
  if (e.target.value === "custom") {
    customDurationWrapper.classList.remove("hidden");
    currentBooking.duration = null;
    updateSummary();
    return;
  }

  customDurationWrapper.classList.add("hidden");
  const hours = parseFloat(e.target.value);
  processDurationSelection(hours);
}

function handleCustomHoursInput(e) {
  const hours = parseFloat(e.target.value);
  if (hours >= 0.5) {
    processDurationSelection(hours);
  } else {
    currentBooking.duration = null;
    updateSummary();
  }
}

function processDurationSelection(hours) {
  durationError.textContent = "";

  if (!currentBooking.startTime) {
    showError("Please select a Start Time first.");
    durationSelect.value = "";
    return;
  }

  if (!checkAvailability(currentBooking.startTime, hours)) {
    showError("Selected time is already booked");
    durationSelect.value = "";
    customHoursInput.value = "";
    currentBooking.duration = null;
    updateSummary();
    return;
  }

  currentBooking.duration = hours;
  updateSummary();
}

function checkAvailability(start, duration) {
  const end = start + duration;
  const bookings = currentBookings;

  for (let b of bookings) {
    const bStartHr = parseTimeStr(b.startTime);
    const bEndHr = bStartHr + b.duration;

    if (Math.max(start, bStartHr) < Math.min(end, bEndHr)) {
      return false;
    }
  }
  return true;
}

function updateSummary() {
  summarySport.textContent = currentBooking.sport;
  summaryDate.textContent = currentBooking.date ? currentBooking.date : "-";

  if (currentBooking.startTime !== null) {
    summaryStartTime.textContent = formatTime(currentBooking.startTime);
  } else {
    summaryStartTime.textContent = "-";
  }

  if (currentBooking.startTime !== null && currentBooking.duration) {
    const endTime = currentBooking.startTime + currentBooking.duration;
    summaryEndTime.textContent = formatTime(endTime);
    summaryDuration.textContent = `${currentBooking.duration} Hr${currentBooking.duration > 1 ? "s" : ""}`;

    let baseRate = CONFIG.prices[currentBooking.sport] || 1000;
    let total = baseRate * currentBooking.duration;
    currentBooking.totalPrice = total;

    summaryRate.textContent = `₹${baseRate}/hr`;
    summaryPrice.textContent = `₹${total}`;

    confirmBtn.disabled = false;
  } else {
    summaryEndTime.textContent = "-";
    summaryDuration.textContent = "-";
    summaryRate.textContent = "-";
    summaryPrice.textContent = "₹0";
    confirmBtn.disabled = true;
  }
}

async function handleBookingSubmit(e) {
  e.preventDefault();

  if (!checkAvailability(currentBooking.startTime, currentBooking.duration)) {
    showError("Slot already booked");
    return;
  }

  confirmBtn.textContent = "Processing...";
  confirmBtn.disabled = true;

  const newBooking = {
    sport: currentBooking.sport,
    date: currentBooking.date,
    startTime: formatTime(currentBooking.startTime),
    duration: currentBooking.duration,
    name: userNameInput.value,
    phone: userPhoneInput.value,
    players: parseInt(userPlayersInput.value),
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  };

  try {
    await db.collection("sportsBookings").add(newBooking);

    bookingModal.classList.add("active");
    confirmBtn.textContent = "Confirmed";
  } catch (error) {
    console.error("Error saving booking: ", error);
    showError("Failed to save booking. Please try again.");
    confirmBtn.textContent = "Confirm Booking";
    confirmBtn.disabled = false;
  }
}

// --- Utils ---
function formatTime(decimalTime) {
  let h = Math.floor(decimalTime);
  let period = h >= 12 && h < 24 ? "PM" : "AM";
  if (h >= 24) {
    h -= 24;
    period = "AM";
  }
  let dispH = h > 12 ? h - 12 : h;
  if (dispH === 0) dispH = 12;
  return `${dispH}:00 ${period}`;
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    weekday: "short",
  });
}

function showError(msg) {
  durationError.textContent = msg;
  durationError.classList.remove("hidden");
  setTimeout(() => (durationError.textContent = ""), 3000);
}

// Run
if (
  document.getElementById("booking-system") ||
  document.querySelector(".booking-system")
) {
  initBookingSystem();
}
