const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005/api";

export async function apiRequest(endpoint, options = {}) {
  const { body, ...rest } = options;
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...rest,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}
