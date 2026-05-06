# Campus Notification App - Frontend

## How to Run

1. Open `index.html` in a browser using **Live Server** (VS Code extension) or any local HTTP server.
   - Do NOT open as a plain `file://` URL — ES module imports won't work from `file://`.
   - Recommended: right-click `index.html` in VS Code → "Open with Live Server"

2. The app will:
   - Fetch notifications from the evaluation API on load
   - Show them sorted by priority (Placement > Result > Event) then by time
   - Let you filter by type and show top 10/15/20
   - Let you type and send a local notification (logged via middleware)

## Logging

All key events are logged using the reusable `Log()` from `../logging_middleware/logging.js`:

| Event               | Level  | Package   |
|---------------------|--------|-----------|
| Page load           | info   | ui        |
| Button click        | debug  | component |
| API success         | info   | api       |
| API error           | error  | api       |
| Empty input warning | warn   | ui        |
| Notification sent   | info   | component |
