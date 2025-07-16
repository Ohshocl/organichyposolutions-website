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
// Add to cart function (used across multiple pages)
function addToCart(productId, quantity = 1) {
    let cart = loadCart();
    const existingItemIndex = cart.findIndex(item => item.productId === productId);
    
    if (existingItemIndex >= 0) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({ productId, quantity });
    }
    
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartBadge();
}

// Remove from cart function
function removeFromCart(productId) {
    let cart = loadCart();
    cart = cart.filter(item => item.productId !== productId);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    updateCartBadge();
}

// Initialize cart badge on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartBadge();
});
