# Frontend API Integration Guide

This document outlines the necessary steps and provides guidance on integrating the React frontend with the Chhattisgarh Shadi backend API.

## 1. Required API Routes for Integration

The following API endpoints are critical for completing the frontend functionality. The frontend currently uses mock data or placeholder UI for these features.

### User Profile & Photos
- `PUT /profiles/me`: To save changes from the "Edit Profile" page.
- `POST /uploads/profile-photo`: To handle single profile picture uploads.
- `POST /uploads/profile-photos`: To handle multiple gallery photo uploads.
- `DELETE /profiles/photos/:mediaId`: To allow users to delete their photos.

### Social & Interaction
- `GET /shortlist`: To fetch the user's actual shortlisted profiles.
- `DELETE /shortlist/:shortlistedUserId`: To remove a user from the shortlist.
- `POST /matches`: To send a match/interest request to another user.
- `POST /matches/:matchId/accept`: To accept a received match request.
- `POST /matches/:matchId/reject`: To reject a received match request.
- `GET /matches/sent`: To show pending interests sent by the user.
- `GET /matches/received`: To show pending interests received by the user.

### Real-time Chat
- `GET /messages/conversations`: To fetch the list of all chat conversations.
- `GET /messages/:userId`: To fetch the chat history with a specific user.
- `POST /messages`: To send a new chat message.
- **Socket.io Integration**: For real-time message sending and receiving.

### Payments & Premium
- `GET /plans`: To fetch the available subscription plans dynamically.
- `POST /payments/orders`: To create a Razorpay order when a user chooses a plan.
- `POST /payments/verify`: To verify the payment on the frontend after Razorpay checkout.

### Notifications
- `GET /notifications`: To fetch a user's real notifications.
- `PUT /notifications/:notificationId/read`: To mark a single notification as read.
- `PUT /notifications/read-all`: To mark all notifications as read.

---

## 2. Code Changes and Integration Guide

This section details where changes are needed in the codebase.

### a. Photo Uploader (`src/components/profile/photo-uploader.tsx`)

**Goal**: Make the photo upload UI functional.

**Changes Needed**:
1.  **State Management**: Use `useState` to manage the file(s) selected by the user.
2.  **API Call Logic**:
    - Create a function that takes the selected file and a `FormData` object.
    - Use the `api.post('/uploads/profile-photo', formData)` method for the API call. The `Content-Type` header will be automatically set to `multipart/form-data` by the browser when using `FormData`.
    - **Line Numbers**: The logic should be added inside the `PhotoUploader` component, likely within an `onChange` handler for the file input (around line 25) or a new `handleUpload` function.
3.  **Update UI**: After a successful upload, refetch the user's profile data to display the new photo.

### b. Edit Profile Tabs (`src/app/[locale]/profile/edit/page.tsx`)

**Goal**: Make the "Family", "Professional", and "Preferences" tabs functional.

**Changes Needed**:
1.  **Add Fields**: In the `profileEditSchema` (around line 20), add `zod` validation for the family, occupation, and partner preference fields from your Prisma schema.
2.  **Create UI**: Build out the form UI inside the `<TabsContent>` for each section (around lines 220, 223, 226). Use the existing `FormField` component structure.
3.  **Update `onSubmit`**: Modify the `onSubmit` function (around line 85) to include the new fields in the `PUT /profiles/me` API call. Remember to structure the partner preferences into a nested `partnerPreference` object as required by the backend.

### c. Chat Integration (`src/app/[locale]/chat/[id]/page.tsx`)

**Goal**: Replace the mock chat UI with a real-time messaging system.

**Changes Needed**:
1.  **Socket.io Connection**:
    - In a `useEffect`, establish a connection to your Socket.io server. The `API_DOC.md` specifies how to authenticate: `io(URL, { auth: { token } })`.
    - Set up event listeners for `message:received`, `user:online`, etc.
2.  **Fetch Initial Data**:
    - On page load, fetch the conversation list from `GET /messages/conversations` to populate the sidebar (around line 32).
    - Fetch the message history for the selected chat from `GET /messages/:userId` (around line 48).
3.  **Send Messages**:
    - The "Send" button's `onClick` handler (around line 89) should not just update the UI but should call `socket.emit('message:send', { receiverId, content })`.

### d. Shortlist Page (`src/app/[locale]/shortlist/page.tsx`)

**Goal**: Display real shortlisted profiles and allow removal.

**Changes Needed**:
1.  **Fetch Data**: Replace the `shortlistedProfiles` mock data (line 12) with a `useEffect` hook that fetches data from `GET /shortlist`.
2.  **Implement Removal**: The "Remove" button's `onClick` handler (line 64) should call the `DELETE /shortlist/:shortlistedUserId` endpoint and then update the UI to remove the card.

---

## 3. Full API List (Tabular Format)

| Method | Endpoint                          | Description                                         | Frontend Status |
| :----- | :-------------------------------- | :-------------------------------------------------- | :-------------- |
| **POST**   | `/auth/google`                    | Login/Register with Google ID Token.                | ✅ **Integrated** |
| **POST**   | `/auth/refresh`                   | Refresh an expired access token.                    | ✅ **Integrated** |
| **POST**   | `/auth/logout`                    | Log the user out.                                   | ⏳ Not Implemented |
| **POST**   | `/auth/phone/send-otp`            | Send OTP for phone verification.                    | ⏳ Not Implemented |
| **POST**   | `/auth/phone/verify-otp`          | Verify the phone OTP.                               | ⏳ Not Implemented |
| **POST**   | `/profiles`                       | Create a user's profile after first login.          | ✅ **Integrated** |
| **GET**    | `/profiles/me`                    | Get the logged-in user's full profile.              | ✅ **Integrated** |
| **PUT**    | `/profiles/me`                    | Update the logged-in user's profile.                | ✅ **Integrated** |
| **GET**    | `/profiles/search`                | Advanced search for profiles.                       | ✅ **Integrated** |
| **GET**    | `/profiles/:userId`               | Get a specific user's public profile.               | ✅ **Integrated** |
| **DELETE** | `/profiles/photos/:mediaId`       | Delete a photo from the user's gallery.             | ❌ **Not Started**  |
| **POST**   | `/uploads/profile-photo`          | Upload a single profile photo.                      | ❌ **Not Started**  |
| **POST**   | `/uploads/profile-photos`         | Upload multiple gallery photos.                     | ❌ **Not Started**  |
| **GET**    | `/matches/sent`                   | Get match requests sent by the user.                | ❌ **Not Started**  |
| **GET**    | `/matches/received`               | Get match requests received by the user.            | ❌ **Not Started**  |
| **POST**   | `/matches`                        | Send a match request.                               | ❌ **Not Started**  |
| **POST**   | `/matches/:matchId/accept`        | Accept a match request.                             | ❌ **Not Started**  |
| **POST**   | `/matches/:matchId/reject`        | Reject a match request.                             | ❌ **Not Started**  |
| **GET**    | `/shortlist`                      | Get the user's shortlisted profiles.                | ❌ **Not Started**  |
| **POST**   | `/shortlist`                      | Add a user to the shortlist.                        | ❌ **Not Started**  |
| **DELETE** | `/shortlist/:shortlistedUserId`   | Remove a user from the shortlist.                   | ❌ **Not Started**  |
| **GET**    | `/messages/conversations`         | Get all chat conversations.                         | ❌ **Not Started**  |
| **GET**    | `/messages/:userId`               | Get chat history with a specific user.              | ❌ **Not Started**  |
| **POST**   | `/messages`                       | Send a chat message.                                | ❌ **Not Started**  |
| **GET**    | `/plans`                          | Get available subscription plans.                   | ❌ **Not Started**  |
| **POST**   | `/payments/orders`                | Create a Razorpay payment order.                    | ❌ **Not Started**  |
| **POST**   | `/payments/verify`                | Verify a completed Razorpay payment.                | ❌ **Not Started**  |
| **GET**    | `/notifications`                  | Get user notifications.                             | ❌ **Not Started**  |
| **PUT**    | `/notifications/read-all`         | Mark all notifications as read.                     | ❌ **Not Started**  |
