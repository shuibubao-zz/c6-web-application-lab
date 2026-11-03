/* ===========================================================================
 * 公众号排版工坊 — 纯前端 Web App
 * 核心：Markdown → 公众号合规 HTML（内联样式，可直接粘贴公众号编辑器）
 * AI：用户自带 key，浏览器直连官方 API（Claude / OpenAI），密钥只存本地
 * 与 C4B wechat-publisher 同源（主题/合规规则一致）
 * ======================================================================== */

/* ----------------------------- 样式常量 ----------------------------- */
const BASE = {
  h1: "font-size: 22px; font-weight: bold; line-height: 1.6; color: #1f2328; margin: 26px 0 12px 0;",
  h2: "font-size: 22px; font-weight: bold; line-height: 1.6; color: #1f2328; margin: 26px 0 12px 0;",
  h3: "font-size: 18px; font-weight: bold; line-height: 1.6; color: #1f2328; margin: 18px 0 8px 0;",
  h4: "font-size: 16px; font-weight: bold; line-height: 1.6; color: #444; margin: 14px 0 6px 0;",
  p: "font-size: 16px; line-height: 1.75; color: #333; margin: 12px 0;",
  li: "font-size: 16px; line-height: 1.75; color: #333; margin: 6px 0;",
  ul: "margin: 12px 0; padding-left: 22px;",
  ol: "margin: 12px 0; padding-left: 22px;",
  code_inline: "background-color: #f2f4f7; color: #c0341d; font-size: 14px; padding: 2px 4px; border-radius: 3px;",
  code_block: "background-color: #f6f8fa; color: #24292e; font-size: 14px; line-height: 1.65; padding: 14px 16px; margin: 14px 0; white-space: pre-wrap; border-radius: 6px;",
  blockquote: "background-color: #f7f8fa; color: #666; padding: 10px 15px; margin: 14px 0; border-left: 4px solid #d0d7de;",
  table: "border-collapse: collapse; margin: 14px 0; font-size: 14px;",
  th: "background-color: #f6f8fa; color: #24292e; font-weight: bold; padding: 8px 10px; text-align: left; border: 1px solid #d0d7de;",
  td: "padding: 8px 10px; border: 1px solid #d0d7de; color: #333;",
  a: "color: #0366d6; text-decoration: underline;",
  img: "max-width: 100%; margin: 14px 0;",
  hr: "text-align: center; color: #c9c9c9; letter-spacing: 4px; margin: 24px 0;",
  meta_title: "font-size: 24px; font-weight: bold; line-height: 1.4; color: #1f2328; margin: 0 0 10px 0;",
  meta_info: "font-size: 13px; color: #9a9a9a; margin: 0 0 18px 0;",
  meta_abstract: "font-size: 14px; line-height: 1.7; color: #666; background-color: #f7f8fa; padding: 12px 14px; margin: 0 0 20px 0; border-radius: 6px;",
  toc_title: "font-size: 16px; font-weight: bold; color: #1f2328; margin: 20px 0 8px 0;",
  toc_h2: "font-size: 15px; color: #333; margin: 4px 0;",
  toc_h3: "font-size: 14px; color: #888; margin: 3px 0 3px 18px;",
  footer: "font-size: 13px; line-height: 1.8; color: #9a9a9a; background-color: #fafafa; padding: 12px 14px; margin: 30px 0 10px 0; border-radius: 6px;",
  strong: "font-weight: bold;",
  em: "font-style: italic;",
  del: "text-decoration: line-through;",
  mark: "background-color: #fff3a3; color: #333; padding: 1px 2px;",
};

const THEMES = {
  default: {},
  accent: {
    h2: "font-size: 22px; font-weight: bold; line-height: 1.6; color: #1a73e8; margin: 26px 0 12px 0;",
    h3: "font-size: 18px; font-weight: bold; line-height: 1.6; color: #1a73e8; margin: 18px 0 8px 0;",
    blockquote: "background-color: #f0f7ff; color: #555; padding: 10px 15px; margin: 14px 0; border-left: 4px solid #1a73e8;",
    a: "color: #1a73e8; text-decoration: underline;",
    th: "background-color: #e8f2ff; color: #1a73e8; font-weight: bold; padding: 8px 10px; text-align: left; border: 1px solid #cfe3ff;",
  },
  warm: {
    h2: "font-size: 22px; font-weight: bold; line-height: 1.6; color: #e65100; margin: 26px 0 12px 0;",
    h3: "font-size: 18px; font-weight: bold; line-height: 1.6; color: #e65100; margin: 18px 0 8px 0;",
    blockquote: "background-color: #fff8e1; color: #6d4c41; padding: 10px 15px; margin: 14px 0; border-left: 4px solid #ff9800;",
    a: "color: #e65100; text-decoration: underline;",
    code_block: "background-color: #fff8e1; color: #5d4037; font-size: 14px; line-height: 1.65; padding: 14px 16px; margin: 14px 0; white-space: pre-wrap;",
  },
  minimal: {
    h2: "font-size: 20px; font-weight: bold; line-height: 1.6; color: #333; margin: 24px 0 10px 0;",
    h3: "font-size: 17px; font-weight: bold; line-height: 1.6; color: #333; margin: 16px 0 8px 0;",
    blockquote: "background-color: #fafafa; color: #666; padding: 8px 14px; margin: 14px 0; border-left: 3px solid #999;",
    code_block: "background-color: #fafafa; color: #333; font-size: 14px; line-height: 1.65; padding: 12px 14px; margin: 14px 0; white-space: pre-wrap;",
  },
};

const CALLOUT = {
  note: { icon: "📘", label: "知识点", accent: "#3b82f6", bg: "#f0f7ff" },
  tip: { icon: "💡", label: "小技巧", accent: "#0ea5e9", bg: "#e8f8ff" },
  practice: { icon: "🔧", label: "动手做", accent: "#10b981", bg: "#eafaf3" },
  warning: { icon: "⚠️", label: "注意", accent: "#f59e0b", bg: "#fff8e6" },
  quote: { icon: "💬", label: "引用", accent: "#8b5cf6", bg: "#f5f3ff" },
};
const CALLOUT_ALIAS = {
  NOTE: "note", TIP: "tip", WARNING: "warning", IMPORTANT: "warning",
  CAUTION: "warning", DOING: "practice", PRACTICE: "practice",
  "知识": "note", "技巧": "tip", "注意": "warning", "实践": "practice", "引用": "quote",
};
function resolveCalloutKind(raw) {
  raw = (raw || "").trim().toUpperCase().replace(/[\[\]]/g, "");
  if (CALLOUT[raw.toLowerCase()]) return raw.toLowerCase();
  if (CALLOUT_ALIAS[raw]) return CALLOUT_ALIAS[raw];
  if (CALLOUT[raw.toLowerCase()]) return raw.toLowerCase();
  return "note";
}

/* ----------------------------- 工具函数 ----------------------------- */
function buildTheme(name) {
  const t = Object.assign({}, BASE);
  const ov = THEMES[name] || {};
  return Object.assign(t, ov);
}
function escHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escAttr(s) { return escHtml(s); }

// 内联样式包裹
function tag(name, style, inner, extra = "") {
  return `<${name} style="${style}"${extra}>${inner}</${name}>`;
}

/* ----------------------------- 行内解析 ----------------------------- */
function parseInline(text, theme) {
  let s = text;
  // 图片 ![alt](url)
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (m, alt, url) =>
    `<img src="${escAttr(url)}" alt="${escAttr(alt)}" style="${theme.img}">`);
  // 链接 [text](url)
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (m, t, url) =>
    `<a href="${escAttr(url)}" style="${theme.a}" target="_blank">${t}</a>`);
  // 行内代码 `code`
  s = s.replace(/`([^`]+)`/g, (m, c) => `<span style="${theme.code_inline}">${escHtml(c)}</span>`);
  // 高亮 ==text==
  s = s.replace(/==([^=]+)==/g, (m, c) => `<span style="${theme.mark}">${escHtml(c)}</span>`);
  // 删除线 ~~text~~
  s = s.replace(/~~([^~]+)~~/g, (m, c) => `<span style="${theme.del}">${escHtml(c)}</span>`);
  // 粗体 **text**
  s = s.replace(/\*\*([^*]+)\*\*/g, (m, c) => `<strong style="${theme.strong}">${escHtml(c)}</strong>`);
  // 斜体 *text*
  s = s.replace(/\*([^*]+)\*/g, (m, c) => `<em style="${theme.em}">${escHtml(c)}</em>`);
  return s;
}

/* ----------------------------- 块解析 ----------------------------- */
function parseFrontmatter(md) {
  const m = md.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!m) return { meta: {}, body: md };
  const meta = {};
  m[1].split(/\n/).forEach((line) => {
    const mm = line.match(/^([a-zA-Z_]+)\s*:\s*(.*)$/);
    if (mm) meta[mm[1].toLowerCase()] = mm[2].trim();
  });
  return { meta, body: md.slice(m[0].length) };
}

function parseTable(lines, start, theme) {
  // 找到连续的表格行：当前行、分隔行、之后数据行
  const rows = [];
  let i = start;
  // header
  rows.push(lines[i].split("|").map((c) => c.trim()).filter((c, idx, arr) => !(idx === 0 && c === "") && !(idx === arr.length - 1 && c === "")));
  // separator
  i++;
  const sep = lines[i];
  if (!/^\s*\|?[\s:|-]+\|?\s*$/.test(sep) || !sep.includes("-")) return null;
  i++;
  while (i < lines.length && /\|/.test(lines[i]) && lines[i].trim() !== "") {
    const cells = lines[i].split("|").map((c) => c.trim()).filter((c, idx, arr) => !(idx === 0 && c === "") && !(idx === arr.length - 1 && c === ""));
    rows.push(cells);
    i++;
  }
  let html = `<table style="${theme.table}"><thead><tr>`;
  rows[0].forEach((c) => (html += `<th style="${theme.th}">${parseInline(c, theme)}</th>`));
  html += `</tr></thead><tbody>`;
  for (let r = 1; r < rows.length; r++) {
    html += `<tr>`;
    rows[r].forEach((c) => (html += `<td style="${theme.td}">${parseInline(c, theme)}</td>`));
    html += `</tr>`;
  }
  html += `</tbody></table>`;
  return { html, next: i };
}

function parseCallout(lines, start, theme) {
  // > [!NOTE] 或 > [!TIP] 开头的引用块
  const first = lines[start];
  const head = first.replace(/^>\s*/, "");
  let kind = "note";
  const km = head.match(/^\[!(.*?)\]/);
  if (km) kind = resolveCalloutKind(km[1]);
  const spec = CALLOUT[kind] || CALLOUT.note;
  const body = [];
  let i = start;
  let firstLineText = km ? head.replace(/^\[!.*?\]\s*/, "") : head;
  if (firstLineText.trim()) body.push(firstLineText);
  i++;
  while (i < lines.length && lines[i].startsWith(">")) {
    body.push(lines[i].replace(/^>\s?/, ""));
    i++;
  }
  const inner = body.map((l) => `<p style="${theme.p}">${parseInline(l, theme)}</p>`).join("");
  const box = `<section style="background-color:${spec.bg};border-left:4px solid ${spec.accent};padding:12px 14px;margin:16px 0;border-radius:6px;">`
    + `<p style="font-size:14px;font-weight:bold;color:${spec.accent};margin:0 0 6px 0;">${spec.icon} ${spec.label}</p>`
    + inner + `</section>`;
  return { html: box, next: i };
}

function splitList(lines, start, theme) {
  const ordered = /^(\s*)\d+\.\s+/.test(lines[start]);
  let i = start;
  const items = [];
  while (i < lines.length) {
    const l = lines[i];
    if (ordered && /^\s*\d+\.\s+/.test(l)) {
      items.push(l.replace(/^\s*\d+\.\s+/, ""));
      i++;
    } else if (!ordered && /^[-*+]\s+/.test(l)) {
      items.push(l.replace(/^[-*+]\s+/, ""));
      i++;
    } else break;
  }
  const tagName = ordered ? "ol" : "ul";
  const lis = items.map((it) => `<li style="${theme.li}">${parseInline(it, theme)}</li>`).join("");
  const html = `<${tagName} style="${ordered ? theme.ol : theme.ul}">${lis}</${tagName}>`;
  return { html, next: i };
}

/* ----------------------------- 主转换 ----------------------------- */
function convert(markdown, opts) {
  const theme = buildTheme(opts.theme || "accent");
  const wantToc = opts.toc || false;
  const { meta, body } = parseFrontmatter(markdown);
  const lines = body.split(/\n/);

  const report = { h1: 0, classes: 0, forbidden: 0, links: 0, images: 0, words: 0, headings: 0 };
  const out = [];
  const tocEntries = [];

  // 文首元数据块
  if (meta.title) out.push(`<p style="${theme.meta_title}">${escHtml(meta.title)}</p>`);
  if (meta.author) out.push(`<p style="${theme.meta_info}">作者：${escHtml(meta.author)}</p>`);
  if (meta.abstract) out.push(`<p style="${theme.meta_abstract}">${escHtml(meta.abstract)}</p>`);

  let i = 0;
  let guard = 0;
  while (i < lines.length) {
    if (++guard > lines.length + 50) break; // 安全保护，绝不发生死循环
    const line = lines[i];

    // 空行
    if (line.trim() === "") { i++; continue; }

    // 代码块
    if (/^```/.test(line)) {
      const lang = line.replace(/^```/, "").trim();
      const code = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) { code.push(lines[i]); i++; }
      i++; // 跳过结束 ```
      const codeStyle = theme.code_block + (lang ? `;font-family:Consolas,monospace;` : "");
      out.push(`<section style="${codeStyle}">${escHtml(code.join("\n"))}</section>`);
      continue;
    }

    // 标题
    let hm = line.match(/^(#{1,4})\s+(.*)$/);
    if (hm) {
      const level = hm[1].length;
      const text = hm[2].trim();
      // 公众号用 h1 当标题，正文标题用 h2~h4；输入 h1 自动降到 h2
      const tagName = level === 1 ? "h2" : "h" + level;
      const styleKey = level === 1 ? "h2" : "h" + level;
      if (level === 1) report.h1++; else report.headings++;
      out.push(tag(tagName, theme[styleKey], parseInline(text, theme)));
      if (wantToc && level <= 3) tocEntries.push({ level, text });
      i++; continue;
    }

    // 分隔线
    if (/^(\s*[-*_]){3,}\s*$/.test(line)) {
      out.push(`<p style="${theme.hr}">· · ·</p>`);
      i++; continue;
    }

    // 表格（当前行含 | 且下一行是分隔行）
    if (line.includes("|") && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|?\s*$/.test(lines[i + 1]) && lines[i + 1].includes("-")) {
      const r = parseTable(lines, i, theme);
      if (r) { out.push(r.html); i = r.next; continue; }
    }

    // Callout
    if (/^>\s*\[!/.test(line)) {
      const r = parseCallout(lines, i, theme);
      out.push(r.html); i = r.next; continue;
    }
    // 普通引用
    if (/^>\s?/.test(line)) {
      const buf = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) { buf.push(lines[i].replace(/^>\s?/, "")); i++; }
      out.push(tag("blockquote", theme.blockquote, buf.map((b) => `<p style="${theme.p}">${parseInline(b, theme)}</p>`).join("")));
      continue;
    }

    // 列表
    if (/^(\s*[-*+]|\s*\d+\.)\s+/.test(line)) {
      const r = splitList(lines, i, theme);
      out.push(r.html); i = r.next; continue;
    }

    // 段落（合并连续“纯文本”行：非块起始、非空）
    const para = [];
    while (i < lines.length && lines[i].trim() !== "" &&
      !/^```/.test(lines[i]) && !/^(#{1,4})\s+/.test(lines[i]) &&
      !/^>\s?/.test(lines[i]) && !/^(\s*[-*+]|\s*\d+\.)\s+/.test(lines[i]) &&
      !(/^>/.test(lines[i])) &&
      !(lines[i].includes("|") && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|?\s*$/.test(lines[i + 1]) && lines[i + 1].includes("-"))) {
      para.push(lines[i]); i++;
    }
    if (para.length) out.push(tag("p", theme.p, parseInline(para.join("<br>"), theme)));
    else { i++; } // 兜底：任何未被识别的行也消费掉，保证前进
  }

  // 统计
  const full = out.join("");
  report.classes = (full.match(/class=/g) || []).length;
  report.forbidden = (full.match(/(?:^|;)\s*(?:position|float|flex|height)\s*:/g) || []).length;
  report.links = (full.match(/<a /g) || []).length;
  report.images = (full.match(/<img /g) || []).length;
  report.words = (body.replace(/\s+/g, "").length);

  // 目录
  let tocHtml = "";
  if (wantToc && tocEntries.length) {
    const items = tocEntries.map((e) =>
      tag("p", e.level === 2 ? theme.toc_h2 : theme.toc_h3, escHtml(e.text))).join("");
    tocHtml = tag("p", theme.toc_title, "📑 目录") + items;
  }

  const content = tocHtml + out.join("\n");
  const preview = `<section style="padding:16px;font-family:-apple-system,'PingFang SC','Microsoft YaHei',sans-serif;max-width:677px;margin:0 auto;">${content}</section>`;
  return { html: content, preview, report, meta };
}

/* ----------------------------- UI 绑定 ----------------------------- */
const $ = (id) => document.getElementById(id);
const SAMPLE = `---
title: 用 AI 把 Markdown 变成公众号爆款
author: 卢怡然
abstract: 这篇演示公众号排版工坊能做什么——粘贴 Markdown，30 秒出合规 HTML。
toc: true
---

# 用 AI 把 Markdown 变成公众号爆款

> [!NOTE]
> 公众号编辑器会删掉 \`<style>\`、剥掉 \`class\`。所以**样式必须内联**——这正是本工具在做的。

## 一、它解决什么问题

| 你遇到的痛 | 本工具的应对 |
|------|------|
| 一粘贴排版就崩 | 自动内联样式 |
| 标题层级被吞 | h1 自动降级为 h2 |
| 不知道哪不合规 | 内置合规体检报告 |

## 二、三步上手

1. 在左侧粘贴 Markdown
2. 选主题、点「一键转换」
3. 复制右侧 HTML，粘进公众号编辑器

\`\`\`bash
pip install neoskills   # 这是代码块示例
\`\`\`

## 三、进阶：让 AI 帮你改

> [!TIP]
> 在底部填入你自己的 API Key，点「用 AI 重写」，它会把文章结构理顺、补充小标题。

**加粗**、*斜体*、\`行内代码\`、==高亮== 都支持。试试吧！
`;

function renderPreview(previewHtml) {
  const doc = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>body{margin:0;}</style></head><body>${previewHtml}</body></html>`;
  const iframe = $("preview");
  iframe.srcdoc = doc;
}

function doConvert() {
  const md = $("src").value;
  $("srcCount").textContent = md ? `· ${md.length} 字符` : "";
  const res = convert(md, { theme: $("theme").value, toc: $("toc").checked });
  renderPreview(res.preview);
  showReport(res.report);
  window.__lastResult = res;
}

function showReport(r) {
  $("stats").innerHTML =
    `<div class="stat">正文字数 <b>${r.words}</b></div>` +
    `<div class="stat">标题数 <b>${r.headings}</b></div>` +
    `<div class="stat">图片 <b>${r.images}</b></div>` +
    `<div class="stat">外链 <b>${r.links}</b></div>`;
  const checks = [
    [`h1 残留（应为 0）`, r.h1 === 0 ? "ok" : "warn", `检测到 ${r.h1} 处，已自动降级为 h2`],
    [`class 属性（应为 0）`, r.classes === 0 ? "ok" : "warn", `检测到 ${r.classes} 处`],
    [`禁用 CSS（position/float/flex/height）`, r.forbidden === 0 ? "ok" : "warn", `检测到 ${r.forbidden} 处`],
    [`外链（公众号通常不可跳转）`, r.links === 0 ? "ok" : "warn", `${r.links} 处，建议放「阅读原文」`],
  ];
  $("checks").innerHTML = checks.map(([name, st, detail]) =>
    `<li><span class="pill ${st}">${st === "ok" ? "通过" : "提醒"}</span><span>${name}：<b>${detail}</b></span></li>`
  ).join("");
}

function copyHtml() {
  if (!window.__lastResult) return;
  navigator.clipboard.writeText(window.__lastResult.html).then(() =>
    flashStatus($("copyBtn"), "已复制到剪贴板 ✓"));
}
function downloadHtml() {
  if (!window.__lastResult) return;
  const blob = new Blob([window.__lastResult.html], { type: "text/html" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "wechat-article.html";
  a.click();
}
function flashStatus(el, msg) {
  const old = el.textContent;
  el.textContent = msg;
  setTimeout(() => (el.textContent = old), 1500);
}

/* ----------------------------- AI 客户端 ----------------------------- */
function getKey() {
  const k = $("aiKey").value.trim() || localStorage.getItem("c6_ai_key") || "";
  if ($("aiKey").value.trim()) localStorage.setItem("c6_ai_key", $("aiKey").value.trim());
  return k;
}
function setAiStatus(msg, cls) {
  const el = $("aiStatus");
  el.textContent = msg;
  el.className = "ai-status" + (cls ? " " + cls : "");
}

async function callAI(provider, key, systemPrompt, userPrompt) {
  if (provider === "claude") {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });
    if (!res.ok) throw new Error("Claude API " + res.status + ": " + (await res.text()).slice(0, 200));
    const data = await res.json();
    return data.content.map((b) => b.text).join("");
  } else {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Bearer " + key,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });
    if (!res.ok) throw new Error("OpenAI API " + res.status + ": " + (await res.text()).slice(0, 200));
    const data = await res.json();
    return data.choices[0].message.content;
  }
}

async function aiRefine() {
  const key = getKey();
  if (!key) return setAiStatus("请先填写 API Key（或它会读取你上次保存的本地密钥）", "err");
  const md = $("src").value;
  if (!md.trim()) return setAiStatus("左侧先写点内容再让 AI 改", "err");
  setAiStatus("AI 正在重写并优化结构…（直连官方 API）", "loading");
  try {
    const improved = await callAI($("aiProvider").value, key,
      "你是公众号排版专家。把用户给的 Markdown 重写成结构清晰、适合微信公众号的文章：补全/理顺标题层级（最多到 h3）、补充小标题、把长段拆短、保留原有代码块与表格。只返回修改后的完整 Markdown，不要解释。",
      md);
    $("src").value = improved;
    doConvert();
    setAiStatus("✅ AI 重写完成，已自动重新转换", "ok");
  } catch (e) {
    setAiStatus("❌ " + e.message, "err");
  }
}

async function aiSummary() {
  const key = getKey();
  if (!key) return setAiStatus("请先填写 API Key", "err");
  const md = $("src").value;
  if (!md.trim()) return setAiStatus("左侧先写点内容", "err");
  setAiStatus("AI 正在生成导语摘要…", "loading");
  try {
    const summary = await callAI($("aiProvider").value, key,
      "用一句话（不超过 40 字）概括用户文章的核心价值，作为公众号导语。只返回那句话。",
      md);
    const cur = $("src").value;
    if (!/^---\s*\n/.test(cur)) {
      $("src").value = `---\nabstract: ${summary.trim()}\n---\n\n` + cur;
    } else {
      $("src").value = cur.replace(/abstract:\s*[^\n]*/i, "abstract: " + summary.trim());
    }
    doConvert();
    setAiStatus("✅ 已写入导语摘要并重新转换", "ok");
  } catch (e) {
    setAiStatus("❌ " + e.message, "err");
  }
}

/* ----------------------------- 启动 ----------------------------- */
window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("c6_ai_key")) $("aiKey").value = localStorage.getItem("c6_ai_key");
  $("convertBtn").onclick = doConvert;
  $("copyBtn").onclick = copyHtml;
  $("downloadBtn").onclick = downloadHtml;
  $("sampleBtn").onclick = () => { $("src").value = SAMPLE; doConvert(); };
  $("aiRefineBtn").onclick = aiRefine;
  $("aiSummaryBtn").onclick = aiSummary;
  $("aiClearKey").onclick = () => { localStorage.removeItem("c6_ai_key"); $("aiKey").value = ""; setAiStatus("已清除本地密钥", "ok"); };
  // 实时预览（输入即转，节流）
  let t;
  $("src").addEventListener("input", () => { clearTimeout(t); t = setTimeout(doConvert, 300); });
  $("theme").onchange = doConvert;
  $("toc").onchange = doConvert;
  // 初始示例
  $("src").value = SAMPLE;
  doConvert();
});
