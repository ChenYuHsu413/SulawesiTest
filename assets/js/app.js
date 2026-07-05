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
  const gauges = waterCalculator.querySelector("[data-gauges]");

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  const renderGauges = (params) => {
    gauges.innerHTML = params
      .map((p) => {
        const range = p.scaleMax - p.scaleMin;
        const pos = clamp(((p.value - p.scaleMin) / range) * 100, 0, 100);
        const bandLeft = clamp(((p.idealMin - p.scaleMin) / range) * 100, 0, 100);
        const bandRight = clamp(((p.idealMax - p.scaleMin) / range) * 100, 0, 100);
        const inBand = p.value >= p.idealMin && p.value <= p.idealMax;

        return `
          <div class="gauge ${inBand ? "ok" : "off"}">
            <div class="gauge-head"><span>${p.label}</span><strong>${p.value}${p.unit}</strong></div>
            <div class="gauge-track">
              <span class="gauge-band" style="left:${bandLeft}%;width:${bandRight - bandLeft}%"></span>
              <span class="gauge-marker" style="left:${pos}%"></span>
            </div>
            <div class="gauge-scale"><span>${p.scaleMin}</span><span>理想 ${p.idealMin}–${p.idealMax}</span><span>${p.scaleMax}</span></div>
          </div>`;
      })
      .join("");
    gauges.hidden = false;
  };

  waterCalculator.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(waterCalculator);
    const ph = Number(formData.get("ph"));
    const tds = Number(formData.get("tds"));
    const temp = Number(formData.get("temp"));
    const kh = Number(formData.get("kh"));
    const blueGhostMode = formData.get("blueGhostMode") === "on";

    const issues = [];
    const optimizationNotes = [];

    if (ph < 7.5 || ph > 8.5) issues.push("pH 建議維持在 7.5–8.5");
    if (tds < 100 || tds > 200) issues.push("TDS 建議落在 100–200");
    if (temp < 26 || temp > 32) issues.push("溫度建議維持 26–32°C");
    if (kh < 3 || kh > 8) issues.push("KH 建議 3–8 dKH，維持穩定緩衝");

    if (blueGhostMode && (ph < 7.5 || kh < 3)) {
      optimizationNotes.push(
        "金眼藍幽靈發色優化：pH 或 KH 偏低時，請優先穩定 KH 緩衝與礦物底盤，避免金屬藍光澤變灰、脫殼節奏受壓",
      );
    }

    renderGauges([
      { label: "pH", value: ph, unit: "", idealMin: 7.5, idealMax: 8.5, scaleMin: 6.5, scaleMax: 9.5 },
      { label: "TDS", value: tds, unit: "", idealMin: 100, idealMax: 200, scaleMin: 50, scaleMax: 300 },
      { label: "溫度", value: temp, unit: "°C", idealMin: 26, idealMax: 32, scaleMin: 22, scaleMax: 34 },
      { label: "KH", value: kh, unit: " dKH", idealMin: 3, idealMax: 8, scaleMin: 0, scaleMax: 12 },
    ]);

    if (issues.length === 0) {
      result.textContent = blueGhostMode
        ? "金眼藍幽靈專屬模式：條件良好。可進入穩定觀察期，維持低頻餵食、成熟生物膜與穩定 KH，讓金屬藍與橘金複眼長期清晰。"
        : "條件良好：可進入穩定觀察期，少量餵食並維持微生物生態。";
      result.dataset.state = "good";
      return;
    }

    result.innerHTML =
      `需調整：${issues.join("；")}。` +
      (optimizationNotes.length > 0 ? `${optimizationNotes.join("；")}。` : "") +
      "可使用 SulaEasy 逐步校正水質，避免一次大幅震盪。" +
      ' <a class="result-cta" href="#sulaeasy">取得 SulaEasy 校正配方 →</a>';
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
      const shouldShow = filter === "all" || card.dataset.type === filter;
      card.hidden = !shouldShow;
    });
  });
});
