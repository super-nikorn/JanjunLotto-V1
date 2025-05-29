export function getNextLottoDate() {
    const today = new Date();
    const day = today.getDate();
    const month = today.getMonth(); // 0-based
    const year = today.getFullYear();

    let nextDate;

    if (day < 1) {
        nextDate = new Date(year, month, 1);
    } else if (day < 16) {
        nextDate = new Date(year, month, 16);
    } else {
        nextDate = new Date(year, month + 1, 1); // งวดหน้าเดือนถัดไป
    }

    // แปลงเป็น yyyy-mm-dd
    return nextDate.toISOString().split("T")[0];
}
