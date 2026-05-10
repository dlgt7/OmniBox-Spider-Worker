# OmniBox-Spider-Worker

TVBox 爬虫配置自动生成器 - 部署到 Cloudflare Workers

## 快速部署指南

### 步骤 1: Fork 项目到 GitHub

1. 访问你的 GitHub 仓库
2. Fork 到你自己的账户

### 步骤 2: 创建 KV 命名空间

**重要**: 在部署前必须先创建 KV 命名空间！

1. 登录 Cloudflare Dashboard: https://dash.cloudflare.com
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

1. 登录 Cloudflare Dashboard: https://dash.cloudflare.com
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
```

---

## 步骤 5: 配置自定义域名（重要）

**为什么需要自定义域名？**

没有自定义域名，`*.workers.dev` 在国内网络环境下大概率打不开。建议绑定自己的域名。

### 5.1 注册免费域名

1. 访问 https://dash.domain.digitalplat.org
2. 注册账号并登录
3. 搜索你想要的域名（例如：`yourname.top`、`yourname.xyz` 等）
4. 选择免费域名，完成注册
5. **记下你的域名**，后面要用

### 5.2 将域名托管到 Cloudflare

**第一步：在 Cloudflare 添加域名**

1. 登录 Cloudflare Dashboard: https://dash.cloudflare.com
2. 点击左侧菜单「概述」或首页的「添加站点」
3. 输入你刚才注册的域名（例如：`yourname.top`）
4. 点击「添加站点」
5. 选择计划：选择「Free 免费」计划
6. 点击「继续」

**第二步：获取 Cloudflare NS 服务器地址**

1. 添加完成后，Cloudflare 会显示两个 NS 服务器地址，类似：
   ```
   adam.ns.cloudflare.com
   bella.ns.cloudflare.com
   ```
   或者：
   ```
   ns1.cloudflare.com
   ns2.cloudflare.com
   ```
2. **复制这两个 NS 地址**，记下来

**第三步：修改域名的 NS 服务器**

1. 回到域名注册商：https://dash.domain.digitalplat.org
2. 点击「域名列表」
3. 找到你刚才注册的域名，点击「管理」或「设置」
4. 找到「DNS 服务器」或「NS 服务器」设置
5. 选择「自定义 DNS 服务器」或「修改 NS」
6. 填入刚才从 Cloudflare 复制的两个 NS 地址
7. 保存修改

**第四步：等待生效**

- NS 修改生效需要 **几分钟到几小时** 不等
- 在 Cloudflare Dashboard 检查状态，显示「有效」或绿色对勾表示成功
- 可以用 `ping 你的域名` 测试是否生效

### 5.3 为 Worker 绑定自定义域名

**前提条件**：域名必须已经托管在 Cloudflare（NS 已生效）

**操作步骤**：

1. 登录 Cloudflare Dashboard: https://dash.cloudflare.com
2. 点击左侧「Workers 和 Pages」
3. 点击你创建的 Worker（例如：`omnibox-spider-worker`）
4. 点击顶部「设置」选项卡
5. 找到「域和路由」或「Triggers」
6. 点击「添加」或「Add custom domain」
7. 填写自定义域名：
   - 类型：自定义域名
   - 域名：`tvbox.你的域名.com`（例如：`tvbox.yourname.top`）
8. 点击「添加域名」

**等待 DNS 生效**

- Cloudflare 会自动创建 DNS 记录
- 通常几分钟内生效
- 生效后访问：`https://tvbox.你的域名.com/config.json`

### 5.4 验证配置

部署完成后，访问以下地址验证：

| 地址                                  | 说明        |
| ------------------------------------- | ----------- |
| `https://tvbox.你的域名.com/config.json` | TVBox 配置  |
| `https://tvbox.你的域名.com/api/spiders` | 爬虫列表    |
| `https://tvbox.你的域名.com/api/refresh` | 刷新缓存    |
| `https://tvbox.你的域名.com/api/health`  | 健康检查    |

---

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

## 常见问题

### Q: workers.dev 域名打不开怎么办？

A: 国内网络环境下 `*.workers.dev` 可能被屏蔽，请绑定自定义域名。

### Q: 域名 NS 修改后多久生效？

A: 通常几分钟到几小时，最长可能需要 24-48 小时。

### Q: 如何刷新配置缓存？

A: 访问 `https://tvbox.你的域名.com/api/refresh` 即可刷新缓存。

## License

MIT
