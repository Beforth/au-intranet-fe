# Intranet App API Documentation

> Base URL: `http://192.168.1.41:8000`
>
> All endpoints return JSON. Send `Content-Type: application/json` with every request.

---

## Authentication

Every API request requires a **Token** in the `Authorization` header.

```
Authorization: Token <your_token_here>
```

You also need a valid CSRF token (for browser-based tools like Postman, include it as a Cookie header):

```
Cookie: csrftoken=<your_csrftoken_here>
```

**How to get your token:**

```bash
curl --location --request POST 'http://192.168.1.41:8000/api-token-auth/' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "your_username",
    "password": "your_password"
}'
```

Response:

```json
{
    "token": "7e0b04d37c6a201a843b0c395030d2d8b2881a86"
}
```

Use this token in all subsequent requests.

---

## Permissions

| Permission Code | Access |
|---|---|
| `intranet.view` | GET (list all apps) only |
| `intranet.manage` | POST, PATCH, DELETE (create, update, remove apps) |

A user with only `intranet.view` who attempts POST, PATCH, or DELETE will receive **403 Forbidden**.

Superusers (`is_superuser=True`) bypass all permission checks automatically.

---

## Data Model — Intranet App

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `name` | string (max 200 chars) | Yes | — | Display name of the app |
| `url` | string (valid URL, max 500 chars) | Yes | — | URL the app link opens |
| `icon` | file (image) | No | `null` | App icon or logo image |
| `description` | string (text) | No | `null` | Short description of the app |
| `is_active` | boolean | No | `true` | Whether the app is visible in the launcher |
| `sort_order` | integer (non-negative) | No | `0` | Display order (lower number appears first) |
| `created_at` | datetime (auto) | — | — | Set automatically on creation (read-only) |
| `updated_at` | datetime (auto) | — | — | Set automatically on each update (read-only) |

---

## API Endpoints

| # | Method | Endpoint | Purpose | Permission |
|---|---|---|---|---|
| 1 | POST | `/intranet-app/` | Create a new app | `intranet.manage` |
| 2 | PATCH | `/intranet-app-s/<id>/` | Partially update an existing app | `intranet.manage` |
| 3 | DELETE | `/intranet-app-s/<id>/` | Delete an app | `intranet.manage` |
| 4 | GET | `/intranet-app/` | List all apps | `intranet.view` |

---

## 1. Create Intranet App — POST

### Purpose

Add a new app to the Intranet App launcher.

### Endpoint

```
POST http://192.168.1.41:8000/intranet-app/
```

### Required Permission

`intranet.manage`

### Request Headers

| Header | Value |
|---|---|
| `Authorization` | `Token <your_token>` |
| `Content-Type` | `application/json` |

### Request Body

```json
{
    "name": "T-HRMS",
    "url": "https://hrms.example.com",
    "icon": null,
    "description": "Human Resource Management System",
    "is_active": true,
    "sort_order": 1
}
```

### Field Explanations

| Field | Description |
|---|---|
| `name` | **Required.** The display name shown in the app launcher. Max 200 characters. |
| `url` | **Required.** A valid URL (must start with `http://` or `https://`). Max 500 characters. |
| `icon` | **Optional.** An image file for the app icon. Pass `null` or omit if not needed. |
| `description` | **Optional.** A short text description. Pass `null` or omit if not needed. |
| `is_active` | **Optional.** Set to `true` to show the app in the launcher, `false` to hide it. Defaults to `true`. |
| `sort_order` | **Optional.** A non-negative integer controlling display order. Lower values appear first. Defaults to `0`. |

### Successful Response

**HTTP Status:** `201 Created`

```json
{
    "id": 1,
    "name": "T-HRMS",
    "icon": null,
    "url": "https://hrms.example.com",
    "description": "Human Resource Management System",
    "is_active": true,
    "sort_order": 1,
    "created_at": "2026-08-31T10:30:00.000000+05:30",
    "updated_at": "2026-08-31T10:30:00.000000+05:30"
}
```

### Error Responses

**400 Bad Request** — Validation failure (missing required field or invalid data):

```json
{
    "name": ["This field is required."],
    "url": ["This field is required."]
}
```

```json
{
    "url": ["Enter a valid URL."]
}
```

**403 Forbidden** — User lacks `intranet.manage` permission:

```json
{
    "detail": "You do not have permission to perform this action."
}
```

### Step-by-Step Instructions

1. Obtain your authentication token (see Authentication section above).
2. Open Postman and create a new **POST** request.
3. Set the URL to `http://192.168.1.41:8000/intranet-app/`.
4. Under the **Headers** tab, add:
   - `Authorization` = `Token 7e0b04d37c6a201a843b0c395030d2d8b2881a86`
   - `Content-Type` = `application/json`
5. Under the **Body** tab, select **raw** and **JSON**, then enter:

```json
{
    "name": "T-HRMS",
    "url": "https://hrms.example.com",
    "description": "Human Resource Management System",
    "is_active": true,
    "sort_order": 1
}
```

6. Click **Send**.
7. Confirm you receive a `201 Created` response with the created app data including the `id` field.
8. Note the `id` value from the response — you will need it for PATCH and DELETE requests.

### Postman Screenshot Guide

```
Method:    POST
URL:       http://192.168.1.41:8000/intranet-app/
Headers:
    Authorization: Token 7e0b04d37c6a201a843b0c395030d2d8b2881a86
    Content-Type:  application/json
Body (raw JSON):
    { "name": "T-HRMS", "url": "https://hrms.example.com", "description": "HRMS app", "is_active": true, "sort_order": 1 }
```

---

## 2. Update Intranet App — PATCH (Partial Update)

### Purpose

Partially update an existing app. You only need to send the fields you want to change — all other fields remain unchanged.

### Endpoint

```
PATCH http://192.168.1.41:8000/intranet-app-s/<id>/
```

Replace `<id>` with the numeric ID of the app (returned when the app was created).

### Required Permission

`intranet.manage`

### Request Headers

| Header | Value |
|---|---|
| `Authorization` | `Token <your_token>` |
| `Content-Type` | `application/json` |

### Request Body

```json
{
    "name": "T-HRMS Updated"
}
```

Only include the fields you want to update. All omitted fields stay as they are.

### Field Explanations

| Field | Description |
|---|---|
| `name` | **Optional for PATCH.** New display name. Max 200 characters. |
| `url` | **Optional for PATCH.** New valid URL. Max 500 characters. |
| `icon` | **Optional for PATCH.** New image file, or `null` to remove. |
| `description` | **Optional for PATCH.** New description text, or `null` to clear. |
| `is_active` | **Optional for PATCH.** `true` to show, `false` to hide. |
| `sort_order` | **Optional for PATCH.** New non-negative integer. |

### Successful Response

**HTTP Status:** `200 OK`

```json
{
    "id": 1,
    "name": "T-HRMS Updated",
    "icon": null,
    "url": "https://hrms.example.com",
    "description": "Human Resource Management System",
    "is_active": true,
    "sort_order": 1,
    "created_at": "2026-08-31T10:30:00.000000+05:30",
    "updated_at": "2026-08-31T11:00:00.000000+05:30"
}
```

Note: `updated_at` reflects the time of the PATCH. All fields you did **not** send remain unchanged.

### Error Responses

**400 Bad Request** — Validation failure:

```json
{
    "url": ["Enter a valid URL."]
}
```

```json
{
    "name": ["This field may not be blank."]
}
```

**403 Forbidden** — User lacks `intranet.manage` permission:

```json
{
    "detail": "You do not have permission to perform this action."
}
```

**404 Not Found** — App with the given ID does not exist:

```json
{
    "detail": "Not found."
}
```

### Step-by-Step Instructions

1. First, create an app using the POST endpoint (see above) and note the `id` from the response.
2. Open Postman and create a new **PATCH** request.
3. Set the URL to `http://192.168.1.41:8000/intranet-app-s/1/` (replace `1` with your app's ID).
4. Under the **Headers** tab, add:
   - `Authorization` = `Token <your_token>`
   - `Content-Type` = `application/json`
5. Under the **Body** tab, select **raw** and **JSON**, then enter only the fields you want to change:

```json
{
    "name": "T-HRMS Updated",
    "is_active": false
}
```

6. Click **Send**.
7. Confirm you receive a `200 OK` response with the full updated app object.
8. Verify that only the fields you sent were changed; all others remain the same.

### Common Patch Examples

**Rename an app:**

```json
{
    "name": "New App Name"
}
```

**Toggle visibility off:**

```json
{
    "is_active": false
}
```

**Change display order and description:**

```json
{
    "sort_order": 5,
    "description": "Updated description for the app"
}
```

**Update the URL:**

```json
{
    "url": "https://new-url.example.com"
}
```

### Postman Screenshot Guide

```
Method:    PATCH
URL:       http://192.168.1.41:8000/intranet-app-s/1/
Headers:
    Authorization: Token 7e0b04d37c6a201a843b0c395030d2d8b2881a86
    Content-Type:  application/json
Body (raw JSON):
    { "name": "T-HRMS Updated" }
```

---

## 3. Delete Intranet App — DELETE

### Purpose

Permanently remove an app from the Intranet App launcher. This action cannot be undone.

### Endpoint

```
DELETE http://192.168.1.41:8000/intranet-app-s/<id>/
```

Replace `<id>` with the numeric ID of the app to delete.

### Required Permission

`intranet.manage`

### Request Headers

| Header | Value |
|---|---|
| `Authorization` | `Token <your_token>` |

No `Content-Type` header is needed since there is no request body.

### Request Body

No body required.

### Successful Response

**HTTP Status:** `204 No Content`

```json
{
    "message": "App deleted successfully"
}
```

### Error Responses

**403 Forbidden** — User lacks `intranet.manage` permission:

```json
{
    "detail": "You do not have permission to perform this action."
}
```

**404 Not Found** — App with the given ID does not exist:

```json
{
    "detail": "Not found."
}
```

### Step-by-Step Instructions

1. Identify the `id` of the app you want to delete (from a previous POST response or GET list call).
2. Open Postman and create a new **DELETE** request.
3. Set the URL to `http://192.168.1.41:8000/intranet-app-s/1/` (replace `1` with your app's ID).
4. Under the **Headers** tab, add:
   - `Authorization` = `Token <your_token>`
5. Leave the Body empty.
6. Click **Send**.
7. Confirm you receive a `204 No Content` response.
8. The app has been permanently deleted.

### Postman Screenshot Guide

```
Method:    DELETE
URL:       http://192.168.1.41:8000/intranet-app-s/1/
Headers:
    Authorization: Token 7e0b04d37c6a201a843b0c395030d2d8b2881a86
Body:      (empty)
```

---

## 4. List All Intranet Apps — GET

### Purpose

Retrieve a list of all intranet apps in the launcher.

### Endpoint

```
GET http://192.168.1.41:8000/intranet-app/
```

### Required Permission

`intranet.view`

### Request Headers

| Header | Value |
|---|---|
| `Authorization` | `Token <your_token>` |

### Request Body

No body required.

### Successful Response

**HTTP Status:** `200 OK`

```json
[
    {
        "id": 1,
        "name": "T-HRMS",
        "icon": "/media/intranet_apps/hrms_icon.png",
        "url": "https://hrms.example.com",
        "description": "Human Resource Management System",
        "is_active": true,
        "sort_order": 1,
        "created_at": "2026-08-31T10:30:00.000000+05:30",
        "updated_at": "2026-08-31T10:30:00.000000+05:30"
    },
    {
        "id": 2,
        "name": "Payroll Portal",
        "icon": null,
        "url": "https://payroll.example.com",
        "description": "Employee payroll and salary management",
        "is_active": true,
        "sort_order": 2,
        "created_at": "2026-08-31T11:00:00.000000+05:30",
        "updated_at": "2026-08-31T11:00:00.000000+05:30"
    }
]
```

### Error Responses

**403 Forbidden** — User lacks `intranet.view` permission:

```json
{
    "detail": "You do not have permission to perform this action."
}
```

### Step-by-Step Instructions

1. Open Postman and create a new **GET** request.
2. Set the URL to `http://192.168.1.41:8000/intranet-app/`.
3. Under the **Headers** tab, add:
   - `Authorization` = `Token <your_token>`
4. Click **Send**.
5. You will receive a JSON array of all apps, ordered by `sort_order` then `name`.

### Postman Screenshot Guide

```
Method:    GET
URL:       http://192.168.1.41:8000/intranet-app/
Headers:
    Authorization: Token 7e0b04d37c6a201a843b0c395030d2d8b2881a86
Body:      (empty)
```

---

## HTTP Status Codes Summary

| Code | Meaning | When |
|---|---|---|
| `200` | OK | PATCH succeeded, or GET list succeeded |
| `201` | Created | POST succeeded — new app created |
| `204` | No Content | DELETE succeeded |
| `400` | Bad Request | Validation error — check the response body for field-level errors |
| `403` | Forbidden | Authenticated user lacks the required permission |
| `404` | Not Found | App with the given ID does not exist (PATCH or DELETE with invalid ID) |
| `405` | Method Not Allowed | Wrong HTTP method used on the endpoint |

---

## Quick Reference — cURL Examples

**Create (POST):**

```bash
curl --location --request POST 'http://192.168.1.41:8000/intranet-app/' \
--header 'Authorization: Token 7e0b04d37c6a201a843b0c395030d2d8b2881a86' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "T-HRMS",
    "url": "https://hrms.example.com",
    "description": "Human Resource Management System",
    "is_active": true,
    "sort_order": 1
}'
```

**Update (PATCH):**

```bash
curl --location --request PATCH 'http://192.168.1.41:8000/intranet-app-s/1/' \
--header 'Authorization: Token 7e0b04d37c6a201a843b0c395030d2d8b2881a86' \
--header 'Content-Type: application/json' \
--data-raw '{
    "name": "T-HRMS Updated"
}'
```

**Delete (DELETE):**

```bash
curl --location --request DELETE 'http://192.168.1.41:8000/intranet-app-s/1/' \
--header 'Authorization: Token 7e0b04d37c6a201a843b0c395030d2d8b2881a86'
```

**List (GET):**

```bash
curl --location --request GET 'http://192.168.1.41:8000/intranet-app/' \
--header 'Authorization: Token 7e0b04d37c6a201a843b0c395030d2d8b2881a86'
```

---

## Troubleshooting

| Problem | Cause | Solution |
|---|---|---|
| `405 Method Not Allowed` | Using wrong HTTP method on the endpoint | Check the method and URL: POST goes to `/intranet-app/`, PATCH/DELETE go to `/intranet-app-s/<id>/` |
| `403 Forbidden` | Your user lacks the required permission | Ensure your user has `intranet.manage` (for write operations) or `intranet.view` (for read). Contact your administrator. |
| `404 Not Found` | The app ID does not exist | Verify the ID by calling GET `/intranet-app/` first to see all available apps. |
| `400 Bad Request` | Invalid data sent | Check the response body — it lists which fields have errors (e.g., missing required fields, invalid URL format). |
| `401 Unauthorized` | Missing or invalid token | Verify your token is correct. Generate a new one via `/api-token-auth/` if needed. |
