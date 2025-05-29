import { setupMenuToggle, setupLogoutButton } from "./nav.js";

async function loadComponent(url, containerId) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`ไม่สามารถโหลด ${url}`);
        const html = await response.text();
        document.getElementById(containerId).innerHTML = html;
        return true;
    } catch (error) {
        console.error(`เกิดข้อผิดพลาดในการโหลด ${url}:`, error);
        return false;
    }
}

async function loadNav() {
    const navLoaded = await loadComponent("components/nav.html", "nav-placeholder");
    if (navLoaded) {
        setupMenuToggle();
        setupLogoutButton();
    }
}

async function loadLottoDisplay() {
    const lottoLoaded = await loadComponent("components/lottoDisplay.html", "lotto-placeholder");
    if (lottoLoaded) {
        try {
            await import("./scripts/lotteryResults.js");
        } catch (error) {
            console.error("โหลดสคริปต์ lotteryResults ล้มเหลว:", error);
        }
    }
}

async function init() {
    await loadNav();
    await loadLottoDisplay();
}

init();
