// ============================================================
// CONTACT.JS — Contact Form Handling
// Intercepts contact form submission, pre-fills user info if logged in,
// performs input validation, and sends data to /api/contact API.
// Velora Jewelry Boutique — 2026
// ============================================================

document.addEventListener("DOMContentLoaded", async () => {
    // Wait for session readiness if auth.js is loaded
    if (typeof waitForSession === "function") {
        await waitForSession();
    }

    const form = document.getElementById("contact-form");
    const msgEl = document.getElementById("contact-messages");

    if (!form) return;

    // Pre-fill fields if user is logged in
    if (window.currentUser) {
        const nameInput = document.getElementById("contact-name");
        const emailInput = document.getElementById("contact-email");
        const phoneInput = document.getElementById("contact-phone");

        if (nameInput && !nameInput.value) {
            const name = [window.currentUser.firstName, window.currentUser.lastName].filter(Boolean).join(" ");
            if (name) nameInput.value = name;
        }
        if (emailInput && !emailInput.value && window.currentUser.email) {
            emailInput.value = window.currentUser.email;
        }
        if (phoneInput && !phoneInput.value && window.currentUser.phone) {
            phoneInput.value = window.currentUser.phone;
        }
    }

    // Form submit event handler
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (typeof hideAlert === "function") {
            hideAlert(msgEl);
        }

        const nameInput = document.getElementById("contact-name");
        const emailInput = document.getElementById("contact-email");
        const phoneInput = document.getElementById("contact-phone");
        const subjectSelect = document.getElementById("contact-subject");
        const messageInput = document.getElementById("contact-message");
        const submitBtn = form.querySelector("button[type='submit']");

        const name = nameInput?.value?.trim() || "";
        const email = emailInput?.value?.trim() || "";
        const phone = phoneInput?.value?.trim() || "";
        const subject = subjectSelect?.value || "Question sur un bijou";
        const message = messageInput?.value?.trim() || "";

        // Client-side Validation
        if (!name || name.length < 2) {
            if (typeof showAlert === "function") {
                showAlert(msgEl, "Veuillez indiquer votre nom complet (au moins 2 caractères).", "error");
            }
            nameInput?.focus();
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            if (typeof showAlert === "function") {
                showAlert(msgEl, "Veuillez indiquer une adresse e-mail valide.", "error");
            }
            emailInput?.focus();
            return;
        }

        if (!phone || phone.length < 8) {
            if (typeof showAlert === "function") {
                showAlert(msgEl, "Veuillez indiquer un numéro de téléphone valide (ex: 0555 00 00 00).", "error");
            }
            phoneInput?.focus();
            return;
        }

        if (!message || message.length < 5) {
            if (typeof showAlert === "function") {
                showAlert(msgEl, "Veuillez rédiger votre message (au moins 5 caractères).", "error");
            }
            messageInput?.focus();
            return;
        }

        // Processing submit & real API request
        try {
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = "Envoi en cours...";
            }

            const response = await apiRequest("/api/contact", {
                method: "POST",
                body: JSON.stringify({ name, email, phone, subject, message })
            });

            // Success feedback
            if (typeof showAlert === "function") {
                showAlert(
                    msgEl,
                    `<strong>Merci ${escapeHTML ? escapeHTML(name) : name} !</strong> Votre message a bien été transmis et enregistré. Notre équipe vous recontactera très rapidement.`,
                    "success"
                );
            }

            if (typeof showToast === "function") {
                showToast("Votre message a été envoyé avec succès !");
            }

            // Clear non-user fields
            if (messageInput) messageInput.value = "";

        } catch (error) {
            if (typeof showAlert === "function") {
                showAlert(msgEl, error.message || "Une erreur est survenue lors de l'envoi. Veuillez réessayer.", "error");
            }
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = "Envoyer mon message";
            }
        }
    });
});
