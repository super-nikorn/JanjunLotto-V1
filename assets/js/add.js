import { db } from "./firebase-config.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document
  .getElementById("addTicketForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const dialog = document.getElementById("addTicketDialog");
    const name = e.target.name.value;
    const number = e.target.number.value;
    const type = e.target.type.value;
    const amount = Number(e.target.amount.value);

    try {
      await addDoc(collection(db, "lottery"), {
        name,
        number,
        type,
        amount,
      });
      alert("บันทึกโพยเรียบร้อย!");
      e.target.reset();
      dialog.close();
    } catch (err) {
      alert("เกิดข้อผิดพลาด: " + err);
    }
  });
