// ============================================================
// PRODUCT.JS — Product Detail Page
// Gallery, add to cart, add to wishlist.
// Velora Premium Jewelry — 2026
// ============================================================

const productId = getParam("id");


// ── Load product details ──

async function loadProductDetails() {
  const container   = document.getElementById("product-container");
  const msgEl       = document.getElementById("product-messages");
  const breadcrumb  = document.getElementById("product-breadcrumb-name");

  if (!container) return;

  if (!productId) {
    container.innerHTML = `<div class="empty-state full" style="grid-column: 1 / -1;">Aucun bijou spécifié.</div>`;
    return;
  }

  try {
    const { product, images } = await apiRequest(`/api/products/${productId}`);

    // Update page title and breadcrumb
    document.title = `${product.name} — Velora`;
    if (breadcrumb) {
      breadcrumb.textContent = product.name;
    }

    // Build thumbnail list
    const allImages = [
      { src: product.image || "/images/defaults/product.svg", alt: product.name },
      ...(images || []).map((img) => ({ src: img.image_path, alt: product.name }))
    ];

    const thumbsHtml = allImages.length > 1
      ? `<div class="product-thumbs" id="product-thumbs" role="list" aria-label="Images du bijou">
          ${allImages.map((img, i) => `
            <button
              type="button"
              class="product-thumb ${i === 0 ? "active" : ""}"
              data-src="${escapeHTML(img.src)}"
              aria-label="Image ${i + 1} de ${allImages.length}"
              role="listitem"
            >
              <img src="${escapeHTML(img.src)}" alt="" loading="lazy" onerror="this.src='/images/defaults/product.svg'">
            </button>
          `).join("")}
        </div>`
      : "";

    // Stock indicator
    const stockHtml = buildStockIndicator(product.stock);

    // Inject full product layout
    container.innerHTML = `
      <!-- Gallery -->
      <div class="product-gallery animate-fade-up">
        <div class="product-main-image-wrap">
          <img
            id="main-product-image"
            class="product-main-image"
            src="${escapeHTML(product.image || "/images/defaults/product.svg")}"
            alt="${escapeHTML(product.name)}"
            onerror="this.src='/images/defaults/product.svg'"
          >
        </div>
        ${thumbsHtml}
      </div>

      <!-- Info -->
      <div class="product-info animate-fade-up" style="animation-delay: 0.15s;">

        <div class="product-info-header">
          <p class="product-detail-category">${escapeHTML(product.category_name || "")}</p>
          <h1 class="product-detail-name">${escapeHTML(product.name)}</h1>
          <p class="product-detail-price">${formatPrice(product.price)}</p>
        </div>

        <div class="product-detail-divider"></div>

        ${product.material || product.color || product.dimensions ? `
        <div class="product-detail-attrs">
          ${product.material ? `<div class="product-attr"><span class="product-attr-label">Matière</span><span class="product-attr-value">${escapeHTML(product.material)}</span></div>` : ''}
          ${product.color ? `<div class="product-attr"><span class="product-attr-label">Couleur</span><span class="product-attr-value">${escapeHTML(product.color)}</span></div>` : ''}
          ${product.dimensions ? `<div class="product-attr"><span class="product-attr-label">Dimensions</span><span class="product-attr-value">${escapeHTML(product.dimensions)}</span></div>` : ''}
        </div>
        <div class="product-detail-divider"></div>
        ` : ''}

        <p class="product-detail-desc">${escapeHTML(product.description || 'Aucune description disponible pour ce bijou.').replace(/\n/g, '<br>')}</p>

        ${product.care_instructions || product.delivery_info || product.return_policy ? `
        <div style="margin-top: 20px; padding: 16px; background: var(--cream); border-radius: 6px; border: 1px solid var(--line); font-size: 0.85rem; display: flex; flex-direction: column; gap: 10px;">
          ${product.care_instructions ? `<div><strong>Conseils d'entretien :</strong> ${escapeHTML(product.care_instructions)}</div>` : ''}
          ${product.delivery_info ? `<div><strong>Livraison :</strong> ${escapeHTML(product.delivery_info)}</div>` : ''}
          ${product.return_policy ? `<div><strong>Retours :</strong> ${escapeHTML(product.return_policy)}</div>` : ''}
        </div>
        ` : ''}

        <div class="product-stock-indicator">
          ${stockHtml}
        </div>

        <form class="product-add-form" id="add-cart-form">
          <div class="product-add-row">
            <div class="qty-stepper">
              <button type="button" class="qty-btn" id="qty-minus" aria-label="Diminuer la quantité">−</button>
              <input class="qty-value" type="number" id="quantity" name="quantity" value="1" min="1" max="${product.stock > 0 ? product.stock : 1}" readonly aria-label="Quantité">
              <button type="button" class="qty-btn" id="qty-plus" aria-label="Augmenter la quantité">+</button>
            </div>
            <button
              type="submit"
              class="btn primary"
              style="flex: 1;"
              id="btn-add-cart"
              ${product.stock === 0 ? "disabled" : ""}
            >
              ${product.stock === 0 ? "Rupture de stock" : "Ajouter au panier"}
            </button>
          </div>
          <button type="button" id="btn-wishlist" class="btn outline full-width">
            ♡ &nbsp;Ajouter aux favoris
          </button>
        </form>

        <div class="product-assurances">
          <div class="assurance-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            Bijoux soigneusement sélectionnés
          </div>
          <div class="assurance-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" aria-hidden="true">
              <rect x="2" y="7" width="20" height="15" rx="1"/>
              <path d="M16 7V5a2 2 0 00-4 0v2M8 7V5a2 2 0 014 0"/>
            </svg>
            Emballage soigné à chaque commande
          </div>
          <div class="assurance-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" aria-hidden="true">
              <path d="M20 7l-8 5-8-5"/>
              <path d="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z"/>
            </svg>
            Paiement à la livraison · Livraison 3–5 jours
          </div>
        </div>

      </div>
    `;

    // Initialize gallery
    initGallery();

    // Initialize quantity stepper
    initQtyStepper(product.stock);

    // Initialize cart form
    initCartForm(product);

    // Initialize wishlist button
    initWishlistBtn(product);

  } catch (error) {
    container.innerHTML = "";
    showAlert(msgEl, escapeHTML(error.message), "error");
  }
}


// ── Stock indicator builder ──

function buildStockIndicator(stock) {
  if (stock > 10) {
    return `<span class="stock-dot stock-dot-green"></span><span style="color: var(--success);">En stock</span>`;
  }
  if (stock > 0) {
    return `<span class="stock-dot stock-dot-gold"></span><span style="color: var(--gold-muted);">Plus que ${stock} en stock</span>`;
  }
  return `<span class="stock-dot stock-dot-red"></span><span style="color: var(--danger);">Rupture de stock</span>`;
}


// ── Gallery thumbnail switcher ──

function initGallery() {
  const mainImg = document.getElementById("main-product-image");
  const thumbs  = document.querySelectorAll(".product-thumb");

  if (!mainImg || !thumbs.length) return;

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      // Crossfade
      mainImg.style.opacity = "0";
      mainImg.style.transition = "opacity 0.22s ease";

      setTimeout(() => {
        mainImg.src = thumb.dataset.src;
        mainImg.style.opacity = "1";
      }, 200);

      // Update active state
      thumbs.forEach((t) => t.classList.remove("active"));
      thumb.classList.add("active");
    });
  });
}


// ── Quantity stepper ──

function initQtyStepper(maxStock) {
  const input  = document.getElementById("quantity");
  const minus  = document.getElementById("qty-minus");
  const plus   = document.getElementById("qty-plus");

  if (!input || !minus || !plus) return;

  minus.addEventListener("click", () => {
    const val = parseInt(input.value, 10);
    if (val > 1) input.value = val - 1;
  });

  plus.addEventListener("click", () => {
    const val = parseInt(input.value, 10);
    if (val < maxStock) {
      input.value = val + 1;
    } else {
      showToast("Stock maximum atteint pour ce bijou.", "error");
    }
  });
}


// ── Add to cart ──

function initCartForm(product) {
  const form     = document.getElementById("add-cart-form");
  const submitBtn = document.getElementById("btn-add-cart");
  const msgEl    = document.getElementById("product-messages");

  if (!form || !submitBtn) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!window.currentUser) {
      let guestCart = JSON.parse(localStorage.getItem("velora_cart")) || [];
      const quantity = parseInt(document.getElementById("quantity").value, 10);
      let existing = guestCart.find(item => String(item.productId) === String(product.id));
      if (existing) {
        existing.quantity += quantity;
      } else {
        guestCart.push({ productId: product.id, quantity });
      }
      localStorage.setItem("velora_cart", JSON.stringify(guestCart));
      
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Ajout en cours…";
      submitBtn.disabled = true;
      submitBtn.classList.add("loading");
      
      setTimeout(() => {
        showToast("Bijou ajouté au panier.");
        if (typeof updateCartBadge === "function") updateCartBadge();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove("loading");
      }, 300);
      
      return;
    }

    const quantity = parseInt(document.getElementById("quantity").value, 10);
    const originalText = submitBtn.textContent;

    submitBtn.textContent = "Ajout en cours…";
    submitBtn.disabled = true;
    submitBtn.classList.add("loading");

    try {
      await apiRequest("/api/cart", {
        method: "POST",
        body: JSON.stringify({ productId: product.id, quantity })
      });

      showToast("Bijou ajouté au panier.");
      updateCartBadge(); // from auth.js

    } catch (error) {
      showAlert(msgEl, escapeHTML(error.message), "error");

    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      submitBtn.classList.remove("loading");
    }
  });
}


// ── Add to wishlist ──

function initWishlistBtn(product) {
  const btn   = document.getElementById("btn-wishlist");
  const msgEl = document.getElementById("product-messages");

  if (!btn) return;

  btn.addEventListener("click", async () => {
    if (!window.currentUser) {
      let guestWishlist = JSON.parse(localStorage.getItem("velora_wishlist")) || [];
      if (!guestWishlist.includes(String(product.id))) {
        guestWishlist.push(String(product.id));
        localStorage.setItem("velora_wishlist", JSON.stringify(guestWishlist));
      }
      btn.innerHTML = `♥ &nbsp;Ajouté aux favoris`;
      btn.classList.add("active");
      showToast("Ajouté à vos favoris.");
      return;
    }

    btn.disabled = true;

    try {
      await apiRequest("/api/wishlist", {
        method: "POST",
        body: JSON.stringify({ productId: product.id })
      });

      btn.innerHTML = `♥ &nbsp;Ajouté aux favoris`;
      btn.classList.add("active");
      showToast("Ajouté à vos favoris.");

    } catch (error) {
      showToast(error.message, "error");

    } finally {
      btn.disabled = false;
    }
  });
}


// ── Init ──

document.addEventListener("DOMContentLoaded", async () => {
  await waitForSession();
  loadProductDetails();
});
