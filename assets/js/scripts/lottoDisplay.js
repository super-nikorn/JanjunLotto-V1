import { fetchAllRounds, fetchRoundData } from "../api/firestore.js";

export async function setupLottoDisplay() {
    const roundSelect = document.getElementById("round-select");
    const roundText = document.getElementById("lotto-round");

    const firstPrize = document.getElementById("firstPrize");
    const threeFront = document.getElementById("threeFront");
    const threeBack = document.getElementById("threeBack");
    const twoDigit = document.getElementById("twoDigit");

    // โหลดรายการงวดทั้งหมด
    const rounds = await fetchAllRounds();

    // เติม dropdown
    roundSelect.innerHTML = rounds.map(date =>
        `<option value="${date}">${date}</option>`
    ).join("");

    // โหลดข้อมูลงวดล่าสุด
    const latestDate = rounds[0];
    roundSelect.value = latestDate;
    updateDisplay(latestDate);

    // เมื่อผู้ใช้เปลี่ยนงวด
    roundSelect.addEventListener("change", (e) => {
        const selectedDate = e.target.value;
        if (selectedDate) updateDisplay(selectedDate);
    });

    async function updateDisplay(date) {
        const data = await fetchRoundData(date);
        if (!data) return;

        roundText.textContent = data.date || "--";
        firstPrize.textContent = data.firstPrize || "--";
        threeFront.textContent = (data.threeFront || []).join(", ");
        threeBack.textContent = (data.threeBack || []).join(", ");
        twoDigit.textContent = data.twoDigit || "--";
    }
}
