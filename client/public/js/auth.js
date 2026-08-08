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


// ── Build Header ──

function buildHeader() {
  const target = document.getElementById("site-header");
  if (!target) return;

  const isDashboard = document.body.classList.contains("dashboard-page");
  const user = window.currentUser;

  // Right-side actions
  const rightActions = `
    <a class="header-account" href="${user ? dashboardLink(user.role) : "/login.html"}" aria-label="${user ? "Mon compte" : "Connexion"}">
      ${iconUser()}
    </a>
    <a class="header-wishlist" href="/wishlist.html" aria-label="Liste de souhaits">
      ${iconHeart()}
    </a>
    <a class="header-cart" href="/cart.html" aria-label="Panier">
      ${iconCart()}
      <span class="header-cart-badge" id="cart-badge" style="display:none;">0</span>
    </a>
  `;

  const isAdminPage = document.body.classList.contains("admin-page");
  if (isAdminPage) {
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
          <span class="sidebar-nav-link-arrow">→</span>
        </a>

        <div class="sidebar-nav-divider"></div>
        <span class="sidebar-section-label">Collections</span>
        <a class="sidebar-sub-link" href="/shop.html?category=bagues">Bagues</a>
        <a class="sidebar-sub-link" href="/shop.html?category=colliers">Colliers</a>
        <a class="sidebar-sub-link" href="/shop.html?category=bracelets">Bracelets</a>
        <a class="sidebar-sub-link" href="/shop.html?category=boucles">Boucles d'oreilles</a>
        <a class="sidebar-sub-link" href="/shop.html?category=sets">Parures</a>

        <div class="sidebar-nav-divider"></div>
        <span class="sidebar-section-label">Sélection</span>
        <a class="sidebar-sub-link" href="/shop.html?featured=true">Nouveautés</a>
        <a class="sidebar-sub-link" href="/shop.html">Promotions</a>

        <div class="sidebar-nav-divider"></div>
        <span class="sidebar-section-label">Informations</span>
        <a class="sidebar-sub-link" href="/about.html">À propos</a>
        <a class="sidebar-sub-link" href="/contact.html">Contact</a>
        <a class="sidebar-sub-link" href="/faq.html">FAQ</a>
      </nav>

      <div class="sidebar-panel-foot">
        <a class="sidebar-foot-link" href="/livraison.html">Livraison</a>
        <a class="sidebar-foot-link" href="/retours.html">Retours</a>
        <a class="sidebar-foot-link" href="/confidentialite.html">Confidentialité</a>
        <a class="sidebar-foot-link" href="/conditions.html">Conditions générales</a>
      </div>
    </aside>

    <!-- Search Panel -->
    <div class="search-panel" id="search-panel" role="search" aria-hidden="true">
      <div class="container search-panel-inner">
        <div class="search-input-wrap">
          <span class="search-input-icon">${iconSearch()}</span>
          <input
            type="search"
            class="search-input"
            id="search-input"
            placeholder="Rechercher un bijou..."
            autocomplete="off"
            aria-label="Recherche"
          >
          <button class="search-close-btn" id="btn-close-search" aria-label="Fermer la recherche">
            ${iconClose()}
          </button>
        </div>

        <!-- Default suggestions (shown before typing) -->
        <div class="search-suggestions" id="search-suggestions">
          <div>
            <p class="search-suggestions-col-title">Recherches populaires</p>
            <div class="search-popular-tags">
              <button class="search-tag" data-query="bagues">Bagues</button>
              <button class="search-tag" data-query="colliers">Colliers</button>
              <button class="search-tag" data-query="bracelets">Bracelets</button>
              <button class="search-tag" data-query="boucles">Boucles d'oreilles</button>
              <button class="search-tag" data-query="or">Plaqué or</button>
              <button class="search-tag" data-query="acier">Acier</button>
            </div>
          </div>
          <div>
            <p class="search-suggestions-col-title">Tendances du moment</p>
            <div class="search-popular-products" id="search-popular-products">
              <!-- Loaded dynamically -->
            </div>
          </div>
        </div>

        <!-- Live search results -->
        <div class="search-results-list" id="search-results" style="display:none;"></div>
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


// ── Search Panel ──

function setupSearchPanel() {
  const openBtn   = document.getElementById("btn-open-search");
  const closeBtn  = document.getElementById("btn-close-search");
  const panel     = document.getElementById("search-panel");
  const input     = document.getElementById("search-input");

  if (!panel) return;

  function openSearch() {
    panel.classList.add("open");
    panel.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    setTimeout(() => input?.focus(), 120);
  }

  function closeSearch() {
    panel.classList.remove("open");
    panel.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (input) input.value = "";
    resetSearchResults();
  }

  openBtn?.addEventListener("click", openSearch);
  closeBtn?.addEventListener("click", closeSearch);

  // ESC key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("open")) {
      closeSearch();
    }
  });

  // Popular search tags
  document.querySelectorAll(".search-tag[data-query]").forEach(tag => {
    tag.addEventListener("click", () => {
      const q = tag.dataset.query;
      window.location.href = `/shop.html?search=${encodeURIComponent(q)}`;
    });
  });

  // Live search on input
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
      }, 280);
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
  const results    = document.getElementById("search-results");
  const suggestions = document.getElementById("search-suggestions");
  if (results)    { results.style.display = "none"; results.innerHTML = ""; }
  if (suggestions) suggestions.style.display = "";
}

async function performSearch(query) {
  const resultsEl    = document.getElementById("search-results");
  const suggestionsEl = document.getElementById("search-suggestions");
  if (!resultsEl) return;

  suggestionsEl.style.display = "none";
  resultsEl.style.display = "";
  resultsEl.innerHTML = `<div class="loading-state" style="padding: 24px 0;">Recherche en cours...</div>`;

  try {
    const { products } = await apiRequest(`/api/products?search=${encodeURIComponent(query)}`);

    if (!products || products.length === 0) {
      resultsEl.innerHTML = `<div class="search-no-results">Aucun bijou trouvé pour "${escapeHTML(query)}"</div>`;
      return;
    }

    resultsEl.innerHTML = `
      <p class="search-suggestions-col-title" style="margin-bottom:16px;">${products.length} résultat(s) pour "${escapeHTML(query)}"</p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;">
        ${products.slice(0, 8).map(p => `
          <a class="search-product-item" href="/product.html?id=${p.id}" style="flex-direction:column;align-items:flex-start;gap:8px;">
            <img class="search-product-img" src="${escapeHTML(p.image || "/images/defaults/product.svg")}" alt="${escapeHTML(p.name)}" style="width:100%;height:140px;" onerror="this.src='/images/defaults/product.svg'">
            <div>
              <div class="search-product-name">${escapeHTML(p.name)}</div>
              <div class="search-product-price">${formatPrice(p.price)}</div>
            </div>
          </a>
        `).join("")}
      </div>
      ${products.length > 8 ? `<div style="text-align:center;margin-top:24px;"><a href="/shop.html?search=${encodeURIComponent(query)}" style="font-size:0.85rem;text-decoration:underline;color:var(--gold);">Voir tous les ${products.length} résultats</a></div>` : ""}
    `;
  } catch {
    resultsEl.innerHTML = `<div class="search-no-results">Impossible de charger les résultats. Réessayez.</div>`;
  }
}

async function loadPopularSearchProducts() {
  const container = document.getElementById("search-popular-products");
  if (!container) return;

  try {
    const { products } = await apiRequest("/api/products?limit=4&featured=true");
    if (!products || products.length === 0) {
      container.innerHTML = `<div class="search-product-name" style="color:var(--muted);font-size:0.85rem;">Aucun produit disponible.</div>`;
      return;
    }

    container.innerHTML = products.slice(0, 4).map(p => `
      <a class="search-product-item" href="/product.html?id=${p.id}">
        <img class="search-product-img" src="${escapeHTML(p.image || "/images/defaults/product.svg")}" alt="${escapeHTML(p.name)}" onerror="this.src='/images/defaults/product.svg'">
        <div>
          <div class="search-product-name">${escapeHTML(p.name)}</div>
          <div class="search-product-price">${formatPrice(p.price)}</div>
        </div>
      </a>
    `).join("");
  } catch {
    container.innerHTML = "";
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

function buildFooter() {
  const target = document.getElementById("site-footer");
  if (!target) return;

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
            <div class="footer-social" aria-label="Réseaux sociaux">
              <a class="footer-social-link" href="https://www.instagram.com/" target="_blank" rel="noopener" aria-label="Instagram Velora">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <circle cx="12" cy="12" r="5"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
                </svg>
              </a>
              <a class="footer-social-link" href="https://www.facebook.com/" target="_blank" rel="noopener" aria-label="Facebook Velora">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
              <a class="footer-social-link" href="https://wa.me/" target="_blank" rel="noopener" aria-label="WhatsApp Velora">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Boutique column -->
          <div class="footer-col">
            <h3>Boutique</h3>
            <div class="footer-links">
              <a href="/shop.html">Tous les bijoux</a>
              <a href="/shop.html?category=bagues">Bagues</a>
              <a href="/shop.html?category=colliers">Colliers</a>
              <a href="/shop.html?category=bracelets">Bracelets</a>
              <a href="/shop.html?category=boucles">Boucles d'oreilles</a>
              <a href="/shop.html?featured=true">Nouveautés</a>
            </div>
          </div>

          <!-- Mon compte column -->
          <div class="footer-col">
            <h3>Mon compte</h3>
            <div class="footer-links">
              <a href="/orders.html">Mes commandes</a>
              <a href="/wishlist.html">Mes favoris</a>
              <a href="/profile.html">Mes informations</a>
              <a href="/cart.html">Mon panier</a>
              <a href="/login.html">Connexion</a>
              <a href="/register.html">Créer un compte</a>
            </div>
          </div>

          <!-- Informations column -->
          <div class="footer-col">
            <h3>Informations</h3>
            <div class="footer-links">
              <a href="/about.html">À propos de Velora</a>
              <a href="/contact.html">Contact</a>
              <a href="/faq.html">Questions fréquentes</a>
              <a href="/livraison.html">Livraison</a>
              <a href="/retours.html">Retours</a>
              <a href="/confidentialite.html">Confidentialité</a>
              <a href="/conditions.html">Conditions générales</a>
            </div>
          </div>

        </div>

        <div class="footer-bottom">
          <p class="footer-bottom-text">© 2026 Velora. Tous droits réservés. · <a href="/conditions.html" style="color:inherit;text-decoration:underline;text-underline-offset:2px;opacity:0.7;">Conditions</a></p>
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
          bar.innerHTML = `${escapeHTML(announcementText)} <a href="/shop.html">Découvrir</a>`;
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

    // 4. Update Social links in footer/pages
    if (settings.instagram_url) {
      document.querySelectorAll("a[href*='instagram.com']").forEach(a => a.href = settings.instagram_url);
    }
    if (settings.facebook_url) {
      document.querySelectorAll("a[href*='facebook.com']").forEach(a => a.href = settings.facebook_url);
    }
    if (settings.store_whatsapp) {
      const waNumber = settings.store_whatsapp.replace(/[^0-9]/g, "");
      const waUrl = waNumber ? `https://wa.me/${waNumber}` : settings.store_whatsapp;
      document.querySelectorAll("a[href*='wa.me']").forEach(a => a.href = waUrl);
    }

    // 5. Update contact elements with data attributes
    document.querySelectorAll("[data-store-phone]").forEach(el => el.textContent = settings.store_phone || "");
    document.querySelectorAll("[data-store-email]").forEach(el => el.textContent = settings.store_email || "");
    document.querySelectorAll("[data-store-address]").forEach(el => el.textContent = settings.store_address || "");

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
  buildHeader();
  buildFooter();
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
