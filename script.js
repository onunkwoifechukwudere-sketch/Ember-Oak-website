
/* EMBER & OAK SHOPPING CART */

// Store the customer's selected food items.
const cart = [];

// Find the important HTML elements.
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const cartMessage = document.getElementById("cart-message");

// Format numbers as Nigerian naira.
function formatPrice(amount) {
    return "₦" + amount.toLocaleString("en-NG");
}

// Display the current cart on the page.
function renderCart() {
    cartItems.innerHTML = "";

    let total = 0;
    let quantityTotal = 0;

    if (cart.length === 0) {
        cartItems.innerHTML =
            '<p class="empty-cart">Your cart is empty. Add something delicious!</p>';
    }

    cart.forEach(function (item, index) {
        const itemTotal = item.price * item.quantity;

        total += itemTotal;
        quantityTotal += item.quantity;

        const row = document.createElement("div");
        row.className = "cart-item";

        const details = document.createElement("div");

        const name = document.createElement("h3");
        name.textContent = item.name;

        const price = document.createElement("p");
        price.textContent =
            formatPrice(item.price) + " each · Subtotal: " +
            formatPrice(itemTotal);

        details.append(name, price);

        const actions = document.createElement("div");
        actions.className = "cart-actions";

        const decrease = document.createElement("button");
        decrease.className = "quantity-button";
        decrease.textContent = "−";
        decrease.setAttribute("aria-label", "Decrease " + item.name);
        decrease.addEventListener("click", function () {
            changeQuantity(index, -1);
        });

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const increase = document.createElement("button");
        increase.className = "quantity-button";
        increase.textContent = "+";
        increase.setAttribute("aria-label", "Increase " + item.name);
        increase.addEventListener("click", function () {
            changeQuantity(index, 1);
        });

        const remove = document.createElement("button");
        remove.className = "remove-button";
        remove.textContent = "Remove";
        remove.addEventListener("click", function () {
            cart.splice(index, 1);
            renderCart();
            cartMessage.textContent = item.name + " removed from your cart.";
        });

        actions.append(decrease, quantity, increase, remove);
        row.append(details, actions);
        cartItems.appendChild(row);
    });

    cartCount.textContent = quantityTotal;
    cartTotal.textContent = formatPrice(total);
}

// Add a food item or increase its quantity.
document.querySelectorAll(".add-cart").forEach(function (button) {
    button.addEventListener("click", function () {
        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        const existingItem = cart.find(function (item) {
            return item.name === name;
        });

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({
                name: name,
                price: price,
                quantity: 1
            });
        }

        renderCart();

        cartMessage.textContent = name + " added to your cart.";

        button.textContent = "Added ✓";

        setTimeout(function () {
            button.textContent = "Add to Cart +";
        }, 1000);
    });
});

// Change the quantity of an item.
function changeQuantity(index, amount) {
    cart[index].quantity += amount;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    renderCart();
    cartMessage.textContent = "";
}

// Scroll to the cart when its navigation button is clicked.
document.getElementById("cart-toggle").addEventListener("click", function () {
    document.getElementById("cart").scrollIntoView({
        behavior: "smooth"
    });
});

// Remove all items from the cart.
document.getElementById("clear-cart").addEventListener("click", function () {
    cart.length = 0;
    renderCart();
    cartMessage.textContent = "Your cart has been cleared.";
});

// Temporary checkout demonstration.
document.getElementById("checkout-button").addEventListener("click", function () {
    if (cart.length === 0) {
        cartMessage.textContent = "Please add food to your cart first.";
        return;
    }

    cartMessage.textContent =
        "Your order total is " + cartTotal.textContent +
        ". Online payment and order submission are not connected yet.";
});

// Display the initial empty cart.
renderCart();


/* MOBILE NAVIGATION */

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", function () {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );

    menuToggle.textContent = isOpen ? "✕" : "☰";
});

// Close the mobile menu after a navigation link is selected.
navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        menuToggle.textContent = "☰";
    });
});

// Keep the mobile cart count synchronized with the main cart count.
const mobileCartCount = document.getElementById("mobile-cart-count");

function syncMobileCartCount() {
    mobileCartCount.textContent = cartCount.textContent;
}

document.querySelectorAll(".add-cart").forEach(function (button) {
    button.addEventListener("click", function () {
        syncMobileCartCount();
    });
});

document.getElementById("clear-cart").addEventListener("click", function () {
    syncMobileCartCount();
});
