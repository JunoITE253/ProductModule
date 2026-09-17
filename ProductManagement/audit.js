let auditRecords =
    JSON.parse(localStorage.getItem("auditRecords")) || [];


function displayAudit() {

    const table = document.getElementById("auditTable");

    const search =
        document.getElementById("searchInput").value.toLowerCase();

    const filter =
        document.getElementById("actionFilter").value;

    table.innerHTML = "";

    const filteredRecords = auditRecords.filter(function(audit) {

        const matchesSearch =
            audit.productCode.toLowerCase().includes(search) ||
            audit.productName.toLowerCase().includes(search);

        const matchesFilter =
            filter === "" ||
            audit.action === filter;

        return matchesSearch && matchesFilter;

    });


    filteredRecords.forEach(function(audit) {

        const row = document.createElement("tr");

        let actionClass = "";

        if (audit.action === "Added") {

            actionClass = "action-added";

        } else if (audit.action === "Updated") {

            actionClass = "action-updated";

        } else {

            actionClass = "action-deleted";

        }


        row.innerHTML = `
            <td>${audit.date}</td>

            <td>${audit.user}</td>

            <td>${audit.productCode}</td>

            <td>${audit.productName}</td>

            <td>
                <span class="action-badge ${actionClass}">
                    ${audit.action}
                </span>
            </td>

            <td>${audit.changes}</td>
        `;

        table.appendChild(row);

    });


    document.getElementById("recordCount").textContent =
        filteredRecords.length + " Records";


    document.getElementById("emptyMessage").style.display =
        filteredRecords.length === 0 ? "block" : "none";

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


    document.getElementById("totalActivities").textContent =
        auditRecords.length;

    document.getElementById("addedCount").textContent =
        added;

    document.getElementById("updatedCount").textContent =
        updated;

    document.getElementById("deletedCount").textContent =
        deleted;

}


function toggleProductMenu(event) {

    event.preventDefault();

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


displayAudit();
updateSummary();