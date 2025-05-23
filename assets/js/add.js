import { db } from "./firebase-config.js";
import {
  collection,
  query,
  getDocs,
  setDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

document
  .getElementById("addTicketForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const dialogaddTk = document.getElementById("addTicketDialog");
    const name = e.target.name.value;
    const number = e.target.number.value;
    const type = e.target.type.value;
    const amount = Number(e.target.amount.value);

    // ฟอร์แมตวันที่เป็น YYMMDD
    const now = new Date();
    const yy = String(now.getFullYear()).slice(2);
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const dateStr = `${yy}${mm}${dd}`; // เช่น 250523
    const prefix = `ticket${dateStr}`;

    try {
      // ดึงโพยทั้งหมด แล้วกรองเฉพาะของวันนี้
      const q = query(collection(db, "lottery"));
      const snapshot = await getDocs(q);
      const todayDocs = snapshot.docs.filter((doc) =>
        doc.id.startsWith(prefix)
      );

      // หาลำดับล่าสุด แล้วเพิ่ม 1
      const newIndex = todayDocs.length + 1;
      const id = `${prefix}${String(newIndex).padStart(3, "0")}`;

      // บันทึกข้อมูล
      await setDoc(doc(db, "lottery", id), {
        name,
        number,
        type,
        amount,
        date: now.toISOString().split("T")[0], // YYYY-MM-DD
      });
      alert("บันทึกโพยเรียบร้อย!");
      window.location.reload();
      e.target.reset();
      dialogaddTk.close();
    } catch (err) {
      alert("เกิดข้อผิดพลาด: " + err);
    }
  });
