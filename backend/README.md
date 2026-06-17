# BathEase Backend API

REST API for the BathEase bathroom cleaning app — built with **Node.js**, **Express**, and **MongoDB**.

---

## What This Does

- User registration and login with JWT authentication
- Profile management
- Booking creation, listing, status updates, reviews, and cancellations
- Admin-only routes for managing all bookings and staff assignment

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) running locally on port 27017 (or a MongoDB Atlas URI)

---

## Setup

```bash
# 1. Navigate to the backend folder
cd backend

# 2. Install dependencies
npm install

# 3. Copy the example env file and fill in your values
copy .env.example .env

# 4. (Optional) Seed demo users into MongoDB
node seed.js

# 5. Start the development server
npm run dev
```

The API will be available at **http://localhost:5000**.

---

## Environment Variables (`.env`)

| Variable       | Description                          | Default                              |
|----------------|--------------------------------------|--------------------------------------|
| `PORT`         | Port the server runs on              | `5000`                               |
| `MONGODB_URI`  | MongoDB connection string            | `mongodb://localhost:27017/bathease` |
| `JWT_SECRET`   | Secret key for signing JWT tokens    | *(change this in production!)*       |

---

## Demo Credentials (after running `node seed.js`)

| Role  | Email                | Password   |
|-------|----------------------|------------|
| Admin | admin@bathease.in    | admin123   |
| User  | demo@bathease.in     | demo1234   |

---

## API Endpoints

### Health Check

| Method | Path          | Auth | Description        |
|--------|---------------|------|--------------------|
| GET    | /api/health   | No   | Server status check |

---

### Auth — `/api/auth`

#### `POST /api/auth/register`
Register a new user.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response `201`:**
```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "<jwt>"
}
```

---

#### `POST /api/auth/login`
Login and receive a JWT token.

**Body:**
```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response `200`:**
```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "whatsapp": "",
  "address": "",
  "location": "",
  "profileImage": "",
  "token": "<jwt>"
}
```

---

#### `GET /api/auth/me`
Get the currently authenticated user.

**Auth:** Bearer token required

**Response `200`:** User object (no password)

---

#### `POST /api/auth/logout`
Logout confirmation (token removal is handled client-side).

**Response `200`:**
```json
{ "message": "Logged out successfully" }
```

---

### Users — `/api/users`

#### `PUT /api/users/profile`
Update the authenticated user's profile.

**Auth:** Bearer token required

**Body (all fields optional):**
```json
{
  "name": "New Name",
  "whatsapp": "+919876543210",
  "address": "123 MG Road",
  "location": "Bengaluru",
  "profileImage": "data:image/png;base64,..."
}
```

**Response `200`:** Updated user object

---

### Bookings — `/api/bookings`

#### `POST /api/bookings`
Create a new booking.

**Auth:** Bearer token required

**Body:**
```json
{
  "bookingId": "BE-1234",
  "bathroomCount": 2,
  "miniServices": ["toilet_scrub", "mirror_clean"],
  "date": "2024-06-15",
  "slot": "09:00 AM - 11:00 AM",
  "address": "123 Main Street",
  "whatsapp": "+919876543210",
  "paymentMethod": "upi",
  "price": {
    "bathroomSubtotal": 800,
    "miniSubtotal": 200,
    "subtotal": 1000,
    "taxes": 180,
    "total": 1180,
    "offersApplied": []
  }
}
```

**Response `201`:** Created booking object

---

#### `GET /api/bookings/my`
Get all bookings belonging to the logged-in user.

**Auth:** Bearer token required

**Response `200`:** Array of booking objects (newest first)

---

#### `GET /api/bookings`
Get all bookings (admin only).

**Auth:** Bearer token required + admin role

**Response `200`:** Array of all booking objects (newest first)

---

#### `PUT /api/bookings/:id`
Update a booking's status or assigned staff (admin only).

`id` = bookingId (e.g. `BE-1234`)

**Auth:** Bearer token required + admin role

**Body:**
```json
{
  "status": "in_progress",
  "assignedStaff": "Ramesh"
}
```

**Response `200`:** Updated booking object

---

#### `PUT /api/bookings/:id/review`
Add a review to a completed booking.

`id` = bookingId (e.g. `BE-1234`)

**Auth:** Bearer token required (booking must belong to user)

**Body:**
```json
{
  "rating": 5,
  "comment": "Excellent service!"
}
```

**Response `200`:** Updated booking object

---

#### `PUT /api/bookings/:id/cancel`
Cancel a pending or confirmed booking.

`id` = bookingId (e.g. `BE-1234`)

**Auth:** Bearer token required (booking must belong to user)

**Response `200`:** Updated booking object with `status: "cancelled"`

---

## Authentication

All protected routes require an `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

Tokens expire after **7 days**.

---

## Status Flow

```
pending → confirmed → in_progress → completed
                    ↘ cancelled
```

Admin can move a booking to any status. Users can only cancel their own bookings (if not yet completed/cancelled).
