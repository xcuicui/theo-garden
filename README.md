# theo-garden（GitHub Pages 聚合站）

这个仓库是 Theo 的 **GitHub Pages 聚合站**：把几个静态子页面统一挂在同一个域名与路径下。

- 线上地址：<https://xcuicui.github.io/theo-garden/>
- 仓库：<https://github.com/xcuicui/theo-garden>

---

## 1) 路由 / 页面结构

- `/`：入口（`index.html`）
- `/simple/`：Theo 的小花园（静态页集合）
- `/greeting/`：小问候（静态页）
- `/notes/`：Theo 的碎碎念收纳处（带“弱门槛”写入）

在仓库里对应目录：
- `simple/`
- `greeting/`（当前包含 `index.html` + `data.obf.js`）
- `notes/`

---

## 2) `/notes/` 的存储仓库（重要）

`/notes/` 的数据**不**存放在本仓库，而是读写到一个单独的 **GitHub 私有仓库**：
- repo：`xcuicui/theo-notes`
- branch：`main`

数据布局（在 `xcuicui/theo-notes` 内）：
- `notes/index.json`
- `notes/YYYY-MM-DD/entries.json`
- `notes/YYYY-MM-DD/images/...`

---

## 3) Token gate（弱保护说明）

`/notes/` 采用“4 位口令 + 本地解密 token 文件”的方式做**弱门槛**（混淆而非安全）：
- 前端输入 4 位口令
- 本地解密 `notes/gh-token.enc.json` 得到 GitHub PAT
- 用该 PAT 对 `xcuicui/theo-notes` 进行读写

> 这不是强安全：能防止“随手打开就能写”，不能抵御认真攻击。

---

## 4) 接手（另一台机器 / 另一套 OpenClaw 实例）

### 你需要准备
- 能访问并写入私有仓库 `xcuicui/theo-notes` 的 GitHub PAT
- 4 位口令（与加密 token 时一致）

### 基本操作
```bash
git clone https://github.com/xcuicui/theo-garden.git
cd theo-garden
# 修改静态文件后 push，GitHub Pages 会自动更新（可能有 30-120s 延迟）
```

### 常见维护点
- 更新某个子页面：直接改对应目录（`greeting/`、`notes/`、`simple/`）下的静态文件
- `/notes/` 写入失败：优先检查 PAT 权限、token 是否过期、以及 `xcuicui/theo-notes` 的目录结构是否一致

---

## 5) 相关仓库索引（方便交接排查）

- 聚合站（本仓库）：`xcuicui/theo-garden`
- notes 数据仓库（私有）：`xcuicui/theo-notes`
- simple 小花园（独立静态站历史来源之一）：`xcuicui/theo-simple-garden`
