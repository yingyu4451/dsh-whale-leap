# 鲸跃

[English](README.en.md) · [中文](README.md)

鲸跃给 DeepSeek Harness 网页端加一只游动的鲸鱼：

- **背景鲸鱼**：点阵（或代码文字）鲸鱼出现在空白首页；开启后也会出现在进行中的会话背景里。点击会话空白处可重播一次。帧图集在运行时从已安装的官方品牌包读取，本仓库不再分发任何素材。
- **任务图标**：「深度求索中」左侧的小鱼可用开关决定是否替换默认图标，持续游动，提供四种动作预设；大小（8–28 px）与摆动幅度（50%–200%）调整时上方有实时预览，预览里同时显示状态文字。
- **设置页**：以上内容都在「设置 › 鲸跃」里，顶部标签栏在「背景」和「任务图标」之间切换。界面跟随 DeepSeek Harness 的界面语言，内置中文、English、日本語、Español、Français、Deutsch、Русский、Português。

## 安装

1. 打开 DeepSeek Harness 网页端的 **插件**。
2. 选择 **添加插件**，填入本目录：`C:\Users\Y\Desktop\dsh project\whale-leap`。
3. 重启一次 `dsh web`。Host 第一次看到该包时才会加载它，新的设置分区在那次重启后才存在；随后刷新页面。
4. 打开 **设置 › 鲸跃**。

**更新已安装的副本。** 拉取或修改本目录后运行 `pnpm run build`。Harness 会自动热替换已加载的客户端 bundle（网页端常驻 client HMR 链路），新的设置界面无需重启也无需手动刷新即可生效。只有 Host 半发生变化时才需要重启 `dsh web`——`index.js`、设置 schema、`cordis.patch.yml` 或 `locale/` 下的包元数据；Host 只在启动时读取这些内容。从本地目录安装时，profile 里保存的是一份目录副本：重启前先把重新构建的包复制到 `%USERPROFILE%\.dsh\profiles\web\node_modules\dsh-whale-leap`（或在「插件」里移除后重新添加）。

设置页头部会显示当前版本与「检查更新」按钮：检查以 GitHub 为准——先读仓库的 `releases/latest`，没有 Release 时退回标签列表——与已安装版本比较，有新版本时给出 Release 链接；尚无发布时会明确提示，而不是静默失败。

## 设置

标签栏位于内容上方、占满整行，选中项为填充色块。标签页内的控制项按主题分组：分组小标题在上，卡片在下。

### 背景

**外观**

| 选项 | 含义 |
| --- | --- |
| 颜色 | 跟随主题的文字色调，或自定义墨色。 |
| 背景大小 | 绘制场景的缩放（50%–150%）。 |
| 墨色浓度 | 10%–100% 的响应曲线。图集本身偏淡：60% 保持原稿观感，100% 会把淡点压成纯黑。 |

**播放**

| 选项 | 含义 |
| --- | --- |
| 在会话中自动出现 | 开始对话后，鲸鱼是否按间隔自行出现。 |
| 切换会话时立即出现 | 关闭后，进入会话不会立刻播放，而是等下一个间隔。 |
| 出现间隔 | 自动重播的间隔，5–300 秒。 |

控制项上方是一块实时预览画布，按当前设置循环播放。

### 任务图标

**任务图标**

**替换任务状态图标** 决定是否用小鱼替换 DSH 默认的鲸尾图标；关闭后恢复默认图标。上方预览区按当前设置的精确像素显示所选动作，并显示「深度求索中」状态文字——预览与真实会话中的那一行一致，文字跟随界面语言切换。大小滑块控制图标盒尺寸，8–28 px。

**动作**

四张动作卡片各自播放自己的预设，选中项除高亮外还有文字徽标。下方的摆动幅度滑块按 50%–200% 缩放游动、探索与左右轻摆的水平幅度；「首页游动」保持首页原样的摆动，不随之放大。

## 行为与限制

- 仅网页端。插件注册 `conversation.hero.frame`、`conversation.chat.running.mark` 和 `settings.section`，因此需要 `ui-conversation`、`ui-chat`、`ui-settings`。
- 设置是工作区级的，保存在分区命名空间 `whale-leap`。
- 减少动态效果：所有播放与摆动停止，图标保持静止。
- 摆动幅度只作用于游动、探索与左右轻摆；「首页游动」始终保持首页原样的动作幅度。
- 代码文字的字号随背景场景宽度等比缩放，因此设置页预览与真实会话背景中的文字比例一致，不再出现预览里文字过大的情况。
- 画布后备缓冲区上限为 500 万像素并在布局之间复用，大尺寸高分屏不会一次分配几十兆内存。
- **内置品牌包不再绘制鲸鱼。** 它只注册侧栏品牌图形，背景与任务图标插槽由本插件独占，不会出现重叠；需要包含 `conversation.chat.running.mark` 插槽的 DSH 构建（当前仓库版本）。
- **图集在运行时读取，不随包分发。** Host 半把已安装的 `@deepseek-ai/dsh-client-ui-brand-official` 中的 `lib/assets/breach-atlas-*.webp` 发布在 `/whale-leap/assets/atlas.webp` 上；标准网页版与桌面版都会安装该品牌包。品牌包缺失时背景鲸鱼不显示，其余功能照常工作。
- 渲染器、代码填充与任务图标动画改编自 DeepSeek Harness 源码，遵循其 MIT 许可；见 [`THIRD-PARTY-NOTICES.md`](THIRD-PARTY-NOTICES.md)。再分发时必须保留该声明。

## 致谢与许可

鲸鱼渲染器、代码填充、鱼形路径与任务图标动画改编自 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（MIT License，Copyright (c) 2026 DeepSeek）。鲸鱼帧图集不再随本包分发，而是运行时从已安装的官方品牌包读取。完整许可文本与改编文件清单见 [`THIRD-PARTY-NOTICES.md`](THIRD-PARTY-NOTICES.md)。本插件为非官方项目，与 DeepSeek 无隶属关系，也未获其背书。MIT 许可只授予著作权相关权限，不授予 DeepSeek 名称、标识或素材上的商标权。

## 构建

```powershell
pnpm install        # 安装 esbuild、react 与 Host 侧 schemastery 开发副本
pnpm run build      # 生成 ModuleLoader 产物 lib/client.js
pnpm run check      # 构建 + smoke + 渲染 + Host 路由检查
```

`lib/client.js` 不再内嵌任何位图；Host 半部分（`index.js`）从运行中的 profile 引入 `@deepseek-ai/schemastery`，并在 `/whale-leap/assets/atlas.webp` 上提供官方图集字节。浏览器产物还会内嵌 `package.json` 的版本号，供检查更新使用。

## 发布

GitHub 是发布的唯一来源：设置页比较的是本仓库最新的 Release（没有 Release 时退回标签）。

1. 提升版本：运行 `pnpm run release:patch`（或 `release:minor` / `release:major`）。它会更新 `package.json`、提交并创建 `vX.Y.Z` 标签。
2. 推送提交与标签：`git push --follow-tags`。
3. 为该标签创建 GitHub Release：`gh release create vX.Y.Z --title "vX.Y.Z" --notes "…"`。检查更新读的就是这个 Release，创建后已安装副本才会看到新版本。

npm 保持可选且手动：工作流 [`.github/workflows/publish.yml`](.github/workflows/publish.yml) 只支持 `workflow_dispatch`，且需要先在 npm 配好可信发布者才可发布。

## 目录

```text
index.js                     Host：Config schema、settings.configure 与图集路由
shared/settings.js           两半共享的字段名、范围与默认值
src/client/index.tsx         客户端入口：注册三个插槽
src/client/atlas.ts          Host 图集路由的文档相对 URL
src/client/store.ts          设置运行时（镜像 + 防抖写入）
src/client/i18n.ts           设置页的 8 种语言词典
src/client/settings/         设置页与模块 CSS
src/client/whale/            鲸鱼画布、渲染器、代码填充、鱼形图标与路径
src/client/update.ts         GitHub Release 检查
locale/*.json                插件管理器标题/描述/详情元数据
docs/DETAIL.md               插件详情页文档
```

---

[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)
