let products = [];

const productImage = document.getElementById("productImage");
const imagePreview = document.getElementById("imagePreview");
const uploadText = document.getElementById("uploadText");
const category = document.getElementById("category");
const colorGroup = document.getElementById("colorGroup");

productImage.addEventListener("change", function() {
    const file = productImage.files[0];

    if (file) {
        imagePreview.src = URL.createObjectURL(file);
        imagePreview.style.display = "block";
        uploadText.style.display = "none";
    }
});

category.addEventListener("change", function() {
    if (
        category.value === "Body Care Products" ||
        category.value === "Perfumes"
    ) {
        colorGroup.style.display = "none";
        document.getElementById("color").value = "";
    } else {
        colorGroup.style.display = "block";
    }
});

function convertToLowerCase(text) {
    let result = "";

    for (let i = 0; i < text.length; i++) {
        let character = text[i];
        let code = character.charCodeAt(0);

        if (code >= 65 && code <= 90) {
            character = String.fromCharCode(code + 32);
        }

        result += character;
    }

    return result;
}

function searchText(text, search) {
    if (search === "") {
        return true;
    }

    if (search.length > text.length) {
        return false;
    }

    for (let i = 0; i <= text.length - search.length; i++) {
        let match = true;

        for (let j = 0; j < search.length; j++) {
            if (text[i + j] !== search[j]) {
                match = false;
                break;
            }
        }

        if (match) {
            return true;
        }
    }

    return false;
}

function addProduct() {
    const file = productImage.files[0];

    if (!file) {
        alert("Please upload a product image.");
        return;
    }

    const selectedCategory = document.getElementById("category").value;

    const product = {
        image: URL.createObjectURL(file),
        code: document.getElementById("productCode").value,
        name: document.getElementById("productName").value,
        category: selectedCategory,
        price: document.getElementById("price").value,
        size: document.getElementById("size").value,
        color:
            selectedCategory === "Body Care Products" ||
            selectedCategory === "Perfumes"
                ? ""
                : document.getElementById("color").value
    };

    if (
        !product.code ||
        !product.name ||
        !product.category ||
        !product.price
    ) {
        alert("Please complete the required product information.");
        return;
    }

    products[products.length] = product;

    displayProducts();

    clearForm();
}

function displayProducts() {
    const container = document.getElementById("productContainer");

    const searchInput = document.getElementById("searchInput").value;
    const search = convertToLowerCase(searchInput);

    const selectedCategory =
        document.getElementById("filterCategory").value;

    container.innerHTML = "";

    let foundProducts = 0;

    for (let i = 0; i < products.length; i++) {
        const product = products[i];

        const productName = convertToLowerCase(product.name);
        const productCode = convertToLowerCase(product.code);

        const matchesSearch =
            searchText(productName, search) ||
            searchText(productCode, search);

        const matchesCategory =
            selectedCategory === "" ||
            product.category === selectedCategory;

        if (matchesSearch && matchesCategory) {
            foundProducts++;

            let details = `Size: ${product.size}`;

            if (product.color) {
                details += ` · Color: ${product.color}`;
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

                        <h3>${product.name}</h3>

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

                                <button onclick="editProduct(${i})">
                                    Edit
                                </button>

                                <button onclick="deleteProduct(${i})">
                                    Delete
                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            `;
        }
    }

    if (foundProducts === 0) {
        container.innerHTML = `
            <div class="empty">
                No products found.
            </div>
        `;
    }
}

function deleteProduct(index) {
    const product = products[index];

    const confirmDelete = confirm(
        `Are you sure you want to delete "${product.name}"?`
    );

    if (confirmDelete) {
        for (let i = index; i < products.length - 1; i++) {
            products[i] = products[i + 1];
        }

        products.length = products.length - 1;

        displayProducts();
    }
}

function editProduct(index) {
    const product = products[index];

    document.getElementById("productCode").value = product.code;
    document.getElementById("productName").value = product.name;
    document.getElementById("category").value = product.category;
    document.getElementById("price").value = product.price;
    document.getElementById("size").value = product.size;
    document.getElementById("color").value = product.color;

    if (
        product.category === "Body Care Products" ||
        product.category === "Perfumes"
    ) {
        colorGroup.style.display = "none";
        document.getElementById("color").value = "";
    } else {
        colorGroup.style.display = "block";
    }

    imagePreview.src = product.image;
    imagePreview.style.display = "block";
    uploadText.style.display = "none";
}

function clearForm() {
    document.getElementById("productCode").value = "";
    document.getElementById("productName").value = "";
    document.getElementById("category").value = "";
    document.getElementById("price").value = "";
    document.getElementById("size").value = "";
    document.getElementById("color").value = "";

    productImage.value = "";

    imagePreview.src = "";
    imagePreview.style.display = "none";

    uploadText.style.display = "block";
    colorGroup.style.display = "block";
}

function toggleProductMenu(event) {
    event.preventDefault();
    event.stopPropagation();

    const menu = document.getElementById("productMenu");
    const arrow = document.getElementById("productToggle");

    const isClosed = menu.style.display === "none";

    menu.style.display = isClosed ? "block" : "none";
    arrow.textContent = isClosed ? "−" : "+";
}

function setActiveProductPage() {
    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    const subnavItems = document.querySelectorAll(
        ".product-section .subnav"
    );

    for (let i = 0; i < subnavItems.length; i++) {
        const item = subnavItems[i];
        const page = item.getAttribute("data-page");

        item.classList.toggle(
            "active",
            page === currentPage
        );
    }

    const productMenu = document.getElementById("productMenu");
    const productToggle = document.getElementById("productToggle");

    productMenu.style.display = "block";
    productToggle.textContent = "−";
}

setActiveProductPage();
displayProducts();
