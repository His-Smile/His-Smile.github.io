const data = window.BLOG_DATA;
const page = document.body.dataset.page;
const shell = document.querySelector("#site-shell");

const byDate = [...data.posts].sort((a, b) => b.date.localeCompare(a.date));
const featured = byDate.slice(0, 4);
const allTags = [...new Set(data.posts.flatMap((post) => post.tags))];
const allCategories = [...new Set(data.posts.map((post) => post.category))];
let currentBackdrop = (data.site.backdrops || [data.site.hero])[Math.floor(Math.random() * (data.site.backdrops || [data.site.hero]).length)];
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

function applyPageBackdrop(image = currentBackdrop) {
  currentBackdrop = image;
  document.documentElement.style.setProperty("--page-backdrop-image", `url("${image}")`);
}

function randomBackdrop() {
  const backdrops = data.site.backdrops || [data.site.hero];
  if (backdrops.length < 2) return backdrops[0];
  let next = currentBackdrop;
  while (next === currentBackdrop) {
    next = backdrops[Math.floor(Math.random() * backdrops.length)];
  }
  return next;
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
    ["日记", "diary.html", "lock-keyhole"],
    ["关于", "about.html", "user-round"]
  ];

  return `
    <header class="site-header">
      <a class="brand" href="index.html" aria-label="His-Smile home">
        <span>
          <strong>${data.site.name}</strong>
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
  applyPageBackdrop(currentBackdrop);
  shellPage(`
    <section class="hero" style="--hero-image: url('${currentBackdrop}')">
      <div class="hero-shade"></div>
      <div class="hero-atmosphere" aria-hidden="true"></div>
      <div class="snow-field" aria-hidden="true"></div>
      <div class="snow-field snow-field-far" aria-hidden="true"></div>
      <div class="hero-content reveal">
        <p class="eyebrow">Love Letter Journal</p>
        <h1>${data.site.name}</h1>
        <div class="typewriter" aria-live="polite">
          <span data-typewriter></span><i></i>
        </div>
        <div class="hero-actions">
          <a class="primary-action" href="${postUrl(latest)}">${icon("book-open-text")}最新文章</a>
          <a class="secondary-action" href="archive.html">${icon("archive")}浏览归档</a>
          <button class="secondary-action backdrop-action" data-backdrop-refresh type="button">${icon("refresh-cw")}换一张</button>
        </div>
      </div>
      <figure class="hero-film-frame reveal">
        <img src="${data.site.filmPoster}" alt="电影《情书》海报">
        <figcaption>
          <span>Love Letter · 1995</span>
          <strong>His Smile</strong>
        </figcaption>
      </figure>
      <a class="hero-next" href="#feed" aria-label="查看文章">${icon("chevron-down")}</a>
    </section>

    <section class="home-band" id="feed">
      <div class="blur-backdrop" aria-hidden="true"></div>
      <section class="letter-mood reveal">
        <div class="letter-copy">
          <p class="eyebrow">Notes</p>
          <h2>一些记录，慢慢留下</h2>
        </div>
        <div class="letter-tags" aria-label="内容方向">
          <span>Java</span>
          <span>Database</span>
          <span>PicBed</span>
          <span>Daily</span>
        </div>
      </section>
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
          <div class="section-head reveal">
            <p class="eyebrow">Latest Letters</p>
            <h2>最近写下的内容</h2>
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

      <section class="site-runtime reveal">
        <strong>His Smile</strong>
        <span>© 2026</span>
        <span>建站 <b data-runtime-days>0</b> 天 <b data-runtime-hours>0</b> 时 <b data-runtime-minutes>0</b> 分 <b data-runtime-seconds>0</b> 秒</span>
        <span>${icon("eye")} <b>10335</b> 访问</span>
        <span>${icon("map-pin")} 本站由 <b>GitHub Pages</b> 与 <b>jsDelivr</b> 提供静态服务</span>
      </section>
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

function markdownToHtml(markdown) {
  const lines = markdown
    .replace(/<!--[\s\S]*?-->/g, "")
    .split(/\r?\n/);
  const blocks = [];
  let paragraph = [];
  let list = [];

  const flushParagraph = () => {
    if (!paragraph.length) return;
    blocks.push(`<p>${escapeHtml(paragraph.join(" ").trim())}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!list.length) return;
    blocks.push(`<ul>${list.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`);
    list = [];
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      return;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      const level = Math.min(heading[1].length + 1, 4);
      blocks.push(`<h${level}>${escapeHtml(heading[2])}</h${level}>`);
      return;
    }

    if (line.startsWith("> ")) {
      flushParagraph();
      flushList();
      blocks.push(`<blockquote>${escapeHtml(line.slice(2))}</blockquote>`);
      return;
    }

    if (/^[-*]\s+/.test(line)) {
      flushParagraph();
      list.push(line.replace(/^[-*]\s+/, ""));
      return;
    }

    paragraph.push(line);
  });

  flushParagraph();
  flushList();
  return blocks.join("");
}

async function hydrateAboutContent() {
  const target = document.querySelector("[data-about-content]");
  if (!target) return;
  try {
    const response = await fetch("./assets/content/about.md", { cache: "no-store" });
    if (!response.ok) return;
    const markdown = await response.text();
    const visibleText = markdown.replace(/<!--[\s\S]*?-->/g, "").trim();
    if (visibleText) target.innerHTML = markdownToHtml(markdown);
  } catch {
    // Keep the built-in fallback copy.
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
      <h1>图床与情书氛围</h1>
      <p>这里放博客用到的图片，也保留一点电影《情书》的雪、信和日影感。</p>
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
      <div class="about-copy reveal" data-about-content>
        <h2>为什么叫我的情书</h2>
        <p>因为我很喜欢岩井俊二的电影《情书》。那种雪地里迟到的问候、旧书卡上的名字、没有说出口却一直留着的话，和我想做这个博客的感觉很像。</p>
        <p>这里仍然会认真记录 Java、数据库、图床、代码问题和日常开发经验。只是我希望它更像一封信，有温度，也有可以反复回看的痕迹。</p>
        <p>首页、归档、图库、文章详情和关于页已经分开，部署仍然保持 GitHub Pages 的简单方式；读者可以更快找到内容，我也能长期把它写下去。</p>
      </div>
      <div class="about-list reveal">
        <h2>站点结构</h2>
        <a href="index.html">${icon("home")}首页</a>
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
  hydrateAboutContent();
}

const DIARY_ACCESS_KEY = "his-smile-diary-access";
const DIARY_ENTRIES_KEY = "his-smile-diary-entries";
const DIARY_PASSWORD_HASH_KEY = "his-smile-diary-password-hash";
const DIARY_DEFAULT_API_URL = "https://his-smile-diary-api.13233000113.workers.dev";
const DIARY_SYNC_TOKEN = "hs_2V9qL8mN4xR7pA1z_20010117_letter";
const DIARY_CLOUD_READ_PASSWORD_HASHES = [
  "9570c8b67b6765a797b59fb44eb02745a0bad4f4a37c610c15c86fc76a738c1d",
  "297e32fc5feed606839b66890def6024bb90152be9375b0da3e73b1a367d9185"
];

async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function isDiaryUnlocked() {
  return sessionStorage.getItem(DIARY_ACCESS_KEY) === currentDiaryPasswordHash();
}

function currentDiaryPasswordHash() {
  return localStorage.getItem(DIARY_PASSWORD_HASH_KEY) || data.diary.passwordHash;
}

function updateDiaryPasswordHash(hash) {
  localStorage.setItem(DIARY_PASSWORD_HASH_KEY, hash);
  sessionStorage.setItem(DIARY_ACCESS_KEY, hash);
}

function readDiaryEntries() {
  try {
    const parsed = JSON.parse(localStorage.getItem(DIARY_ENTRIES_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeDiaryEntries(entries) {
  localStorage.setItem(DIARY_ENTRIES_KEY, JSON.stringify(entries));
}

function diarySyncConfig() {
  return {
    apiUrl: DIARY_DEFAULT_API_URL,
    token: DIARY_SYNC_TOKEN
  };
}

function diarySyncReady() {
  const config = diarySyncConfig();
  return Boolean(config.apiUrl && config.token);
}

function normalizeDiaryEntry(entry) {
  return {
    id: entry.id,
    title: entry.title || "",
    mood: entry.mood || "",
    body: entry.body || "",
    createdAt: entry.createdAt || entry.created_at || new Date().toISOString(),
    updatedAt: entry.updatedAt || entry.updated_at || entry.createdAt || entry.created_at || new Date().toISOString()
  };
}

function mergeDiaryEntries(incoming) {
  const merged = new Map(readDiaryEntries().map((entry) => [entry.id, normalizeDiaryEntry(entry)]));
  incoming.map(normalizeDiaryEntry).forEach((entry) => merged.set(entry.id, entry));
  const entries = [...merged.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  writeDiaryEntries(entries);
  return entries;
}

async function diaryApi(path, options = {}) {
  const config = diarySyncConfig();
  if (!config.token) throw new Error("missing_token");
  const response = await fetch(`${config.apiUrl}${path}`, {
    ...options,
    headers: {
      "Authorization": `Bearer ${config.token}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};
  if (!response.ok) {
    const error = new Error(payload.error || "request_failed");
    error.status = response.status;
    throw error;
  }
  return payload;
}

async function saveDiaryEntryToCloud(entry) {
  if (!diarySyncReady()) return false;
  await diaryApi("/diary", {
    method: "POST",
    body: JSON.stringify(normalizeDiaryEntry(entry))
  });
  return true;
}

async function pullDiaryEntriesFromCloud() {
  const payload = await diaryApi("/diary");
  return mergeDiaryEntries(payload.entries || []);
}

async function pushDiaryEntriesToCloud() {
  const entries = readDiaryEntries().map(normalizeDiaryEntry);
  for (const entry of entries) {
    await diaryApi(`/diary/${encodeURIComponent(entry.id)}`, { method: "DELETE" });
    await diaryApi("/diary", {
      method: "POST",
      body: JSON.stringify(entry)
    });
  }
  return entries.length;
}

function formatDiaryDate(value) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function diaryEntryMarkup(entry) {
  const id = escapeHtml(entry.id);
  return `
    <article class="diary-entry" data-entry-id="${id}">
      <div>
        <span>${escapeHtml(entry.mood)}</span>
        <time>${formatDiaryDate(entry.createdAt)}</time>
      </div>
      <h3>${escapeHtml(entry.title || "未命名的一天")}</h3>
      <div class="diary-entry-body" data-diary-body-panel="${id}" hidden>
        <p>${escapeHtml(entry.body).replaceAll("\n", "<br>")}</p>
      </div>
      <div class="diary-entry-actions">
        <button class="text-button" data-diary-toggle="${id}" aria-expanded="false">${icon("eye")}查看内容</button>
        <button class="text-button" data-diary-delete="${id}">${icon("trash-2")}删除</button>
      </div>
    </article>
  `;
}

function diaryEntriesMarkup() {
  const entries = readDiaryEntries().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  if (!entries.length) {
    return `<div class="diary-empty">还没有写下第一篇。等一场雪，或者等一个很普通的夜晚。</div>`;
  }
  return entries.map(diaryEntryMarkup).join("");
}

function renderDiary() {
  const unlocked = isDiaryUnlocked();
  shellPage(`
    <section class="diary-hero reveal">
      <div class="snow-field" aria-hidden="true"></div>
      <div>
        <p class="eyebrow">Private Letter</p>
        <h1>留给自己</h1>
        <p>安静一点，写完就好</p>
      </div>
      <div class="diary-stamp" aria-hidden="true">
        <span>01.17</span>
        <strong>private</strong>
      </div>
    </section>

    ${unlocked ? `
      <section class="diary-room reveal">
        <div class="diary-compose">
          <div class="section-head">
            <p class="eyebrow">Tonight</p>
            <h2>写一点今天</h2>
          </div>
          <label>
            <span>标题</span>
            <input data-diary-title maxlength="40" placeholder="比如：雪停以后">
          </label>
          <div class="mood-picker" data-mood-picker>
            ${data.diary.moods.map((mood, index) => `
              <button class="${index === 0 ? "active" : ""}" data-mood="${escapeHtml(mood)}">${escapeHtml(mood)}</button>
            `).join("")}
          </div>
          <label>
            <span>正文</span>
            <textarea data-diary-body rows="9" placeholder="把今天没说出口的话，慢慢写在这里。"></textarea>
          </label>
          <div class="diary-actions">
            <button class="primary-action" data-diary-save>${icon("send")}保存</button>
            <button class="secondary-action calm" data-diary-lock>${icon("lock")}锁上</button>
          </div>
          <section class="diary-tools">
            <label class="diary-cloud-pass">
              <span>云端密码</span>
              <input type="password" data-diary-cloud-password autocomplete="off" placeholder="读取前输入">
            </label>
            <div class="diary-tool-actions">
              <button class="secondary-action calm" data-diary-cloud-pull type="button">${icon("cloud-download")}读取云端</button>
              <button class="secondary-action calm" data-diary-password-toggle type="button" aria-expanded="false">${icon("key-round")}修改密码</button>
            </div>
            <div class="diary-password-panel" data-diary-password-panel hidden>
              <label>
                <span>当前密码</span>
                <input type="password" data-diary-old-password autocomplete="current-password">
              </label>
              <label>
                <span>新密码</span>
                <input type="password" data-diary-new-password autocomplete="new-password">
              </label>
              <label>
                <span>确认新密码</span>
                <input type="password" data-diary-confirm-password autocomplete="new-password">
              </label>
              <button class="secondary-action calm" data-diary-password-change type="button">${icon("check")}确认修改</button>
            </div>
          </section>
          <p class="diary-note" data-diary-note></p>
        </div>
        <div class="diary-list" data-diary-list>
          ${diaryEntriesMarkup()}
        </div>
      </section>
    ` : `
      <section class="diary-gate reveal">
        <form class="diary-lock" data-diary-lock-form>
          <p class="eyebrow">Password</p>
          <h2>把门轻轻推开。</h2>
          <p>答案藏在那一天，也藏在一封信的开头。</p>
          <label>
            <span>密码</span>
            <input type="password" data-diary-password autocomplete="current-password" placeholder="输入你的私密密码">
          </label>
          <button class="primary-action" type="submit">${icon("key-round")}进入日记</button>
          <small>${escapeHtml(data.diary.hint)}</small>
          <p class="diary-note" data-diary-message></p>
        </form>
      </section>
    `}
  `);
  bindDiary(unlocked);
}

function bindDiary(unlocked) {
  if (!unlocked) {
    document.querySelector("[data-diary-lock-form]")?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const input = document.querySelector("[data-diary-password]");
      const message = document.querySelector("[data-diary-message]");
      const hash = await sha256Hex(input.value);
      if (hash === currentDiaryPasswordHash()) {
        sessionStorage.setItem(DIARY_ACCESS_KEY, hash);
        renderDiary();
        return;
      }
      message.textContent = "密码不对。别急，雪会慢慢落下来。";
      input.value = "";
      input.focus();
    });
    return;
  }

  let selectedMood = data.diary.moods[0];
  document.querySelectorAll("[data-mood]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedMood = button.dataset.mood;
      document.querySelectorAll("[data-mood]").forEach((item) => item.classList.toggle("active", item === button));
    });
  });

  document.querySelector("[data-diary-save]")?.addEventListener("click", async () => {
    const title = document.querySelector("[data-diary-title]").value.trim();
    const body = document.querySelector("[data-diary-body]").value.trim();
    const note = document.querySelector("[data-diary-note]");
    if (!body) {
      note.textContent = "正文还空着。哪怕只写一句，也算今天留下了痕迹。";
      return;
    }
    const entries = readDiaryEntries();
    const entry = {
      id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
      title,
      mood: selectedMood,
      body,
      createdAt: new Date().toISOString()
    };
    entries.push(entry);
    writeDiaryEntries(entries);
    document.querySelector("[data-diary-title]").value = "";
    document.querySelector("[data-diary-body]").value = "";
    document.querySelector("[data-diary-list]").innerHTML = diaryEntriesMarkup();
    note.textContent = "保存好了。";
    bindDiaryEntries();
    if (window.lucide) window.lucide.createIcons({ strokeWidth: 1.8 });
    try {
      const synced = await saveDiaryEntryToCloud(entry);
      if (synced) note.textContent = "本地和云端都保存好了。";
    } catch {
      note.textContent = "本地已保存，云端暂时没有连上。";
    }
  });

  document.querySelector("[data-diary-lock]")?.addEventListener("click", () => {
    sessionStorage.removeItem(DIARY_ACCESS_KEY);
    renderDiary();
  });

  bindDiaryEntries();
  bindDiarySync();
  bindDiaryPasswordChange();
  autoUploadLocalDiaryEntries();
}

function bindDiaryEntries() {
  bindDiaryEntryToggles();
  bindDiaryDelete();
}

function bindDiaryEntryToggles() {
  document.querySelectorAll("[data-diary-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const entry = button.closest(".diary-entry");
      const panel = entry?.querySelector("[data-diary-body-panel]");
      if (!entry || !panel) return;
      const expanded = button.getAttribute("aria-expanded") === "true";
      panel.hidden = expanded;
      button.setAttribute("aria-expanded", String(!expanded));
      button.innerHTML = `${icon(expanded ? "eye" : "eye-off")}${expanded ? "查看内容" : "收起内容"}`;
      entry.classList.toggle("open", !expanded);
      if (window.lucide) window.lucide.createIcons({ strokeWidth: 1.8 });
    });
  });
}

function bindDiaryDelete() {
  document.querySelectorAll("[data-diary-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      const entries = readDiaryEntries().filter((entry) => entry.id !== button.dataset.diaryDelete);
      writeDiaryEntries(entries);
      document.querySelector("[data-diary-list]").innerHTML = diaryEntriesMarkup();
      bindDiaryEntries();
      if (window.lucide) window.lucide.createIcons({ strokeWidth: 1.8 });
      const note = document.querySelector("[data-diary-note]");
      if (note) note.textContent = "已从本地移除，云端仍会保留。";
    });
  });
}

async function autoUploadLocalDiaryEntries() {
  const note = document.querySelector("[data-diary-note]");
  const entries = readDiaryEntries();
  if (!entries.length || !diarySyncReady()) return;

  try {
    const count = await pushDiaryEntriesToCloud();
    if (note && count) note.textContent = `本地 ${count} 条日记已自动同步到云端。`;
  } catch {
    if (note && !note.textContent) note.textContent = "本地日记已保留，云端稍后会再同步。";
  }
}

function bindDiarySync() {
  const note = document.querySelector("[data-diary-note]");

  document.querySelector("[data-diary-cloud-pull]")?.addEventListener("click", async () => {
    const cloudPasswordInput = document.querySelector("[data-diary-cloud-password]");
    const cloudPasswordHash = await sha256Hex(cloudPasswordInput.value);
    if (!DIARY_CLOUD_READ_PASSWORD_HASHES.includes(cloudPasswordHash)) {
      note.textContent = "云端读取密码不对。";
      cloudPasswordInput.value = "";
      cloudPasswordInput.focus();
      return;
    }

    note.textContent = "正在读取云端...";
    try {
      const entries = await pullDiaryEntriesFromCloud();
      document.querySelector("[data-diary-list]").innerHTML = diaryEntriesMarkup();
      bindDiaryEntries();
      cloudPasswordInput.value = "";
      note.textContent = `已从云端读取 ${entries.length} 条日记。`;
      if (window.lucide) window.lucide.createIcons({ strokeWidth: 1.8 });
    } catch {
      note.textContent = "读取失败。稍后再试。";
    }
  });
}

function bindDiaryPasswordChange() {
  document.querySelector("[data-diary-password-toggle]")?.addEventListener("click", () => {
    const panel = document.querySelector("[data-diary-password-panel]");
    const toggle = document.querySelector("[data-diary-password-toggle]");
    if (!panel || !toggle) return;
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    panel.hidden = expanded;
    toggle.setAttribute("aria-expanded", String(!expanded));
    toggle.innerHTML = `${icon(expanded ? "key-round" : "x")}${expanded ? "修改密码" : "收起"}`;
    if (!expanded) document.querySelector("[data-diary-old-password]")?.focus();
    if (window.lucide) window.lucide.createIcons({ strokeWidth: 1.8 });
  });

  document.querySelector("[data-diary-password-change]")?.addEventListener("click", async () => {
    const oldInput = document.querySelector("[data-diary-old-password]");
    const newInput = document.querySelector("[data-diary-new-password]");
    const confirmInput = document.querySelector("[data-diary-confirm-password]");
    const note = document.querySelector("[data-diary-note]");
    const oldHash = await sha256Hex(oldInput.value);

    if (oldHash !== currentDiaryPasswordHash()) {
      note.textContent = "当前密码不对。";
      oldInput.focus();
      return;
    }

    if (newInput.value.trim().length < 6) {
      note.textContent = "新密码至少 6 位。";
      newInput.focus();
      return;
    }

    if (newInput.value !== confirmInput.value) {
      note.textContent = "两次输入的新密码不一致。";
      confirmInput.focus();
      return;
    }

    const nextHash = await sha256Hex(newInput.value);
    updateDiaryPasswordHash(nextHash);
    oldInput.value = "";
    newInput.value = "";
    confirmInput.value = "";
    document.querySelector("[data-diary-password-panel]").hidden = true;
    const toggle = document.querySelector("[data-diary-password-toggle]");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.innerHTML = `${icon("key-round")}修改密码`;
    }
    note.textContent = "密码已更新。下次进入日记时使用新密码。";
    if (window.lucide) window.lucide.createIcons({ strokeWidth: 1.8 });
  });
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
  bindBackdropRefresh();
  bindRuntime();

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

function bindBackdropRefresh() {
  document.querySelector("[data-backdrop-refresh]")?.addEventListener("click", () => {
    const next = randomBackdrop();
    applyPageBackdrop(next);
    document.querySelector(".hero")?.style.setProperty("--hero-image", `url("${next}")`);
  });
}

function renderRuntime() {
  const daysTarget = document.querySelector("[data-runtime-days]");
  if (!daysTarget) return;
  const start = new Date(`${data.site.since}T00:00:00+08:00`).getTime();
  const totalSeconds = Math.max(0, Math.floor((Date.now() - start) / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  daysTarget.textContent = days;
  document.querySelector("[data-runtime-hours]").textContent = hours;
  document.querySelector("[data-runtime-minutes]").textContent = minutes;
  document.querySelector("[data-runtime-seconds]").textContent = seconds;
}

function bindRuntime() {
  if (!document.querySelector("[data-runtime-days]")) return;
  renderRuntime();
  setInterval(renderRuntime, 1000);
}

const renderers = {
  home: renderHome,
  article: renderArticle,
  archive: renderArchive,
  gallery: renderGallery,
  diary: renderDiary,
  about: renderAbout
};

applyPageBackdrop(currentBackdrop);
renderers[page]?.();
