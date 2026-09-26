let archivedProducts = [];

const categorySelect =
document.getElementById("category");

const colorGroup =
document.getElementById("colorGroup");

const colorInput =
document.getElementById("color");

function convertToLowerCase(text) {

let result = "";

for (let i = 0; i < text.length; i++) {

    let character = text[i];

    let code = character.charCodeAt(0);

    if (code >= 65 && code <= 90) {
        character =
            String.fromCharCode(code + 32);
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

for (
    let i = 0;
    i <= text.length - search.length;
    i++
) {

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

function updateColorField() {

const category =
    categorySelect.value;

if (
    category === "Perfumes" ||
    category === "Body Care Products"
) {

    colorGroup.style.display = "none";

    colorInput.value = "";

} else {

    colorGroup.style.display = "flex";

}

}

categorySelect.addEventListener(
"change",
updateColorField
);

updateColorField();

document
.getElementById("archiveForm")
.addEventListener(
"submit",
function(event) {

        event.preventDefault();

        const productCode =
            document
                .getElementById("productCode")
                .value
                .trim();

        const productName =
            document
                .getElementById("productName")
                .value
                .trim();

        const category =
            document
                .getElementById("category")
                .value;

        const price =
            document
                .getElementById("price")
                .value;

        const size =
            document
                .getElementById("size")
                .value
                .trim();

        const color =
            category === "Perfumes" ||
            category === "Body Care Products"
                ? ""
                : document
                    .getElementById("color")
                    .value
                    .trim();

        const imageInput =
            document.getElementById(
                "productImage"
            );


        let exists = false;

        const newCode =
            convertToLowerCase(productCode);

        for (
            let i = 0;
            i < archivedProducts.length;
            i++
        ) {

            const existingCode =
                convertToLowerCase(
                    archivedProducts[i].code
                );

            if (existingCode === newCode) {

                exists = true;

                break;
            }
        }


        if (exists) {

            alert(
                "This product is already in the archive."
            );

            return;

        }


        const addProduct =
            function(image) {

                const now =
                    new Date();

                const dateArchived =
                    now.toLocaleDateString(
                        "en-PH"
                    ) +
                    " " +
                    now.toLocaleTimeString(
                        "en-PH",
                        {
                            hour: "2-digit",
                            minute: "2-digit"
                        }
                    );


                const newProduct = {

                    code: productCode,

                    name: productName,

                    category: category,

                    price: price,

                    size: size,

                    color: color,

                    image: image,

                    dateArchived:
                        dateArchived

                };


                for (
                    let i =
                        archivedProducts.length;
                    i > 0;
                    i--
                ) {

                    archivedProducts[i] =
                        archivedProducts[i - 1];

                }


                archivedProducts[0] =
                    newProduct;


                displayArchivedProducts();


                document
                    .getElementById(
                        "archiveForm"
                    )
                    .reset();


                resetImagePreview();

                updateColorField();

            };


        if (
            imageInput.files.length > 0
        ) {

            const reader =
                new FileReader();

            reader.onload =
                function() {

                    addProduct(
                        reader.result
                    );

                };

            reader.readAsDataURL(
                imageInput.files[0]
            );

        } else {

            addProduct("");

        }

    }
);

function displayArchivedProducts() {

const container =
    document.getElementById(
        "archiveContainer"
    );

const searchInput =
    document
        .getElementById(
            "searchInput"
        )
        .value;

const search =
    convertToLowerCase(searchInput);

const selectedCategory =
    document
        .getElementById(
            "filterCategory"
        )
        .value;


container.innerHTML = "";


let filteredProducts = [];


for (
    let i = 0;
    i < archivedProducts.length;
    i++
) {

    const product =
        archivedProducts[i];

    const productName =
        convertToLowerCase(
            product.name
        );

    const productCode =
        convertToLowerCase(
            product.code
        );


    const matchesSearch =
        searchText(
            productName,
            search
        ) ||
        searchText(
            productCode,
            search
        );


    const matchesCategory =
        selectedCategory === "" ||
        product.category ===
            selectedCategory;


    if (
        matchesSearch &&
        matchesCategory
    ) {

        filteredProducts[
            filteredProducts.length
        ] = {
            product: product,
            index: i
        };

    }

}


if (
    filteredProducts.length === 0
) {

    container.innerHTML = `
        <div class="empty">
            No archived products found.
        </div>
    `;


    document
        .getElementById(
            "recordCount"
        )
        .textContent =
        "0 Records";


    return;

}


for (
    let i = 0;
    i < filteredProducts.length;
    i++
) {

    const product =
        filteredProducts[i].product;

    const index =
        filteredProducts[i].index;


    let details = "";


    if (product.price) {

        details +=
            `Price: ₱${product.price}`;

    }


    if (product.size) {

        if (details) {
            details += " · ";
        }

        details +=
            `Size: ${product.size}`;

    }


    if (product.color) {

        if (details) {
            details += " · ";
        }

        details +=
            `Color: ${product.color}`;

    }


    if (!details) {

        details =
            "No additional details";

    }


    const imageHTML =
        product.image
            ? `
                <img
                    class="archive-image"
                    src="${product.image}"
                    alt="${product.name}"
                >
            `
            : `
                <div class="archive-image-placeholder">
                    No Image
                </div>
            `;


    container.innerHTML += `

        <div class="archive-card">

            ${imageHTML}

            <div class="archive-card-body">

                <div class="archive-top">

                    <span class="archive-code">
                        ${product.code}
                    </span>

                    <span class="category">
                        ${product.category}
                    </span>

                </div>


                <h3>
                    ${product.name}
                </h3>


                <p class="archive-details">
                    ${details}
                </p>


                <p class="archive-date">
                    Archived: ${product.dateArchived}
                </p>


                <div class="archive-actions">

                    <button
                        class="restore-btn"
                        onclick="restoreArchivedProduct(${index})"
                    >
                        Restore
                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteArchivedProduct(${index})"
                    >
                        Delete Permanently
                    </button>

                </div>

            </div>

        </div>

    `;

}


document
    .getElementById(
        "recordCount"
    )
    .textContent =
    filteredProducts.length +
    " Records";

}

function restoreArchivedProduct(index) {

const product =
    archivedProducts[index];


if (!product) {
    return;
}


alert(
    "Successfully restored"
);


for (
    let i = index;
    i < archivedProducts.length - 1;
    i++
) {

    archivedProducts[i] =
        archivedProducts[i + 1];

}


archivedProducts.length =
    archivedProducts.length - 1;


displayArchivedProducts();

}

function deleteArchivedProduct(index) {

const product =
    archivedProducts[index];


if (!product) {
    return;
}


const confirmDelete =
    confirm(
        `Permanently delete "${product.name}" from the archive?`
    );


if (!confirmDelete) {
    return;
}


for (
    let i = index;
    i < archivedProducts.length - 1;
    i++
) {

    archivedProducts[i] =
        archivedProducts[i + 1];

}


archivedProducts.length =
    archivedProducts.length - 1;


displayArchivedProducts();

}

function resetImagePreview() {

const preview =
    document.getElementById(
        "previewImage"
    );

const placeholder =
    document.getElementById(
        "imagePlaceholder"
    );

const imageInput =
    document.getElementById(
        "productImage"
    );


preview.src = "";

preview.style.display =
    "none";

placeholder.style.display =
    "block";

imageInput.value = "";

}

document
.getElementById(
"productImage"
)
.addEventListener(
"change",
function() {

        const file =
            this.files[0];


        if (!file) {

            resetImagePreview();

            return;

        }


        const reader =
            new FileReader();


        reader.onload =
            function(event) {

                const preview =
                    document.getElementById(
                        "previewImage"
                    );

                const placeholder =
                    document.getElementById(
                        "imagePlaceholder"
                    );


                preview.src =
                    event.target.result;

                preview.style.display =
                    "block";

                placeholder.style.display =
                    "none";

            };


        reader.readAsDataURL(file);

    }
);

document
.getElementById(
"archiveForm"
)
.addEventListener(
"reset",
function() {

        setTimeout(
            function() {

                resetImagePreview();

                updateColorField();

            },
            0
        );

    }
);

function toggleProductMenu(event) {

event.preventDefault();

event.stopPropagation();


const menu =
    document.getElementById(
        "productMenu"
    );

const arrow =
    document.getElementById(
        "productArrow"
    );


if (
    menu.style.display ===
    "none"
) {

    menu.style.display =
        "block";

    arrow.textContent =
        "−";

} else {

    menu.style.display =
        "none";

    arrow.textContent =
        "+";

}

}

function setActiveProductPage() {

const currentPage =
    window.location.pathname
        .split("/")
        .pop()
        .toLowerCase() ||
    "index.html";


const subnavItems =
    document.querySelectorAll(
        ".product-section .subnav"
    );


for (
    let i = 0;
    i < subnavItems.length;
    i++
) {

    const item =
        subnavItems[i];

    const page =
        item
            .getAttribute(
                "data-page"
            )
            .toLowerCase();


    item.classList.toggle(
        "active",
        page === currentPage
    );

}


const productMenu =
    document.getElementById(
        "productMenu"
    );

const productArrow =
    document.getElementById(
        "productArrow"
    );


productMenu.style.display =
    "block";

productArrow.textContent =
    "−";

}

setActiveProductPage();

displayArchivedProducts();
