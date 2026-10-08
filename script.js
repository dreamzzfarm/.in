// ===============================
// DREAMZZ SHOP - FULL SCRIPT
// ===============================

const products = [
    {
        id: 1,
        name: "Fresh Cow Milk",
        category: "Dairy",
        price: 65,
        oldPrice: 75,
        rating: 4.8,
        emoji: "🥛",
        badge: "BEST SELLER",
        description: "Fresh farm cow milk, naturally rich and delivered fresh."
    },
    {
        id: 2,
        name: "Farm Fresh Curd",
        category: "Dairy",
        price: 55,
        oldPrice: 65,
        rating: 4.7,
        emoji: "🥣",
        badge: "FRESH",
        description: "Creamy homemade-style curd made from fresh farm milk."
    },
    {
        id: 3,
        name: "Pure Farm Butter",
        category: "Dairy",
        price: 120,
        oldPrice: 140,
        rating: 4.9,
        emoji: "🧈",
        badge: "TOP RATED",
        description: "Rich and creamy farm-fresh butter."
    },
    {
        id: 4,
        name: "Fresh Tilapia Fish",
        category: "Fish",
        price: 280,
        oldPrice: 320,
        rating: 4.6,
        emoji: "🐟",
        badge: "FRESH",
        description: "Fresh quality tilapia fish from DREAMZZ farm."
    },
    {
        id: 5,
        name: "Farm Rohu Fish",
        category: "Fish",
        price: 320,
        oldPrice: 360,
        rating: 4.7,
        emoji: "🐠",
        badge: "POPULAR",
        description: "Fresh rohu fish carefully selected for quality."
    },
    {
        id: 6,
        name: "Fresh Prawns",
        category: "Fish",
        price: 450,
        oldPrice: 500,
        rating: 4.8,
        emoji: "🦐",
        badge: "PREMIUM",
        description: "Fresh premium prawns with excellent quality."
    },
    {
        id: 7,
        name: "Organic Honey",
        category: "Food",
        price: 250,
        oldPrice: 290,
        rating: 4.9,
        emoji: "🍯",
        badge: "ORGANIC",
        description: "Pure natural honey collected from trusted sources."
    },
    {
        id: 8,
        name: "Farm Fresh Eggs",
        category: "Food",
        price: 90,
        oldPrice: 100,
        rating: 4.7,
        emoji: "🥚",
        badge: "FRESH",
        description: "Fresh farm eggs packed carefully for delivery."
    },
    {
        id: 9,
        name: "Fresh Vegetables",
        category: "Fresh",
        price: 150,
        oldPrice: 180,
        rating: 4.6,
        emoji: "🥬",
        badge: "FARM FRESH",
        description: "Fresh vegetables sourced directly from farms."
    },
    {
        id: 10,
        name: "Homemade Paneer",
        category: "Dairy",
        price: 180,
        oldPrice: 210,
        rating: 4.8,
        emoji: "🧀",
        badge: "POPULAR",
        description: "Soft and fresh paneer made from quality milk."
    },
    {
        id: 11,
        name: "Farm Banana",
        category: "Fresh",
        price: 70,
        oldPrice: 85,
        rating: 4.5,
        emoji: "🍌",
        badge: "FRESH",
        description: "Naturally grown fresh farm bananas."
    },
    {
        id: 12,
        name: "Natural Farm Food",
        category: "Food",
        price: 350,
        oldPrice: 400,
        rating: 4.7,
        emoji: "🌾",
        badge: "PREMIUM",
        description: "Quality natural farm food products."
    }
];


// ===============================
// STORAGE
// ===============================

let cart = JSON.parse(localStorage.getItem("dreamzzCart")) || [];
let wishlist = JSON.parse(localStorage.getItem("dreamzzWishlist")) || [];

let selectedCategory = "All";
let selectedRating = 0;
let selectedPrice = 1000;


// ===============================
// ELEMENTS
// ===============================

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");

const cartBtn = document.getElementById("cartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const wishCount = document.getElementById("wishCount");
const wishlistBtn = document.getElementById("wishlistBtn");

const resultCount = document.getElementById("resultCount");

const priceRange = document.getElementById("priceRange");
const priceValue = document.getElementById("priceValue");

const sortSelect = document.getElementById("sortSelect");

const quickModal = document.getElementById("quickModal");
const modalClose = document.getElementById("modalClose");
const modalContent = document.getElementById("modalContent");

const toast = document.getElementById("toast");


// ===============================
// SAVE STORAGE
// ===============================

function saveCart() {
    localStorage.setItem("dreamzzCart", JSON.stringify(cart));
}

function saveWishlist() {
    localStorage.setItem("dreamzzWishlist", JSON.stringify(wishlist));
}


// ===============================
// FORMAT MONEY
// ===============================

function money(value) {
    return Number(value).toLocaleString("en-IN");
}


// ===============================
// RENDER PRODUCTS
// ===============================

function renderProducts() {

    if (!productGrid) return;

    let filtered = [...products];

    // SEARCH
    const search = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    if (search) {
        filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(search) ||
            product.category.toLowerCase().includes(search)
        );
    }

    // CATEGORY
    if (selectedCategory !== "All") {
        filtered = filtered.filter(
            product => product.category === selectedCategory
        );
    }

    // PRICE
    filtered = filtered.filter(
        product => product.price <= selectedPrice
    );

    // RATING
    if (selectedRating > 0) {
        filtered = filtered.filter(
            product => product.rating >= selectedRating
        );
    }

    // SORT
    const sort = sortSelect ? sortSelect.value : "featured";

    if (sort === "low") {
        filtered.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
        filtered.sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
        filtered.sort((a, b) => b.rating - a.rating);
    }

    // RESULT COUNT
    if (resultCount) {
        resultCount.textContent = filtered.length;
    }

    // EMPTY
    if (filtered.length === 0) {

        productGrid.innerHTML = `
            <div style="
                grid-column:1/-1;
                background:#fff;
                padding:60px;
                border-radius:15px;
                text-align:center;
            ">
                <div style="font-size:60px;">🔍</div>
                <h2>No products found</h2>
                <p style="color:#68736d;">
                    Try changing your search or filters.
                </p>
            </div>
        `;

        return;
    }


    // PRODUCTS
    productGrid.innerHTML = filtered.map(product => {

        const wished = wishlist.includes(product.id);

        return `
            <article class="product-card">

                <div class="product-img">

                    <span class="badge">
                        ${product.badge}
                    </span>

                    <button
                        class="wish"
                        onclick="toggleWishlist(${product.id})"
                        title="Wishlist"
                    >
                        ${wished ? "♥" : "♡"}
                    </button>

                    <span style="
                        font-size:110px;
                        line-height:1;
                    ">
                        ${product.emoji}
                    </span>

                </div>

                <div class="product-info">

                    <h3>${product.name}</h3>

                    <div class="rating">
                        ★★★★★
                        <span style="color:#68736d;">
                            ${product.rating}
                        </span>
                    </div>

                    <div class="price">
                        ₹${money(product.price)}
                        <span class="old">
                            ₹${money(product.oldPrice)}
                        </span>
                    </div>

                    <div class="product-actions">

                        <button
                            class="add-btn"
                            onclick="addToCart(${product.id})"
                        >
                            Add to Cart
                        </button>

                        <button
                            class="quick-btn"
                            onclick="openQuickView(${product.id})"
                        >
                            Quick View
                        </button>

                    </div>

                </div>

            </article>
        `;

    }).join("");
}


// ===============================
// ADD TO CART
// ===============================

function addToCart(id) {

    const product = products.find(p => p.id === id);

    if (!product) return;

    const existing = cart.find(item => item.id === id);

    if (existing) {

        existing.qty += 1;

    } else {

        cart.push({
            id: product.id,
            qty: 1
        });

    }

    saveCart();
    updateCartUI();

    showToast(`${product.name} added to cart 🛒`);
}


// ===============================
// REMOVE FROM CART
// ===============================

function removeFromCart(id) {

    cart = cart.filter(item => item.id !== id);

    saveCart();
    updateCartUI();

    showToast("Product removed");
}


// ===============================
// CHANGE QUANTITY
// ===============================

function changeQty(id, amount) {

    const item = cart.find(item => item.id === id);

    if (!item) return;

    item.qty += amount;

    if (item.qty <= 0) {
        cart = cart.filter(item => item.id !== id);
    }

    saveCart();
    updateCartUI();
}


// ===============================
// UPDATE CART
// ===============================

function updateCartUI() {

    if (!cartItems) return;

    let totalItems = 0;
    let totalPrice = 0;

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <div style="
                text-align:center;
                padding:50px 10px;
                color:#68736d;
            ">
                <div style="font-size:55px;">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some fresh products.</p>
            </div>
        `;

    } else {

        cart.forEach(item => {

            const product = products.find(
                p => p.id === item.id
            );

            if (!product) return;

            const subtotal = product.price * item.qty;

            totalItems += item.qty;
            totalPrice += subtotal;

            cartItems.innerHTML += `

                <div class="cart-row">

                    <div class="cart-emoji">
                        ${product.emoji}
                    </div>

                    <div style="flex:1">

                        <strong>
                            ${product.name}
                        </strong>

                        <div style="
                            color:#02462e;
                            font-weight:800;
                            margin-top:4px;
                        ">
                            ₹${money(product.price)}
                        </div>

                        <div class="qty">

                            <button
                                onclick="changeQty(${product.id}, -1)"
                            >
                                −
                            </button>

                            <span>
                                ${item.qty}
                            </span>

                            <button
                                onclick="changeQty(${product.id}, 1)"
                            >
                                +
                            </button>

                            <button
                                onclick="removeFromCart(${product.id})"
                                style="
                                    margin-left:auto;
                                    border:0;
                                    background:transparent;
                                    color:#b33;
                                    cursor:pointer;
                                "
                            >
                                Remove
                            </button>

                        </div>

                    </div>

                </div>

            `;
        });
    }

    if (cartCount) {
        cartCount.textContent = totalItems;
    }

    if (cartTotal) {
        cartTotal.textContent = money(totalPrice);
    }

    updateWishlistUI();
}


// ===============================
// WISHLIST
// ===============================

function toggleWishlist(id) {

    const index = wishlist.indexOf(id);

    const product = products.find(
        p => p.id === id
    );

    if (index === -1) {

        wishlist.push(id);

        showToast(`${product.name} added to wishlist ❤️`);

    } else {

        wishlist.splice(index, 1);

        showToast("Removed from wishlist");
    }

    saveWishlist();

    updateWishlistUI();
    renderProducts();
}


function updateWishlistUI() {

    if (wishCount) {
        wishCount.textContent = wishlist.length;
    }
}


// ===============================
// SHOW ONLY WISHLIST
// ===============================

function showWishlist() {

    if (wishlist.length === 0) {

        showToast("Your wishlist is empty ❤️");

        return;
    }

    const wishedProducts = products.filter(
        product => wishlist.includes(product.id)
    );

    if (!productGrid) return;

    productGrid.innerHTML = wishedProducts.map(product => {

        return `
            <article class="product-card">

                <div class="product-img">

                    <span class="badge">
                        WISHLIST
                    </span>

                    <button
                        class="wish"
                        onclick="toggleWishlist(${product.id})"
                    >
                        ♥
                    </button>

                    <span style="
                        font-size:110px;
                        line-height:1;
                    ">
                        ${product.emoji}
                    </span>

                </div>

                <div class="product-info">

                    <h3>${product.name}</h3>

                    <div class="rating">
                        ★★★★★ ${product.rating}
                    </div>

                    <div class="price">
                        ₹${money(product.price)}
                    </div>

                    <div class="product-actions">

                        <button
                            class="add-btn"
                            onclick="addToCart(${product.id})"
                        >
                            Add to Cart
                        </button>

                        <button
                            class="quick-btn"
                            onclick="openQuickView(${product.id})"
                        >
                            Quick View
                        </button>

                    </div>

                </div>

            </article>
        `;

    }).join("");

    if (resultCount) {
        resultCount.textContent = wishedProducts.length;
    }
}


// ===============================
// QUICK VIEW
// ===============================

function openQuickView(id) {

    const product = products.find(
        p => p.id === id
    );

    if (!product || !quickModal || !modalContent) return;

    modalContent.innerHTML = `

        <div class="modal-product">

            <div class="big-img">
                ${product.emoji}
            </div>

            <div>

                <span class="eyebrow">
                    ${product.category}
                </span>

                <h2>
                    ${product.name}
                </h2>

                <div class="rating">
                    ★★★★★ ${product.rating}
                </div>

                <div class="price">
                    ₹${money(product.price)}

                    <span class="old">
                        ₹${money(product.oldPrice)}
                    </span>
                </div>

                <p>
                    ${product.description}
                </p>

                <button
                    class="checkout-btn"
                    onclick="
                        addToCart(${product.id});
                        closeQuickView();
                    "
                >
                    Add to Cart
                </button>

            </div>

        </div>

    `;

    quickModal.classList.remove("hidden");
}


// ===============================
// CLOSE QUICK VIEW
// ===============================

function closeQuickView() {

    if (quickModal) {
        quickModal.classList.add("hidden");
    }
}


// ===============================
// CART DRAWER
// ===============================

function openCart() {

    if (cartDrawer) {
        cartDrawer.classList.add("open");
    }

    updateCartUI();
}


function closeCartDrawer() {

    if (cartDrawer) {
        cartDrawer.classList.remove("open");
    }
}


// ===============================
// TOAST
// ===============================

function showToast(message) {

    if (!toast) return;

    toast.textContent = message;

    toast.classList.add("toast");
    toast.classList.add("show");

    clearTimeout(window.dreamzzToastTimer);

    window.dreamzzToastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);
}


// ===============================
// CHECKOUT
// ===============================

function goToCheckout() {

    if (cart.length === 0) {

        showToast("Your cart is empty 🛒");

        return;
    }

    window.location.href = "checkout.html";
}


// ===============================
// CATEGORY FILTER
// ===============================

document.querySelectorAll(".filter").forEach(button => {

    button.addEventListener("click", () => {

        document
            .querySelectorAll(".filter")
            .forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        selectedCategory =
            button.dataset.cat || "All";

        renderProducts();
    });

});


// ===============================
// RATING FILTER
// ===============================

document.querySelectorAll(".rating-filter").forEach(button => {

    button.addEventListener("click", () => {

        selectedRating =
            Number(button.dataset.rating) || 0;

        document
            .querySelectorAll(".rating-filter")
            .forEach(btn => {
                btn.style.background = "";
                btn.style.color = "";
                btn.style.fontWeight = "";
            });

        button.style.background = "#eaf3ee";
        button.style.color = "#02462e";
        button.style.fontWeight = "700";

        renderProducts();
    });

});


// ===============================
// SEARCH
// ===============================

if (searchInput) {

    searchInput.addEventListener(
        "input",
        renderProducts
    );

}


// ===============================
// PRICE RANGE
// ===============================

if (priceRange) {

    priceRange.addEventListener("input", () => {

        selectedPrice =
            Number(priceRange.value);

        if (priceValue) {
            priceValue.textContent =
                selectedPrice;
        }

        renderProducts();
    });

}


// ===============================
// SORT
// ===============================

if (sortSelect) {

    sortSelect.addEventListener(
        "change",
        renderProducts
    );

}


// ===============================
// CART BUTTON
// ===============================

if (cartBtn) {

    cartBtn.addEventListener(
        "click",
        openCart
    );

}


// ===============================
// CLOSE CART
// ===============================

if (closeCart) {

    closeCart.addEventListener(
        "click",
        closeCartDrawer
    );

}


// ===============================
// CLOSE MODAL
// ===============================

if (modalClose) {

    modalClose.addEventListener(
        "click",
        closeQuickView
    );

}


// ===============================
// CLICK OUTSIDE MODAL
// ===============================

if (quickModal) {

    quickModal.addEventListener(
        "click",
        event => {

            if (event.target === quickModal) {
                closeQuickView();
            }

        }
    );

}


// ===============================
// WISHLIST BUTTON
// ===============================

if (wishlistBtn) {

    wishlistBtn.addEventListener(
        "click",
        showWishlist
    );

}


// ===============================
// CHECKOUT BUTTON
// ===============================

const checkoutBtn =
    document.getElementById("checkoutBtn");

if (checkoutBtn) {

    checkoutBtn.addEventListener(
        "click",
        event => {

            if (cart.length === 0) {

                event.preventDefault();

                showToast(
                    "Your cart is empty 🛒"
                );

                return;
            }

            window.location.href =
                "checkout.html";
        }
    );

}


// ===============================
// ESC KEY
// ===============================

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeQuickView();
            closeCartDrawer();

        }

    }
);


// ===============================
// INITIAL LOAD
// ===============================

renderProducts();
updateCartUI();
updateWishlistUI();