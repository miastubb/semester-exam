import { renderLayout } from "../components/layout.js";
import { getToken } from "../storage/token.js";
import { CONFIG } from "../api/config.js";
import { getPostById, updatePost } from "../api/posts.js";


renderLayout();


const root = document.querySelector("#page-root");
if (!root) throw new Error("missing #page-root");


const token = getToken();
if (!token) {
  window.location.href = `${CONFIG.BASE_PATH}account/login.html`;
  throw new Error("No access token - redirecting to login");
}


const params = new URLSearchParams(window.location.search);
const postId = params.get("id");

if (!postId) {
  root.innerHTML = `
    <section class="container">
      <h1>Edit post</h1>
      <p>Missing post ID. Go back to the feed and choose a post to edit.</p>
      <a class="btn btn--primary" href="${CONFIG.BASE_PATH}index.html">Back to feed</a>
     </section>
     `;
    throw new Error("Missing id query param on edit page");
}


function render() {
  root.innerHTML =`
    <section class="edit-post container">
    <h1>Edit post</h1>

    <form id="editPostForm" class="form">
      <div class="form-group">
        <label for="title">Title</label>
        <input id="title" name="title" type="text" maxlength="120" required/>
      </div>


      <div class="form-group">
        <label for="body">Body</label>
        <textarea id="body" name="body" rows="8" required></textarea>
      </div>


      <div class="form-group">
        <label for="mediaUrl">Media URL (optional)</label>
        <input id="mediaUrl" name="mediaUrl" type="url" />
      </div>


      <div class="form-group">
        <label for="mediaAlt">Image alt text (optional)</label>
        <input id="mediaAlt" name="mediaAlt" type="text" maxlength="120" />
      </div>


      <button type="submit" class="btn btn--primary" id="submitBtn">Save changes</button>
      <p id="formMessage" class="form-message" aria-live="polite"></p>
    </form>
  </section>
  `;
}


function setMessage(message, type = "info") {
  const el = document.querySelector("#formMessage");
  if (!el) return;
  el.textContent = message;
  el.dataset.type = type;
}


function setSubmitting(isSubmitting) {
  const btn = document.querySelector("#submitBtn");
  if (btn) btn.disabled = isSubmitting;
}


function populateForm(post) {
  const form = document.querySelector("#editPostForm");
  if (!form) return;

  form.title.value = post?.title ??"";
  form.body.value = post?.body ??"";
  form.mediaUrl.value = post?.media?.url ??"";
  form.mediaAlt.value = post?.media?.alt ??"";
}

function buildPayload(form) {
  const title = form.title.value.trim();
  const body = form.body.value.trim();
  const mediaUrl = form.mediaUrl.value.trim();
  const mediaAlt = form.mediaAlt.value.trim();


  if (!title || !body) {
    return { error: "Title and body are required." };
  }

   const payload = { title, body };

  if (mediaUrl) {
    payload.media = { url: mediaUrl, alt: mediaAlt || "" };
  }

  return { payload };
}

async function onSubmit(e) {
  e.preventDefault();

  const form = e.currentTarget;

  setMessage("");
  setSubmitting(true);

   try {
    const { payload, error } = buildPayload(form);
    if (error) {
      setMessage(error, "error");
      return;
    }

       await updatePost(postId, payload);

    setMessage("Post updated. Redirecting...", "success");
    window.location.href = `${CONFIG.BASE_PATH}post/index.html?id=${postId}`;
  } catch (err) {
    console.error(err);
    setMessage(err.message || "Failed to update post.", "error");
  } finally {
    setSubmitting(false);
  }
}

async function init() {
  render();

  setSubmitting(true);
  setMessage("Loading post…");

    try {
    const post = await getPostById(postId);
    populateForm(post);
    setMessage("");
  } catch (err) {
    console.error(err);
    root.innerHTML = `
      <section class="container">
        <h1>Edit post</h1>
        <p class="form-message" data-type="error">${err.message || "Failed to load post."}</p>
        <a class="btn btn--primary" href="${CONFIG.BASE_PATH}index.html">Back to feed</a>
      </section>
    `;
    return;
  } finally {
    setSubmitting(false);
  }

  const form = document.querySelector("#editPostForm");
  form.addEventListener("submit", onSubmit);
}

init();

