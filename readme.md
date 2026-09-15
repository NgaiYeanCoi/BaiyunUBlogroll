# BaiyunU Blogroll

广东白云学院同学的博客目录与文章聚合站。项目使用 Astro 7 生成纯静态页面，由 GitHub Actions 构建并部署到 GitHub Pages。新版从当前 RSS/Atom 内容重新开始收录，不迁移旧 Python 站点的文章数据。

## 本地开发

需要 Node.js 24 和 npm。日常开发完全读取仓库中的 `data/feeds/`，不会访问 RSS：

```powershell
npm ci
npm run format:check
npm test
npm run check
npm run build
npm run check:dist
npm run dev
```

新仓库尚无快照文件时也可以构建，页面会显示真实的空状态。`dist/`、`.cache/` 和旧站本地备份都不会提交或发布。

修改代码后可运行 `npm run format` 统一 TypeScript、Astro、CSS 与配置格式。项目结构：`src/lib/feeds/` 负责采集和合并，`src/lib/catalog/` 负责校验、日期、撤回和搜索规则，`src/pages/` 与 `src/components/` 负责页面，`scripts/` 负责刷新与发布前检查。页面构建不会访问外部博客。

## 来源与撤回配置

在 `config/sources.json` 添加来源。`id` 是长期稳定的 ASCII 标识，改名时不要更换；`enabled: false` 仅暂停后续抓取，已经收录的文章仍会展示。可选的 `avatarUrl` 用于来源头像，必须是绝对 HTTP(S) URL。

```json
{
  "id": "example",
  "name": "示例博客",
  "siteUrl": "https://example.com/",
  "feedUrl": "https://example.com/atom.xml",
  "avatarUrl": "https://example.com/avatar.png",
  "enabled": true,
  "description": "可选的博客简介"
}
```

撤回内容使用 `config/exclusions.json`。来源 ID 可整体下架；单篇文章可按站内 ID、同一来源的 URL 或 GUID 排除。撤回规则会同时作用于页面和公开搜索索引。

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

快照可以只保存已撤回条目的 ID、URL 与 GUID 等别名，不保留标题和摘要。这样以后 Feed 更换链接但仍使用已知 GUID 时，内容不会意外恢复；明确删除对应撤回规则后，才允许按当前 Feed 重新收录。

欢迎通过[加入申请](https://github.com/NgaiYeanCoi/BaiyunUBlogroll/issues/new/choose)提交博客名称、主页和 RSS/Atom 地址，也可以用 Pull Request 修改来源配置。

## 刷新与验证

日常更新 RSS/Atom 快照只需运行：

```powershell
npm run refresh:all
```

该命令按顺序抓取候选数据、使用候选数据构建站点，再检查构建产物并更新 `data/feeds/`。任一步失败都会立即停止，不会提升未通过检查的候选数据。命令成功后，若本地开发服务器已经运行，刷新浏览器即可查看最新内容；否则运行 `npm run dev`。

`npm run refresh` 仍只把候选数据写入 `.cache/refresh/feeds/` 和 `.cache/refresh/report.json`，供 GitHub Actions 和维护者诊断使用，不会修改 `data/feeds/`。promotion 只复制配置中来源对应的候选 JSON。维护者应审阅 `data/feeds/` 的差异后按明确路径提交；不要提交 `.cache/` 或 `dist/`。如果所有启用来源都失败，刷新命令会失败，旧快照和当前部署保持不变。

## GitHub Pages 发布

仓库 Pages 的 **Source** 需要设为 **GitHub Actions**。截至 2026-09-14 的只读核查显示，线上仍由旧 `gh-pages` 分支发布，并绑定自定义域名 `baiyunu.nyc1.xyz`；首次启用新工作流前要在仓库 Settings → Pages 完成来源切换。发布工作流只接受受信任的默认分支 `master`：

- Pull Request 只进行离线测试、Astro 检查、构建和产物检查，没有写入或部署权限。
- 推送到 `master` 会先刷新 RSS/Atom，通过构建和产物检查后写回快照并部署；新增来源会在这次发布中首次抓取，无需等待定时任务。
- 定时任务使用 `30 16 * * *`（UTC），即北京时间次日 00:30，先刷新候选，通过构建和产物检查后才写回数据并部署。
- 手动运行时，`refresh=true` 刷新来源；取消勾选则仅用已保存数据离线重建。

刷新候选仅通过短期内部 artifact 在只读校验 job 与数据写入 job 之间传递；Pages artifact 只包含已经检查的 `dist/`。写回只暂存 promotion 列出的来源 JSON，推送前核对默认分支未前进，并且不使用强制推送。若分支保护不允许 `GITHUB_TOKEN` 写入，刷新会明确失败且不会部署候选；应调整保护规则允许该工作流写入，或手工执行上面的验证和 promotion 流程，不能通过关闭校验绕过。

默认项目站点配置位于 `config/site.json`，当前 `url` 为 `https://ngaiyeancoi.github.io`、`base` 为 `/BaiyunUBlogroll/`。这是项目子路径示例；若继续使用现有自定义域名，则将公开 URL 改为该域名并把 `base` 改为 `/`。工作流会读取 Pages 的实际 origin 与 base path，导航、资源、分页、JSON 和 canonical 使用同一组值。Pages Source 应使用 GitHub Actions，不要继续从分支根目录发布。

GitHub 定时任务可能延迟；公开仓库连续 60 天无活动时，schedule 可能被自动停用，可在 Actions 页面重新启用并手动运行一次刷新。详见 GitHub 官方的 [schedule 事件说明](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule)与[自定义 Pages 工作流说明](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)。

## 许可

[MIT License](LICENSE)
