# theo-garden（Theo & Evie 的 GitHub Pages 小站）

这是一个部署在 **GitHub Pages** 上的静态小站，用来把几块小功能聚合在同一个域名/路径下：

- 线上地址：<https://xcuicui.github.io/theo-garden/>
- 仓库地址：<https://github.com/xcuicui/theo-garden>

> 说明：这是纯静态站（HTML/CSS/JS），不依赖后端服务。

---

## 功能与页面结构（路由）

| 路径 | 作用 | 代码位置 |
|---|---|---|
| `/` | 登录页（选择账号 + 4 位口令） | `index.html` |
| `/greeting/` | 小问候（左右滑动切换）+ 入口 Hub | `greeting/` |
| `/notes/` | 碎碎念：写入文字 + 图片；也支持简单互动（回复/反应等，数据存在私有仓库） | `notes/` |
| `/dates/` | 约会清单 + 约会日记（每项可写日志、传照片，数据存在私有仓库） | `dates/` |
| `/simple/` | 小花园（静态页面集合） | `simple/` |

仓库额外文件：
- `.nojekyll`：关闭 Jekyll 处理，避免 GitHub Pages 对下划线等路径的默认行为影响。

---

## 登录与“弱保护”机制（重要）

站点采用 **localStorage + 口令门槛** 的方式做弱保护（“混淆/门槛”而非安全）：

1. 访问 `/` 输入 **4 位口令**，通过后写入：
   - `localStorage.theo_auth_ok = "1"`
   - `localStorage.theo_auth_user = "Theo" | "Evie"`
   - `localStorage.theo_site_pass = "<4位口令>"`（供 `/notes`、`/dates` 解密 token 复用）
2. `/greeting/`、`/notes/`、`/dates/` 会检查 `theo_auth_ok` / `theo_auth_user`，不满足会跳回登录页。

> ⚠️ 这不是强安全：可以防止“随手打开就能写”，但不能抵御认真攻击（静态站无法真正保密）。

---

## 数据存储：私有仓库 `xcuicui/theo-notes`

为了避免把日记/图片直接放在公开 Pages 仓库里，`/notes/` 与 `/dates/` 的数据 **读写到一个单独的 GitHub 私有仓库**：

- repo：`xcuicui/theo-notes`
- branch：`main`

### notes 数据布局（在 `xcuicui/theo-notes` 内）

- `notes/index.json`
- `notes/YYYY-MM-DD/entries.json`
- `notes/YYYY-MM-DD/images/...`

### dates 数据布局（在 `xcuicui/theo-notes` 内）

- `dates/ideas.json`（约会清单的“项目库”）
- `dates/index.json`（全局日记索引，便于汇总）
- `dates/YYYY-MM-DD/entries.json`（按天的日记）
- `dates/YYYY-MM-DD/images/...`（照片）

> 页面端通过 GitHub API（`api.github.com`）对私有仓库进行读写；图片展示会用带 Authorization 的 fetch 拉取，再转成 `blob:` URL（因为私有仓库无法直接用 raw.githubusercontent.com 链接公开展示）。

---

## GitHub PAT（token）与加密文件

`/notes/` 与 `/dates/` 需要一个有权限访问 `xcuicui/theo-notes` 的 GitHub PAT。
为了不把 PAT 明文放在代码里，仓库里存的是**加密后的 token 文件**：

- `notes/gh-token.enc.json`
- `dates/gh-token.enc.json`

加密/解密方式：
- PBKDF2（SHA-256）派生密钥
- AES-GCM 加解密
- 解密口令来自 `localStorage.theo_site_pass`（通常由登录页写入）

### 更新/更换 PAT 的办法

仓库自带脚本：`tools/encrypt-gh-token.mjs`

```bash
# 生成加密 token（notes 目录用）
node tools/encrypt-gh-token.mjs --token "<github_pat>" --pass "1234" > notes/gh-token.enc.json

# dates 目录也需要一份（同一个 PAT 也可以）
node tools/encrypt-gh-token.mjs --token "<github_pat>" --pass "1234" > dates/gh-token.enc.json
```

> `--pass` 必须与站点使用的 4 位口令一致，否则前端解密会失败。

建议 PAT 权限（最小化原则）：
- Fine-grained PAT：只授权仓库 `xcuicui/theo-notes`，并允许 Contents 读写（以及必要的 Metadata 读取）。

---

## greeting 文案的“混淆”

`/greeting/` 的文案不以明文出现在仓库里，而是放在 `greeting/data.obf.js` 里做简单混淆（反转 + base64 + utf-8 解码）。

> 同样是“弱保护/避免一眼看到”，不是加密。

---

## 本地开发 / 修改发布

这是纯静态站，通常你只需要：

```bash
git clone https://github.com/xcuicui/theo-garden.git
cd theo-garden
# 修改静态文件后 push，GitHub Pages 会自动更新（通常 30-120s）
```

想本地预览可用任意静态服务器（例如）：

```bash
python3 -m http.server 5173
# 打开 http://localhost:5173/theo-garden/ （或直接 /）
```

---

## 相关仓库索引

- 聚合站（本仓库）：`xcuicui/theo-garden`
- notes/dates 数据仓库（私有）：`xcuicui/theo-notes`
- simple 小花园（历史来源之一）：`xcuicui/theo-simple-garden`
