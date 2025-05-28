// import {fetchLatestLottoResults, renderLottoResults} from "../api/lotteryAPI.js";

// async function loadLotteryResults() {
//     const results = await fetchLatestLottoResults();
//     console.log(results);
//     renderLottoResults(results);


// }

// document.addEventListener('DOMContentLoaded', () => {
//     loadLotteryResults();
// });

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

// 🟢 เริ่มต้น
updateAndRenderLotto();



// export function renderLottoResults(results) {
//     if (!results) return;

//     document.getElementById("lotto-round").textContent = results.date;

//     document.getElementById("first-prize").textContent =
//         results.prizes.find((p) => p.id === "prizeFirst")?.number[0] || "--";

//     document.getElementById("three-front").textContent =
//         results.runningNumbers.find((p) => p.id === "runningNumberFrontThree")?.number.join(" ") || "--";

//     document.getElementById("three-back").textContent =
//         results.runningNumbers.find((p) => p.id === "runningNumberBackThree")?.number.join(" ") || "--";

//     document.getElementById("two-digit").textContent =
//         results.runningNumbers.find((p) => p.id === "runningNumberBackTwo")?.number[0] || "--";
// }

// renderLottoResults();