// assets/js/home.js
import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export async function initHomePage() {
  const dataList = document.getElementById("dataList");
  const totalAmount = document.getElementById("totalAmount");
  const topNumber = document.getElementById("topNumber");
  const topPerTypeEl = document.getElementById("topPerType");

  let total = 0;
  let numberStats = {};
  let statsByType = {};
  const dataArray = [];

  // 1. ดึงข้อมูลทั้งหมดจาก Firestore
  const querySnapshot = await getDocs(collection(db, "lottery"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    dataArray.push(data);
    total += Number(data.amount);

    // รวมตามหมายเลข
    if (!numberStats[data.number]) numberStats[data.number] = 0;
    numberStats[data.number] += Number(data.amount);

    // รวมตามประเภทและหมายเลข
    if (!statsByType[data.type]) statsByType[data.type] = {};
    if (!statsByType[data.type][data.number])
      statsByType[data.type][data.number] = 0;
    statsByType[data.type][data.number] += Number(data.amount);
  });

  // 2. เรียงข้อมูลจากมากไปน้อย
  dataArray.sort((a, b) => b.amount - a.amount);

  // 3. แสดงรายการโพยในตาราง
  dataArray.forEach((data, index) => {
    const tr = document.createElement("tr");
    tr.className = `${index % 2 === 0 ? "bg-white" : "bg-gray-50"
      } border-b border-gray-200 hover:bg-indigo-50 transition`;
    tr.innerHTML = `
      <td class="py-2 px-4">${data.name}</td>
      <td class="py-2 px-4">${data.number}</td>
      <td class="py-2 px-4">${data.type}</td>
      <td class="py-2 px-4 text-right text-indigo-700 font-semibold">${Number(
      data.amount
    ).toLocaleString("th-TH")}</td>
    `;
    dataList.appendChild(tr);
  });

  // 4. แสดงยอดรวมทั้งหมด
  totalAmount.textContent = total.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  // 6. แสดง Top 3 ของแต่ละประเภท
  topPerTypeEl.innerHTML = "";
  const container = document.createElement("div");
  container.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl";

  for (let type in statsByType) {
    const numberAmountMap = statsByType[type];
    const sortedTop = Object.entries(numberAmountMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    // ตรวจสอบว่ามีข้อมูลหรือไม่
    if (sortedTop.length === 0) continue;

    const section = document.createElement("div");
    section.classList.add(
      "bg-white",
      "p-4",
      "rounded-xl",
      "shadow-md",
      "hover:shadow-lg",
      "transition-all",
      "duration-200",
      // "border-l-4",
      // type.includes("บน") ? "border-blue-500" :
      //   type.includes("ล่าง") ? "border-green-500" :
      //     type.includes("โต๊ด") ? "border-purple-500" :
      //       type.includes("ตรง") ? "border-red-500" :
      //         type.includes("หน้า") ? "border-amber-500" :
      //           type.includes("ท้าย") ? "border-cyan-500" :
                  // "border-indigo-500"
    );

    const title = document.createElement("h3");
    title.className = "text-lg font-bold mb-3 flex items-center";

    // เพิ่มไอคอนตามประเภท
    const icon = document.createElement("span");
    icon.className = "mr-2";
    icon.innerHTML = type.includes("บน") ? "🔝" :
      type.includes("ล่าง") ? "🔻" :
        type.includes("โต๊ด") ? "🎯" :
          type.includes("ตรง") ? "✨" :
            type.includes("หน้า") ? "👆" :
              type.includes("ท้าย") ? "👇" : "🏅";

    title.appendChild(icon);
    title.appendChild(document.createTextNode(`Top ${type}`));

    const ul = document.createElement("ul");
    ul.className = "space-y-3";

    sortedTop.forEach(([num, amt], idx) => {
      const li = document.createElement("li");
      li.className = "flex justify-between items-center p-2 rounded-lg hover:bg-gray-50";
      li.innerHTML = `
      <div class="flex items-center">
        <span class="w-7 h-7 flex items-center justify-center rounded-full 
          ${idx === 0 ? 'bg-yellow-400' : idx === 1 ? 'bg-gray-300' : 'bg-pink-300'} 
          text-white font-bold mr-3">
          ${idx + 1}
        </span>
        <span class="font-bold text-gray-800">${num}</span>
      </div>
      <span class="font-bold ${idx === 0 ? 'text-green-600' : 'text-blue-600'}">
        ${amt.toLocaleString("th-TH")}฿
      </span>
    `;
      ul.appendChild(li);
    });

    section.appendChild(title);
    section.appendChild(ul);
    container.appendChild(section);
  }

  topPerTypeEl.appendChild(container);

  topPerTypeEl.appendChild(container);

  // 7. ดึงข้อมูลหวยจาก API ภายนอก
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
}