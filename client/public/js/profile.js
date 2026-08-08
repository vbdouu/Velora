// ============================================================
// PROFILE.JS — Customer account: My Info tab
// Handles profile update, password change, and email change.
// Velora Jewelry Boutique — 2026
// ============================================================

async function loadProfile() {
    try {
        const { user } = await apiRequest("/api/auth/me");

        const firstNameEl = document.getElementById("firstName");
        const lastNameEl  = document.getElementById("lastName");
        const emailEl     = document.getElementById("email");
        const phoneEl     = document.getElementById("phone");

        if (firstNameEl) firstNameEl.value = user.firstName || "";
        if (lastNameEl)  lastNameEl.value  = user.lastName  || "";
        if (emailEl)     emailEl.value     = user.email     || "";
        if (phoneEl)     phoneEl.value     = user.phone     || "";

    } catch (error) {
        const msgEl = document.getElementById("profile-messages");
        showAlert(msgEl, "Impossible de charger les données du profil.", "error");
    }
}

function setupProfileForms() {
    // ── Profile (name / phone) ──
    const profileForm = document.getElementById("profile-form");
    if (profileForm) {
        profileForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const msgEl = document.getElementById("profile-messages");
            hideAlert(msgEl);

            const firstName = document.getElementById("firstName")?.value?.trim() || "";
            const lastName  = document.getElementById("lastName")?.value?.trim()  || "";
            const phone     = document.getElementById("phone")?.value?.trim()     || "";
            const submitBtn = profileForm.querySelector("button[type='submit']");

            if (!firstName || !lastName) {
                showAlert(msgEl, "Le prénom et le nom sont obligatoires.", "error");
                return;
            }

            try {
                submitBtn.disabled = true;
                const originalText = submitBtn.textContent;
                submitBtn.textContent = "Enregistrement...";

                await apiRequest("/api/auth/profile", {
                    method: "PUT",
                    body: JSON.stringify({ firstName, lastName, phone })
                });

                // Refresh session user
                const res = await apiRequest("/api/auth/me");
                window.currentUser = res.user;

                // Update sidebar name
                const nameEl = document.getElementById("sidebar-user-name");
                if (nameEl) nameEl.textContent = [firstName, lastName].filter(Boolean).join(" ");

                showToast("Informations mises à jour avec succès.");

            } catch (error) {
                showAlert(msgEl, error.message, "error");
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = "Enregistrer les modifications";
            }
        });
    }

    // ── Password change ──
    const passwordForm = document.getElementById("password-form");
    if (passwordForm) {
        passwordForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const msgEl = document.getElementById("password-form-messages");
            hideAlert(msgEl);

            const currentPwd = document.getElementById("currentPassword")?.value || "";
            const newPwd     = document.getElementById("newPassword")?.value     || "";
            const confirmPwd = document.getElementById("confirmPassword")?.value  || "";
            const submitBtn  = passwordForm.querySelector("button[type='submit']");

            if (newPwd.length < 8) {
                showAlert(msgEl, "Le nouveau mot de passe doit contenir au moins 8 caractères.", "error");
                return;
            }

            if (newPwd !== confirmPwd) {
                showAlert(msgEl, "Les mots de passe ne correspondent pas.", "error");
                return;
            }

            try {
                submitBtn.disabled = true;
                submitBtn.textContent = "Mise à jour...";

                await apiRequest("/api/auth/password", {
                    method: "PUT",
                    body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd })
                });

                passwordForm.reset();
                showToast("Mot de passe modifié avec succès.");
                showAlert(msgEl, "Mot de passe mis à jour. Reconnectez-vous lors de votre prochaine visite.", "success");

            } catch (error) {
                showAlert(msgEl, error.message, "error");
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = "Changer le mot de passe";
            }
        });
    }

    // ── Email change ──
    const emailForm = document.getElementById("email-form");
    if (emailForm) {
        emailForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const msgEl    = document.getElementById("email-form-messages");
            hideAlert(msgEl);

            const newEmail     = document.getElementById("newEmail")?.value?.trim()     || "";
            const emailPwd     = document.getElementById("emailPassword")?.value         || "";
            const submitBtn    = emailForm.querySelector("button[type='submit']");
            const emailDisplay = document.getElementById("email");

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(newEmail)) {
                showAlert(msgEl, "Adresse e-mail invalide.", "error");
                return;
            }

            if (!emailPwd) {
                showAlert(msgEl, "Veuillez saisir votre mot de passe actuel.", "error");
                return;
            }

            try {
                submitBtn.disabled = true;
                submitBtn.textContent = "Mise à jour...";

                await apiRequest("/api/auth/email", {
                    method: "PUT",
                    body: JSON.stringify({ newEmail, password: emailPwd })
                });

                emailForm.reset();

                // Update displayed email
                if (emailDisplay) emailDisplay.value = newEmail;
                if (window.currentUser) window.currentUser.email = newEmail;

                showToast("Adresse e-mail mise à jour avec succès.");
                showAlert(msgEl, "Votre adresse e-mail a été modifiée.", "success");

            } catch (error) {
                showAlert(msgEl, error.message, "error");
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = "Changer l'adresse e-mail";
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    // Only auto-initialize if on standalone profile page (or container exists)
    if (document.body.dataset.active === "profile" || document.getElementById("profile-form")) {
        if (typeof waitForSession === "function") {
            await waitForSession();
        }
        if (typeof loadProfile === "function") loadProfile();
        if (typeof setupProfileForms === "function") setupProfileForms();
    }
});

