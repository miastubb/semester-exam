import { renderLayout } from "../components/layout.js";
import { createPost } from "../api/posts.js";
import { CONFIG } from "../api/config.js";

renderLayout();


const root = document.querySelector("#page-root");

function rendeer() {
  root.innerHTML = `
    <section class="create-post">
      <h1>Create Post</h1>

      <form id="createPostForm" class="form">
       <div class="form-group">
          <label for="title">Title</label>
          <input id="title" name="title" type="text" maxlength="120" required />
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


        <button type="submit" class="btn btn--primary" id="submitBtn">Publish</button>
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


function buildPayload(form) {
  const title = form.title.value.trim();
  const body = form.body.value.trim();
  const mediaUrl = form.mediaUrl.value.trim();
  const mediaAlt = form.mediaAlt.value.trim();


  if (!title || !body) {
    throw new Error("Title and body are required.");
  }


  const payload = { title, body };


  if (mediaUrl) {
    payload.media = { url: mediaUrl, alt: mediaAlt || ""};
  }


  return payload;
}


async function onSubmit(e) {
  e.preventDefault();

  const form = e.currentTarget;

  try {
    setMessage("");
    setSubmitting(true);

    const payload = buildPayload(form);
    await createPost(payload);

    setMessage("Post created. Redirecting...", "success");
    window.location.href = `${CONFIG.BASE_PATH}/index.html`;
  } catch (err) {
    console.error(err);
    setMessage(err.message || "Failed to create post.", "error");
  } finally {
    setSubmitting(false);
  }
}


function init() {
  if (!root) return;
  rendeer();

  const form = document.querySelector("#createPostForm");
  form.addEventListener("submit", onSubmit);
}

init();
  

