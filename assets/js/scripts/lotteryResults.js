import {fetchLatestLottoResults, renderLottoResults} from "../api/lotteryAPI.js";

async function loadLotteryResults() {
    const results = await fetchLatestLottoResults();
    console.log(results);
    renderLottoResults(results);


}

document.addEventListener('DOMContentLoaded', () => {
    loadLotteryResults();
});