import { isLoggedIn } from "../storage/token.js";

export default function Header() {
  const loggedIn = isLoggedIn();

  return `
    <div class="site-header site-header--centered">
      <div class="site-header__inner">
        <a class="brand brand--text" href="/index.html" aria-label="Go to blog feed">
          <span class="brand__mark">Blog</span>
          <span class="brand__name">Client Name</span>
        </a>

        <a class="brand brand--logo" href="/index.html" aria-label="Go to BlogWorld feed">
          <img src="/assets/img/blogworld-logo.svg" alt="BlogWorld" class="brand__logo" />
        </a>

        <nav class="nav" aria-label="Main navigation">
          <ul class="nav__list">
            <li class="nav__item">
              <a class="nav__link" href="/index.html">Home</a>
            </li>

            ${
              loggedIn
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
                `
            }
          </ul>
        </nav>
      </div>
    </div>
  `;
}
