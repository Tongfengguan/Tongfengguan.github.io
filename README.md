# TFGKK Portfolio

极简深色个人主页，使用 Vue 3、TypeScript、Vue Router 和 Vite。

## 开发

```bash
npm install
npm run dev
npm run build
npm run preview
```

`npm run build` 包含 TypeScript 检查，静态产物输出到 `docs/`，供 GitHub Pages 发布。

## 内容与样式

- `src/data/portfolio.ts`：项目、常用链接和联系方式。
- `src/App.vue`：颜色、排版与共享动效。
- `src/components/`：首屏、项目列表与外部链接。
- `public/avatar.png`：头像，构建后通过 `/avatar.png` 访问。

## 性能约定

- 使用系统字体，无外部字体请求或动画依赖。
- 滚动入场只使用 `IntersectionObserver` 与透明度、位移动画，每个元素播放一次。
- 尊重 `prefers-reduced-motion`；没有观察器时内容仍可见。
- Codeforces 只读取用户资料，展示 rating 和 rank；不再下载完整提交记录计算 solved。
- 统计缓存 15 分钟，请求 5 秒超时。统计不可用时显示占位符，不阻塞页面。
