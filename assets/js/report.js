import { fetchLotteryTickets } from './api/fetch-records.js';

// ตัวแปร Global
let allTickets = [];
let filteredTickets = [];
let currentSortField = 'date';
let isAscending = false;
let currentPage = 1;
const itemsPerPage = 10;

// เริ่มต้นเมื่อ DOM โหลดเสร็จ
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // แสดงสถานะกำลังโหลด
        showLoading(true);

        // ดึงข้อมูลทั้งหมด
        allTickets = await fetchLotteryTickets();

        // ตั้งค่าการทำงานทั้งหมด
        initializeApp();

    } catch (error) {
        console.error("Failed to load tickets:", error);
        showError("ไม่สามารถโหลดข้อมูลได้");
    } finally {
        showLoading(false);
    }
});

function initializeApp() {
    // ตั้งค่า Event Listeners
    setupEventListeners();

    // แสดงข้อมูลแรก
    applyFilters();

    // อัพเดทสรุปข้อมูล
    updateSummary();
}

function setupEventListeners() {
    // การเรียงลำดับ
    document.querySelectorAll('.sortable-header').forEach(header => {
        header.addEventListener('click', () => {
            const field = header.dataset.sort;
            toggleSort(field);
            applyFilters();
        });
    });

    // การค้นหา
    document.getElementById('searchInput').addEventListener('input', debounce(() => {
        currentPage = 1;
        applyFilters();
    }, 300));

    // ฟิลเตอร์วันที่
    document.getElementById('filterDate').addEventListener('change', () => {
        currentPage = 1;
        applyFilters();
    });

    // ฟิลเตอร์ประเภท
    document.getElementById('filterType').addEventListener('change', () => {
        currentPage = 1;
        applyFilters();
    });

    // Pagination
    document.getElementById('prevPageBtn').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            applyFilters();
        }
    });

    document.getElementById('nextPageBtn').addEventListener('click', () => {
        const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            applyFilters();
        }
    });

    // ส่งออก Excel
    document.getElementById('exportBtn').addEventListener('click', exportToExcel);
}

function applyFilters() {
    // กรองข้อมูล
    filterTickets();

    // เรียงลำดับ
    sortTickets();

    // แบ่งหน้า
    const paginatedTickets = paginateTickets();

    // แสดงผลในตาราง
    renderTable(paginatedTickets);

    // อัพเดท Pagination
    updatePagination();

    // อัพเดท Summary
    updateSummary();
}

function filterTickets() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const dateFilter = document.getElementById('filterDate').value;
    const typeFilter = document.getElementById('filterType').value;

    filteredTickets = allTickets.filter(ticket => {
        // กรองตามคำค้นหา
        const matchesSearch =
            !searchTerm ||
            (ticket.name && ticket.name.toLowerCase().includes(searchTerm)) ||
            (ticket.number && ticket.number.toString().includes(searchTerm));

        // กรองตามวันที่
        const matchesDate =
            !dateFilter ||
            ticket.date === dateFilter;

        // กรองตามประเภท
        const matchesType =
            !typeFilter ||
            ticket.type === typeFilter;

        return matchesSearch && matchesDate && matchesType;
    });
}

function sortTickets() {
    filteredTickets.sort((a, b) => {
        let valueA = a[currentSortField];
        let valueB = b[currentSortField];

        // สำหรับการเรียงลำดับตัวเลข
        if (currentSortField === 'amount') {
            valueA = valueA || 0;
            valueB = valueB || 0;
            return isAscending ? valueA - valueB : valueB - valueA;
        }

        // สำหรับการเรียงลำดับข้อความ
        valueA = String(valueA || '').toLowerCase();
        valueB = String(valueB || '').toLowerCase();

        if (valueA < valueB) return isAscending ? -1 : 1;
        if (valueA > valueB) return isAscending ? 1 : -1;
        return 0;
    });
}

function paginateTickets() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTickets.slice(startIndex, endIndex);
}

function renderTable(tickets) {
    const tbody = document.getElementById('dataTableBody');
    tbody.innerHTML = '';

    if (tickets.length === 0) {
        tbody.innerHTML = `
      <tr>
        <td colspan="5" class="px-4 py-4 text-center text-gray-500">ไม่พบข้อมูลลอตเตอรี่</td>
      </tr>
    `;
        return;
    }

    tickets.forEach(ticket => {
        const row = document.createElement('tr');
        row.className = 'ticket-row hover:bg-gray-50';

        row.innerHTML = `
      <td class="px-4 py-3 text-sm text-gray-800 whitespace-nowrap">${ticket.name || '-'}</td>
      <td class="px-4 py-3 text-sm font-medium text-indigo-600 whitespace-nowrap">${ticket.number || '-'}</td>
      <td class="px-4 py-3 text-sm text-gray-800 whitespace-nowrap">${ticket.type || '-'}</td>
      <td class="px-4 py-3 text-sm text-gray-800 text-right whitespace-nowrap">
        ${ticket.amount ? ticket.amount.toLocaleString('th-TH') + ' บาท' : '0 บาท'}
      </td>
      <td class="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">${ticket.date || '-'}</td>
    `;

        tbody.appendChild(row);
    });
}

function updatePagination() {
    const totalItems = filteredTickets.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // อัพเดทข้อความแสดงผล
    document.getElementById('startItem').textContent = startItem;
    document.getElementById('endItem').textContent = endItem;
    document.getElementById('totalItems').textContent = totalItems;

    // อัพเดทปุ่ม Pagination
    document.getElementById('prevPageBtn').disabled = currentPage === 1;
    document.getElementById('nextPageBtn').disabled = currentPage === totalPages || totalPages === 0;

    // สร้างหมายเลขหน้า
    const pageNumbersContainer = document.getElementById('pageNumbers');
    pageNumbersContainer.innerHTML = '';

    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // ปุ่มหน้าแรก
    if (startPage > 1) {
        const firstPageBtn = createPageButton(1);
        pageNumbersContainer.appendChild(firstPageBtn);

        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'px-2 py-1';
            ellipsis.textContent = '...';
            pageNumbersContainer.appendChild(ellipsis);
        }
    }

    // หมายเลขหน้า
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = createPageButton(i);
        if (i === currentPage) {
            pageBtn.classList.add('bg-indigo-100', 'text-indigo-700');
        }
        pageNumbersContainer.appendChild(pageBtn);
    }

    // ปุ่มหน้าสุดท้าย
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'px-2 py-1';
            ellipsis.textContent = '...';
            pageNumbersContainer.appendChild(ellipsis);
        }

        const lastPageBtn = createPageButton(totalPages);
        pageNumbersContainer.appendChild(lastPageBtn);
    }
}

function createPageButton(pageNumber) {
    const button = document.createElement('button');
    button.className = 'px-3 py-1 border rounded-md text-sm mx-1';
    button.textContent = pageNumber;

    button.addEventListener('click', () => {
        currentPage = pageNumber;
        applyFilters();
    });

    return button;
}

function updateSummary() {
    const totalAmount = filteredTickets.reduce((sum, ticket) => sum + (ticket.amount || 0), 0);
    const totalTickets = filteredTickets.length;

    document.getElementById('totalCount').textContent = totalTickets.toLocaleString('th-TH');
    document.getElementById('totalAmount').textContent = totalAmount.toLocaleString('th-TH');
}

function toggleSort(field) {
    if (currentSortField === field) {
        isAscending = !isAscending;
    } else {
        currentSortField = field;
        isAscending = true;
    }

    // อัพเดทไอคอนการเรียงลำดับ
    document.querySelectorAll('.sortable-header .sort-icon').forEach(icon => {
        icon.classList.add('text-gray-400');
        icon.classList.remove('text-indigo-600');
    });

    const currentHeader = document.querySelector(`th[data-sort="${currentSortField}"] .sort-icon`);
    if (currentHeader) {
        currentHeader.classList.remove('text-gray-400');
        currentHeader.classList.add('text-indigo-600');

        // เปลี่ยนทิศทางไอคอน
        if (isAscending) {
            currentHeader.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>`;
        } else {
            currentHeader.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>`;
        }
    }
}

function exportToExcel() {
    try {
        // เตรียมข้อมูลสำหรับ Excel
        const excelData = filteredTickets.map(ticket => ({
            'ชื่อ': ticket.name || '',
            'เลข': ticket.number || '',
            'ประเภท': ticket.type || '',
            'ยอดเงิน': ticket.amount || 0,
            'วันที่': ticket.date || ''
        }));

        // สร้าง worksheet
        const ws = XLSX.utils.json_to_sheet(excelData);

        // ปรับความกว้างคอลัมน์
        ws['!cols'] = [
            { wch: 20 }, // ชื่อ
            { wch: 10 }, // เลข
            { wch: 15 }, // ประเภท
            { wch: 15 }, // ยอดเงิน
            { wch: 12 }  // วันที่
        ];

        // สร้าง workbook
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "รายการลอตเตอรี่");

        // ส่งออกไฟล์
        const dateStr = new Date().toISOString().slice(0, 10);
        XLSX.writeFile(wb, `รายการลอตเตอรี่_${dateStr}.xlsx`, {
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

function showLoading(isLoading) {
    const loadingElement = document.createElement('div');
    loadingElement.id = 'loadingOverlay';
    loadingElement.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    loadingElement.innerHTML = `
    <div class="bg-white p-6 rounded-lg shadow-xl text-center">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
      <p class="text-gray-700">กำลังโหลดข้อมูล...</p>
    </div>
  `;

    if (isLoading) {
        document.body.appendChild(loadingElement);
    } else {
        const existingLoader = document.getElementById('loadingOverlay');
        if (existingLoader) {
            existingLoader.remove();
        }
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'fixed top-4 right-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 z-50 max-w-sm';
    errorDiv.innerHTML = `
    <div class="flex items-center">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <span>${message}</span>
    </div>
  `;

    document.body.appendChild(errorDiv);

    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

function debounce(func, wait) {
    let timeout;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

// ในไฟล์ report.js เพิ่มฟังก์ชันนี้
export async function getTopNumbers() {
    const tickets = await fetchLotteryTickets();

    // แยกเลข 2 ตัวท้าย
    const twoDigitNumbers = tickets.reduce((acc, ticket) => {
        const num = ticket.number?.toString().slice(-2) || '00';
        acc[num] = (acc[num] || 0) + (ticket.amount || 0);
        return acc;
    }, {});

    // แยกเลข 3 ตัวหน้า (สมมติว่ามีข้อมูลนี้)
    const threeFrontNumbers = tickets.reduce((acc, ticket) => {
        const num = ticket.number?.toString().slice(0, 3) || '000';
        acc[num] = (acc[num] || 0) + (ticket.amount || 0);
        return acc;
    }, {});

    // เรียงลำดับและเลือก Top
    const topTwoDigit = Object.entries(twoDigitNumbers)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    const topThreeFront = Object.entries(threeFrontNumbers)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    return {
        topTwoDigit,
        topThreeFront
    };
}