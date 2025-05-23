// assets/js/loadModal.js
export async function loadModal() {
  try {
    const response = await fetch("components/modal.html");
    if (!response.ok) throw new Error("โหลด modal.html ไม่สำเร็จ");
    const html = await response.text();
    const div = document.createElement("div");
    div.innerHTML = html;
    document.body.appendChild(div);
  } catch (error) {
    console.error("Error loading modal:", error);
  }
}
