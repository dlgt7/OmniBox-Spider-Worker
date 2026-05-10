# 📚 项目文档导航

欢迎使用 OmniBox Spider Worker！本文档将帮助你快速找到所需的信息。

---

## 🎯 我应该从哪里开始？

### 👶 如果你是新手

1. **先看** → [README.md](README.md)
   - 了解项目是什么
   - 看看功能特性
   - 快速上手指南

2. **然后看** → [QUICKSTART.md](QUICKSTART.md)
   - 5 分钟快速部署
   - 简单明了的步骤

### 🚀 如果你想详细了解部署

→ [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- 完整的部署步骤
- 域名配置详解
- 环境变量设置
- 自定义域名绑定
- 故障排查

### 🏗️ 如果你想了解项目结构

→ [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)
- 详细的目录结构
- 每个文件的作用
- 代码组织方式
- 数据流程图

### 📖 如果你想查看所有文档

继续阅读本文档 ↓

---

## 📑 文档列表

### 1. [README.md](README.md) - 项目说明

**适合人群**: 所有用户

**内容概要**:
- ✅ 项目介绍和功能特性
- ✅ 快速开始指南
- ✅ API 接口说明
- ✅ 配置说明
- ✅ 故障排查

**阅读时间**: 5-10 分钟

**何时阅读**: 第一次接触项目时

---

### 2. [QUICKSTART.md](QUICKSTART.md) - 快速部署指南

**适合人群**: 想快速部署的用户

**内容概要**:
- ✅ 5 分钟部署步骤
- ✅ 环境准备
- ✅ 一键部署脚本
- ✅ 在 TVBox 中使用

**阅读时间**: 3-5 分钟

**何时阅读**: 准备部署时

---

### 3. [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - 完整部署指南

**适合人群**: 需要详细配置的用户

**内容概要**:
- ✅ 前置准备（Node.js、Wrangler）
- ✅ Cloudflare 账户设置
- ✅ 域名配置（Workers.dev / 自定义域名）
- ✅ KV 命名空间创建
- ✅ 环境变量配置
- ✅ 自定义域名绑定
- ✅ 测试和验证
- ✅ 高级配置（缓存、CORS、速率限制）
- ✅ 故障排查
- ✅ 维护和更新

**阅读时间**: 20-30 分钟

**何时阅读**: 
- 需要自定义域名时
- 遇到部署问题时
- 需要高级配置时

---

### 4. [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - 项目结构详解

**适合人群**: 开发者、想了解内部实现的用户

**内容概要**:
- ✅ 完整的目录结构
- ✅ 每个文件的详细作用
- ✅ 代码组织方式
- ✅ 数据流程图
- ✅ 核心模块关系
- ✅ 文件大小参考
- ✅ 扩展建议

**阅读时间**: 15-20 分钟

**何时阅读**:
- 想了解项目内部实现时
- 需要修改代码时
- 想扩展功能时

---

### 5. [本文档](DOCUMENTATION.md) - 文档导航

**适合人群**: 所有用户

**内容概要**:
- ✅ 文档导航和索引
- ✅ 快速找到所需信息
- ✅ 常见问题解答

**阅读时间**: 2-3 分钟

**何时阅读**: 不确定看哪个文档时

---

## 🗺️ 学习路径

### 路径 1: 快速上手（推荐新手）

```
README.md (5分钟)
    ↓
QUICKSTART.md (5分钟)
    ↓
开始部署
    ↓
遇到问题？
    ↓
DEPLOYMENT_GUIDE.md (查看故障排查部分)
```

**总时间**: 约 10-15 分钟

---

### 路径 2: 完整学习（推荐进阶用户）

```
README.md (10分钟)
    ↓
PROJECT_STRUCTURE.md (20分钟)
    ↓
DEPLOYMENT_GUIDE.md (30分钟)
    ↓
开始部署和配置
    ↓
根据需要查阅相关文档
```

**总时间**: 约 1 小时

---

### 路径 3: 开发者路径

```
README.md (了解项目)
    ↓
PROJECT_STRUCTURE.md (理解结构)
    ↓
阅读源代码
    ↓
DEPLOYMENT_GUIDE.md (部署测试)
    ↓
修改和扩展功能
```

**总时间**: 约 2-3 小时

---

## ❓ 常见问题快速索引

### 部署相关

| 问题 | 查看文档 | 章节 |
|------|---------|------|
| 如何安装 Node.js？ | DEPLOYMENT_GUIDE.md | 前置准备 |
| 如何登录 Cloudflare？ | DEPLOYMENT_GUIDE.md | Cloudflare 账户设置 |
| 如何创建 KV 命名空间？ | DEPLOYMENT_GUIDE.md | 创建 KV 命名空间 |
| 如何绑定自定义域名？ | DEPLOYMENT_GUIDE.md | 绑定自定义域名 |
| 部署失败怎么办？ | DEPLOYMENT_GUIDE.md | 故障排查 |

### 配置相关

| 问题 | 查看文档 | 章节 |
|------|---------|------|
| 如何配置环境变量？ | DEPLOYMENT_GUIDE.md | 配置环境变量 |
| wrangler.toml 怎么配置？ | README.md | 配置说明 |
| 如何修改爬虫仓库路径？ | PROJECT_STRUCTURE.md | build-config.js |

### 使用相关

| 问题 | 查看文档 | 章节 |
|------|---------|------|
| 如何在 TVBox 中使用？ | QUICKSTART.md | 在 TVBox 中使用 |
| 如何更新爬虫脚本？ | README.md | 更新爬虫脚本 |
| 如何查看日志？ | DEPLOYMENT_GUIDE.md | 测试和验证 |

### 开发相关

| 问题 | 查看文档 | 章节 |
|------|---------|------|
| 项目结构是怎样的？ | PROJECT_STRUCTURE.md | 完整目录结构 |
| 如何添加新的 API？ | PROJECT_STRUCTURE.md | 扩展建议 |
| 如何自定义配置格式？ | PROJECT_STRUCTURE.md | 扩展建议 |

---

## 📝 文档更新记录

| 日期 | 文档 | 更新内容 |
|------|------|---------|
| 2024-01-01 | README.md | 初始版本 |
| 2024-01-01 | QUICKSTART.md | 初始版本 |
| 2024-01-01 | DEPLOYMENT_GUIDE.md | 初始版本 |
| 2024-01-01 | PROJECT_STRUCTURE.md | 初始版本 |
| 2024-01-01 | DOCUMENTATION.md | 初始版本 |

---

## 🆘 还是找不到答案？

### 1. 搜索文档

在文档中使用浏览器的搜索功能（Ctrl+F / Cmd+F）查找关键词。

### 2. 查看源代码

如果文档中没有答案，可以直接查看源代码：

- `src/` - Worker 源代码
- `scripts/` - 构建脚本
- `wrangler.toml` - 配置文件

### 3. 查看官方文档

- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Wrangler CLI 文档](https://developers.cloudflare.com/workers/wrangler/)
- [TVBox 项目](https://github.com/CatVodTVOfficial/TVBoxOSC)

### 4. 社区支持

- [Cloudflare 社区](https://community.cloudflare.com/)
- [GitHub Issues](https://github.com/Silent1566/OmniBox-Spider/issues)

---

## 📊 文档统计

- **总文档数**: 5 个
- **总字数**: 约 20,000 字
- **总阅读时间**: 约 60-90 分钟
- **代码示例**: 50+ 个
- **流程图**: 3 个

---

## 🎯 推荐阅读顺序

### 对于新手用户

1. README.md（了解项目）
2. QUICKSTART.md（快速部署）
3. 遇到问题时查看 DEPLOYMENT_GUIDE.md

### 对于进阶用户

1. README.md（全面了解）
2. PROJECT_STRUCTURE.md（深入理解）
3. DEPLOYMENT_GUIDE.md（详细配置）

### 对于开发者

1. README.md（项目概览）
2. PROJECT_STRUCTURE.md（架构理解）
3. 阅读源代码
4. DEPLOYMENT_GUIDE.md（部署和优化）

---

## 💡 小贴士

1. **收藏本文档**: 作为文档导航的入口
2. **按需阅读**: 不需要一次性读完所有文档
3. **实践为主**: 边看文档边实践效果更好
4. **善用搜索**: 使用 Ctrl+F 快速查找关键词

---

**祝你使用愉快！🎉**

如有问题，请随时查阅相关文档或寻求社区帮助。
