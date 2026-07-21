# API Documentation — Rashid Dental Clinic

Base URL (local): `http://localhost:5000/api`
Base URL (live): `https://rashid-dental-clinic-78h6.onrender.com/api`

All responses follow this structure:
```json
{ "success": true, "message": "...", "data": {} }
```

## Authentication (`/auth`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Register a new patient account |
| POST | `/auth/login` | Public | Log in and receive a JWT token |

**Register body:** `{ name, email, phone, password }`
**Login body:** `{ email, password }`

## Doctors (`/doctors`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/doctors` | Public | List all active doctors |
| GET | `/doctors/:id` | Public | Get a single doctor |
| POST | `/doctors` | Admin only | Create a doctor |
| PUT | `/doctors/:id` | Admin only | Update a doctor |
| DELETE | `/doctors/:id` | Admin only | Deactivate a doctor |

## Services (`/services`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/services` | Public | List all active services |
| GET | `/services/:id` | Public | Get a single service |
| POST | `/services` | Admin only | Create a service |
| PUT | `/services/:id` | Admin only | Update a service |
| DELETE | `/services/:id` | Admin only | Deactivate a service |

## Appointments (`/appointments`)

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/appointments` | Logged-in patient | Book a new appointment |
| GET | `/appointments/my` | Logged-in patient | View own appointments |
| PATCH | `/appointments/:id/cancel` | Logged-in patient (owner only) | Cancel own appointment |
| GET | `/appointments/admin/all` | Admin only | View all appointments (supports `?status=&doctor=&service=&date=` filters) |
| PATCH | `/appointments/admin/:id/status` | Admin only | Confirm, reject, reschedule, cancel, or complete an appointment |

**Booking body:** `{ doctor, service, appointmentDate, startTime, reason }`
**Status update body:** `{ status, cancellationReason?, appointmentDate?, startTime? }`

## Authentication header

Protected routes require:
```
Authorization: Bearer <token>
```
The token is returned from `/auth/register` or `/auth/login`.

## Business rules enforced at the API level

- Bookings in the past are rejected (`400`)
- Double-booking the same doctor/date/time returns `409 Conflict`
- Patients can only view/cancel their own appointments (`403` otherwise)
- Only admin-role tokens can access `/admin/*` routes (`403` otherwise)
