import { fetchLotteryTickets } from './api/fetch-records.js';

// ตัวแปร Global
let allTickets = [];
let currentSortField = 'date';
let isAscending = false;
let currentPage = 1;
const itemsPerPage = 10;

// เริ่มต้นเมื่อ DOM โหลดเสร็จ
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // ดึงข้อมูลทั้งหมด
        allTickets = await fetchLotteryTickets();

        // ตั้งค่าฟีเจอร์ต่างๆ
        setupSorting();
        setupSearch();
        setupExportButton();

        // แสดงผลข้อมูลแรก
        applyAllFilters();
        displaySummary(allTickets);

        // ตั้งค่า Event Listener สำหรับการกรองวันที่
        document.getElementById('filterDate')?.addEventListener('change', () => {
            currentPage = 1;
            applyAllFilters();
        });

    } catch (error) {
        console.error("Failed to load tickets:", error);
        showError("ไม่สามารถโหลดข้อมูลได้");
    }
});

// 1. การเรียงลำดับข้อมูล
function setupSorting() {
    const headers = document.querySelectorAll('th[data-sort]');

    headers.forEach(header => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', () => {
            const field = header.dataset.sort;
            if (currentSortField === field) {
                isAscending = !isAscending;
            } else {
                currentSortField = field;
                isAscending = true;
            }
            applyAllFilters();
        });
    });
}

function sortTickets(tickets) {
    return [...tickets].sort((a, b) => {
        let comparison = 0;

        if (currentSortField === 'amount') {
            comparison = (a.amount || 0) - (b.amount || 0);
        } else {
            comparison = String(a[currentSortField] || '').localeCompare(String(b[currentSortField] || ''));
        }

        return isAscending ? comparison : -comparison;
    });
}

// 2. การค้นหา (Search)
function setupSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'ค้นหาชื่อหรือเลข...';
    searchInput.className = 'border border-gray-300 rounded-md px-3 py-1 text-sm ml-4 w-64';

    searchInput.addEventListener('input', () => {
        currentPage = 1;
        applyAllFilters();
    });

    const headerDiv = document.querySelector('.flex.justify-between.items-center');
    if (headerDiv) {
        headerDiv.appendChild(searchInput);
    }
}

function searchTickets(tickets, keyword) {
    if (!keyword) return tickets;

    const lowerKeyword = keyword.toLowerCase();
    return tickets.filter(ticket => {
        return (ticket.name && ticket.name.toLowerCase().includes(lowerKeyword)) ||
            (ticket.number && ticket.number.toString().toLowerCase().includes(lowerKeyword));
    });
}

// 3. การแบ่งหน้า (Pagination)
function setupPagination(filteredTickets) {
    const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
    const paginationDiv = document.createElement('div');
    paginationDiv.className = 'flex justify-center items-center mt-4 space-x-2';

    // ปุ่มก่อนหน้า
    const prevButton = document.createElement('button');
    prevButton.textContent = 'ก่อนหน้า';
    prevButton.className = 'px-3 py-1 border rounded-md disabled:opacity-50';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            applyAllFilters();
        }
    });

    // แสดงหน้าปัจจุบัน
    const pageInfo = document.createElement('span');
    pageInfo.textContent = `หน้า ${currentPage} จาก ${totalPages}`;
    pageInfo.className = 'px-4 text-sm';

    // ปุ่มถัดไป
    const nextButton = document.createElement('button');
    nextButton.textContent = 'ถัดไป';
    nextButton.className = 'px-3 py-1 border rounded-md disabled:opacity-50';
    nextButton.disabled = currentPage === totalPages || totalPages === 0;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            applyAllFilters();
        }
    });

    paginationDiv.appendChild(prevButton);
    paginationDiv.appendChild(pageInfo);
    paginationDiv.appendChild(nextButton);

    // เพิ่ม Pagination ใต้ตาราง
    const tableSection = document.querySelector('.bg-white.p-6.rounded-xl');
    if (tableSection) {
        const oldPagination = tableSection.querySelector('.pagination-container');
        if (oldPagination) oldPagination.remove();

        const container = document.createElement('div');
        container.className = 'pagination-container mt-4';
        container.appendChild(paginationDiv);
        tableSection.appendChild(container);
    }
}

function paginateTickets(tickets) {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return tickets.slice(start, end);
}

// 4. การกรองข้อมูลแบบรวม (Combined Filters)
function applyAllFilters() {
    const searchInput = document.querySelector('input[type="text"]');
    const searchTerm = searchInput ? searchInput.value : '';
    const dateFilter = document.getElementById('filterDate')?.value;

    // กรองข้อมูล
    let filtered = [...allTickets];

    // กรองตามวันที่
    if (dateFilter) {
        filtered = filtered.filter(ticket => ticket.date === dateFilter);
    }

    // กรองตามคำค้นหา
    if (searchTerm) {
        filtered = searchTickets(filtered, searchTerm);
    }

    // เรียงลำดับ
    filtered = sortTickets(filtered);

    // แบ่งหน้า
    const paginated = paginateTickets(filtered);

    // แสดงผล
    displayTicketsInTable(paginated);
    setupPagination(filtered);

    // อัพเดทสรุป
    displaySummary(filtered);
}

// 5. การส่งออกข้อมูล (Export)
function setupExportButton() {
    const exportButton = document.createElement('button');
    exportButton.textContent = 'ส่งออก Excel';
    exportButton.className = 'bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md text-sm';
    exportButton.id = 'exportExcel';

    exportButton.addEventListener('click', exportToExcel);

    const headerDiv = document.querySelector('.flex.justify-between.items-center');
    if (headerDiv) {
        headerDiv.appendChild(exportButton);
    }
}

function exportToExcel() {
    try {
        // สร้าง worksheet จากข้อมูล
        const ws = XLSX.utils.json_to_sheet(allTickets.map(ticket => ({
            'ชื่อ': ticket.name || '',
            'เลข': ticket.number || '',
            'ประเภท': ticket.type || '',
            'ยอดเงิน': ticket.amount || 0,
            'วันที่': ticket.date || ''
        })));

        // สร้าง workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "รายการลอตเตอรี่");

        // ส่งออกไฟล์
        XLSX.writeFile(wb, `รายการลอตเตอรี่_${new Date().toISOString().slice(0, 10)}.xlsx`, {
            bookType: 'xlsx',
            type: 'array',
            cellStyles: true,
            codepage: 65001 // UTF-8 Encoding
        });

    } catch (error) {
        console.error("Export failed:", error);
        showError("การส่งออกไฟล์ล้มเหลว");
    }
}

// 6. การนับจำนวนรวม (Summary)
function displaySummary(tickets) {
    let summaryDiv = document.querySelector('.summary-container');

    if (!summaryDiv) {
        summaryDiv = document.createElement('div');
        summaryDiv.className = 'summary-container bg-blue-50 p-3 rounded-md mb-4 flex justify-between text-sm';

        const tableSection = document.querySelector('.bg-white.p-6.rounded-xl');
        if (tableSection) {
            tableSection.insertBefore(summaryDiv, tableSection.firstChild);
        }
    }

    const totalAmount = tickets.reduce((sum, ticket) => sum + (ticket.amount || 0), 0);
    const totalTickets = tickets.length;

    summaryDiv.innerHTML = `
    <div>
      <span class="font-medium">จำนวนโพย:</span> ${totalTickets.toLocaleString('th-TH')} รายการ
    </div>
    <div>
      <span class="font-medium">รวมยอดเงิน:</span> ${totalAmount.toLocaleString('th-TH')} บาท
    </div>
  `;
}

// แสดงข้อมูลในตาราง
function displayTicketsInTable(tickets) {
    const tbody = document.querySelector('tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    if (tickets.length === 0) {
        tbody.innerHTML = `
      <tr>
        <td colspan="4" class="px-4 py-2 text-center text-gray-500">ไม่พบข้อมูลลอตเตอรี่</td>
      </tr>
    `;
        return;
    }

    tickets.forEach(ticket => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50';

        row.innerHTML = `
      <td class="px-4 py-2 text-sm text-gray-800">${ticket.name || '-'}</td>
      <td class="px-4 py-2 text-sm font-medium text-indigo-600">${ticket.number || '-'}</td>
      <td class="px-4 py-2 text-sm text-gray-800">${ticket.type || '-'}</td>
      <td class="px-4 py-2 text-sm text-gray-800 text-right">${ticket.amount ? ticket.amount.toLocaleString('th-TH') + ' บาท' : '0 บาท'}</td>
    `;

        tbody.appendChild(row);
    });
}

// แสดงข้อความผิดพลาด
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 z-50';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}