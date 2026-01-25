import { renderLayout } from "../components/layout.js";
import { CONFIG } from "../api/config.js";
import { getToken } from "../storage/token.js";
import { getPostById, deletePost } from "../api/posts.js";

renderLayout();

const root = document.querySelector("#page-root");
const container = document.querySelector("#postDetail");

if (!root) throw new Error("Missing #page-root");
if (!container) throw new Error("Missing #postDetail");

const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

if (!postId || postId === "undefined") {
  container.innerHTML = `
    <section class="container">
      <h1>Post</h1>
      <p class="form-message" data-type="error">Missing or invalid post ID.</p>
      <a class="btn btn--primary" href="${CONFIG.BASE_PATH}index.html">Back to feed</a>
    </section>
  `;
  throw new Error("Missing/invalid id query param on post page");
}

const token = getToken();

function setMessage(message, type = "info") {
  const el = document.querySelector("#pageMessage");
  if (!el) return;
  el.textContent = message;
  el.dataset.type = type;
}

function setBusy(isBusy) {
  const delBtn = document.querySelector("#deletePostBtn");
  if (delBtn) delBtn.disabled = isBusy;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[m]));
}

function renderPost(post) {
  const p = post?.data ?? post;

  container.innerHTML = `
    <article class="post">
      <header class="post__header">
        <h1 class="post__title">${escapeHtml(p?.title ?? "")}</h1>
        ${
          p?.author?.name
            ? `<p class="post__meta">By ${escapeHtml(p.author.name)}</p>`
            : ""
        }
      </header>

      ${
        p?.media?.url
          ? `<img class="post__image" src="${p.media.url}" alt="${escapeHtml(p.media.alt ?? "")}">`
          : ""
      }

      <div class="post__body">${escapeHtml(p?.body ?? "")}</div>

      <div class="post__actions">
        <a class="btn btn--secondary" href="${CONFIG.BASE_PATH}index.html">Back</a>

        ${
          token
            ? `
              <a class="btn btn--secondary" id="editPostLink" href="${CONFIG.BASE_PATH}post/edit.html?id=${postId}">Edit</a>
              <button class="btn btn--danger" id="deletePostBtn" type="button">Delete</button>
            `
            : ""
        }
      </div>

      <p id="pageMessage" class="form-message" aria-live="polite"></p>
    </article>
  `;

  if (token) wireDelete(postId);
}

function wireDelete(id) {
  const btn = document.querySelector("#deletePostBtn");
  if (!btn) return;

  btn.addEventListener("click", async () => {
    const ok = confirm("Are you sure you want to delete this post?");
    if (!ok) return;

    try {
      setBusy(true);
      setMessage("Deleting post…");

      await deletePost(id);

      setMessage("Post deleted. Redirecting…", "success");
      window.location.href = `${CONFIG.BASE_PATH}index.html`;
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Failed to delete post.", "error");
    } finally {
      setBusy(false);
    }
  });
}

async function init() {
  container.innerHTML = `<p>Loading post…</p>`;

  try {
    const post = await getPostById(postId);
    renderPost(post);
  } catch (err) {
    console.error(err);
    container.innerHTML = `
      <section class="container">
        <h1>Post</h1>
        <p class="form-message" data-type="error">${escapeHtml(
          err.message || "Failed to load post."
        )}</p>
        <a class="btn btn--primary" href="${CONFIG.BASE_PATH}index.html">Back to feed</a>
      </section>
    `;
  }
}

init();
