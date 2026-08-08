// ============================================================
// REGISTER.JS — Registration Page Logic
// Velora Premium Jewelry — 2026
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {
  await waitForSession();

  if (window.currentUser) {
    window.location.href = dashboardLink(window.currentUser.role);
    return;
  }

  const form         = document.getElementById("register-form");
  const msgContainer = document.getElementById("register-messages");

  // Password toggle
  const toggleBtn = document.getElementById("toggle-pwd-btn");
  const pwdInput  = document.getElementById("password");
  if (toggleBtn && pwdInput) {
    const eyeOpen   = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
    const eyeClosed = `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
    toggleBtn.addEventListener("click", () => {
      const isHidden = pwdInput.type === "password";
      pwdInput.type  = isHidden ? "text" : "password";
      toggleBtn.innerHTML = isHidden ? eyeClosed : eyeOpen;
    });
  }

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (msgContainer) hideAlert(msgContainer);

    const fullNameValue = document.getElementById("name").value.trim();
    const email         = document.getElementById("email").value.trim();
    const password      = pwdInput.value;
    const phone         = document.getElementById("phone")?.value.trim() || "";
    const submitBtn     = form.querySelector(".auth-submit-btn");

    if (!fullNameValue || !email || !password || !phone) {
      if (msgContainer) showAlert(msgContainer, "Veuillez remplir tous les champs requis.", "error");
      return;
    }

    if (password.length < 8) {
      if (msgContainer) showAlert(msgContainer, "Le mot de passe doit comporter au moins 8 caractères.", "error");
      return;
    }

    const nameParts = fullNameValue.split(" ");
    const firstName = nameParts[0] || fullNameValue;
    const lastName  = nameParts.slice(1).join(" ") || "";

    try {
      submitBtn.disabled    = true;
      submitBtn.textContent = "Création…";

      await apiRequest("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ firstName, lastName, email, password, phone })
      });

      await apiRequest("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
      });

      window.location.href = "/account.html";

    } catch (error) {
      submitBtn.disabled    = false;
      submitBtn.textContent = "Créer mon compte";
      if (msgContainer) showAlert(msgContainer, error.message, "error");
    }
  });
});
