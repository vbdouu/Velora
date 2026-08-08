// ============================================================
// HOME.JS — Homepage Logic
// Loads featured products, bestsellers, categories.
// Also handles FAQ accordion, newsletter, and scroll reveal.
// Velora Premium Jewelry — 2026
// ============================================================


// ── Product card template ──
// Used for featured products and bestseller sections

function productCardTemplate(product) {
  const img = escapeHTML(product.image || "/images/defaults/product.svg");
  const name = escapeHTML(product.name);
  const category = escapeHTML(product.category_name || "");
  const price = formatPrice(product.price);
  const id = product.id;

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


// ── Category card template ──

function categoryCardTemplate(category) {
  const img = escapeHTML(category.image || "/images/defaults/category.svg");
  const name = escapeHTML(category.name);
  const count = category.total_products || 0;

  return `
    <a class="category-card reveal" href="/shop.html?category=${category.id}" aria-label="${name}">
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
        <p class="category-count">${count} pièce${count > 1 ? "s" : ""}</p>
      </div>
    </a>
  `;
}


// ── Load featured products ──

async function loadFeaturedProducts() {
  const container = document.getElementById("featured-products");
  if (!container) return;

  container.innerHTML = `<div class="loading-state full" style="grid-column: 1 / -1;">Chargement des bijoux…</div>`;

  try {
    const { products } = await apiRequest("/api/products?featured=true&limit=8");

    if (!products.length) {
      container.innerHTML = `<div class="empty-state full" style="grid-column: 1 / -1;">Aucun produit disponible pour le moment.</div>`;
      return;
    }

    container.innerHTML = products.map(productCardTemplate).join("");
    observeRevealElements(container);
    bindWishlistButtons(container);

  } catch (error) {
    container.innerHTML = `<div class="empty-state full" style="grid-column: 1 / -1;">${escapeHTML(error.message)}</div>`;
  }
}


// ── Load bestseller products (reuses same API, different set) ──

async function loadBestsellerProducts() {
  const container = document.getElementById("bestseller-products");
  if (!container) return;

  container.innerHTML = `<div class="loading-state full" style="grid-column: 1 / -1;">Chargement…</div>`;

  try {
    const { products } = await apiRequest("/api/products?limit=3");

    if (!products.length) {
      container.innerHTML = `<div class="empty-state full" style="grid-column: 1 / -1;">Aucun produit disponible.</div>`;
      return;
    }

    container.innerHTML = products.map(productCardTemplate).join("");
    observeRevealElements(container);
    bindWishlistButtons(container);

  } catch (error) {
    container.innerHTML = `<div class="empty-state full" style="grid-column: 1 / -1;">${escapeHTML(error.message)}</div>`;
  }
}


// ── Load categories ──

async function loadHomeCategories() {
  const container = document.getElementById("home-categories");
  if (!container) return;

  container.innerHTML = `<div class="loading-state full" style="grid-column: 1 / -1;">Chargement des catégories…</div>`;

  try {
    const { categories } = await apiRequest("/api/categories");

    if (!categories.length) {
      container.innerHTML = `<div class="empty-state full" style="grid-column: 1 / -1;">Aucune catégorie disponible.</div>`;
      return;
    }

    container.innerHTML = categories.map(categoryCardTemplate).join("");
    observeRevealElements(container);

  } catch (error) {
    container.innerHTML = `<div class="empty-state full" style="grid-column: 1 / -1;">${escapeHTML(error.message)}</div>`;
  }
}


// ── Wishlist quick-add from product cards ──

function bindWishlistButtons(container) {
  container.querySelectorAll(".card-wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (!window.currentUser) {
        window.location.href = "/login.html";
        return;
      }

      const id = btn.dataset.productId;

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


// ── FAQ Accordion ──

function initFaqAccordion() {
  const accordion = document.getElementById("faq-accordion");
  if (!accordion) return;

  accordion.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const item = button.closest(".faq-item");
      const isOpen = item.classList.contains("open");

      // Close all items first
      accordion.querySelectorAll(".faq-item").forEach((el) => {
        el.classList.remove("open");
        el.querySelector(".faq-question").setAttribute("aria-expanded", "false");
        el.querySelector(".faq-answer").style.maxHeight = "";
      });

      // Toggle clicked item
      if (!isOpen) {
        item.classList.add("open");
        button.setAttribute("aria-expanded", "true");

        const answer = item.querySelector(".faq-answer");
        const inner = item.querySelector(".faq-answer-inner");
        answer.style.maxHeight = inner.offsetHeight + "px";
      }
    });
  });
}


// ── Newsletter form ──

function initNewsletterForm() {
  const form = document.getElementById("newsletter-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("newsletter-email");
    if (!email?.value.trim()) return;

    // Show success (no real API endpoint — visual only for now)
    showToast("Merci ! Vous êtes inscrite à notre newsletter.");
    form.reset();
  });
}


// ── Scroll Reveal (Intersection Observer) ──

function observeRevealElements(scope = document) {
  const elements = scope.querySelectorAll(".reveal");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}


// ── Init ──

document.addEventListener("DOMContentLoaded", async () => {
  await waitForSession();

  // Load dynamic content in parallel
  loadFeaturedProducts();
  loadBestsellerProducts();
  loadHomeCategories();

  // Page interactions
  initFaqAccordion();
  initNewsletterForm();

  // Reveal all existing .reveal elements on the page
  observeRevealElements();
});
