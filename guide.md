# Frontend API Integration Guide

This document outlines the necessary steps to fully integrate the frontend of the Chhattisgarh Shaadi application with the backend API. It details which files to edit, the endpoints to use, and the data payloads required.

---

## 1. Authentication (`/auth`)

### `src/components/auth/login-form.tsx`

**Status:** **Complete.** The login form correctly handles the Google Sign-In flow.

-   **Endpoint:** `POST /auth/google`
-   **Action:** No changes are needed here. The component successfully authenticates the user, stores the `accessToken` and `refreshToken`, and redirects to the appropriate page (`/onboarding` for new users, `/dashboard` for existing users).

---

## 2. Onboarding (`/profiles`)

### `src/app/[locale]/onboarding/page.tsx`

**Status:** **Incomplete.** The onboarding form collects most of the required data but fails to send it to the correct endpoints. The current implementation attempts to send everything to `POST /profiles`, which is incorrect.

#### **Actions Required:**

1.  **Isolate Core Profile Data (line ~175):**
    -   Modify the `onSubmit` function to create a `profilePayload` object containing only the fields for the main profile.
    -   **Endpoint:** `POST /profiles`
    -   **Action:** Ensure the payload matches the backend schema. This includes renaming `aboutMe` to `bio`, `drinkingHabit` to `drinkingHabits`, and `smokingHabit` to `smokingHabits`.

2.  **Upload Profile Photo (line ~164):**
    -   The photo upload is currently handled correctly.
    -   **Endpoint:** `POST /uploads/profile-photo`
    -   **Action:** No changes are needed for the photo upload itself, but ensure it is called before creating the profile.

3.  **Add Education & Occupation (New):**
    -   After the core profile is created, add the education and occupation details.
    -   **Endpoints:** `POST /education`, `POST /occupation`
    -   **Action:** Add the following calls inside the `try` block after the `/profiles` call.
    -   **Implementation:**
      ```javascript
      // Add Education
      if (data.highestEducation && data.educationDetails) {
        await api.post('/education', {
          degree: data.highestEducation,
          field: data.educationDetails,
          institution: data.collegeName,
        });
      }

      // Add Occupation
      if (data.occupation) {
        await api.post('/occupation', {
          designation: data.occupation,
          occupationType: data.occupationType,
          annualIncome: data.annualIncome,
        });
      }
      ```

4.  **Add Partner Preferences (New):**
    -   After the profile is created, set the user's partner preferences.
    -   **Endpoint:** `PUT /preference`
    -   **Action:** Add the following call inside the `try` block.
    -   **Implementation:**
      ```javascript
      // Add Partner Preferences
      if (data.partnerAgeFrom) { // Check if any preference is set
        await api.put('/preference', {
          ageFrom: data.partnerAgeFrom,
          ageTo: data.partnerAgeTo,
          heightFrom: data.partnerHeightFrom,
          heightTo: data.partnerHeightTo,
          religion: data.partnerReligion,
          caste: data.partnerCaste,
          maritalStatus: data.partnerMaritalStatus,
          description: data.partnerDescription,
        });
      }
      ```

---

## 3. Profile Management

### `src/app/[locale]/profile/edit/page.tsx`

**Status:** **Highly Incomplete.** This page only handles basic profile updates. The sections for photos, family, professional details, and preferences are placeholders.

#### **Actions Required:**

1.  **Professional Tab (line ~293):**
    -   **Action:** Replace the "coming soon" paragraph with a component to manage education and occupation.
    -   **Fetch Data:** Use `GET /education` and `GET /occupation` to retrieve and display existing entries.
    -   **Add/Update/Delete:**
        -   Implement a form to add new entries (`POST /education`, `POST /occupation`).
        -   Allow editing of existing entries (`PUT /education/:id`, `PUT /occupation/:id`).
        -   Allow deletion of entries (`DELETE /education/:id`, `DELETE /occupation/:id`).

2.  **Family Tab (line ~290):**
    -   **Action:** Implement a form to edit family details.
    -   **Fields:** Use the family-related fields from the onboarding form (`fatherName`, `numberOfBrothers`, etc.).
    -   **Endpoint:** These fields are part of the main profile, so update them using `PUT /profiles/me`.

3.  **Preferences Tab (line ~296):**
    -   **Action:** Replace the "coming soon" paragraph with a form to manage partner preferences.
    -   **Fetch Data:** Use `GET /preference` to get the current preferences.
    -   **Update Data:** Use `PUT /preference` to save any changes.

### `src/components/profile/photo-uploader.tsx`

**Status:** **Not Implemented.** The component uses mock data and has no API integration.

#### **Actions Required:**

1.  **Fetch Photos (New):**
    -   **Action:** On component mount, fetch the user's photos.
    -   **Endpoint:** The user's media is included in the `GET /profiles/me` response. Pass this data down as a prop.

2.  **Upload Photos (line ~49):**
    -   **Action:** Implement the file upload logic.
    -   **Endpoint:** `POST /uploads/profile-photos` for gallery images and `POST /uploads/profile-photo` for the main profile picture.
    -   **Implementation:** Use a `FormData` object to upload the file(s).

3.  **Delete Photos (line ~40):**
    -   **Action:** Implement the photo deletion logic.
    -   **Endpoint:** The API documentation does not specify a dedicated photo deletion endpoint. This will likely need to be implemented in the backend. The expected endpoint would be `DELETE /photos/:mediaId`.

---

## 4. Social & Communication

### `src/app/[locale]/matches/page.tsx`

**Status:** **Not Implemented.** This page needs to be built.

#### **Actions Required:**

-   **Fetch Data:** Use the following endpoints to get match data:
    -   `GET /matches/accepted` (for current connections)
    -   `GET /matches/received` (for incoming requests)
    -   `GET /matches/sent` (for outgoing requests)
-   **Implement Actions:**
    -   Accept Request: `POST /matches/:matchId/accept`
    -   Reject Request: `POST /matches/:matchId/reject`
    -   Unmatch: `DELETE /matches/:matchId`

### `src/app/[locale]/chat/[id]/page.tsx`

**Status:** **Not Implemented.** The chat interface needs to be built.

#### **Actions Required:**

1.  **Fetch Chat History:**
    -   **Endpoint:** `GET /messages/:userId`
    -   **Action:** When the page loads, fetch the message history with the specified user.

2.  **Implement Real-time Chat (WebSockets):**
    -   **Connect:** Establish a Socket.IO connection, passing the `accessToken` in the `auth` object.
    -   **Send Messages:** Use the `message:send` event to send new messages.
      ```javascript
      socket.emit('message:send', { receiverId: a, content: b });
      ```
    -   **Receive Messages:** Listen for the `message:received` event to get new messages in real-time and append them to the chat window.
      ```javascript
      socket.on('message:received', (message) => { ... });
      ```

---

This guide provides a high-level overview of the required integrations. Each section may require additional UI/UX considerations and state management. Refer to `API_DOC.md` for detailed request and response schemas.
