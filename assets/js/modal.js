// 📁 assets/js/modal.js

export function setupCustomerDialog() {
    const dialogAddCustomer = document.getElementById("addCustomerDialog");
    const cancelAddCustomerBtn = document.getElementById("cancelAddCustomerBtn");
    const openAddCustomerBtns = document.querySelectorAll(".openaddCustomer");

    if (dialogAddCustomer && cancelAddCustomerBtn && openAddCustomerBtns.length) {
        openAddCustomerBtns.forEach((btn) => {
            btn.addEventListener("click", () => dialogAddCustomer.showModal());
        });

        cancelAddCustomerBtn.addEventListener("click", () => dialogAddCustomer.close());
    }
}

export function setupTicketDialog() {
    const dialogAddTicket = document.getElementById("addTicketDialog");
    const cancelAddTicketBtn = document.getElementById("cancelAddTicketBtn");
    const openAddTicketBtns = document.querySelectorAll(".openaddTicket");

    if (dialogAddTicket && cancelAddTicketBtn && openAddTicketBtns.length) {
        openAddTicketBtns.forEach((btn) => {
            btn.addEventListener("click", () => dialogAddTicket.showModal());
        });

        cancelAddTicketBtn.addEventListener("click", () => dialogAddTicket.close());
    }
}
