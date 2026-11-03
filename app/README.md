# 公众号排版工坊 · WeChat Typesetting Studio

> C6 Web Application 交付物（EduSeed / Elite20）。把 C4B 的 `wechat-publisher` 技能包装成的纯前端 Web App。
> **一句话：粘贴 Markdown → 一键生成可直接粘进公众号编辑器的合规 HTML。**

## 为什么这个 App 存在

公众号编辑器会删掉 `<style>`、剥掉 `class`、把 `h1` 征用为标题样式——所以"排版"的本质是**把样式全部内联**。手工做这件事极其痛苦。本工具把 C4B 已验证的转换器搬上 Web，任何人在浏览器里 30 秒就能出稿。

## 核心特性

- **零依赖、零联网也能用**：核心转换器是纯 JS，没有任何 CDN、没有任何后端。关掉网络照样转换。
- **4 套主题**：accent（蓝）/ default（灰）/ warm（橙）/ minimal（极简），与 C4B 取值一致。
- **合规体检**：自动检测 h1 残留、class 属性、禁用 CSS（position/float/flex/height）、外链、图片数，给出"通过/提醒"报告。
- **Markdown 全特性**：标题、加粗/斜体/删除线、行内代码、代码块、表格、引用、Callout（知识点/小技巧/动手做/注意/引用）、列表、自动目录、分隔线、图片、高亮 `==xxx==`。
- **响应式**：手机浏览器上单列自适应。

## AI 集成 🔵 进阶层次

底部「AI 精修」是产品的进阶能力，遵循挑战要求"AI 是核心功能的一部分"：

- **用自己的 Key**：填入 Claude / OpenAI 的 API Key，浏览器**直连官方 API**，密钥只存你本地 `localStorage`，不经任何中转服务器。
- **✨ 用 AI 重写并优化排版**：把文章结构理顺、补小标题、拆长段，重新转换。
- **📌 生成导语摘要**：生成一个 ≤40 字的导语写入 frontmatter，重新转换。

> 没有 API Key 也能 100% 使用上面的离线转换——AI 是"加分项"不是"门槛"，符合挑战"不需要登录就能体验核心功能"的要求。

## 本地运行

```bash
cd app
python -m http.server 8123
# 浏览器打开 http://127.0.0.1:8123
```

或直接双击 `index.html` 也能用（剪贴板复制在 http 下更稳）。

## 部署（公开 URL 是 C6 硬要求）

这是纯静态站点，三选一：

1. **GitHub Pages**（最简单）：把 `app/` 目录推到你的 repo，Settings → Pages → Source 选 `main` / root，几分钟后获得 `https://用户名.github.io/仓库名/`。
2. **Netlify**：把 `app/` 文件夹拖到 netlify.com 即可。
3. **Vercel**：`vercel` CLI 或在 vercel.com 连接 repo，自动识别静态站点。

详见仓库根目录的 `部署指南.md` 与 `deploy.sh`。

## 目录结构

```
app/
├── index.html      # 页面结构
├── styles.css      # 自写 CSS（无 Tailwind 依赖，离线可用）
├── app.js          # 转换器 + 合规体检 + AI 客户端
└── README.md
```

## 安全说明

- ❌ 前端代码里**没有任何硬编码密钥**。
- AI Key 仅存于浏览器 `localStorage`，仅发往 `api.anthropic.com` / `api.openai.com` 官方域名。
- 离线转换路径完全不触网。

## 测试说明

转换器逻辑有 Node 无头测试覆盖（无 class / 无禁用 CSS / h1 自动降级 / 表格 / 目录 / Callout 均通过）。演示视图见 `卢怡然_C6_screenshots/` 与 `卢怡然_C6_demo.mp4`。

## 许可

MIT（与 C4B wechat-publisher 一致）。
