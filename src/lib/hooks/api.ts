import axios from "axios";
import { toast } from "sonner";
import { useConfigStore } from "@/stores";

let api = null; // Lazy initialization

export interface ApiOptions {
  data?: any;
  params?: any;
  headers?: any;
  displayError?: boolean;
  displaySuccess?: boolean;
  isMultipart?: boolean;
  isDownload?: boolean;
  withCredentials?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

/**
 * Helper to parse your specific Backend Error Patterns
 * Returns a formatted string for the Toast
 */
const getDisplayErrorMessage = (
  message: string | null,
  errors: any
): string => {
  // 1. If message exists, use it immediately (per protocol)
  if (message) return message;

  // 2. If no message, try to parse 'errors'
  if (!errors) return "Something went wrong";

  let firstMsg = "";
  let otherCount = 0;

  if (Array.isArray(errors)) {
    // PATTERN 2: Simple Array ["Error 1", "Error 2"]
    if (errors.length === 0) return "Request failed";
    firstMsg = String(errors[0]);
    otherCount = errors.length - 1;
  } else if (typeof errors === "object") {
    // PATTERN 1: Object { email: ["Msg"], mobile: ["Msg"] }
    const keys = Object.keys(errors);
    if (keys.length === 0) return "Request failed";

    const firstKey = keys[0];
    const firstVal = errors[firstKey];

    // Laravel usually sends array of strings for each field
    firstMsg = Array.isArray(firstVal) ? firstVal[0] : String(firstVal);
    otherCount = keys.length - 1;
  } else {
    // Fallback for unexpected string/number
    firstMsg = String(errors);
  }

  // 3. Format: "First error (and X other errors)"
  if (otherCount > 0) {
    return `${firstMsg} (and ${otherCount} other error${
      otherCount > 1 ? "s" : ""
    })`;
  }

  return firstMsg;
};

const request = async (
  method: string,
  url: string,
  options: ApiOptions = {}
) => {
  const {
    data = {},
    params = {},
    headers = {},
    displayError = true,
    displaySuccess = false,
    isMultipart = false,
    onSuccess,
    onError,
    withCredentials,
  } = options;

  // cors headers
  const apiConfig = useConfigStore.getState().api;
  const corsHeaders = apiConfig?.isSameOrigin ? {} : {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  api = axios.create({
    baseURL: useConfigStore.getState().api?.url ?? "/api/v1",
    headers: {
      "X-Requested-With": "XMLHttpRequest",
      Accept: "application/json",
      "Content-Type": "application/json",
      ...corsHeaders,
    },
    withCredentials:
      withCredentials ?? useConfigStore.getState().api?.withCredentials ?? true,
  });

  try {
    const config = {
      method,
      url,
      params,
      data,
      headers: {
        ...headers,
        ...(isMultipart ? { "Content-Type": "multipart/form-data" } : {}),
      },
    };

    if (method === "get") {
      config.params = { ...params, ...data };
    }

    const res: any = await api(config);

    // Destructure Protocol Response
    const { status, message, errors, data: responseData } = res.data || {};

    // --- CHECK FOR LOGICAL FAILURES (200 OK but status="error") ---
    if (status && status !== "success") {
      const errorPayload = {
        response: {
          data: { status, message, errors }, // Mimic axios structure for the catch block
        },
      };
      throw errorPayload;
    }

    // --- SUCCESS ---
    if (displaySuccess && message) {
      toast.success(message);
    }

    onSuccess?.(responseData ?? null);
    return responseData ?? null;
  } catch (err: any) {
    // --- UNIFIED ERROR HANDLING ---

    const response = err.response;
    const serverData = response?.data || {}; // The backend JSON

    // 1. Extract raw values
    const serverMessage = serverData.message || null;
    const serverErrors = serverData.errors || null; // This gets passed to onError

    // 2. Generate Toast Message
    // Logic: Use serverMessage if present; otherwise parse errors to find first + count
    const displayMsg =
      getDisplayErrorMessage(serverMessage, serverErrors) ||
      err.message ||
      "Request failed";

    if (displayError) {
      toast.error(displayMsg);
    }

    // 3. Callback
    // Pass the RAW 'errors' object so your forms can map "email" => "error msg"
    onError?.(serverErrors);

    // 4. Throw structured data
    throw {
      message: displayMsg,
      errors: serverErrors,
      status: response?.status,
    };
  }
};

export const apiGet = (url: string, options?: ApiOptions) =>
  request("get", url, options);
export const apiPost = (url: string, options?: ApiOptions) =>
  request("post", url, options);
export const apiPut = (url: string, options?: ApiOptions) =>
  request("put", url, options);
export const apiDelete = (url: string, options?: ApiOptions) =>
  request("delete", url, options);
