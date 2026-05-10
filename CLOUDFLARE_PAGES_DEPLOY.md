# Cloudflare Pages 部署指南

本指南将帮助你通过 Cloudflare Pages 部署 OmniBox Spider Worker。

---

## 🚀 快速部署步骤

### 步骤 1: Fork 项目到 GitHub

1. 访问你的 GitHub 仓库
2. Fork 到你自己的账户

### 步骤 2: 创建 KV 命名空间

**重要**: 在部署前必须先创建 KV 命名空间！

#### 方式一：通过 Cloudflare Dashboard（推荐）

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages**
3. 点击 **KV** 标签
4. 点击 **Create a namespace**
5. 输入名称：`CACHE`
6. 点击 **Add**

#### 方式二：通过 Wrangler CLI

```bash
# 安装 Wrangler
npm install -g wrangler

# 登录 Cloudflare
wrangler login

# 创建 KV 命名空间
wrangler kv:namespace create CACHE

# 复制输出的 ID，例如：
# { binding = "CACHE", id = "abc123def456..." }
```

### 步骤 3: 获取 KV 命名空间 ID

1. 在 Cloudflare Dashboard
2. Workers & Pages → KV
3. 点击你创建的 `CACHE` 命名空间
4. 复制 **Namespace ID**

### 步骤 4: 配置环境变量

在 Cloudflare Pages 中配置环境变量：

1. 进入你的 Pages 项目
2. Settings → Environment variables
3. 添加变量：
   - **Variable name**: `KV_NAMESPACE_ID`
   - **Value**: 你的 KV 命名空间 ID
   - **Environment**: Production 和 Preview

### 步骤 5: 连接 GitHub 仓库

1. Cloudflare Dashboard → Workers & Pages
2. 点击 **Create application**
3. 选择 **Pages** 标签
4. 点击 **Connect to Git**
5. 选择你的 GitHub 仓库
6. 授权 Cloudflare 访问

### 步骤 6: 配置构建设置

```
Framework preset: None
Build command: npm run build-config
Build output directory: public
Root directory: /
```

**高级设置**:
- Node.js version: 18 (或更高)
- Environment variables: 
  - `KV_NAMESPACE_ID`: 你的 KV ID

### 步骤 7: 部署

点击 **Save and Deploy**

Cloudflare Pages 会自动：
1. 克隆你的仓库
2. 安装依赖
3. 运行构建脚本（从 GitHub API 获取爬虫列表）
4. 部署到全球 CDN

---

## ⚠️ 重要说明

### 关于 KV 命名空间

**问题**: `wrangler.toml` 中的 KV ID 是示例值 `your-kv-namespace-id`，部署会失败。

**解决方案**: 有两种方式：

#### 方式一：修改 wrangler.toml（推荐）

在部署前，修改 `wrangler.toml`：

```toml
[[kv_namespaces]]
binding = "CACHE"
id = "你的真实KV_ID"  # 替换这里
```

然后提交到 GitHub：

```bash
git add wrangler.toml
git commit -m "Update KV namespace ID"
git push
```

#### 方式二：使用环境变量

在 Cloudflare Pages 设置环境变量 `KV_NAMESPACE_ID`，然后在代码中动态读取。

### 关于构建脚本

新的构建脚本会：
- ✅ 从 GitHub API 在线获取爬虫脚本列表
- ✅ 不依赖本地路径
- ✅ 自动生成配置文件
- ✅ 支持在 Cloudflare Pages 环境中运行

---

## 🔧 故障排查

### 问题 1: 构建失败 - 找不到爬虫脚本

**原因**: GitHub API 请求限制

**解决**: 
- GitHub API 有速率限制（每小时 60 次）
- 等待一段时间后重试
- 或使用 GitHub Token 提高限制

### 问题 2: 部署失败 - KV 命名空间无效

**错误**: `KV namespace 'your-kv-namespace-id' is not valid`

**解决**:
1. 创建 KV 命名空间
2. 获取真实 ID
3. 更新 `wrangler.toml` 中的 ID
4. 重新部署

### 问题 3: 配置文件为空

**原因**: GitHub API 请求失败

**解决**:
- 检查网络连接
- 查看 Cloudflare Pages 构建日志
- 确认 GitHub 仓库地址正确

---

## 📝 部署后操作

### 1. 获取配置地址

部署成功后，访问：

```
https://你的项目名.pages.dev/config.json
```

### 2. 绑定自定义域名

1. Pages 项目 → Custom domains
2. 点击 **Set up a custom domain**
3. 输入你的域名
4. 按提示配置 DNS

### 3. 在 TVBox 中使用

在 TVBox 应用中添加配置地址：

```
https://你的项目名.pages.dev/config.json
```

---

## 🎯 完整部署流程

```
1. Fork 项目到 GitHub
   ↓
2. 创建 KV 命名空间
   ↓
3. 获取 KV ID
   ↓
4. 修改 wrangler.toml（填入 KV ID）
   ↓
5. 提交到 GitHub
   ↓
6. 连接 Cloudflare Pages
   ↓
7. 配置构建设置
   ↓
8. 部署
   ↓
9. 获取配置地址
   ↓
10. 在 TVBox 中使用
```

---

## 💡 提示

- ✅ 构建脚本已更新，支持在线获取爬虫列表
- ✅ 不再依赖本地路径
- ✅ 支持 Cloudflare Pages 自动部署
- ✅ 每次推送代码会自动重新构建

---

## 🚀 一键部署

如果你已经有 Cloudflare 账户，可以直接点击下面的按钮部署：

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/你的用户名/omnibox-spider-worker)

**注意**: 部署前需要先创建 KV 命名空间！

---

**祝你部署顺利！🎉**
