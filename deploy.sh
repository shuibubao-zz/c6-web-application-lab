#!/usr/bin/env bash
# C6 一键部署到 GitHub Pages（仅 Git 提交 + 推送；Pages 开关在网页端点一下）
# 用法：bash deploy.sh 你的GitHub用户名 [仓库名]
set -e
USERNAME="${1:?用法: bash deploy.sh 你的GitHub用户名 [仓库名]}"
REPO="${2:-wechat-studio}"
APP="C6/app"

cd "$APP"
git init -b main 2>/dev/null || git checkout -q -B main
git add -A
git commit -q -m "feat: 公众号排版工坊 C6 Web App（Markdown→公众号合规 HTML）" || echo "（无新改动，跳过提交）"
git remote remove origin 2>/dev/null || true
git remote add origin "https://github.com/${USERNAME}/${REPO}.git"
git push -u origin main
echo ""
echo "✅ 已推送到 https://github.com/${USERNAME}/${REPO}"
echo "下一步：浏览器打开该仓库 → Settings → Pages → Source 选 main / root → Save"
echo "约 2 分钟后访问：https://${USERNAME}.github.io/${REPO}/"
