const products = [];

function displayProducts() {

    const container = document.getElementById("productContainer");
    const search = document.getElementById("searchInput").value.toLowerCase();
    const category = document.getElementById("categoryFilter").value;
    const emptyMessage = document.getElementById("emptyMessage");

    container.innerHTML = "";

    const filteredProducts = products.filter(function(product) {

        const matchesSearch =
            product.name.toLowerCase().includes(search) ||
            product.code.toLowerCase().includes(search);

        const matchesCategory =
            category === "" ||
            product.category === category;

        return matchesSearch && matchesCategory;

    });

    filteredProducts.forEach(function(product) {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>

            <div class="product-info">

                <div class="product-code">
                    ${product.code}
                </div>

                <div class="product-name">
                    ${product.name}
                </div>

                <span class="product-category">
                    ${product.category}
                </span>

                <div class="product-details">

                    <div class="detail-row">
                        <span>Price</span>
                        <span class="price">
                            ₱${Number(product.price).toFixed(2)}
                        </span>
                    </div>

                    <div class="detail-row">
                        <span>Size</span>
                        <span>${product.size}</span>
                    </div>

                    <div class="detail-row">
                        <span>Color</span>
                        <span>${product.color || "N/A"}</span>
                    </div>

                </div>

            </div>
        `;

        container.appendChild(card);

    });

    document.getElementById("productCount").textContent =
        filteredProducts.length + " Products";

    emptyMessage.style.display =
        filteredProducts.length === 0 ? "block" : "none";
}

function toggleProductMenu(event) {

    event.preventDefault();

    const menu = document.getElementById("productMenu");
    const arrow = event.currentTarget.querySelector(".menu-toggle");

    if (menu.style.display === "none") {

        menu.style.display = "block";
        arrow.textContent = "−";

    } else {

        menu.style.display = "none";
        arrow.textContent = "+";

    }

}

displayProducts();