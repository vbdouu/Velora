// ============================================================
// ORDERS.JS — Customer orders page
// Handles: order list, expandable items (with product snapshots),
// order cancellation (pending only), success redirect.
// Velora Jewelry Boutique — 2026
// ============================================================

const expandedOrders = new Set();

async function loadOrders() {
    const container    = document.getElementById("orders-list");
    const msgContainer = document.getElementById("orders-messages");
    if (!container) return;

    container.innerHTML = `<div class="loading-state">Chargement de vos commandes...</div>`;

    // Show success message from checkout redirect
    if (getParam("success") === "true") {
        showAlert(msgContainer, "Votre commande a été confirmée avec succès ! Nous vous contacterons bientôt.", "success");
        const url = new URL(window.location);
        url.searchParams.delete("success");
        url.searchParams.delete("id");
        window.history.replaceState({}, "", url);
    }

    try {
        const { orders } = await apiRequest("/api/orders");

        if (!orders || orders.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="text-align:center;padding:48px 0;">
                    <p style="font-family:var(--font-display);font-size:1.4rem;font-weight:300;color:var(--ink);margin-bottom:12px;">Aucune commande</p>
                    <p style="color:var(--muted);font-size:0.9rem;margin-bottom:24px;">Vous n'avez pas encore passé de commande chez Velora.</p>
                    <a href="/shop.html" class="btn primary">Découvrir la boutique</a>
                </div>
            `;
            return;
        }

        container.innerHTML = orders.map(order => buildOrderCard(order)).join("");
        attachExpandListeners();

    } catch (error) {
        container.innerHTML = "";
        showAlert(msgContainer, error.message, "error");
    }
}

function buildOrderCard(order) {
    const date = new Date(order.created_at).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    const canCancel = order.status === "pending";

    return `
        <div class="order-card" id="order-card-${order.id}">
            <div class="order-card-header">
                <div>
                    <div class="order-number">Commande #${order.id}</div>
                    <div class="order-date">${date}</div>
                </div>
                <div style="text-align:right;display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
                    ${statusBadge(order.status)}
                    <div class="order-total-amount">${formatPrice(order.total)}</div>
                </div>
            </div>

            <div class="order-card-address" style="font-size:0.82rem;color:var(--muted);padding:10px 0;border-top:1px solid var(--line-light);">
                <span style="color:var(--charcoal);font-weight:500;">Livraison :</span>
                ${escapeHTML(order.shipping_address || "—")}
                ${order.shipping_city ? ` · ${escapeHTML(order.shipping_city)}` : ""}
                ${order.shipping_fee > 0 ? ` <span style="color:var(--muted);">(Frais : ${formatPrice(order.shipping_fee)})</span>` : ""}
            </div>

            <div class="order-total-line" style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
                <button class="order-toggle-btn" data-order-id="${order.id}" type="button" aria-expanded="false">
                    Voir les articles
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" class="toggle-chevron">
                        <polyline points="6 9 12 15 18 9"/>
                    </svg>
                </button>
                ${canCancel ? `
                    <button
                        class="btn danger small"
                        type="button"
                        data-cancel-order="${order.id}"
                        style="font-size:0.72rem;padding:6px 14px;">
                        Annuler la commande
                    </button>
                ` : ""}
            </div>

            <div class="order-items-expand" id="order-items-${order.id}" style="display:none;margin-top:16px;padding-top:16px;border-top:1px solid var(--line-light);">
                <div class="loading-state" style="padding:16px 0;">Chargement...</div>
            </div>
        </div>
    `;
}

function attachExpandListeners() {
    document.querySelectorAll(".order-toggle-btn[data-order-id]").forEach(btn => {
        btn.addEventListener("click", async () => {
            const orderId = btn.dataset.orderId;
            const expandEl = document.getElementById(`order-items-${orderId}`);
            const chevron  = btn.querySelector(".toggle-chevron");

            const isOpen = expandEl.style.display !== "none";

            if (isOpen) {
                expandEl.style.display = "none";
                chevron.style.transform = "";
                btn.innerHTML = `Voir les articles <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" class="toggle-chevron"><polyline points="6 9 12 15 18 9"/></svg>`;
                btn.setAttribute("aria-expanded", "false");
                return;
            }

            // Open
            expandEl.style.display = "block";
            btn.innerHTML = `Masquer les articles <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" class="toggle-chevron" style="transform:rotate(180deg)"><polyline points="6 9 12 15 18 9"/></svg>`;
            btn.setAttribute("aria-expanded", "true");

            if (!expandedOrders.has(orderId)) {
                expandedOrders.add(orderId);
                await loadOrderItems(orderId, expandEl);
            }
        });
    });

    // Cancel order listeners
    document.querySelectorAll("[data-cancel-order]").forEach(btn => {
        btn.addEventListener("click", async () => {
            const orderId = btn.dataset.cancelOrder;
            await cancelOrder(orderId, btn);
        });
    });
}

async function loadOrderItems(orderId, container) {
    try {
        const { items } = await apiRequest(`/api/orders/${orderId}`);

        if (!items || items.length === 0) {
            container.innerHTML = `<div class="empty-state" style="padding:12px 0;">Aucun article trouvé pour cette commande.</div>`;
            return;
        }

        container.innerHTML = `
            <div style="display:flex;flex-direction:column;gap:16px;">
                ${items.map(item => `
                    <div style="display:flex;gap:16px;align-items:center;">
                        <div style="width:60px;height:76px;background:var(--cream);flex-shrink:0;overflow:hidden;">
                            <img src="${escapeHTML(item.image || "/images/defaults/product.svg")}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='/images/defaults/product.svg'" alt="${escapeHTML(item.product_name)}">
                        </div>
                        <div style="flex:1;min-width:0;">
                            <div style="font-size:0.875rem;color:var(--charcoal);font-weight:400;line-height:1.3;">${escapeHTML(item.product_name)}</div>
                            <div style="font-size:0.78rem;color:var(--muted);margin-top:4px;">Qté : ${item.quantity} × ${formatPrice(item.unit_price)}</div>
                        </div>
                        <div style="font-size:0.875rem;font-weight:500;white-space:nowrap;">${formatPrice(item.unit_price * item.quantity)}</div>
                    </div>
                `).join("")}
            </div>
        `;

    } catch (error) {
        container.innerHTML = `<div class="empty-state">Impossible de charger les articles. ${escapeHTML(error.message)}</div>`;
    }
}

async function cancelOrder(orderId, btn) {
    const confirmed = await showConfirmModal({
        title: "Annuler la commande",
        message: "Voulez-vous vraiment annuler cette commande ?\nCette action est définitive. Les bijoux seront remis en stock.",
        confirmText: "Oui, annuler",
        cancelText: "Conserver la commande",
        isDanger: true
    });
    if (!confirmed) return;

    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Annulation...";

    try {
        await apiRequest(`/api/orders/${orderId}/cancel`, { method: "PUT" });

        showToast("Commande annulée avec succès.");

        // Reload order list to reflect the new status
        expandedOrders.clear();
        await loadOrders();

    } catch (error) {
        showToast(error.message, "error");
        btn.disabled = false;
        btn.textContent = originalText;
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    await waitForSession();

    if (!window.currentUser) {
        window.location.href = "/login.html?redirect=/account.html";
        return;
    }

    if (window.currentUser.role === "admin" || window.currentUser.role === "super_admin") {
        window.location.href = "/admin-dashboard.html";
        return;
    }

    loadOrders();
});
