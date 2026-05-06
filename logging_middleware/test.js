import fetch from "node-fetch";
// polyfill fetch for Node.js environment
global.fetch = fetch;

import { Log } from "./logging.js";  // fixed: was ./logger.js

// Page load
await Log("frontend", "info", "component", "Homepage loaded");

// API success
await Log("frontend", "info", "api", "Fetched notifications successfully");

// Warning
await Log("frontend", "warn", "api", "Slow API response detected");

// Error
await Log("frontend", "error", "api", "Failed to fetch notifications");

// Debug
await Log("frontend", "debug", "component", "Button clicked");

console.log("All test logs sent!");