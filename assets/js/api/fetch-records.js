import { db } from "./firebase-config.js";
import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

async function fetchLotteryTickets() {
  try {
    const querySnapshot = await getDocs(collection(db, "lottery"));
    const tickets = [];

    querySnapshot.forEach((doc) => {
      tickets.push({
        id: doc.id, // ได้ Document ID ด้วย
        amount: doc.data().amount,
        date: doc.data().date,
        name: doc.data().name,
        number: doc.data().number,
        type: doc.data().type,
      });
    });

    // console.log("ตั๋วทั้งหมดที่ดึงมา:", tickets);

    return tickets;
  } catch (error) {
    console.error("Error fetching lottery tickets: ", error);
    return [];
  }
}

export { fetchLotteryTickets };
