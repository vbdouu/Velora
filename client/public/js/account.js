// ============================================================
// ACCOUNT.JS — Customer account page controller
// Handles sidebar tab switching, user name display.
// Velora Jewelry Boutique — 2026
// ============================================================

let wishlistLoaded = false;
let profileLoaded  = false;

function switchAccountTab(tabName) {
    document.querySelectorAll(".account-tab").forEach(tab => {
        tab.style.display = "none";
    });
    document.querySelectorAll("[data-account-tab]").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.accountTab === tabName);
    });

    const tab = document.getElementById(`account-tab-${tabName}`);
    if (tab) tab.style.display = "block";

    // Lazy-load tab data on first open
    if (tabName === "wishlist" && !wishlistLoaded) {
        wishlistLoaded = true;
        if (typeof loadWishlist === "function") loadWishlist();
    }

    if (tabName === "info" && !profileLoaded) {
        profileLoaded = true;
        if (typeof loadProfile === "function") loadProfile();
        if (typeof setupProfileForms === "function") setupProfileForms();
    }

    // Update URL hash so the tab is bookmarkable
    window.history.replaceState({}, "", `#${tabName}`);
}

function setupAccountNav() {
    document.querySelectorAll("[data-account-tab]").forEach(btn => {
        btn.addEventListener("click", () => {
            switchAccountTab(btn.dataset.accountTab);
        });
    });
}

function fillSidebarUser() {
    const nameEl = document.getElementById("sidebar-user-name");
    if (!nameEl || !window.currentUser) return;

    const { firstName, lastName } = window.currentUser;
    nameEl.textContent = [firstName, lastName].filter(Boolean).join(" ") || "Mon compte";
}

document.addEventListener("DOMContentLoaded", async () => {
    await waitForSession();

    if (!window.currentUser) {
        window.location.href = "/login.html?redirect=/account.html";
        return;
    }

    if (window.currentUser.role === "admin") {
        window.location.href = "/admin-dashboard.html";
        return;
    }

    fillSidebarUser();
    setupAccountNav();

    // Check for hash — restore tab from URL
    const hash = window.location.hash.replace("#", "");
    const validTabs = ["orders", "wishlist", "info"];
    const initialTab = validTabs.includes(hash) ? hash : "orders";
    switchAccountTab(initialTab);
});
