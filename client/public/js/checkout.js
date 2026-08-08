let currentCartTotal = 0;
let currentShippingFee = 0;
let wilayasData = [];
let storefrontSettings = {};

async function loadWilayasAndSettings() {
    const select = document.getElementById("shipping_wilaya");
    try {
        const res = await apiRequest("/api/settings");
        storefrontSettings = res.settings || {};
        wilayasData = res.wilayas || [];

        if (select) {
            if (wilayasData.length > 0) {
                select.innerHTML = '<option value="" disabled selected>— Sélectionner votre Wilaya —</option>' + 
                    wilayasData.map(w => `<option value="${w.wilaya_code}" data-home="${w.home_fee}" data-desk="${w.desk_fee}">${w.wilaya_code} - ${escapeHTML(w.wilaya_name)} (${typeof formatPrice === "function" ? formatPrice(w.home_fee) : w.home_fee + " DA"})</option>`).join("");
            } else {
                select.innerHTML = '<option value="" disabled selected>Aucune wilaya disponible actuellement</option>';
            }
        }
    } catch (e) {
        if (select) {
            select.innerHTML = '<option value="" disabled selected>Impossible de charger les wilayas. Veuillez rafraîchir.</option>';
        }
    }
}

function calculateShippingFee() {
    const wilayaSelect = document.getElementById("shipping_wilaya");
    const shippingType = document.querySelector('input[name="shipping_type"]:checked')?.value || "home";
    
    if (!wilayaSelect || !wilayaSelect.value) return 0;

    const freeThreshold = Number(storefrontSettings.free_threshold) || 5000;
    if (currentCartTotal >= freeThreshold) {
        return 0;
    }

    const selectedOption = wilayaSelect.options[wilayaSelect.selectedIndex];
    if (!selectedOption) return 600;

    const homeFee = parseFloat(selectedOption.dataset.home || 600);
    const deskFee = parseFloat(selectedOption.dataset.desk || 400);

    return shippingType === "desk" ? deskFee : homeFee;
}

function updateShippingUI() {
    const fee = calculateShippingFee();
    currentShippingFee = fee;
    const feeEl = document.getElementById("checkout-shipping-fee");
    const totalEl = document.getElementById("checkout-total");
    
    if (!feeEl || !totalEl) return;

    if (fee === 0 && currentCartTotal >= (Number(storefrontSettings.free_threshold) || 5000)) {
        feeEl.textContent = "Gratuit (Livraison Offerte)";
        totalEl.textContent = formatPrice(currentCartTotal);
    } else {
        feeEl.textContent = formatPrice(fee);
        totalEl.textContent = formatPrice(currentCartTotal + fee);
    }
}

async function loadCheckoutData() {
    const itemsContainer = document.getElementById("checkout-items");
    const subtotalEl = document.getElementById("checkout-subtotal");
    const totalEl = document.getElementById("checkout-total");
    const msgContainer = document.getElementById("checkout-messages");

    try {
        await loadWilayasAndSettings();
        const cart = await apiRequest("/api/cart");
        
        if (!cart.items || cart.items.length === 0) {
            window.location.href = "/cart.html";
            return;
        }

        // Render items summary
        itemsContainer.innerHTML = cart.items.map(item => `
            <div style="display: flex; gap: 16px; align-items: center;">
                <div style="position: relative; width: 64px; height: 64px; background: var(--surface); border: 1px solid var(--line);">
                    <img src="${escapeHTML(item.product_image || "/images/defaults/product.svg")}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='/images/defaults/product.svg'">
                    <span style="position: absolute; top: -8px; right: -8px; background: var(--ink); color: #fff; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.65rem; font-weight: 500;">${item.quantity}</span>
                </div>
                <div style="flex: 1;">
                    <h4 style="margin: 0; font-size: 0.875rem; font-weight: 400; font-family: var(--font-body);">${escapeHTML(item.product_name)}</h4>
                    <p style="margin: 0; font-size: 0.75rem; color: var(--muted);">${escapeHTML(item.category_name)}</p>
                </div>
                <div style="font-weight: 500; font-size: 0.875rem;">
                    ${formatPrice(item.price * item.quantity)}
                </div>
            </div>
        `).join("");

        // Totals
        currentCartTotal = cart.total;
        if (subtotalEl) subtotalEl.textContent = formatPrice(currentCartTotal);

        updateShippingUI();

    } catch (error) {
        itemsContainer.innerHTML = emptyState("Erreur lors du chargement de la commande.");
        showAlert(msgContainer, error.message, "error");
    }
}

function setupCheckoutForm() {
    const form = document.getElementById("checkout-form");
    const msgContainer = document.getElementById("checkout-messages");
    const submitBtn = document.getElementById("btn-submit-order");

    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        hideAlert(msgContainer);

        const addressText = document.getElementById("shipping_address").value.trim();
        const shippingCity = document.getElementById("shipping_city").value.trim();
        const shippingPhone = document.getElementById("shipping_phone").value.trim();
        const wilayaSelect = document.getElementById("shipping_wilaya");
        const shippingType = document.querySelector('input[name="shipping_type"]:checked')?.value || "home";
        
        if (!addressText || !shippingCity || !shippingPhone || !wilayaSelect.value) {
            showAlert(msgContainer, "Veuillez remplir toutes les informations de livraison.", "error");
            return;
        }
        
        const wilayaName = wilayaSelect.options[wilayaSelect.selectedIndex].text.split(" (")[0];
        const shippingTypeLabel = shippingType === "desk" ? "[StopDesk / Bureau]" : "[À domicile]";
        const shippingAddress = `${addressText} (${shippingCity}) — ${wilayaName} ${shippingTypeLabel}`;

        try {
            submitBtn.disabled = true;
            submitBtn.textContent = "Traitement en cours...";

            const { orderId } = await apiRequest("/api/orders", {
                method: "POST",
                body: JSON.stringify({
                    shippingAddress,
                    shippingCity,
                    shippingPhone,
                    shippingFee: currentShippingFee
                })
            });

            if (window.showToast) window.showToast("Commande confirmée avec succès !");
            window.location.href = `/orders.html?success=true&id=${orderId}`;

        } catch (error) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Confirmer la commande";
            showAlert(msgContainer, error.message, "error");
        }
    });

    const wilayaSelect = document.getElementById("shipping_wilaya");
    if (wilayaSelect) {
        wilayaSelect.addEventListener("change", updateShippingUI);
    }

    document.querySelectorAll('input[name="shipping_type"]').forEach(radio => {
        radio.addEventListener("change", updateShippingUI);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
    await waitForSession();
    if (!window.currentUser) {
        window.location.href = "/login.html?redirect=/checkout.html";
    } else {
        loadCheckoutData();
        setupCheckoutForm();
    }
});

