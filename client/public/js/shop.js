// ============================================================
// SHOP.JS — Shop Page Logic
// Category filters, search, sort, and product rendering.
// Velora Premium Jewelry — 2026
// ============================================================

let currentCategoryId = getParam("category") || "";
let currentSearch = getParam("search") || "";
let currentFeatured = getParam("featured") || "";
let currentSort = getParam("sort") || "";


// ── Product card template (shared with home.js style) ──

function shopProductCard(product) {
  const img = escapeHTML(product.image || "/images/defaults/product.svg");
  const name = escapeHTML(product.name);
  const category = escapeHTML(product.category_name || "");
  const price = formatPrice(product.price);
  const id = product.id;

  const badge = product.is_featured
    ? `<span class="card-badge card-badge-new">Nouveau</span>`
    : "";

  return `
    <article class="product-card">
      <a class="card-image-wrap" href="/product.html?id=${id}" aria-label="${name}">
        <img
          class="card-image"
          src="${img}"
          alt="${name}"
          loading="lazy"
          onerror="this.src='/images/defaults/product.svg'"
        >
        ${badge}
        <div class="card-overlay" aria-hidden="true">
          <span class="btn light small">Voir le bijou</span>
        </div>
        <button
          type="button"
          class="card-wishlist-btn"
          data-product-id="${id}"
          aria-label="Ajouter ${name} aux favoris"
        >♡</button>
      </a>
      <div class="card-body">
        <p class="product-category">${category}</p>
        <h3 class="product-name">
          <a href="/product.html?id=${id}">${name}</a>
        </h3>
        <p class="product-price">${price}</p>
      </div>
    </article>
  `;
}


// ── Load category filters ──

async function loadFilters() {
  const container = document.getElementById("category-filters");
  if (!container) return;

  try {
    const { categories } = await apiRequest("/api/categories");

    let html = `
      <button type="button" class="filter-btn ${!currentCategoryId ? "active" : ""}" data-category="">
        Toutes les pièces
      </button>
    `;

    categories.forEach((cat) => {
      const isActive = String(currentCategoryId) === String(cat.id);
      html += `
        <button type="button" class="filter-btn ${isActive ? "active" : ""}" data-category="${cat.id}">
          ${escapeHTML(cat.name)}
          <span style="color: var(--muted); font-size: 0.7em; margin-left: 4px;">(${cat.total_products || 0})</span>
        </button>
      `;
    });

    container.innerHTML = html;

    // Bind clicks
    container.querySelectorAll(".filter-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        currentCategoryId = btn.dataset.category;
        updateURL();

        container.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        loadProducts();
      });
    });

  } catch {
    container.innerHTML = `<p class="muted text-sm">Filtres indisponibles.</p>`;
  }
}


// ── Load products ──

async function loadProducts() {
  const container = document.getElementById("shop-products");
  const countEl = document.getElementById("products-count");
  const msgEl = document.getElementById("shop-messages");
  if (!container) return;

  container.innerHTML = `<div class="loading-state" style="grid-column: 1 / -1;">Recherche de bijoux…</div>`;
  hideAlert(msgEl);

  try {
    const params = new URLSearchParams();
    if (currentCategoryId) params.set("category", currentCategoryId);
    if (currentSearch) params.set("search", currentSearch);
    if (currentFeatured) params.set("featured", currentFeatured);
    if (currentSort) params.set("sort", currentSort);

    const { products } = await apiRequest(`/api/products?${params.toString()}`);

    // Update product count
    if (countEl) {
      countEl.textContent = products.length
        ? `${products.length} bijou${products.length > 1 ? "x" : ""} trouvé${products.length > 1 ? "s" : ""}`
        : "";
    }

    if (!products.length) {
      container.innerHTML = `
        <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 80px 20px;">
          <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--gold); margin-bottom: 20px; opacity: 0.8;">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <p style="font-family: var(--font-display); font-size: 1.4rem; color: var(--ink); margin-bottom: 8px;">Aucune pièce trouvée</p>
          <p style="font-size: 0.95rem; color: var(--muted); margin-bottom: 24px;">Nous n'avons pas trouvé de bijoux correspondant à votre recherche.</p>
          <button type="button" class="btn outline small" onclick="window.location.href='/shop.html'">Effacer les filtres</button>
        </div>
      `;
      return;
    }

    container.innerHTML = products.map(shopProductCard).join("");
    bindWishlistButtons(container);

  } catch (error) {
    container.innerHTML = "";
    showAlert(msgEl, escapeHTML(error.message), "error");
  }
}


// ── Wishlist quick-add ──

function bindWishlistButtons(container) {
  container.querySelectorAll(".card-wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const id = btn.dataset.productId;

      if (!window.currentUser) {
        let guestWishlist = JSON.parse(localStorage.getItem("velora_wishlist")) || [];
        if (!guestWishlist.includes(id)) {
          guestWishlist.push(id);
          localStorage.setItem("velora_wishlist", JSON.stringify(guestWishlist));
        }
        btn.textContent = "♥";
        btn.classList.add("active");
        showToast("Ajouté à vos favoris.");
        return;
      }

      try {
        await apiRequest("/api/wishlist", {
          method: "POST",
          body: JSON.stringify({ productId: id })
        });

        btn.textContent = "♥";
        btn.classList.add("active");
        showToast("Ajouté à vos favoris.");

      } catch (error) {
        showToast(error.message, "error");
      }
    });
  });
}


// ── Search form ──

function setupSearch() {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  if (!form || !input) return;

  if (currentSearch) {
    input.value = currentSearch;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    currentSearch = input.value.trim();
    updateURL();
    loadProducts();
  });
}


// ── Sort options ──

function setupSortOptions() {
  const container = document.getElementById("sort-options");
  if (!container) return;

  if (currentSort) {
    container.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
    const activeBtn = container.querySelector(`[data-sort="${currentSort}"]`);
    if (activeBtn) activeBtn.classList.add("active");
  }

  container.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentSort = btn.dataset.sort;
      updateURL();

      container.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      loadProducts();
    });
  });
}


// ── Update URL state (without reload) ──

function updateURL() {
  const url = new URL(window.location);

  if (currentCategoryId) {
    url.searchParams.set("category", currentCategoryId);
  } else {
    url.searchParams.delete("category");
  }

  if (currentSearch) {
    url.searchParams.set("search", currentSearch);
  } else {
    url.searchParams.delete("search");
  }

  if (currentSort) {
    url.searchParams.set("sort", currentSort);
  } else {
    url.searchParams.delete("sort");
  }

  window.history.pushState({}, "", url);
}


// ── Init ──

document.addEventListener("DOMContentLoaded", async () => {
  await waitForSession();
  setupSearch();
  setupSortOptions();
  loadFilters();
  loadProducts();
});
