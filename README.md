# E-Commerce Club Website

## Project Overview
University E-Commerce Club management platform with event registration, admin panel, and content management.

## Tech Stack
- **Frontend**: React, TailwindCSS
- **Backend**: FastAPI, PostgreSQL
- **Authentication**: JWT, bcrypt
- **Deployment**: Vercel (frontend), Railway (backend)
- **Third-party**: Cloudinary, Resend

## Team Contributions
| Name | Contribution |
|------|-------------|
| Sevda | Worked mainly on backend and database-related parts of the project, helping with data handling and server-side functionality.|
| Fatima | Worked on frontend development and database tasks, and also contributed to hosting and deployment-related setup.|
| Huseyn | Worked on hosting and domain configuration, integrated email sending using Resend, and provided frontend and backend support|
| Shahd | Helped with testing the system and full-stack support, identifying issues and assisting with fixes across frontend and backend.|

## Installation & Local Development Guide

This guide explains how to set up and run the **E-Commerce Club Website** project locally for development and testing.

---

## Prerequisites

Make sure the following tools are installed on your system:

- **Python** 3.12+
- **Node.js** 18+
- **npm** or **yarn**
- **Git**
- **SQLite** (default for local development)
- (Optional) **PostgreSQL** for production-like testing

---

## Backend Setup (FastAPI)

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/e-commerceclub-website.git
cd e-commerceclub-website/backend
````

---

### 2. Create and Activate Virtual Environment

```bash
python3 -m venv venv
source venv/bin/activate
```

> On Windows:

```powershell
venv\Scripts\activate
```

---

### 3. Install Backend Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

---

### 4. Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
DATABASE_URL=sqlite:///./ecommerce_club.db
SECRET_KEY=super-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

EMAIL_FROM=no-reply@ecommerceclub.com
EMAIL_PROVIDER=resend
RESEND_API_KEY=your_resend_api_key
FRONTEND_URL=http://localhost:5173
```


### 5. Database Initialization (Alembic)

```bash
alembic upgrade head
```

This will create all required tables.


### 6. Run the Backend Server

```bash
uvicorn app.main:app --reload
```

Backend will be available at:

```text
http://127.0.0.1:8000
```

Interactive API docs:

* Swagger UI: `http://127.0.0.1:8000/docs`
* ReDoc: `http://127.0.0.1:8000/redoc`

---

## Frontend Setup (React + Vite)

### 1. Navigate to Frontend Directory

```bash
cd ../frontend
```



### 2. Install Frontend Dependencies

```bash
npm install
```

or

```bash
yarn install
```

--

### 3. Frontend Environment Variables

Create a `.env` file inside `frontend/`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

---

### 4. Run Frontend Development Server

```bash
npm run dev
```

Frontend will be available at:

```text
http://localhost:5173
```

---

## Running Tests

### Backend Tests (pytest)

```bash
pytest
```

Or run a specific test file:

```bash
pytest tests/test_profile_email_change.py -v
```

---

## Common Development Commands

| Command                                        | Description             |
| ---------------------------------------------- | ----------------------- |
| `uvicorn app.main:app --reload`                | Run backend server      |
| `alembic revision --autogenerate -m "message"` | Create DB migration     |
| `alembic upgrade head`                         | Apply migrations        |
| `pytest`                                       | Run all backend tests   |
| `npm run dev`                                  | Run frontend dev server |

---

## Production Notes

* Use **PostgreSQL** instead of SQLite
* Run behind a reverse proxy (NGINX)
* Set `DEBUG=False`
* Rotate JWT secrets regularly
* Enable HTTPS at the infrastructure level

---

## Troubleshooting

### Common Issues

**ModuleNotFoundError**

```bash
pip install -r requirements.txt
```

**Database errors**

```bash
alembic upgrade head
```

**JWT errors**

* Verify `SECRET_KEY` consistency
* Ensure token expiration has not passed

---

## Project Structure Reference

```text
backend/
├── app/
├── alembic/
├── tests/
├── requirements.txt
├── alembic.ini
├── run.py
```


```
```

## Important Links
- [Project Requirements](./docs/requirements.md)

## Authentication API

### Endpoints

**Public (No Authentication):**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

**Protected (Requires JWT Token):**
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/me` - Update profile
- `POST /api/auth/change-password` - Change password
- `DELETE /api/auth/me` - Delete account

### Authentication Flow
1. Register: `POST /api/auth/register`
2. Login: `POST /api/auth/login` (receive JWT token)
3. Use token in header: `Authorization: Bearer <token>`
4. Token expires after 30 minutes

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### Security Features
- Passwords hashed with bcrypt
- JWT tokens with 30-min expiration
- Account lockout after 5 failed login attempts (15 min)
- Password reset via email

## Event Management API

### Public Endpoints

**List Events**
```http
GET /api/events?page=1&page_size=10
```

**Get Event Details**
```http
GET /api/events/{event_id}
```

**Check Availability**
```http
GET /api/events/{event_id}/availability
```

### User Endpoints (Requires Authentication)

**Register for Event**
```http
POST /api/registrations/
Authorization: Bearer {token}

{
  "event_id": 1
}
```

**View My Registrations**
```http
GET /api/registrations/my-registrations
Authorization: Bearer {token}
```

**Cancel Registration**
```http
DELETE /api/registrations/{registration_id}
Authorization: Bearer {token}
```

### Admin Endpoints (Requires Admin Role)

**Create Event**
```http
POST /api/events/
Authorization: Bearer {admin_token}

{
  "title": "Workshop Title",
  "description": "Event description",
  "event_date": "2024-12-20T18:00:00",
  "event_time": "18:00",
  "location": "Main Hall",
  "capacity": 100,
  "registration_deadline": "2024-12-18T23:59:59"
}
```

**Update Event**
```http
PUT /api/events/{event_id}
Authorization: Bearer {admin_token}
```

**Delete Event**
```http
DELETE /api/events/{event_id}
Authorization: Bearer {admin_token}
```

**View Participants**
```http
GET /api/events/{event_id}/participants
Authorization: Bearer {admin_token}
```

## Profile Management Enhancements

The profile module was extended to support safer account management and verified email updates, improving user experience and data integrity.

---

## Account Deletion with Confirmation

### Overview
Account deletion now requires **explicit user confirmation** to prevent accidental or malicious deletions.

### Endpoint
```http
DELETE /api/profile/me
Authorization: Bearer <token>
````

### Request Body

```json
{
  "confirm": true
}
```

### Behavior

* If `confirm` is `false`, the request is rejected
* If `confirm` is `true`, the user account is permanently deleted
* Associated user data is removed from the database

### Response

```http
204 No Content
```

---

## Email Change with Verification Flow

### Overview

Changing a user’s email address requires **email verification** to ensure ownership of the new email and prevent unauthorized changes.

---

### Step 1: Request Email Change

```http
POST /api/profile/change-email
Authorization: Bearer <token>
```

#### Request Body

```json
{
  "new_email": "newemail@example.com"
}
```

#### Behavior

* Generates a signed JWT verification token
* Sends a verification email to the new address
* Email is **not updated immediately**

#### Response

```json
{
  "message": "Verification email sent"
}
```

---

### Step 2: Confirm Email Change

```http
GET /api/profile/confirm-email-change?token=<verification_token>
```

#### Behavior

* Validates the token
* Ensures token type is `email_change`
* Extracts:

  * User ID
  * New email address
* Updates the user’s email only if the token is valid

#### Response

```json
{
  "message": "Email updated successfully"
}
```

---

## Email Verification Token Structure

Email verification tokens are implemented using JWT with a dedicated payload:

```json
{
  "sub": "user_id",
  "new_email": "newemail@example.com",
  "type": "email_change",
  "exp": "expiration_timestamp"
}
```

This design ensures:

* Tokens are single-purpose
* Tokens expire automatically
* Email changes cannot be forged or replayed

---

## Profile API Summary

### Protected Profile Endpoints

| Method | Endpoint                            | Description                      |
| ------ | ----------------------------------- | -------------------------------- |
| GET    | `/api/profile/me`                   | Get current user profile         |
| PUT    | `/api/profile/me`                   | Update profile details           |
| PUT    | `/api/profile/change-password`      | Change account password          |
| POST   | `/api/profile/change-email`         | Request email change             |
| GET    | `/api/profile/confirm-email-change` | Confirm email change             |
| DELETE | `/api/profile/me`                   | Delete account with confirmation |

---

## Testing Coverage

The following features are fully covered by automated tests using **pytest** and FastAPI’s `TestClient`:

* Email change request flow
* Email change confirmation
* Invalid or expired email tokens
* Account deletion confirmation logic
* Unauthorized access handling

---

## Implementation Notes

* Business logic is isolated in the service layer (`profile_service.py`)
* Routes remain thin and declarative
* Email verification uses stateless JWT tokens
* All changes are backward compatible with existing users

```
```

