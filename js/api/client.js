import { getToken } from "../storage/token.js";

export async function apiRequest(url, options = {}) {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, { ...options, headers });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      payload?.errors?.[0]?.message ||
      payload?.message ||
      `Request failed (${response.status})`;
    throw new Error(message);
  }

  return payload;
}
