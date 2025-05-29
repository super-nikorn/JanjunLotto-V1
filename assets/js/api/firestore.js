import { db } from "./firebase-config.js";
import { doc, getDoc, setDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// ตรวจว่าข้อมูลงวดนี้มีหรือยัง
export async function checkIfRoundExists(date) {
    const ref = doc(db, "lottoResults", date);
    const snap = await getDoc(ref);
    return snap.exists();
}

// ✅ บันทึกเฉพาะข้อมูลที่ต้องการ
export async function saveLottoResultFiltered(data) {
    const filtered = {
        date: data.date,
        firstPrize: data.prizes.find(p => p.id === "prizeFirst")?.number[0] || "--",
        threeFront: data.runningNumbers.find(p => p.id === "runningNumberFrontThree")?.number || [],
        threeBack: data.runningNumbers.find(p => p.id === "runningNumberBackThree")?.number || [],
        twoDigit: data.runningNumbers.find(p => p.id === "runningNumberBackTwo")?.number[0] || "--",
    };

    const ref = doc(db, "lottoResults", filtered.date);
    await setDoc(ref, filtered);
    console.log(`✅ บันทึกงวด ${filtered.date} แล้ว (เฉพาะข้อมูลที่ต้องการ)`);
}

// ดึงข้อมูลงวด
export async function getLottoResult(date) {
    const ref = doc(db, "lottoResults", date);
    const snap = await getDoc(ref);
    return snap.exists() ? snap.data() : null;
}


export async function getAllLottoDates() {
    try {
        const querySnapshot = await getDocs(collection(db, "lottoResults"));
        const dates = [];
        
        querySnapshot.forEach((doc) => {
            dates.push(doc.id); // ใช้ doc.id เพราะเราใช้ date เป็น document ID
        });
        
        return dates;
    } catch (error) {
        console.error("Error fetching lotto dates: ", error);
        return [];
    }
}