const API_KEY_STORAGE = "noroffApiKey";

export function setApiKey(key) {
  localStorage.setItem(API_KEY_STORAGE, key);
}

export function getApiKey() {
  return localStorage.getItem(API_KEY_STORAGE);
}

export function clearApiKey() {
  localStorage.removeItem(API_KEY_STORAGE);
}
