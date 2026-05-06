import fetch from "node-fetch";
global.fetch = fetch;
import { Log } from "./logger.js";

// Page load
Log("frontend", "info", "ui", "Homepage loaded");

// API success
Log("frontend", "info", "api", "Fetched notifications successfully");

// Warning
Log("frontend", "warn", "api", "Slow API response detected");

// Error
Log("frontend", "error", "api", "Failed to fetch notifications");

// Debug
Log("frontend", "debug", "component", "Button clicked");