import { isLoggedIn } from "../storage/token.js";

export default function Header() {
  const loggedIn = isLoggedIn();

  const authLinks = loggedIn
    ? `
        <li class="nav__item">
          <a class="nav__link nav__link--primary" href="/post/create.html">Create</a>
        </li>
        <li class="nav__item">
          <button class="nav__button" id="log-out-btn" type="button">Logout</button>
        </li>
      `
      : `
        <li class="nav__item">
          <a class="nav__link nav__link--primary" href="/account/register.html">Register</a>
        </li>
      `;

 return `
  <div class="site-header site-header--centered">
    <div class="site-header__inner">
      <a class="brand brand--text" href="/index.html" aria-label="Go to blog feed">
        <span class="brand__mark">Blog</span>
        <span class="brand__name">Client Name</span>
      </a>

      <a class="brand brand--logo" href="/semester-exam/index.html" aria-label="Go to BlogWorld feed">
  <img src="/semester-exam/assets/img/blogworld-logo.svg" alt="BlogWorld" class="brand__logo" />
</a>


      <div class="header-actions">
        <nav class="nav nav--desktop" aria-label="Main navigation">
          <ul class="nav__list">
            <li class="nav__item">
              <a class="nav__link" href="/index.html">Home</a>
            </li>
            ${authLinks}
          </ul>
        </nav>

        <button
          class="menu-toggle"
          type="button"
          aria-expanded="false"
          aria-controls="mobile-menu"
        >
          Menu <span class="menu-toggle__chev" aria-hidden="true">▾</span>
        </button>
      </div>
    </div>

    <nav class="nav nav--mobile" id="mobile-menu" aria-label="Mobile navigation" hidden>
      <ul class="nav__list nav__list--mobile">
        <li class="nav__item">
          <a class="nav__link" href="/index.html">Home</a>
        </li>
        ${authLinks}
      </ul>
    </nav>
  </div>
`;
}

export function initHeaderMenu() {
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector("#mobile-menu");
  if (!menuToggle || !mobileMenu) return;

  const setState = (isOpen) => {
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    mobileMenu.hidden = !isOpen;
  };

  const isOpen = () => menuToggle.getAttribute("aria-expanded") === "true";

  const close = () => setState(false);
  const open = () => setState(true);
  const toggle = () => (isOpen() ? close() : open());

  setState(false);

  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation(); 
    toggle();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) close();
  });

  document.addEventListener("click", (e) => {
    if (!isOpen()) return;
    const clickedInside = mobileMenu.contains(e.target) || menuToggle.contains(e.target);
    if (!clickedInside) close();
  });

  mobileMenu.addEventListener("click", (e) => {
    const linkOrButton = e.target.closest("a, button");
    if (linkOrButton) close();
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 992px)").matches) close();
  });
}
