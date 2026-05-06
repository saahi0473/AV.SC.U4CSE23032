export const CLIENT_ID = "002d6e87-d529-47d6-b4ef-3340b745c98a";
export const CLIENT_SECRET = "sHnVHVXwSXTFxuNJ";
export const AUTH_URL = "/api-proxy/auth";
export const API_URL = "/api-proxy/notifications";

let accessToken = "";
let tokenExpiry = 0;

export async function getValidToken() {
  const now = Math.floor(Date.now() / 1000);

  // If running in browser, try to load from localStorage first
  if (typeof window !== "undefined") {
    if (!accessToken) {
      accessToken = localStorage.getItem("access_token") || "";
      tokenExpiry = parseInt(localStorage.getItem("token_expiry") || "0");
    }
  }

  if (accessToken && tokenExpiry > now + 60) {
    return accessToken;
  }

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
    tokenExpiry = data.expires_in;

    if (typeof window !== "undefined") {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("token_expiry", tokenExpiry);
    }

    return accessToken;
  } catch (err) {
    console.error("Token refresh failed:", err);
    throw err;
  }
}

export async function fetchNotifications({ page = 1, limit = 10, notification_type = "" } = {}) {
  const token = await getValidToken();
  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (notification_type && notification_type !== "All") params.append("notification_type", notification_type);

  const url = `${API_URL}?${params.toString()}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP error: ${res.status}`);
  }

  const data = await res.json();
  return data.notifications || [];
}
