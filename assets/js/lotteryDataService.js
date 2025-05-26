import { db } from "./api/firebase-config.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export async function fetchLotteryData() {
    const querySnapshot = await getDocs(collection(db, "lottery"));
    return querySnapshot.docs.map(doc => doc.data());
}