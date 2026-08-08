// ============================================================
// ACCOUNT.JS — Customer account page controller
// Handles sidebar tab switching, user name display, cart tab.
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

    // Lazy-load tab data on open
    if (tabName === "wishlist" && !wishlistLoaded) {
        wishlistLoaded = true;
        if (typeof loadWishlist === "function") loadWishlist();
    }

    if (tabName === "cart") {
        loadAccountCart();
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
    if (!window.currentUser) return;

    const { firstName, lastName } = window.currentUser;
    const fullName = [firstName, lastName].filter(Boolean).join(" ") || "Client Velora";

    const nameEl = document.getElementById("account-name") || document.getElementById("sidebar-user-name");
    if (nameEl) nameEl.textContent = fullName;

    const avatarEl = document.getElementById("account-avatar-letter");
    if (avatarEl && firstName) {
        avatarEl.textContent = firstName.charAt(0).toUpperCase();
    }
}

async function loadAccountCart() {
    const container   = document.getElementById("account-cart-body");
    const checkoutBtn = document.getElementById("account-checkout-btn");
    const cartBadge   = document.getElementById("account-cart-count");
    if (!container) return;

    try {
        const cart = await apiRequest("/api/cart");

        if (cartBadge) {
            const count = cart.items ? cart.items.length : 0;
            if (count > 0) {
                cartBadge.textContent = count;
                cartBadge.style.display = "";
            } else {
                cartBadge.style.display = "none";
            }
        }

        if (!cart.items || cart.items.length === 0) {
            if (checkoutBtn) checkoutBtn.style.display = "none";
            container.innerHTML = `
                <div class="empty-state" style="padding: 64px 20px; text-align: center;">
                    <p style="font-family: var(--font-display); font-size: 1.25rem; font-style: normal; color: var(--ink); margin-bottom: 8px;">Votre panier est vide</p>
                    <p style="font-size: 0.88rem; color: var(--muted); margin-bottom: 24px; font-family: var(--font-body); font-style: normal;">Découvrez nos créations exclusives et ajoutez vos coups de cœur au panier.</p>
                    <a class="btn primary small" href="/shop.html">
                        Explorer la boutique →
                    </a>
                </div>`;
            updateCartBadge();
            return;
        }

        if (checkoutBtn) checkoutBtn.style.display = "none"; // Summary side button handles checkout

        const settings = window.veloraSettings || {};
        const threshold = Number(settings.free_threshold) || 5000;
        let shippingHtml = "";
        if (cart.total >= threshold) {
            shippingHtml = `<span style="color:var(--success);font-weight:500;">✓ Félicitations ! Vous bénéficiez de la livraison offerte.</span>`;
        } else {
            const diff = threshold - cart.total;
            shippingHtml = `Ajoutez encore <strong>${typeof formatPrice === 'function' ? formatPrice(diff) : diff + ' DA'}</strong> pour bénéficier de la <strong>livraison gratuite</strong> !`;
        }

        const itemsHtml = cart.items.map(item => `
            <div class="cart-item animate-fade-up">
                <a class="cart-item-image-link" href="/product.html?id=${item.product_id}" aria-label="${escapeHTML(item.product_name)}">
                    <img
                        src="${escapeHTML(item.product_image || '/images/defaults/product.svg')}"
                        alt="${escapeHTML(item.product_name)}"
                        onerror="this.src='/images/defaults/product.svg'"
                    >
                </a>

                <div class="cart-item-details">
                    <p class="cart-item-category">${escapeHTML(item.category_name || "")}</p>
                    <h3 class="cart-item-name">
                        <a href="/product.html?id=${item.product_id}">${escapeHTML(item.product_name)}</a>
                    </h3>
                    <p class="cart-item-price">${typeof formatPrice === 'function' ? formatPrice(item.price) : item.price + ' DA'}</p>

                    <div class="cart-item-controls">
                        <div class="qty-stepper">
                            <button type="button" class="qty-btn btn-account-qty-minus" data-id="${item.id}" data-qty="${item.quantity}" aria-label="Diminuer la quantité">−</button>
                            <span class="qty-value">${item.quantity}</span>
                            <button type="button" class="qty-btn btn-account-qty-plus" data-id="${item.id}" data-qty="${item.quantity}" data-stock="${item.stock || 99}" aria-label="Augmenter la quantité">+</button>
                        </div>
                        <button type="button" class="cart-item-remove btn-account-remove" data-id="${item.id}" aria-label="Retirer ${escapeHTML(item.product_name)} du panier">
                            Retirer
                        </button>
                    </div>
                </div>
            </div>
        `).join("");

        container.innerHTML = `
            <div class="cart-layout account-cart-layout">
                <div class="cart-items-list">
                    ${itemsHtml}
                </div>

                <aside class="cart-summary" aria-label="Résumé de la commande">
                    <h2 class="cart-summary-title">Résumé</h2>

                    <div style="margin-bottom: 16px; font-size: 0.85rem; line-height: 1.5;">
                        ${shippingHtml}
                    </div>

                    <div class="cart-summary-line">
                        <span>Sous-total</span>
                        <span>${typeof formatPrice === 'function' ? formatPrice(cart.total) : cart.total + ' DA'}</span>
                    </div>
                    <div class="cart-summary-line">
                        <span>Livraison</span>
                        <span>Gratuite</span>
                    </div>
                    <div class="cart-summary-line total">
                        <span>Total</span>
                        <span>${typeof formatPrice === 'function' ? formatPrice(cart.total) : cart.total + ' DA'}</span>
                    </div>

                    <a class="btn primary full-width" href="/checkout.html" style="margin-top: 24px;">
                        Passer la commande
                    </a>

                    <p class="cart-note">Paiement à la livraison · Emballage cadeau inclus</p>

                    <a class="link-underline" href="/shop.html" style="display: block; text-align: center; margin-top: 20px; font-size: 0.78rem;">
                        ← Continuer mes achats
                    </a>
                </aside>
            </div>
        `;

        bindAccountCartEvents();
        if (typeof updateCartBadge === "function") updateCartBadge();

    } catch (error) {
        container.innerHTML = `<div class="empty-state">Erreur de chargement du panier.</div>`;
    }
}

function bindAccountCartEvents() {
    document.querySelectorAll(".btn-account-qty-minus").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            const id  = e.currentTarget.dataset.id;
            const qty = parseInt(e.currentTarget.dataset.qty, 10);
            if (qty > 1) await updateAccountCartItem(id, qty - 1);
        });
    });

    document.querySelectorAll(".btn-account-qty-plus").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            const id    = e.currentTarget.dataset.id;
            const qty   = parseInt(e.currentTarget.dataset.qty, 10);
            const stock = parseInt(e.currentTarget.dataset.stock, 10);

            if (qty < stock) {
                await updateAccountCartItem(id, qty + 1);
            } else {
                if (typeof showToast === "function") showToast("Stock maximum atteint pour ce bijou.", "error");
            }
        });
    });

    document.querySelectorAll(".btn-account-remove").forEach((btn) => {
        btn.addEventListener("click", async (e) => {
            const id = e.currentTarget.dataset.id;
            let confirmed = true;
            if (typeof showConfirmModal === "function") {
                confirmed = await showConfirmModal({
                    title: "Retirer du panier",
                    message: "Voulez-vous vraiment retirer ce bijou de votre panier ?",
                    confirmText: "Retirer",
                    cancelText: "Conserver",
                    isDanger: true
                });
            }
            if (confirmed) {
                await removeAccountCartItem(id);
            }
        });
    });
}

async function updateAccountCartItem(cartItemId, newQty) {
    if (newQty <= 0) {
        return removeAccountCartItem(cartItemId);
    }
    try {
        await apiRequest(`/api/cart/${cartItemId}`, {
            method: "PUT",
            body: JSON.stringify({ quantity: newQty })
        });
        loadAccountCart();
        if (typeof updateCartBadge === "function") updateCartBadge();
    } catch (e) {
        if (typeof showToast === "function") showToast(e.message, "error");
    }
}

async function removeAccountCartItem(cartItemId) {
    try {
        await apiRequest(`/api/cart/${cartItemId}`, { method: "DELETE" });
        if (typeof showToast === "function") showToast("Bijou retiré du panier.");
        loadAccountCart();
        if (typeof updateCartBadge === "function") updateCartBadge();
    } catch (e) {
        if (typeof showToast === "function") showToast(e.message, "error");
    }
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
    loadAccountCart();

    // Check for hash — restore tab from URL
    const hash = window.location.hash.replace("#", "");
    const validTabs = ["orders", "wishlist", "cart", "info"];
    const initialTab = validTabs.includes(hash) ? hash : "orders";
    switchAccountTab(initialTab);
});
