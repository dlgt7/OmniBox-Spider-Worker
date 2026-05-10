# OmniBox Spider Worker

自动聚合 OmniBox 爬虫脚本并生成 TVBox 配置文件的 Cloudflare Worker 项目。

## 功能特性

- 🕷️ **自动扫描**: 自动扫描爬虫脚本仓库,提取元信息
- 📝 **配置生成**: 生成 TVBox 格式的配置文件
- 🚀 **Cloudflare 部署**: 支持部署到 Cloudflare Workers
- 🔄 **自动更新**: 支持自动刷新配置缓存
- 📊 **API 接口**: 提供 RESTful API 接口

## 快速开始

### 1. 安装依赖

```bash
cd OmniBox-Spider-Worker
npm install
```

### 2. 本地构建配置

```bash
npm run build-config
```

这将在 `public` 目录生成 `config.json` 文件。

### 3. 本地开发

```bash
npm run dev
```

访问 http://localhost:8787 查看效果。

### 4. 部署到 Cloudflare Workers

#### 4.1 安装 Wrangler

```bash
npm install -g wrangler
```

#### 4.2 登录 Cloudflare

```bash
wrangler login
```

#### 4.3 创建 KV 命名空间

```bash
wrangler kv:namespace create CACHE
```

将输出的 ID 填入 `wrangler.toml` 文件中的 `id` 字段。

#### 4.4 部署

```bash
npm run deploy
```

## API 接口

### 获取配置文件

```
GET /config.json
GET /jiekou.json
```

返回 TVBox 格式的配置文件。

### 获取爬虫列表

```
GET /api/spiders
```

返回所有可用的爬虫脚本列表。

### 刷新配置

```
POST /api/refresh
```

强制刷新配置缓存。

## 配置说明

### wrangler.toml

```toml
name = "omnibox-spider-worker"
main = "src/index.js"
compatibility_date = "2024-01-01"

[vars]
SPIDER_REPO_URL = "https://github.com/Silent1566/OmniBox-Spider"
SPIDER_REPO_LOCAL = "C:\\Users\\Administrator\\Desktop\\OmniBox-Spider-main"

[site]
bucket = "./public"

[[kv_namespaces]]
binding = "CACHE"
id = "your-kv-namespace-id"
```

### 环境变量

- `SPIDER_REPO_URL`: 爬虫脚本仓库的 GitHub 地址
- `SPIDER_REPO_LOCAL`: 本地爬虫脚本仓库路径(用于本地构建)

## 项目结构

```
OmniBox-Spider-Worker/
├── src/                          # 源代码目录
│   ├── index.js                  # Worker 入口
│   ├── handler.js                # 请求处理器
│   ├── spider-scanner.js         # 爬虫扫描器
│   ├── metadata-parser.js        # 元数据解析器
│   └── config-generator.js       # 配置生成器
├── scripts/                      # 构建脚本目录
│   └── build-config.js           # 本地构建脚本
├── public/                       # 静态文件目录
│   └── config.json               # 生成的 TVBox 配置
├── package.json                  # 项目配置
├── wrangler.toml                 # Cloudflare Worker 配置
├── README.md                     # 项目说明
├── QUICKSTART.md                 # 快速部署指南
├── DEPLOYMENT_GUIDE.md           # 完整部署指南
└── PROJECT_STRUCTURE.md          # 项目结构详解
```

📖 **详细说明**: 查看 [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) 了解每个文件的详细作用。

## 使用方式

### 方式一: 直接使用配置文件

将 Worker 的 URL 添加到 TVBox 应用中:

```
https://your-worker.your-subdomain.workers.dev/config.json
```

### 方式二: 自定义配置

1. Fork 本项目
2. 修改 `wrangler.toml` 中的配置
3. 部署到自己的 Cloudflare 账户

## 注意事项

1. **本地路径**: 确保 `SPIDER_REPO_LOCAL` 指向正确的爬虫脚本仓库路径
2. **KV 命名空间**: 需要创建 KV 命名空间用于缓存
3. **CORS**: Worker 已配置 CORS,支持跨域访问
4. **缓存**: 配置默认缓存 1 小时,可通过 `/api/refresh` 强制刷新

## 更新爬虫脚本

当爬虫脚本仓库更新时:

1. 拉取最新代码:
   ```bash
   cd OmniBox-Spider-main
   git pull
   ```

2. 重新构建配置:
   ```bash
   cd OmniBox-Spider-Worker
   npm run build-config
   ```

3. 重新部署:
   ```bash
   npm run deploy
   ```

## 故障排查

### 问题: 配置文件为空

**解决方案**: 检查 `SPIDER_REPO_LOCAL` 路径是否正确,确保爬虫脚本仓库存在。

### 问题: 部署失败

**解决方案**: 
1. 检查是否已登录 Cloudflare: `wrangler whoami`
2. 检查 KV 命名空间是否已创建
3. 查看 `wrangler.toml` 配置是否正确

### 问题: 站点无法访问

**解决方案**: 
1. 检查 Worker 日志: `npm run tail`
2. 检查 CORS 配置
3. 检查爬虫脚本 URL 是否可访问

## 许可证

MIT License

## 相关链接

- [OmniBox-Spider](https://github.com/Silent1566/OmniBox-Spider) - 爬虫脚本仓库
- [Cloudflare Workers](https://workers.cloudflare.com/) - Cloudflare Workers 官方文档
- [TVBox](https://github.com/CatVodTVOfficial/TVBoxOSC) - TVBox 开源项目
