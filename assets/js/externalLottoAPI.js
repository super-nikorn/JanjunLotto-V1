export async function fetchLatestLottoResults() {
    try {
        const response = await fetch("https://lotto.api.rayriffy.com/latest");
        const data = await response.json();
        return data.response;
    } catch (error) {
        console.error("Fetch lotto API error:", error);
        return null;
    }
}

export function renderLottoResults(results) {
    if (!results) return;

    document.getElementById("lotto-round").textContent = results.date;

    document.getElementById("first-prize").textContent =
        results.prizes.find((p) => p.id === "prizeFirst")?.number[0] || "--";

    document.getElementById("three-front").textContent =
        results.runningNumbers.find((p) => p.id === "runningNumberFrontThree")?.number.join(" ") || "--";

    document.getElementById("three-back").textContent =
        results.runningNumbers.find((p) => p.id === "runningNumberBackThree")?.number.join(" ") || "--";

    document.getElementById("two-digit").textContent =
        results.runningNumbers.find((p) => p.id === "runningNumberBackTwo")?.number[0] || "--";
}