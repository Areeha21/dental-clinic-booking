# Rashid Dental Clinic — Appointment Booking System

A full-stack dental appointment booking and management system built with the MERN stack (MongoDB, Express, React, Node.js).

## Live URLs

- **Frontend:** https://YOUR-FRONTEND-URL.onrender.com
- **Backend API:** https://rashid-dental-clinic-78h6.onrender.com

## Test Credentials

**Patient account:**
- Email: test@example.com
- Password: password123

**Admin account:**
- Email: (your admin test account email)
- Password: (your admin test account password)

> Note: the admin role was assigned manually in the database for testing, since registration always creates patient accounts by design (a security requirement — admins should not be self-registerable).

## Tech Stack

- **Frontend:** React (Vite), React Router, Tailwind CSS, Axios
- **Backend:** Node.js, Express, JWT authentication, bcrypt password hashing
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Email:** Nodemailer with Gmail SMTP
- **Deployment:** Render (Web Service for backend, Static Site for frontend)

## Features

- Patient registration, login, and profile management
- Browse services and doctors
- Multi-step appointment booking (service → doctor → date/time)
- Patient appointment history with cancellation
- Admin dashboard with live statistics
- Admin appointment management (confirm, reject, complete, cancel) with filtering
- Admin doctor and service management (create, deactivate)
- Automated email notifications on booking and status changes
- Role-based access control (patient vs. admin) enforced at the API level
- Double-booking prevention (same doctor + date + time slot blocked at the database level)
- Responsive design (mobile and desktop)

## Local Setup Instructions

### Backend

```
cd server
npm install
```

Create a `.env` file in `server/` based on `.env.example`:

```
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
EMAIL_USER=your_gmail_address
EMAIL_APP_PASSWORD=your_gmail_app_password
```

Then run:

```
node server.js
```

### Frontend

```
cd client
npm install
```

Create a `.env` file in `client/`:

```
VITE_API_URL=http://localhost:5000/api
```

Then run:

```
npm run dev
```

## Deployment Notes

- Backend deployed as a Render Web Service (root directory: `server`, build command: `npm install`, start command: `npm start`)
- Frontend deployed as a Render Static Site (root directory: `client`, build command: `npm install && npm run build`, publish directory: `dist`), with a rewrite rule (`/*` → `/index.html`) so React Router routes work on refresh/direct navigation
- MongoDB Atlas Network Access set to allow all IPs (0.0.0.0/0), since Render's servers don't have a fixed IP
- Environment variables added directly through the Render dashboard for both services, since `.env` files are excluded from Git

## Business Rules Implemented

- Patients cannot book appointments in the past
- Two appointments cannot be booked for the same doctor at the same date/time (enforced via a unique compound database index)
- Patients can only view and cancel their own appointments
- Only administrators can confirm, reject, reschedule, or complete appointments
- Cancelled slots become available again automatically (the index only blocks active statuses)
- All appointment status changes trigger an email notification to the patient
