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

      <a class="brand brand--logo" href="/index.html" aria-label="Go to BlogWorld feed">
        <img src="assets/img/blogworld-logo.svg" alt="BlogWorld" class="brand__logo"/>

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


  menuToggle.setAttribute("aria-expanded", "false");
  mobileMenu.hidden = true;


  const close = () => {
    menuToggle.setAttribute("aria-expanded", "false");
    mobileMenu.hidden = true;
  };

  const open = () => {
    menuToggle.setAttribute("aria-expanded", "true");
    mobileMenu.hidden = false;
  };

  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    isOpen ? close() : open();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  document.addEventListener("click", (e) => {
    const clickedInside = mobileMenu.contains(e.target) || menuToggle.contains(e.target);
    if (!clickedInside) close();
  });
}


       
