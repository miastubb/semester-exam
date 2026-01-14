import { CONFIG } from "./config.js";
import { apiRequest } from "./client.js";

export function getPosts({ limit = 12, sort = "created", sortOrder = "desc" } = {}) {
  const url = new URL(`${CONFIG.BASE_URL}/blog/posts/${CONFIG.BLOG_NAME}`);
  url.searchParams.set("limit", String(limit));
  url.searchParams.set("sort", sort);
  url.searchParams.set("sortOrder", sortOrder);

  return apiRequest(url.toString(), { method: "GET" });
}

export function getPostById(id) {
  const url = `${CONFIG.BASE_URL}/blog/posts/${CONFIG.BLOG_NAME}/${id}`;
  return apiRequest(url, { method: "GET" });
}

export function createPost(data) {
  const url = `${CONFIG.BASE_URL}/blog/posts/${CONFIG.BLOG_NAME}`;
  return apiRequest(url, { method: "POST", body: JSON.stringify(data) });
}

export function updatePost(id, data) {
  const url = `${CONFIG.BASE_URL}/blog/posts/${CONFIG.BLOG_NAME}/${id}`;
  return apiRequest(url, { method: "PUT", body: JSON.stringify(data) });
}

export function deletePost(id) {
  const url = `${CONFIG.BASE_URL}/blog/posts/${CONFIG.BLOG_NAME}/${id}`;
  return apiRequest(url, { method: "DELETE" });
}
