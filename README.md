# OmniBox-Spider-Worker

TVBox 爬虫配置自动生成器 - 部署到 Cloudflare Workers

## 快速部署指南

### 步骤 1: Fork 项目到 GitHub

1. 访问你的 GitHub 仓库
2. Fork 到你自己的账户

### 步骤 2: 创建 KV 命名空间

**重要**: 在部署前必须先创建 KV 命名空间！

1. 登录 Cloudflare Dashboard
2. 左侧菜单 → 存储和数据库 → Workers KV
3. 右上角点 创建实例（Create Instance）
4. 命名空间名称填：tvbox-kv（随便取，自己认识就行）
5. 确认创建

创建完成后，列表里会显示这个 KV 的 命名空间 ID（一串 32 位的十六进制字符串）。把这串 ID 复制下来，记事本里贴一下，下一步要填进去。

### 步骤 3: 修改 wrangler.toml

在 GitHub 网页直接编辑 wrangler.toml，将 KV 命名空间 ID 填入：

```toml
[[kv_namespaces]]
binding = "CACHE"
id = "your-kv-namespace-id"  # 替换为你创建的 KV 命名空间 ID
```

### 步骤 4: Cloudflare Pages 部署

#### 步骤 1: 连接 GitHub 仓库

1. 登录 Cloudflare Dashboard
2. 进入 Workers & Pages
3. 点击 "Create application"
4. 选择 "Pages" 标签
5. 点击 "Connect to Git"
6. 选择你的 GitHub 仓库

#### 步骤 2: 配置构建设置

- Build command: `npm run build-config`

#### 步骤 3: 部署

点击 "Save and Deploy"，Cloudflare 会自动构建和部署

部署成功后会显示：

```
https://omnibox-spider-worker.你的账户.workers.dev/config.json
https://omnibox-spider-worker.你的账户.workers.dev/api/refresh
https://omnibox-spider-worker.你的账户.workers.dev/config.json
```

## 功能特性

- 🕷️ **自动扫描**: 扫描 120+ 个爬虫脚本，提取元信息
- 📝 **配置生成**: 自动生成 TVBox 格式的配置文件
- 🚀 **Cloudflare 部署**: 部署到 Cloudflare Workers，全球加速
- 🔄 **自动更新**: 支持自动刷新配置缓存
- 📊 **API 接口**: 提供 RESTful API 接口
- 💰 **完全免费**: Cloudflare 免费套餐完全够用

## 项目结构

```
OmniBox-Spider-Worker/
├── src/                          # 源代码目录
│   ├── index.js                  # Worker 入口
│   ├── handler.js                # 请求处理器
│   ├── spider-scanner.js         # 爬虫扫描器
│   ├── metadata-parser.js        # 元数据解析器
│   └── config-generator.js       # 配置生成器
├── scripts/                      # 构建脚本
│   └── build-config.js           # 配置构建脚本
├── public/                       # 生成的配置文件
│   └── config.json               # TVBox 配置（120个站点）
├── package.json                  # 项目配置
├── wrangler.toml                 # Cloudflare Worker 配置
└── README.md                     # 本文档
```

### 核心文件说明

| 文件                        | 作用        | 说明              |
| ------------------------- | --------- | --------------- |
| `src/index.js`            | Worker 入口 | 处理所有请求的入口点      |
| `src/handler.js`          | 请求处理器     | 路由分发和响应生成       |
| `src/spider-scanner.js`   | 爬虫扫描器     | 扫描爬虫脚本目录        |
| `src/metadata-parser.js`  | 元数据解析器    | 提取脚本元信息         |
| `src/config-generator.js` | 配置生成器     | 生成 TVBox 配置     |
| `scripts/build-config.js` | 构建脚本      | 本地构建配置文件        |
| `wrangler.toml`           | Worker 配置 | Cloudflare 部署配置 |

## API 接口

| 路径             | 说明         |
| -------------- | ---------- |
| `/config.json` | TVBox 配置文件 |
| `/api/spiders` | 爬虫列表 API   |
| `/api/refresh` | 刷新缓存       |
| `/api/health`  | 健康检查       |

## 自定义配置

如需修改各种 URL，请在以下文件中替换：

- `src/spider-scanner.js` - GitHub 仓库地址
- `src/config-generator.js` - spider 和 wallpaper 地址
- `wrangler.toml` - 环境变量配置

## License

MIT
