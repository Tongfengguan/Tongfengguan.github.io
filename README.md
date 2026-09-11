# TFGKK Portfolio

以二维项目地图为主的极简个人主页，使用 Vue 3、TypeScript、Vue Router 和 Vite，支持日间与夜间主题。

首屏以简短个人定位、关注方向、个人链接与项目 / 算法 / 工具数量建立主页身份，不使用冗长个人简介。

## 探索方式

- 桌面默认地图视图，小幽灵为中心节点，项目与共享技术通过连线连接。
- 13 个可拖动节点涵盖头像、项目、技术栈与 Codeforces，拖动时连线实时跟随。
- 点击技术节点查看关联项目，悬停高亮相邻连接，探索计数记录本次访问。
- 点击项目打开详情侧栏，可访问源码；关闭详情或按 Escape 返回探索，保留地图位置。
- 拖动地图空白区域移动视野，通过按钮缩放，Reset 恢复初始位置。
- Shuffle 重新排列节点，Reset 同时恢复节点位置与视野；聚焦节点后可用方向键移动，Shift 加大步长。
- Algorithms 采用 13 个局部中心向外发散的知识簇，包含 93 个可拖动算法节点与 111 条跨类别连接。
- 算法范围参考 WIDA-XCPC v1.8.8 模板目录，详情提供对应 OI Wiki 延伸资料。
- 支持关键词搜索与分类中心跳转；悬停或键盘聚焦时高亮直接关联，重复点击同一节点即可取消选择。
- 节点、视图切换、缩放和详情操作均支持键盘访问。

## 随手工具

- 首页 Tools 导航进入工具箱，按需加载，不上传或持久保存输入内容。
- JSON：格式化、压缩、扁平对象数组与 CSV 互转，支持本地文件导入（最多 1 MiB）。CSV 导入保留字符串；不支持嵌套 JSON 转表格。
- 测试数据：固定种子生成整数数组、排列与无向树，最多 10,000 个元素，结果可复制或下载。
- 切换工具保留当前页面内的输入，刷新后清空。算法工具输出首行 n，随后为数组或 n−1 条树边。
- 主题按钮在日间与夜间配色间切换，并记住当前设备的选择。

## 开发

```bash
npm install
npm run dev
npm run build
npm run preview
```

`npm run build` 包含 TypeScript 检查，静态产物输出到 `docs/`，供 GitHub Pages 发布。

## 内容与样式

- `src/data/portfolio.ts`：项目内容、地图坐标、常用链接和联系方式。
- `src/data/algorithms.ts`：具体算法、节点坐标、关联边和 OI Wiki 资料链接。
- `src/App.vue`：颜色、排版与共享动效。
- `src/components/AlgorithmGraph.vue`：多中心算法知识簇、节点拖动、关联高亮和画布控制。
- `src/components/ProjectMap.vue`：SVG 连线、节点、拖动与缩放。
- `src/components/ProjectExplorer.vue`：项目地图 / 算法图切换及详情侧栏。
- `src/components/LinksSection.vue`：外部链接。
- `public/avatar.png`：头像，构建后通过 `/avatar.png` 访问。

## 性能约定

- 使用系统字体，无外部字体请求或动画依赖。
- 地图使用 SVG 连线和 HTML 节点，无 Canvas、粒子循环或滚轮拦截。
- 详情切换和节点悬停使用短过渡；拖动时更新坐标，重排动画 600ms 后停止，闲置时无动画循环。
- 滚动入场只使用 `IntersectionObserver` 与透明度、位移动画，每个元素播放一次。
- 尊重 `prefers-reduced-motion`；没有观察器时内容仍可见。
- Codeforces 只读取用户资料，展示 rating 和 rank；不再下载完整提交记录计算 solved。
- 统计缓存 15 分钟，请求 5 秒超时。统计不可用时显示占位符，不阻塞页面。
