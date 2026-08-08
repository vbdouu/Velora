const API_BASE = "";
const DEFAULT_AVATAR = "/images/defaults/avatar.svg";

// Check if the body is a FormData instance
function isFormData(value) {
    return typeof FormData !== "undefined" && value instanceof FormData;
}

// Send an API request
async function apiRequest(url, options = {}) {
    const config = {
        credentials: "include",
        ...options
    };

    if (!isFormData(config.body)) {
        config.headers = {
            "Content-Type": "application/json",
            ...(options.headers || {})
        };
    } else {
        config.headers = options.headers || {};
    }

    const response = await fetch(API_BASE + url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        const error = new Error(data.message || "Une erreur est survenue.");
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
}

// Read a URL parameter
function getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
}

// Escape HTML to prevent XSS
function escapeHTML(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

// Normalize text for search (remove accents, lowercase)
function normalizeText(value) {
    return String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

// Return a valid profile image or default avatar
function profileImage(path) {
    return path || DEFAULT_AVATAR;
}

// Format a date in French locale
function formatDate(value) {
    if (!value) return "Non précisée";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Non précisée";
    return date.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}

// Format a date with time
function formatDateTime(value) {
    if (!value) return "Non précisée";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "Non précisée";
    return date.toLocaleString("fr-FR", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

// Format a price in DZD
function formatPrice(value) {
    const number = Number(value || 0);
    return number.toLocaleString("fr-FR") + " DA";
}

// Convert a technical status to a human-readable label
function statusLabel(status) {
    const labels = {
        pending: "En attente",
        confirmed: "Confirmée",
        shipped: "Expédiée",
        delivered: "Livrée",
        cancelled: "Annulée",
        active: "Actif",
        blocked: "Bloqué"
    };
    return labels[status] || status || "Inconnu";
}

// Build a status badge
function statusBadge(status) {
    return `<span class="status-pill ${escapeHTML(status)}">${escapeHTML(statusLabel(status))}</span>`;
}

// Build a full name from a user object
function fullName(obj) {
    const first = obj?.firstName || obj?.first_name || "";
    const last = obj?.lastName || obj?.last_name || "";
    return `${first} ${last}`.trim() || "Utilisateur Velora";
}

// Truncate a long text
function truncate(text, length = 130) {
    const value = String(text || "");
    if (value.length <= length) return value;
    return `${value.slice(0, length).trim()}...`;
}

// Show an alert in a container element
function showAlert(element, message, type = "success") {
    if (!element) return;
    element.className = `alert show ${type}`;
    element.innerHTML = message;
}

// Hide an alert
function hideAlert(element) {
    if (!element) return;
    element.className = "alert";
    element.innerHTML = "";
}

// Show a toast notification
function showToast(message, type = "success") {
    let container = document.querySelector(".toast-container");
    if (!container) {
        container = document.createElement("div");
        container.className = "toast-container";
        document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    window.setTimeout(() => {
        toast.remove();
    }, 4200);
}

// Show an empty state message
function emptyState(message) {
    return `<div class="empty-state">${escapeHTML(message)}</div>`;
}

// Show a loading state message
function loadingState(message = "Chargement en cours...") {
    return `<div class="loading-state">${escapeHTML(message)}</div>`;
}

// Open a modal
function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add("show");
    document.body.classList.add("no-scroll");
}

// Close a modal
function closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.remove("show");
    document.body.classList.remove("no-scroll");
}

// Show custom confirmation modal replacing native confirm()
function showConfirmModal(options = {}) {
    const {
        title = "Confirmation",
        message = "Voulez-vous vraiment effectuer cette action ?",
        confirmText = "Confirmer",
        cancelText = "Annuler",
        isDanger = false
    } = typeof options === "string" ? { message: options } : options;

    return new Promise((resolve) => {
        let modal = document.getElementById("global-confirm-modal");
        if (!modal) {
            modal = document.createElement("div");
            modal.id = "global-confirm-modal";
            modal.className = "modal-backdrop";
            modal.setAttribute("role", "dialog");
            modal.setAttribute("aria-modal", "true");
            document.body.appendChild(modal);
        }

        modal.innerHTML = `
            <div class="modal" style="max-width: 440px; border-radius: 8px;">
                <div class="modal-header" style="border-bottom: 1px solid var(--line-light, #eee); padding: 16px 20px;">
                    <h3 style="margin: 0; font-size: 1.05rem; font-weight: 600; color: var(--charcoal, #111);">${escapeHTML(title)}</h3>
                    <button type="button" class="modal-close" id="global-confirm-close-btn" aria-label="Fermer">×</button>
                </div>
                <div class="modal-body" style="padding: 20px;">
                    <p style="margin: 0; font-size: 0.9rem; color: var(--text, #444); line-height: 1.5; white-space: pre-line;">${escapeHTML(message)}</p>
                    <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;">
                        <button type="button" class="btn outline small" id="global-confirm-cancel-btn">${escapeHTML(cancelText)}</button>
                        <button type="button" class="btn ${isDanger ? "danger" : "primary"} small" id="global-confirm-ok-btn">${escapeHTML(confirmText)}</button>
                    </div>
                </div>
            </div>
        `;

        function cleanup(result) {
            modal.classList.remove("show");
            document.body.classList.remove("no-scroll");
            resolve(result);
        }

        const cancelBtn = modal.querySelector("#global-confirm-cancel-btn");
        const okBtn = modal.querySelector("#global-confirm-ok-btn");
        const closeBtn = modal.querySelector("#global-confirm-close-btn");

        cancelBtn.addEventListener("click", () => cleanup(false));
        closeBtn.addEventListener("click", () => cleanup(false));
        okBtn.addEventListener("click", () => cleanup(true));

        modal.addEventListener("click", (e) => {
            if (e.target === modal) cleanup(false);
        }, { once: true });

        modal.classList.add("show");
        document.body.classList.add("no-scroll");
    });
}

// Close modals from buttons or backdrop clicks
document.addEventListener("click", (event) => {
    const closeButton = event.target.closest("[data-close-modal]");
    if (closeButton) {
        closeModal(closeButton.dataset.closeModal);
    }

    if (event.target.classList.contains("modal-backdrop") && event.target.id !== "global-confirm-modal") {
        event.target.classList.remove("show");
        document.body.classList.remove("no-scroll");
    }
});
