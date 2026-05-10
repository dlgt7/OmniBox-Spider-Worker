@echo off
chcp 65001 >nul
echo ========================================
echo OmniBox Spider Worker 部署脚本
echo ========================================
echo.

echo [1/4] 检查环境...
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未安装 Node.js，请先安装 Node.js 16+
    pause
    exit /b 1
)
echo ✓ Node.js 已安装

where wrangler >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未安装 Wrangler，正在安装...
    npm install -g wrangler
)
echo ✓ Wrangler 已安装

echo.
echo [2/4] 构建配置文件...
node scripts\build-config.js
if %errorlevel% neq 0 (
    echo ❌ 构建失败
    pause
    exit /b 1
)
echo ✓ 配置文件构建完成

echo.
echo [3/4] 检查登录状态...
wrangler whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo 未登录 Cloudflare，正在打开浏览器...
    wrangler login
)
echo ✓ 已登录 Cloudflare

echo.
echo [4/4] 部署到 Cloudflare Workers...
wrangler deploy
if %errorlevel% neq 0 (
    echo ❌ 部署失败
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✓ 部署成功！
echo ========================================
echo.
echo 访问你的 Worker:
echo https://omnibox-spider-worker.你的账户.workers.dev
echo.
echo 配置文件地址:
echo https://omnibox-spider-worker.你的账户.workers.dev/config.json
echo.
pause
