import { fetchLotteryTickets } from '../api/fetch-records.js';

// ข้อมูลผลลอตเตอรี่ (ตัวอย่าง)
const lotteryResults = {
    prizes: [
        {
            id: "prizeFirst",
            number: ["251389"] // รางวัลที่ 1 (เลขท้าย 2 ตัวคือ 89)
        }
    ],
    runningNumbers: [
        {
            id: "runningNumberBackTwo",
            number: ["87"] // รางวัลเลขท้าย 2 ตัว
        },
        {
            id: "runningNumberFrontThree",
            number: ["109", "231"] // รางวัลเลขหน้า 3 ตัว
        },
        {
            id: "runningNumberBackThree",
            number: ["965", "631", "496"] // รางวัลเลขท้าย 3 ตัว
        }
    ]
};

// ฟังก์ชันตรวจสอบผลลอตเตอรี่
async function checkLotteryResults() {
    try {
        // ดึงข้อมูลตั๋วจาก Firebase
        const tickets = await fetchLotteryTickets();

        // ตรวจสอบผลลอตเตอรี่
        const checkedTickets = checkWinningTickets(tickets, lotteryResults);

        // แสดงผลลัพธ์
        displayResults(checkedTickets);

        return checkedTickets;
    } catch (error) {
        console.error("Error checking lottery results:", error);
        return [];
    }
}

// ฟังก์ชันตรวจสอบตั๋ว
function checkWinningTickets(tickets, results) {
    // ดึงข้อมูลสำคัญจากผลลอตเตอรี่
    const firstPrizeLastTwo = results.prizes[0].number[0].slice(-2); // 89
    const lastTwoPrize = results.runningNumbers.find(r => r.id === "runningNumberBackTwo").number[0]; // 87
    const frontThreePrizes = results.runningNumbers.find(r => r.id === "runningNumberFrontThree").number; // ["109", "231"]
    const backThreePrizes = results.runningNumbers.find(r => r.id === "runningNumberBackThree").number; // ["965", "631", "496"]

    return tickets.map(ticket => {
        let isWinner = false;
        let winningType = '';
        let winningNumber = '';
        let reward = 0;

        switch (ticket.type) {
            case "บน":
                if (ticket.number === firstPrizeLastTwo) {
                    isWinner = true;
                    winningType = "บน";
                    winningNumber = firstPrizeLastTwo;
                    reward = 1000;
                }
                break;

            case "ล่าง":
                if (ticket.number === lastTwoPrize) {
                    isWinner = true;
                    winningType = "ล่าง";
                    winningNumber = lastTwoPrize;
                    reward = 1000;
                }
                break;

            case "บน-ล่าง":
                if (ticket.number === firstPrizeLastTwo) {
                    isWinner = true;
                    winningType = "บน";
                    winningNumber = firstPrizeLastTwo;
                    reward = 1000;
                } else if (ticket.number === lastTwoPrize) {
                    isWinner = true;
                    winningType = "ล่าง";
                    winningNumber = lastTwoPrize;
                    reward = 1000;
                }
                break;

            case "3 ตัวหน้า":
                if (frontThreePrizes.includes(ticket.number)) {
                    isWinner = true;
                    winningType = "3 ตัวหน้า";
                    winningNumber = ticket.number;
                    reward = 4000;
                }
                break;

            case "3 ตัวท้าย":
                if (backThreePrizes.includes(ticket.number)) {
                    isWinner = true;
                    winningType = "3 ตัวท้าย";
                    winningNumber = ticket.number;
                    reward = 4000;
                }
                break;

            case "3 ตัวโต๊ด":
                const ticketNumbers = ticket.number.split('');
                for (const prizeNumber of backThreePrizes) {
                    const prizeDigits = prizeNumber.split('');
                    if (ticketNumbers.every(num => prizeDigits.includes(num))) {
                        isWinner = true;
                        winningType = "3 ตัวโต๊ด";
                        winningNumber = prizeNumber;
                        reward = 1000;
                        break;
                    }
                }
                break;
        }

        return {
            ...ticket,
            isWinner,
            winningType: isWinner ? winningType : null,
            winningNumber: isWinner ? winningNumber : null,
            reward: isWinner ? reward * ticket.amount : 0 // คูณด้วยจำนวนตั๋ว
        };
    });
}
function displayResults(tickets) {
    // แยกตั๋วที่ถูกรางวัลและไม่ถูกรางวัล
    const winners = tickets.filter(t => t.isWinner);
    const losers = tickets.filter(t => !t.isWinner);

    // อัพเดทสถิติสรุป
    totalTickets.textContent = tickets.length;
    winningTickets.textContent = winners.length;
    totalReward.textContent = winners.reduce((sum, t) => sum + t.reward, 0).toLocaleString() + ' บาท';

    // อัพเดทเวลาล่าสุด
    const now = new Date();
    lastUpdated.textContent = `อัพเดทล่าสุด: ${now.toLocaleTimeString()}`;

    // แสดงตั๋วที่ถูกรางวัลในตาราง
    winnersTable.innerHTML = '';
    winners.forEach(ticket => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td class="px-6 py-4 whitespace-nowrap">${ticket.name}</td>
      <td class="px-6 py-4 whitespace-nowrap font-mono">${ticket.number}</td>
      <td class="px-6 py-4 whitespace-nowrap">${ticket.type}</td>
      <td class="px-6 py-4 whitespace-nowrap">${ticket.winningType}</td>
      <td class="px-6 py-4 whitespace-nowrap text-right">${ticket.reward.toLocaleString()} บาท</td>
    `;
        winnersTable.appendChild(row);
    });

    // แสดงตั๋วที่ไม่ถูกรางวัล (บางส่วน)
    losersList.innerHTML = '';
    const displayLosers = losers.slice(0, 6); // แสดงเพียง 6 รายการ
    displayLosers.forEach(ticket => {
        const item = document.createElement('li');
        item.className = 'text-sm p-2 bg-gray-50 rounded';
        item.textContent = `${ticket.name} (${ticket.number}, ${ticket.type})`;
        losersList.appendChild(item);
    });

    if (losers.length > 6) {
        const moreItem = document.createElement('li');
        moreItem.className = 'text-sm p-2 text-gray-500';
        moreItem.textContent = `...และอีก ${losers.length - 6} ตั๋ว`;
        losersList.appendChild(moreItem);
    }

    // แสดงผลลัพธ์
    summaryCard.classList.remove('hidden');
    resultsSection.classList.remove('hidden');
}


// เรียกใช้งาน
document.addEventListener('DOMContentLoaded', () => {
    checkLotteryResults();
});

export { checkLotteryResults };