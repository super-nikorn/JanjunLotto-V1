// assets/js/report.js
import { db } from "./firebase-config.js";
import {
    collection,
    getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export async function initReportPage() {
    const totalEl = document.getElementById("reportTotal");
    const tableBody = document.getElementById("reportTableBody");
    const topPerTypeEl = document.getElementById("reportTopPerType");

    let total = 0;
    let numberStatsByType = {};
    let allData = [];

    const snapshot = await getDocs(collection(db, "lottery"));
    snapshot.forEach((doc) => {
        const data = doc.data();
        allData.push(data);
        total += Number(data.amount);

        if (!numberStatsByType[data.type]) numberStatsByType[data.type] = {};
        if (!numberStatsByType[data.type][data.number])
            numberStatsByType[data.type][data.number] = 0;
        numberStatsByType[data.type][data.number] += Number(data.amount);
    });

    // ✅ แสดงยอดรวม
    totalEl.textContent = total.toLocaleString("th-TH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    // ✅ แสดงตารางโพยทั้งหมด
    allData.sort((a, b) => b.amount - a.amount);
    allData.forEach((item, i) => {
        const tr = document.createElement("tr");
        tr.className = i % 2 === 0 ? "bg-white" : "bg-gray-50";
        tr.innerHTML = `
      <td class="py-2 px-4">${item.name}</td>
      <td class="py-2 px-4">${item.number}</td>
      <td class="py-2 px-4">${item.type}</td>
      <td class="py-2 px-4 text-right text-indigo-700 font-bold">${Number(
            item.amount
        ).toLocaleString("th-TH")}</td>
    `;
        tableBody.appendChild(tr);
    });

    // ✅ แสดง Top 3 รายประเภท
    const container = document.createElement("div");
    container.className =
        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4";

    for (let type in numberStatsByType) {
        const sorted = Object.entries(numberStatsByType[type])
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);

        const section = document.createElement("div");
        section.className =
            "bg-white p-4 rounded-xl shadow hover:shadow-lg transition";

        const title = document.createElement("h3");
        title.className = "font-bold text-lg mb-3 text-indigo-600";
        title.textContent = `Top 3 ${type}`;
        section.appendChild(title);

        sorted.forEach(([num, amt], idx) => {
            const item = document.createElement("div");
            item.className = "flex justify-between items-center mb-2";

            const left = document.createElement("div");
            left.innerHTML = `
        <span class="inline-block w-6 h-6 rounded-full text-white text-center mr-2 font-bold ${idx === 0
                    ? "bg-yellow-400"
                    : idx === 1
                        ? "bg-gray-400"
                        : "bg-pink-400"
                }">
          ${idx + 1}
        </span>
        <span class="font-medium">${num}</span>
      `;

            const right = document.createElement("div");
            right.className = "text-right font-semibold text-green-600";
            right.textContent = amt.toLocaleString("th-TH") + "฿";

            item.appendChild(left);
            item.appendChild(right);
            section.appendChild(item);
        });

        container.appendChild(section);
    }

    // topPerTypeEl.appendChild(container);
}
