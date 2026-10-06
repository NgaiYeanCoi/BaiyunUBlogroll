# 贡献指南

欢迎参与 BaiyunU Blogroll。你可以提交博客收录申请、修正文档、报告问题，或改进文章聚合与页面体验。

## 选择贡献入口

- **申请收录博客**：使用[加入申请](https://github.com/NgaiYeanCoi/BaiyunUBlogroll/issues/new/choose)，填写博客 ID、名称、主页和 RSS/Atom 地址；头像与简介可选。维护者会人工审核，无需先搭建开发环境。
- **更新来源或提交代码**：Fork 本仓库，在分支中修改后向 `master` 提交 Pull Request。
- **报告问题或提出建议**：提交 [Issue](https://github.com/NgaiYeanCoi/BaiyunUBlogroll/issues)，说明实际情况和期望结果。
- **撤回来源或文章**：通过 Issue 说明要撤回的博客或文章，也可以提交 `config/exclusions.json` 的修改。

## 本地开发

需要 **Node.js 24 和 npm**。`package.json` 限定 Node.js 为 `>=24 <25`，依赖安装使用仓库中的锁文件。

先在 GitHub 上 Fork 仓库，然后执行以下命令，将 `YOUR_USERNAME` 换成你的 GitHub 用户名：

```powershell
git clone https://github.com/YOUR_USERNAME/BaiyunUBlogroll.git
cd BaiyunUBlogroll
git remote add upstream https://github.com/NgaiYeanCoi/BaiyunUBlogroll.git
git fetch upstream
git switch -c feat/add-blog upstream/master
npm ci
npm run dev
```

分支名可按实际改动调整。开发服务器启动后，访问终端显示的本地地址；项目默认使用 `/BaiyunUBlogroll/` 子路径。

日常开发与构建读取 `data/feeds/`，不会抓取 RSS/Atom。新增来源尚无快照时，页面会显示空状态，需要运行刷新命令才能查看该来源的文章。

## 项目结构

| 路径                                           | 用途                                 |
| ---------------------------------------------- | ------------------------------------ |
| `config/sources.json`                          | 博客来源及抓取开关                   |
| `config/exclusions.json`                       | 来源与文章撤回规则                   |
| `config/site.json`                             | 站点名称、公开地址与部署子路径       |
| `data/feeds/`                                  | 已保存的来源快照，也是离线构建的数据 |
| `src/lib/feeds/`                               | Feed 获取、解析及文章身份合并        |
| `src/lib/catalog/`                             | 数据校验、日期、撤回过滤与搜索规则   |
| `src/pages/`、`src/components/`、`src/styles/` | 页面、组件与样式                     |
| `src/client/`                                  | 浏览器端交互                         |
| `scripts/`                                     | 候选刷新、快照提升与静态产物检查     |
| `tests/`                                       | 数据规则、刷新流程与交付检查测试     |
| `.github/workflows/`                           | Pull Request 校验与 Pages 发布       |

## 添加或更新博客

在 `config/sources.json` 数组中添加对象，或修改已有对象：

```json
{
  "id": "example",
  "name": "示例博客",
  "siteUrl": "https://example.com/",
  "feedUrl": "https://example.com/atom.xml",
  "avatarUrl": "https://example.com/avatar.png",
  "enabled": true,
  "description": "记录与分享"
}
```

| 字段          | 要求                                             |
| ------------- | ------------------------------------------------ |
| `id`          | 必填，来源间唯一，作为长期稳定的标识和快照文件名 |
| `name`        | 必填，非空的博客名称                             |
| `siteUrl`     | 必填，博客主页的绝对 HTTP(S) 地址                |
| `feedUrl`     | 必填，可公开访问并可解析的 RSS/Atom 地址         |
| `avatarUrl`   | 可选，头像的绝对 HTTP(S) 地址；不需要时省略字段  |
| `enabled`     | 必填，布尔值，控制后续是否抓取该来源             |
| `description` | 可选，博客简介                                   |

`id` 必须匹配 `^[a-zA-Z0-9][a-zA-Z0-9_-]*$`：首位是 ASCII 字母或数字，后续可用字母、数字、下划线和连字符。博客改名、迁移域名或更换 Feed 时保留原 `id`，避免切断历史快照与撤回规则的关联。

URL 不得携带用户名或密码。配置只接受列出的字段，不要添加未定义的字段或把登录凭据放进地址。

**`enabled: false` 只暂停抓取，博客及已有文章仍会展示。** 要下架内容，请使用下节的撤回规则。

修改来源后，先检查 JSON 与地址，再按需要刷新并审阅快照变化。收录申请仍由维护者审核；配置格式正确不等于已经获准收录。

## 刷新文章与审阅快照

需要获取最新 RSS/Atom 内容时，在仓库根目录执行：

```powershell
npm run refresh:all
```

该命令依次完成：

1. 抓取来源，将候选快照和报告写入 `.cache/refresh/`。
2. 使用候选快照构建 `dist/`。
3. 在 `data:promote` 内检查静态产物、公开目录与刷新报告是否一致。
4. 检查通过后，将配置中来源对应的候选 JSON 提升到 `data/feeds/`。

任一步失败都会停止后续流程，未经检查的候选数据不会提升。命令会修改本地正式快照，但不会提交、推送或部署；运行中的开发服务器可在刷新浏览器后查看更新。

至少一个来源抓取到有效文章，刷新才允许进入提升流程。部分来源失败时，报告会标为 `degraded`，失败来源保留已有文章；没有来源成功时，刷新失败，已有快照不被候选替换。

成功后审阅差异，确认新增、修改、撤回与身份别名变化符合预期：

```powershell
git status --short
git diff -- config/sources.json config/exclusions.json data/feeds
```

新创建的快照是未跟踪文件，`git diff` 不会显示其内容，需要直接打开审阅。提交时只选择本次改动涉及的明确文件路径。

`npm run refresh` 仅写入 `.cache/refresh/feeds/` 和 `.cache/refresh/report.json`，不会修改 `data/feeds/`。单独运行它适合诊断抓取问题，不能代替完整的候选构建、检查与提升流程。

`dist/` 是 Pages 的发布产物，不提交到 Git；`.cache/`、依赖缓存及旧站本地备份不进入提交或发布。项目从当前 RSS/Atom 内容重新收录，不迁移旧 Python 站点的文章数据。

## 撤回来源或文章

修改 `config/exclusions.json`，保留顶层的 `sources` 与 `articles` 数组：

```json
{
  "sources": ["retired-source"],
  "articles": [
    {
      "sourceId": "example",
      "ids": ["article-id"],
      "urls": ["https://example.com/withdrawn-post"],
      "guids": ["feed-guid"]
    }
  ]
}
```

- `sources` 填写来源 ID，整体撤回该来源及其文章，后续刷新也不会抓取该来源。
- `articles` 的每条规则必须指定 `sourceId`，并至少提供非空的 `ids`、`urls` 或 `guids` 数组之一。
- `ids` 使用快照中的站内文章 ID；`urls` 可匹配当前链接或已知链接别名；`guids` 使用 Feed 中的 GUID。单篇规则只作用于指定来源，任一种身份匹配即可排除。

撤回规则在构建时同时过滤页面和公开的 `catalog.json` 搜索索引，离线构建也会生效。用 `npm run build` 和 `npm run check:dist` 检查结果。

刷新合并后，快照可以在 `tombstones` 中仅保留撤回文章的 ID、URL、GUID 与链接别名，不保留标题和摘要。这些身份信息用于识别以后更换链接但仍沿用已知身份的文章，避免内容意外恢复；不要为了清理文件而随意删除。

明确删除对应撤回规则后，当前 Feed 中的文章才可重新收录。恢复整体来源时，还需确认抓取开关已启用。已有历史快照中仍有正文时，删除规则后重新构建也可能直接恢复展示；撤回不会改写 Git 历史。

## 按改动范围验证

| 改动范围                 | 提交前检查                                                                                                |
| ------------------------ | --------------------------------------------------------------------------------------------------------- |
| 仅文档                   | 检查内容、链接与下方的文档格式命令                                                                        |
| 来源或撤回配置           | `npm run format:check`、`npm run verify`；来源地址或抓取结果变化时再运行 `npm run refresh:all` 并审阅数据 |
| 代码、样式、依赖或工作流 | `npm run format:check`、`npm run verify`；页面改动还需浏览器检查                                          |

纯文档改动使用：

```powershell
npx prettier --check readme.md CONTRIBUTING.md .github/pull_request_template.md
```

现有 `format:check` 尚未包含根目录 `CONTRIBUTING.md`，因此文档检查需要显式列出它。

代码或配置改动使用：

```powershell
npm run format:check
npm run verify
```

`verify` 依次运行单元测试、Astro 检查、静态构建与产物检查，整个流程使用已保存快照。它不会验证外部 Feed 是否可用，也不会自动获取最新文章。

需要修正格式时运行 `npm run format`，或用 Prettier 格式化本次涉及的文件，然后重新检查。文档可用 `npx prettier --write CONTRIBUTING.md` 单独格式化。

页面改动应检查桌面与窄屏布局、搜索和筛选、分页、空状态及相关链接。需要预览构建结果时，在构建后运行 `npm run preview`，访问终端显示的地址。

## 提交 Pull Request

将分支推送到自己的 Fork，向本仓库 `master` 创建 Pull Request，并按模板填写：

- 改了什么，以及为什么需要这项改动。
- 对应的 Issue 或复现背景。
- 实际运行的验证命令及结果；未执行的检查写明原因。
- 来源配置与快照是否有变化；涉及页面时附上截图。

保持改动集中，审阅最终差异。代码中的复杂业务规则、身份流转、权限边界与跨模块约定需要简短注释，说明约束或原因。

## 反馈问题

Issue 中请给出复现步骤、实际结果和期望结果。开发问题补充 Node.js/npm 版本、系统与相关命令输出；抓取问题补充来源 ID、Feed 地址及刷新报告中的诊断；页面问题补充页面地址、浏览器与截图。

发布问题请附上相关 Actions 运行链接和失败步骤。日志、截图和地址中不要包含登录凭据等私密信息。

## 维护者：GitHub Pages 发布

在仓库 **Settings → Pages** 中将 **Source** 设为 **GitHub Actions**。发布逻辑见 `.github/workflows/pages.yml`：

| 触发方式                   | 行为                                                             |
| -------------------------- | ---------------------------------------------------------------- |
| 推送到 `master`            | 刷新候选，构建并检查，通过后写回快照并部署                       |
| 定时任务                   | `30 16 * * *`（UTC），即北京时间次日 00:30，执行相同刷新发布流程 |
| 手动运行且 `refresh=true`  | 刷新后发布，默认勾选                                             |
| 手动运行且 `refresh=false` | 使用已保存快照离线重建并部署，不刷新或写回数据                   |
| Pull Request               | 只读、离线进行格式、测试、Astro、构建与产物检查，不写回或部署    |

工作流从仓库实际默认分支读取代码；手动运行也只接受该分支的工作流定义。项目开发与合并目标为 `master`，调整默认分支时需要同步审阅推送触发条件。

候选快照和 `dist/` 通过短期内部产物传递；对外的 Pages 产物只包含已检查的 `dist/`。校验失败时不写回、不部署候选；快照写回失败时也不部署候选。

写回任务只暂存提升清单列出的 `data/feeds/<id>.json`。提升前、推送前及部署前会核对默认分支版本；普通推送拒绝覆盖期间新增的提交，不使用强制推送。版本核对失败后应基于当前默认分支重新运行完整流程。

分支保护或 Ruleset 若不允许 `GITHUB_TOKEN` 写入，刷新发布会失败。维护者需要让仓库规则与该工作流的受限写入方式相容，或先在本地完成刷新、检查与审阅，再通过允许的合并流程保存快照，随后使用 `refresh=false` 离线发布。不要关闭校验来绕过失败。

本地站点地址由 `config/site.json` 的 `url` 和 `base` 决定。仓库默认值是 `https://ngaiyeancoi.github.io` 与 `/BaiyunUBlogroll/`；使用自定义域名时按实际域名设置 `url`，根路径站点设置 `base: "/"`。

`SITE_URL` 和 `SITE_BASE` 环境变量可覆盖这两个值。Pages 工作流会读取 Pages 配置中的实际 origin 与 base path，并把同一组值用于构建、检查和提升，保证导航、资源、分页、JSON 与 canonical 地址一致。

本地验证、快照写回与线上部署是独立结果。确认发布时查看 Actions 各任务结果，再检查实际站点的页面、`catalog.json` 与 `status.json`。

GitHub 定时任务可能延迟；公开仓库连续 60 天无活动时，定时工作流会自动停用。维护者可在 Actions 中重新启用并手动运行一次刷新。详见 GitHub 官方的[定时事件说明](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule)与[自定义 Pages 工作流说明](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 许可

项目采用 [MIT 许可证](LICENSE)。
