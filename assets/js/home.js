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
  for (let type in statsByType) {
    const numberAmountMap = statsByType[type];
    const sortedTop = Object.entries(numberAmountMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    const section = document.createElement("div");
    section.classList.add(
      "bg-white",
      "p-3",
      "rounded-lg",
      "border",
      "border-gray-100",
      "shadow-sm",
      "mb-3"
    );

    const title = document.createElement("h3");
    title.className = "text-gray-700 font-medium text-sm mb-2";
    title.textContent = `Top ${type}`;

    const ul = document.createElement("ul");
    ul.className = "text-gray-600 text-sm space-y-2";

    sortedTop.forEach(([num, amt], idx) => {
      const li = document.createElement("li");
      li.className = "flex justify-between items-center";

      const rankAndNumber = document.createElement("span");
      rankAndNumber.className = "text-gray-500";
      rankAndNumber.textContent = `${idx + 1}. ${num}`;

      const amount = document.createElement("span");
      amount.className = "font-medium text-indigo-600";
      amount.textContent = `${amt.toLocaleString("th-TH")}฿`;

      li.appendChild(rankAndNumber);
      li.appendChild(amount);
      ul.appendChild(li);
    });

    section.appendChild(title);
    section.appendChild(ul);
    topPerTypeEl.appendChild(section);
  }

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
