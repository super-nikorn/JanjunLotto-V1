import { fetchLotteryTickets } from './api/fetch-records.js';
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // ดึงข้อมูลจาก Firestore
        const tickets = await fetchLotteryTickets();

        // แสดงข้อมูลในตาราง
        displayTicketsInTable(tickets);

        // เพิ่ม Event Listener สำหรับการกรองวันที่
        const filterDateInput = document.getElementById('filterDate');
        filterDateInput.addEventListener('change', (e) => {
            const selectedDate = e.target.value;
            filterTicketsByDate(tickets, selectedDate);
        });

    } catch (error) {
        console.error("Failed to load tickets:", error);
        // แสดงข้อความ error
        const tableBody = document.querySelector('tbody');
        if (tableBody) {
            tableBody.innerHTML = '<tr><td colspan="4" class="px-4 py-2 text-center text-red-500">ไม่สามารถโหลดข้อมูลได้</td></tr>';
        }
    }
});

function displayTicketsInTable(tickets) {
    const tableBody = document.querySelector('tbody');

    // ถ้ายังไม่มี tbody ให้สร้างใหม่
    if (!tableBody) {
        const table = document.querySelector('table');
        if (table) {
            const newTbody = document.createElement('tbody');
            table.appendChild(newTbody);
        }
    }

    // ล้างข้อมูลเก่า
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = '';

    if (tickets.length === 0) {
        tbody.innerHTML = `
      <tr>
        <td colspan="4" class="px-4 py-2 text-center text-gray-500">ไม่พบข้อมูลลอตเตอรี่</td>
      </tr>
    `;
        return;
    }

    // เพิ่มข้อมูลแต่ละรายการ
    tickets.forEach(ticket => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';

        row.innerHTML = `
      <td class="px-4 py-2 text-sm text-gray-800">${ticket.name || '-'}</td>
      <td class="px-4 py-2 text-sm font-medium text-indigo-600">${ticket.number || '-'}</td>
      <td class="px-4 py-2 text-sm text-gray-800">${ticket.type || '-'}</td>
      <td class="px-4 py-2 text-sm text-gray-800 text-right">${ticket.amount ? ticket.amount.toLocaleString() + ' บาท' : '0 บาท'}</td>
    `;

        tbody.appendChild(row);
    });
}