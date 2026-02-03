import { renderLayout } from "../components/layout.js";
import { apiRequest } from "../api/client.js";
import { setToken }  from "../storage/token.js";
import { getApiKey, setApiKey } from "../storage/apiKey.js";
import { CONFIG } from "../api/config.js";


renderLayout();

const root = document.getElementById("page-root");

root.innerHTML = `
  <section class="auth-page">
    <div class="auth-card">
      <h1>Login</h1>

      <form id="loginForm" novalidate>
        <div class="form-group">
          <label for="email">Email (stud.noroff.no / noroff.no)</label>
          <input id="email" name="email" type="email" autocomplete="email" required />
          <p class="field-error" data-error-for="email" aria-live="polite"></p>
        </div>


       <div class="form-group">
         <label for="password">Password</label>

       <div class="password-field">
           <input id="password" name="password" type="password" autocomplete="current-password" minlength="8" required />
          <button
             type="button"
             class="password-field__toggle"
             aria-label="Show password"
             aria-pressed="false"
             data-toggle-password="password"
           >
             👁
          </button>
        </div>

  <p class="field-error" data-error-for="password" aria-live="polite"></p>
</div>


        <button class="btn btn--primary" type="submit">Login</button>
        <p class="form-error" id="formError" aria-live="assertive"></p>

        <p class="auth-alt">
          No account? <a href="./register.html">Create one here</a>
        </p>
      </form>
    </div>
  </section>

`;

const form = document.getElementById("loginForm");
const formError = document.getElementById("formError");

initPasswordToggles();


function initPasswordToggles() {
  root.querySelectorAll("[data-toggle-password]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const inputId = btn.getAttribute("data-toggle-password");
      const input = document.getElementById(inputId);
      if (!input) return;

      const show = input.type === "password";
      input.type = show ? "text" : "password";

      btn.setAttribute("aria-pressed", String(show));
      btn.setAttribute("aria-label", show ? "Hide password" : "Show password");
    });
  });
}



function setFieldError(name, message) {
  const el = root.querySelector(`[data-error-for="${name}"]`);
  if (el) el.textContent = message || "";
}

function validateLogin({ email, password}) {
  let ok = true;

  setFieldError("email", "");
  setFieldError("password", "");
  formError.textContent = "";

  if (!email) {
    setFieldError("email", "Email is required");
    ok = false;
  } else {
  const e = email.toLowerCase();
  const allowedDomains = ["@stud.noroff.no", "@noroff.no"];

  if (!allowedDomains.some((d) => e.endsWith(d))) {
    setFieldError("email", "Use your Noroff email address");
    ok = false;
  }
}


  if (!password) {
    setFieldError("password", "Password is required");
    ok = false;
  } else if (password.length < 8) {
    setFieldError("password", "Password must be at least 8 characters");
    ok = false;
  }

  return ok;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.elements.email?.value?.trim() || "";
  const password = form.elements.password?.value || "";


  if (!validateLogin({ email, password })) return;

  try {
    const res = await apiRequest("/auth/login", {
       method: "POST",
       body: JSON.stringify({ email, password }),
});

  const accessToken = res?.data?.accessToken;
  if (!accessToken) throw new Error("login succeeded but no access token returned");

    setToken(accessToken);

    localStorage.removeItem("noroffApiKey");


  
  const existingKey = getApiKey();

  if (!existingKey) {
     const apiKeyRes = await apiRequest("/auth/create-api-key", {
       method: "POST",
       body: JSON.stringify({ name: "semester-exam-key" }),
});


  const apiKey = apiKeyRes?.data?.key;
  if (apiKey) {
    setApiKey(apiKey);
  }
}
    window.location.href = `${CONFIG.BASE_PATH}index.html`;
  } catch (error) {
    formError.textContent = error.message || "Login failed, please try again";
  }
});
