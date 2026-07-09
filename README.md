# His-Smile Redesign

一个可直接部署到 GitHub Pages 的静态博客项目。

## 运行

```bash
cd D:\hisSmile\His-Smile-redesign
python -m http.server 4173
```

访问 `http://localhost:4173/`。

## 结构

- `index.html`: 首页
- `article.html`: 文章详情，通过 `?id=post-id` 加载文章
- `archive.html`: 归档、分类、标签
- `gallery.html`: 图库
- `about.html`: 关于页
- `assets/data.js`: 站点、文章、图库数据
- `assets/app.js`: 渲染和交互
- `assets/styles.css`: 全站样式
- 动漫封面图来自 `https://cdn.jsdelivr.net/gh/His-Smile/pic_bed/anime/`

## 部署

把本目录内容发布到 GitHub Pages 根目录即可。当前没有构建步骤。
