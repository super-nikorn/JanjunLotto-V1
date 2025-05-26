import {fetchLatestLottoResults, renderLottoResults} from "../js/api/lotteryAPI.js";

async function loadLotteryResults() {
    const results = await fetchLatestLottoResults();
    renderLottoResults(results);


}

document.addEventListener('DOMContentLoaded', () => {
    loadLotteryResults();
});