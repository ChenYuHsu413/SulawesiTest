// api/chat.js — Vercel Serverless Function（Node.js runtime）
// 把前端聊天訊息轉發給「免費」LLM 供應商，並依序 fallback：Groq → Gemini → OpenRouter。
//
// 在 Vercel 專案的 Settings → Environment Variables 設定金鑰（至少一組即可，越多 fallback 越穩）：
//   GROQ_API_KEY        取得：https://console.groq.com/keys
//   GEMINI_API_KEY      取得：https://aistudio.google.com/app/apikey
//   OPENROUTER_API_KEY  取得：https://openrouter.ai/keys
//
// 選用：ALLOWED_ORIGINS = 逗號分隔的來源網域（僅在前端與本 API 不同網域時才需要，例如前端留在 GitHub Pages）。
//   例：ALLOWED_ORIGINS=https://chenyuhsu413.github.io
//   同網域部署（前端也放 Vercel）時可留空，無需 CORS。

const SYSTEM_PROMPT = `你是「蘇拉威西：原生之美 Sulawesi: Living Gems」網站的 AI 養殖顧問。
你的任務：用親切、專業、簡潔的口吻，回答蘇拉威西蝦（Sulawesi shrimp）的養殖問題，以及本站產品 SulaEasy 水質調整劑的相關問題。

【核心知識】
- 品種分兩類：
  1) 人工選育色系（野外不存在，皆源自紅衣主教 Caridina dennerli）：金眼藍幽靈 Blue Ghost（本站旗艦，難度約 2/10）、白蘭花 White Orchid、銀河 Galaxy、虎紋 Tigris。
  2) 野生原生物種：紅衣主教／白襪（Caridina dennerli，瑪塔諾湖，難度約 2/10）、藍腳波索（Caridina caerulea，波索湖，最好養，約 1/10）、小丑蝦（Caridina woltereckae，圖蒂湖，較難）、黃鼻（Caridina spinata，圖蒂湖，較難）。
  重點：藍腳波索與白蘭花是不同的東西——前者是波索湖的獨立物種，後者是瑪塔諾湖 dennerli 的選育色系。
- 水質建議（缸內目標／瑪塔諾湖原生值）：pH 7.5–8.5（原生約 8.5）、TDS 100–200（原生 180–220）、GH 4–6（原生約 7）、KH 3–8 且要穩定（原生約 5）、溫度 26–32°C（原生 27–31）。
- 這群蝦對硝酸鹽／磷酸鹽極敏感，需要成熟缸與穩定生物膜；新蝦入缸請以滴流方式對水 60–90 分鐘，降低休克與到貨暴斃。
- 穩定的 KH 是旗艦品系發色、脫殼與橘金複眼清晰度的關鍵。
- SulaEasy 水質調整劑：以標準化礦物與緩衝系統，達成「開缸三日放蝦」的可複製流程，並維持穩定 KH 與礦物底盤。

【規則】
- 只回答蘇拉威西蝦養殖與本站產品相關問題。若被問到無關主題，禮貌地把話題帶回蘇蝦養殖。
- 不要編造事實。不知道就說不知道，並建議加入「活寶石養殖社群」交流或聯繫本站。
- 不要編造價格、庫存或運送資訊——這類請引導使用者透過網站聯繫。
- 回答盡量精簡（通常 2–4 句），必要時可條列。預設用繁體中文；若使用者用其他語言發問，就用該語言回答。
- 你是 AI 助理，不要假裝是真人。`;

// Fallback 順序 = 陣列順序。可自由調整或註解掉不用的供應商。
// 模型 ID 為 2026 年初的免費層預設值；若某供應商更名模型，改這裡即可。
const PROVIDERS = [
  { name: "groq", model: "llama-3.3-70b-versatile", call: callGroq },
  { name: "gemini", model: "gemini-2.0-flash", call: callGemini },
  { name: "openrouter", model: "meta-llama/llama-3.3-70b-instruct:free", call: callOpenRouter },
];

module.exports = async function handler(req, res) {
  // CORS：僅在前端與本 API 不同網域時才需要（透過 ALLOWED_ORIGINS 設定）
  const allowed = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const origin = req.headers.origin;
  if (origin && allowed.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  }
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const messages = Array.isArray(body && body.messages) ? body.messages : [];
  const trimmed = messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-12) // 只保留最近 12 則，控制成本與延遲
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

  if (trimmed.length === 0) return res.status(400).json({ error: "messages required" });

  const errors = [];
  for (const p of PROVIDERS) {
    const key = keyFor(p.name);
    if (!key) continue; // 沒設這個供應商的金鑰就跳過
    try {
      const reply = await p.call({ key, model: p.model, system: SYSTEM_PROMPT, messages: trimmed });
      if (reply && reply.trim()) {
        return res.status(200).json({ reply: reply.trim(), provider: p.name });
      }
      errors.push(`${p.name}: empty reply`);
    } catch (e) {
      errors.push(`${p.name}: ${e.message}`);
    }
  }

  return res.status(502).json({
    error: "AI 顧問目前忙線中，請稍後再試 🙏",
    detail: errors, // 部署後可在 Vercel 的 Function Logs 看到各供應商的失敗原因
  });
};

function keyFor(name) {
  return {
    groq: process.env.GROQ_API_KEY,
    gemini: process.env.GEMINI_API_KEY,
    openrouter: process.env.OPENROUTER_API_KEY,
  }[name];
}

// --- 各供應商轉接器（皆回傳純文字字串）---

// Groq 與 OpenRouter 都是 OpenAI 相容的 chat/completions 格式
async function callOpenAICompatible(url, key, model, system, messages, extraHeaders) {
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}`, ...(extraHeaders || {}) },
    body: JSON.stringify({
      model,
      messages: [{ role: "system", content: system }, ...messages],
      temperature: 0.3,
      max_tokens: 800,
    }),
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status} ${(await resp.text()).slice(0, 200)}`);
  const data = await resp.json();
  return (data && data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "";
}

function callGroq({ key, model, system, messages }) {
  return callOpenAICompatible("https://api.groq.com/openai/v1/chat/completions", key, model, system, messages);
}

function callOpenRouter({ key, model, system, messages }) {
  return callOpenAICompatible("https://openrouter.ai/api/v1/chat/completions", key, model, system, messages, {
    "HTTP-Referer": "https://sulawesi-living-gems", // OpenRouter 建議帶的歸屬標頭（選用）
    "X-Title": "Sulawesi Living Gems",
  });
}

// Gemini 的請求格式不同：contents[] 用 role "user"/"model"，system 走 systemInstruction
async function callGemini({ key, model, system, messages }) {
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(key)}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents,
      generationConfig: { temperature: 0.3, maxOutputTokens: 800 },
    }),
  });
  if (!resp.ok) throw new Error(`HTTP ${resp.status} ${(await resp.text()).slice(0, 200)}`);
  const data = await resp.json();
  const parts = data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts;
  return (parts || []).map((p) => p.text || "").join("");
}
