// --- CART & SEARCH OVERLAY TOGGLE LOGIC ---
document.addEventListener("DOMContentLoaded", () => {
  const cartIcon = document.getElementById("cart-icon");
  const cartSidebar = document.getElementById("cart-sidebar");
  const cartOverlay = document.getElementById("cart-overlay");
  const closeCartBtn = document.getElementById("close-cart");

  const searchIcon = document.getElementById("search-icon");
  const searchBar = document.getElementById("search-bar");
  const closeSearchBtn = document.getElementById("close-search");
  const searchInput = document.getElementById("search-input");

  // Cart Drawer open/close
  if (cartIcon && cartSidebar && cartOverlay) {
    cartIcon.addEventListener("click", (e) => {
      e.preventDefault();
      cartSidebar.classList.add("active");
      cartOverlay.classList.add("active");
    });
  }

  function closeCart() {
    if (cartSidebar && cartOverlay) {
      cartSidebar.classList.remove("active");
      cartOverlay.classList.remove("active");
    }
  }

  if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCart);

  // Search Bar pop-down open/close
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

  // --- ADD TO CART FUNCTIONALITY WITH LOCALSTORAGE ---
  let cart = JSON.parse(localStorage.getItem("cravings_cart")) || [];

  const cartCountEl = document.getElementById("cart-count");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotalPriceEl = document.getElementById("cart-total-price");

  updateCartUI();

  const addToCartButtons = document.querySelectorAll(".btn-add-cart");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const productCard = e.target.closest(".product-card");
      if (!productCard) return;

      const title = productCard.querySelector("h3").innerText;
      const priceText = productCard.querySelector(".price").innerText;
      const price = parseFloat(priceText.replace("₱", "").replace(",", ""));
      const imgSrc = productCard.querySelector("img").getAttribute("src");

      addToCart(title, price, imgSrc);
    });
  });

  function addToCart(title, price, imgSrc) {
    const existingItem = cart.find((item) => item.title === title);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        title: title,
        price: price,
        imgSrc: imgSrc,
        quantity: 1,
      });
    }

    saveAndUpdateCart();
    
    if (cartSidebar && cartOverlay) {
      cartSidebar.classList.add("active");
      cartOverlay.classList.add("active");
    }
  }

  function saveAndUpdateCart() {
    localStorage.setItem("cravings_cart", JSON.stringify(cart));
    updateCartUI();
  }

  function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountEl) cartCountEl.innerText = totalItems;

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Your cart is currently empty.</p>';
      if (cartTotalPriceEl) cartTotalPriceEl.innerText = "₱0.00";
      return;
    }

    let cartHTML = "";
    let totalPrice = 0;

    cart.forEach((item, index) => {
      const itemTotal = item.price * item.quantity;
      totalPrice += itemTotal;

      cartHTML += `
        <div class="cart-item" style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 15px; border-bottom: 1px solid #f0f0f0; padding-bottom: 10px;">
          <img src="${item.imgSrc}" alt="${item.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
          
          <div style="flex: 1; margin-left: 10px;">
            <h4 style="margin: 0; font-size: 14px; color: #3b1410;">${item.title}</h4>
            <p style="margin: 3px 0 6px; font-size: 12px; color: #666;">₱${item.price.toFixed(2)}</p>
            
            <div style="display: flex; align-items: center; gap: 8px;">
              <button class="qty-btn decrease-qty" data-index="${index}" style="background: #e0e0e0; border: none; width: 22px; height: 22px; border-radius: 3px; cursor: pointer; font-weight: bold; font-size: 14px; line-height: 1;">-</button>
              <span style="font-size: 13px; font-weight: bold; min-width: 15px; text-align: center;">${item.quantity}</span>
              <button class="qty-btn increase-qty" data-index="${index}" style="background: #3b1410; color: #fff; border: none; width: 22px; height: 22px; border-radius: 3px; cursor: pointer; font-weight: bold; font-size: 14px; line-height: 1;">+</button>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-weight: bold; font-size: 14px; color: #3b1410;">₱${itemTotal.toFixed(2)}</span>
            <button class="remove-item-btn" data-index="${index}" style="background: none; border: none; color: #a83232; cursor: pointer; font-size: 16px;" title="Remove Item"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>
      `;
    });

    cartItemsContainer.innerHTML = cartHTML;

    if (cartTotalPriceEl) {
      cartTotalPriceEl.innerText = `₱${totalPrice.toFixed(2)}`;
    }

    const increaseBtns = cartItemsContainer.querySelectorAll(".increase-qty");
    increaseBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.currentTarget.getAttribute("data-index");
        cart[index].quantity += 1;
        saveAndUpdateCart();
      });
    });

    const decreaseBtns = cartItemsContainer.querySelectorAll(".decrease-qty");
    decreaseBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.currentTarget.getAttribute("data-index");
        if (cart[index].quantity > 1) {
          cart[index].quantity -= 1;
        } else {
          cart.splice(index, 1);
        }
        saveAndUpdateCart();
      });
    });

    const removeButtons = cartItemsContainer.querySelectorAll(".remove-item-btn");
    removeButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const index = e.currentTarget.getAttribute("data-index");
        cart.splice(index, 1);
        saveAndUpdateCart();
      });
    });
  }

  // --- PROCEED TO CHECKOUT BUTTON FUNCTIONALITY ---
  const checkoutBtn = document.querySelector(".btn-checkout");

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (cart.length === 0) {
        alert("Your cart is empty! Please add items before checking out.");
        return;
      }

      let message = "✨Hello Cravings By Ella! I would like to place an order✨:\n\n";
      let totalPrice = 0;

      cart.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        message += `• ${item.quantity}x ${item.title} (₱${itemTotal.toFixed(2)})\n`;
      });

      message += `\n💰 TOTAL AMOUNT:  ₱${totalPrice.toFixed(2)}`;
      message += "\n\nThank you! 😊";

      const encodedMessage = encodeURIComponent(message);
      const fbUsername = "cravingsbyella"; 

      // 1. BUBURAHIN ANG CART SA STORAGE KAPAG NAG-CHECKOUT NA
      cart = [];
      localStorage.removeItem("cravings_cart");
      updateCartUI();

      // 2. BUBUKSAN ANG MESSENGER
      const messengerUrl = `https://m.me/${fbUsername}?text=${encodedMessage}`;
      window.open(messengerUrl, "_blank");
    });
  }
});