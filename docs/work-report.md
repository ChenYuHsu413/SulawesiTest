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
- 目前仍使用 `sources/` 內 HEIC 與 MOV 原始素材。正式部署時，建議轉換為瀏覽器支援度更高的 WebP/JPG 與 MP4。
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
