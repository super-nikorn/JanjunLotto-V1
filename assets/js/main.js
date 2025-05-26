// main.js
import { setupMenuToggle, setupLogoutButton } from "./nav.js";
async function loadNav() {
    const navContainer = document.getElementById("nav-placeholder");
    try {
        const response = await fetch("components/nav.html");
        const navHTML = await response.text();
        navContainer.innerHTML = navHTML;

        // หลังจากโหลด nav แล้วค่อย setup event
        setupMenuToggle();
        setupLogoutButton();
    } catch (error) {
        console.error("โหลดเมนูไม่สำเร็จ:", error);
    }
}
loadNav();