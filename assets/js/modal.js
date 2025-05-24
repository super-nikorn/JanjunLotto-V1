// assets/js/modal.js
export function setupTicketDialog() {
  const dialogAddTicket = document.getElementById("addTicketDialog");
  const cancelAddTicketBtn = document.getElementById("cancelAddTicketBtn");
  const openAddTicketBtns = document.querySelectorAll(".openaddTicket");
  const addTicketForm = document.getElementById("addTicketForm");
  const currentDateSpan = document.getElementById("currentDate");

  if (!(dialogAddTicket && cancelAddTicketBtn && addTicketForm && currentDateSpan)) return;

  // ฟังก์ชันแสดงวันที่ปัจจุบัน
  function setCurrentDate() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    currentDateSpan.textContent = `${yyyy}-${mm}-${dd}`;
  }

  setCurrentDate();

  // เปิด dialog เมื่อกดปุ่ม
  openAddTicketBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      addTicketForm.reset();
      setCurrentDate();
      dialogAddTicket.showModal();
    });
  });

  // ปิด dialog เมื่อกดปุ่มยกเลิก
  cancelAddTicketBtn.addEventListener("click", () => dialogAddTicket.close());

  // เมื่อ submit form
  addTicketForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(addTicketForm);
    const data = Object.fromEntries(formData.entries());

    console.log("ส่งข้อมูลโพยหวย:", data);

    // ปิด dialog หลังบันทึก
    dialogAddTicket.close();
  });
}
