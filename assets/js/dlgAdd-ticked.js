import { setupAddTicketForm, setupDigitTypeForm, setupDigitTypeHighlight } from "./forms/save-ticket.js";

export function setupTicketDialog() {
  const dialogAddTicket = document.getElementById("addTicketDialog");
  const cancelAddTicketBtn = document.getElementById("cancelAddTicketBtn");
  const openAddTicketBtns = document.querySelectorAll(".openaddTicket");
  const addTicketForm = document.getElementById("addTicketForm");
  const currentDateSpan = document.getElementById("currentDate");
  
  if (!(dialogAddTicket && cancelAddTicketBtn && addTicketForm && currentDateSpan)) return;
  
  function setCurrentDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    currentDateSpan.textContent = `${yyyy}-${mm}-${dd}`;
  }
  
  setCurrentDate();

  openAddTicketBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      addTicketForm.reset();
      setCurrentDate();
      dialogAddTicket.showModal();
      
      // เรียกใช้ฟังก์ชันหลังจากเปิด dialog
      setupDigitTypeForm();
      setupDigitTypeHighlight();
    });
  });
  
  cancelAddTicketBtn.addEventListener("click", () => dialogAddTicket.close());
  
  // เรียกใช้ฟังก์ชันตั้งค่าฟอร์มจาก save-ticket.js
  setupAddTicketForm();
}

(async function() {
  const container = document.getElementById("dialog-placeholder");
  if (!container) return;
  
  try {
    const response = await fetch("components/dlgAdd-ticked.html");
    const html = await response.text();
    container.innerHTML = html;

    // เรียกใช้ฟังก์ชันตั้งค่า
    setupTicketDialog();
  } catch (error) {
    console.error("โหลดฟอร์มไม่สำเร็จ:", error);
  }
})();