# 卢怡然_C6_app 链接

## 一句话产品说明

**公众号排版工坊**：粘贴 Markdown → 一键生成可直接粘进微信公众号编辑器的合规 HTML（内联样式 + 合规体检 + 4 套主题），核心功能离线可用；可选填入自有 API Key 调用 AI 精修。

## 部署后的公开 URL

> ⚠️ 部署需要你的 GitHub / Netlify / Vercel 账号。**我（AI）没有你的账号凭据，无法替你点"Deploy"**。
> 应用本身已 100% 完成并通过本地实测（见 `卢怡然_C6_screenshots/` 与 `卢怡然_C6_demo.mp4`），部署是"一键"动作。

待你部署后，把下面这行改成真实链接即可：

```
部署 URL：https://你的用户名.github.io/wechat-studio/   ← 部署后填写
```

### 三种部署方式（任选其一，约 2 分钟）

**方式 1 · GitHub Pages（推荐，免费）**
```bash
cd C6/app
git init -b main
git add -A && git commit -m "feat: 公众号排版工坊 C6"
git remote add origin https://github.com/你的用户名/wechat-studio.git
git push -u origin main
# 然后去仓库 Settings → Pages → Source 选 main / root
```

**方式 2 · Netlify**：打开 netlify.com → 把 `C6/app` 文件夹拖进去 → 立刻拿到链接。

**方式 3 · Vercel**：`npx vercel` 指向 `C6/app` 目录，按提示回车即可。

## 本地预览（无需部署即可验证）

```bash
cd C6/app && python -m http.server 8123
# 打开 http://127.0.0.1:8123
```
本地实测截图见 `卢怡然_C6_screenshots/01_桌面视图.png`（标题/蓝色提示框/表格/代码块/合规报告均正常）、`02_移动端视图.png`（单列自适应）。

## 提交群里的话术（建议）

> 这是我的 C6 Web App「公众号排版工坊」：https://xxx —— 粘贴 Markdown 就能生成公众号合规 HTML，还能用自己的 Key 让 AI 精修排版，大家试试看，欢迎反馈！
