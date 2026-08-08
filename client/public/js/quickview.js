// ============================================================
// QUICKVIEW.JS — Quick-view Product Modal
// Accessible: Escape, focus trap, overlay click.
// Supports guest cart & wishlist via localStorage.
// Velora Jewelry Boutique — 2026
// ============================================================

(function () {
  "use strict";

  // ── SVG helpers ──

  const SVG_HEART_EMPTY = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`;
  const SVG_HEART_FULL  = `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`;
  const SVG_CLOSE       = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

  // ── Create backdrop & modal if not already present ──

  function ensureModal() {
    let backdrop = document.getElementById("qv-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "qv-backdrop";
      backdrop.className = "qv-backdrop";
      backdrop.setAttribute("role", "dialog");
      backdrop.setAttribute("aria-modal", "true");
      backdrop.setAttribute("aria-label", "Vue rapide du bijou");
      backdrop.setAttribute("aria-hidden", "true");
      backdrop.innerHTML = `<div class="qv-modal" id="qv-modal" tabindex="-1">
        <button class="qv-close" id="qv-close" aria-label="Fermer la vue rapide">${SVG_CLOSE}</button>
        <div class="qv-loading" id="qv-body">Chargement du bijou\u2026</div>
      </div>`;
      document.body.appendChild(backdrop);
    }
    return backdrop;
  }

  // ── Open quick-view ──

  let currentQvProductId = null;

  window.openQuickView = async function (productId) {
    currentQvProductId = productId;
    const backdrop = ensureModal();
    const body     = document.getElementById("qv-body");

    // Show loading state
    body.className = "qv-loading";
    body.innerHTML = `Chargement du bijou\u2026`;

    // Add close button back (was removed in previous render)
    let closeBtn = document.getElementById("qv-close");
    if (!closeBtn) {
      const modal = document.getElementById("qv-modal");
      closeBtn = document.createElement("button");
      closeBtn.id = "qv-close";
      closeBtn.className = "qv-close";
      closeBtn.setAttribute("aria-label", "Fermer la vue rapide");
      closeBtn.innerHTML = SVG_CLOSE;
      modal.prepend(closeBtn);
    }

    // Open modal
    backdrop.classList.add("show");
    backdrop.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");

    // Bind close events
    closeBtn.onclick = closeQuickView;
    backdrop.addEventListener("click", onBackdropClick);
    document.addEventListener("keydown", onKeyDown);

    // Focus modal
    const modal = document.getElementById("qv-modal");
    setTimeout(() => modal?.focus(), 50);

    // Load product data
    try {
      const { product } = await apiRequest(`/api/products/${productId}`);
      renderQuickView(product, body);
    } catch (err) {
      body.innerHTML = `<div style="padding:40px;color:var(--danger);text-align:center;font-size:0.9rem;">Impossible de charger ce bijou. Veuillez r\u00e9essayer.</div>`;
    }
  };

  // ── Render product content ──

  function renderQuickView(product, body) {
    const img       = escapeHTML(product.image || "/images/defaults/product.svg");
    const name      = escapeHTML(product.name);
    const category  = escapeHTML(product.category_name || "");
    const price     = formatPrice(product.price);
    const material  = product.material ? escapeHTML(product.material) : null;
    const stockHtml = product.stock > 0 ? "" : `<p style="font-size:0.82rem;color:var(--danger);font-weight:400;">Rupture de stock</p>`;

    body.className  = "";
    body.innerHTML  = `
      <div class="qv-image-side">
        <img src="${img}" alt="${name}" onerror="this.src='/images/defaults/product.svg'">
      </div>
      <div class="qv-info-side">
        <p class="qv-category">${category}</p>
        <h2 class="qv-name">${name}</h2>
        <p class="qv-price">${price}</p>
        ${material ? `<p class="qv-material">Mat\u00e8re : ${material}</p>` : ""}
        <div class="qv-divider"></div>
        ${stockHtml}
        <div class="qv-add-row" id="qv-add-row">
          <div class="qty-stepper">
            <button type="button" class="qty-btn" id="qv-qty-minus" aria-label="Diminuer la quantit\u00e9">−</button>
            <input class="qty-value" type="number" id="qv-quantity" value="1" min="1" max="${product.stock || 1}" readonly aria-label="Quantit\u00e9">
            <button type="button" class="qty-btn" id="qv-qty-plus" aria-label="Augmenter la quantit\u00e9">+</button>
          </div>
          <button
            type="button"
            class="btn primary"
            id="qv-add-cart"
            ${product.stock === 0 ? "disabled" : ""}
          >${product.stock === 0 ? "Rupture de stock" : "Ajouter au panier"}</button>
        </div>
        <button type="button" class="qv-wishlist-btn" id="qv-wishlist" aria-label="Ajouter aux favoris">
          ${SVG_HEART_EMPTY}<span>Ajouter aux favoris</span>
        </button>
        <a class="qv-link" href="/product.html?id=${product.id}">Voir la fiche compl\u00e8te &rarr;</a>
      </div>
    `;

    // Bind quantity stepper
    const qtyInput = document.getElementById("qv-quantity");
    document.getElementById("qv-qty-minus")?.addEventListener("click", () => {
      const v = parseInt(qtyInput.value, 10);
      if (v > 1) qtyInput.value = v - 1;
    });
    document.getElementById("qv-qty-plus")?.addEventListener("click", () => {
      const v = parseInt(qtyInput.value, 10);
      if (v < product.stock) {
        qtyInput.value = v + 1;
      } else {
        if (typeof showToast === "function") showToast("Stock maximum atteint.", "error");
      }
    });

    // Bind add to cart
    document.getElementById("qv-add-cart")?.addEventListener("click", async () => {
      const qty = parseInt(qtyInput.value, 10);
      const btn = document.getElementById("qv-add-cart");
      const orig = btn.textContent;
      btn.textContent = "Ajout en cours\u2026";
      btn.disabled = true;

      if (!window.currentUser) {
        let guestCart = JSON.parse(localStorage.getItem("velora_cart")) || [];
        const existing = guestCart.find(i => String(i.productId) === String(product.id));
        if (existing) {
          existing.quantity += qty;
        } else {
          guestCart.push({ productId: product.id, quantity: qty });
        }
        localStorage.setItem("velora_cart", JSON.stringify(guestCart));
        setTimeout(() => {
          if (typeof showToast === "function") showToast("Bijou ajout\u00e9 au panier.");
          if (typeof updateCartBadge === "function") updateCartBadge();
          btn.textContent = orig;
          btn.disabled = false;
        }, 300);
        return;
      }

      try {
        await apiRequest("/api/cart", {
          method: "POST",
          body: JSON.stringify({ productId: product.id, quantity: qty })
        });
        if (typeof showToast === "function") showToast("Bijou ajout\u00e9 au panier.");
        if (typeof updateCartBadge === "function") updateCartBadge();
      } catch (err) {
        if (typeof showToast === "function") showToast(err.message, "error");
      } finally {
        btn.textContent = orig;
        btn.disabled = false;
      }
    });

    // Bind wishlist
    document.getElementById("qv-wishlist")?.addEventListener("click", async () => {
      const btn = document.getElementById("qv-wishlist");

      if (!window.currentUser) {
        let guestWishlist = JSON.parse(localStorage.getItem("velora_wishlist")) || [];
        if (!guestWishlist.includes(String(product.id))) {
          guestWishlist.push(String(product.id));
          localStorage.setItem("velora_wishlist", JSON.stringify(guestWishlist));
        }
        btn.innerHTML = `${SVG_HEART_FULL}<span>Ajout\u00e9 aux favoris</span>`;
        btn.classList.add("active");
        if (typeof showToast === "function") showToast("Ajout\u00e9 \u00e0 vos favoris.");
        return;
      }

      btn.disabled = true;
      try {
        await apiRequest("/api/wishlist", {
          method: "POST",
          body: JSON.stringify({ productId: product.id })
        });
        btn.innerHTML = `${SVG_HEART_FULL}<span>Ajout\u00e9 aux favoris</span>`;
        btn.classList.add("active");
        if (typeof showToast === "function") showToast("Ajout\u00e9 \u00e0 vos favoris.");
      } catch (err) {
        if (typeof showToast === "function") showToast(err.message, "error");
      } finally {
        btn.disabled = false;
      }
    });

    // Focus first focusable element in modal
    setTimeout(() => {
      document.getElementById("qv-add-cart")?.focus();
    }, 50);
  }

  // ── Close quick-view ──

  function closeQuickView() {
    const backdrop = document.getElementById("qv-backdrop");
    if (!backdrop) return;
    backdrop.classList.remove("show");
    backdrop.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    backdrop.removeEventListener("click", onBackdropClick);
    document.removeEventListener("keydown", onKeyDown);
    currentQvProductId = null;
  }

  function onBackdropClick(e) {
    if (e.target === document.getElementById("qv-backdrop")) {
      closeQuickView();
    }
  }

  function onKeyDown(e) {
    if (e.key === "Escape") closeQuickView();

    // Focus trap within modal
    if (e.key === "Tab") {
      const modal = document.getElementById("qv-modal");
      if (!modal) return;
      const focusable = Array.from(modal.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ));
      if (!focusable.length) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    }
  }

})();
