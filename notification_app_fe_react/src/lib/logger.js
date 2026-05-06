// Extracted Logging Middleware
const CLIENT_ID = "002d6e87-d529-47d6-b4ef-3340b745c98a";
const CLIENT_SECRET = "sHnVHVXwSXTFxuNJ";
const AUTH_URL = "/api-proxy/auth";
const LOG_URL = "/api-proxy/logs";

let _token = "";
let _tokenExpiry = 0;

async function getToken() {
    const now = Math.floor(Date.now() / 1000);
    if (_token && _tokenExpiry > now + 60) return _token;

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
        })
    });

    if (!res.ok) throw new Error(`Auth failed: ${res.status}`);

    const data = await res.json();
    _token = data.access_token;
    _tokenExpiry = data.expires_in;

    return _token;
}

export async function Log(stack, level, pkg, message) {
    try {
        const token = await getToken();
        const response = await fetch(LOG_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                stack: stack.toLowerCase(),
                level: level.toLowerCase(),
                package: pkg.toLowerCase(),
                message: message
            })
        });
        const data = await response.json();
        console.log("Log sent:", data);
    } catch (error) {
        console.error("Log failed:", error.message);
    }
}
