# 一键部署方案

本项目提供多种一键部署方案，选择最适合你的方式。

---

## 🚀 方案一：智能部署脚本（推荐）

### Windows 用户

**使用方法：**
```bash
双击运行 deploy-smart.bat
```

**功能特点：**
- ✅ 自动检查并安装 Node.js（需手动安装）
- ✅ 自动安装 Wrangler
- ✅ 自动安装项目依赖
- ✅ 自动构建配置文件
- ✅ 自动登录 Cloudflare
- ✅ **自动创建 KV 命名空间**
- ✅ **自动更新 wrangler.toml**
- ✅ 一键部署到 Cloudflare
- ✅ 显示部署结果和配置地址

**只需 3 步：**
1. 安装 Node.js（首次需要）
2. 双击 `deploy-smart.bat`
3. 等待部署完成

---

## 🚀 方案二：基础部署脚本

### Windows 用户

```bash
双击运行 deploy.bat
```

### Linux/Mac 用户

```bash
chmod +x deploy.sh
./deploy.sh
```

**注意：** 需要手动创建 KV 命名空间并更新配置。

---

## 🚀 方案三：GitHub Actions 自动部署（最简单）

### 步骤 1: Fork 项目到 GitHub

1. 访问 https://github.com/你的用户名/OmniBox-Spider-Worker
2. 点击右上角 Fork

### 步骤 2: 配置 GitHub Secrets

在 GitHub 仓库设置中添加：

```
Settings → Secrets and variables → Actions → New repository secret
```

添加以下 Secret：
- `CLOUDFLARE_API_TOKEN`: Cloudflare API Token

**获取 API Token：**
1. 访问 https://dash.cloudflare.com/profile/api-tokens
2. 点击 "Create Token"
3. 选择 "Edit Cloudflare Workers" 模板
4. 复制生成的 Token

### 步骤 3: 创建 GitHub Actions 工作流

创建文件 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Build config
        run: npm run build-config

      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

### 步骤 4: 推送代码触发部署

```bash
git add .
git commit -m "Deploy to Cloudflare Workers"
git push
```

GitHub Actions 会自动部署到 Cloudflare Workers。

**优点：**
- ✅ 完全自动化
- ✅ 无需本地环境
- ✅ 每次推送自动部署
- ✅ 支持多环境部署

---

## 🚀 方案四：Cloudflare Pages 部署

### 步骤 1: 连接 GitHub 仓库

1. 登录 Cloudflare Dashboard
2. 进入 Workers & Pages
3. 点击 "Create application"
4. 选择 "Pages" 标签
5. 点击 "Connect to Git"
6. 选择你的 GitHub 仓库

### 步骤 2: 配置构建设置

```
Framework preset: None
Build command: npm run build-config
Build output directory: public
Root directory: /
```

### 步骤 3: 部署

点击 "Save and Deploy"，Cloudflare 会自动构建和部署。

**优点：**
- ✅ 图形化界面操作
- ✅ 自动 HTTPS
- ✅ 自定义域名
- ✅ 预览部署

---

## 📊 方案对比

| 方案 | 难度 | 自动化程度 | 适用场景 |
|------|------|-----------|---------|
| 智能部署脚本 | ⭐ | ⭐⭐⭐⭐⭐ | Windows 用户，本地部署 |
| 基础部署脚本 | ⭐⭐ | ⭐⭐⭐ | 需要手动配置 |
| GitHub Actions | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 完全自动化，团队协作 |
| Cloudflare Pages | ⭐ | ⭐⭐⭐⭐ | 图形化操作，静态站点 |

---

## 💡 推荐选择

### 个人用户
→ **使用方案一：智能部署脚本**
- 最简单
- 最快速
- 全自动

### 团队协作
→ **使用方案三：GitHub Actions**
- 完全自动化
- 版本控制
- 持续部署

### 不想配置本地环境
→ **使用方案四：Cloudflare Pages**
- 图形化界面
- 无需本地环境
- 一键部署

---

## 🔧 故障排查

### 问题 1: Node.js 未安装

**解决：**
1. 访问 https://nodejs.org/
2. 下载 LTS 版本
3. 安装后重新运行脚本

### 问题 2: Wrangler 安装失败

**解决：**
```bash
# 使用淘宝镜像
npm install -g wrangler --registry=https://registry.npmmirror.com
```

### 问题 3: 登录失败

**解决：**
```bash
# 清除登录状态
wrangler logout

# 重新登录
wrangler login
```

### 问题 4: KV 创建失败

**解决：**
```bash
# 手动创建
wrangler kv:namespace create CACHE

# 复制输出的 ID
# 手动更新 wrangler.toml
```

---

## 📝 部署后操作

### 1. 获取配置地址

部署成功后会显示：
```
https://omnibox-spider-worker.你的账户.workers.dev/config.json
```

### 2. 在 TVBox 中使用

1. 打开 TVBox 应用
2. 进入设置 → 配置地址
3. 输入配置地址
4. 点击确定

### 3. 查看日志

```bash
wrangler tail
```

### 4. 绑定自定义域名

详见 README.md 的"绑定自定义域名"章节。

---

## 🎯 快速开始

### 最快的方式（Windows）

1. 安装 Node.js
2. 双击 `deploy-smart.bat`
3. 等待完成
4. 获取配置地址

**总时间：约 5 分钟**

---

**选择最适合你的方案，开始部署吧！🚀**
