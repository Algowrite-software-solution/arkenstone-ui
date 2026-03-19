
# 📡 Response Protocol Documentation

The **Response Protocol** is a standardized framwork level protocol designed to ensure every API response follows a strict, predictable format. By using this protocol, the frontend can automatically handle success states, display messages, and parse errors without writing custom logic for every single endpoint.

---

## 📦 The JSON Structure

Every response sent from the server will wrap the actual data in a standard envelope.

```json
{
  "status": "success" | "error",
  "message": "Human readable message (optional)",
  "data": { ... },   // Present only on Success
  "errors": [ ... ]  // Present only on Error
}
```

### Key Fields

| Field | Type | Description |
| :--- | :--- | :--- |
| **`status`** | `string` | Defines the outcome. Always `"success"` or `"error"`. |
| **`message`** | `string` | A notification text meant for the user (e.g., "Profile Updated"). |
| **`data`** | `any` | The actual payload requested (e.g., User object, Product list). **Null on error.** |
| **`errors`** | `any` | Validation details or debug info. **Null on success.** |

---

## 🟢 Success Responses

Use the `success` method when an operation completes as expected.

### Method Signature
`success(data, message, code)`

| Parameter | Default | Description |
| :--- | :--- | :--- |
| **`data`** | `null` | The resource being returned (Object, Array, Boolean, etc). |
| **`message`** | `null` | Optional text to display in a green Toast notification. |
| **`code`** | `200` | The HTTP Status Code (e.g., 200 OK, 201 Created). |

### Example Output

**1. Fetching Data (No Message)**
```json
// HTTP 200
{
  "status": "success",
  "message": null,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**2. Performing an Action (With Message)**
```json
// HTTP 201
{
  "status": "success",
  "message": "Item added to cart successfully",
  "data": {
    "cart_id": 505
  }
}
```

---

## 🔴 Error Responses

Use the `error` method when an operation fails. This handles both logical failures (e.g., "Out of Stock") and validation failures (e.g., "Invalid Email").

### Method Signature
`error(errors, message, code)`

| Parameter | Default | Description |
| :--- | :--- | :--- |
| **`errors`** | `null` | Detailed error data. Can be a simple string, an array, or an object keyed by field name. |
| **`message`** | `null` | A summary text to display in a red Toast notification. |
| **`code`** | `400` | The HTTP Status Code (e.g., 400 Bad Request, 401 Unauthorized, 404 Not Found or any other error code as required). |

### Example Output

**1. Validation Error (Field Specific)**
*Used when a form submission fails.*
```json
// HTTP 422
{
  "status": "error",
  "message": "Please fix the errors below",
  "errors": {
    "email": ["The email address is invalid."],
    "password": ["Password must be at least 8 characters."]
  }
}
```

**2. Logical Error (Simple)**
*Used when a business rule prevents an action.*
```json
// HTTP 400
{
  "status": "error",
  "message": "You cannot delete this order because it has already shipped.",
  "errors": null
}
```

**3. System Error (Array)**
*Used for generic lists of issues.*
```json
// HTTP 500
{
  "status": "error",
  "message": "Upload failed",
  "errors": [
    "File too large",
    "Unsupported file format"
  ]
}
```

---

## 🧠 Why use this?

1.  **Predictability:** The frontend never has to guess if data is inside `response.body`, `response.data`, or `response.result`. It is always in `data`.
2.  **Unified Error Handling:** The frontend API utility allows specific logic:
    *   If `status === 'error'`, throw an exception automatically (even if HTTP code is 200).
    *   If `errors` is an object, map it to Form Fields.
    *   If `errors` is an array, list them in a tooltip.
3.  **Toasting:** The frontend automatically checks the `message` field. If it exists, it shows a Toast notification (Green for success, Red for error).