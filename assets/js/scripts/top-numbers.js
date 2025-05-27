import { fetchLotteryTickets } from "../api/fetch-records.js";
// import { fetchLotteryTickets } from './fetch-records.js';

async function getTopNumbers() {
    const tickets = await fetchLotteryTickets();

    // จัดกลุ่มและเรียงลำดับ
    return tickets.reduce((acc, ticket) => {
        const type = ticket.type || 'อื่นๆ';
        if (!acc[type]) acc[type] = [];

        acc[type].push({
            number: ticket.number,
            amount: ticket.amount || 0
        });

        // เรียงลำดับตามยอดเงิน (มากไปน้อย)
        acc[type].sort((a, b) => b.amount - a.amount);

        return acc;
    }, {});
}

function renderTypeCard(type, items) {
    return `
    <div class="bg-gray-50 rounded-lg shadow-sm overflow-hidden">
      <div class="px-3 py-2 border-b border-gray-200">
        <h3 class="text-sm font-medium text-gray-700">${type}<span> 🔥 </span></h3>
      </div>
      <div class="divide-y divide-gray-200">
        ${items.slice(0, 5).map(item => `
          <div class="px-3 py-2 flex justify-between items-center">
            <span class="text-sm">${item.number}</span>
            <span class="text-xs bg-blue-50 text-indigo-500 px-2 py-1 rounded">
              ${item.amount.toLocaleString('th-TH')}฿
            </span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

async function displayTopNumbers() {
    try {
        const topNumbers = await getTopNumbers();
        const container = document.getElementById('topNumbersContainer');

        // ประเภทที่ต้องการแสดง (เรียงลำดับตามที่ต้องการ)
        const displayOrder = [
            'บน', 'ล่าง', 'บน-ล่าง',
            '3 ตัวหน้า', '3 ตัวท้าย',
            '3 ตัวตรง', '3 ตัวโต๊ด'
        ];

        container.innerHTML = `
      <div class="grid grid-cols-1 gap-3">
        ${displayOrder.map(type =>
            topNumbers[type] ? renderTypeCard(type, topNumbers[type]) : ''
        ).join('')}
      </div>
    `;

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('topNumbersContainer').innerHTML = `
      <div class="text-center py-8 text-sm text-gray-500">
        <p>ไม่สามารถโหลดข้อมูลได้</p>
        <button onclick="location.reload()" class="mt-2 text-xs text-blue-500 underline">
          ลองอีกครั้ง
        </button>
      </div>
    `;
    }
}

// เริ่มทำงานเมื่อ DOM พร้อม
document.addEventListener('DOMContentLoaded', displayTopNumbers);