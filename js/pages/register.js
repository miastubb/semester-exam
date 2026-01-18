import { renderLayout } from "../components/layout.js";
import { apiRequest } from "../api/client.js";


renderLayout();


const root = document.getElementById("page-root");

root.innerHTML = `
  <section class="auth-page">
    <div class="auth-card">
      <h1>Create account</h1>

      <form id="registerForm" novalidate>
        <div class="form-group">
          <label for="name">Username</label>
          <input id="name" name="name" type="text" autocomplete="username" required />
          <p class="field-error" data-error-for="name" aria-live="polite"></p>
          <p class="field-hint">Allowed: letters, numbers, underscore. No spaces.</p>
        </div>
        
        
        <div class="form-group">
          <label for="email">Email (stud.noroff.no)</label>
          <input id="email" name="email" type="email" autocomplete="email" required />
          <p class="field-error" data-error-for="email" aria-live="polite"></p>
        </div>


        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" name="password" type="password" autocomplete="new-password" minlength="8" required />
          <p class="field-error" data-error-for="password" aria-live="polite"></p>
        </div>


        <button class="btn btn--primary" type="submit">Create account</button>
        <p class="form-error" id="formError" aria-live="assertive"></p>

        <p class="auth-alt">
          Already have an account? <a href="./login.html">Login here</a>
        </p>
      </form>
    </div>
  </section>  
`;


const form = document.getElementById("registerForm");
const formError = document.getElementById("formError");

function setFieldError(name, message) {
  const el = root.querySelector(`[data-error-for="${name}"]`);
  if (el) el.textContent = message || "";
}

function validateRegister({ name,  email, password}) {
  let ok = true;

  setFieldError("name", "");
  setFieldError("email", "");
  setFieldError("password", "");
  formError.textContent = "";

  if (!name) {
    setFieldError("name", "Username is required");
    ok = false;
  } else if (!/^[A-Za-z0-9_]+$/.test(name)) {
    setFieldError("name", "Username can only contain letters, numbers and underscore");
    ok = false;
  }


  if (!email) {
    setFieldError("email", "Email is required");
    ok = false;
  } else if (!email.endsWith("@stud.noroff.no")) {
    setFieldError("email", "Use your stud.noroff.no address");
   ok = false;
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

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const password = form.password.value;


  if (!validateRegister({ name, email, password })) return;

  try {
    await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),    
    })

    window.location.href = "./login.html";
  } catch (error) {
    formError.textContent = error.message || "Registration failed. Please try again";
  }
});

