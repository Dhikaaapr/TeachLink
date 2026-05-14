const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005/api";

/**
 * Generic API request helper with cookie-based auth support
 */
export async function apiRequest(endpoint, options = {}) {
  const { body, headers: customHeaders, ...rest } = options;

  // Determine if body is FormData (file uploads)
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...customHeaders,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers,
    credentials: "include", // ← Send cookies for JWT auth
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Something went wrong");
    error.status = response.status;
    throw error;
  }

  return data;
}

/**
 * Auto-refresh token on 401 and retry the original request
 */
export async function apiRequestWithRetry(endpoint, options = {}) {
  try {
    return await apiRequest(endpoint, options);
  } catch (err) {
    // If 401 Unauthorized, try refreshing the token
    if (err.status === 401) {
      try {
        await apiRequest("/auth/refresh", { method: "POST" });
        // Retry original request
        return await apiRequest(endpoint, options);
      } catch (refreshErr) {
        // Refresh also failed — user needs to re-login
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        throw refreshErr;
      }
    }
    throw err;
  }
}
