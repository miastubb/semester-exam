import { renderLayout } from "../components/layout.js";
import { getPosts } from "../api/posts.js";
import { createPostCard } from "../components/postCard.js";


renderLayout();


const root = document.querySelector("#page-root");

function renderLoading() {
  root.innerHTML = `<p>Loading posts...</p>`;
}

function renderError(message) {
  root.innerHTML = `
    <div class="alert alert--error" role="alert">
      <p>${message}</p>
    </div>
  `;
}

function renderFeed(posts) {
  root.innerHTML = `
    <section class="feed">
      <div class="feed__carousel" id="carousel-root">
        <h2>Latest</h2>
        <p>(carousel comes next)</p>
      </div>

      <div class="feed__grid" id="grid-root" aria-label="latest posts"></div>
    </section>
  `;

  const grid = document.querySelector("#grid-root");
  posts.forEach((post) => {
    grid.appendChild(createPostCard(post));
  });
}

async function init() {
  if (!root) return;

  try {
    renderLoading();
    const response = await getPosts({ limit: 12, sort: "created", sortOrder: "desc" });
    const posts = Array.isArray(response) ? response : (response?.data ?? []);


    if (posts.length === 0) {
      root.innerHTML = `<p>No posts yet. Create your first post.</p>`;
      return;
    }

    renderFeed(posts);
  } catch (err) {
    renderError(err.message || "Something went wrong.");
    console.error(err);
  }
}

init();

