import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const dataList = document.getElementById("dataList");
const totalAmount = document.getElementById("totalAmount");
const topNumber = document.getElementById("topNumber");

let total = 0;
let numberStats = {};

// ✅ 1. ดึงข้อมูลทั้งหมดมาใส่ในอาเรย์ก่อน
const querySnapshot = await getDocs(collection(db, "lottery"));
const dataArray = [];

querySnapshot.forEach((doc) => {
  const data = doc.data();
  dataArray.push(data);

  // รวมยอดเงินทั้งหมด
  total += Number(data.amount);

  // เก็บสถิติเลข
  if (!numberStats[data.number]) numberStats[data.number] = 0;
  numberStats[data.number] += Number(data.amount);
});

// ✅ 2. เรียงจากมากไปน้อยตาม amount
dataArray.sort((a, b) => b.amount - a.amount);

// ✅ 3. สร้าง <tr> ตามลำดับใหม่
dataArray.forEach((data, index) => {
  const tr = document.createElement("tr");
  tr.className = `${
    index % 2 === 0 ? "bg-white" : "bg-gray-50"
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

// ✅ แสดงยอดรวม
totalAmount.textContent = total.toLocaleString("th-TH", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// ✅ หาค่าเลขที่มียอดรวมเยอะสุด
let maxNum = "-";
let maxAmt = 0;
for (let num in numberStats) {
  if (numberStats[num] > maxAmt) {
    maxAmt = numberStats[num];
    maxNum = num;
  }
}
topNumber.textContent = `${maxNum} (${maxAmt.toLocaleString("th-TH", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})})`;

fetch("https://lotto.api.rayriffy.com/latest")
  .then(response => response.json())
  .then(data => {
    const result = data.response;
    document.getElementById("lotto-round").textContent = result.date;

    const firstPrize = result.prizes.find(p => p.id === "prizeFirst");
    document.getElementById("first-prize").textContent = firstPrize?.number[0] || "--";

    const frontThree = result.runningNumbers.find(p => p.id === "runningNumberFrontThree");
    document.getElementById("three-front").textContent = frontThree?.number.join(" ") || "--";

    const backThree = result.runningNumbers.find(p => p.id === "runningNumberBackThree");
    document.getElementById("three-back").textContent = backThree?.number.join(" ") || "--";

    const twoDigit = result.runningNumbers.find(p => p.id === "runningNumberBackTwo");
    document.getElementById("two-digit").textContent = twoDigit?.number[0] || "--";
  });
