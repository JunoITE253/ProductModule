let auditRecords = [];

document
.getElementById("auditForm")
.addEventListener("submit", function(event) {

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

    const action =
        document
            .getElementById("action")
            .value;

    const previousValue =
        document
            .getElementById("previousValue")
            .value
            .trim();

    const newValue =
        document
            .getElementById("newValue")
            .value
            .trim();

    let changes = "";

    if (action === "Added") {

        changes = "Product added";

    } else if (action === "Deleted") {

        changes = "Product deleted";

    } else if (action === "Updated") {

        if (previousValue && newValue) {

            changes =
                "Changed from " +
                previousValue +
                " to " +
                newValue;

        } else {

            changes =
                "Product information updated";

        }
    }

    const now = new Date();

    const date =
        now.toLocaleDateString("en-PH") +
        " " +
        now.toLocaleTimeString("en-PH", {
            hour: "2-digit",
            minute: "2-digit"
        });

    const newRecord = {

        date: date,
        user: "Administrator",
        productCode: productCode,
        productName: productName,
        action: action,
        changes: changes

    };

    for (let i = auditRecords.length; i > 0; i--) {
        auditRecords[i] = auditRecords[i - 1];
    }

    auditRecords[0] = newRecord;

    displayAudit();

    updateSummary();

    document
        .getElementById("auditForm")
        .reset();

    updateChangeFields();

});

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

function updateChangeFields() {

const action =
    document
        .getElementById("action")
        .value;

const changeGrid =
    document.querySelector(".change-grid");

const previousValue =
    document.getElementById("previousValue");

const newValue =
    document.getElementById("newValue");

if (action === "Deleted") {

    changeGrid.style.display = "none";

    previousValue.value = "";

    newValue.value = "";

    previousValue.disabled = true;

    newValue.disabled = true;

} else {

    changeGrid.style.display = "grid";

    previousValue.disabled = false;

    newValue.disabled = false;

}

}

document
.getElementById("action")
.addEventListener(
"change",
updateChangeFields
);

function displayAudit() {

const table =
    document.getElementById("auditTable");

const searchInput =
    document
        .getElementById("searchInput")
        .value;

const search =
    convertToLowerCase(searchInput);

const filter =
    document
        .getElementById("actionFilter")
        .value;

table.innerHTML = "";

let filteredRecords = [];

for (let i = 0; i < auditRecords.length; i++) {

    const audit = auditRecords[i];

    const productCode =
        convertToLowerCase(
            audit.productCode
        );

    const productName =
        convertToLowerCase(
            audit.productName
        );

    const matchesSearch =
        searchText(productCode, search) ||
        searchText(productName, search);

    const matchesFilter =
        filter === "" ||
        audit.action === filter;

    if (matchesSearch && matchesFilter) {

        filteredRecords[
            filteredRecords.length
        ] = audit;
    }
}

for (let i = 0; i < filteredRecords.length; i++) {

    const audit =
        filteredRecords[i];

    const row =
        document.createElement("tr");

    let actionClass = "";

    if (audit.action === "Added") {

        actionClass =
            "action-added";

    } else if (audit.action === "Updated") {

        actionClass =
            "action-updated";

    } else {

        actionClass =
            "action-deleted";
    }

    row.innerHTML = `

        <td>
            ${audit.date}
        </td>

        <td>
            ${audit.user}
        </td>

        <td>
            ${audit.productCode}
        </td>

        <td>
            ${audit.productName}
        </td>

        <td>

            <span class="action-badge ${actionClass}">
                ${audit.action}
            </span>

        </td>

        <td>
            ${audit.changes}
        </td>

    `;

    table.appendChild(row);
}

document
    .getElementById("recordCount")
    .textContent =
    filteredRecords.length +
    " Records";

document
    .getElementById("emptyMessage")
    .style.display =
    filteredRecords.length === 0
        ? "block"
        : "none";

}

function updateSummary() {

let added = 0;
let updated = 0;
let deleted = 0;

for (let i = 0; i < auditRecords.length; i++) {

    if (auditRecords[i].action === "Added") {

        added++;

    } else if (auditRecords[i].action === "Updated") {

        updated++;

    } else if (auditRecords[i].action === "Deleted") {

        deleted++;
    }
}

document
    .getElementById("totalActivities")
    .textContent =
    auditRecords.length;

document
    .getElementById("addedCount")
    .textContent =
    added;

document
    .getElementById("updatedCount")
    .textContent =
    updated;

document
    .getElementById("deletedCount")
    .textContent =
    deleted;

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
        .toLowerCase() ||
    "audit.html";

const subnavItems =
    document.querySelectorAll(
        ".product-section .subnav"
    );

for (let i = 0; i < subnavItems.length; i++) {

    const item = subnavItems[i];

    const page =
        item
            .getAttribute("data-page")
            .toLowerCase();

    item.classList.toggle(
        "active",
        page === currentPage
    );
}

const productMenu =
    document.getElementById("productMenu");

const productArrow =
    document.getElementById("productArrow");

productMenu.style.display =
    "block";

productArrow.textContent =
    "−";

}

setActiveProductPage();

updateChangeFields();

displayAudit();

updateSummary();
