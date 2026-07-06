# 接手指引 HANDOFF（跨電腦續作）

> 最後更新：2026-07-06　·　用途：換一台電腦、或新開 Claude/Codex session 時，讀這份就能接續蘇拉威西蝦品系研究與網站整合。

## 如何在另一台電腦接續

1. **取得專案**（實質成果都在 GitHub，非本機）：
   ```bash
   git clone https://github.com/ChenYuHsu413/SulawesiTest.git
   cd SulawesiTest
   ```
2. **設定本機 git 身分**（新 clone 需重設，僅此專案）：
   ```bash
   git config user.name "ChenYuHsu413"
   git config user.email "ChenYuHsu413@users.noreply.github.com"
   ```
3. **開 Claude Code（或其他 AI 工具）於此資料夾**，請它先讀：
   - `docs/HANDOFF.md`（本檔）
   - `docs/sulawesi-species-research.md`（完整研究筆記）
   - `docs/work-report.md` 最新一節的「待辦」
   然後說「接續 HANDOFF 的待辦」即可。
4. **帶著照片**：品系比對需要實拍照片，照片是本機檔案、不在 repo。把要比對的蝦照（HEIC 可）放到新電腦可讀取的位置再交給 AI。

> 注意：Claude Code 的對話記錄與本機 memory 綁定原電腦，不會自動同步；跨機接手一律以本 repo 內的文件為準。

## 目前進度（Done）

- 完成蘇拉威西蝦品系深度研究 → `docs/sulawesi-species-research.md`（來源/檢索紀錄齊全）。
- `species.html` 已上線新內容並經 Vercel 自動部署確認：
  - `#lookalike`「長得像卻不同種」科普區塊（species flock／活體體色辨識／隱蔽種，von Rintelen 佐證）。
  - 導覽列（桌機＋手機）加該區塊連結。
  - 對照表「黃鼻 / 黃頰 / 黃環」合併為同種 *Caridina spinata* 色相。
  - 表下「命名陷阱」提醒（藍幽靈 ≠ 藍月 ≠ 藍魔；紅蜜蜂非蘇拉威西）。
- 對話與工作報告已記錄於 `docs/log.md`（第 10 節）與 `docs/work-report.md`。
- Live 站：<https://sulawesi-test.vercel.app/species.html>

## 待辦（Next）

1. **黃環 vs 黃頰 最終判定（等照片）**：目前頁面暫定「兩者同屬 *C. spinata* 體色變異」。使用者將提供更清晰的**單隻側面全身照（含吻部）**；收到後：
   - 比對吻部齒式、步足比例、斑紋覆蓋範圍。
   - 若外觀無法定論，結論維持「需 DNA 條碼才能證明是否為不同種」。
   - 依結果決定是否於 `species.html` 加入實拍對比、或修訂 `#lookalike` 內那段暫定文字。
2. （選配）稚蝦存活率量化數據仍缺可靠養殖文獻，可再檢索。

## 關鍵結論速查

- **黃環/黃頰/黃鼻/黃斑** = 同一種 *Caridina spinata* 的體色品相；「黃橫帶繞過腹部」是 spinata 招牌特徵。未有文獻為「黃環」另立新種。
- **形態相似卻不同種**是本屬核心現象（von Rintelen & Cai 2009；von Rintelen et al. 2007 隱蔽種），紅線/小丑/紅蘭花保存後幾乎同形，靠活體體色分。
- **藍幽靈 Blue Ghost** = *C. dennerli* 藍化選育（貿易俗名，非學名）；≠ 藍月(*C. trifasciata*)、≠ 藍魔/OEBD(*C. cantonensis*)，後兩者非蘇拉威西、軟酸水。

## 產出的圖表（claude.ai 帳號登入後任一電腦可看）

- 紅底帶紋其實是多個不同種（標名實拍對比）：<https://claude.ai/code/artifact/bca81beb-af31-4487-8fb8-6434a47e3b8e>
- 黃鼻(spinata) vs 陽紋(profundicola) 對比：<https://claude.ai/code/artifact/7f27095e-f5dd-4d63-b23b-b1c0efc9f62a>
