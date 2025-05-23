// assets/js/modal.js
export function setupTicketDialog() {
  const dialogAddTicket = document.getElementById("addTicketDialog");
  const cancelAddTicketBtn = document.getElementById("cancelAddTicketBtn");
  const openAddTicketBtns = document.querySelectorAll(".openaddTicket");
  const addTicketForm = document.getElementById("addTicketForm");
  const currentDateSpan = document.getElementById("currentDate");
  const validationMessage = document.getElementById("validationMessage");

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
      validationMessage.classList.add("hidden");
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

    // ตัวอย่าง validate อย่างง่ายเช็ค radio อย่างน้อยเลือก 1 (แต่ตอนนี้มัน checked อยู่แล้ว)
    const selectedDigitType = addTicketForm.digitType.value;
    if (!selectedDigitType) {
      validationMessage.classList.remove("hidden");
      return;
    } else {
      validationMessage.classList.add("hidden");
    }

    // ทำอะไรต่อ เช่น ส่งข้อมูล หรือ console.log ข้อมูลที่กรอก
    const formData = new FormData(addTicketForm);
    const data = Object.fromEntries(formData.entries());

    console.log("ส่งข้อมูลโพยหวย:", data);

    // ปิด dialog หลังบันทึก
    dialogAddTicket.close();
  });

  // เคลียร์ form และซ่อนข้อความ validation เมื่อ dialog ปิด
  dialogAddTicket.addEventListener("close", () => {
    addTicketForm.reset();
    validationMessage.classList.add("hidden");
  });
}
