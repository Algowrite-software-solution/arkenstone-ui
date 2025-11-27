
# API Utility Documentation

**File:** `util/api.ts`

This module is a **wrapper around Axios** designed to standardize API communication between your React Frontend and Backend API based on a custom Protocol. It handles authentication, response formatting, automatic toast notifications, and unified error parsing out of the box.

---

## 🚀 Key Features

1.  **Unified Protocol**: Automatically handles standard HTTP errors (4xx/5xx) AND logical backend errors (where status is `200` but the body says `error` due to a logical functional operation error).
2.  **Smart Error Parsing**: formatting validation arrays or objects into readable Toast messages (in future this will be replaced with more advanced notification machanisms).
3.  **Auto-Toasts**: Default integration with `sonner` to show success/error messages automatically so you don't have to write them in every component.
4.  **Type Safety**: Fully typed options and responses.

---

## ⚙️ Configuration

The API client is pre-configured with the following defaults:
*   **Base URL**: `/api/v1` (in upcoming updates this api version will be included with the application configurations)
*   **Headers**: Default headers including`application/json` with CSRF protection (`X-Requested-With`).
*   **Credentials**: Sends cookies automatically (for Backend Session Based Authentication).

---

## 🛠 Options (`ApiOptions`)

Every request method accepts an optional configuration object.

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| **`data`** | `any` | `{}` | The request body payload (for POST/PUT). |
| **`params`** | `any` | `{}` | Query string parameters (e.g., `?page=1&sort=asc`). |
| **`headers`** | `any` | `{}` | Custom headers to merge with defaults. |
| **`displayError`** | `boolean` | `true` | If `true`, a failed state Toast appears automatically on failure. |
| **`displaySuccess`** | `boolean` | `false` | If `true`, a success state Toast appears on success (using backend `message`). |
| **`isMultipart`** | `boolean` | `false` | Set to `true` for File Uploads. Sets `Content-Type: multipart/form-data`. |
| **`onSuccess`** | `function` | `undefined` | Callback function receiving the `data` portion of the response. |
| **`onError`** | `function` | `undefined` | Callback function receiving the raw `errors` object (useful for forms). |

---

## 📡 Methods

### `apiGet(url, options)`
Performs a GET request.
*   **Note:** If you pass `data` here, it will be merged into `params` (query string).

### `apiPost(url, options)`
Performs a POST request. Commonly used for creating resources.

### `apiPut(url, options)`
Performs a PUT request. Commonly used for updating resources.

### `apiDelete(url, options)`
Performs a DELETE request.

---

## 🚨 Error Handling Strategy

This is the most powerful part of this utility. It standardizes how errors are read from the backend.

### The Backend Protocol
The API expects the backend to return JSON in Custom **Arkenstone Response Protocol** format:

eg:
```json
{
    "status": "success" | "error",
    "message": "Operation completed",
    "data": { ... }, 
    "errors": [ ... ] OR { "field": ["error"] }
}
```

see More ([Response Protocol](./response-protocol.md))

### How Errors are Displayed (Toasts)
When a request fails, the API calculates the best message to show in the Toast:

1.  **Direct Message:** If the backend sends a `message`, that is shown.
2.  **Pattern 1 (Field Errors):** If `errors` is `{'email': ['Invalid email'], 'phone': ['Required']}`, the toast shows:
    > "Invalid email (and 1 other error)"
3.  **Pattern 2 (Simple Array):** If `errors` is `['Password too short', 'Invalid character']`, the toast shows:
    > "Password too short (and 1 other error)"

### Custom Validation Handling
If you need to highlight specific form fields (red borders) instead of just a generic toast*:

```typescript
apiPost('/register', {
    data: formData,
    displayError: true, // Shows "Invalid email..." toast
    onError: (errors) => {
        // 'errors' contains the raw object: { email: ["Invalid"] }
        form.setErrors(errors); 
    }
});
```
*this will be populated with more features in future

---

## 💡 Usage Examples

### 1. Import the API Utility
```typescript
import { apiGet, apiPost } from 'arkenstone-ui/util/api';
```

### 2. Basic Fetch
```typescript
const fetchUser = async () => {
    // Returns res.data directly
    const user = await apiGet('/user/profile');
    console.log(user); 
};
```

### 2. Creating an Item (With Success Toast)
```typescript
const createProduct = async () => {
    await apiPost('/products', {
        data: { name: 'Sneakers', price: 100 },
        displaySuccess: true, // Shows backend message: "Product Created"
        onSuccess: (newItem) => {
            // Update local state
            setProducts(prev => [...prev, newItem]);
        }
    });
};
```

### 3. File Upload
```typescript
const uploadAvatar = async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);

    await apiPost('/user/avatar', {
        data: formData,
        isMultipart: true // Important!
    });
};
```

these are few examples of how you can send an API request to the Server. you can use the `apiGet`, `apiPost`, `apiPut`, `apiDelete` methods to send requests to the server as you need with custom configurations.

### 4. Handling 200 OK as Error
If the backend returns:
`HTTP 200 OK` -> `{ "status": "error", "message": "Out of stock" }`

*   The utility detects `status !== 'success'`.
*   It throws an error automatically.
*   It triggers the `onError` callback and displays a Toast.
*   The `try/catch` block in your component captures it.