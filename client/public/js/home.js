// ============================================================
// HOME.JS â€” Homepage Logic
// Loads featured products, categories.
// Also handles FAQ accordion, newsletter, and scroll reveal.
// Velora Jewelry Boutique â€” 2026
// ============================================================


// â”€â”€ Inline SVG for wishlist heart â”€â”€

const SVG_HEART_EMPTY = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`;
const SVG_HEART_FULL  = `<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`;


// â”€â”€ Product card template â”€â”€

function productCardTemplate(product) {
  const img      = escapeHTML(product.image || "/images/defaults/product.svg");
  const name     = escapeHTML(product.name);
  const category = escapeHTML(product.category_name || "");
  const price    = formatPrice(product.price);
  const id       = product.id;

  const badge = product.is_featured
    ? `<span class="card-badge card-badge-new">Nouveau</span>`
    : "";

  return `
    <article class="product-card reveal">
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
          title="Ajouter aux favoris"
        >${SVG_HEART_EMPTY}</button>
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


// â”€â”€ Category card template â”€â”€
// Note: uses category.slug if available, otherwise category.id
// to keep links consistent (no slug/id mixing)

function categoryCardTemplate(category) {
  const img    = escapeHTML(category.image || "/images/defaults/category.svg");
  const name   = escapeHTML(category.name);
  const count  = category.total_products || 0;
  // Prefer slug for readable URLs, fall back to id
  const filter = category.slug ? encodeURIComponent(category.slug) : category.id;

  return `
    <a class="category-card reveal" href="/shop.html?category=${filter}" aria-label="${name}">
      <div class="card-image-wrap">
        <img
          class="card-image"
          src="${img}"
          alt="${name}"
          loading="lazy"
          onerror="this.src='/images/defaults/category.svg'"
        >
      </div>
      <div class="card-body">
        <h3 class="category-name">${name}</h3>
        <p class="category-count">${count} piece${count !== 1 ? "s" : ""}</p>
      </div>
    </a>
  `;
}


// â”€â”€ Load featured products (single section) â”€â”€

async function loadFeaturedProducts() {
  const container = document.getElementById("featured-products");
  if (!container) return;

  container.innerHTML = `<div class="loading-state full" style="grid-column: 1 / -1;">Chargement des bijoux\u2026</div>`;

  try {
    const { products } = await apiRequest("/api/products?featured=true&limit=8");

    if (!products || !products.length) {
      // Fallback: load any products
      const fallback = await apiRequest("/api/products?limit=8");
      if (!fallback.products || !fallback.products.length) {
        container.innerHTML = `<div class="empty-state full" style="grid-column: 1 / -1;">Aucun bijou disponible pour le moment.</div>`;
        return;
      }
      container.innerHTML = fallback.products.map(productCardTemplate).join("");
    } else {
      container.innerHTML = products.map(productCardTemplate).join("");
    }

    observeRevealElements(container);
    bindWishlistButtons(container);

  } catch (error) {
    container.innerHTML = `<div class="empty-state full" style="grid-column: 1 / -1;">${escapeHTML(error.message)}</div>`;
  }
}


// â”€â”€ Load categories â”€â”€

async function loadHomeCategories() {
  const container = document.getElementById("home-categories");
  if (!container) return;

  container.innerHTML = `<div class="loading-state full" style="grid-column: 1 / -1;">Chargement des cat\u00e9gories\u2026</div>`;

  try {
    const { categories } = await apiRequest("/api/categories");

    if (!categories || !categories.length) {
      container.innerHTML = `<div class="empty-state full" style="grid-column: 1 / -1;">Aucune cat\u00e9gorie disponible.</div>`;
      return;
    }

    container.innerHTML = categories.map(categoryCardTemplate).join("");
    observeRevealElements(container);

  } catch (error) {
    container.innerHTML = `<div class="empty-state full" style="grid-column: 1 / -1;">${escapeHTML(error.message)}</div>`;
  }
}


// â”€â”€ Wishlist quick-add from product cards â”€â”€
// Supports both guest (localStorage) and logged-in users

function bindWishlistButtons(container) {
  container.querySelectorAll(".card-wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const id = btn.dataset.productId;

      if (!window.currentUser) {
        // Guest: save to localStorage
        let guestWishlist = JSON.parse(localStorage.getItem("velora_wishlist")) || [];
        if (!guestWishlist.includes(String(id))) {
          guestWishlist.push(String(id));
          localStorage.setItem("velora_wishlist", JSON.stringify(guestWishlist));
        }
        btn.innerHTML = SVG_HEART_FULL;
        btn.classList.add("active");
        if (typeof showToast === "function") showToast("Ajout\u00e9 \u00e0 vos favoris.");
        return;
      }

      try {
        await apiRequest("/api/wishlist", {
          method: "POST",
          body: JSON.stringify({ productId: id })
        });

        btn.innerHTML = SVG_HEART_FULL;
        btn.classList.add("active");
        if (typeof showToast === "function") showToast("Ajout\u00e9 \u00e0 vos favoris.");

      } catch (error) {
        if (typeof showToast === "function") showToast(error.message, "error");
      }
    });
  });
}


// â”€â”€ FAQ Accordion â”€â”€

function initFaqAccordion() {
  const accordion = document.getElementById("faq-accordion");
  if (!accordion) return;

  accordion.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const item   = button.closest(".faq-item");
      const isOpen = item.classList.contains("open");

      // Close all items first
      accordion.querySelectorAll(".faq-item").forEach((el) => {
        el.classList.remove("open");
        el.querySelector(".faq-question").setAttribute("aria-expanded", "false");
        const ans = el.querySelector(".faq-answer");
        if (ans) ans.style.maxHeight = "";
      });

      // Toggle clicked item
      if (!isOpen) {
        item.classList.add("open");
        button.setAttribute("aria-expanded", "true");

        const answer = item.querySelector(".faq-answer");
        const inner  = item.querySelector(".faq-answer-inner");
        if (answer && inner) {
          answer.style.maxHeight = inner.offsetHeight + "px";
        }
      }
    });
  });
}


// â”€â”€ Newsletter form â”€â”€

function initNewsletterForm() {
  const form = document.getElementById("newsletter-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("newsletter-email");
    if (!email?.value.trim()) return;

    if (typeof showToast === "function") showToast("Merci\u00a0! Vous \u00eates inscrite \u00e0 notre newsletter.");
    form.reset();
  });
}


// â”€â”€ Scroll Reveal (Intersection Observer) â”€â”€
// Falls back gracefully if IntersectionObserver is not available

function observeRevealElements(scope = document) {
  const elements = scope.querySelectorAll(".reveal:not(.visible)");
  if (!elements.length) return;

  // If no IntersectionObserver, just mark all as visible
  if (!("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}


// â”€â”€ Init â”€â”€

document.addEventListener("DOMContentLoaded", async () => {
  await waitForSession();

  // Load dynamic content in parallel
  loadFeaturedProducts();
  loadHomeCategories();

  // Page interactions
  initFaqAccordion();
  initNewsletterForm();

  // Reveal all existing .reveal elements on the page
  observeRevealElements();
});

