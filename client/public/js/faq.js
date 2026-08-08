// ============================================================
// FAQ.JS — Interactive Accordion Controller for FAQ Page
// Handles expanding/collapsing FAQ items.
// Velora Jewelry Boutique — 2026
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    const faqItems = document.querySelectorAll(".faq-luxury-item");

    faqItems.forEach(item => {
        const questionHeader = item.querySelector(".faq-luxury-question");
        if (!questionHeader) return;

        questionHeader.style.cursor = "pointer";

        questionHeader.addEventListener("click", () => {
            const isActive = item.classList.contains("active");

            // Close other items if desired, or toggle current
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove("active");
                }
            });

            item.classList.toggle("active", !isActive);
        });
    });
});
