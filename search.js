let products = [];

function displayProducts() {

    const container =
        document.getElementById("productContainer");

    const search =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase();

    const selectedCategory =
        document
            .getElementById("categoryFilter")
            .value;

    const emptyMessage =
        document.getElementById("emptyMessage");

    const filteredProducts =
        products.filter(function(product) {

            const matchesSearch =
                product.name
                    .toLowerCase()
                    .includes(search) ||
                product.code
                    .toLowerCase()
                    .includes(search);

            const matchesCategory =
                selectedCategory === "" ||
                product.category === selectedCategory;

            return matchesSearch && matchesCategory;

        });

    container.innerHTML = "";

    document.getElementById("productCount").textContent =
        filteredProducts.length + " Products";

    if (filteredProducts.length === 0) {

        emptyMessage.style.display = "block";

        return;

    }

    emptyMessage.style.display = "none";

    filteredProducts.forEach(function(product) {

        const index =
            products.indexOf(product);

        let details =
            `Size: ${product.size}`;

        if (product.color) {

            details +=
                ` · Color: ${product.color}`;

        }

        container.innerHTML += `

            <div class="product-card">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <div class="product-info">

                    <span class="product-code">
                        ${product.code}
                    </span>

                    <h3>
                        ${product.name}
                    </h3>

                    <span class="category">
                        ${product.category}
                    </span>

                    <p class="product-details">
                        ${details}
                    </p>

                    <div class="product-bottom">

                        <span class="price">
                            ₱${product.price}
                        </span>

                        <div class="actions">

                            <button
                                onclick="editProduct(${index})"
                            >
                                Edit
                            </button>

                            <button
                                onclick="deleteProduct(${index})"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        `;

    });

}

function deleteProduct(index) {

    const product =
        products[index];

    const confirmDelete =
        confirm(
            `Are you sure you want to delete "${product.name}"?`
        );

    if (confirmDelete) {

        products.splice(index, 1);

        displayProducts();

    }

}

function editProduct(index) {

    const product =
        products[index];

    alert(
        `Editing "${product.name}" is available from the Add/Create Product page.`
    );

}

function toggleProductMenu(event) {

    event.preventDefault();
    event.stopPropagation();

    const menu =
        document.getElementById("productMenu");

    const arrow =
        document.getElementById("productArrow");

    if (menu.style.display === "none") {

        menu.style.display = "block";

        arrow.textContent = "−";

    } else {

        menu.style.display = "none";

        arrow.textContent = "+";

    }

}

function setActiveProductPage() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop()
            .toLowerCase() || "search.html";

    const subnavItems =
        document.querySelectorAll(
            ".product-section .subnav"
        );

    subnavItems.forEach(function(item) {

        const page =
            item
                .getAttribute("data-page")
                .toLowerCase();

        item.classList.toggle(
            "active",
            page === currentPage
        );

    });

    const productMenu =
        document.getElementById("productMenu");

    const productArrow =
        document.getElementById("productArrow");

    productMenu.style.display = "block";

    productArrow.textContent = "−";

}

setActiveProductPage();

displayProducts();