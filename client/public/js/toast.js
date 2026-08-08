// ============================================================
// TOAST.JS — Toast Notification System for Velora
// Displays elegant, non-intrusive notifications (success, error, info)
// ============================================================

(function() {
  // Create toast container if not present
  function getContainer() {
    let container = document.getElementById("velora-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "velora-toast-container";
      container.className = "toast-container";
      document.body.appendChild(container);
    }
    return container;
  }

  window.showToast = function(message, type = "success", duration = 3500) {
    const container = getContainer();

    const toast = document.createElement("div");
    toast.className = `toast toast-${type} toast-enter`;

    const iconMap = {
      success: "✓",
      error: "✕",
      info: "ℹ",
      warning: "⚠"
    };

    toast.innerHTML = `
      <span class="toast-icon">${iconMap[type] || "✓"}</span>
      <span class="toast-message">${escapeHtml(message)}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.remove("toast-enter");
    });

    // Auto dismiss
    setTimeout(() => {
      toast.classList.add("toast-leave");
      toast.addEventListener("transitionend", () => {
        toast.remove();
      });
    }, duration);
  };

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }
})();
