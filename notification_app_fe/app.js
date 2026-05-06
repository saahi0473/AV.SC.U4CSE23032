// app.js - Campus Notification App (Frontend)
// Imports the reusable logger from logging_middleware

import { Log } from "../logging_middleware/logging.js";

// ---------- Config ----------
const CLIENT_ID = "002d6e87-d529-47d6-b4ef-3340b745c98a";
const CLIENT_SECRET = "sHnVHVXwSXTFxuNJ";
const AUTH_URL = "http://20.207.122.201/evaluation-service/auth";
const API_URL = "http://20.207.122.201/evaluation-service/notifications";

// ---------- Token Management ----------
// Store the token in memory (refreshed automatically when expired)
let accessToken = localStorage.getItem("access_token") || "";
let tokenExpiry = parseInt(localStorage.getItem("token_expiry") || "0");

async function getValidToken() {
  const now = Math.floor(Date.now() / 1000);

  // If token exists and hasn't expired yet, reuse it
  if (accessToken && tokenExpiry > now + 60) {
    return accessToken;
  }

  // Token is missing or expired — fetch a new one
  Log("frontend", "info", "api", "Token expired or missing, fetching new token");

  try {
    const res = await fetch(AUTH_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        email: "av.sc.u4cse23032@av.students.amrita.edu",
        name: "nayudu baby deepika reddy",
        rollNo: "av.sc.u4cse23032",
        accessCode: "PTBMmQ"
      }),
    });

    if (!res.ok) {
      throw new Error(`Auth failed: ${res.status}`);
    }

    const data = await res.json();
    accessToken = data.access_token;
    tokenExpiry = data.expires_in; // the API returns epoch time of expiry directly

    // Persist so page refreshes don't re-auth unnecessarily
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("token_expiry", tokenExpiry);

    Log("frontend", "info", "api", "New access token obtained successfully");
    return accessToken;

  } catch (err) {
    Log("frontend", "error", "api", `Token refresh failed: ${err.message}`);
    throw err;
  }
}

// ---------- State ----------
// Tracks which notification IDs the user has already seen
const seenIds = new Set(JSON.parse(localStorage.getItem("seenIds") || "[]"));

// All notifications fetched from API
let allNotifications = [];

// ---------- Priority Sorting ----------
// Placement > Result > Event, then by recency
const TYPE_WEIGHT = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

function getWeight(type) {
  return TYPE_WEIGHT[type] || 0;
}

function sortByPriority(notifications) {
  return [...notifications].sort((a, b) => {
    const weightDiff = getWeight(b.Type) - getWeight(a.Type);
    if (weightDiff !== 0) return weightDiff;
    // same type → sort by timestamp descending (newer first)
    return new Date(b.Timestamp) - new Date(a.Timestamp);
  });
}

// ---------- Fetch from API ----------
async function fetchNotifications() {
  Log("frontend", "debug", "api", "fetchNotifications() called");

  const listEl = document.getElementById("notif-list");
  listEl.innerHTML = '<p class="empty-msg">Loading...</p>';

  try {
    const token = await getValidToken();

    const res = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const data = await res.json();
    allNotifications = data.notifications || [];

    Log("frontend", "info", "api", `Fetched ${allNotifications.length} notifications from API`);

    renderNotifications();
  } catch (err) {
    Log("frontend", "error", "api", `Failed to fetch notifications: ${err.message}`);
    listEl.innerHTML = `<p class="empty-msg" style="color:#c5221f;">
      Failed to load notifications: ${err.message}
    </p>`;
  }
}

// ---------- Render Notifications ----------
function renderNotifications() {
  const listEl = document.getElementById("notif-list");
  const countEl = document.getElementById("notif-count");
  const topN = parseInt(document.getElementById("top-n").value);
  const filterType = document.getElementById("filter-type").value;

  // Filter by type if needed
  let filtered = allNotifications;
  if (filterType !== "All") {
    filtered = allNotifications.filter((n) => n.Type === filterType);
  }

  // Sort by priority (Placement > Result > Event) then recency
  const sorted = sortByPriority(filtered);

  // Take only top N
  const topNotifs = sorted.slice(0, topN);

  countEl.textContent = topNotifs.length;

  if (topNotifs.length === 0) {
    listEl.innerHTML = '<p class="empty-msg">No notifications found.</p>';
    return;
  }

  listEl.innerHTML = "";

  topNotifs.forEach((notif) => {
    const isNew = !seenIds.has(notif.ID);
    const card = document.createElement("div");
    card.className = `notif-card ${isNew ? "new" : "seen"}`;

    const time = new Date(notif.Timestamp).toLocaleString();

    card.innerHTML = `
      <div class="notif-body">
        <p class="notif-message">${escapeHtml(notif.Message)}</p>
        <p class="notif-meta">${time}</p>
      </div>
      <span class="notif-type-badge type-${notif.Type}">${notif.Type}</span>
    `;

    // Mark as seen when user sees it
    seenIds.add(notif.ID);

    listEl.appendChild(card);
  });

  // Persist seen IDs in localStorage
  localStorage.setItem("seenIds", JSON.stringify([...seenIds]));
}

// ---------- Send Notification ----------
function handleSend() {
  Log("frontend", "debug", "component", "Send Notification button clicked");

  const input = document.getElementById("notif-input");
  const typeSelect = document.getElementById("notif-type");
  const statusEl = document.getElementById("status-msg");

  const message = input.value.trim();
  const type = typeSelect.value;

  // Validation
  if (!message) {
    statusEl.textContent = "Please enter a message before sending.";
    statusEl.className = "status-msg error";
    Log("frontend", "warn", "component", "User tried to send empty notification");
    return;
  }

  // Build a notification object (no real backend, so we add it locally)
  const newNotif = {
    ID: generateId(),
    Type: type,
    Message: message,
    Timestamp: new Date().toISOString().replace("T", " ").slice(0, 19),
  };

  // Add to top of list
  allNotifications.unshift(newNotif);

  // Clear input
  input.value = "";
  statusEl.textContent = `✔ Notification sent (${type}): "${newNotif.Message}"`;
  statusEl.className = "status-msg success";

  Log("frontend", "info", "component", `Notification sent: [${type}] ${message}`);

  // Re-render
  renderNotifications();

  // Clear status after 3s
  setTimeout(() => {
    statusEl.textContent = "";
    statusEl.className = "status-msg";
  }, 3000);
}

// ---------- Helpers ----------
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function generateId() {
  return "local-" + Math.random().toString(36).slice(2, 10);
}

// ---------- Expose to HTML onclick ----------
window.handleSend = handleSend;
window.renderNotifications = renderNotifications;
window.fetchNotifications = fetchNotifications;

// ---------- Page Load ----------
Log("frontend", "info", "component", "Campus Notification App loaded");
fetchNotifications();

// Allow Enter key to send
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("notif-input");
  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleSend();
    });
  }
});
