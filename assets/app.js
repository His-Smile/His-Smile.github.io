const data = window.BLOG_DATA;
const page = document.body.dataset.page;
const shell = document.querySelector("#site-shell");

const byDate = [...data.posts].sort((a, b) => b.date.localeCompare(a.date));
const featured = byDate.slice(0, 4);
const allTags = [...new Set(data.posts.flatMap((post) => post.tags))];
const allCategories = [...new Set(data.posts.map((post) => post.category))];
const ANIME_BASE = "https://cdn.jsdelivr.net/gh/His-Smile/pic_bed/anime/";
const COVER_POOLS = {
  java: ["lake-pier.jpg", "ink-lotus.png", "twilight-girl.png"],
  tools: ["lake-pier-blue.jpg", "lake-pier.jpg", "villa-render.webp"],
  code: ["twilight-girl.png", "hero-character.jpg", "ink-lotus.png"],
  work: ["hero-character.jpg", "lake-pier-blue.jpg", "twilight-girl.png"],
  picbed: ["ink-lotus.png", "lake-pier.jpg", "hero-character.jpg"],
  blog: ["lake-pier.jpg", "twilight-girl.png", "ink-lotus.png"],
  life: ["twilight-girl.png", "lake-pier-blue.jpg", "hero-character.jpg"]
};
const POST_POOL = {
  "study-record": "java",
  "interface-concepts": "java",
  "proxy-tools": "tools",
  "code-optimization": "code",
  "code-issues": "code",
  "release-notes-2025": "work",
  "recent-note-1": "work",
  "daily-issues": "work",
  "picbed-record": "picbed",
  "picbed-build": "picbed",
  "first-blog-feeling": "life",
  "my-blog": "blog",
  "hello-world": "blog"
};
const REMOTE_ANIME_API = "https://api.waifu.pics/sfw/waifu";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function postUrl(post) {
  return `article.html?id=${encodeURIComponent(post.id)}`;
}

function formatDate(date) {
  return date.replaceAll("-", ".");
}

function icon(name) {
  return `<i data-lucide="${name}" aria-hidden="true"></i>`;
}

function readingText(post) {
  return `${post.reading} min read`;
}

function hashString(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function coverPoolFor(post) {
  return COVER_POOLS[POST_POOL[post.id] || "blog"];
}

function localCoverUrl(file) {
  return ANIME_BASE + file;
}

function storedCover(post) {
  return sessionStorage.getItem(`his-smile-cover:${post.id}`);
}

function resolvePostCover(post) {
  const stored = storedCover(post);
  if (stored) return stored;
  const pool = coverPoolFor(post);
  const index = hashString(`${post.id}:${post.category}:${post.tags.join(",")}`) % pool.length;
  return localCoverUrl(pool[index]);
}

function nextLocalCover(post) {
  const pool = coverPoolFor(post).map(localCoverUrl);
  const current = storedCover(post) || resolvePostCover(post);
  const index = pool.indexOf(current);
  return pool[(index + 1 + pool.length) % pool.length];
}

async function remoteAnimeCover() {
  const response = await fetch(REMOTE_ANIME_API, { cache: "no-store" });
  if (!response.ok) throw new Error("remote anime image request failed");
  const payload = await response.json();
  if (!payload.url) throw new Error("remote anime image payload missing url");
  return payload.url;
}

function renderHeader() {
  const links = [
    ["首页", "index.html", "home"],
    ["归档", "archive.html", "archive"],
    ["图库", "gallery.html", "images"],
    ["关于", "about.html", "user-round"]
  ];

  return `
    <header class="site-header">
      <a class="brand" href="index.html" aria-label="His-Smile home">
        <span class="brand-mark">H</span>
        <span>
          <strong>${data.site.name}</strong>
          <small>${data.site.alias}</small>
        </span>
      </a>
      <nav class="nav-links" aria-label="主导航">
        ${links.map(([label, href, iconName]) => `
          <a class="${href.includes(page) || (page === "home" && href === "index.html") ? "active" : ""}" href="${href}">
            ${icon(iconName)}<span>${label}</span>
          </a>
        `).join("")}
      </nav>
      <div class="header-actions">
        <button class="icon-button" data-theme-toggle aria-label="切换深色模式" title="切换深色模式">${icon("moon")}</button>
        <button class="icon-button mobile-only" data-menu-toggle aria-label="打开导航" title="打开导航">${icon("menu")}</button>
      </div>
    </header>
    <nav class="mobile-nav" data-mobile-nav aria-label="移动导航">
      ${links.map(([label, href, iconName]) => `<a href="${href}">${icon(iconName)}${label}</a>`).join("")}
    </nav>
  `;
}

function renderFooter() {
  return `
    <footer class="site-footer">
      <div>
        <strong>${data.site.name}</strong>
        <p>${data.site.motto}</p>
      </div>
      <div class="footer-links">
        <a href="${data.site.github}" target="_blank" rel="noreferrer">${icon("github")}GitHub</a>
        <a href="${data.site.imageHost}" target="_blank" rel="noreferrer">${icon("image")}图床</a>
        <a href="${data.site.originalSite}" target="_blank" rel="noreferrer">${icon("external-link")}旧站</a>
      </div>
    </footer>
  `;
}

function shellPage(content, options = {}) {
  shell.innerHTML = `
    ${renderHeader()}
    <main class="${options.fullBleed ? "main full-bleed" : "main"}">
      ${content}
    </main>
    ${renderFooter()}
    <div class="lightbox" data-lightbox hidden>
      <button class="icon-button lightbox-close" data-lightbox-close aria-label="关闭图片">${icon("x")}</button>
      <img alt="">
    </div>
  `;
  bindGlobalInteractions();
}

function postMeta(post) {
  return `
    <div class="meta-line">
      <span>${icon("calendar-days")}${formatDate(post.date)}</span>
      <span>${icon("folder")}${post.category}</span>
      <span>${icon("clock-3")}${readingText(post)}</span>
    </div>
  `;
}

function tagList(tags) {
  return `<div class="tag-list">${tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>`;
}

function postCard(post, variant = "default") {
  const cover = resolvePostCover(post);
  return `
    <article class="post-card ${variant} tone-${post.coverTone || "cyan"}">
      <div class="post-cover-wrap">
        <a class="post-cover" href="${postUrl(post)}" aria-label="${escapeHtml(post.title)}">
          <img data-cover-img="${post.id}" src="${cover}" alt="${escapeHtml(post.title)}">
          <span class="cover-veil"></span>
          <span class="cover-kicker">${escapeHtml(post.category)}</span>
        </a>
        <button class="cover-refresh" data-cover-refresh="${post.id}" aria-label="换一张封面" title="换一张封面">${icon("shuffle")}</button>
      </div>
      <div class="post-card-body">
        ${postMeta(post)}
        <h3><a href="${postUrl(post)}">${escapeHtml(post.title)}</a></h3>
        <p>${escapeHtml(post.summary)}</p>
        <div class="post-card-bottom">
          ${tagList(post.tags.slice(0, 3))}
          <a class="read-link" href="${postUrl(post)}" aria-label="阅读全文 ${escapeHtml(post.title)}">${icon("arrow-up-right")}</a>
        </div>
      </div>
    </article>
  `;
}

function renderHome() {
  const latest = byDate[0];
  const secondary = byDate.slice(1, 7);
  shellPage(`
    <section class="hero" style="--hero-image: url('${data.site.hero}')">
      <div class="hero-shade"></div>
      <div class="hero-atmosphere" aria-hidden="true"></div>
      <div class="hero-content reveal">
        <p class="eyebrow">Personal engineering journal</p>
        <h1>${data.site.name}</h1>
        <p>${data.site.description}</p>
        <div class="typewriter" aria-live="polite">
          <span data-typewriter></span><i></i>
        </div>
        <div class="hero-actions">
          <a class="primary-action" href="${postUrl(latest)}">${icon("book-open-text")}最新文章</a>
          <a class="secondary-action" href="archive.html">${icon("archive")}浏览归档</a>
        </div>
      </div>
      <a class="hero-next" href="#feed" aria-label="查看文章">${icon("chevron-down")}</a>
    </section>

    <section class="home-band" id="feed">
      <div class="blur-backdrop" aria-hidden="true"></div>
      <div class="content-grid">
        <aside class="profile-panel reveal">
          <img class="avatar" src="${data.site.avatar}" alt="${data.site.alias}">
          <h2>${data.site.alias}</h2>
          <p>${data.site.motto}</p>
          <div class="stat-row">
            <span><strong>${data.posts.length}</strong>文章</span>
            <span><strong>${allCategories.length}</strong>分类</span>
            <span><strong>${allTags.length}</strong>标签</span>
          </div>
          <a class="panel-link" href="about.html">${icon("user-round")}关于我</a>
        </aside>

        <section class="feed-column">
          <div class="showcase-strip reveal">
            <span>Java</span>
            <span>Database</span>
            <span>PicBed</span>
            <span>Daily Notes</span>
          </div>
          <div class="section-head reveal">
            <p class="eyebrow">Featured</p>
            <h2>最近在整理的内容</h2>
          </div>
          ${postCard(latest, "featured reveal")}
          <div class="post-grid">
            ${secondary.map((post) => postCard(post, "reveal")).join("")}
          </div>
        </section>

        <aside class="side-stack reveal">
          <section class="side-block">
            <h2>${icon("sparkles")}专题</h2>
            ${allCategories.map((cat) => {
              const count = data.posts.filter((post) => post.category === cat).length;
              return `<a href="archive.html?category=${encodeURIComponent(cat)}"><span>${cat}</span><strong>${count}</strong></a>`;
            }).join("")}
          </section>
          <section class="side-block">
            <h2>${icon("tags")}标签</h2>
            <div class="tag-cloud">
              ${allTags.map((tag) => `<a href="archive.html?tag=${encodeURIComponent(tag)}">${tag}</a>`).join("")}
            </div>
          </section>
        </aside>
      </div>
    </section>
  `, { fullBleed: true });
}

function renderArticle() {
  const params = new URLSearchParams(location.search);
  const id = params.get("id") || byDate[0].id;
  const post = data.posts.find((item) => item.id === id) || byDate[0];
  const cover = resolvePostCover(post);
  const related = data.posts
    .filter((item) => item.id !== post.id && (item.category === post.category || item.tags.some((tag) => post.tags.includes(tag))))
    .slice(0, 3);

  document.title = `${post.title} | ${data.site.name}`;
  shellPage(`
    <article class="article-layout">
      <header class="article-hero reveal">
        <div>
          <p class="eyebrow">${post.category}</p>
          <h1>${escapeHtml(post.title)}</h1>
          ${postMeta(post)}
          ${tagList(post.tags)}
        </div>
        <div class="article-cover-wrap">
          <img data-cover-img="${post.id}" src="${cover}" alt="${escapeHtml(post.title)}">
          <button class="cover-refresh article-refresh" data-cover-refresh="${post.id}" aria-label="换一张封面" title="换一张封面">${icon("shuffle")}</button>
        </div>
      </header>

      <div class="article-grid">
        <aside class="article-aside reveal">
          <a href="archive.html">${icon("arrow-left")}返回归档</a>
          <a href="${data.site.originalSite}" target="_blank" rel="noreferrer">${icon("external-link")}查看旧站</a>
          <div>
            <strong>${post.heat}℃</strong>
            <span>内容热度</span>
          </div>
        </aside>
        <section class="article-content reveal">
          <div data-article-content>${post.body}</div>
        </section>
      </div>

      <section class="related-posts reveal">
        <div class="section-head">
          <p class="eyebrow">Related</p>
          <h2>继续阅读</h2>
        </div>
        <div class="post-grid">
          ${(related.length ? related : byDate.slice(0, 3)).map((item) => postCard(item)).join("")}
        </div>
      </section>
    </article>
  `);
  hydrateArticleContent(post);
}

async function hydrateArticleContent(post) {
  const target = document.querySelector("[data-article-content]");
  if (!target) return;
  try {
    const response = await fetch(`./assets/content/${post.id}.html`, { cache: "no-store" });
    if (!response.ok) return;
    const html = await response.text();
    if (html.trim().length > post.body.trim().length) {
      target.innerHTML = html;
    }
  } catch {
    target.innerHTML = post.body;
  }
}

function renderArchive() {
  const params = new URLSearchParams(location.search);
  const activeCategory = params.get("category");
  const activeTag = params.get("tag");
  const filtered = data.posts.filter((post) => {
    if (activeCategory && post.category !== activeCategory) return false;
    if (activeTag && !post.tags.includes(activeTag)) return false;
    return true;
  });
  const years = [...new Set(filtered.map((post) => post.date.slice(0, 4)))];

  shellPage(`
    <section class="page-hero compact reveal">
      <p class="eyebrow">Archive</p>
      <h1>所有文章都在这里</h1>
      <p>按时间、分类和标签快速回到某一段学习记录。</p>
    </section>

    <section class="archive-layout">
      <aside class="filter-panel reveal">
        <h2>${icon("folder-tree")}分类</h2>
        <a class="${!activeCategory && !activeTag ? "active" : ""}" href="archive.html">全部文章 <strong>${data.posts.length}</strong></a>
        ${allCategories.map((cat) => `<a class="${activeCategory === cat ? "active" : ""}" href="archive.html?category=${encodeURIComponent(cat)}">${cat}<strong>${data.posts.filter((post) => post.category === cat).length}</strong></a>`).join("")}
        <h2>${icon("tags")}标签</h2>
        <div class="tag-cloud">
          ${allTags.map((tag) => `<a class="${activeTag === tag ? "active" : ""}" href="archive.html?tag=${encodeURIComponent(tag)}">${tag}</a>`).join("")}
        </div>
      </aside>
      <div class="timeline reveal">
        ${years.map((year) => `
          <section>
            <h2>${year}</h2>
            ${filtered.filter((post) => post.date.startsWith(year)).map((post) => `
              <a class="timeline-item" href="${postUrl(post)}">
                <time>${formatDate(post.date)}</time>
                <span>
                  <strong>${escapeHtml(post.title)}</strong>
                  <small>${escapeHtml(post.summary)}</small>
                </span>
                ${icon("arrow-up-right")}
              </a>
            `).join("")}
          </section>
        `).join("")}
      </div>
    </section>
  `);
}

function renderGallery() {
  shellPage(`
    <section class="page-hero compact reveal">
      <p class="eyebrow">Gallery</p>
      <h1>图床与素材</h1>
      <p>这里集中展示 ` + data.site.imageHost.replace("https://github.com/", "") + ` 中被博客使用的图片资源。</p>
    </section>
    <section class="gallery-grid">
      ${data.photos.map((photo) => `
        <button class="photo-tile reveal" data-photo="${photo.src}" aria-label="查看 ${escapeHtml(photo.title)}">
          <img src="${photo.src}" alt="${escapeHtml(photo.title)}">
          <span>${photo.tag}</span>
          <strong>${escapeHtml(photo.title)}</strong>
        </button>
      `).join("")}
    </section>
  `);
}

function renderAbout() {
  shellPage(`
    <section class="about-hero reveal">
      <div>
        <p class="eyebrow">About</p>
        <h1>${data.site.alias}</h1>
        <p>${data.site.motto}</p>
      </div>
      <img src="${data.site.avatar}" alt="${data.site.alias}">
    </section>

    <section class="about-layout">
      <div class="about-copy reveal">
        <h2>这个博客要解决什么</h2>
        <p>它不是一个临时笔记堆，而是一个可以持续维护的个人知识前台。内容重点放在 Java、数据库、图床、代码问题和日常开发经验。</p>
        <p>新版本把首页、归档、图库、文章详情和关于页分开，保持 GitHub Pages 的部署简单性，同时让读者更容易找到内容。</p>
      </div>
      <div class="about-list reveal">
        <h2>站点结构</h2>
        <a href="index.html">${icon("home")}首页内容门户</a>
        <a href="archive.html">${icon("archive")}归档与分类</a>
        <a href="gallery.html">${icon("image")}图床图库</a>
        <a href="${data.site.github}" target="_blank" rel="noreferrer">${icon("github")}GitHub 项目</a>
      </div>
    </section>

    <section class="milestones reveal">
      <h2>站点路线</h2>
      <div>
        <span>2024</span>
        <strong>建立博客与图床</strong>
        <p>用 GitHub Pages 承载静态博客，用 ` + data.site.imageHost.replace("https://github.com/", "") + ` 存放图片。</p>
      </div>
      <div>
        <span>2025</span>
        <strong>同步学习与工作记录</strong>
        <p>持续整理 Java、数据库、上线问题和代码优化笔记。</p>
      </div>
      <div>
        <span>Next</span>
        <strong>迁移到更完整的内容系统</strong>
        <p>后续可以把这个静态项目升级成 Astro、Hexo 源码主题或内容管理后台。</p>
      </div>
    </section>
  `);
}

function bindGlobalInteractions() {
  const storedTheme = localStorage.getItem("his-smile-theme");
  if (storedTheme === "dark") document.documentElement.classList.add("dark");

  document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("his-smile-theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
  });

  document.querySelector("[data-menu-toggle]")?.addEventListener("click", () => {
    document.querySelector("[data-mobile-nav]")?.classList.toggle("open");
  });

  document.querySelectorAll(".photo-tile").forEach((button) => {
    button.addEventListener("click", () => {
      const lightbox = document.querySelector("[data-lightbox]");
      const image = lightbox.querySelector("img");
      image.src = button.dataset.photo;
      image.alt = button.querySelector("strong").textContent;
      lightbox.hidden = false;
    });
  });

  document.querySelector("[data-lightbox-close]")?.addEventListener("click", () => {
    document.querySelector("[data-lightbox]").hidden = true;
  });

  bindCoverFallback();
  bindCoverRefresh();
  bindTypewriter();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("in-view");
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".reveal").forEach((item) => observer.observe(item));

  if (window.lucide) window.lucide.createIcons({ strokeWidth: 1.8 });
}

function bindCoverFallback() {
  document.querySelectorAll("[data-cover-img]").forEach((image) => {
    image.addEventListener("error", () => {
      const post = data.posts.find((item) => item.id === image.dataset.coverImg);
      if (post && image.src !== post.cover) image.src = post.cover;
    }, { once: true });
  });
}

function bindCoverRefresh() {
  document.querySelectorAll("[data-cover-refresh]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      const post = data.posts.find((item) => item.id === button.dataset.coverRefresh);
      if (!post) return;

      button.classList.add("loading");
      let next = nextLocalCover(post);

      if (event.altKey) {
        try {
          next = await remoteAnimeCover();
        } catch {
          next = nextLocalCover(post);
        }
      }

      sessionStorage.setItem(`his-smile-cover:${post.id}`, next);
      document.querySelectorAll(`[data-cover-img="${post.id}"]`).forEach((image) => {
        image.src = next;
      });
      button.classList.remove("loading");
    });
  });
}

function bindTypewriter() {
  const target = document.querySelector("[data-typewriter]");
  if (!target || target.dataset.bound) return;
  target.dataset.bound = "true";
  const lines = data.site.typewriterLines;
  let lineIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const line = lines[lineIndex];
    target.textContent = line.slice(0, charIndex);

    if (!deleting && charIndex < line.length) {
      charIndex += 1;
      setTimeout(tick, 82);
      return;
    }

    if (!deleting && charIndex === line.length) {
      deleting = true;
      setTimeout(tick, 1800);
      return;
    }

    if (deleting && charIndex > 0) {
      charIndex -= 1;
      setTimeout(tick, 38);
      return;
    }

    deleting = false;
    lineIndex = (lineIndex + 1) % lines.length;
    setTimeout(tick, 360);
  };

  tick();
}

const renderers = {
  home: renderHome,
  article: renderArticle,
  archive: renderArchive,
  gallery: renderGallery,
  about: renderAbout
};

renderers[page]?.();
