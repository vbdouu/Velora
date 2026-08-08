// ============================================================
// FAQ.JS — Interactive Accordion Controller for FAQ Page
// AOLA-style: click to open/close, animated max-height
// Velora Jewelry Boutique — 2026
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".faq-item");

  items.forEach(item => {
    const question = item.querySelector(".faq-question");
    const answer   = item.querySelector(".faq-answer");
    if (!question || !answer) return;

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Close all others first
      items.forEach(other => {
        if (other !== item) {
          other.classList.remove("open");
          const otherQ = other.querySelector(".faq-question");
          if (otherQ) otherQ.setAttribute("aria-expanded", "false");
        }
      });

      // Toggle current
      item.classList.toggle("open", !isOpen);
      question.setAttribute("aria-expanded", String(!isOpen));
    });
  });
});
