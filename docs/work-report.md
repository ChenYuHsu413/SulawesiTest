# SulawesiTest 工作報告

## DemoLink

[DemoLink](https://chenyuhsu413.github.io/SulawesiTest/)

## 工作摘要

本次工作完成「蘇拉威西：原生之美 Sulawesi: Living Gems」靜態形象網站的初版建置、README 文件建立、Git repository 初始化，以及首次推送至 GitHub。

網站內容包含首頁、品種百科頁、分離式 CSS/JS、實拍照片與影片素材引用，並加入水質參數計算器與品種難度篩選器，符合高單價觀賞活體的極簡奢華品牌定位。

## 完成項目

- 建立 `index.html` 首頁。
- 建立 `species.html` 品種百科頁。
- 建立 `assets/css/styles.css`，集中管理視覺樣式。
- 建立 `assets/js/app.js`，集中管理互動功能。
- 引用 `sources/` 內的實拍照片與影片素材。
- 加入 Hero 影片 5.5 秒循環控制。
- 加入水質參數計算器。
- 加入品種難度篩選器。
- 建立 `README.md`，包含 GitHub Pages DemoLink。
- 初始化 Git repository。
- 建立 initial commit。
- 設定 GitHub remote。
- 將分支改名為 `main`。
- 推送至 GitHub。
- 拆分 `docs/log.md` 與 `docs/work-report.md`，讓對話紀錄與工作報告分開管理。

## 執行指令紀錄

### 檢查專案狀態

```bash
Get-ChildItem -Force
git status --short
```

結果：一開始資料夾尚未初始化為 Git repository。

### 初始化 Git

```bash
git init
```

結果：

```text
Initialized empty Git repository in D:/AI Class ChenYu/SulawesiTest/.git/
```

### 設定本機 Git 提交身分

```bash
git config user.name ChenYuHsu413
git config user.email ChenYuHsu413@users.noreply.github.com
```

說明：此設定為 repository local config，僅套用於本專案。

### 加入檔案

```bash
git add README.md assets index.html sources species.html
```

結果：檔案成功加入 stage。Git 提示 Windows 環境下 LF 之後可能轉為 CRLF，未影響提交。

### 建立初始提交

```bash
git commit -m "Initial Sulawesi landing pages"
```

結果：

```text
[master (root-commit) bbd7e08] Initial Sulawesi landing pages
20 files changed, 933 insertions(+)
```

### 設定 GitHub remote

```bash
git remote add origin https://github.com/ChenYuHsu413/SulawesiTest.git
```

### 將分支改名為 main

```bash
git branch -M main
```

### 第一次推送嘗試

```bash
git push -u origin main
```

結果：第一次在沙盒環境中因 GitHub HTTPS 憑證不可用而失敗。

```text
fatal: unable to access 'https://github.com/ChenYuHsu413/SulawesiTest.git/':
schannel: AcquireCredentialsHandle failed: SEC_E_NO_CREDENTIALS (0x8009030e)
```

### 使用系統 GitHub 憑證推送

```bash
git push -u origin main
```

結果：因 repository 所有者與系統使用者不同，Git 要求加入 safe.directory。

```text
fatal: detected dubious ownership in repository at 'D:/AI Class ChenYu/SulawesiTest'
```

### 加入 safe.directory

```bash
git config --global --add safe.directory "D:/AI Class ChenYu/SulawesiTest"
```

### 推送至 GitHub

```bash
git push -u origin main
```

結果：

```text
branch 'main' set up to track 'origin/main'.
To https://github.com/ChenYuHsu413/SulawesiTest.git
 * [new branch]      main -> main
```

### 新增工作日誌

```bash
git add docs/log.md
git commit -m "Add project work log"
git push
```

結果：本機 commit 成功，推送時因 GitHub refresh token 已被撤銷而失敗。

```text
[main 6e79016] Add project work log
1 file changed, 163 insertions(+)
create mode 100644 docs/log.md
```

```text
Your access token could not be refreshed because your refresh token was revoked.
Please log out and sign in again.
```

## GitHub 狀態

- Repository：`https://github.com/ChenYuHsu413/SulawesiTest.git`
- Branch：`main`
- Tracking：`main` tracks `origin/main`
- Initial commit：`bbd7e08 Initial Sulawesi landing pages`
- Work log commit：`6e79016 Add project work log`

## 備註

- 目前網站以靜態 HTML/CSS/JS 建置。
- 網站頁面目前已改用 `assets/media/` 內 WebP 圖片與 MP4 影片，以提升桌機 Chrome/Edge/Safari 的相容性。
- 若要啟用 GitHub Pages，建議在 GitHub repository 的 Pages 設定中選擇 `main` branch 與 root 目錄。

## 後續更新：手機版導覽列

### 更新摘要

修正手機版看不到主要導覽列的問題。原本頁首導覽使用 Tailwind `hidden md:flex`，在手機寬度會完全隱藏；本次新增手機版選單按鈕與可展開式導覽面板，讓首頁與品種百科頁在手機上都能快速切換頁面與區塊。

### 完成項目

- `index.html`：新增手機版選單按鈕與手機版導覽面板。
- `species.html`：新增手機版選單按鈕與手機版導覽面板。
- `assets/css/styles.css`：新增手機版 header、選單按鈕、展開面板與觸控連結樣式。
- `assets/js/app.js`：新增手機版選單展開、收合、點選連結後自動關閉，以及切回桌機寬度時關閉選單的互動邏輯。

### 手機版導覽內容

首頁手機版選單包含：

- 品種百科
- 養殖實驗室
- 完整百科頁
- 快速購買 SulaEasy

品種百科頁手機版選單包含：

- 首頁
- 品系資料
- 難度篩選
- 快速購買 SulaEasy

### 驗證

```bash
git diff --check
```

結果：沒有格式錯誤。Git 僅提示 Windows 環境下 LF 之後可能轉為 CRLF，未影響功能。

## 後續更新：手機 Header 與媒體相容性

### 更新摘要

修正手機 Chrome 上方導覽列呈現不穩定，以及桌機瀏覽器無法顯示 HEIC 圖片與 MOV 影片的問題。

### 完成項目

- 將 header 改為 mobile-first 結構，手機預設顯示品牌與 hamburger 選單。
- 桌機版導覽改用 `.desktop-nav`，不再依賴 Tailwind `hidden md:flex` 控制主要導覽。
- 加入 CSS/JS 版本參數，降低 GitHub Pages 與手機瀏覽器快取造成舊樣式殘留的機率。
- 將頁面實際引用的 HEIC 圖片轉為 WebP。
- 將 Hero MOV 影片轉為 H.264 MP4。
- 新增 `.gitignore` 排除 `.tmp/` 轉檔工具暫存資料夾。
- 將 `index.html` 與 `species.html` 素材引用改為 `assets/media/`。

### 相關提交

- `31a272f Fix mobile header layout`
- `130b909 Use browser compatible media assets`

## 後續更新：金眼藍幽靈旗艦產品改版

### 更新摘要

將首頁主角從一般蘇拉威西蝦形象介紹，升級為「金眼藍幽靈 (Golden-Eye Blue Ghost)」旗艦產品頁。整體文案語氣調整為專業、奢華且具科學公信力，並保留手機瀏覽需求。

### 完成項目

- `index.html`：更新頁面 title 與 meta description，聚焦金眼藍幽靈旗艦品系。
- `index.html`：改寫 Hero 標題與副標，強調稀有度、金屬藍質感、橘金複眼、兩年以上累代繁殖與高基因穩定性。
- `index.html`：新增旗艦產品詳細卡片，包含品種名稱、學名、稀有等級、飼養難度與穩定紀錄。
- `index.html`：將養殖區塊改為 SulaEasy 標準化 SOP，加入 1ml:1L RO 水與三日開缸放蝦流程。
- `index.html`：新增 KH 穩定性對旗艦品種發色與脫殼重要性的科學敘述。
- `index.html`：新增「活寶石養殖社群」CTA 與 SulaEasy 快速購買 CTA。
- `assets/css/styles.css`：新增旗艦產品版面、產品證據卡、科學說明與社群 CTA 樣式。
- `assets/css/styles.css`：調整手機版產品資料列排版，避免長學名與按鈕在手機上擠壓。
- `species.html`：同步更新 CSS/JS 版本參數為 `flagship-1`，避免共用樣式快取不一致。

### 手機版處理

- 旗艦產品區塊在 960px 以下改為單欄排列。
- 社群 CTA 在手機版改為滿版按鈕，提升觸控可用性。
- 產品資料列在手機版改為直向堆疊，避免長文字擠壓。
- 保留既有手機 hamburger 導覽，手機可快速前往旗艦品系、標準化 SOP 與活寶石社群。

### 驗證

```bash
git diff --check
```

結果：沒有格式錯誤。Git 僅提示 Windows 環境下 LF 之後可能轉為 CRLF，未影響功能。
