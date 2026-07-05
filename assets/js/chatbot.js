(() => {
  // 若前端與 API 在同一個 Vercel 專案（建議），保持 "/api/chat" 即可。
  // 若前端留在 GitHub Pages、只有 API 在 Vercel，改成完整網址，例如：
  //   "https://你的專案.vercel.app/api/chat"（並在 api/chat.js 設定 ALLOWED_ORIGINS）
  const CHAT_ENDPOINT = "/api/chat";
  const GREETING =
    "嗨！我是活寶石養殖顧問 🦐 想問金眼藍幽靈、水質參數還是開缸流程，都可以問我。";
  // 開場的快速提問，點一下就會直接送出。可自由增減或修改文字。
  const SUGGESTIONS = [
    "金眼藍幽靈的水質怎麼設定？",
    "新手適合養哪一種蘇蝦？",
    "開缸多久可以放蝦？",
  ];

  const history = []; // [{ role: "user" | "assistant", content }]

  const root = document.createElement("div");
  root.className = "chatbot";
  root.innerHTML = `
    <button class="chatbot-toggle" type="button" aria-expanded="false" aria-controls="chatbot-panel" aria-label="開啟養殖顧問聊天">
      <span aria-hidden="true">💬</span>
    </button>
    <section class="chatbot-panel" id="chatbot-panel" hidden aria-label="AI 養殖顧問">
      <header class="chatbot-header">
        <div class="chatbot-title">
          <strong>活寶石養殖顧問</strong>
          <span>AI · 蘇拉威西蝦問答</span>
        </div>
        <button class="chatbot-close" type="button" aria-label="關閉聊天">×</button>
      </header>
      <div class="chatbot-log" data-log role="log" aria-live="polite"></div>
      <form class="chatbot-form" data-form>
        <input type="text" data-input autocomplete="off" placeholder="輸入你的問題…" aria-label="輸入問題" />
        <button type="submit" aria-label="送出訊息">➤</button>
      </form>
    </section>`;
  document.body.appendChild(root);

  const toggle = root.querySelector(".chatbot-toggle");
  const panel = root.querySelector(".chatbot-panel");
  const closeBtn = root.querySelector(".chatbot-close");
  const log = root.querySelector("[data-log]");
  const form = root.querySelector("[data-form]");
  const input = root.querySelector("[data-input]");

  let greeted = false;

  const openPanel = () => {
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    if (!greeted) {
      addMessage("assistant", GREETING);
      renderSuggestions();
      greeted = true;
    }
    input.focus();
  };

  const closePanel = () => {
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => (panel.hidden ? openPanel() : closePanel()));
  closeBtn.addEventListener("click", closePanel);

  function addMessage(role, text) {
    const el = document.createElement("div");
    el.className = `chatbot-msg ${role}`;
    el.textContent = text;
    log.appendChild(el);
    log.scrollTop = log.scrollHeight;
    return el;
  }

  function renderSuggestions() {
    const wrap = document.createElement("div");
    wrap.className = "chatbot-suggestions";
    SUGGESTIONS.forEach((q) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chatbot-chip";
      chip.textContent = q;
      chip.addEventListener("click", () => {
        wrap.remove();
        sendMessage(q);
      });
      wrap.appendChild(chip);
    });
    log.appendChild(wrap);
    log.scrollTop = log.scrollHeight;
  }

  async function sendMessage(text) {
    text = (text || "").trim();
    if (!text) return;

    // 送出後就移除開場的快速提問（若還在）
    const suggestions = log.querySelector(".chatbot-suggestions");
    if (suggestions) suggestions.remove();

    addMessage("user", text);
    history.push({ role: "user", content: text });

    const typing = addMessage("assistant", "…");
    typing.classList.add("typing");
    input.disabled = true;

    try {
      const resp = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      const data = await resp.json().catch(() => ({}));
      typing.classList.remove("typing");

      if (!resp.ok || !data.reply) {
        typing.textContent = data.error || "抱歉，暫時無法回覆，請稍後再試。";
        return;
      }
      typing.textContent = data.reply;
      history.push({ role: "assistant", content: data.reply });
    } catch (err) {
      typing.classList.remove("typing");
      typing.textContent = "連線發生問題，請確認網路後再試一次。";
    } finally {
      input.disabled = false;
      input.focus();
      log.scrollTop = log.scrollHeight;
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    sendMessage(text);
  });
})();
