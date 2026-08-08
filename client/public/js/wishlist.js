// ============================================================
// WISHLIST.JS — Wishlist Page Logic
// Velora Premium Jewelry — 2026
// ============================================================

async function loadWishlist() {
  const container = document.getElementById("wishlist-grid");
  const msgEl     = document.getElementById("wishlist-messages");
  if (!container) return;

  try {
    let items = [];
    if (window.currentUser) {
      const data = await apiRequest("/api/wishlist");
      items = data.items;
    } else {
      const guestIds = JSON.parse(localStorage.getItem("velora_wishlist")) || [];
      if (guestIds.length > 0) {
        const { products } = await apiRequest("/api/products");
        items = products.filter(p => guestIds.includes(String(p.id))).map(p => ({
          product_id: p.id,
          product_name: p.name,
          product_image: p.image,
          category_name: p.category_name,
          price: p.price
        }));
      }
    }

    if (!items || items.length === 0) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1;">
          Votre liste de favoris est vide.<br>
          <a class="link-underline" href="/shop.html" style="margin-top: 12px; display: inline-block;">
            Explorer la boutique →
          </a>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map((item) => `
      <article class="product-card animate-fade-up">

        <div class="card-image-wrap" style="position: relative;">
          <a href="/product.html?id=${item.product_id}" aria-label="${escapeHTML(item.product_name)}">
            <img
              class="card-image"
              src="${escapeHTML(item.product_image || "/images/defaults/product.svg")}"
              alt="${escapeHTML(item.product_name)}"
              loading="lazy"
              onerror="this.src='/images/defaults/product.svg'"
            >
          </a>

          <!-- Remove from wishlist button -->
          <button
            type="button"
            class="card-wishlist-btn active"
            data-id="${item.product_id}"
            aria-label="Retirer ${escapeHTML(item.product_name)} des favoris"
            title="Retirer des favoris"
            style="opacity: 1; transform: translateY(0);"
          >♥</button>

          <!-- Hover overlay -->
          <a class="card-overlay" href="/product.html?id=${item.product_id}" aria-hidden="true">
            <span class="btn light small">Voir le bijou</span>
          </a>
        </div>

        <div class="card-body">
          <p class="product-category">${escapeHTML(item.category_name || "")}</p>
          <h3 class="product-name">
            <a href="/product.html?id=${item.product_id}">${escapeHTML(item.product_name)}</a>
          </h3>
          <p class="product-price">${formatPrice(item.price)}</p>
        </div>

      </article>
    `).join("");

    // Bind remove events
    container.querySelectorAll(".card-wishlist-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;

        try {
          if (window.currentUser) {
            await apiRequest(`/api/wishlist/${id}`, { method: "DELETE" });
          } else {
            let guestWishlist = JSON.parse(localStorage.getItem("velora_wishlist")) || [];
            guestWishlist = guestWishlist.filter(itemId => String(itemId) !== String(id));
            localStorage.setItem("velora_wishlist", JSON.stringify(guestWishlist));
          }
          showToast("Bijou retiré de vos favoris.");
          loadWishlist();
        } catch (error) {
          showToast(error.message, "error");
        }
      });
    });

  } catch (error) {
    container.innerHTML = "";
    showAlert(msgEl, escapeHTML(error.message), "error");
  }
}


document.addEventListener("DOMContentLoaded", async () => {
  await waitForSession();

  // Guest support added, no redirect
  // if (!window.currentUser) { ... }

  if (window.currentUser && window.currentUser.role === "admin") {
    window.location.href = "/admin-dashboard.html";
    return;
  }

  loadWishlist();
});
