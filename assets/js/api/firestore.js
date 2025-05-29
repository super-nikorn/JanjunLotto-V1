import { db } from "./firebase-config.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { fetchLatestLottoResults } from "./lotteryAPI.js";
import { getNextLottoDate } from "./nextLotto-round.js"; // ✅ ต้องสร้างไฟล์ utils.js แยกด้วย

// ตรวจว่าข้อมูลงวดนี้มีหรือยัง
export async function checkIfRoundExists(date) {
    const ref = doc(db, "lottoLatest", date);
    const snap = await getDoc(ref);
    return snap.exists();
}

export async function saveLottoResultFiltered(data) {
    if (!data || !data.date) {
        console.error("❌ ไม่มีข้อมูลหรือฟอร์แมตข้อมูลไม่ถูกต้อง");
        return;
    }

    // เช็คว่า data.prizes และ data.runningNumbers มีข้อมูลก่อนใช้งาน
    const prizes = Array.isArray(data.prizes) ? data.prizes : [];
    const runningNumbers = Array.isArray(data.runningNumbers) ? data.runningNumbers : [];

    const filtered = {
        date: data.date,
        firstPrize: prizes.find(p => p.id === "prizeFirst")?.number?.[0] || "--",
        threeFront: runningNumbers.find(p => p.id === "runningNumberFrontThree")?.number || [],
        threeBack: runningNumbers.find(p => p.id === "runningNumberBackThree")?.number || [],
        twoDigit: runningNumbers.find(p => p.id === "runningNumberBackTwo")?.number?.[0] || "--",
        isPlaceholder: false,  // แสดงว่าข้อมูลนี้คือผลจริง
    };

    const ref = doc(db, "lottoLatest", filtered.date);

    // เขียนทับโดยไม่ลบฟิลด์อื่น ๆ ใน document
    await setDoc(ref, filtered, { merge: true });

    console.log(`✅ บันทึกงวด ${filtered.date} แล้ว (เฉพาะข้อมูลที่ต้องการ)`);
}


// ✅ สร้างเอกสารเปล่าสำหรับงวดถัดไป
export async function createNextRoundIfNotExists(nextDate) {
    const ref = doc(db, "lottoLatest", nextDate);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
        await setDoc(ref, {
            date: nextDate,
            firstPrize: null,
            threeFront: [],
            threeBack: [],
            twoDigit: null,
            isPlaceholder: true, // 🔍 ใช้ flag นี้เพื่อแยกข้อมูลเปล่า
        });
        console.log(`📝 สร้างเอกสารล่วงหน้างวด ${nextDate} แล้ว`);
    } else {
        console.log(`ℹ️ เอกสารงวด ${nextDate} มีอยู่แล้ว`);
    }
}


// ✅ เรียกใช้งานเมื่อไฟล์โหลด
(async () => {
    const data = await fetchLatestLottoResults();
    if (data) {
        const exists = await checkIfRoundExists(data.date);
        if (!exists) {
            await saveLottoResultFiltered(data);
        } else {
            console.log(`ℹ️ งวด ${data.date} มีอยู่แล้วในฐานข้อมูล`);
        }
    }

    // ✅ สร้างงวดถัดไปล่วงหน้า
    const nextDate = getNextLottoDate();
    await createNextRoundIfNotExists(nextDate);
})();


