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

    if (category.value === "Body Care Products") {

        colorGroup.style.display = "none";
        document.getElementById("color").value = "";

    } else {

        colorGroup.style.display = "block";

    }

});


function addProduct() {

    const file = productImage.files[0];

    if (!file) {
        alert("Please upload a product image.");
        return;
    }

    const product = {

        image: URL.createObjectURL(file),

        code: document.getElementById("productCode").value,

        name: document.getElementById("productName").value,

        category: document.getElementById("category").value,

        price: document.getElementById("price").value,

        size: document.getElementById("size").value,

        color: document.getElementById("color").value

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

    products.push(product);

    displayProducts();

    clearForm();

}


function displayProducts() {

    const container = document.getElementById("productContainer");

    const search =
        document.getElementById("searchInput").value.toLowerCase();

    const selectedCategory =
        document.getElementById("filterCategory").value;

    const filteredProducts = products.filter(function(product) {

        const matchesSearch =
            product.name.toLowerCase().includes(search) ||
            product.code.toLowerCase().includes(search);

        const matchesCategory =
            selectedCategory === "" ||
            product.category === selectedCategory;

        return matchesSearch && matchesCategory;

    });

    container.innerHTML = "";

    if (filteredProducts.length === 0) {

        container.innerHTML = `
            <div class="empty">
                No products found.
            </div>
        `;

        return;
    }

    filteredProducts.forEach(function(product) {

        const index = products.indexOf(product);

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

                            <button onclick="editProduct(${index})">
                                Edit
                            </button>

                            <button onclick="deleteProduct(${index})">
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

    const product = products[index];

    const confirmDelete = confirm(
        `Are you sure you want to delete "${product.name}"?`
    );

    if (confirmDelete) {

        products.splice(index, 1);

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

    if (product.category === "Body Care Products") {

        colorGroup.style.display = "none";

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