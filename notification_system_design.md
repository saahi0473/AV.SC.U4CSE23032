# Notification System Design

## Stage 1 – Priority Inbox

### Problem
Users lose track of important notifications because of the high volume. The app needs to always show the top 10 most important unread notifications first.

### Approach

**Priority Logic:**
Notifications are scored and ranked by two factors:
1. **Type weight** (higher = more important):
   - Placement → 3
   - Result → 2
   - Event → 1
2. **Recency** — for the same type, newer notifications appear first (timestamp descending)

**Top-N Display:**
After sorting, only the top N notifications are shown (default 10, user can choose 15 or 20).

**Filtering:**
Users can filter by type (Placement / Event / Result / All) before the top-N is applied.

**Seen/Unread Tracking:**
Notification IDs are stored in `localStorage` when the user first views them.
New (unread) notifications are highlighted with a blue left border. Previously seen ones appear dimmed.

**Handling new incoming notifications:**
When the user hits "Refresh", the app re-fetches from the API and merges with what was already seen. Any new notification ID not in `localStorage` is treated as unread and moves to the top of the visual list.

The priority sort ensures that even as new notifications stream in, the top 10 will always reflect the most impactful ones (Placement first, then Result, then Event), and within the same type, the most recent wins.

### Code File
- `notification_app_fe/app.js` → `sortByPriority()` and `renderNotifications()`

### Screenshots

**1. Initial Load — Priority Inbox with notifications from API**
![Initial Load](notification_app_fe/screenshots/01_initial_load.png)

**2. Sending a Placement notification**
![Send Notification](notification_app_fe/screenshots/02_notification_sent.png)

**3. Filtered view — Placement only**
![Filter Placement](notification_app_fe/screenshots/03_filter_placement.png)

**4. Refreshed view — Top 15, Placement filter**
![Refresh Top 15](notification_app_fe/screenshots/04_refresh_top15.png)

---

## Stage 2: React/Next.js Frontend

### Requirements Addressed
1. **React Framework**: Migrated the vanilla HTML/JS application to Next.js 14+ (App Router).
2. **Component Architecture**: 
   - Created reusable `<NotificationCard />` component.
   - Built dual-page structure: `/` (All Notifications) and `/priority` (Priority Inbox).
3. **Material UI Integration**: Implemented a sleek Dark Theme exclusively using `@mui/material` and `@emotion`. Handled Next.js Server Components CSS hydration correctly using `<ThemeRegistry>`.
4. **API Proxy**: Configured `next.config.mjs` with rewrites (`/api-proxy/`) to seamlessly bypass CORS errors when interacting with `http://20.207.122.201`.
5. **Pagination & Filtering**: 
   - "All Notifications" page passes dynamic `limit`, `page`, and `notification_type` to the backend.
   - "Priority Inbox" limits display to Top 5/10/15/20 and sorts locally by Placement > Result > Event logic.
6. **Logging Middleware Integration**: Adapted the `logging.js` logic directly inside `src/lib/logger.js` to avoid Turbopack strict ESM module resolution errors, ensuring extensive telemetry logging to the evaluation server.

### Deliverables
- The React application resides in `notification_app_fe_react/`.
- Runs exclusively on `http://localhost:3000`.
- A video demonstration recording (`recording.webp`) is committed to the repository showcasing desktop and mobile responsiveness.
