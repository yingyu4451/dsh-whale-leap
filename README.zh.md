# 鲸跃

鲸跃给 DeepSeek Harness 网页端加一只游动的鲸鱼：

- **背景鲸鱼**：点阵（或代码文字）鲸鱼出现在空白首页；开启后也会出现在进行中的会话背景里。点击会话空白处可重播一次。
- **任务图标**：「深度求索中」左侧的小鱼持续游动，提供四种动作预设与 8–28 px 的大小。
- **设置页**：以上内容都在「设置 › 鲸跃」的两个标签页里。

## 安装

1. 打开 DeepSeek Harness 网页端的 **插件**。
2. 选择 **添加插件**，填入本目录：`C:\Users\Y\Desktop\dsh project\whale-leap`。
3. 重启一次 `dsh web`。Host 第一次看到该包时才会加载它，新的设置分区在那次重启后才存在；随后刷新页面。
4. 打开 **设置 › 鲸跃**。

这是一个本地私有 bundle（`dsh-whale-leap`），不会发布到任何源。仓库：[yingyu4451/dsh-whale-leap](https://github.com/yingyu4451/dsh-whale-leap)。

## 设置

### 背景

| 选项 | 含义 |
| --- | --- |
| 颜色 | 跟随主题的文字色调，或自定义墨色。 |
| 背景大小 | 绘制场景的缩放（50%–150%）。 |
| 墨色浓度 | 10%–100% 的响应曲线。图集本身偏淡：60% 保持原稿观感，100% 会把淡点压成纯黑。 |
| 在会话中自动出现 | 开始对话后，鲸鱼是否按间隔自行出现。 |
| 切换会话时立即出现 | 关闭后，进入会话不会立刻播放，而是等下一个间隔。 |
| 出现间隔 | 自动重播的间隔，5–300 秒。 |

控制项上方是一块实时预览画布，按当前设置循环播放。

### 任务图标

四种动作预设：**游动**（摆尾前移）、**探索**（向未知上浮再下潜）、**首页游动**（空白首页 hover 的动作）、**左右轻摆**。每张卡片会播放自己的动作；选中项除高亮外还有文字徽标。大小滑块控制图标盒尺寸，8–28 px。

## 行为与限制

- 仅网页端。插件注册 `conversation.hero.frame`、`conversation.chat.running.mark` 和 `settings.section`，因此需要 `ui-conversation`、`ui-chat`、`ui-settings`。
- 设置是工作区级的，保存在分区命名空间 `whale-leap`。
- 减少动态效果：所有播放与摆动停止，图标保持静止。
- 画布后备缓冲区上限为 500 万像素并在布局之间复用，大尺寸高分屏不会一次分配几十兆内存。
- **内置品牌包不再绘制鲸鱼。** 它只注册侧栏品牌图形，背景与任务图标插槽由本插件独占，不会出现重叠；需要包含 `conversation.chat.running.mark` 插槽的 DSH 构建（当前仓库版本）。
- 鲸鱼素材来自 DeepSeek Harness 品牌资源，仅供本地插件使用。

## 构建

```powershell
pnpm install        # 只安装 esbuild
pnpm run build      # 生成 ModuleLoader 产物 lib/client.js
```

`lib/client.js` 会把图集内嵌为 data URL；Host 半部分是普通 ESM（`index.js`），从运行中的 profile 引入 `@deepseek-ai/schemastery`。

## 目录

```text
index.js                     Host：Config schema 与 settings.configure
shared/settings.js           两半共享的字段名、范围与默认值
src/client/index.tsx         客户端入口：注册三个插槽
src/client/store.ts          设置运行时（镜像 + 防抖写入）
src/client/settings/         设置页与模块 CSS
src/client/whale/            鲸鱼画布、渲染器、代码填充、鱼形图标与路径
assets/breach-atlas.webp     帧图集（137 帧，12 列）
locale/*.json                插件管理器标题/描述/详情元数据
docs/DETAIL.md               插件详情页文档
```


