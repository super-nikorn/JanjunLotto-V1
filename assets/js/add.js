// assets/js/add.js

import { db } from "./firebase-config.js";
import {
  collection,
  query,
  getDocs,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

function formatDateYYMMDD(date) {
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yy}${mm}${dd}`;
}

function generateNewTicketId(todayDocs, prefix) {
  const newIndex = todayDocs.length + 1;
  return `${prefix}${String(newIndex).padStart(3, "0")}`;
}

// ฟังก์ชัน saveTicket แค่รับข้อมูลแล้วบันทึก
export async function saveTicket({ name, number, type, amount }) {
  const now = new Date();
  const dateStr = formatDateYYMMDD(now);
  const prefix = `ticket${dateStr}`;

  const q = query(collection(db, "lottery"));
  const snapshot = await getDocs(q);
  const todayDocs = snapshot.docs.filter((doc) => doc.id.startsWith(prefix));
  const id = generateNewTicketId(todayDocs, prefix);

  await setDoc(doc(db, "lottery", id), {
    name,
    number,
    type,
    amount,
    date: now.toISOString().split("T")[0], // YYYY-MM-DD
  });
}

// ฟังก์ชันจัดการ submit form
export function setupAddTicketForm() {
  const form = document.getElementById("addTicketForm");
  const dialogaddTk = document.getElementById("addTicketDialog");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const number = form.number.value.trim();
    const type = form.type.value;
    const amount = Number(form.amount.value);
    const shouldReverse = reverseCheckbox?.checked;

    if (!name || !number || !type || !amount) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    try {
      form.querySelector('button[type="submit"]').disabled = true;
      await saveTicket({ name, number, type, amount });

      if (shouldReverse && number.length === 2 && number[0] !==number[1]) {
        const reversed = number.split("").reverse().join("");
        await saveTicket({name, number: reversed, type, amount});
      }

      alert("บันทึกโพยเรียบร้อย!");
      form.reset();
      dialogaddTk.close();

      // รีโหลดหรือรีเฟรชข้อมูลแบบอื่นก็ได้
      window.location.reload();
    } catch (err) {
      alert("เกิดข้อผิดพลาด: " + err.message);
    } finally {
      form.querySelector('button[type="submit"]').disabled = false;
    }
  });
}

// ฟังก์ชันตั้งค่า form เลข 2-3 ตัว (เหมือนเดิม)
export function setupDigitTypeForm() {
  const digitRadios = document.querySelectorAll('input[name="digitType"]');
  const numberInput = document.getElementById("numberInput");
  const typeSelect = document.getElementById("typeSelect");
  const reverseCheckbox = document.getElementById("reverseNumber")

  const typeOptions = {
    2: ["บน", "ล่าง", "บน-ล่าง"],
    "3-front": ["3 ตัวหน้า"],
    "3-back": ["3 ตัวท้าย"],
    "3-straight": ["3 ตัวตรง"],
    "3-tod": ["3 ตัวโต๊ด"],
  };

  function setDigitType(type) {
    if (type === "2") {
      numberInput.maxLength = 2;
      numberInput.pattern = "\\d{2}";
      numberInput.placeholder = "เลข 2 ตัว";
      typeSelect.disabled = false;
      reverseCheckbox.disabled = false;
    } else {
      numberInput.maxLength = 3;
      numberInput.pattern = "\\d{3}";
      numberInput.placeholder =
        type === "3-front" ? "เลข 3 ตัวหน้า" : "เลข 3 ตัวท้าย" ? "เลข 3 ตัวตรง" : "เลข 3 ตัวโต๊ด";
      typeSelect.disabled = true;
      reverseCheckbox.disabled = true;
      reverseCheckbox.checked = false;
    }

    numberInput.value = "";

    typeSelect.innerHTML = "";
    typeOptions[type].forEach((val) => {
      const option = document.createElement("option");
      option.value = val;
      option.textContent = val;
      typeSelect.appendChild(option);
    });
  }

  digitRadios.forEach((radio) => {
    radio.addEventListener("change", () => {
      setDigitType(radio.value);
    });
  });

  document
    .querySelector('input[name="digitType"]:checked')
    ?.dispatchEvent(new Event("change"));
}


export function setupDigitTypeHighlight() {
  const group = document.getElementById("digitTypeGroup");
  const labels = group.querySelectorAll("label");

  labels.forEach((label) => {
    const input = label.querySelector("input");
    input.addEventListener("change", () => {
      labels.forEach((lbl) => lbl.classList.remove("bg-indigo-100", "border-indigo-500"));
      label.classList.add("bg-indigo-100", "border-indigo-500");
    });

    // เช็คว่า checked อยู่แล้วตอนโหลด
    if (input.checked) {
      label.classList.add("bg-indigo-100", "border-indigo-500");
    }
  });
}

export function toogglenumberOperation(){

}