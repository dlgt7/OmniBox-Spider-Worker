# 项目结构详解

本文档详细介绍 OmniBox Spider Worker 项目的目录结构、文件作用和代码组织。

---

## 📁 完整目录结构

```
OmniBox-Spider-Worker/
│
├── 📂 src/                          # 源代码目录
│   ├── 📄 index.js                  # Worker 入口文件
│   ├── 📄 handler.js                # 请求处理器
│   ├── 📄 spider-scanner.js         # 爬虫脚本扫描器
│   ├── 📄 metadata-parser.js        # 元数据解析器
│   └── 📄 config-generator.js       # 配置生成器
│
├── 📂 scripts/                      # 构建脚本目录
│   └── 📄 build-config.js           # 本地配置构建脚本
│
├── 📂 public/                       # 静态文件目录
│   └── 📄 config.json               # 生成的 TVBox 配置文件
│
├── 📂 node_modules/                 # 依赖包目录（自动生成）
│
├── 📄 package.json                  # 项目配置文件
├── 📄 package-lock.json             # 依赖锁定文件（自动生成）
├── 📄 wrangler.toml                 # Cloudflare Worker 配置
├── 📄 wrangler.toml.example         # 配置示例文件
├── 📄 .gitignore                    # Git 忽略规则
├── 📄 README.md                     # 项目说明文档
├── 📄 QUICKSTART.md                 # 快速部署指南
├── 📄 DEPLOYMENT_GUIDE.md           # 完整部署指南
├── 📄 PROJECT_STRUCTURE.md          # 本文档
├── 📄 deploy.bat                    # Windows 部署脚本
└── 📄 deploy.sh                     # Linux/Mac 部署脚本
```

---

## 📂 目录详解

### 1. `src/` - 源代码目录

存放 Worker 的核心代码文件。

#### 📄 `index.js` - Worker 入口文件

**作用**: Cloudflare Worker 的主入口点，处理所有传入的请求。

**代码结构**:
```javascript
import { handleRequest } from './handler.js';

export default {
  async fetch(request, env, ctx) {
    return handleRequest(request, env, ctx);
  },
};
```

**职责**:
- 导出 Worker 的 `fetch` 处理函数
- 将请求转发给 `handler.js` 处理
- 提供环境变量 (`env`) 和上下文 (`ctx`)

**关键点**:
- 使用 ES6 模块语法
- 符合 Cloudflare Workers 标准
- 简洁的入口设计

---

#### 📄 `handler.js` - 请求处理器

**作用**: 路由请求到不同的处理函数，返回响应。

**主要功能**:
1. **路由处理**: 根据 URL 路径分发请求
2. **CORS 配置**: 处理跨域请求
3. **错误处理**: 捕获并处理异常
4. **响应生成**: 返回 HTML/JSON 响应

**路由表**:
```javascript
/              → 返回主页 HTML
/config.json   → 返回 TVBox 配置
/jiekou.json   → 返回 TVBox 配置（别名）
/api/spiders   → 返回爬虫列表
/api/refresh   → 刷新配置缓存
```

**代码示例**:
```javascript
export async function handleRequest(request, env, ctx) {
  const url = new URL(request.url);
  const path = url.pathname;

  // 路由分发
  if (path === '/config.json') {
    const config = await generateConfig(env);
    return new Response(JSON.stringify(config, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // ... 其他路由
}
```

**关键特性**:
- 支持 CORS 跨域
- 统一的错误处理
- 清晰的路由结构

---

#### 📄 `spider-scanner.js` - 爬虫脚本扫描器

**作用**: 扫描本地爬虫脚本仓库，提取脚本信息。

**主要功能**:
1. **目录扫描**: 遍历爬虫脚本目录
2. **文件过滤**: 只处理 `.js` 和 `.py` 文件
3. **元数据提取**: 调用 `metadata-parser.js` 解析脚本
4. **分类组织**: 按类别组织爬虫脚本

**扫描流程**:
```
1. 定义分类列表
   ↓
2. 遍历每个分类目录
   ↓
3. 读取目录中的文件
   ↓
4. 过滤 .js/.py 文件
   ↓
5. 解析脚本元数据
   ↓
6. 返回爬虫列表
```

**代码示例**:
```javascript
export async function scanSpiders(env) {
  const spiders = [];
  const categories = ['影视/采集', '影视/网盘', ...];
  
  for (const category of categories) {
    const categorySpiders = await scanCategory(env, category);
    spiders.push(...categorySpiders);
  }
  
  return spiders;
}
```

**输出格式**:
```json
[
  {
    "name": "123TV",
    "author": "作者名",
    "description": "描述信息",
    "version": "1.0.0",
    "category": "影视/采集",
    "file": "123TV.js",
    "path": "影视/采集/123TV.js",
    "url": "https://github.com/.../123TV.js",
    "downloadUrl": "https://gh-proxy.org/.../123TV.js"
  }
]
```

---

#### 📄 `metadata-parser.js` - 元数据解析器

**作用**: 从爬虫脚本文件中提取元信息。

**解析内容**:
- `@name` - 脚本名称
- `@author` - 作者
- `@description` - 描述
- `@version` - 版本号
- `@dependencies` - 依赖项

**解析方法**:
使用正则表达式匹配注释中的元数据标签。

**代码示例**:
```javascript
export function parseSpiderMetadata(content, filename) {
  const metadata = {
    name: '',
    author: '',
    description: '',
    version: '',
    dependencies: [],
  };

  // 解析 @name
  const nameMatch = content.match(/\/\/\s*@name\s+(.+)/);
  if (nameMatch) {
    metadata.name = nameMatch[1].trim();
  }

  // 解析其他字段...
  
  return metadata;
}
```

**支持的格式**:
```javascript
// @name 123TV
// @author 作者名
// @description 刮削：支持，弹幕：支持
// @version 1.0.0
// @dependencies axios, cheerio
```

**特性检测**:
- 检测是否支持刮削
- 检测是否支持弹幕
- 检测是否支持播放记录

---

#### 📄 `config-generator.js` - 配置生成器

**作用**: 生成 TVBox 格式的配置文件。

**主要功能**:
1. **缓存管理**: 从 KV 读取/写入缓存
2. **配置构建**: 构建 TVBox 配置结构
3. **分类处理**: 按类别组织站点
4. **站点生成**: 生成站点配置项

**配置结构**:
```json
{
  "spider": "爬虫文件URL",
  "wallpaper": "壁纸URL",
  "sites": [
    {
      "key": "站点唯一标识",
      "name": "站点名称",
      "type": 3,
      "api": "爬虫脚本URL",
      "searchable": 1,
      "quickSearch": 1,
      "filterable": 1
    }
  ]
}
```

**缓存策略**:
```javascript
// 尝试从缓存读取
const cached = await env.CACHE.get('config:latest');
if (cached && !forceRefresh) {
  return JSON.parse(cached);
}

// 生成新配置
const config = buildTVBoxConfig(spiders, env);

// 写入缓存（1小时过期）
await env.CACHE.put('config:latest', JSON.stringify(config), {
  expirationTtl: 3600
});
```

**站点生成逻辑**:
```javascript
function generateSiteConfig(spider) {
  return {
    key: spider.name.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, ''),
    name: `🚀${spider.name}`,
    type: 3,  // 3 表示爬虫类型
    api: spider.downloadUrl,
    searchable: 1,
    quickSearch: 1,
    filterable: 1,
  };
}
```

---

### 2. `scripts/` - 构建脚本目录

存放构建和部署相关的脚本。

#### 📄 `build-config.js` - 本地配置构建脚本

**作用**: 在本地扫描爬虫脚本并生成配置文件。

**执行流程**:
```
1. 设置爬虫仓库路径
   ↓
2. 定义分类列表
   ↓
3. 扫描每个分类
   ↓
4. 解析脚本元数据
   ↓
5. 生成 TVBox 配置
   ↓
6. 写入 public/config.json
```

**使用方法**:
```bash
npm run build-config
# 或
node scripts/build-config.js
```

**输出示例**:
```
开始扫描爬虫脚本...
爬虫仓库路径: C:\Users\Administrator\Desktop\OmniBox-Spider-main
扫描 影视/采集: 找到 61 个脚本
扫描 影视/网盘: 找到 23 个脚本
...
总共找到 120 个爬虫脚本
配置文件已生成: public/config.json
站点总数: 120
```

**配置项**:
```javascript
// 爬虫脚本仓库路径
const SPIDER_REPO_PATH = process.env.SPIDER_REPO_PATH || 
  'C:\\Users\\Administrator\\Desktop\\OmniBox-Spider-main';

// 输出配置文件路径
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'config.json');
```

---

### 3. `public/` - 静态文件目录

存放生成的静态文件，会被部署到 Cloudflare Workers。

#### 📄 `config.json` - TVBox 配置文件

**作用**: TVBox 应用使用的配置文件。

**生成方式**:
- 由 `build-config.js` 脚本生成
- 包含所有爬虫站点的配置

**文件大小**: 约 50-100KB（取决于站点数量）

**访问方式**:
```
https://your-worker.workers.dev/config.json
```

**注意事项**:
- 此文件是自动生成的，不要手动编辑
- 每次运行 `npm run build-config` 都会覆盖
- 部署时会自动上传到 Worker

---

### 4. 根目录文件

#### 📄 `package.json` - 项目配置文件

**作用**: 定义项目元数据、依赖和脚本。

**主要内容**:
```json
{
  "name": "omnibox-spider-worker",
  "version": "1.0.0",
  "description": "Cloudflare Worker for aggregating OmniBox Spider interfaces",
  "main": "src/index.js",
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "wrangler deploy",
    "tail": "wrangler tail",
    "build-config": "node scripts/build-config.js"
  },
  "devDependencies": {
    "wrangler": "^3.0.0"
  }
}
```

**脚本命令**:
- `npm run dev` - 本地开发服务器
- `npm run deploy` - 部署到 Cloudflare
- `npm run tail` - 查看实时日志
- `npm run build-config` - 构建配置文件

---

#### 📄 `wrangler.toml` - Cloudflare Worker 配置

**作用**: 配置 Cloudflare Worker 的部署参数。

**主要配置项**:
```toml
name = "omnibox-spider-worker"          # Worker 名称
main = "src/index.js"                   # 入口文件
compatibility_date = "2024-01-01"       # 兼容性日期

[vars]                                  # 环境变量
SPIDER_REPO_URL = "https://github.com/Silent1566/OmniBox-Spider"
SPIDER_REPO_LOCAL = "C:\\Users\\Administrator\\Desktop\\OmniBox-Spider-main"

[site]                                  # 静态站点配置
bucket = "./public"

[[kv_namespaces]]                       # KV 命名空间
binding = "CACHE"
id = "your-kv-namespace-id"
```

**重要字段说明**:

| 字段 | 说明 | 示例 |
|------|------|------|
| `name` | Worker 名称，影响 URL | `omnibox-spider-worker` |
| `main` | 入口文件路径 | `src/index.js` |
| `compatibility_date` | 兼容性日期 | `2024-01-01` |
| `[vars]` | 环境变量 | `SPIDER_REPO_URL` |
| `[site]` | 静态文件配置 | `bucket = "./public"` |
| `[[kv_namespaces]]` | KV 存储 | `binding = "CACHE"` |

**高级配置**:
```toml
# 自定义域名
routes = [
  { pattern = "spider.yourdomain.com/*", zone_name = "yourdomain.com" }
]

# 多环境配置
[env.production]
name = "omnibox-spider-worker-prod"

[env.development]
name = "omnibox-spider-worker-dev"
```

---

#### 📄 `wrangler.toml.example` - 配置示例文件

**作用**: 提供配置示例，供用户参考。

**使用方法**:
```bash
# 复制示例文件
cp wrangler.toml.example wrangler.toml

# 编辑配置
nano wrangler.toml  # Linux/Mac
notepad wrangler.toml  # Windows
```

---

#### 📄 `.gitignore` - Git 忽略规则

**作用**: 指定 Git 不跟踪的文件和目录。

**内容**:
```
node_modules/      # 依赖包
dist/              # 构建输出
.wrangler/         # Wrangler 缓存
.dev.vars          # 开发环境变量
.env               # 环境变量
*.log              # 日志文件
.DS_Store          # Mac 系统文件
```

---

#### 📄 `README.md` - 项目说明文档

**作用**: 项目的主要说明文档。

**内容包括**:
- 项目介绍
- 功能特性
- 快速开始
- API 接口
- 配置说明
- 故障排查

---

#### 📄 `QUICKSTART.md` - 快速部署指南

**作用**: 提供 5 分钟快速部署的步骤指南。

**目标读者**: 想快速部署的用户。

---

#### 📄 `DEPLOYMENT_GUIDE.md` - 完整部署指南

**作用**: 提供详细的部署步骤和配置说明。

**内容包括**:
- 前置准备
- Cloudflare 账户设置
- 域名配置
- KV 命名空间创建
- 环境变量配置
- 自定义域名绑定
- 测试验证
- 故障排查
- 高级配置

**目标读者**: 需要详细配置的用户。

---

#### 📄 `deploy.bat` - Windows 部署脚本

**作用**: Windows 系统的一键部署脚本。

**执行流程**:
```
1. 检查 Node.js
2. 检查 Wrangler
3. 构建配置文件
4. 检查登录状态
5. 部署到 Cloudflare
```

**使用方法**:
```bash
# 双击运行
deploy.bat

# 或在命令行运行
.\deploy.bat
```

---

#### 📄 `deploy.sh` - Linux/Mac 部署脚本

**作用**: Linux/Mac 系统的一键部署脚本。

**使用方法**:
```bash
# 添加执行权限
chmod +x deploy.sh

# 运行脚本
./deploy.sh
```

---

## 🔄 数据流程

### 配置生成流程

```
┌─────────────────┐
│ 爬虫脚本仓库     │
│ (OmniBox-Spider)│
└────────┬────────┘
         │
         │ 1. 扫描目录
         ▼
┌─────────────────┐
│ spider-scanner  │
│ 扫描爬虫脚本     │
└────────┬────────┘
         │
         │ 2. 解析元数据
         ▼
┌─────────────────┐
│ metadata-parser │
│ 提取脚本信息     │
└────────┬────────┘
         │
         │ 3. 生成配置
         ▼
┌─────────────────┐
│config-generator │
│ 构建 TVBox 配置  │
└────────┬────────┘
         │
         │ 4. 写入文件
         ▼
┌─────────────────┐
│  config.json    │
│  TVBox 配置文件  │
└─────────────────┘
```

### 请求处理流程

```
┌─────────────┐
│ 用户请求     │
└──────┬──────┘
       │
       │ HTTP Request
       ▼
┌─────────────┐
│  index.js   │
│  Worker入口 │
└──────┬──────┘
       │
       │ 转发请求
       ▼
┌─────────────┐
│ handler.js  │
│ 请求处理器   │
└──────┬──────┘
       │
       │ 路由分发
       ├─ / → 返回主页
       ├─ /config.json → 返回配置
       ├─ /api/spiders → 返回列表
       └─ /api/refresh → 刷新缓存
       │
       ▼
┌─────────────┐
│  Response   │
│  返回响应    │
└─────────────┘
```

---

## 🎯 核心模块关系

```
┌────────────────────────────────────────┐
│            index.js (入口)              │
│         导出 Worker fetch 处理器         │
└───────────────────┬────────────────────┘
                    │
                    │ 调用
                    ▼
┌────────────────────────────────────────┐
│          handler.js (路由)              │
│    处理请求路由和返回响应                 │
└──────┬─────────────────┬───────────────┘
       │                 │
       │ 调用            │ 调用
       ▼                 ▼
┌──────────────┐  ┌─────────────────────┐
│config-       │  │ spider-scanner.js   │
│generator.js  │  │ 扫描爬虫脚本         │
│生成配置       │  └──────────┬──────────┘
└──────┬───────┘             │
       │                     │ 调用
       │ 使用                ▼
       │            ┌─────────────────────┐
       │            │ metadata-parser.js  │
       │            │ 解析脚本元数据       │
       │            └─────────────────────┘
       │
       │ 读写
       ▼
┌────────────────────────────────────────┐
│        KV Namespace (CACHE)             │
│         缓存配置数据                     │
└────────────────────────────────────────┘
```

---

## 📊 文件大小参考

| 文件 | 大小 | 说明 |
|------|------|------|
| `src/index.js` | ~0.5KB | 入口文件，很小 |
| `src/handler.js` | ~3KB | 请求处理器 |
| `src/spider-scanner.js` | ~2KB | 扫描器 |
| `src/metadata-parser.js` | ~1.5KB | 解析器 |
| `src/config-generator.js` | ~2KB | 配置生成器 |
| `scripts/build-config.js` | ~5KB | 构建脚本 |
| `public/config.json` | ~50-100KB | 生成的配置 |
| `package.json` | ~0.5KB | 项目配置 |
| `wrangler.toml` | ~0.3KB | Worker 配置 |

**总大小**: 约 65-115KB（不含 node_modules）

---

## 🔧 扩展建议

### 添加新的爬虫类别

编辑 `spider-scanner.js`:

```javascript
const CATEGORIES = [
  '影视/采集',
  '影视/网盘',
  // 添加新类别
  '影视/新类别',
];
```

### 添加新的 API 端点

编辑 `handler.js`:

```javascript
if (path === '/api/new-endpoint') {
  // 处理新端点
  return new Response(JSON.stringify({ data: '...' }));
}
```

### 自定义配置格式

编辑 `config-generator.js`:

```javascript
function buildTVBoxConfig(spiders, env) {
  // 自定义配置结构
  return {
    spider: '...',
    wallpaper: '...',
    sites: customFormat(spiders),
    // 添加自定义字段
    customField: '...',
  };
}
```

---

## 📚 相关文档

- [README.md](README.md) - 项目说明
- [QUICKSTART.md](QUICKSTART.md) - 快速部署
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - 完整部署指南

---

**最后更新**: 2024-01-01
