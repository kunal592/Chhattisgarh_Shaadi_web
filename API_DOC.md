Here is the complete, frontend-focused API documentation for the Chhattisgarh Shadi backend, based on the provided repository files.

## 1. System Summary

### Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JSON Web Tokens (JWT) with Google OAuth 2.0
- **Realtime:** Socket.io
- **File Uploads:** Multer with local storage.
- **Payments:** Razorpay
- **SMS/OTP:** MSG91

### Authentication Flow

Authentication is **Google OAuth 2.0 ONLY**.

1.  **Frontend Sign-In:** The React Native app uses a Google Sign-In SDK (`@react-oauth/google`) to get an `idToken`.
2.  **Backend Auth:** The frontend sends a `POST` request to `/api/v1/auth/google` with the `idToken`.
3.  **User Creation/Login:** The backend verifies the token with Google, finds or creates a `User`, and generates two JWTs:
    *   **`accessToken`**: Short-lived (15 minutes), used for API authorization.
    *   **`refreshToken`**: Long-lived (7 days), stored in the database.
4.  **Response:** The backend returns the `user` object, `accessToken`, and `refreshToken`.
5.  **Authenticated Requests:** The frontend must store the tokens. All subsequent requests to protected endpoints must include the `Authorization: Bearer <accessToken>` header.
6.  **Token Refresh:** When the `accessToken` expires, the frontend sends the `refreshToken` to `POST /api/v1/auth/refresh` to get a new pair of tokens.

### Key Middleware
- **Validation:** All requests are validated with `zod`. A `422` error is returned for failed validation.
- **Authorization**:
    - `authenticate`: Base-level JWT verification. Required for almost all routes.
    - `requireCompleteProfile`: Requires a profile completeness score of `50`. Used for all social interaction routes (matching, messaging, searching).
    - `requireSubscription`: Requires an active subscription for premium features.

-----

## 2. API Endpoints Documentation

**Base URL:** `/api/v1`

### Health Check
- `GET /health`: Checks API health.

### Authentication (`/auth`)
- `POST /auth/google`: Primary login/registration endpoint.
- `POST /auth/refresh`: Renews an expired `accessToken`.
- `POST /auth/logout`: Logs the user out.
- `POST /auth/phone/send-otp`: Sends a one-time phone verification OTP (post-login).
- `POST /auth/phone/verify-otp`: Verifies the OTP.

### User & Profile Management (`/users`, `/profiles`)
- `GET /users/me`: Gets the full profile of the authenticated user.
- `PUT /users/me`: Updates limited user fields (language, profile picture).
- `POST /profiles`: **(One-Time Setup)** Creates the main profile after registration.
- `GET /profiles/me`: Gets the authenticated user's own full profile with all related data.
- `PUT /profiles/me`: Updates the authenticated user's profile.
- `GET /profiles/search`: Provides advanced, paginated search for profiles.
- `GET /profiles/:userId`: Gets a specific user's full public profile.

### Education & Occupation (`/education`, `/occupation`)
- `POST /education`: Adds a new education entry.
- `GET /education`: Gets all education entries for the authenticated user.
- `PUT /education/:id`: Updates an education entry.
- `DELETE /education/:id`: Deletes an education entry.
- `POST /occupation`: Adds a new occupation entry.
- `GET /occupation`: Gets all occupation entries for the user.
- `PUT /occupation/:id`: Updates an occupation entry.
- `DELETE /occupation/:id`: Deletes an occupation entry.

### Partner Preferences (`/preference`)
- `GET /preference`: Gets the user's partner preferences.
- `PUT /preference`: Creates or updates (upserts) the partner preferences.

### Social Interactions (`/shortlist`, `/block`, `/report`, `/view`)
- `POST /shortlist`: Adds a user to the shortlist.
- `GET /shortlist`: Gets the user's shortlist.
- `DELETE /shortlist/:shortlistedUserId`: Removes a user from the shortlist.
- `POST /block`: Blocks another user.
- `GET /block`: Gets the list of blocked users.
- `DELETE /block/:blockedId`: Unblocks a user.
- `POST /report`: Submits a report against another user.
- `POST /view`: Logs a profile view.
- `GET /view/who-viewed-me`: Gets users who viewed the authenticated user's profile.

### Premium Requests (`/contact-request`, `/photo-request`)
- `POST /contact-request`: Requests access to a user's contact information (Requires Subscription).
- `GET /contact-request/sent`: Gets sent contact requests.
- `GET /contact-request/received`: Gets received contact requests.
- `POST /contact-request/:id/respond`: Responds to a contact request.
- `POST /photo-request`: Requests to view a private photo (Requires Subscription).
- `GET /photo-request/sent`: Gets sent photo requests.
- `GET /photo-request/received`: Gets received photo requests.
- `POST /photo-request/:id/respond`: Responds to a photo request.

### Matches (`/matches`)
- `POST /matches`: Sends a match request to another user.
- `GET /matches/sent`: Gets sent match requests.
- `GET /matches/received`: Gets received match requests.
- `GET /matches/accepted`: Gets all accepted matches (connections).
- `POST /matches/:matchId/accept`: Accepts a received match request.
- `POST /matches/:matchId/reject`: Rejects a received match request.
- `DELETE /matches/:matchId`: Deletes an accepted match (unmatch).

### Messages (`/messages`)
- `POST /messages`: Sends a chat message to another user.
- `GET /messages/conversations`: Gets a list of all chat conversations.
- `GET /messages/unread-count`: Gets the total count of unread messages.
- `GET /messages/:userId`: Gets the chat history with a specific user.
- `PUT /messages/:userId/read`: Marks all messages from a user as read.
- `DELETE /messages/:messageId`: Deletes a single message (soft delete).

### Notifications (`/notifications`)
- `GET /notifications`: Gets a paginated list of notifications.
- `GET /notifications/unread-count`: Gets the count of unread notifications.
- `PUT /notifications/read-all`: Marks all notifications as read.
- `PUT /notifications/:notificationId/read`: Marks a single notification as read.

### Payments (`/payments`, `/plans`)
- `GET /plans`: Gets the list of available subscription plans.
- `POST /payments/orders`: Creates a Razorpay payment order.
- `POST /payments/verify`: Verifies a successful payment from the frontend.
- `POST /payments/webhook`: **Webhook only.** Activates subscription upon payment confirmation.

### Privacy & Settings
- `GET /privacy/profile`, `PUT /privacy/profile`: Manage profile privacy.
- `GET /privacy/communication`, `PUT /privacy/communication`: Manage communication preferences.
- `GET /privacy/search`, `PUT /privacy/search`: Manage search visibility.
- `GET /settings/notifications`, `PUT /settings/notifications`: Manage notification preferences.
- `GET /photos/:mediaId/privacy`, `PUT /photos/:mediaId/privacy`: Manage per-photo privacy.

### File Uploads (`/uploads`)
- `POST /uploads/profile-photo`: Uploads a single profile photo (`multipart/form-data`).
- `POST /uploads/profile-photos`: Uploads multiple gallery photos (`multipart/form-data`).
- `POST /uploads/id-proof`: Uploads a private ID proof document (`multipart/form-data`).

-----

## 3. Realtime / WebSocket API

-   **Connect URL:** Use the same base URL as the API.
-   **Transport:** Must use `transports: ['websocket']`.
-   **Authentication:** The client **must** pass the `accessToken` on connection:
    ```javascript
    import io from 'socket.io-client';

    const socket = io(SOCKET_URL, {
      auth: {
        token: "your_access_token_here"
      },
      transports: ['websocket']
    });
    ```

### Events to Send (Client → Server)
| Event | Payload |
| :--- | :--- |
| `message:send` | `{ receiverId: number, content: string }` |
| `typing:started` | `{ receiverId: number }` |
| `typing:stopped` | `{ receiverId: number }` |

### Events to Receive (Server → Client)
| Event | Payload |
| :--- | :--- |
| `message:received` | `MessageObject` |
| `user:online` | `{ userId: number }` |
| `user:offline` | `{ userId: number }` |
| `typing:started` | `{ userId: number }` |
| `typing:stopped` | `{ userId: number }` |

-----
## 4. Error Handling Guide

All errors are returned in a standardized `ApiResponse` format.

**Standard Error Response:**
```json
{
  "statusCode": 4xx_or_5xx,
  "data": null,
  "message": "A human-readable error message",
  "success": false,
  "errors": [ 
      { "field": "body.firstName", "message": "First name is required" } 
    ]
}
```

**Common Status Codes:**
- `401 Unauthorized`: Invalid or expired token. Use the `refreshToken` to get a new one.
- `403 Forbidden`: User does not have permission (e.g., profile incomplete, not a premium member).
- `422 Unprocessable Entity`: Validation failed. Check the `errors` array for details.
- `404 Not Found`: The requested resource does not exist.
- `409 Conflict`: The resource you are trying to create already exists (e.g., duplicate shortlist entry).
- `429 Too Many Requests`: Rate limit exceeded.
