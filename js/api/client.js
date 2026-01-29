import { getToken } from "../storage/token.js";
import { CONFIG } from "./config.js";
import { getApiKey } from "../storage/apiKey.js";

export async function apiRequest(url, options = {}) {
  const headers = new Headers(options.headers || {});
  
  const hasBody = options.body !== null && options.body !== undefined;

  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;
  if (hasBody && !isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getToken();
  if (token) {
        headers.set("Authorization", `Bearer ${token}`);
}

  const apiKey = getApiKey();
  if (apiKey) {
     headers.set("X-Noroff-API-Key", apiKey);
}

  const fullUrl = url.startsWith("/") ? `${CONFIG.BASE_URL}${url}` : url;
  const response = await fetch(fullUrl, { ...options, headers });

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
