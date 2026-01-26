import { CONFIG } from "../api/config.js";

export function createPostCard(post) {
  const id = post.id;
  const title = post.title || "untitled";
  const imgUrl = post.media?.url || "";
  const imgAlt = post.media?.alt || title;
  const created = post.created ? new Date(post.created).toLocaleDateString() : "";

  const article = document.createElement("article");
  article.className = "post-card";

  article.innerHTML = `
    <a class="post-card__link" href="${CONFIG.BASE_PATH}post/index.html?id=${encodeURIComponent(id)}">
      <div class="post-card__media">
        ${
          imgUrl
            ? `<img src="${imgUrl}" alt="${imgAlt}" loading="lazy" />`
            : `<div class="post-card__placeholder" aria-hidden="true"></div>`
        }
      </div>
      <div class="post-card__content">
        <h3 class="post-card__title">${title}</h3>
        <p class="post-card__meta">${created}</p>
      </div>
    </a>
  `;

  return article;
}
