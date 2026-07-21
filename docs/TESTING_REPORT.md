# Testing Report — Rashid Dental Clinic

All testing was performed manually using Thunder Client (API level) and browser testing (UI level, including Chrome DevTools mobile simulation), against both the local and live deployed environments.

## Authentication & Authorization

| Test | Result |
|---|---|
| Register with valid data | ✅ 201, user created, token returned |
| Register with duplicate email | ✅ 400, rejected |
| Login with correct credentials | ✅ 200, token returned |
| Login with wrong password | ✅ 401, rejected |
| Access protected route without token | ✅ 401, rejected |
| Patient token accessing admin-only route | ✅ 403, rejected |
| Admin token accessing admin-only route | ✅ 200, allowed |

## Appointment Booking

| Test | Result |
|---|---|
| Book appointment with valid data | ✅ 201, booking created, correct end time calculated |
| Book a date in the past | ✅ 400, rejected |
| Book the same doctor/date/time twice | ✅ Second attempt returns 409 Conflict |
| Patient cancels own appointment | ✅ 200, status updated to cancelled |
| Patient attempts to cancel another patient's appointment | ✅ 403, rejected |
| Admin confirms a pending appointment | ✅ 200, status updated, email sent |
| Admin views all appointments with status filter | ✅ Correct filtered results returned |

## Email Notifications

| Test | Result |
|---|---|
| Booking creates a "pending" email | ✅ Received in real inbox |
| Admin confirmation triggers a "confirmed" email | ✅ Received in real inbox |
| Email sending failure (invalid test address) | ✅ Logged as a warning, does not crash the server or block the API response |

## Frontend

| Test | Result |
|---|---| 
| Full patient flow: register → book → view → cancel | ✅ Works end to end on live deployment |
| Full admin flow: login → view dashboard stats → manage appointment | ✅ Works end to end on live deployment |
| Mobile responsive check (iPhone 12 simulation) | ✅ Navbar collapses into a working hamburger menu; layout usable on small screens |
| Route protection (patient visiting `/admin`) | ✅ Redirected to home |
| Route protection (guest visiting `/profile`) | ✅ Redirected to login |

## Known limitations

- Render's free tier "spins down" the backend after inactivity, causing a 30-60 second delay on the first request after idle time. This is a hosting-tier tradeoff, not an application bug.
- Test data (some doctors/services created during development) was cleaned up before final submission via the admin dashboard and MongoDB Atlas.
