import { db } from './firebase-config.js';
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const dataList = document.getElementById("dataList");
const totalAmount = document.getElementById("totalAmount");
const topNumber = document.getElementById("topNumber");

let total = 0;
let numberStats = {};

const querySnapshot = await getDocs(collection(db, "lottery"));

querySnapshot.forEach((doc) => {
  const data = doc.data();
  const row = `<tr>
    <td>${data.name}</td>
    <td>${data.number}</td>
    <td>${data.type}</td>
    <td>${data.amount}</td>
  </tr>`;
  dataList.innerHTML += row;

  total += Number(data.amount);

  if (!numberStats[data.number]) numberStats[data.number] = 0;
  numberStats[data.number] += Number(data.amount);
});

totalAmount.textContent = total;

// หาค่าเลขที่มียอดรวมเยอะสุด
let maxNum = "-";
let maxAmt = 0;
for (let num in numberStats) {
  if (numberStats[num] > maxAmt) {
    maxAmt = numberStats[num];
    maxNum = num;
  }
}
topNumber.textContent = `${maxNum} (${maxAmt} บาท)`;
