document.addEventListener("DOMContentLoaded", () => {
  // --- 1. CART DRAWER LOGIC ---
  const cartIcon = document.getElementById("cart-icon");
  const cartSidebar = document.getElementById("cart-sidebar");
  const cartOverlay = document.getElementById("cart-overlay");
  const closeCartBtn = document.getElementById("close-cart");

  function openCart() {
    if (cartSidebar && cartOverlay) {
      cartSidebar.classList.add("active");
      cartOverlay.classList.add("active");
    }
  }

  function closeCart() {
    if (cartSidebar && cartOverlay) {
      cartSidebar.classList.remove("active");
      cartOverlay.classList.remove("active");
    }
  }

  if (cartIcon) {
    cartIcon.addEventListener("click", (e) => {
      e.preventDefault();
      openCart();
    });
  }

  if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

  // --- 2. SEARCH BAR TOGGLE & FILTER LOGIC ---
  const searchIcon = document.getElementById("search-icon");
  const searchBar = document.getElementById("search-bar");
  const closeSearchBtn = document.getElementById("close-search");
  const searchInput = document.getElementById("search-input");

  // Open / Close Search Bar
  if (searchIcon && searchBar) {
    searchIcon.addEventListener("click", (e) => {
      e.preventDefault();
      searchBar.classList.toggle("active");

      if (searchBar.classList.contains("active") && searchInput) {
        searchInput.focus();
      }
    });
  }

  if (closeSearchBtn && searchBar) {
    closeSearchBtn.addEventListener("click", () => {
      searchBar.classList.remove("active");
    });
  }

  // Live Product Search
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase().trim();
      const productCards = document.querySelectorAll(".product-card");

      let matched = false;

      productCards.forEach((card) => {
        const title = card.querySelector("h3").textContent.toLowerCase();

        if (title.includes(query)) {
          card.style.display = "block"; // Show matching items

          // Scroll smoothly to the first matching item when user types
          if (!matched && query.length > 0) {
            card.scrollIntoView({ behavior: "smooth", block: "center" });
            matched = true;
          }
        } else {
          card.style.display = "none"; // Hide non-matching items
        }
      });
    });
  }
});