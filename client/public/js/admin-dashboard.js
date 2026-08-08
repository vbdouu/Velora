// ============================================================
// ADMIN-DASHBOARD.JS — Complete admin dashboard logic
// Handles: Statistics, Orders, Products, Categories, Clients,
// Settings (via API), Admin Management, CSV Exports,
// Server-side sorting, pagination, and filtering.
// Velora Jewelry Boutique — 2026
// ============================================================

// ── State ──

let allCategories = [];
let pendingUserId = null;

// Pagination / sort state per tab
const tabState = {
  orders: { page: 1, pageSize: 25, sortBy: "date", sortDir: "desc", status: "", search: "" },
  products: { page: 1, pageSize: 25, sortBy: "created_at", sortDir: "desc", category: "", stock: "", search: "" },
  users: { page: 1, pageSize: 25, sortBy: "created_at", sortDir: "desc", status: "", search: "" },
  messages: { page: 1, pageSize: 25, status: "all", search: "" }
};

// ── Tab navigation ──

function switchTab(tabName) {
  document.querySelectorAll(".admin-tab").forEach(tab => {
    tab.style.display = "none";
  });
  document.querySelectorAll(".admin-nav-link[data-tab]").forEach(link => {
    link.classList.toggle("active", link.dataset.tab === tabName);
  });

  const target = document.getElementById(`tab-${tabName}`);
  if (target) target.style.display = "block";

  // Load data on first visit / tab switch
  if (tabName === "orders") loadOrders();
  if (tabName === "products") loadProducts();
  if (tabName === "categories") loadCategories();
  if (tabName === "users") loadUsers();
  if (tabName === "messages") loadAdminMessages();
  if (tabName === "settings") loadSettingsValues();
  if (tabName === "admins") loadAdmins();
}

function setupTabNavigation() {
  document.querySelectorAll(".admin-nav-link[data-tab]").forEach(btn => {
    btn.addEventListener("click", () => switchTab(btn.dataset.tab));
  });
}

// ── Pagination helper ──

// Single authoritative renderPagination (tab-aware)
function renderPagination(containerId, state, totalPages, total) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const tabName = containerId.replace("-pagination", "");
  const fnMap = { orders: "loadOrders", products: "loadProducts", users: "loadUsers", messages: "loadAdminMessages" };
  const fn = fnMap[tabName] || "loadOrders";

  if (totalPages <= 1) {
    container.innerHTML = total > 0 ? `<span class="pagination-info">${total} résultat(s)</span>` : "";
    return;
  }

  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= state.page - 1 && i <= state.page + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "...") {
      pages.push("...");
    }
  }

  container.innerHTML = `
    <span class="pagination-info">${total} résultat(s) · Page ${state.page} / ${totalPages}</span>
    <div class="pagination-buttons">
      <button class="btn outline small" ${state.page <= 1 ? "disabled" : ""} onclick="${fn}(${state.page - 1})">←</button>
      ${pages.map(p => p === "..." ? `<span class="pagination-dots">…</span>` : `<button class="btn ${p === state.page ? "primary" : "outline"} small" onclick="${fn}(${p})">${p}</button>`).join("")}
      <button class="btn outline small" ${state.page >= totalPages ? "disabled" : ""} onclick="${fn}(${state.page + 1})">→</button>
    </div>
  `;
}

// ── Sortable columns ──

function setupSortableHeaders(tableSelector, state, loadFn) {
  document.querySelectorAll(`${tableSelector} th.sortable`).forEach(th => {
    th.addEventListener("click", () => {
      const col = th.dataset.sort;
      if (state.sortBy === col) {
        state.sortDir = state.sortDir === "asc" ? "desc" : "asc";
      } else {
        state.sortBy = col;
        state.sortDir = "desc";
      }
      state.page = 1;
      loadFn();

      // Update arrows
      document.querySelectorAll(`${tableSelector} th.sortable`).forEach(h => {
        h.classList.remove("sort-asc", "sort-desc");
      });
      th.classList.add(state.sortDir === "asc" ? "sort-asc" : "sort-desc");
    });
  });
}

// ── Dashboard Overview ──

async function loadDashboard(isUserClick = false) {
  const refreshBtn = document.getElementById("btn-refresh-dashboard");
  const icon = refreshBtn?.querySelector(".refresh-icon");
  const textEl = refreshBtn?.querySelector(".refresh-btn-text");

  if (isUserClick && refreshBtn) {
    refreshBtn.disabled = true;
    if (icon) icon.style.animation = "spin 0.8s linear infinite";
    if (textEl) textEl.textContent = "Actualisation...";
  }

  try {
    const fetchPromise = apiRequest("/api/admin/stats");
    const delayPromise = isUserClick ? new Promise(r => setTimeout(r, 1000)) : Promise.resolve();
    const [data] = await Promise.all([fetchPromise, delayPromise]);

    renderKPIs(data.statistics);
    renderRecentOrders(data.statistics.recentOrders);
    renderBestSellers(data.statistics.bestSellers);
    renderLowStock(data.statistics.lowStockProducts);

    if (window.currentUser) {
      const nameEl = document.getElementById("admin-name");
      const avatarEl = document.getElementById("admin-avatar-letter");
      const roleEl = document.getElementById("admin-role-label");
      if (nameEl) nameEl.textContent = window.currentUser.firstName || "Admin";
      if (avatarEl) avatarEl.textContent = (window.currentUser.firstName || "A")[0].toUpperCase();
      if (roleEl) {
        const isMale = window.currentUser?.gender === "male" || window.currentUser?.gender === "M" || window.currentUser?.gender === "homme";
        roleEl.textContent = isMale ? "Administrateur" : "Administratrice";
      }
    }

    const pendingCount = data.statistics.pendingOrders;
    const badge = document.getElementById("badge-pending");
    if (badge) {
      badge.textContent = pendingCount;
      badge.style.display = pendingCount > 0 ? "inline-flex" : "none";
    }

    if (isUserClick) {
      showToast("Données de l'activité actualisées avec succès.");
    }

  } catch (error) {
    const kpiGrid = document.getElementById("kpi-grid");
    if (kpiGrid) kpiGrid.innerHTML = `<div class="empty-state">Impossible de charger les statistiques. ${escapeHTML(error.message)}</div>`;
    if (isUserClick) showToast("Erreur lors de l'actualisation.", "error");
  } finally {
    if (refreshBtn) {
      refreshBtn.disabled = false;
      if (icon) icon.style.animation = "";
      if (textEl) textEl.textContent = "Actualiser";
    }
  }
}

function renderKPIs(stats) {
  const grid = document.getElementById("kpi-grid");
  if (!grid) return;

  const currentYear = new Date().getFullYear();
  const startYear = 2026;
  let yearOptionsHtml = "";
  for (let y = currentYear; y >= startYear; y--) {
    yearOptionsHtml += `<option value="year_${y}">Année ${y}</option>`;
  }

  // Pre-calculate status counts
  const statusCounts = {
    pending: Number(stats.pendingOrders || 0),
    confirmed: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    all: Number(stats.totalOrders || 0)
  };

  if (Array.isArray(stats.ordersByStatus)) {
    stats.ordersByStatus.forEach(item => {
      const st = String(item.status || "").toLowerCase();
      const count = Number(item.total || 0);
      if (st && statusCounts[st] !== undefined) {
        statusCounts[st] = count;
      }
    });
  }

  // Pre-calculate period counts
  const periodStats = stats.ordersByPeriod || {};
  const revenueStats = stats.revenueByPeriod || {};

  grid.innerHTML = `
    <!-- Card 1: Chiffre d'affaires -->
    <div class="kpi-card">
      <div class="kpi-header-row">
        <div class="kpi-label" style="margin-bottom:0;">Chiffre d'Affaires</div>
        <select id="kpi-revenue-select" style="font-size:0.75rem;padding:4px 8px;border-radius:6px;border:1px solid var(--line);background:#fff;cursor:pointer;color:var(--charcoal);">
          <option value="month">Ce mois-ci</option>
          <option value="year">Cette année (${currentYear})</option>
          <option value="all">Total global</option>
        </select>
      </div>
      <div id="kpi-revenue-val" class="kpi-value">${formatPrice(revenueStats.month !== undefined ? revenueStats.month : stats.monthlyRevenue)}</div>
      <div id="kpi-revenue-sub" class="kpi-sub">
        <span>Commandes confirmées &amp; livrées</span>
      </div>
    </div>

    <!-- Card 2: Commandes par période (Dynamique) -->
    <div class="kpi-card">
      <div class="kpi-header-row">
        <div class="kpi-label" style="margin-bottom:0;">Commandes</div>
        <select id="kpi-period-select" style="font-size:0.75rem;padding:4px 8px;border-radius:6px;border:1px solid var(--line);background:#fff;cursor:pointer;color:var(--charcoal);">
          <option value="today">Aujourd'hui</option>
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois-ci</option>
          <option value="3months">3 derniers mois</option>
          ${yearOptionsHtml}
          <option value="all">Tout l'historique</option>
        </select>
      </div>
      <div id="kpi-period-val" class="kpi-value">${periodStats.today !== undefined ? periodStats.today : stats.todayOrders}</div>
      <div id="kpi-period-sub" class="kpi-sub">Nouvelles commandes aujourd'hui</div>
    </div>

    <!-- Card 3: Commandes par statut (Dynamique) -->
    <div class="kpi-card" id="kpi-status-card">
      <div class="kpi-header-row">
        <div class="kpi-label" style="margin-bottom:0;">Par Statut</div>
        <select id="kpi-status-select" style="font-size:0.75rem;padding:4px 8px;border-radius:6px;border:1px solid var(--line);background:#fff;cursor:pointer;color:var(--charcoal);">
          <option value="pending">En attente</option>
          <option value="confirmed">Confirmées</option>
          <option value="shipped">Expédiées</option>
          <option value="delivered">Livrées</option>
          <option value="cancelled">Annulées</option>
          <option value="all">Tous les statuts</option>
        </select>
      </div>
      <div id="kpi-status-val" class="kpi-value">${statusCounts.pending}</div>
      <div id="kpi-status-sub" class="kpi-sub">${statusCounts.pending > 0 ? " À traiter en priorité" : "Aucune commande en attente"}</div>
    </div>

    <!-- Card 4: Base & Catalogue (Dynamique) -->
    <div class="kpi-card">
      <div class="kpi-header-row">
        <div class="kpi-label" style="margin-bottom:0;">Base &amp; Catalogue</div>
        <select id="kpi-catalog-select" style="font-size:0.75rem;padding:4px 8px;border-radius:6px;border:1px solid var(--line);background:#fff;cursor:pointer;color:var(--charcoal);">
          <option value="clients">Clients inscrits</option>
          <option value="products">Bijoux en vente</option>
          <option value="categories">Catégories</option>
        </select>
      </div>
      <div id="kpi-catalog-val" class="kpi-value">${stats.totalUsers}</div>
      <div id="kpi-catalog-sub" class="kpi-sub">Comptes clients enregistrés dans la base</div>
    </div>
  `;

  // Attach interactive change listeners
  const revSelect = document.getElementById("kpi-revenue-select");
  if (revSelect) {
    revSelect.addEventListener("change", (e) => {
      const val = e.target.value;
      const revVal = document.getElementById("kpi-revenue-val");
      const revSub = document.getElementById("kpi-revenue-sub");
      if (val === "month") {
        if (revVal) revVal.textContent = formatPrice(revenueStats.month !== undefined ? revenueStats.month : stats.monthlyRevenue);
        if (revSub) revSub.textContent = "Commandes confirmées ce mois-ci";
      } else if (val === "year") {
        if (revVal) revVal.textContent = formatPrice(revenueStats.year !== undefined ? revenueStats.year : stats.revenue);
        if (revSub) revSub.textContent = `Commandes confirmées en ${currentYear}`;
      } else {
        if (revVal) revVal.textContent = formatPrice(revenueStats.all !== undefined ? revenueStats.all : stats.revenue);
        if (revSub) revSub.textContent = "Total des ventes depuis l'ouverture";
      }
    });
  }

  const periodSelect = document.getElementById("kpi-period-select");
  if (periodSelect) {
    periodSelect.addEventListener("change", (e) => {
      const val = e.target.value;
      const periodVal = document.getElementById("kpi-period-val");
      const periodSub = document.getElementById("kpi-period-sub");

      const periodLabels = {
        today: "Commandes reçues aujourd'hui",
        week: "Commandes reçues cette semaine",
        month: "Commandes reçues ce mois-ci",
        "3months": "Commandes des 3 derniers mois",
        all: "Total de toutes les commandes"
      };

      if (val.startsWith("year_")) {
        const selectedYear = val.replace("year_", "");
        const yearCount = (periodStats.years && periodStats.years[selectedYear]) !== undefined ? periodStats.years[selectedYear] : 0;
        if (periodVal) periodVal.textContent = yearCount;
        if (periodSub) periodSub.textContent = `Commandes enregistrées en ${selectedYear}`;
      } else {
        const count = periodStats[val] !== undefined ? periodStats[val] : (val === "today" ? stats.todayOrders : stats.totalOrders);
        if (periodVal) periodVal.textContent = count;
        if (periodSub) periodSub.textContent = periodLabels[val] || "Commandes pour cette période";
      }
    });
  }

  const statusSelect = document.getElementById("kpi-status-select");
  if (statusSelect) {
    statusSelect.addEventListener("change", (e) => {
      const val = e.target.value;
      const statusVal = document.getElementById("kpi-status-val");
      const statusSub = document.getElementById("kpi-status-sub");
      const statusCard = document.getElementById("kpi-status-card");

      const count = statusCounts[val] !== undefined ? statusCounts[val] : 0;
      if (statusVal) statusVal.textContent = count;

      const statusLabels = {
        pending: count > 0 ? " À traiter en priorité" : "Aucune commande en attente",
        confirmed: "Commandes validées en préparation",
        shipped: "Commandes en cours d'acheminement",
        delivered: "Commandes livrées avec succès",
        cancelled: "Commandes annulées",
        all: "Cumul de tous les statuts"
      };

      if (statusSub) statusSub.textContent = statusLabels[val] || "";
      if (statusCard) {
        statusCard.classList.toggle("kpi-alert", val === "pending" && count > 0);
      }
    });
  }

  const catalogSelect = document.getElementById("kpi-catalog-select");
  if (catalogSelect) {
    catalogSelect.addEventListener("change", (e) => {
      const val = e.target.value;
      const catVal = document.getElementById("kpi-catalog-val");
      const catSub = document.getElementById("kpi-catalog-sub");

      if (val === "clients") {
        if (catVal) catVal.textContent = stats.totalUsers;
        if (catSub) catSub.textContent = "Comptes clients enregistrés dans la base";
      } else if (val === "products") {
        if (catVal) catVal.textContent = stats.totalProducts;
        if (catSub) catSub.textContent = "Bijoux actifs en vente dans la boutique";
      } else {
        if (catVal) catVal.textContent = stats.totalCategories;
        if (catSub) catSub.textContent = "Catégories de bijoux configurées";
      }
    });
  }
}

function renderRecentOrders(orders) {
  const tbody = document.getElementById("overview-recent-orders");
  if (!tbody) return;

  if (!orders || orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="4" class="empty-state">Aucune commande récente.</td></tr>`;
    return;
  }

  tbody.innerHTML = orders.map(o => `
    <tr>
      <td>
        <button class="btn-link" onclick="openOrderModal(${o.id})" style="font-weight:400;font-size:0.82rem;color:var(--charcoal);background:none;border:none;cursor:pointer;text-decoration:underline;text-underline-offset:2px;">
          #${o.id}
        </button>
      </td>
      <td style="font-size:0.82rem;">${escapeHTML(o.first_name)} ${escapeHTML(o.last_name)}</td>
      <td style="font-size:0.82rem;">${formatPrice(o.total)}</td>
      <td>${statusBadge(o.status)}</td>
    </tr>
  `).join("");
}

function renderBestSellers(products) {
  const container = document.getElementById("overview-best-sellers");
  if (!container) return;

  if (!products || products.length === 0) {
    container.innerHTML = `<div class="empty-state">Pas encore de ventes enregistrées.</div>`;
    return;
  }

  container.innerHTML = products.map((p, i) => {
    const sold = Number(p.total_sold) || 0;
    const rankNum = String(i + 1).padStart(2, "0");
    return `
      <div class="best-seller-item" style="display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid var(--line-light);">
        <span style="font-family:var(--font-display);font-size:1.15rem;font-weight:400;color:var(--gold);min-width:24px;">${rankNum}</span>
        <img src="${escapeHTML(p.image || "/images/defaults/product.svg")}" alt="${escapeHTML(p.name)}" style="width:42px;height:52px;object-fit:cover;background:var(--cream);border:1px solid var(--line-light);" onerror="this.src='/images/defaults/product.svg'">
        <div style="flex:1;min-width:0;">
          <a href="/product.html?id=${p.id}" target="_blank" style="font-family:var(--font-body);font-size:0.85rem;font-weight:400;color:var(--ink);text-decoration:none;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
            ${escapeHTML(p.name)}
          </a>
          <div style="font-size:0.75rem;color:var(--muted);margin-top:3px;display:flex;align-items:center;gap:8px;">
            <span>${formatPrice(p.price)}</span>
            <span style="color:var(--line);">•</span>
            <span style="color:var(--gold-muted);font-weight:500;">${sold} ${sold > 1 ? "ventes" : "vente"}</span>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function renderLowStock(products) {
  const panel = document.getElementById("low-stock-panel");
  const tbody = document.getElementById("low-stock-table");
  if (!panel || !tbody) return;

  if (!products || products.length === 0) {
    panel.style.display = "none";
    return;
  }

  panel.style.display = "block";

  tbody.innerHTML = products.map(p => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px;">
          <img src="${escapeHTML(p.image || "/images/defaults/product.svg")}" style="width:36px;height:46px;object-fit:cover;background:var(--cream);" onerror="this.src='/images/defaults/product.svg'" alt="">
          <span style="font-size:0.875rem;color:var(--charcoal);">${escapeHTML(p.name)}</span>
        </div>
      </td>
      <td>
        <span style="color:${p.stock === 0 ? "var(--danger)" : "var(--warning)"};font-weight:500;font-size:0.875rem;">
          ${p.stock === 0 ? "Rupture de stock" : `${p.stock} restant(s)`}
        </span>
      </td>
      <td>
        <button class="btn outline small" onclick="switchTab('products')" type="button">Gérer</button>
      </td>
    </tr>
  `).join("");
}

// ── Orders (server-side) ──

async function loadOrders(page) {
  const s = tabState.orders;
  if (page) s.page = page;
  const tbody = document.getElementById("table-orders");
  if (!tbody) return;

  try {
    const params = new URLSearchParams({
      page: s.page,
      pageSize: s.pageSize,
      sortBy: s.sortBy,
      sortDir: s.sortDir
    });
    if (s.status) params.set("status", s.status);
    if (s.search) params.set("search", s.search);

    const data = await apiRequest(`/api/admin/orders?${params}`);
    const orders = data.orders || [];

    const label = document.getElementById("orders-count-label");
    if (label) label.textContent = `${data.total} commande(s) au total`;

    if (orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7">${emptyState("Aucune commande trouvée.")}</td></tr>`;
    } else {
      tbody.innerHTML = orders.map(o => `
        <tr>
          <td style="font-weight:500;">#${o.id}</td>
          <td>
            <div style="font-size:0.875rem;color:var(--charcoal);">${escapeHTML(o.first_name)} ${escapeHTML(o.last_name)}</div>
            <div style="font-size:0.72rem;color:var(--muted);margin-top:2px;">${escapeHTML(o.email || "")}</div>
          </td>
          <td style="font-size:0.875rem;">${escapeHTML(o.shipping_city || "—")}</td>
          <td style="font-size:0.82rem;color:var(--muted);">${formatDate(o.created_at)}</td>
          <td style="font-weight:500;">${formatPrice(o.total)}</td>
          <td>${statusBadge(o.status)}</td>
          <td style="text-align:right;">
            <button class="btn outline small" onclick="openOrderModal(${o.id})" type="button">Voir</button>
          </td>
        </tr>
      `).join("");
    }

    renderPagination("orders-pagination", s, data.totalPages, data.total);

  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="7">${emptyState("Erreur : " + error.message)}</td></tr>`;
  }
}


// ── Order Detail Modal ──

async function openOrderModal(orderId) {
  const modal = document.getElementById("order-detail-modal");
  const body = document.getElementById("order-detail-modal-body");
  const title = document.getElementById("order-detail-modal-title");

  if (!modal || !body) return;

  if (title) title.textContent = `Commande #${orderId}`;
  body.innerHTML = `<div class="loading-state">Chargement des détails...</div>`;
  openModal("order-detail-modal");

  try {
    const data = await apiRequest(`/api/admin/orders/${orderId}`);
    const order = data.order;
    const items = data.items || [];

    body.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:20px;padding-bottom:16px;border-bottom:1px solid var(--line);">
        <div>
          <div style="font-size:0.78rem;color:var(--muted);text-transform:uppercase;letter-spacing:0.05em;">Client</div>
          <div style="font-size:1.05rem;font-weight:500;color:var(--charcoal);margin-top:2px;">${escapeHTML(order.first_name || "")} ${escapeHTML(order.last_name || "")}</div>
          <div style="font-size:0.85rem;color:var(--muted);">${escapeHTML(order.email || "")}</div>
          <div style="font-size:0.85rem;color:var(--charcoal);margin-top:2px;">📞 ${escapeHTML(order.shipping_phone || order.phone || "—")}</div>
        </div>

        <div>
          <div style="font-size:0.78rem;color:var(--muted);text-transform:uppercase;letter-spacing:0.05em;">Livraison</div>
          <div style="font-size:0.875rem;color:var(--charcoal);margin-top:2px;max-width:280px;">${escapeHTML(order.shipping_address || "—")}</div>
          <div style="font-size:0.85rem;font-weight:500;color:var(--charcoal);">${escapeHTML(order.shipping_city || "")}</div>
          <div style="font-size:0.78rem;color:var(--muted);margin-top:2px;">Frais de livraison : ${order.shipping_fee > 0 ? formatPrice(order.shipping_fee) : "Gratuit"}</div>
        </div>

        <div>
          <div style="font-size:0.78rem;color:var(--muted);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:6px;">Changer le statut</div>
          <select class="admin-select" style="font-size:0.82rem;padding:6px 12px;" onchange="updateOrderModalStatus(${order.id}, this.value)">
            <option value="pending" ${order.status === "pending" ? "selected" : ""}>En attente</option>
            <option value="confirmed" ${order.status === "confirmed" ? "selected" : ""}>Confirmée</option>
            <option value="shipped" ${order.status === "shipped" ? "selected" : ""}>Expédiée</option>
            <option value="delivered" ${order.status === "delivered" ? "selected" : ""}>Livrée</option>
            <option value="cancelled" ${order.status === "cancelled" ? "selected" : ""}>Annulée</option>
          </select>
        </div>
      </div>

      <div style="margin-bottom:20px;">
        <h4 style="font-size:0.875rem;font-weight:600;margin-bottom:10px;">Articles commandés (${items.length})</h4>
        <div class="data-table-wrap" style="max-height:220px;overflow-y:auto;">
          <table class="data-table" style="font-size:0.82rem;">
            <thead>
              <tr>
                <th>Bijou</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th style="text-align:right;">Sous-total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td>
                    <div style="display:flex;align-items:center;gap:10px;">
                      <img src="${escapeHTML(item.image || "/images/defaults/product.svg")}" style="width:36px;height:44px;object-fit:cover;background:var(--cream);" onerror="this.src='/images/defaults/product.svg'">
                      <div>
                        <div style="font-weight:500;color:var(--charcoal);">${escapeHTML(item.product_name)}</div>
                        <div style="font-size:0.72rem;color:var(--muted);">${escapeHTML(item.category_name || "")}</div>
                      </div>
                    </div>
                  </td>
                  <td style="text-align:center;">${item.quantity}</td>
                  <td>${formatPrice(item.unit_price)}</td>
                  <td style="text-align:right;font-weight:500;">${formatPrice(item.unit_price * item.quantity)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
        <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:12px;font-size:0.95rem;font-weight:600;color:var(--charcoal);">
          <span>Total de la commande :</span>
          <span>${formatPrice(order.total)}</span>
        </div>
      </div>

      ${order.notes ? `
        <div style="margin-bottom:16px;padding:12px;background:var(--surface);border-radius:4px;font-size:0.82rem;">
          <strong style="color:var(--charcoal);">Note du client :</strong>
          <p style="margin:4px 0 0 0;color:var(--text);">${escapeHTML(order.notes)}</p>
        </div>
      ` : ""}

      <div style="margin-top:16px;padding-top:16px;border-top:1px solid var(--line);">
        <label class="form-label" for="order-admin-notes" style="font-size:0.82rem;">Notes internes d'administration</label>
        <div style="display:flex;gap:8px;margin-top:6px;">
          <input class="form-input" type="text" id="order-admin-notes" value="${escapeHTML(order.admin_notes || "")}" placeholder="Ex: Client contacté par téléphone, colis expédié...">
          <button class="btn primary small" type="button" onclick="saveOrderAdminNotes(${order.id})">Enregistrer</button>
        </div>
      </div>
    `;

  } catch (error) {
    body.innerHTML = emptyState("Erreur lors du chargement de la commande : " + error.message);
  }
}

async function updateOrderModalStatus(orderId, status) {
  try {
    await apiRequest(`/api/admin/orders/${orderId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status })
    });
    showToast("Statut de la commande mis à jour.");
    loadOrders();
    loadDashboard();
  } catch (error) {
    showToast(error.message, "error");
  }
}

async function saveOrderAdminNotes(orderId) {
  const notes = document.getElementById("order-admin-notes")?.value.trim();
  try {
    await apiRequest(`/api/admin/orders/${orderId}/notes`, {
      method: "PUT",
      body: JSON.stringify({ notes })
    });
    showToast("Notes d'administration enregistrées.");
  } catch (error) {
    showToast(error.message, "error");
  }
}

// ── End Order Detail Modal ──

function setupOrdersFilters() {
  const statusSel = document.getElementById("orders-filter-status");
  const searchInput = document.getElementById("orders-search");
  const pageSizeSel = document.getElementById("orders-page-size");

  let debounce;

  statusSel?.addEventListener("change", () => {
    tabState.orders.status = statusSel.value;
    tabState.orders.page = 1;
    loadOrders();
  });

  searchInput?.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      tabState.orders.search = searchInput.value.trim();
      tabState.orders.page = 1;
      loadOrders();
    }, 350);
  });

  pageSizeSel?.addEventListener("change", () => {
    tabState.orders.pageSize = parseInt(pageSizeSel.value);
    tabState.orders.page = 1;
    loadOrders();
  });
}

// ── Products (server-side) ──

async function loadProducts(page) {
  const s = tabState.products;
  if (page) s.page = page;
  const tbody = document.getElementById("table-products");
  if (!tbody) return;

  try {
    // Also load categories for filter dropdown
    if (allCategories.length === 0) {
      const catRes = await apiRequest("/api/categories");
      allCategories = catRes.categories || [];
      populateProductCategorySelect();
      populateProductFilterCategory();
    }

    const params = new URLSearchParams({
      page: s.page,
      pageSize: s.pageSize,
      sortBy: s.sortBy,
      sortDir: s.sortDir,
      admin: "true"
    });
    if (s.category) params.set("categoryId", s.category);
    if (s.stock) params.set("stockStatus", s.stock);
    if (s.search) params.set("search", s.search);

    const data = await apiRequest(`/api/products?${params}`);
    const products = data.products || [];

    const label = document.getElementById("products-count-label");
    if (label) label.textContent = `${data.total} produit(s) au total`;

    if (products.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8">${emptyState("Aucun produit dans le catalogue.")}</td></tr>`;
    } else {
      tbody.innerHTML = products.map(p => `
        <tr ${!p.is_visible ? 'style="opacity:0.55;"' : ""}>
          <td>
            <img src="${escapeHTML(p.image || "/images/defaults/product.svg")}" class="data-table-image" alt="${escapeHTML(p.name)}" onerror="this.src='/images/defaults/product.svg'">
          </td>
          <td>
            <div class="data-table-product-name">${escapeHTML(p.name)}</div>
          </td>
          <td style="font-size:0.82rem;color:var(--muted);">${escapeHTML(p.category_name || "—")}</td>
          <td style="font-weight:500;">${formatPrice(p.price)}</td>
          <td>
            <span style="color:${p.stock === 0 ? "var(--danger)" : p.stock <= 5 ? "var(--warning)" : "var(--success)"}; font-size:0.875rem;">
              ${p.stock === 0 ? "Rupture" : p.stock}
            </span>
          </td>
          <td style="text-align:center;">
            ${p.is_featured ? `<span style="color:var(--gold);">★</span>` : `<span style="color:var(--warm-gray);">—</span>`}
          </td>
          <td style="text-align:center;">
            ${p.is_visible
          ? `<span style="color:var(--success);font-size:0.72rem;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;">Oui</span>`
          : `<span style="color:var(--muted);font-size:0.72rem;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;">Non</span>`
        }
          </td>
          <td style="text-align:right;">
            <div style="display:inline-flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;">
              <button class="btn outline small" onclick="openProductModal(${p.id})" type="button">Modifier</button>
              <button class="btn danger small" onclick="deleteProduct(${p.id}, '${escapeHTML(p.name.replace(/'/g, "\\\\'"))}')" type="button">Supprimer</button>
            </div>
          </td>
        </tr>
      `).join("");
    }

    renderPagination("products-pagination", s, data.totalPages, data.total);

  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="8">${emptyState("Erreur : " + error.message)}</td></tr>`;
  }
}

function populateProductFilterCategory() {
  const select = document.getElementById("products-filter-category");
  if (!select) return;
  // Keep the first option
  select.innerHTML = `<option value="">Toutes catégories</option>`;
  allCategories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat.id;
    opt.textContent = cat.name;
    select.appendChild(opt);
  });
}

function populateProductCategorySelect() {
  const select = document.getElementById("prod-category");
  if (!select) return;

  const currentVal = select.value;
  select.innerHTML = `<option value="">— Sélectionner une catégorie —</option>`;

  allCategories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat.id;
    opt.textContent = cat.name;
    if (String(cat.id) === String(currentVal)) opt.selected = true;
    select.appendChild(opt);
  });
}

function setupProductsFilters() {
  const catSel = document.getElementById("products-filter-category");
  const stockSel = document.getElementById("products-filter-stock");
  const searchInput = document.getElementById("products-search");
  const pageSizeSel = document.getElementById("products-page-size");

  let debounce;

  catSel?.addEventListener("change", () => {
    tabState.products.category = catSel.value;
    tabState.products.page = 1;
    loadProducts();
  });

  stockSel?.addEventListener("change", () => {
    tabState.products.stock = stockSel.value;
    tabState.products.page = 1;
    loadProducts();
  });

  searchInput?.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      tabState.products.search = searchInput.value.trim();
      tabState.products.page = 1;
      loadProducts();
    }, 350);
  });

  pageSizeSel?.addEventListener("change", () => {
    tabState.products.pageSize = parseInt(pageSizeSel.value);
    tabState.products.page = 1;
    loadProducts();
  });
}

function openProductModal(productId) {
  const form = document.getElementById("product-form");
  const title = document.getElementById("product-modal-title");
  const msgEl = document.getElementById("product-form-messages");

  if (!form) return;

  form.reset();
  document.getElementById("prod-id").value = "";
  document.getElementById("prod-existing-image").value = "";
  document.getElementById("prod-image-preview").style.display = "none";
  document.getElementById("prod-image-filename").textContent = "Choisir une image (JPG, PNG, WEBP)";
  const extraFilename = document.getElementById("prod-extra-images-filename");
  if (extraFilename) extraFilename.textContent = "Ajouter des images supplémentaires (multiple)";
  const extraList = document.getElementById("prod-extra-images-list");
  if (extraList) extraList.innerHTML = "";
  hideAlert(msgEl);

  if (allCategories.length === 0) {
    loadCategoriesForSelect();
  } else {
    populateProductCategorySelect();
  }

  if (!productId) {
    if (title) title.textContent = "Ajouter un bijou";
    document.getElementById("prod-visible").checked = true;
    document.getElementById("prod-featured").checked = false;
    openModal("product-modal");
    return;
  }

  // Edit mode — fetch fresh data
  (async () => {
    try {
      const { product, images } = await apiRequest(`/api/products/${productId}`);
      if (!product) { showToast("Produit introuvable.", "error"); return; }

      if (title) title.textContent = "Modifier le bijou";
      document.getElementById("prod-id").value = product.id;
      document.getElementById("prod-name").value = product.name || "";
      document.getElementById("prod-price").value = product.price || "";
      document.getElementById("prod-stock").value = product.stock || 0;
      document.getElementById("prod-description").value = product.description || "";
      const matEl = document.getElementById("prod-material");
      const colEl = document.getElementById("prod-color");
      const dimEl = document.getElementById("prod-dimensions");
      const careEl = document.getElementById("prod-care-instructions");
      const delEl = document.getElementById("prod-delivery-info");
      const retEl = document.getElementById("prod-return-policy");
      if (matEl) matEl.value = product.material || "";
      if (colEl) colEl.value = product.color || "";
      if (dimEl) dimEl.value = product.dimensions || "";
      if (careEl) careEl.value = product.care_instructions || "";
      if (delEl) delEl.value = product.delivery_info || "";
      if (retEl) retEl.value = product.return_policy || "";
      document.getElementById("prod-featured").checked = !!product.is_featured;
      document.getElementById("prod-visible").checked = !!product.is_visible || product.is_visible === undefined;


      if (product.image) {
        document.getElementById("prod-existing-image").value = product.image;
        document.getElementById("prod-image-preview-img").src = product.image;
        document.getElementById("prod-image-preview").style.display = "block";
      }

      // Render existing extra images with delete buttons
      const listEl = document.getElementById("prod-extra-images-list");
      if (listEl) {
        listEl.innerHTML = "";
        if (images && images.length > 0) {
          images.forEach(img => {
            const wrapper = document.createElement("div");
            wrapper.style.cssText = "position:relative;display:inline-block;";
            wrapper.dataset.imageId = img.id;
            wrapper.innerHTML = `
              <img src="${escapeHTML(img.image_path)}" alt="" style="width:72px;height:72px;object-fit:cover;border-radius:6px;border:1px solid var(--line);" onerror="this.src='/images/defaults/product.svg'">
              <button type="button" onclick="deleteProductExtraImage(${img.id}, ${product.id})" title="Supprimer cette image"
                style="position:absolute;top:2px;right:2px;background:rgba(0,0,0,0.65);color:#fff;border:none;border-radius:50%;width:20px;height:20px;font-size:14px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;">×</button>
            `;
            listEl.appendChild(wrapper);
          });
        }
      }

      populateProductCategorySelect();
      document.getElementById("prod-category").value = product.category_id || "";

      openModal("product-modal");
    } catch (error) {
      showToast("Erreur : " + error.message, "error");
    }
  })();
}

async function loadCategoriesForSelect() {
  try {
    const { categories } = await apiRequest("/api/categories?includeHidden=true");
    allCategories = categories || [];
    populateProductCategorySelect();
    populateProductFilterCategory();
  } catch {
    // ignore
  }
}

function setupProductForm() {
  const form = document.getElementById("product-form");
  const imgInput = document.getElementById("prod-image");
  const removeBtn = document.getElementById("btn-remove-image");
  const extraImgInput = document.getElementById("prod-extra-images");

  if (!form) return;

  imgInput?.addEventListener("change", () => {
    const file = imgInput.files[0];
    if (!file) return;

    const preview = document.getElementById("prod-image-preview");
    const previewImg = document.getElementById("prod-image-preview-img");
    const filename = document.getElementById("prod-image-filename");

    filename.textContent = file.name;

    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
    document.getElementById("prod-existing-image").value = "";
  });

  removeBtn?.addEventListener("click", () => {
    document.getElementById("prod-image").value = "";
    document.getElementById("prod-existing-image").value = "";
    document.getElementById("prod-image-preview").style.display = "none";
    document.getElementById("prod-image-filename").textContent = "Choisir une image (JPG, PNG, WEBP)";
  });

  extraImgInput?.addEventListener("change", () => {
    const count = extraImgInput.files.length;
    const filenameEl = document.getElementById("prod-extra-images-filename");
    if (filenameEl) {
      filenameEl.textContent = count > 0
        ? `${count} image(s) sélectionnée(s)`
        : "Ajouter des images supplémentaires (multiple)";
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const msgEl = document.getElementById("product-form-messages");
    const saveBtn = document.getElementById("btn-save-product");
    const id = document.getElementById("prod-id").value;

    const name = document.getElementById("prod-name").value.trim();
    const price = document.getElementById("prod-price").value;
    const categoryId = document.getElementById("prod-category").value;

    if (!name || !price || !categoryId) {
      showAlert(msgEl, "Veuillez remplir le nom, le prix et la catégorie.", "error");
      return;
    }

    hideAlert(msgEl);
    saveBtn.disabled = true;
    const originalText = saveBtn.textContent;
    saveBtn.textContent = "Enregistrement...";

    try {
      const formData = new FormData(form);
      formData.delete("id");
      formData.delete("extraImages"); // handled separately below

      const url = id ? `/api/admin/products/${id}` : "/api/admin/products";
      const method = id ? "PUT" : "POST";

      const saved = await apiRequest(url, { method, body: formData });
      const productId = id || saved.productId;

      // Upload extra images one by one
      const extraFiles = extraImgInput ? Array.from(extraImgInput.files) : [];
      for (const file of extraFiles) {
        const fd = new FormData();
        fd.append("image", file);
        try {
          await apiRequest(`/api/admin/products/${productId}/images`, { method: "POST", body: fd });
        } catch (imgErr) {
          console.warn("Extra image upload failed:", imgErr.message);
        }
      }

      showToast(id ? "Bijou modifié avec succès." : "Bijou ajouté avec succès.");
      closeModal("product-modal");
      loadProducts();
    } catch (error) {
      showAlert(msgEl, error.message, "error");
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = originalText;
    }
  });
}

async function deleteProductExtraImage(imageId, productId) {
  try {
    await apiRequest(`/api/admin/products/${productId}/images/${imageId}`, { method: "DELETE" });
    // Remove the thumbnail from the DOM
    const wrapper = document.querySelector(`[data-image-id="${imageId}"]`);
    if (wrapper) wrapper.remove();
    showToast("Image supprimée.");
  } catch (error) {
    showToast("Erreur : " + error.message, "error");
  }
}

async function deleteProduct(productId, productName) {
  const confirmed = await showConfirmModal({
    title: "Supprimer le produit",
    message: `Voulez-vous vraiment supprimer "${productName}" ? Cette action est irréversible.`,
    confirmText: "Supprimer",
    cancelText: "Annuler",
    isDanger: true
  });
  if (!confirmed) return;

  try {
    await apiRequest(`/api/admin/products/${productId}`, { method: "DELETE" });
    showToast("Produit supprimé.");
    loadProducts();
  } catch (error) {
    showToast(error.message, "error");
  }
}

// ── Categories ──

async function loadCategories() {
  const grid = document.getElementById("categories-grid");
  if (!grid) return;

  try {
    const { categories } = await apiRequest("/api/categories?includeHidden=true");
    allCategories = categories || [];
    renderCategoriesGrid(allCategories);
  } catch (error) {
    grid.innerHTML = emptyState("Erreur : " + error.message);
  }
}

function renderCategoriesGrid(categories) {
  const grid = document.getElementById("categories-grid");
  if (!grid) return;

  if (!categories || categories.length === 0) {
    grid.innerHTML = `<div class="empty-state">Aucune catégorie créée. Ajoutez votre première catégorie.</div>`;
    return;
  }

  grid.innerHTML = categories.map(cat => {
    const isFooter = cat.show_in_footer === 1 || cat.show_in_footer === '1' || cat.show_in_footer === true;
    const isHidden = cat.is_visible === 0 || cat.is_visible === '0' || cat.is_visible === false;

    return `
      <div class="category-card" ${isHidden ? 'style="opacity:0.65;"' : ''}>
        <img class="category-card-image" src="${escapeHTML(cat.image || "/images/defaults/product.svg")}" alt="${escapeHTML(cat.name)}" onerror="this.src='/images/defaults/product.svg'">
        <div class="category-card-body">
          <div class="category-card-name">${escapeHTML(cat.name)}</div>
          <div class="category-card-count" style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;">
            <span>${cat.total_products || 0} produit(s)</span>
            ${isFooter ? `<span class="badge" style="background:var(--cream-dark,#EFE9DE);color:var(--charcoal,#111);font-size:0.7rem;padding:2px 6px;border-radius:4px;">Footer</span>` : ""}
            ${isHidden ? `<span class="badge muted" style="font-size:0.7rem;padding:2px 6px;">Masquée</span>` : ""}
          </div>
          <div class="category-card-actions">
            <button class="btn outline small" onclick="openCategoryModal(${cat.id})" type="button">Modifier</button>
            <button class="btn danger small" onclick="deleteCategory(${cat.id}, '${escapeHTML(cat.name.replace(/'/g, "\\\\'"))}')" type="button">Supprimer</button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function openCategoryModal(categoryId) {
  const form = document.getElementById("category-form");
  const title = document.getElementById("category-modal-title");
  const msgEl = document.getElementById("category-form-messages");
  const footerToggle = document.getElementById("cat-show-footer");
  const visibleToggle = document.getElementById("cat-visible");

  if (!form) return;

  form.reset();
  document.getElementById("cat-id").value = "";
  document.getElementById("cat-existing-image").value = "";
  document.getElementById("cat-image-filename").textContent = "Choisir une image";
  hideAlert(msgEl);

  if (!categoryId) {
    if (title) title.textContent = "Ajouter une catégorie";
    if (footerToggle) footerToggle.checked = false;
    if (visibleToggle) visibleToggle.checked = true;
    openModal("category-modal");
    return;
  }

  const cat = allCategories.find(c => String(c.id) === String(categoryId));
  if (!cat) {
    showToast("Catégorie introuvable.", "error");
    return;
  }

  if (title) title.textContent = "Modifier la catégorie";
  document.getElementById("cat-id").value = cat.id;
  document.getElementById("cat-name").value = cat.name || "";
  document.getElementById("cat-description").value = cat.description || "";

  if (footerToggle) {
    footerToggle.checked = cat.show_in_footer === 1 || cat.show_in_footer === '1' || cat.show_in_footer === true;
  }
  if (visibleToggle) {
    visibleToggle.checked = cat.is_visible !== 0 && cat.is_visible !== '0' && cat.is_visible !== false;
  }

  if (cat.image) {
    document.getElementById("cat-existing-image").value = cat.image;
    document.getElementById("cat-image-filename").textContent = "Image actuelle conservée";
  }

  openModal("category-modal");
}

function setupCategoryForm() {
  const form = document.getElementById("category-form");
  const imgInput = document.getElementById("cat-image");

  if (!form) return;

  imgInput?.addEventListener("change", () => {
    const file = imgInput.files[0];
    if (file) {
      document.getElementById("cat-image-filename").textContent = file.name;
      document.getElementById("cat-existing-image").value = "";
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const msgEl = document.getElementById("category-form-messages");
    const saveBtn = document.getElementById("btn-save-category");
    const id = document.getElementById("cat-id").value;

    const name = document.getElementById("cat-name").value.trim();

    if (!name) {
      showAlert(msgEl, "Le nom de la catégorie est obligatoire.", "error");
      return;
    }

    hideAlert(msgEl);
    saveBtn.disabled = true;
    const originalText = saveBtn.textContent;
    saveBtn.textContent = "Enregistrement...";

    try {
      const formData = new FormData(form);
      formData.delete("id");
      formData.set("show_in_footer", document.getElementById("cat-show-footer")?.checked ? "1" : "0");
      formData.set("is_visible", document.getElementById("cat-visible")?.checked ? "1" : "0");

      const url = id ? `/api/admin/categories/${id}` : "/api/admin/categories";
      const method = id ? "PUT" : "POST";

      await apiRequest(url, { method, body: formData });

      showToast(id ? "Catégorie modifiée." : "Catégorie créée.");
      closeModal("category-modal");
      allCategories = [];
      loadCategories();
    } catch (error) {
      showAlert(msgEl, error.message, "error");
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = originalText;
    }
  });
}

async function deleteCategory(categoryId, categoryName) {
  const confirmed = await showConfirmModal({
    title: "Supprimer la catégorie",
    message: `Supprimer la catégorie "${categoryName}" ?\nCette action est impossible si la catégorie contient des produits.`,
    confirmText: "Supprimer",
    cancelText: "Annuler",
    isDanger: true
  });
  if (!confirmed) return;

  try {
    await apiRequest(`/api/admin/categories/${categoryId}`, { method: "DELETE" });
    showToast("Catégorie supprimée.");
    allCategories = [];
    loadCategories();
  } catch (error) {
    showToast(error.message, "error");
  }
}

// ── Users (server-side) ──

async function loadUsers(page) {
  const s = tabState.users;
  if (page) s.page = page;
  const tbody = document.getElementById("table-users");
  if (!tbody) return;

  try {
    const params = new URLSearchParams({
      page: s.page,
      pageSize: s.pageSize,
      sortBy: s.sortBy,
      sortDir: s.sortDir
    });
    if (s.status) params.set("status", s.status);
    if (s.search) params.set("search", s.search);

    const data = await apiRequest(`/api/admin/users?${params}`);
    const users = data.users || [];

    const label = document.getElementById("users-count-label");
    if (label) label.textContent = `${data.total} client(s) au total`;

    if (users.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8">${emptyState("Aucun client trouvé.")}</td></tr>`;
    } else {
      tbody.innerHTML = users.map(u => {
        const isActive = u.account_status === "active";
        return `
          <tr>
            <td>
              <div style="font-size:0.875rem;color:var(--charcoal);font-weight:400;">${escapeHTML(u.first_name)} ${escapeHTML(u.last_name)}</div>
            </td>
            <td style="font-size:0.82rem;color:var(--muted);">${escapeHTML(u.email)}</td>
            <td style="font-size:0.82rem;">${escapeHTML(u.phone || "—")}</td>
            <td style="font-size:0.82rem;text-align:center;">${u.order_count || 0}</td>
            <td style="font-size:0.82rem;font-weight:500;">${formatPrice(u.total_spent || 0)}</td>
            <td style="font-size:0.82rem;color:var(--muted);">${formatDate(u.created_at)}</td>
            <td>${statusBadge(u.account_status || "active")}</td>
            <td style="text-align:right;">
              <div style="display:inline-flex;gap:8px;">
                ${isActive
            ? `<button class="btn danger small" onclick="openBlockModal(${u.id})" type="button">Bloquer</button>`
            : `<button class="btn outline small" onclick="unblockUser(${u.id})" type="button">Débloquer</button>`
          }
              </div>
            </td>
          </tr>
        `;
      }).join("");
    }

    renderPagination("users-pagination", s, data.totalPages, data.total);

  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="8">${emptyState("Erreur : " + error.message)}</td></tr>`;
  }
}

function setupUsersFilters() {
  const statusSel = document.getElementById("users-filter-status");
  const searchInput = document.getElementById("users-search");
  const pageSizeSel = document.getElementById("users-page-size");

  let debounce;

  statusSel?.addEventListener("change", () => {
    tabState.users.status = statusSel.value;
    tabState.users.page = 1;
    loadUsers();
  });

  searchInput?.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      tabState.users.search = searchInput.value.trim();
      tabState.users.page = 1;
      loadUsers();
    }, 350);
  });

  pageSizeSel?.addEventListener("change", () => {
    tabState.users.pageSize = parseInt(pageSizeSel.value);
    tabState.users.page = 1;
    loadUsers();
  });
}

function openBlockModal(userId) {
  pendingUserId = userId;
  document.getElementById("block-reason").value = "";
  document.getElementById("block-user-id").value = userId;
  openModal("block-user-modal");
}

async function confirmBlockUser() {
  const userId = document.getElementById("block-user-id").value;
  const reason = document.getElementById("block-reason").value.trim();
  const btn = document.getElementById("btn-confirm-block");

  if (!userId) return;

  const originalText = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Blocage...";

  try {
    await apiRequest(`/api/admin/users/${userId}/block`, {
      method: "PUT",
      body: JSON.stringify({ reason: reason || "Comportement inapproprié." })
    });

    showToast("Client bloqué avec succès.");
    closeModal("block-user-modal");
    loadUsers();
  } catch (error) {
    showToast(error.message, "error");
    btn.disabled = false;
    btn.textContent = originalText;
  }
}

async function unblockUser(userId) {
  const confirmed = await showConfirmModal({
    title: "Débloquer le client",
    message: "Débloquer ce client ? Il pourra à nouveau se connecter et passer des commandes.",
    confirmText: "Débloquer",
    cancelText: "Annuler",
    isDanger: false
  });
  if (!confirmed) return;

  try {
    await apiRequest(`/api/admin/users/${userId}/unblock`, { method: "PUT" });
    showToast("Client débloqué.");
    loadUsers();
  } catch (error) {
    showToast(error.message, "error");
  }
}

// ── Settings (API-backed) ──

let allWilayasList = [];

async function loadSettingsValues() {
  try {
    const { settings, wilayas } = await apiRequest("/api/settings/admin");

    const setVal = (id, val) => { const el = document.getElementById(id); if (el && val !== undefined) el.value = val; };
    setVal("set-store-name", settings.store_name);
    setVal("set-phone", settings.store_phone);
    setVal("set-whatsapp", settings.store_whatsapp);
    setVal("set-email", settings.store_email);
    setVal("set-address", settings.store_address);
    setVal("set-instagram", settings.instagram_url);
    setVal("set-facebook", settings.facebook_url);
    setVal("set-free-threshold", settings.free_threshold);
    setVal("set-announcement", settings.announcement);
    setVal("set-announcement-bg", settings.announcement_bg || "gold");
    
    const btnVal = settings.announcement_btn_text !== undefined ? settings.announcement_btn_text : "Découvrir";
    const btnSelect = document.getElementById("set-announcement-btn-select");
    const btnCustom = document.getElementById("set-announcement-btn-custom");
    const btnCustomWrap = document.getElementById("set-announcement-btn-custom-wrap");
    if (btnSelect) {
      const presets = ["Découvrir", "Profiter de l'offre", "Voir la collection", "Commander maintenant", "En savoir plus", ""];
      if (presets.includes(btnVal)) {
        btnSelect.value = btnVal;
        if (btnCustomWrap) btnCustomWrap.style.display = "none";
        if (btnCustom) btnCustom.value = "";
      } else {
        btnSelect.value = "__custom__";
        if (btnCustomWrap) btnCustomWrap.style.display = "";
        if (btnCustom) btnCustom.value = btnVal;
      }
    }

    const enabledCheckbox = document.getElementById("set-announcement-enabled");
    if (enabledCheckbox) {
      enabledCheckbox.checked = settings.announcement_enabled !== "0" && settings.announcement_enabled !== false;
    }

    updateAnnouncementLivePreview();

    allWilayasList = wilayas || [];
    renderWilayasTable(allWilayasList);

  } catch (e) {
    // ignore
  }
}

function getAnnouncementBtnText() {
  const btnSelect = document.getElementById("set-announcement-btn-select");
  const btnCustom = document.getElementById("set-announcement-btn-custom");
  if (!btnSelect) return "Découvrir";
  if (btnSelect.value === "__custom__") {
    return btnCustom ? btnCustom.value : "";
  }
  return btnSelect.value;
}

function updateAnnouncementLivePreview() {
  const previewBar = document.getElementById("announcement-preview-bar");
  const textInput = document.getElementById("set-announcement");
  const bgSelect = document.getElementById("set-announcement-bg");
  const toggle = document.getElementById("set-announcement-enabled");

  if (!previewBar) return;

  const isEnabled = toggle ? toggle.checked : true;
  if (!isEnabled) {
    previewBar.style.opacity = "0.35";
    previewBar.style.filter = "grayscale(100%)";
  } else {
    previewBar.style.opacity = "1";
    previewBar.style.filter = "none";
  }

  const text = textInput?.value || "Livraison offerte dès 5 000 DA · Paiement à la livraison";
  const bgTheme = bgSelect?.value || "gold";
  const btnText = getAnnouncementBtnText();

  previewBar.className = `announcement-bar announcement-theme-${bgTheme}`;
  const btnHtml = btnText.trim() ? `<a href="#" onclick="return false;" style="margin-left:8px;text-decoration:underline;">${escapeHTML(btnText.trim())}</a>` : "";
  previewBar.innerHTML = `<span>${escapeHTML(text)}</span> ${btnHtml}`;
}

function renderWilayasTable(wilayas) {
  const tbody = document.getElementById("wilayas-table-body");
  if (!tbody) return;

  if (!wilayas || wilayas.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-state">Aucune wilaya configurée.</td></tr>`;
    return;
  }

  tbody.innerHTML = wilayas.map(w => `
    <tr data-wilaya-code="${w.wilaya_code}" data-wilaya-search="${w.wilaya_code} ${escapeHTML(w.wilaya_name.toLowerCase())}">
      <td style="font-weight:600;font-size:0.85rem;">${w.wilaya_code}</td>
      <td style="font-weight:500;">${escapeHTML(w.wilaya_name)}</td>
      <td>
        <input type="number" class="form-input wilaya-home-input" data-code="${w.wilaya_code}" value="${w.home_fee}" min="0" step="50" style="padding:4px 8px;max-width:110px;font-size:0.85rem;">
      </td>
      <td>
        <input type="number" class="form-input wilaya-desk-input" data-code="${w.wilaya_code}" value="${w.desk_fee}" min="0" step="50" style="padding:4px 8px;max-width:110px;font-size:0.85rem;">
      </td>
      <td>
        <label class="toggle-switch small" style="transform:scale(0.85);">
          <input type="checkbox" class="wilaya-active-checkbox" data-code="${w.wilaya_code}" ${w.is_active ? "checked" : ""}>
          <span class="toggle-track"></span>
        </label>
      </td>
    </tr>
  `).join("");
}

async function saveSettings(updates) {
  try {
    await apiRequest("/api/settings/admin", {
      method: "PUT",
      body: JSON.stringify(updates)
    });
    showToast("Paramètres enregistrés avec succès.");
  } catch (e) {
    showToast("Erreur lors de l'enregistrement : " + e.message, "error");
  }
}

function setupSettings() {
  const storeForm = document.getElementById("settings-store-form");
  if (storeForm) {
    storeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      saveSettings({
        settings: {
          store_name: document.getElementById("set-store-name")?.value.trim(),
          store_phone: document.getElementById("set-phone")?.value.trim(),
          store_whatsapp: document.getElementById("set-whatsapp")?.value.trim(),
          store_email: document.getElementById("set-email")?.value.trim(),
          store_address: document.getElementById("set-address")?.value.trim(),
        }
      });
    });
  }

  const socialForm = document.getElementById("settings-social-form");
  if (socialForm) {
    socialForm.addEventListener("submit", (e) => {
      e.preventDefault();
      saveSettings({
        settings: {
          instagram_url: document.getElementById("set-instagram")?.value.trim(),
          facebook_url: document.getElementById("set-facebook")?.value.trim(),
        }
      });
    });
  }

  const setAnnText = document.getElementById("set-announcement");
  const setAnnBg = document.getElementById("set-announcement-bg");
  const setAnnBtnSelect = document.getElementById("set-announcement-btn-select");
  const setAnnBtnCustom = document.getElementById("set-announcement-btn-custom");
  const setAnnBtnCustomWrap = document.getElementById("set-announcement-btn-custom-wrap");
  const setAnnTgl = document.getElementById("set-announcement-enabled");

  setAnnText?.addEventListener("input", updateAnnouncementLivePreview);
  setAnnBg?.addEventListener("change", updateAnnouncementLivePreview);
  setAnnTgl?.addEventListener("change", updateAnnouncementLivePreview);

  setAnnBtnSelect?.addEventListener("change", (e) => {
    if (e.target.value === "__custom__") {
      if (setAnnBtnCustomWrap) setAnnBtnCustomWrap.style.display = "";
      if (setAnnBtnCustom) setAnnBtnCustom.focus();
    } else {
      if (setAnnBtnCustomWrap) setAnnBtnCustomWrap.style.display = "none";
    }
    updateAnnouncementLivePreview();
  });
  setAnnBtnCustom?.addEventListener("input", updateAnnouncementLivePreview);

  const announcementForm = document.getElementById("settings-announcement-form");
  if (announcementForm) {
    announcementForm.addEventListener("submit", (e) => {
      e.preventDefault();
      saveSettings({
        settings: {
          announcement: document.getElementById("set-announcement")?.value.trim(),
          announcement_bg: document.getElementById("set-announcement-bg")?.value,
          announcement_btn_text: getAnnouncementBtnText().trim(),
          announcement_enabled: document.getElementById("set-announcement-enabled")?.checked ? "1" : "0"
        }
      });
    });
  }

  // Wilaya search filter
  const wilayaSearch = document.getElementById("wilaya-search-input");
  wilayaSearch?.addEventListener("input", () => {
    const q = wilayaSearch.value.trim().toLowerCase();
    document.querySelectorAll("#wilayas-table-body tr").forEach(row => {
      const text = row.dataset.wilayaSearch || "";
      row.style.display = text.includes(q) ? "" : "none";
    });
  });

  // Save wilayas table form (includes free_threshold)
  const wilayasForm = document.getElementById("settings-wilayas-form");
  wilayasForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const wilayaUpdates = [];
    document.querySelectorAll("#wilayas-table-body tr").forEach(row => {
      const code = parseInt(row.dataset.wilayaCode);
      const homeFee = parseFloat(row.querySelector(".wilaya-home-input")?.value || 0);
      const deskFee = parseFloat(row.querySelector(".wilaya-desk-input")?.value || 0);
      const isActive = row.querySelector(".wilaya-active-checkbox")?.checked ? 1 : 0;
      if (code) {
        wilayaUpdates.push({ wilaya_code: code, home_fee: homeFee, desk_fee: deskFee, is_active: isActive });
      }
    });

    const freeThresholdVal = document.getElementById("set-free-threshold")?.value;

    saveSettings({
      settings: {
        free_threshold: freeThresholdVal
      },
      wilayas: wilayaUpdates
    });
  });
}


// ── CSV Exports ──

function exportOrders() {
  const s = tabState.orders;
  let url = "/api/admin/export/orders";
  if (s.status) url += `?status=${s.status}`;
  window.open(url, "_blank");
}

function exportUsers() {
  window.open("/api/admin/export/users", "_blank");
}

// ── Contact Messages Management ──

let currentActiveMessage = null;
let cachedMessages = []; // Cache des messages chargés pour viewAdminMessage

async function updateUnreadMessagesBadge(count) {
  const badge = document.getElementById("unread-messages-badge");
  if (!badge) return;
  if (count > 0) {
    badge.textContent = count;
    badge.style.display = "inline-block";
  } else {
    badge.style.display = "none";
  }
}

async function loadAdminMessages(resetPage = false) {
  const state = tabState.messages;
  if (resetPage) state.page = 1;

  const tbody = document.getElementById("messages-table-body");
  if (!tbody) return;

  tbody.innerHTML = `<tr><td colspan="6" class="loading-state">Chargement des messages...</td></tr>`;

  try {
    const params = new URLSearchParams({
      status: state.status || "all",
      search: state.search || "",
      limit: state.pageSize,
      offset: (state.page - 1) * state.pageSize
    });

    const data = await apiRequest(`/api/contact/admin?${params}`);
    const messages = data.messages || [];
    const total = data.total || 0;

    updateUnreadMessagesBadge(data.unreadCount || 0);

    if (messages.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="empty-state">Aucun message de contact trouvé.</td></tr>`;
      renderPagination("messages-pagination", state, Math.ceil(total / state.pageSize), total);
      return;
    }

    cachedMessages = messages; // Mise en cache pour viewAdminMessage
    tbody.innerHTML = messages.map(msg => {
      const isUnread = msg.status === "unread";
      const statusBadgeMarkup = isUnread
        ? `<span class="badge danger">Non lu</span>`
        : (msg.status === "read" ? `<span class="badge success">Lu</span>` : `<span class="badge muted">Archivé</span>`);

      const formattedDate = formatDateTime ? formatDateTime(msg.created_at) : msg.created_at;

      return `
        <tr style="${isUnread ? 'font-weight:600;background:var(--cream);' : ''}">
          <td style="white-space:nowrap;font-size:0.82rem;">${escapeHTML(formattedDate)}</td>
          <td>
            <div style="font-weight:500;">${escapeHTML(msg.name)}</div>
            <div style="font-size:0.78rem;color:var(--muted);">${escapeHTML(msg.email)}</div>
          </td>
          <td style="font-size:0.85rem;">${escapeHTML(msg.phone || "—")}</td>
          <td style="font-size:0.85rem;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
            ${escapeHTML(msg.subject)}
          </td>
          <td>${statusBadgeMarkup}</td>
          <td style="text-align:right;">
            <button class="btn outline small" type="button" onclick="viewAdminMessage(${msg.id})">Lire</button>
            <button class="btn danger outline small" type="button" onclick="deleteAdminMessage(${msg.id})">×</button>
          </td>
        </tr>
      `;
    }).join("");

    renderPagination("messages-pagination", state, Math.ceil(total / state.pageSize), total);

  } catch (error) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state" style="color:var(--danger);">Erreur : ${escapeHTML(error.message)}</td></tr>`;
  }
}

async function viewAdminMessage(id) {
  try {
    // Utiliser le cache local pour éviter un second appel API
    let msg = cachedMessages.find(m => m.id === Number(id));
    if (!msg) {
      // Fallback : charger via API si le message n'est pas en cache
      const data = await apiRequest(`/api/contact/admin/${id}`);
      msg = data.message || null;
    }
    if (!msg) { showToast("Message introuvable.", "error"); return; }

    currentActiveMessage = msg;

    const modalName = document.getElementById("msg-detail-name");
    const modalEmail = document.getElementById("msg-detail-email-link");
    const modalPhone = document.getElementById("msg-detail-phone-link");
    const modalDate = document.getElementById("msg-detail-date");
    const modalSubject = document.getElementById("msg-detail-subject");
    const modalBody = document.getElementById("msg-detail-body");
    const toggleBtn = document.getElementById("btn-toggle-msg-status");
    const deleteBtn = document.getElementById("btn-delete-msg");

    if (modalName) modalName.textContent = msg.name;
    if (modalEmail) {
      modalEmail.textContent = msg.email;
      modalEmail.href = `mailto:${msg.email}`;
    }
    if (modalPhone) {
      modalPhone.textContent = msg.phone;
      modalPhone.href = `tel:${msg.phone}`;
    }
    if (modalDate) modalDate.textContent = formatDateTime(msg.created_at);
    if (modalSubject) modalSubject.textContent = msg.subject;
    if (modalBody) modalBody.textContent = msg.message;

    if (toggleBtn) {
      toggleBtn.textContent = msg.status === "unread" ? "Marquer comme Lu" : "Marquer comme Non lu";
      toggleBtn.onclick = async () => {
        const newStatus = msg.status === "unread" ? "read" : "unread";
        await apiRequest(`/api/contact/admin/${msg.id}/status`, {
          method: "PUT",
          body: JSON.stringify({ status: newStatus })
        });
        closeModal("modal-view-message");
        loadAdminMessages();
      };
    }

    if (deleteBtn) {
      deleteBtn.onclick = () => deleteAdminMessage(msg.id, true);
    }

    openModal("modal-view-message");

    // Automatically mark unread messages as read upon opening
    if (msg.status === "unread") {
      await apiRequest(`/api/contact/admin/${msg.id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: "read" })
      });
      loadAdminMessages();
    }

  } catch (error) {
    showToast("Impossible de charger le message.", "error");
  }
}

async function deleteAdminMessage(id, fromModal = false) {
  const confirmed = await showConfirmModal({
    title: "Supprimer le message",
    message: "Voulez-vous vraiment supprimer ce message ? Cette action est définitive.",
    confirmText: "Oui, supprimer",
    cancelText: "Annuler",
    isDanger: true
  });
  if (!confirmed) return;

  try {
    const res = await apiRequest(`/api/contact/admin/${id}`, { method: "DELETE" });
    showToast("Message supprimé avec succès.");
    if (fromModal) closeModal("modal-view-message");
    updateUnreadMessagesBadge(res.unreadCount || 0);
    loadAdminMessages();
  } catch (error) {
    showToast(error.message, "error");
  }
}

function setupMessagesFilters() {
  const searchInput = document.getElementById("messages-search");
  const statusFilter = document.getElementById("messages-status-filter");

  if (searchInput) {
    let timer;
    searchInput.addEventListener("input", (e) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        tabState.messages.search = e.target.value.trim();
        loadAdminMessages(true);
      }, 300);
    });
  }

  if (statusFilter) {
    statusFilter.addEventListener("change", (e) => {
      tabState.messages.status = e.target.value;
      loadAdminMessages(true);
    });
  }
}

// ── Init ──

document.addEventListener("DOMContentLoaded", async () => {
  await waitForSession();

  if (!window.currentUser || window.currentUser.role !== "admin") {
    window.location.href = "/login.html";
    return;
  }

  setupTabNavigation();
  setupProductForm();
  setupCategoryForm();
  setupOrdersFilters();
  setupProductsFilters();
  setupUsersFilters();
  setupMessagesFilters();
  setupSettings();

  // Sortable headers
  setupSortableHeaders("#tab-orders .data-table", tabState.orders, loadOrders);
  setupSortableHeaders("#tab-products .data-table", tabState.products, loadProducts);
  setupSortableHeaders("#tab-users .data-table", tabState.users, loadUsers);

  // Block confirm button
  const blockBtn = document.getElementById("btn-confirm-block");
  if (blockBtn) blockBtn.addEventListener("click", confirmBlockUser);

  // Load overview (first tab) & unread messages count
  loadDashboard();
  try {
    const msgData = await apiRequest("/api/contact/admin?limit=1");
    if (msgData && msgData.unreadCount !== undefined) {
      updateUnreadMessagesBadge(msgData.unreadCount);
    }
  } catch (e) {
    // Ignore error if non-admin or failed
  }
});
