Here is a comprehensive documentation guide tailored for your Next.js frontend developer. You can share this document directly with them.

-----

# Frontend Integration Guide: Chhattisgarh Shadi (Next.js)

## 1\. Project Overview

We are building the web frontend for **Chhattisgarh Shadi**, a matrimonial platform. The backend is fully deployed and ready for integration.

  * **Backend Base URL (Production):** `https://chhattisgarhshadi-backend.onrender.com/api/v1`
  * **Socket URL:** `https://chhattisgarhshadi-backend.onrender.com`
  * **Tech Stack:** Next.js (App Router recommended), TypeScript, Tailwind CSS.

-----

## 2\. Environment Setup

Create a `.env.local` file in your Next.js root. Do not commit this file.

```env
# Backend API URL
NEXT_PUBLIC_API_URL=https://chhattisgarhshadi-backend.onrender.com/api/v1

# Socket.io URL (Same as domain, no /api/v1)
NEXT_PUBLIC_SOCKET_URL=https://chhattisgarhshadi-backend.onrender.com

# Google OAuth (Required for react-oauth/google or next-auth)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-web-client-id-from-console
```

> **Note:** Ensure the Google Client ID matches the one whitelisted in the backend for the "Web" platform.

-----

## 3\. Authentication Implementation (Google OAuth)

The backend uses **Google OAuth 2.0 Authorization Code Flow**.

### Recommended Library

Use `@react-oauth/google` or `next-auth` (with a custom provider to forward the code to our backend).

### The Flow

1.  **Frontend:** Trigger Google Login to get an `authorizationCode`.
2.  **Frontend:** POST this code to the backend.
3.  **Backend:** Returns an `accessToken` (JWT) and `user` object.
4.  **Frontend:** Store `accessToken` (HttpOnly cookie via Server Actions or secure storage).

### Code Example (API Call)

```typescript
// src/services/auth.ts
import axios from 'axios';

export const loginWithGoogle = async (authCode: string) => {
  const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/google`, {
    authorizationCode: authCode,
    redirectUri: window.location.origin, // e.g., http://localhost:3000
    deviceInfo: {
      deviceType: 'WEB',
      userAgent: navigator.userAgent
    }
  });
  
  return response.data; // Contains { accessToken, refreshToken, user, isNewUser }
};
```

**Important:** If `response.data.isNewUser` is `true`, redirect the user to the **Profile Creation** page immediately.

-----

## 4\. API Integration Strategy

### Headers

All protected routes require the Authorization header.

```javascript
// Axios Interceptor Example
api.interceptors.request.use((config) => {
  const token = // get token from storage/cookies
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Token Refresh

The `accessToken` expires in **15 minutes**. You must handle `401 Unauthorized` errors silently:

1.  Catch 401 error.
2.  Call `POST /auth/refresh` with the stored `refreshToken`.
3.  Save the new token and retry the original request.
4.  If refresh fails, log the user out.

-----

## 5\. Real-Time Features (Socket.io)

We use Socket.io for Chat and Notifications.

### Connection

Connect only when the user is authenticated.

```typescript
import { io } from 'socket.io-client';

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
  transports: ['websocket'],
  auth: {
    token: accessToken // Must send JWT here
  }
});

socket.on('connect', () => {
  console.log('Connected to socket');
});
```

### Key Events

  * **Send Message:** `socket.emit('message:send', { receiverId: 123, content: "Hello" })`
  * **Receive Message:** `socket.on('message:received', (msg) => { ... })`
  * **Typing:** `socket.emit('typing:started', { receiverId })`
  * **Notifications:** `socket.on('notification:received', (notif) => { ... })`

-----

## 6\. Key Features to Develop

### A. Profile Management

  * **Create Profile:** Multi-step form for Bio, Religion, Location, etc. (`POST /profiles`)
  * **Photo Upload:** Use `FormData` to upload images to `POST /uploads/profile-photo`.
      * *Constraint:* Max 5MB, standard image formats.

### B. Discovery & Matching

  * **Search:** Create a filterable list (Age, Caste, City) calling `GET /users/search`.
  * **Interaction:** Add buttons to Send Match Request (`POST /matches`).

### C. Chat Interface

  * **UI:** A responsive chat window (like WhatsApp/Telegram).
  * **Logic:**
    1.  Fetch history via `GET /messages/:userId`.
    2.  Append new messages via Socket.io `message:received`.
    3.  Handle "Is Typing" indicators.

### D. Payments (Razorpay)

1.  Call `POST /payments/orders` with `planId` to get an Order ID.
2.  Open Razorpay Modal using the standard Razorpay.js library.
3.  On success, the backend webhook handles activation. You can poll `GET /users/me` to check for the `PREMIUM_USER` role update.

-----

## 7\. Type Definitions (DTOs)

Reference these types for TypeScript interfaces:

```typescript
interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'USER' | 'PREMIUM_USER' | 'ADMIN';
  profile?: Profile;
  isActive: boolean;
}

interface Profile {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  gender: 'MALE' | 'FEMALE';
  profileCompleteness: number; // 0-100
  media: Media[]; // Array of photos
}

interface Media {
  id: number;
  url: string;
  isProfilePicture: boolean;
}
```

-----

## 8\. Troubleshooting

  * **CORS Errors:** The backend allows requests from any origin (`*`) in development, but ensure your request headers are clean.
  * **Socket Connection Fails:** Ensure the `auth.token` is valid and not expired.
  * **Images Not Loading:** The backend returns full S3/Cloudinary URLs. Use `next/image` with the domain configured in `next.config.js`.