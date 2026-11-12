# AI 快捷入口

<p align="center">
  <img src="icon.svg" width="88" height="88" alt="AI 快捷入口图标" />
</p>

<p align="center">
  固定在你窗口右下角的 AI 快捷入口栏 —— 一点直达 20 个国产与海外 AI 对话网站。
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-2ea44f?style=flat-square" alt="MIT License" /></a>
  <img src="https://img.shields.io/badge/DeepSeek%20Harness-plugin-4D6BFE?style=flat-square" alt="DeepSeek Harness plugin" />
  <img src="https://img.shields.io/badge/version-0.1.0-f59e0b?style=flat-square" alt="Version 0.1.0" />
</p>

> 一个 DeepSeek Harness 的本地 bundle 插件：在 Web UI 右下角固定一条快捷栏，点图标用系统默认浏览器打开对应的 AI 网站。

## ✨ 特性

- **固定右下角**：浮在所有界面之上，不随页面滚动，不挡输入框。
- **一点直达**：普通 `<a target="_blank">` 链接，桌面端由窗口策略调用 `shell.openExternal`，即系统默认浏览器。
- **20 个入口，默认只占 4 个槽位**：DeepSeek、Kimi、通义千问、ChatGPT。
- **自由选择哪 4 个**：点滑杆打开选择面板，按「国产 / 海外」分组；点图标或名字直接访问，点右侧圆点勾选加入快捷栏（最多 4 个、至少 1 个），选择会保存。
- **真实品牌图标**：来自 LobeHub Icons，白色圆底，深浅色主题都清晰；图标内联为 data URI，运行时不发任何网络请求。
- **中英双语**：界面文案跟随 Harness 语言切换。
- **可收起**：收起后只留一个圆形启动按钮。
- **零运行时依赖**：纯本地 bundle，无需构建；只有图标有生成脚本。

## 🚀 快速开始

### 环境

- DeepSeek Harness（桌面版或 Web 版），且当前 profile 具备 `shell.overlay` 槽位与客户端模块（官方桌面 / Web 组合默认具备）。
- 不需要 Node.js 或 npm。

### 安装

```bash
git clone https://github.com/Chengyunlai/dsh-ai-quick-links.git
```

然后在 Harness 中把克隆下来的目录作为**本地 bundle** 安装（插件管理器 `install_bundle`，target 指向该目录）。安装写入你的 profile，之后每次启动都会在右下角出现。

## 🖱️ 使用

```
                                    ┌──────────────────────────────┐
                                    │ ⟨D⟩ ⟨K⟩ ⟨Q⟩ ⟨GPT⟩ │ ⚙ │ ⌄ │   │
                                    └──────────────────────────────┘
                                            固定在窗口右下角
```

- **点图标**：默认浏览器打开对应网站。
- **点 ⚙（滑杆）**：选择面板。按「国产 / 海外」列出全部入口；点图标/名字直接访问；点右侧圆圈勾选/取消勾选，最多 4 个、至少 1 个；点面板外或按 Esc 关闭。
- **点 ⌄**：收起成一个圆形按钮，再点展开。
- 默认四个：**DeepSeek、Kimi、通义千问、ChatGPT**（Claude 默认不在其中，可自行勾选）。

## 🗂️ 可选入口（20）

| 国产 | 海外 |
| --- | --- |
| DeepSeek | ChatGPT |
| Kimi | Claude |
| 通义千问 | Gemini |
| 豆包 | Perplexity |
| 腾讯元宝 | Grok |
| 文心一言 | Copilot |
| 智谱清言 | Meta AI |
| 讯飞星火 | Le Chat (Mistral) |
| 海螺 AI | Poe |
| 天工 AI | HuggingChat |

## 🛠️ 自定义

- 编辑 `client.js` 顶部的 `LINKS`（`id` / `name` / `url` / `group`）、`DEFAULT_SELECTION`（默认四个）和 `MAX_SLOTS`（最多几个，默认 4）。
- 保存后约 0.5 秒客户端热重载，不需要重启。
- 换图标：把 SVG 放进 `icons/`，在 `build-icons.mjs` 的 `ICONS` 映射里加一行，运行 `node build-icons.mjs` 重新内联。

## 📁 项目结构

| 文件 | 作用 |
| --- | --- |
| `client.js` | 浏览器端模块：注册 `shell.overlay` 入口并渲染快捷栏（图标已内联）。 |
| `index.js` | Host 端 bundle 入口。 |
| `cordis.patch.yml` | 安装时插入 `ai-quick-links` 行。 |
| `icons/` | 20 个品牌图标源文件。 |
| `build-icons.mjs` | 把 `icons/` 内联进 `client.js`（`node build-icons.mjs`）。 |
| `locale/` | 插件管理页使用的中英文标题与描述。 |
| `icon.svg` | 插件图标。 |

## 🎨 图标与许可

- 代码以 [MIT](LICENSE) 协议开源，Copyright © 2026 Cyrus Cheng。
- 品牌图标来自 [LobeHub Icons](https://github.com/lobehub/lobe-icons)（MIT）。
- 所有品牌名称与图标归各自所有者，仅用于标识对应网站；本项目与这些网站没有任何关联。详见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。

## ✅ 验证状态

- **已验证**（macOS 桌面版 DeepSeek Harness）：bundle 安装、客户端模块加载、`shell.overlay` 入口 `active`、20 个图标 SVG 合法、默认 4 个、选择持久化。
- **未验证**：逐像素的视觉与交互（开发环境无浏览器控制、无看图能力）；海外站点在受限网络下未逐一实测；目前只有中英文文案。
- **兼容性**：桌面应用窗口 origin 为 `dsh-app://app`，选择可跨重启保留；Web 版若每次端口变化，新 origin 下会回到默认四个。

---

## English

### AI Quick Links

A pinned launcher for 20 domestic and international AI chat sites, docked at the bottom-right corner of the DeepSeek Harness Web UI. One click opens the site in your default browser.

**Features**

- Fixed bottom-right dock, above all columns and outside scroll containers.
- 20 entries with real brand icons (LobeHub Icons, inlined as data URIs — no network requests at runtime).
- Four slots by default: DeepSeek, Kimi, Qwen, ChatGPT. Pick any other four in the picker (max 4, min 1); click an entry to open it, tick the circle to add it to the dock.
- Collapsible to a single round button, bilingual UI (Chinese / English), zero runtime dependencies.

**Install**

```bash
git clone https://github.com/Chengyunlai/dsh-ai-quick-links.git
```

Install the cloned directory as a local bundle in DeepSeek Harness (plugin manager `install_bundle`, target = the directory).

**Customize**

Edit `LINKS`, `DEFAULT_SELECTION` and `MAX_SLOTS` at the top of `client.js`; changes hot-reload in about 0.5 s. To change icons, drop SVGs into `icons/`, extend the mapping in `build-icons.mjs`, and run `node build-icons.mjs`.

**Status**

Verified on macOS desktop DeepSeek Harness: bundle install, client module load, `shell.overlay` entry active, 20 valid SVG icons, default four entries, persisted selection. Visual pixel-level verification and overseas site reachability under restricted networks were not performed.

**License**

MIT © 2026 Cyrus Cheng. Brand icons come from [LobeHub Icons](https://github.com/lobehub/lobe-icons) (MIT); all brand names and logos belong to their respective owners.
