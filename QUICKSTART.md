# 快速部署指南

## 🚀 5分钟部署到 Cloudflare Workers

### 前置要求

- Node.js 16+ 
- Cloudflare 账户（免费账户即可）
- 已安装 Wrangler CLI

### 步骤 1: 安装 Wrangler

```bash
npm install -g wrangler
```

### 步骤 2: 登录 Cloudflare

```bash
wrangler login
```

这会打开浏览器，登录你的 Cloudflare 账户并授权。

### 步骤 3: 创建 KV 命名空间

```bash
cd C:\Users\Administrator\Desktop\OmniBox-Spider-Worker
wrangler kv:namespace create CACHE
```

复制输出的 ID，例如：
```
{ binding = "CACHE", id = "abc123def456..." }
```

### 步骤 4: 更新配置

编辑 `wrangler.toml` 文件，将 KV 命名空间 ID 填入：

```toml
[[kv_namespaces]]
binding = "CACHE"
id = "你的KV命名空间ID"
```

### 步骤 5: 部署

```bash
npm run deploy
```

部署成功后，你会看到类似输出：

```
Published omnibox-spider-worker
  https://omnibox-spider-worker.你的账户.workers.dev
```

### 步骤 6: 测试

访问你的 Worker URL：
- 主页: `https://omnibox-spider-worker.你的账户.workers.dev/`
- 配置文件: `https://omnibox-spider-worker.你的账户.workers.dev/config.json`
- 爬虫列表: `https://omnibox-spider-worker.你的账户.workers.dev/api/spiders`

## 📱 在 TVBox 中使用

1. 打开 TVBox 应用
2. 进入设置 -> 配置地址
3. 输入你的配置 URL：
   ```
   https://omnibox-spider-worker.你的账户.workers.dev/config.json
   ```
4. 点击确定，等待加载完成

## 🔄 更新爬虫脚本

当爬虫脚本仓库更新时：

```bash
# 1. 更新爬虫仓库
cd C:\Users\Administrator\Desktop\OmniBox-Spider-main
git pull

# 2. 重新构建配置
cd C:\Users\Administrator\Desktop\OmniBox-Spider-Worker
npm run build-config

# 3. 重新部署
npm run deploy
```

## 🛠️ 本地开发

如果想在本地测试：

```bash
npm run dev
```

访问 http://localhost:8787

## 📊 监控和日志

查看实时日志：

```bash
npm run tail
```

## ❓ 常见问题

### Q: 部署失败提示权限错误？

A: 确保已运行 `wrangler login` 并成功授权。

### Q: 配置文件为空？

A: 检查 `SPIDER_REPO_LOCAL` 路径是否正确指向爬虫仓库。

### Q: TVBox 无法加载配置？

A: 
1. 检查 Worker URL 是否正确
2. 检查浏览器是否能访问配置 URL
3. 查看日志: `npm run tail`

### Q: 如何修改配置？

A: 编辑 `scripts/build-config.js` 文件，修改 `buildTVBoxConfig` 函数。

## 🎉 完成！

现在你已经成功部署了一个自动聚合 OmniBox 爬虫脚本的 Cloudflare Worker！

享受你的私人影视库吧！ 🎬
