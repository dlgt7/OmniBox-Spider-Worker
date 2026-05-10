# Cloudflare Worker 完整部署指南

> 本指南将手把手教你从零开始部署 OmniBox Spider Worker 到 Cloudflare Workers，包括域名配置、自定义域名绑定、环境变量设置等所有细节。

---

## 📋 目录

1. [前置准备](#前置准备)
2. [Cloudflare 账户设置](#cloudflare-账户设置)
3. [域名配置](#域名配置)
4. [安装和配置](#安装和配置)
5. [创建 KV 命名空间](#创建-kv-命名空间)
6. [配置环境变量](#配置环境变量)
7. [部署 Worker](#部署-worker)
8. [绑定自定义域名](#绑定自定义域名)
9. [测试和验证](#测试和验证)
10. [高级配置](#高级配置)
11. [故障排查](#故障排查)
12. [维护和更新](#维护和更新)

---

## 前置准备

### 1. 必需工具

#### 1.1 安装 Node.js

**Windows:**
1. 访问 https://nodejs.org/
2. 下载 LTS 版本（推荐 18.x 或更高）
3. 运行安装程序，一路 Next
4. 验证安装：
   ```bash
   node --version
   npm --version
   ```

**Linux/Mac:**
```bash
# 使用 nvm 安装
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install --lts
nvm use --lts
```

#### 1.2 安装 Wrangler CLI

```bash
npm install -g wrangler

# 验证安装
wrangler --version
```

### 2. Cloudflare 账户

#### 2.1 注册账户

1. 访问 https://dash.cloudflare.com/sign-up
2. 填写邮箱和密码
3. 验证邮箱地址
4. 登录 Cloudflare Dashboard

#### 2.2 选择计划

- **免费计划**: 每天 100,000 次请求，足够个人使用
- **付费计划**: $5/月起，更多请求和功能

对于本项目，**免费计划完全够用**。

---

## Cloudflare 账户设置

### 1. 获取账户 ID

1. 登录 Cloudflare Dashboard
2. 点击右上角的头像
3. 选择 **My Profile**
4. 左侧菜单选择 **API Tokens**
5. 页面底部找到 **Account ID**，复制保存

或者：

1. 在 Dashboard 首页
2. 右侧栏 **Account ID** 下方直接复制

### 2. 创建 API Token（可选）

如果需要自动化部署，可以创建 API Token：

1. 进入 **My Profile** -> **API Tokens**
2. 点击 **Create Token**
3. 选择 **Edit Cloudflare Workers** 模板
4. 配置权限：
   - Account - Workers Scripts - Edit
   - Account - Workers KV Storage - Edit
   - Zone - Workers Routes - Edit
5. 点击 **Continue to summary**
6. 点击 **Create Token**
7. **重要**: 复制生成的 Token，只显示一次！

### 3. 配置 Wrangler

#### 方式一：交互式登录（推荐）

```bash
wrangler login
```

这会打开浏览器，授权 Wrangler 访问你的 Cloudflare 账户。

#### 方式二：使用 API Token

创建 `.env` 文件：

```bash
CLOUDFLARE_API_TOKEN=your_api_token_here
```

或设置环境变量：

**Windows (PowerShell):**
```powershell
$env:CLOUDFLARE_API_TOKEN="your_api_token_here"
```

**Linux/Mac:**
```bash
export CLOUDFLARE_API_TOKEN="your_api_token_here"
```

#### 验证登录

```bash
wrangler whoami
```

输出示例：
```
Getting User settings...
You are logged in with an OAuth Token, associated with the email 'your-email@example.com'!
┌───────────────────┬──────────────────────────────────┐
│ Account Name      │ Account ID                       │
├───────────────────┼──────────────────────────────────┤
│ Your Account Name │ abc123def456789...               │
└───────────────────┴──────────────────────────────────┘
```

---

## 域名配置

### 选项 A: 使用 Workers.dev 子域名（免费，推荐新手）

Cloudflare 会自动为你的 Worker 分配一个 `.workers.dev` 子域名。

**优点:**
- 完全免费
- 自动配置 SSL
- 无需购买域名

**缺点:**
- 域名较长
- 无法自定义

**配置步骤:**

1. 在 `wrangler.toml` 中添加：
   ```toml
   name = "omnibox-spider-worker"
   main = "src/index.js"
   compatibility_date = "2024-01-01"
   
   # Workers.dev 子域名会自动分配
   # 格式: https://omnibox-spider-worker.你的账户.workers.dev
   ```

2. 部署后会自动获得 URL：
   ```
   https://omnibox-spider-worker.your-subdomain.workers.dev
   ```

### 选项 B: 使用自定义域名（需要域名）

#### 1. 购买域名

**推荐域名注册商:**
- Cloudflare Registrar (成本价，推荐)
- Namecheap
- GoDaddy
- 阿里云
- 腾讯云

#### 2. 添加域名到 Cloudflare

1. 登录 Cloudflare Dashboard
2. 点击 **Add a site**
3. 输入你的域名（例如：`example.com`）
4. 选择计划（Free 即可）
5. 点击 **Continue**

#### 3. 更新域名服务器

Cloudflare 会显示两个名称服务器，例如：
```
dan.ns.cloudflare.com
lisa.ns.cloudflare.com
```

**在域名注册商处更新:**

**阿里云:**
1. 登录阿里云域名控制台
2. 找到你的域名
3. 点击 **管理** -> **DNS 修改**
4. 选择 **自定义 DNS 服务器**
5. 填入 Cloudflare 的两个名称服务器
6. 点击 **确定**

**腾讯云:**
1. 登录腾讯云域名控制台
2. 找到域名，点击 **管理**
3. 选择 **域名信息** -> **修改 DNS 服务器**
4. 选择 **自定义 DNS**
5. 填入 Cloudflare 的名称服务器
6. 点击 **提交**

**Namecheap:**
1. 登录 Namecheap
2. Domain List -> 你的域名 -> Manage
3. 找到 **Nameservers**
4. 选择 **Custom DNS**
5. 填入 Cloudflare 的名称服务器
6. 点击 ✓ 保存

#### 4. 等待 DNS 生效

- 通常需要 10 分钟到 48 小时
- Cloudflare 会发送邮件通知
- 在 Cloudflare Dashboard 可以查看状态

#### 5. 验证域名

在 Cloudflare Dashboard，域名状态显示 **Active** 表示成功。

---

## 安装和配置

### 1. 进入项目目录

```bash
cd C:\Users\Administrator\Desktop\OmniBox-Spider-Worker
```

### 2. 安装项目依赖

```bash
npm install
```

这会安装 `wrangler` 和其他依赖。

### 3. 查看项目结构

```bash
# Windows
dir

# Linux/Mac
ls -la
```

应该看到：
```
├── src/
├── scripts/
├── public/
├── package.json
├── wrangler.toml
└── README.md
```

---

## 创建 KV 命名空间

KV (Key-Value) 存储用于缓存配置数据。

### 1. 创建生产环境 KV 命名空间

```bash
wrangler kv:namespace create CACHE
```

输出示例：
```
🌀 Creating namespace with title "omnibox-spider-worker-CACHE"
✨ Success!
Add the following to your configuration file in your kv_namespaces:
{ binding = "CACHE", id = "abc123def456789..." }
```

**重要**: 复制输出的 `id` 值！

### 2. 创建预览环境 KV 命名空间（可选）

```bash
wrangler kv:namespace create CACHE --preview
```

输出示例：
```
🌀 Creating namespace with title "omnibox-spider-worker-CACHE_preview"
✨ Success!
Add the following to your configuration file in your kv_namespaces:
{ binding = "CACHE", preview_id = "xyz789..." }
```

### 3. 更新 wrangler.toml

编辑 `wrangler.toml` 文件：

```toml
name = "omnibox-spider-worker"
main = "src/index.js"
compatibility_date = "2024-01-01"

[vars]
SPIDER_REPO_URL = "https://github.com/Silent1566/OmniBox-Spider"
SPIDER_REPO_LOCAL = "C:\\Users\\Administrator\\Desktop\\OmniBox-Spider-main"

[site]
bucket = "./public"

# KV 命名空间配置
[[kv_namespaces]]
binding = "CACHE"
id = "你的生产环境KV_ID"
preview_id = "你的预览环境KV_ID"  # 可选
```

### 4. 验证 KV 配置

```bash
wrangler kv:namespace list
```

输出示例：
```json
[
  {
    "id": "abc123def456...",
    "title": "omnibox-spider-worker-CACHE"
  },
  {
    "id": "xyz789...",
    "title": "omnibox-spider-worker-CACHE_preview"
  }
]
```

---

## 配置环境变量

### 1. 生产环境变量

在 `wrangler.toml` 中配置：

```toml
[vars]
SPIDER_REPO_URL = "https://github.com/Silent1566/OmniBox-Spider"
SPIDER_REPO_LOCAL = "C:\\Users\\Administrator\\Desktop\\OmniBox-Spider-main"
```

### 2. 敏感信息配置（Secrets）

对于敏感信息（如 API Key），使用 Secrets：

```bash
# 设置密钥
wrangler secret put API_KEY

# 系统会提示输入值
# Enter the secret value you'd like assigned to the variable API_KEY on the script named omnibox-spider-worker:
# [输入你的密钥]
```

### 3. 环境变量优先级

1. Secrets（最高优先级）
2. `[vars]` 配置
3. 默认值（代码中）

### 4. 多环境配置

创建不同环境的配置：

```toml
# 生产环境
[env.production]
name = "omnibox-spider-worker-prod"
vars = { ENVIRONMENT = "production" }

[[env.production.kv_namespaces]]
binding = "CACHE"
id = "production-kv-id"

# 开发环境
[env.development]
name = "omnibox-spider-worker-dev"
vars = { ENVIRONMENT = "development" }

[[env.development.kv_namespaces]]
binding = "CACHE"
id = "development-kv-id"
```

部署到不同环境：

```bash
# 部署到生产环境
wrangler deploy --env production

# 部署到开发环境
wrangler deploy --env development
```

---

## 部署 Worker

### 1. 构建配置文件

```bash
npm run build-config
```

这会扫描爬虫脚本并生成 `public/config.json`。

### 2. 本地测试

```bash
npm run dev
```

访问 http://localhost:8787 测试功能。

### 3. 部署到 Cloudflare

```bash
npm run deploy
```

或使用完整命令：

```bash
wrangler deploy
```

输出示例：
```
Uploading omnibox-spider-worker...
✨ Success! Uploaded 1 files
✨ Uploading static assets...
✨ Success! Uploaded 1 static assets
✨ Published omnibox-spider-worker
  https://omnibox-spider-worker.你的账户.workers.dev
```

### 4. 查看部署信息

```bash
wrangler deployments list
```

### 5. 查看部署详情

```bash
wrangler deployments view
```

---

## 绑定自定义域名

### 方式一：通过 Dashboard 绑定（推荐新手）

1. 登录 Cloudflare Dashboard
2. 进入 **Workers & Pages**
3. 点击你的 Worker（omnibox-spider-worker）
4. 选择 **Settings** -> **Triggers**
5. 点击 **Add Custom Domain**
6. 输入域名，例如：`spider.yourdomain.com`
7. 点击 **Add Custom Domain**

Cloudflare 会自动：
- 添加 DNS 记录
- 配置 SSL 证书
- 设置路由

### 方式二：通过 wrangler.toml 配置

编辑 `wrangler.toml`：

```toml
name = "omnibox-spider-worker"
main = "src/index.js"
compatibility_date = "2024-01-01"

# 自定义域名配置
routes = [
  { pattern = "spider.yourdomain.com/*", zone_name = "yourdomain.com" }
]

# 或者使用自定义域名
[[routes]]
pattern = "spider.yourdomain.com/*"
zone_name = "yourdomain.com"
```

然后部署：

```bash
wrangler deploy
```

### 方式三：通过 API 绑定

```bash
# 添加路由
wrangler routes publish spider.yourdomain.com/*
```

### 验证域名绑定

1. 访问你的自定义域名：
   ```
   https://spider.yourdomain.com
   ```

2. 检查 SSL 证书：
   - 浏览器地址栏应显示 🔒 锁图标
   - 证书颁发者应为 Cloudflare

### 多域名绑定

可以绑定多个域名：

```toml
routes = [
  { pattern = "spider.yourdomain.com/*", zone_name = "yourdomain.com" },
  { pattern = "api.yourdomain.com/*", zone_name = "yourdomain.com" },
  { pattern = "tvbox.anotherdomain.com/*", zone_name = "anotherdomain.com" }
]
```

---

## 测试和验证

### 1. 测试主页

```bash
# 使用 curl
curl https://omnibox-spider-worker.你的账户.workers.dev/

# 或使用 PowerShell
Invoke-WebRequest -Uri "https://omnibox-spider-worker.你的账户.workers.dev/"
```

### 2. 测试配置文件

```bash
# 测试 config.json
curl https://omnibox-spider-worker.你的账户.workers.dev/config.json

# 验证 JSON 格式
curl https://omnibox-spider-worker.你的账户.workers.dev/config.json | jq .
```

### 3. 测试 API

```bash
# 获取爬虫列表
curl https://omnibox-spider-worker.你的账户.workers.dev/api/spiders

# 刷新配置
curl -X POST https://omnibox-spider-worker.你的账户.workers.dev/api/refresh
```

### 4. 浏览器测试

直接在浏览器中访问：
- 主页: `https://omnibox-spider-worker.你的账户.workers.dev/`
- 配置: `https://omnibox-spider-worker.你的账户.workers.dev/config.json`
- API: `https://omnibox-spider-worker.你的账户.workers.dev/api/spiders`

### 5. 性能测试

使用 Apache Bench：

```bash
# 安装 ab (Apache Bench)
# Windows: 下载 Apache 二进制文件
# Linux: sudo apt-get install apache2-utils
# Mac: 已预装

# 并发测试
ab -n 1000 -c 10 https://omnibox-spider-worker.你的账户.workers.dev/config.json
```

### 6. 监控日志

实时查看日志：

```bash
wrangler tail
```

或：

```bash
npm run tail
```

输出示例：
```
⎔ Listening for logs...
[2024-01-01 12:00:00] GET https://omnibox-spider-worker.你的账户.workers.dev/config.json 200 OK
[2024-01-01 12:00:05] GET https://omnibox-spider-worker.你的账户.workers.dev/api/spiders 200 OK
```

---

## 高级配置

### 1. 配置缓存策略

编辑 `src/handler.js`：

```javascript
// 添加缓存控制头
const headers = {
  ...CORS_HEADERS,
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'public, max-age=3600', // 缓存1小时
  'CDN-Cache-Control': 'public, max-age=3600',
  'Cloudflare-CDN-Cache-Control': 'public, max-age=3600',
};
```

### 2. 配置 CORS

```javascript
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*', // 允许所有域名
  // 或指定域名
  // 'Access-Control-Allow-Origin': 'https://yourdomain.com',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400', // 预检请求缓存24小时
};
```

### 3. 配置速率限制

在 `wrangler.toml` 中：

```toml
[limits]
cpu_ms = 50 # CPU 时间限制（毫秒）

# 速率限制（需要付费计划）
[rate_limiting]
algorithms = ["tokenBucket"]
conditions = [
  { field = "ip", operator = "equals", value = "*" }
]
```

### 4. 配置防火墙规则

在 Cloudflare Dashboard：

1. 进入你的域名
2. 选择 **Security** -> **WAF**
3. 点击 **Create Firewall Rule**
4. 配置规则：
   - **Rule name**: Block Bad Bots
   - **Field**: User Agent
   - **Operator**: contains
   - **Value**: bot
   - **Action**: Block

### 5. 配置分析

查看 Worker 统计：

1. Cloudflare Dashboard
2. **Workers & Pages**
3. 点击你的 Worker
4. 选择 **Analytics**

可以看到：
- 请求数量
- 错误率
- CPU 时间
- 带宽使用

### 6. 配置告警

1. 进入 **Notifications**
2. 点击 **Add**
3. 选择 **Workers Alert**
4. 配置：
   - **Name**: Worker Error Alert
   - **Email**: your-email@example.com
   - **Triggers**: Error rate > 5%

### 7. 配置 D1 数据库（可选）

如果需要使用 SQL 数据库：

```bash
# 创建 D1 数据库
wrangler d1 create omnibox-spider-db

# 输出示例
# ✨ Success! Your D1 database is ready!
# database_id = "abc-123-def"
```

在 `wrangler.toml` 中配置：

```toml
[[d1_databases]]
binding = "DB"
database_name = "omnibox-spider-db"
database_id = "abc-123-def"
```

### 8. 配置 R2 存储（可选）

如果需要对象存储：

```bash
# 创建 R2 存储桶
wrangler r2 bucket create omnibox-spider-bucket
```

在 `wrangler.toml` 中配置：

```toml
[[r2_buckets]]
binding = "BUCKET"
bucket_name = "omnibox-spider-bucket"
```

---

## 故障排查

### 问题 1: 部署失败 - 权限错误

**错误信息:**
```
Error: Authentication error
```

**解决方案:**
```bash
# 重新登录
wrangler logout
wrangler login

# 或使用 API Token
export CLOUDFLARE_API_TOKEN="your_token"
```

### 问题 2: KV 命名空间未找到

**错误信息:**
```
Error: KV namespace not found
```

**解决方案:**
```bash
# 检查 KV 命名空间
wrangler kv:namespace list

# 重新创建
wrangler kv:namespace create CACHE

# 更新 wrangler.toml 中的 ID
```

### 问题 3: 自定义域名无法访问

**可能原因:**
1. DNS 未生效
2. SSL 证书未配置
3. 路由配置错误

**解决方案:**

```bash
# 检查 DNS
nslookup spider.yourdomain.com

# 检查路由
wrangler routes list

# 重新绑定域名
wrangler routes delete spider.yourdomain.com/*
wrangler routes publish spider.yourdomain.com/*
```

### 问题 4: 配置文件为空

**原因:**
- 爬虫仓库路径错误
- 构建脚本未运行

**解决方案:**
```bash
# 检查路径
dir C:\Users\Administrator\Desktop\OmniBox-Spider-main

# 重新构建
npm run build-config

# 检查生成的文件
dir public\config.json
```

### 问题 5: Worker 超时

**错误信息:**
```
Error: Worker exceeded CPU time limit
```

**解决方案:**

优化代码，减少 CPU 使用：

```javascript
// 使用缓存
const cached = await env.CACHE.get(key);
if (cached) return cached;

// 异步处理
const promise = fetch(url);
// 做其他事情
const response = await promise;
```

### 问题 6: 内存不足

**错误信息:**
```
Error: Memory limit exceeded
```

**解决方案:**

减少内存使用：

```javascript
// 流式处理大文件
const stream = fetch(url).then(r => r.body);

// 分批处理数据
for (let i = 0; i < data.length; i += 100) {
  const batch = data.slice(i, i + 100);
  await processBatch(batch);
}
```

### 问题 7: CORS 错误

**错误信息:**
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**解决方案:**

确保响应包含 CORS 头：

```javascript
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// 处理 OPTIONS 预检请求
if (request.method === 'OPTIONS') {
  return new Response(null, { headers: CORS_HEADERS });
}

// 所有响应添加 CORS 头
return new Response(data, { headers: { ...CORS_HEADERS, ...otherHeaders } });
```

### 查看详细日志

```bash
# 实时日志
wrangler tail

# JSON 格式日志
wrangler tail --format json

# 过滤日志
wrangler tail --status error
```

---

## 维护和更新

### 1. 更新爬虫脚本

```bash
# 1. 更新爬虫仓库
cd C:\Users\Administrator\Desktop\OmniBox-Spider-main
git pull origin main

# 2. 重新构建配置
cd C:\Users\Administrator\Desktop\OmniBox-Spider-Worker
npm run build-config

# 3. 部署更新
npm run deploy
```

### 2. 更新 Worker 代码

```bash
# 修改代码后
npm run deploy
```

### 3. 回滚部署

```bash
# 查看部署历史
wrangler deployments list

# 回滚到上一个版本
wrangler rollback

# 回滚到指定版本
wrangler rollback --version <version-id>
```

### 4. 监控和告警

设置 Cloudflare 告警：

1. Dashboard -> Notifications
2. 添加 Workers Alert
3. 配置触发条件：
   - 错误率 > 1%
   - CPU 时间 > 45ms
   - 请求数激增

### 5. 备份配置

```bash
# 导出 Worker 代码
wrangler download omnibox-spider-worker

# 导出 KV 数据
wrangler kv:key list --namespace-id=<your-kv-id>
```

### 6. 清理缓存

```bash
# 清除 KV 缓存
wrangler kv:key delete --namespace-id=<your-kv-id> "config:latest"

# 或通过 API
curl -X POST https://your-worker.workers.dev/api/refresh
```

### 7. 性能优化

**使用缓存:**
```javascript
// 缓存配置
await env.CACHE.put(key, value, {
  expirationTtl: 3600, // 1小时
});
```

**使用边缘缓存:**
```javascript
// 利用 Cloudflare CDN 缓存
const cache = caches.default;
const cachedResponse = await cache.match(request);
if (cachedResponse) return cachedResponse;
```

**优化代码:**
```javascript
// 减少不必要的计算
// 使用流式处理
// 异步并行处理
const [result1, result2] = await Promise.all([
  fetch(url1),
  fetch(url2),
]);
```

---

## 成本估算

### 免费套餐限制

- **请求数**: 100,000 次/天
- **CPU 时间**: 10ms/请求
- **KV 读取**: 100,000 次/天
- **KV 写入**: 1,000 次/天
- **KV 存储**: 1GB
- **带宽**: 无限制

### 预估使用量

假设：
- 每天更新配置 10 次
- 每次配置大小 500KB
- 每天访问配置 100 次

**计算:**
- KV 写入: 10 次/天 ✅
- KV 读取: 100 次/天 ✅
- 请求数: 110 次/天 ✅
- 存储: 500KB ✅

**结论**: 免费套餐完全够用！

### 付费套餐

如果超出限制：

- **Workers Paid**: $5/月
  - 1000 万次请求
  - 30ms CPU 时间
  - 更多 KV 操作

---

## 安全建议

### 1. 使用环境变量

不要在代码中硬编码敏感信息：

```javascript
// ❌ 不安全
const apiKey = "sk-abc123";

// ✅ 安全
const apiKey = env.API_KEY;
```

### 2. 验证输入

```javascript
// 验证请求参数
const url = new URL(request.url);
const path = url.pathname;

if (!isValidPath(path)) {
  return new Response('Invalid path', { status: 400 });
}
```

### 3. 限制访问频率

```javascript
// 简单的速率限制
const ip = request.headers.get('CF-Connecting-IP');
const key = `rate:${ip}`;
const count = await env.CACHE.get(key) || 0;

if (count > 100) {
  return new Response('Too many requests', { status: 429 });
}

await env.CACHE.put(key, count + 1, { expirationTtl: 60 });
```

### 4. 启用防火墙

在 Cloudflare Dashboard 配置 WAF 规则。

### 5. 使用 HTTPS

Cloudflare 自动提供 SSL/TLS 证书，确保所有流量都通过 HTTPS。

---

## 总结

恭喜！你已经完成了 OmniBox Spider Worker 的完整部署。

### 部署清单

- [x] 安装 Node.js 和 Wrangler
- [x] 创建 Cloudflare 账户
- [x] 配置域名（可选）
- [x] 创建 KV 命名空间
- [x] 配置环境变量
- [x] 部署 Worker
- [x] 绑定自定义域名（可选）
- [x] 测试验证
- [x] 配置监控和告警

### 下一步

1. 在 TVBox 中使用你的配置 URL
2. 监控 Worker 性能
3. 定期更新爬虫脚本
4. 根据需要调整配置

### 获取帮助

- **Cloudflare 文档**: https://developers.cloudflare.com/workers/
- **Wrangler 文档**: https://developers.cloudflare.com/workers/wrangler/
- **社区支持**: https://community.cloudflare.com/

---

**祝你使用愉快！🎉**
