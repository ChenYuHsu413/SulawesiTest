const waterCalculator = document.querySelector("[data-water-calculator]");
const clipLoops = document.querySelectorAll("[data-clip-loop]");
const mobileMenuToggle = document.querySelector("[data-mobile-menu-toggle]");
const mobileMenu = document.querySelector("[data-mobile-menu]");

if (mobileMenuToggle && mobileMenu) {
  const closeMobileMenu = () => {
    mobileMenu.hidden = true;
    mobileMenuToggle.setAttribute("aria-expanded", "false");
  };

  mobileMenuToggle.addEventListener("click", () => {
    const isOpen = mobileMenuToggle.getAttribute("aria-expanded") === "true";

    mobileMenu.hidden = isOpen;
    mobileMenuToggle.setAttribute("aria-expanded", String(!isOpen));
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 768px)").matches) {
      closeMobileMenu();
    }
  });
}

clipLoops.forEach((video) => {
  const loopEnd = Number(video.dataset.clipLoop);

  video.addEventListener("timeupdate", () => {
    if (video.currentTime >= loopEnd) {
      video.currentTime = 0;
      video.play();
    }
  });
});

if (waterCalculator) {
  const result = waterCalculator.querySelector("[data-result]");

  waterCalculator.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(waterCalculator);
    const ph = Number(formData.get("ph"));
    const tds = Number(formData.get("tds"));
    const temp = Number(formData.get("temp"));

    const issues = [];

    if (ph < 7.5 || ph > 8.5) {
      issues.push("pH 建議維持在 7.5–8.5");
    }

    if (tds < 100 || tds > 200) {
      issues.push("TDS 建議落在 100–200");
    }

    if (temp < 26 || temp > 32) {
      issues.push("溫度建議維持 26–32°C");
    }

    if (issues.length === 0) {
      result.textContent = "條件良好：可進入穩定觀察期，少量餵食並維持微生物生態。";
      result.dataset.state = "good";
      return;
    }

    result.textContent = `需調整：${issues.join("；")}。可使用 SulaEasy 逐步校正水質，避免一次大幅震盪。`;
    result.dataset.state = "warn";
  });
}

const filterButtons = document.querySelectorAll("[data-filter]");
const speciesCards = document.querySelectorAll("[data-species-card]");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");

    speciesCards.forEach((card) => {
      const shouldShow = filter === "all" || card.dataset.difficulty === filter;
      card.hidden = !shouldShow;
    });
  });
});
