import { db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const dataList = document.getElementById("dataList");
const totalAmount = document.getElementById("totalAmount");
const topNumber = document.getElementById("topNumber");

let total = 0;
let numberStats = {};

const querySnapshot = await getDocs(collection(db, "lottery"));

let index = 0;

querySnapshot.forEach((doc) => {
  const data = doc.data();

  // ✅ สร้าง <tr> และเพิ่มคลาสสลับสี
  const tr = document.createElement("tr");
  tr.className = `${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-gray-200 hover:bg-indigo-50 transition`;

  tr.innerHTML = `
    <td class="py-2 px-4">${data.name}</td>
    <td class="py-2 px-4">${data.number}</td>
    <td class="py-2 px-4">${data.type}</td>
    <td class="py-2 px-4 text-right text-indigo-700 font-semibold">${data.amount}</td>
  `;

  dataList.appendChild(tr);
  index++;

  // รวมยอดเงินทั้งหมด
  total += Number(data.amount);

  // เก็บสถิติเลข
  if (!numberStats[data.number]) numberStats[data.number] = 0;
  numberStats[data.number] += Number(data.amount);
});

// แสดงยอดรวม
totalAmount.textContent = total.toLocaleString('th-Th', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

// หาค่าเลขที่มียอดรวมเยอะสุด
let maxNum = "-";
let maxAmt = 0;
for (let num in numberStats) {
  if (numberStats[num] > maxAmt) {
    maxAmt = numberStats[num];
    maxNum = num;
  }
}
topNumber.textContent = `${maxNum} (${maxAmt.toLocaleString('th-Th', {
  minimumFractionDigits:2,
  maximumFractionDigits:2
})})`;
