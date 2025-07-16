// Consistent localStorage key across all pages
const CART_STORAGE_KEY = 'ohsCart';

// Shared cart functions
function saveCart() {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

function loadCart() {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
}

function updateCartBadge() {
    const cartItems = loadCart();
    const cartBadge = document.getElementById('cartBadge');
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalItems > 0) {
        cartBadge.textContent = totalItems;
        cartBadge.style.display = 'inline-block';
    } else {
        cartBadge.style.display = 'none';
    }
}

// Other shared cart functions...
