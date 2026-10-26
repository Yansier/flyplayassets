# LIVE_CAPTURE_REPORT

> 站点：https://zzyl909.com/index.html#/home  
> 捕获时间：2026-10-26T18:50:50.674Z  
> 输出目录：`Phase2/live-capture/`（未修改 start-demo）

---

## 1. Site bootstrap structure

| 项 | 结论 |
|---|---|
| 页面加载 | 正常（Playwright 无头 + 390×844 视口） |
| 框架 | **Vue 2** SPA + **Vue Router**（hash 模式 #/home） |
| 状态 | **Vuex**（见 `chunk-libs` 内 vuex 运行时） |
| UI | **Vant**（`van-*` 组件样式于 `app.css`） |
| 其他 | vue-i18n、vue-awesome-swiper、jQuery（AliCDN）、腾讯验证码 |
| 入口 HTML | `live-capture/html/index.html` |
| Mount | `<div id="app"></div>` |
| 同步脚本链 | `runtime.7ecd6f03.js` → `chunk-libs.737aff16.js` → `app.bdb00f7e.js` |

---

## 2. Runtime / app / vendor bundle

| 角色 | 线上 URL | 本地路径 |
|---|---|---|
| runtime | `/static/js/runtime.7ecd6f03.js` | `live-capture/js/runtime.7ecd6f03.js` |
| vendor (chunk-libs) | `/static/js/chunk-libs.737aff16.js` | `live-capture/js/chunks/chunk-libs.737aff16.js` |
| main app | `/static/js/app.bdb00f7e.js` | `live-capture/js/app.bdb00f7e.js` |
| global CSS | `app.4fa685bd.css` + `chunk-libs.39c91ef2.css` | `live-capture/css/` |

---

## 3. Lazy-loaded JS chunks（本次路由探测实际加载）

共 **20** 个异步 JS chunk（不含 chunk-libs），均已保存到 `live-capture/js/chunks/`：

- `chunk-4508e90d.266d823d.js`
- `chunk-2d21d0c2.01548541.js`
- `chunk-6aa2bf01.22e80a7f.js`
- `chunk-b4a4df72.139f0afd.js`
- `chunk-44d9d82f.85efd051.js`
- `chunk-2d0b6d26.81000eb4.js`
- `chunk-8792ddae.91b3a3d0.js`
- `chunk-5116e2e5.0ed8ed4d.js`
- `chunk-07c426b3.15589d96.js`
- `chunk-5c12875d.72ea266c.js`
- `chunk-260c0cbb.dfc10a8a.js`
- `chunk-3ec2ef1a.fbfc853d.js`
- `chunk-91071a16.cc777dcc.js`
- `chunk-a1caaf50.d14191cf.js`
- `chunk-eb13fa78.a2574d86.js`
- `chunk-c169c6e4.c3baf8c5.js`
- `chunk-14abfa5a.c69fa203.js`
- `chunk-6cf86faa.4b2e7134.js`
- `chunk-6be9950d.2200e0a7.js`
- `chunk-4fdfc0e0.a6968264.js`

> 路由 `/login`、`/registry` 的组件在 `app.bdb00f7e.js` 内同步模块（`Promise.resolve().then(...)`），未产生独立 chunk 请求。

---

## 4. Lazy-loaded CSS chunks

共 **16** 个异步 CSS chunk，保存于 `live-capture/css/chunks/`：

- `chunk-4508e90d.7a117a9b.css`
- `chunk-b4a4df72.95636d64.css`
- `chunk-44d9d82f.fac47ca8.css`
- `chunk-8792ddae.54189433.css`
- `chunk-5116e2e5.771cddd2.css`
- `chunk-07c426b3.b517f0b8.css`
- `chunk-5c12875d.a4fa878f.css`
- `chunk-260c0cbb.a402fe85.css`
- `chunk-3ec2ef1a.c01b7cc6.css`
- `chunk-a1caaf50.9994d893.css`
- `chunk-eb13fa78.aa8a7386.css`
- `chunk-c169c6e4.cab5fe21.css`
- `chunk-14abfa5a.574bcec0.css`
- `chunk-6cf86faa.ce24dcbf.css`
- `chunk-6be9950d.f8797346.css`
- `chunk-4fdfc0e0.e5ca690a.css`

---

## 5. Route → chunk mapping（运行时观测 + 路由表交叉参考）

| Route / Page | Chunk ID | JS (hash 文件名) | CSS (hash 文件名) |
|---|---|---|---|
| `/home` | `chunk-4508e90d` | `chunk-4508e90d.266d823d.js` | `chunk-4508e90d.7a117a9b.css` |
|  | `chunk-2d21d0c2` | `chunk-2d21d0c2.01548541.js` | `chunk-4508e90d.7a117a9b.css` |
|  | `chunk-6aa2bf01` | `chunk-6aa2bf01.22e80a7f.js` | `chunk-4508e90d.7a117a9b.css` |
| `/activity` | `chunk-b4a4df72` | `chunk-b4a4df72.139f0afd.js` | `chunk-b4a4df72.95636d64.css` |
| `/user` | `chunk-44d9d82f` | `chunk-44d9d82f.85efd051.js` | `chunk-44d9d82f.fac47ca8.css` |
|  | `chunk-2d0b6d26` | `chunk-2d0b6d26.81000eb4.js` | `chunk-44d9d82f.fac47ca8.css` |
| `/taskCenter` | `chunk-8792ddae` | `chunk-8792ddae.91b3a3d0.js` | `chunk-8792ddae.54189433.css` |
| `/vip` | `chunk-5116e2e5` | `chunk-5116e2e5.0ed8ed4d.js` | `chunk-5116e2e5.771cddd2.css` |
| `/shareFriends` | `chunk-07c426b3` | `chunk-07c426b3.15589d96.js` | `chunk-07c426b3.b517f0b8.css` |
| `/inviteFriends` | `chunk-5c12875d` | `chunk-5c12875d.72ea266c.js` | `chunk-5c12875d.a4fa878f.css` |
| `/recharge` | `chunk-260c0cbb` | `chunk-260c0cbb.dfc10a8a.js` | `chunk-260c0cbb.a402fe85.css` |
| `/reflect` | `chunk-3ec2ef1a` | `chunk-3ec2ef1a.fbfc853d.js` | `chunk-3ec2ef1a.c01b7cc6.css` |
|  | `chunk-91071a16` | `chunk-91071a16.cc777dcc.js` | `chunk-3ec2ef1a.c01b7cc6.css` |
| `/orderRecord` | `chunk-a1caaf50` | `chunk-a1caaf50.d14191cf.js` | `chunk-a1caaf50.9994d893.css` |
|  | `chunk-eb13fa78` | `chunk-eb13fa78.a2574d86.js` | `chunk-eb13fa78.aa8a7386.css` |
| `/rechargeRecord` | `chunk-c169c6e4` | `chunk-c169c6e4.c3baf8c5.js` | `chunk-c169c6e4.cab5fe21.css` |
| `/safeCenter` | `chunk-14abfa5a` | `chunk-14abfa5a.c69fa203.js` | `chunk-14abfa5a.574bcec0.css` |
| `/vipDetail` | `chunk-6cf86faa` | `chunk-6cf86faa.4b2e7134.js` | `chunk-6cf86faa.ce24dcbf.css` |
| `/softwareDownload` | `chunk-6be9950d` | `chunk-6be9950d.2200e0a7.js` | `chunk-6be9950d.f8797346.css` |
| `/partner` | `chunk-4fdfc0e0` | `chunk-4fdfc0e0.a6968264.js` | `chunk-4fdfc0e0.e5ca690a.css` |

**重点路由（来自既有 `route-windows.json` 静态路由表，供补全未访问页面）**

| Route | 路由表 chunk 前缀（可能尚未全部拉取） |
|---|---|
| /home | chunk-2d21d0c2, chunk-6aa2bf01, chunk-4508e90d (+ 共享块) |
| /activity | chunk-b4a4df72 |
| /user | chunk-2d0b6d26, chunk-44d9d82f |
| /recharge | chunk-2d21d0c2, chunk-260c0cbb |
| /reflect | chunk-91071a16, chunk-3ec2ef1a |
| /taskCenter | chunk-8792ddae |
| /vip | chunk-5116e2e5 |
| /vipDetail | chunk-6cf86faa |
| /shareFriends | chunk-07c426b3 |
| /inviteFriends | chunk-5c12875d |
| /orderRecord | chunk-a1caaf50 (+ chunk-eb13fa78 辅助) |
| /safeCenter | chunk-14abfa5a |

---

## 6. Image inventory

- Network 层直接捕获：**67** 张
- 从已捕获 JS/CSS 引用补拉 `static/img/*`：**339** 张（含 logo/favicon）
- 格式约：PNG 131 / WebP 132 / SVG 75

---

## 7. Font inventory

- 运行时 **未观察到独立 WOFF/WOFF2 请求**（字体多为 PingFang 系列系统字体 + Vant/iconfont 内嵌）。
- `chunk-libs.css` 含 iconfont 类资源引用，无单独 font 文件落盘。

---

## 8. Home-page asset mapping

| UI 元素 | 资源情况 | 本地参考 |
|---|---|---|
| 顶部 Logo | `/imageConfig/zzyl888logo.png`（动态配置） | `images/zzyl888logo.png` |
| Favicon | `/imageConfig/zzyl888favicon.ico` | `images/zzyl888favicon.ico` |
| USDT / 币种 | `USDT.63b507fe.svg` 等 | `images/USDT*.svg` |
| 刷新 / 钱包等 | 多为 SVG 或 webp 小图标 | 见 `images/icon_*` |
| 公告条 | 样式在 home chunk CSS；文案来自 API | API 被 WAF 拦截，见 §10 |
| **Banner 轮播** | **依赖 `gethomedata` 等 API 返回 URL** | **本次未拿到 JSON / 远程 banner 图** |
| 快捷入口 | 充值/提现/任务/邀请/收入 webp | `images/*@2x*.webp` |
| 分类 Tab 图标 | chunk 内联 + 部分 static/img | CSS/JS 内 url() |
| 热门游戏封面 | 静态占位 `hxyx_*.png` + 线上列表 API | `images/hxyx_*.png`（16 个） |
| Provider logo | `provider_*.png`, `game_provider.*` | 已保存 |
| 左右切换 | 多为 CSS/base64 webp | 见 home chunk |
| **Bottom Nav** | **SVG symbol 内联于 `app.bdb00f7e.js`**（首页/活动/客服/下载/我的，含 active 变体） | 需从 app.js 提取 SVG，非独立 PNG |

---

## 9. API endpoints observed（正常浏览）

- `https://int.zzyl901.com/gethomeconfig`
- `https://int.zzyl901.com/getTiktokPixelInfo`
- `https://int.zzyl901.com/user/getuserinfo`
- `https://int.zzyl901.com/getFBPixelInfo`
- `https://int.zzyl901.com/gethomedata`
- `https://int.zzyl901.com/activity/activlist`
- `https://int.zzyl901.com/vip/myvip`
- `https://int.zzyl901.com/user/getuserinfo`
- `https://int.zzyl901.com/invite/shareother`
- `https://int.zzyl901.com/user/getUToken`
- `https://int.zzyl901.com/getBotinfo`
- `https://int.zzyl901.com/task/getTask`
- `https://int.zzyl901.com/user/getAgentinfo`
- `https://int.zzyl901.com/invite/agentdata2`
- `https://int.zzyl901.com/user/getSuppleUrl`
- `https://int.zzyl901.com/draw/webDrawIndex`
- `https://int.zzyl902.com/user/getuserinfo`
- `https://int.zzyl902.com/gethomedata`
- `https://int.zzyl902.com/pay/toprecord`
- `https://int.zzyl902.com/safe/infos`
- `https://int.zzyl902.com/vip/vipdetail`
- `https://int.zzyl902.com/getServerUrl`
- `https://int.zzyl902.com/getBotinfo`
- `https://int.zzyl902.com/user/getAgentinfo`

---

## 10. API fields containing image URLs

**本次 Playwright 无头会话中，`int.zzyl901.com` / `int.zzyl902.com` 多数接口返回阿里云 WAF（`alicfw`）HTML 挑战页**，保存于 `live-capture/html/gethomedata_*` 等，**非 JSON**，因此未能解析 banner / 游戏列表动态 URL 字段。

预期（据前端 chunk 命名与接口路径推断，待 WAF 通过后重抓）：

| Endpoint | 可能字段 |
|---|---|
| `/gethomedata` | banner / 游戏列表 / 分类图标 URL |
| `/gethomeconfig` | logo、主题、系统图 |
| `/activity/activlist` | 活动封面 |
| `/getBotinfo` | 客服图标/背景 |

---

## 11. Missing / failed resources

| URL / 项 | 原因 |
|---|---|
| `https://zzyl909.com/undefined` | 404（/user 页某资源拼接错误） |
| `static/img/6-0` 等 3 条 | CSS 解析误匹配，非真实文件 |
| **Banner 远程图** | API WAF，未返回 JSON |
| **大量未访问路由 chunk** | 站点路由表 >100 条，本次仅探测 18 次导航 |
| **PWA manifest** | index.html 未声明 `manifest.json`；仅有 apple-touch-icon |

---

## 12. Assets most useful for reconstruction

1. 完整 **home 三件套**：`chunk-4508e90d.*.js/css` + `chunk-6aa2bf01` + `chunk-2d21d0c2`
2. **app + runtime + chunk-libs**（含底部导航 SVG、路由表、Vuex）
3. **imageConfig logo/favicon**
4. **home-bg / 黑金首页bg** 背景
5. **快捷入口 webp 五件套**
6. **provider_* 与 game_provider**
7. **hxyx_* 游戏封面占位集**
8. **USDT / 充值 SVG 资产条**
9. **global app.css**（Tabbar/Vant 覆盖样式）
10. 各 Tab 页 chunk（activity/user/vip）用于对照布局

---

## Highest-value assets for homepage reconstruction

1. `images/zzyl888logo.png`
2. `images/zzyl888favicon.ico`
3. `images/home-bg.36379d9c.png`
4. `images/黑金首页bg.d356e2fb.webp`
5. `css/app.4fa685bd.css`
6. `css/chunks/chunk-4508e90d.7a117a9b.css`
7. `js/chunks/chunk-4508e90d.266d823d.js`
8. `js/app.bdb00f7e.js`
9. `js/runtime.7ecd6f03.js`
10. `js/chunks/chunk-libs.737aff16.js`
11. `images/充值@2x.97f26eb9.webp`
12. `images/提现@2x.688068fa.webp`
13. `images/任务@2x.5d976296.webp`
14. `images/邀请@2x.6ed328e0.webp`
15. `images/收入@2x.7c22fd0e.webp`
16. `images/USDT.63b507fe.svg`
17. `images/game_provider.26d93723.png`
18. `images/provider_pg.140b8ae6.png`
19. `images/hxyx_102.8f728f69.png`
20. `js/app.bdb00f7e.js (inline SVG bottom-tab icons)`

---

## 捕获元数据

- 清单：`live-capture/metadata/capture-manifest.json`
- 补拉日志：`live-capture/metadata/missing-fetch-log.json`
- 自动化脚本：`tools/capture/live-runtime-capture.js`

