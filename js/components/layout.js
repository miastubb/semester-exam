import Header, { initHeaderMenu } from "./header.js";
import Footer from "./footer.js";
import { clearToken, isLoggedIn } from "../storage/token.js";
import { CONFIG } from "../api/config.js";

export function renderLayout() {
  const headerEl = document.querySelector("#site-header");
  const footerEl = document.querySelector("#site-footer");

  if (!headerEl || !footerEl) {
    console.warn("Layout placeholder missing: #site-header or #site-footer");
    return;
  }

  headerEl.innerHTML = Header();
  footerEl.innerHTML = Footer();

  initHeaderMenu();

  if (isLoggedIn()) {
    const logOutBtn = document.querySelector("#log-out-btn");
    if (logOutBtn) {
      logOutBtn.addEventListener("click", () => {
        clearToken();
        window.location.href = `${CONFIG.BASE_PATH}index.html`;
      });
    }
  }
}
