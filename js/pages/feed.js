import { renderLayout } from "../components/layout.js";
import { getPosts } from "../api/posts.js";
import { createPostCard } from "../components/postCard.js";
import { CONFIG } from "../api/config.js";

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

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[m]));
}

function normalizePost(post) {
  return post?.data ?? post;
}

function buildCarousel(posts) {
  const carouselRoot = document.querySelector("#carousel-root");
  if (!carouselRoot) return;

  const items = posts.slice(0, 3).map(normalizePost).filter(Boolean);

  
  if (items.length === 0) {
    carouselRoot.innerHTML = `<h2>Latest</h2><p>No posts yet.</p>`;
    return;
  }

  let index = 0;

  carouselRoot.innerHTML = `
    <div class="carousel" aria-roledescription="carousel" aria-label="Latest posts carousel">
      <div class="carousel__header">
        <h2 class="carousel__title">Latest</h2>

        <div class="carousel__controls" aria-label="Carousel controls">
          <button type="button" class="btn btn--secondary" id="carouselPrev" aria-label="Previous post">
            Prev
          </button>
          <button type="button" class="btn btn--secondary" id="carouselNext" aria-label="Next post">
            Next
          </button>
        </div>
      </div>

     <div class="carousel__viewport">
        <div class="carousel__track" id="carouselTrack">
          ${items
            .map((p) => {
              const id = escapeHtml(p.id);
              const title = escapeHtml(p.title);
              const bodyRaw = String(p.body ?? "");
              const body = escapeHtml(bodyRaw.length > 160 ? bodyRaw.slice(0, 160) + "…" : bodyRaw);
              const imgUrl = p?.media?.url ? escapeHtml(p.media.url) : "";
              const imgAlt = escapeHtml(p?.media?.alt || p?.title || "Blog post image");

         return `
          <article class="carousel__slide" role="group" aria-roledescription="slide">
               ${
                imgUrl
                  ? `<img
                       class="carousel__image"
                       src="${imgUrl}"
                       alt="${imgAlt}"
                      ${items.indexOf(p) === 0
                       ? 'loading="eager" fetchpriority="high" decoding="async"'
                       : 'loading="lazy" decoding="async"'}
                   >`
              : ``
          }

                  <div class="carousel__content">
                    <h3 class="carousel__slideTitle">${title}</h3>
                    <p class="carousel__excerpt">${body}</p>
                    <a class="btn btn--primary" href="${CONFIG.BASE_PATH}post/index.html?id=${id}">
                    Read more:  ${title}
                    </a>


                  </div>
                </article>
              `;
            })
            .join("")}
        </div>
      </div>

      <div class="carousel__dots" role="tablist" aria-label="Select a slide">
        ${items
          .map((_, i) => {
            const isActive = i === 0 ? "true" : "false";
            return `
              <button
                type="button"
                class="carousel__dot"
                role="tab"
                aria-selected="${isActive}"
                aria-label="Go to slide ${i + 1}"
                data-index="${i}"
              ></button>
            `;
          })
          .join("")}
      </div>
    </div>
  `;

  const track = document.querySelector("#carouselTrack");
  const prevBtn = document.querySelector("#carouselPrev");
  const nextBtn = document.querySelector("#carouselNext");
  const dots = Array.from(document.querySelectorAll(".carousel__dot"));

  function update() {
  
    track.style.transform = `translateX(-${index * 100}%)`;

    dots.forEach((d, i) => {
      d.setAttribute("aria-selected", String(i === index));
    });
  }

  function goNext() {
  index = (index + 1) % items.length;
  update();
}


  function goPrev() {
    index = (index - 1 + items.length) % items.length; 
    update();
  }

  prevBtn?.addEventListener("click", goPrev);
  nextBtn?.addEventListener("click", goNext);

  dots.forEach((d) => {
    d.addEventListener("click", () => {
      const i = Number(d.dataset.index);
      if (!Number.isNaN(i)) {
        index = i;
        update();
      }
    });
  });

 
  update();

  let timer = setInterval(goNext, 6000);

const viewport = carouselRoot.querySelector(".carousel__viewport");

function pauseAuto() {
  clearInterval(timer);
  timer = null;
}

function resumeAuto() {
  if (!timer) timer = setInterval(goNext, 6000);
}

viewport?.addEventListener("mouseenter", pauseAuto);
viewport?.addEventListener("mouseleave", resumeAuto);
viewport?.addEventListener("focusin", pauseAuto);
viewport?.addEventListener("focusout", resumeAuto);
}

function renderFeed(posts) {
  root.innerHTML = `
    <section class="feed">
      <div class="feed__carousel" id="carousel-root"></div>
      <div class="feed__grid" id="grid-root" aria-label="latest posts"></div>
    </section>
  `;

 
  buildCarousel(posts);

  const grid = document.querySelector("#grid-root");
  posts.slice(0, 12).forEach((post) => {
    grid.appendChild(createPostCard(normalizePost(post)));
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
