import { fetchLotteryTickets } from "../api/fetchTickets.js";

// import { fetchLotteryTickets } from "./fetchTickets.js";

// ฟังก์ชันสำหรับแสดงข้อมูล
async function showDataCurrent() {
  clearDisplay(); // เคลียร์ข้อมูลก่อนแสดงใหม่

  const today = new Date();
  const day = today.getDate();
  const month = today.getMonth();
  const year = today.getFullYear();

  const fromDate = new Date(year, month, day < 17 ? 1 : 17);
  const toDate = today;

  const formatDate = (date) => date.toISOString().split("T")[0];
  const formattedFrom = formatDate(fromDate);
  const formattedTo = formatDate(toDate);

  // แสดงช่วงวันที่
  document.getElementById("showFormDateToDate").textContent = `${formattedFrom} ถึง ${formattedTo}`;

  // ดึงและกรองข้อมูล
  const tickets = await fetchLotteryTickets();
  const filtered = tickets.filter((ticket) => {
    const ticketDate = ticket.date.split("T")[0];
    return ticketDate >= formattedFrom && ticketDate <= formattedTo;
  });

  // จัดกลุ่มตาม type
  const grouped = {};
  filtered.forEach((ticket) => {
    if (!grouped[ticket.type]) grouped[ticket.type] = [];
    grouped[ticket.type].push(ticket);
  });

  // สร้าง top 5
  const top5ByType = {};
  for (const type in grouped) {
    top5ByType[type] = grouped[type]
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }

  // แสดงผลในหน้าเว็บ
  displayTopNumbers(top5ByType);
}

// ฟังก์ชันล้างข้อมูล
function clearDataForm() {
  clearDisplay();
  alert("ล้างข้อมูลแล้ว");
}

// เคลียร์ข้อมูลที่แสดง
function clearDisplay() {
  document.getElementById("resultContainer").innerHTML = "";
  document.getElementById("showFormDateToDate").textContent = "";
}

// สร้าง HTML สำหรับแสดงข้อมูล
function displayTopNumbers(data) {
  const container = document.getElementById("resultContainer");
  container.innerHTML = ""; // เคลียร์ก่อน

  for (const type in data) {
    const listItems = data[type]
      .map(
        (item) => `
        <li class="flex justify-between border-b border-gray-100 py-1">
          <span class="font-medium text-gray-700">${item.number}</span>
          <span class="text-sm text-gray-500">${item.amount} ฿</span>
        </li>
      `
      )
      .join("");

    container.innerHTML += `
      <div class="bg-white rounded-xl shadow-md p-4 my-4">
        <h3 class="text-lg font-semibold text-indigo-500 border-b border-gray-200 pb-2 mb-2">${type}</h3>
        <ul class="text-sm text-gray-600 list-none">
          ${listItems}
        </ul>
      </div>
    `;
  }
}


// Export ไปใช้ใน HTML
window.showDataCurrent = showDataCurrent;
window.clearDataForm = clearDataForm;
