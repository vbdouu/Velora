// ============================================================
// CART.JS — Cart Page Logic
// Velora Premium Jewelry — 2026
// ============================================================

async function loadCart() {
  const container   = document.getElementById("cart-items");
  const subtotalEl  = document.getElementById("cart-subtotal");
  const totalEl     = document.getElementById("cart-total");
  const checkoutBtn = document.getElementById("btn-checkout");
  const msgEl       = document.getElementById("cart-messages");

  if (!container) return;

  try {
    let cart = { items: [], total: 0 };
    if (window.currentUser) {
      cart = await apiRequest("/api/cart");
    } else {
      const guestCart = JSON.parse(localStorage.getItem("velora_cart")) || [];
      if (guestCart.length > 0) {
        const { products } = await apiRequest("/api/products");
        let total = 0;
        cart.items = guestCart.map(gc => {
          const p = products.find(prod => String(prod.id) === String(gc.productId));
          if (!p) return null;
          total += p.price * gc.quantity;
          return {
            id: p.id,
            product_id: p.id,
            product_name: p.name,
            product_image: p.image,
            category_name: p.category_name,
            price: p.price,
            quantity: gc.quantity,
            stock: p.stock
          };
        }).filter(Boolean);
        cart.total = total;
      }
    }

    if (!cart.items || cart.items.length === 0) {
      container.innerHTML = `<div class="empty-state">Votre panier est vide.<br><a class="link-underline" href="/shop.html" style="margin-top: 12px; display: inline-block;">Explorer la boutique →</a></div>`;

      // Hide summary side
      const cartLayout = document.getElementById("cart-content");
      if (cartLayout) cartLayout.style.gridTemplateColumns = "1fr";
      document.querySelector(".cart-summary")?.style.setProperty("display", "none");

      updateCartBadge();
      return;
    }

    // Render items using CSS-driven cart-item classes
    container.innerHTML = cart.items.map((item) => `
      <div class="cart-item animate-fade-up">

        <a class="cart-item-image-link" href="/product.html?id=${item.product_id}" aria-label="${escapeHTML(item.product_name)}">
          <img
            src="${escapeHTML(item.product_image || "/images/defaults/product.svg")}"
            alt="${escapeHTML(item.product_name)}"
            onerror="this.src='/images/defaults/product.svg'"
          >
        </a>

        <div class="cart-item-details">
          <p class="cart-item-category">${escapeHTML(item.category_name || "")}</p>
          <h3 class="cart-item-name">
            <a href="/product.html?id=${item.product_id}">${escapeHTML(item.product_name)}</a>
          </h3>
          <p class="cart-item-price">${formatPrice(item.price)}</p>

          <div class="cart-item-controls">
            <div class="qty-stepper">
              <button type="button" class="qty-btn btn-qty-minus" data-id="${item.id}" data-qty="${item.quantity}" aria-label="Diminuer la quantité">−</button>
              <span class="qty-value">${item.quantity}</span>
              <button type="button" class="qty-btn btn-qty-plus" data-id="${item.id}" data-qty="${item.quantity}" data-stock="${item.stock}" aria-label="Augmenter la quantité">+</button>
            </div>
            <button type="button" class="cart-item-remove btn-remove" data-id="${item.id}" aria-label="Retirer ${escapeHTML(item.product_name)} du panier">
              Retirer
            </button>
          </div>
        </div>

      </div>
    `).join("");

    // Totals
    if (subtotalEl) subtotalEl.textContent = formatPrice(cart.total);
    if (totalEl)    totalEl.textContent    = formatPrice(cart.total);

    // Free shipping threshold indicator
    const freeShippingEl = document.getElementById("cart-free-shipping-info");
    const settings = window.veloraSettings || {};
    const threshold = Number(settings.free_threshold) || 5000;

    if (freeShippingEl) {
      if (cart.total >= threshold) {
        freeShippingEl.innerHTML = `<span style="color:var(--success);font-weight:500;">✓ Félicitations ! Vous bénéficiez de la livraison offerte.</span>`;
      } else {
        const diff = threshold - cart.total;
        freeShippingEl.innerHTML = `Ajoutez encore <strong>${formatPrice(diff)}</strong> pour bénéficier de la <strong>livraison gratuite</strong> !`;
      }
    }

    // Enable checkout
    if (checkoutBtn) {
      checkoutBtn.style.pointerEvents = "auto";
      checkoutBtn.style.opacity = "1";
    }

    bindCartEvents();
    updateCartBadge();

  } catch (error) {
    container.innerHTML = "";
    showAlert(msgEl, escapeHTML(error.message), "error");
  }
}


function bindCartEvents() {
  document.querySelectorAll(".btn-qty-minus").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id  = e.currentTarget.dataset.id;
      const qty = parseInt(e.currentTarget.dataset.qty, 10);
      if (qty > 1) await updateQuantity(id, qty - 1);
    });
  });

  document.querySelectorAll(".btn-qty-plus").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id    = e.currentTarget.dataset.id;
      const qty   = parseInt(e.currentTarget.dataset.qty, 10);
      const stock = parseInt(e.currentTarget.dataset.stock, 10);

      if (qty < stock) {
        await updateQuantity(id, qty + 1);
      } else {
        showToast("Stock maximum atteint pour ce bijou.", "error");
      }
    });
  });

  document.querySelectorAll(".btn-remove").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.currentTarget.dataset.id;
      const confirmed = await showConfirmModal({
        title: "Retirer du panier",
        message: "Voulez-vous vraiment retirer ce bijou de votre panier ?",
        confirmText: "Retirer",
        cancelText: "Conserver",
        isDanger: true
      });
      if (confirmed) {
        await removeItem(id);
      }
    });
  });
}


async function updateQuantity(cartItemId, quantity) {
  try {
    if (window.currentUser) {
      await apiRequest(`/api/cart/${cartItemId}`, {
        method: "PUT",
        body: JSON.stringify({ quantity })
      });
    } else {
      let guestCart = JSON.parse(localStorage.getItem("velora_cart")) || [];
      const item = guestCart.find(gc => String(gc.productId) === String(cartItemId));
      if (item) item.quantity = quantity;
      localStorage.setItem("velora_cart", JSON.stringify(guestCart));
    }
    loadCart();
  } catch (error) {
    showToast(error.message, "error");
  }
}


async function removeItem(cartItemId) {
  try {
    if (window.currentUser) {
      await apiRequest(`/api/cart/${cartItemId}`, { method: "DELETE" });
    } else {
      let guestCart = JSON.parse(localStorage.getItem("velora_cart")) || [];
      guestCart = guestCart.filter(gc => String(gc.productId) !== String(cartItemId));
      localStorage.setItem("velora_cart", JSON.stringify(guestCart));
    }
    showToast("Bijou retiré du panier.");
    loadCart();
    if (typeof updateCartBadge === "function") updateCartBadge();
  } catch (error) {
    showToast(error.message, "error");
  }
}


document.addEventListener("DOMContentLoaded", async () => {
  await waitForSession();

  // Guest support added
  // if (!window.currentUser) { ... }

  loadCart();
});
