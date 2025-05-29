// import { fetchLatestLottoResults } from "../api/lotteryAPI.js";
// import { checkIfRoundExists, saveLottoResultFiltered, getLottoResult, getAllLottoDates } from "../api/firestore.js";

// // ฟังก์ชันหลัก
// async function updateAndRenderLotto() {
//     const latest = await fetchLatestLottoResults();
//     if (!latest) return;

//     const alreadyExists = await checkIfRoundExists(latest.date);
//     if (!alreadyExists) {
//         await saveLottoResultFiltered(latest);
//     } else {
//         console.log(`📦 งวด ${latest.date} มีอยู่แล้ว`);
//     }

//     // โหลดข้อมูลทั้งหมดเพื่อสร้าง dropdown
//     await loadDateSelector();
    
//     // แสดงผลล่าสุดโดย default
//     const finalData = await getLottoResult(latest.date);
//     renderLottoToDOM(finalData);
// }

// // แสดงผลบนเว็บ
// function renderLottoToDOM(data) {
//     if (!data) return;

//     document.getElementById("lotto-round").textContent = data.date;
//     document.getElementById("first-prize").textContent = data.firstPrize;
//     document.getElementById("three-front").textContent = data.threeFront.join(" ");
//     document.getElementById("three-back").textContent = data.threeBack.join(" ");
//     document.getElementById("two-digit").textContent = data.twoDigit;
// }

// // โหลดและสร้างตัวเลือกวันที่
// async function loadDateSelector() {
//     const dateSelector = document.getElementById("date-selector");
//     dateSelector.innerHTML = "<option>กำลังโหลด...</option>";
    
//     try {
//         // สมมติว่าเราเพิ่มฟังก์ชันนี้ใน firestore.js
//         const allDates = await getAllLottoDates();
        
//         dateSelector.innerHTML = "";
        
//         // เรียงวันที่จากใหม่ไปเก่า
//         allDates.sort((a, b) => new Date(b) - new Date(a));
        
//         allDates.forEach(date => {
//             const option = document.createElement("option");
//             option.value = date;
//             option.textContent = date;
//             dateSelector.appendChild(option);
//         });
        
//         // เพิ่ม Event Listener เมื่อเลือกวันที่
//         dateSelector.addEventListener("change", async (e) => {
//             const selectedDate = e.target.value;
//             const result = await getLottoResult(selectedDate);
//             renderLottoToDOM(result);
//         });
        
//     } catch (error) {
//         console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลงวด:", error);
//         dateSelector.innerHTML = "<option>โหลดข้อมูลไม่สำเร็จ</option>";
//     }
// }

// updateAndRenderLotto();