let auditRecords =
    JSON.parse(localStorage.getItem("auditRecords")) || [];


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


        auditRecords.unshift(newRecord);


        localStorage.setItem(
            "auditRecords",
            JSON.stringify(auditRecords)
        );


        displayAudit();

        updateSummary();

        document
            .getElementById("auditForm")
            .reset();

        updateChangeFields();

    });


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

    const search =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase();

    const filter =
        document
            .getElementById("actionFilter")
            .value;


    table.innerHTML = "";


    const filteredRecords =
        auditRecords.filter(function(audit) {

            const matchesSearch =
                audit.productCode
                    .toLowerCase()
                    .includes(search) ||
                audit.productName
                    .toLowerCase()
                    .includes(search);

            const matchesFilter =
                filter === "" ||
                audit.action === filter;


            return matchesSearch && matchesFilter;

        });


    filteredRecords.forEach(function(audit) {

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

    });


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

    const added =
        auditRecords.filter(function(audit) {

            return audit.action === "Added";

        }).length;


    const updated =
        auditRecords.filter(function(audit) {

            return audit.action === "Updated";

        }).length;


    const deleted =
        auditRecords.filter(function(audit) {

            return audit.action === "Deleted";

        }).length;


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
            .toLowerCase() || "audit.html";


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


    productMenu.style.display =
        "block";

    productArrow.textContent =
        "−";

}


setActiveProductPage();

updateChangeFields();

displayAudit();

updateSummary();