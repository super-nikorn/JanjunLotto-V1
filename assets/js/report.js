import { db } from "./firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export async function initReportPage() {
    try {
        // ดึงข้อมูลจาก Firestore
        const querySnapshot = await getDocs(collection(db, "lottery"));
        const dataArray = [];
        let total = 0;
        let numberStats = {};
        let statsByType = {};

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            dataArray.push(data);
            total += Number(data.amount);

            // สถิติตามหมายเลข
            if (!numberStats[data.number]) numberStats[data.number] = 0;
            numberStats[data.number] += Number(data.amount);

            // สถิติตามประเภท
            if (!statsByType[data.type]) statsByType[data.type] = {};
            if (!statsByType[data.type][data.number]) statsByType[data.type][data.number] = 0;
            statsByType[data.type][data.number] += Number(data.amount);
        });

        // เรียงลำดับข้อมูล
        dataArray.sort((a, b) => b.amount - a.amount);

        // แสดงยอดรวม
        document.getElementById('total-sales').textContent = total.toLocaleString('th-TH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        document.getElementById('total-bills').textContent = dataArray.length;

        // แสดงหมายเลขยอดนิยม (Top 5)
        const topNumbers = Object.entries(numberStats)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        const topNumbersContainer = document.getElementById('top-numbers');
        topNumbers.forEach(([num, amt], index) => {
            const div = document.createElement('div');
            div.className = 'flex justify-between items-center';
            div.innerHTML = `
                <div class="flex items-center">
                    <span class="text-gray-400 text-xs w-6">${index + 1}.</span>
                    <span class="font-medium text-gray-700">${num}</span>
                </div>
                <span class="text-indigo-600 font-medium">${amt.toLocaleString('th-TH')} ฿</span>
            `;
            topNumbersContainer.appendChild(div);
        });

        // แสดง Top ตามประเภท
        const topPerTypeContainer = document.getElementById('top-per-type');
        for (let type in statsByType) {
            const sortedTop = Object.entries(statsByType[type])
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3);

            const card = document.createElement('div');
            card.className = 'bg-white rounded-lg border border-gray-100 p-4 shadow-sm hover-scale';

            const title = document.createElement('h3');
            title.className = 'text-gray-700 font-medium text-sm mb-3';
            title.textContent = `ประเภท ${type}`;

            const list = document.createElement('div');
            list.className = 'space-y-2';

            sortedTop.forEach(([num, amt], idx) => {
                const item = document.createElement('div');
                item.className = 'flex justify-between items-center';
                item.innerHTML = `
                    <span class="text-gray-500">${idx + 1}. ${num}</span>
                    <span class="font-medium text-indigo-600">${amt.toLocaleString('th-TH')} ฿</span>
                `;
                list.appendChild(item);
            });

            card.appendChild(title);
            card.appendChild(list);
            topPerTypeContainer.appendChild(card);
        }

        // แสดงรายการล่าสุด (5 รายการ)
        const recentTransactions = document.getElementById('recent-transactions');
        dataArray.slice(0, 5).forEach(data => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-gray-50';
            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">${data.name}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">${data.number}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${data.type}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-indigo-600">${Number(data.amount).toLocaleString('th-TH')} ฿</td>
            `;
            recentTransactions.appendChild(tr);
        });

        // ดึงข้อมูลหวยจาก API
        try {
            const response = await fetch("https://lotto.api.rayriffy.com/latest");
            const data = await response.json();
            const result = data.response;

            document.getElementById("lotto-round").textContent = result.date;
            document.getElementById("first-prize").textContent =
                result.prizes.find((p) => p.id === "prizeFirst")?.number[0] || "--";
            document.getElementById("three-front").textContent =
                result.runningNumbers.find((p) => p.id === "runningNumberFrontThree")?.number.join(" ") || "--";
            document.getElementById("three-back").textContent =
                result.runningNumbers.find((p) => p.id === "runningNumberBackThree")?.number.join(" ") || "--";
            document.getElementById("two-digit").textContent =
                result.runningNumbers.find((p) => p.id === "runningNumberBackTwo")?.number[0] || "--";
        } catch (error) {
            console.error("Fetch lotto API error:", error);
        }

    } catch (error) {
        console.error("Error initializing report page:", error);
    }
}