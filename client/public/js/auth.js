// ============================================================
// AUTH.JS — Session, Header, Footer, Sidebar, Search
// Handles user session loading, header/footer injection,
// sidebar menu, search panel, role-based access control,
// and logout flow.
// Velora Jewelry Boutique — 2026
// ============================================================

window.currentUser = null;
window.veloraAuthReady = null;
window.veloraSettings = null;


// ── Role routing ──

function dashboardLink(role) {
  if (role === "admin") return "/admin-dashboard.html";
  return "/account.html";
}


// ── Brand markup ──

function veloraBrand() {
  const name = window.veloraSettings?.store_name || "Velora";
  return `${escapeHTML(name)}<span style="color: var(--gold);">.</span>`;
}


// ── Inline SVG icons ──

function iconMenu() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="17" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>`;
}

function iconSearch() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>`;
}

function iconCart() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>`;
}

function iconHeart() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>`;
}

function iconUser() {
  return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>`;
}

function iconClose() {
  return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>`;
}


// ── Fetch Categories for Nav ──

let navCategoriesCache = null;

async function fetchCategoriesForNav() {
  if (navCategoriesCache) return navCategoriesCache;
  try {
    const data = await apiRequest("/api/categories");
    navCategoriesCache = (data && Array.isArray(data.categories)) ? data.categories : [];
  } catch {
    navCategoriesCache = [];
  }
  return navCategoriesCache;
}


// ── Build Header ──

async function buildHeader() {
  const target = document.getElementById("site-header");
  if (!target) return;

  const categories = await fetchCategoriesForNav();
  const sidebarCategoryLinks = categories.length
    ? categories.map(cat => `<a class="sidebar-sub-link" href="/shop.html?category=${cat.id}">${escapeHTML(cat.name)}</a>`).join("\n        ")
    : "";
  const sidebarCategoriesSection = categories.length
    ? `
        <div class="sidebar-nav-divider"></div>
        <span class="sidebar-section-label">Catégories</span>
        ${sidebarCategoryLinks}
      `
    : "";

  const searchCategoryPillsHtml = categories.length
    ? categories.map(cat => `<a class="search-tag" href="/shop.html?category=${cat.id}">${escapeHTML(cat.name)}</a>`).join("\n                ")
    : "";

  const isDashboard = document.body.classList.contains("dashboard-page");
  const user = window.currentUser;

  const accountLink  = user ? dashboardLink(user.role) : "/login.html";
  const wishlistLink = user ? "/account.html#wishlist" : "/wishlist.html";
  const cartLink     = user ? "/account.html#cart" : "/cart.html";

  // Right-side actions
  const rightActions = `
    <a class="header-account" href="${accountLink}" aria-label="${user ? "Mon compte" : "Connexion"}">
      ${iconUser()}
    </a>
    <a class="header-wishlist" href="${wishlistLink}" aria-label="Liste de souhaits">
      ${iconHeart()}
    </a>
    <a class="header-cart" href="${cartLink}" aria-label="Panier">
      ${iconCart()}
      <span class="header-cart-badge" id="cart-badge" style="display:none;">0</span>
    </a>
  `;

  const isDashboardShellPage = document.body.classList.contains("admin-page") || document.body.classList.contains("account-page");
  if (isDashboardShellPage) {
    if (target) target.style.display = "none";
    return;
  }

  // For user dashboard pages: simpler header
  if (isDashboard) {
    target.innerHTML = `
      <header class="site-header" id="main-header">
        <div class="container header-inner">
          <div class="header-left">
            <a class="header-icon-btn" href="/index.html" style="text-decoration:none;">
              ← Retour au site
            </a>
          </div>
          <div class="header-center">
            <a class="brand" href="/index.html" aria-label="Velora — Accueil">
              <span class="brand-wordmark">${veloraBrand()}</span>
            </a>
          </div>
          <div class="header-right">
            ${rightActions}
          </div>
        </div>
      </header>
    `;
    setupHeaderScroll();
    updateCartBadge();
    return;
  }

  // Public header
  target.innerHTML = `
    <header class="site-header" id="main-header">
      <div class="container header-inner">

        <!-- Left: Menu + Search -->
        <div class="header-left">
          <button class="header-icon-btn" type="button" id="btn-open-sidebar" aria-label="Ouvrir le menu" aria-expanded="false">
            ${iconMenu()}
            <span>Menu</span>
          </button>
          <button class="header-icon-btn" type="button" id="btn-open-search" aria-label="Rechercher">
            ${iconSearch()}
            <span>Recherche</span>
          </button>
        </div>

        <!-- Center: Logo -->
        <div class="header-center">
          <a class="brand" href="/index.html" aria-label="Velora — Accueil">
            <span class="brand-wordmark">${veloraBrand()}</span>
          </a>
        </div>

        <!-- Right: Account + Wishlist + Cart -->
        <div class="header-right">
          ${rightActions}
        </div>
      </div>
    </header>

    <!-- Sidebar Overlay -->
    <div class="sidebar-overlay" id="sidebar-overlay" aria-hidden="true"></div>

    <!-- Sidebar Panel -->
    <aside class="sidebar-panel" id="sidebar-panel" aria-label="Navigation principale" aria-hidden="true">
      <div class="sidebar-panel-head">
        <a class="sidebar-brand" href="/index.html">${veloraBrand()}</a>
        <button class="sidebar-close-btn" id="btn-close-sidebar" aria-label="Fermer le menu">
          ${iconClose()}
        </button>
      </div>

      <nav class="sidebar-nav-body">
        <span class="sidebar-section-label">Boutique</span>
        <a class="sidebar-nav-link" href="/shop.html">
          Tous les bijoux
          <span class="sidebar-nav-link-arrow">&rarr;</span>
        </a>
        ${sidebarCategoriesSection}
        <div class="sidebar-nav-divider"></div>
        <span class="sidebar-section-label">Sélection</span>
        <a class="sidebar-sub-link" href="/shop.html?featured=true">Nouveautés &amp; coups de cœur</a>

        <div class="sidebar-nav-divider"></div>
        <span class="sidebar-section-label">Informations</span>
        <a class="sidebar-sub-link" href="/about.html">&Agrave; propos</a>
        <a class="sidebar-sub-link" href="/contact.html">Contact</a>
        <a class="sidebar-sub-link" href="/faq.html">FAQ</a>
        <a class="sidebar-sub-link" href="/livraison.html">Livraison</a>
        <a class="sidebar-sub-link" href="/retours.html">Retours</a>
      </nav>

      <div class="sidebar-panel-foot">
        <a class="sidebar-foot-link" href="/livraison.html">Livraison</a>
        <a class="sidebar-foot-link" href="/retours.html">Retours</a>
        <a class="sidebar-foot-link" href="/confidentialite.html">Confidentialité</a>
        <a class="sidebar-foot-link" href="/conditions.html">Conditions générales</a>
      </div>
    </aside>

    <!-- Search Modal & Backdrop -->
    <div class="search-backdrop" id="search-backdrop" role="dialog" aria-modal="true" aria-hidden="true">
      <div class="search-modal" id="search-modal">
        
        <div class="search-header">
          <span class="search-header-icon">${iconSearch()}</span>
          <input
            type="search"
            class="search-input"
            id="search-input"
            placeholder="Rechercher une bague, un collier, une matière..."
            autocomplete="off"
            aria-label="Rechercher un bijou"
          >
          <kbd class="search-kbd-hint">ÉCHAP</kbd>
          <button type="button" class="search-close-btn" id="btn-close-search" aria-label="Fermer la recherche">
            ${iconClose()}
          </button>
        </div>

        <div class="search-body">
          <!-- Default suggestions (shown before typing) -->
          <div class="search-suggestions" id="search-suggestions">
            
            <!-- Étage 1 : Explorer -->
            <div class="search-section">
              <p class="search-section-title">Explorer</p>
              <div class="search-popular-tags">
                <a class="search-tag search-tag-featured" href="/shop.html?featured=true">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
                    <path d="M12 2l2.4 7.4H22l-6 4.6 2.3 7.2L12 16.8 5.7 21.2 8 14 2 9.4h7.6z"/>
                  </svg>
                  <span>Nouveautés</span>
                </a>
                ${searchCategoryPillsHtml}
              </div>
            </div>

            <div class="search-section-divider"></div>

            <!-- Étage 2 : Sélection du moment -->
            <div class="search-section">
              <p class="search-section-title">Sélection du moment</p>
              <div class="search-popular-products" id="search-popular-products">
                <div class="search-loading-hint">Chargement de la sélection...</div>
              </div>
            </div>

          </div>

          <!-- Live search results (shown when query >= 2) -->
          <div class="search-results-container" id="search-results" style="display:none;"></div>
        </div>

      </div>
    </div>
  `;

  // Attach sidebar logic
  setupSidebar();

  // Attach search panel logic
  setupSearchPanel();

  // Scroll-based header shadow
  setupHeaderScroll();

  // Load cart badge count
  updateCartBadge();

  // Load popular products in search panel
  loadPopularSearchProducts();
}


// ── Sidebar ──

function setupSidebar() {
  const openBtn   = document.getElementById("btn-open-sidebar");
  const closeBtn  = document.getElementById("btn-close-sidebar");
  const panel     = document.getElementById("sidebar-panel");
  const overlay   = document.getElementById("sidebar-overlay");

  if (!panel || !overlay) return;

  function openSidebar() {
    panel.classList.add("open");
    overlay.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    openBtn?.setAttribute("aria-expanded", "true");
  }

  function closeSidebar() {
    panel.classList.remove("open");
    overlay.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    openBtn?.setAttribute("aria-expanded", "false");
  }

  openBtn?.addEventListener("click", openSidebar);
  closeBtn?.addEventListener("click", closeSidebar);
  overlay.addEventListener("click", closeSidebar);

  // Close on link click inside sidebar
  panel.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeSidebar);
  });

  // ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("open")) {
      closeSidebar();
    }
  });
}


// ── Search Modal ──

function setupSearchPanel() {
  const openBtn   = document.getElementById("btn-open-search");
  const closeBtn  = document.getElementById("btn-close-search");
  const backdrop  = document.getElementById("search-backdrop");
  const input     = document.getElementById("search-input");

  if (!backdrop) return;

  function openSearch() {
    backdrop.classList.add("open");
    backdrop.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    loadPopularSearchProducts();
    setTimeout(() => input?.focus(), 120);
  }

  function closeSearch() {
    backdrop.classList.remove("open");
    backdrop.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (input) input.value = "";
    resetSearchResults();
  }

  openBtn?.addEventListener("click", openSearch);
  closeBtn?.addEventListener("click", closeSearch);

  // Click outside (on the backdrop overlay) to close
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) {
      closeSearch();
    }
  });

  // ESC key to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && backdrop.classList.contains("open")) {
      closeSearch();
    }
  });

  // Live search on input with debounce
  if (input) {
    let debounceTimer;
    input.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const q = input.value.trim();
        if (q.length >= 2) {
          performSearch(q);
        } else {
          resetSearchResults();
        }
      }, 240);
    });

    // Submit on Enter
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const q = input.value.trim();
        if (q) window.location.href = `/shop.html?search=${encodeURIComponent(q)}`;
      }
    });
  }
}

function resetSearchResults() {
  const results     = document.getElementById("search-results");
  const suggestions = document.getElementById("search-suggestions");
  if (results)     { results.style.display = "none"; results.innerHTML = ""; }
  if (suggestions) { suggestions.style.display = ""; }
}

async function performSearch(query) {
  const resultsEl     = document.getElementById("search-results");
  const suggestionsEl = document.getElementById("search-suggestions");
  if (!resultsEl) return;

  if (suggestionsEl) suggestionsEl.style.display = "none";
  resultsEl.style.display = "";
  resultsEl.innerHTML = `<div class="search-loading-hint">Recherche en cours...</div>`;

  try {
    const { products } = await apiRequest(`/api/products?search=${encodeURIComponent(query)}`);

    if (!products || products.length === 0) {
      resultsEl.innerHTML = `
        <div class="search-empty-state">
          <p class="search-empty-title">Aucun bijou ne correspond à votre recherche "${escapeHTML(query)}".</p>
          <a href="/shop.html" class="search-empty-link">Explorer toute la boutique →</a>
        </div>
      `;
      return;
    }

    resultsEl.innerHTML = `
      <div class="search-results-header">
        <span class="search-section-title">${products.length} résultat(s) pour "${escapeHTML(query)}"</span>
      </div>
      <div class="search-results-list">
        ${products.slice(0, 5).map(p => `
          <a class="search-result-item" href="/product.html?id=${p.id}">
            <img class="search-result-img" src="${escapeHTML(p.image || "/images/defaults/product.svg")}" alt="${escapeHTML(p.name)}" onerror="this.src='/images/defaults/product.svg'">
            <div class="search-result-info">
              <span class="search-result-name">${escapeHTML(p.name)}</span>
              <span class="search-result-price">${typeof formatPrice === "function" ? formatPrice(p.price) : p.price + " DA"}</span>
            </div>
          </a>
        `).join("")}
      </div>
      ${products.length > 5 ? `
        <div class="search-results-footer">
          <a href="/shop.html?search=${encodeURIComponent(query)}" class="search-view-all-link">Voir tous les ${products.length} résultats dans la boutique →</a>
        </div>
      ` : ""}
    `;
  } catch {
    resultsEl.innerHTML = `
      <div class="search-empty-state">
        <p class="search-empty-title">Impossible de charger les résultats. Veuillez réessayer.</p>
      </div>
    `;
  }
}

async function loadPopularSearchProducts() {
  const container = document.getElementById("search-popular-products");
  if (!container) return;

  try {
    const [featuredRes, salesRes, newestRes] = await Promise.all([
      apiRequest("/api/products?featured=true&limit=6"),
      apiRequest("/api/products?sortBy=sales&sortDir=desc&limit=6"),
      apiRequest("/api/products?sortBy=created_at&sortDir=desc&limit=6")
    ]);

    const featuredList = (featuredRes && Array.isArray(featuredRes.products)) ? featuredRes.products : [];
    const salesList = (salesRes && Array.isArray(salesRes.products)) ? salesRes.products : [];
    const newestList = (newestRes && Array.isArray(newestRes.products)) ? newestRes.products : [];

    const selectedProducts = [];
    const selectedIds = new Set();
    const MAX_TOTAL = 6;

    function addFromList(list, maxCount) {
      let added = 0;
      for (const product of list || []) {
        if (added >= maxCount || selectedProducts.length >= MAX_TOTAL) break;
        if (product && product.id && !selectedIds.has(product.id)) {
          selectedProducts.push(product);
          selectedIds.add(product.id);
          added++;
        }
      }
    }

    // 1. Initial targets: up to 2 of each group
    addFromList(featuredList, 2);
    addFromList(salesList, 2);
    addFromList(newestList, 2);

    // 2. Backfill from remaining unique products if a group had fewer than 2
    if (selectedProducts.length < MAX_TOTAL) {
      const pools = [newestList, featuredList, salesList];
      for (const pool of pools) {
        if (selectedProducts.length >= MAX_TOTAL) break;
        for (const product of pool || []) {
          if (selectedProducts.length >= MAX_TOTAL) break;
          if (product && product.id && !selectedIds.has(product.id)) {
            selectedProducts.push(product);
            selectedIds.add(product.id);
          }
        }
      }
    }

    if (selectedProducts.length === 0) {
      container.innerHTML = `<div class="search-empty-hint">Aucun produit disponible pour le moment.</div>`;
      return;
    }

    container.innerHTML = selectedProducts.map(p => `
      <a class="search-product-card" href="/product.html?id=${p.id}">
        <img class="search-product-img" src="${escapeHTML(p.image || "/images/defaults/product.svg")}" alt="${escapeHTML(p.name)}" onerror="this.src='/images/defaults/product.svg'">
        <div class="search-product-info">
          <span class="search-product-name">${escapeHTML(p.name)}</span>
          <span class="search-product-price">${typeof formatPrice === "function" ? formatPrice(p.price) : p.price + " DA"}</span>
        </div>
      </a>
    `).join("");
  } catch {
    container.innerHTML = `<div class="search-empty-hint">Sélection temporairement indisponible.</div>`;
  }
}


// ── Header scroll detection ──

function setupHeaderScroll() {
  const header = document.getElementById("main-header");
  if (!header) return;

  const SCROLL_THRESHOLD = 40;

  function onScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}


// ── Cart badge ──

async function updateCartBadge() {
  try {
    const badge = document.getElementById("cart-badge");
    if (!badge) return;

    let count = 0;
    if (window.currentUser) {
      const data = await apiRequest("/api/cart");
      count = data.items?.length || 0;
    } else {
      const guestCart = JSON.parse(localStorage.getItem("velora_cart")) || [];
      count = guestCart.length;
    }

    if (count > 0) {
      badge.textContent = count > 99 ? "99+" : count;
      badge.style.display = "flex";
    } else {
      badge.style.display = "none";
    }
  } catch {
    // Silently ignore — cart badge is non-critical
  }
}


// ── Build Footer ──

async function buildFooter() {
  const target = document.getElementById("site-footer");
  if (!target) return;

  const categories = await fetchCategoriesForNav();
  const footerCategories = categories.filter(cat => cat.show_in_footer === 1 || cat.show_in_footer === '1' || cat.show_in_footer === true);
  const footerCategoryLinks = footerCategories.length
    ? footerCategories.map(cat => `<a href="/shop.html?category=${cat.id}">${escapeHTML(cat.name)}</a>`).join("\n              ")
    : "";

  const settings = window.veloraSettings || {};
  const instagramUrl = settings.instagram_url || "https://www.instagram.com/";
  const facebookUrl = settings.facebook_url || "https://www.facebook.com/";
  let whatsappUrl = "https://wa.me/";
  if (settings.store_whatsapp) {
    if (settings.store_whatsapp.startsWith("http")) {
      whatsappUrl = settings.store_whatsapp;
    } else {
      const cleanDigits = settings.store_whatsapp.replace(/[^0-9]/g, "");
      whatsappUrl = cleanDigits ? `https://wa.me/${cleanDigits}` : "https://wa.me/";
    }
  }

  const storeName = settings.store_name || "Velora";
  const currentYear = new Date().getFullYear();

  target.innerHTML = `
    <footer class="site-footer" aria-label="Pied de page Velora">
      <div class="container footer-inner">
        <div class="footer-grid">

          <!-- Brand column -->
          <div class="footer-col footer-brand-wrap">
            <a class="footer-brand" href="/index.html" aria-label="Velora — Accueil">${veloraBrand()}</a>
            <p class="footer-tagline">
              Bijoux tendance et accessibles, livrés partout en Algérie. Commandez en toute confiance et réglez à la livraison.
            </p>
          </div>

          <!-- Boutique column -->
          <div class="footer-col">
            <h3>Boutique</h3>
            <div class="footer-links">
              <a href="/shop.html?featured=true">Nouveautés</a>
              ${footerCategoryLinks}
            </div>
          </div>

          <!-- Informations column -->
          <div class="footer-col">
            <h3>Informations</h3>
            <div class="footer-links">
              <a href="/about.html">À propos</a>
              <a href="/livraison.html">Livraison</a>
              <a href="/faq.html">FAQ</a>
              <a href="/contact.html">Contact</a>
            </div>
          </div>

          <!-- Service client column -->
          <div class="footer-col">
            <h3>Service client</h3>
            <div class="footer-links">
              <a href="/account.html">Mon compte</a>
              <a href="/orders.html">Mes commandes</a>
              <a href="/retours.html">Politique de retour</a>
              <a href="/conditions.html">Conditions générales</a>
            </div>
          </div>

          <!-- Suivez-nous column -->
          <div class="footer-col">
            <h3>Suivez-nous</h3>
            <div class="footer-links">
              <a class="footer-social-nav-link" href="${instagramUrl}" target="_blank" rel="noopener" aria-label="Instagram">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <circle cx="12" cy="12" r="5"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                </svg>
                <span>Instagram</span>
              </a>
              <a class="footer-social-nav-link" href="${facebookUrl}" target="_blank" rel="noopener" aria-label="Facebook">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
                <span>Facebook</span>
              </a>
              <a class="footer-social-nav-link" href="${whatsappUrl}" target="_blank" rel="noopener" aria-label="WhatsApp">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        <div class="footer-bottom">
          <p class="footer-bottom-text">© ${currentYear} ${escapeHTML(storeName)}. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  `;
}


// ── Load current user session ──

async function loadCurrentUser() {
  try {
    const data = await apiRequest("/api/auth/me");
    window.currentUser = data.user;

    // Migrate guest cart to server cart on login
    try {
      const guestCart = JSON.parse(localStorage.getItem("velora_cart")) || [];
      if (guestCart.length > 0) {
        for (const item of guestCart) {
          await apiRequest("/api/cart", {
            method: "POST",
            body: JSON.stringify({ productId: item.productId, quantity: item.quantity })
          });
        }
        localStorage.removeItem("velora_cart");
      }

      const guestWishlist = JSON.parse(localStorage.getItem("velora_wishlist")) || [];
      if (guestWishlist.length > 0) {
        for (const id of guestWishlist) {
          await apiRequest("/api/wishlist", {
            method: "POST",
            body: JSON.stringify({ productId: id })
          });
        }
        localStorage.removeItem("velora_wishlist");
      }
    } catch {
      // ignore migration errors silently
    }
  } catch {
    window.currentUser = null;
  }

  return window.currentUser;
}


// ── Role redirect ──

function redirectByRole(user) {
  window.location.href = dashboardLink(user.role);
}


// ── Role access guard ──

function checkRoleAccess() {
  const requiredRole = document.body.dataset.requireRole;
  if (!requiredRole) return;

  const user = window.currentUser;
  if (!user) {
    const redirect = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.href = `/login.html?redirect=${redirect}`;
    return;
  }

  const hasAccess = user.role === requiredRole;

  if (!hasAccess) {
    window.location.href = dashboardLink(user.role);
  }
}


// ── Logout modal ──

function showLogoutModal() {
  if (!document.getElementById("logout-modal")) {
    const modal = document.createElement("div");
    modal.id = "logout-modal";
    modal.className = "modal-backdrop";
    modal.innerHTML = `
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="logout-title">
        <div class="modal-header">
          <h2 id="logout-title">Déconnexion</h2>
          <button class="modal-close" type="button" data-close-modal="logout-modal" aria-label="Fermer">×</button>
        </div>
        <div class="modal-body">
          <p style="font-weight:300;color:var(--text);">Souhaitez-vous vraiment vous déconnecter de votre compte Velora ?</p>
          <div style="display:flex;gap:12px;justify-content:flex-end;margin-top:28px;">
            <button class="btn outline small" type="button" data-close-modal="logout-modal">Annuler</button>
            <button class="btn primary small" type="button" data-confirm-logout>Se déconnecter</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  openModal("logout-modal");
}


// ── Perform logout ──

async function performLogout() {
  try {
    await apiRequest("/api/auth/logout", { method: "POST" });
  } catch (error) {
    showToast(error.message, "error");
  } finally {
    window.location.href = "/index.html";
  }
}


// ── Load public store settings (branding, announcement, contact, etc.) ──

async function loadDynamicSettings() {
  try {
    const { settings } = await apiRequest("/api/settings");
    if (!settings) return;
    window.veloraSettings = settings;

    // 1. Update logo / brand text across header, footer, sidebar
    document.querySelectorAll(".brand-wordmark, .footer-brand, .sidebar-brand").forEach(el => {
      el.innerHTML = veloraBrand();
    });

    // 2. Dynamic Announcement bar with free threshold substitution and theme
    const bar = document.getElementById("announcement-bar");
    if (bar) {
      if (settings.announcement_enabled === "0" || settings.announcement_enabled === false) {
        bar.style.display = "none";
      } else {
        bar.style.display = "";
        let announcementText = settings.announcement || "";
        if (settings.free_threshold && announcementText.includes("5 000 DA")) {
          const formattedThreshold = typeof formatPrice === "function" ? formatPrice(settings.free_threshold) : `${settings.free_threshold} DA`;
          announcementText = announcementText.replace(/5\s?000\s?DA/g, formattedThreshold);
        }
        if (announcementText) {
          const btnText = settings.announcement_btn_text !== undefined ? settings.announcement_btn_text : "Découvrir";
          const btnHtml = btnText.trim() ? `<a href="/shop.html">${escapeHTML(btnText.trim())}</a>` : "";
          bar.innerHTML = `${escapeHTML(announcementText)} ${btnHtml}`;
        }

        // Apply theme background class/style if set
        const theme = settings.announcement_bg || "gold";
        bar.className = `announcement-bar announcement-theme-${theme}`;
      }
    }

    // 3. Document title & SEO
    if (settings.store_name) {
      if (document.title.includes("Velora")) {
        document.title = document.title.replace(/Velora/g, settings.store_name);
      }
    }

    // 4. Update Social & Contact links
    if (settings.instagram_url) {
      document.querySelectorAll("a[href*='instagram.com'], [data-store-instagram-link]").forEach(a => a.href = settings.instagram_url);
    }
    if (settings.facebook_url) {
      document.querySelectorAll("a[href*='facebook.com'], [data-store-facebook-link]").forEach(a => a.href = settings.facebook_url);
    }
    if (settings.store_whatsapp) {
      const waNumber = settings.store_whatsapp.replace(/[^0-9]/g, "");
      const waUrl = settings.store_whatsapp.startsWith("http") ? settings.store_whatsapp : (waNumber ? `https://wa.me/${waNumber}` : settings.store_whatsapp);
      document.querySelectorAll("a[href*='wa.me'], [data-store-whatsapp-link]").forEach(a => a.href = waUrl);
    }
    if (settings.store_phone) {
      const cleanPhone = settings.store_phone.replace(/[^0-9+]/g, "");
      document.querySelectorAll("[data-store-phone-link]").forEach(a => a.href = `tel:${cleanPhone}`);
    }
    if (settings.store_email) {
      document.querySelectorAll("[data-store-email-link]").forEach(a => a.href = `mailto:${settings.store_email}`);
    }

    // 5. Update text content for data attributes
    document.querySelectorAll("[data-store-phone]").forEach(el => el.textContent = settings.store_phone || "");
    document.querySelectorAll("[data-store-email]").forEach(el => el.textContent = settings.store_email || "");
    document.querySelectorAll("[data-store-address]").forEach(el => el.textContent = settings.store_address || "");
    document.querySelectorAll("[data-store-name]").forEach(el => el.textContent = settings.store_name || "Velora");
    document.querySelectorAll("[data-store-instagram]").forEach(el => {
      if (settings.instagram_url) {
        const handle = settings.instagram_url.replace(/\/$/, "").split("/").pop();
        el.textContent = handle ? `@${handle}` : "@velora.dz";
      } else {
        el.textContent = "@velora.dz";
      }
    });
    if (settings.free_threshold) {
      const formattedThreshold = typeof formatPrice === "function" ? formatPrice(settings.free_threshold) : `${settings.free_threshold} DA`;
      document.querySelectorAll("[data-store-free-threshold]").forEach(el => el.textContent = formattedThreshold);
    }

    // 6. Footer copyright
    const copyrightEl = document.querySelector(".footer-bottom p");
    if (copyrightEl) {
      const storeName = settings.store_name || "Velora";
      copyrightEl.innerHTML = `© ${new Date().getFullYear()} ${escapeHTML(storeName)}. Tous droits réservés.`;
    }

  } catch {
    // Non-critical — silently ignore
  }
}


// ── Initialize Velora ──

async function initVelora() {
  await loadCurrentUser();
  await loadDynamicSettings();
  await buildHeader();
  await buildFooter();
  checkRoleAccess();

  // Global click delegation
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-logout]")) {
      showLogoutModal();
    }

    if (event.target.closest("[data-confirm-logout]")) {
      performLogout();
    }
  });

  // Dispatch auth-ready event for page scripts
  document.dispatchEvent(new CustomEvent("velora:auth-ready", {
    detail: { user: window.currentUser, settings: window.veloraSettings }
  }));

  return window.currentUser;
}

document.addEventListener("DOMContentLoaded", () => {
  window.veloraAuthReady = initVelora();
});


// ── Wait for auth to finish before page logic runs ──

function waitForSession() {
  return window.veloraAuthReady || Promise.resolve(window.currentUser);
}
