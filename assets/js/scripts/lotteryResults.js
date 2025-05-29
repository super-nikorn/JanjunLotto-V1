import { fetchLatestLottoResults } from "../api/lotteryAPI.js";
import { checkIfRoundExists, saveLottoResultFiltered, getLottoResult } from "../api/firestore.js";

async function updateAndRenderLotto() {
    const latest = await fetchLatestLottoResults();
    if (!latest) return;

    const alreadyExists = await checkIfRoundExists(latest.date);
    if (!alreadyExists) {
        await saveLottoResultFiltered(latest);
    } else {
        console.log(`📦 งวด ${latest.date} มีอยู่แล้ว`);
    }

    const finalData = await getLottoResult(latest.date);
    renderLottoToDOM(finalData); // ✅ แสดงบนหน้าเว็บ
}

// ✅ แสดงบนเว็บ
function renderLottoToDOM(data) {
    if (!data) return;

    document.getElementById("lotto-round").textContent = data.date;
    document.getElementById("first-prize").textContent = data.firstPrize;
    document.getElementById("three-front").textContent = data.threeFront.join(" ");
    document.getElementById("three-back").textContent = data.threeBack.join(" ");
    document.getElementById("two-digit").textContent = data.twoDigit;
}
updateAndRenderLotto();
