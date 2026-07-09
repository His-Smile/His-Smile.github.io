const ASSET_BASE = "https://cdn.jsdelivr.net/gh/His-Smile/pic_bed/img/";

window.BLOG_DATA = {
  site: {
    name: "His-Smile",
    author: "张宇博",
    alias: "你的情书",
    since: "2024-10-17",
    location: "China",
    motto: "把学习、代码和生活的碎片整理成一封长期更新的情书。",
    description: "Java 学习、数据库、代码问题、图床记录和个人日常。",
    github: "https://github.com/His-Smile",
    originalSite: "https://his-smile.github.io/",
    imageHost: "https://github.com/His-Smile/pic_bed",
    avatar: ASSET_BASE + "p1.png",
    hero: ASSET_BASE + "202412181632154.jpg",
    heroAlt: "His-Smile hero image",
    typewriterLines: [
      "我口袋只剩玫瑰一片，此行又山高路远。",
      "把写过的代码、踩过的坑和没说完的话，慢慢存进这里。",
      "一个建立在互联网边缘的小站，记录学习，也记录生活。",
      "愿每一次回头翻阅，都能看见自己往前走过的痕迹。"
    ]
  },
  posts: [
    {
      id: "study-record",
      title: "学习记录",
      date: "2025-05-16",
      updated: "2025-06-06",
      category: "Java",
      tags: ["学习记录", "Java", "数据库"],
      cover: ASSET_BASE + "202412191906130.jpg",
      coverTone: "cyan",
      reading: 8,
      heat: 96,
      summary: "记录 IO、序列化、多线程、ConcurrentHashMap、级联更新和视图相关知识点。",
      body: `
        <h2>关于 IO 流</h2>
        <p>输入输出时要注意字符编码。GBK 一个中文通常两个字节，UTF-8 一个中文通常三个字节；负数字节常常意味着中文编码的一部分。</p>
        <p>序列化中，output 负责序列化，input 负责反序列化。序列化码需要保持一致，否则类变动后可能无法反序列化。</p>
        <h2>关于线程</h2>
        <p>继承 Thread 时，直接调用 run 只是普通方法调用，start 才会真正创建线程并由 JVM 调用 run。</p>
        <p>多线程常见实现方式包括继承 Thread、实现 Runnable、实现 Callable 配合 Future。</p>
        <h2>ConcurrentHashMap</h2>
        <p>1.7 中采用 Segment 分段锁，小数组扩容，大数组不扩容；线程进来通常只锁局部结构。1.8 更偏向数组、链表、红黑树和 synchronized 的组合。</p>
        <img src="${ASSET_BASE}202506061359212.png" alt="数据库级联示意">
        <h2>视图</h2>
        <p>视图可以把复杂查询封装成虚拟表，便于复用经常查询的需求。</p>
      `
    },
    {
      id: "proxy-tools",
      title: "翻墙工具",
      date: "2025-05-07",
      updated: "2025-05-07",
      category: "工具",
      tags: ["工具", "网络"],
      cover: ASSET_BASE + "202412191906825.jpg",
      coverTone: "blue",
      reading: 2,
      heat: 52,
      summary: "整理代理工具、影视导航、浏览器工具和配置导入入口。",
      body: `
        <h2>工具记录</h2>
        <p>这篇文章主要记录常用网络工具、配置入口和影视导航站点，方便后续查找。</p>
        <ul>
          <li>代理配置与订阅导入</li>
          <li>影视导航与工具网站</li>
          <li>常用浏览器工具集合</li>
        </ul>
      `
    },
    {
      id: "interface-concepts",
      title: "2025-4-9 接口概念",
      date: "2025-04-09",
      updated: "2025-04-12",
      category: "Java",
      tags: ["Java", "接口", "面向对象"],
      cover: ASSET_BASE + "202412181046717.png",
      coverTone: "red",
      reading: 7,
      heat: 88,
      summary: "接口定义、默认方法、静态方法、多态、内部类和匿名内部类的学习整理。",
      body: `
        <h2>接口的定义</h2>
        <p>当一个类中的所有方法都是抽象方法时，可以抽象为接口。接口更强调规则定义和程序扩展性。</p>
        <h2>默认方法和静态方法</h2>
        <p>JDK 8 之后接口允许定义 default 方法，用于接口升级时减少对子类实现的破坏。</p>
        <img src="${ASSET_BASE}202504091631852.png" alt="接口学习笔记">
        <h2>多态</h2>
        <p>多态的前提是继承或实现关系、方法重写，以及父类引用指向子类对象。</p>
      `
    },
    {
      id: "code-optimization",
      title: "2025-4-8 代码优化",
      date: "2025-04-08",
      updated: "2025-04-08",
      category: "代码质量",
      tags: ["代码优化", "Java"],
      cover: ASSET_BASE + "p1.png",
      coverTone: "violet",
      reading: 5,
      heat: 75,
      summary: "空指针规避、日期格式、业务字段变更和代码可读性问题。",
      body: `
        <h2>空指针风险</h2>
        <p><code>"1".equals(value)</code> 比 <code>value.equals("1")</code> 更安全，因为前者可以避免 value 为 null 时抛出异常。</p>
        <h2>代码可读性</h2>
        <p>业务字段增加时，需要看清楚前端从哪里取值，避免只改后端字段却漏掉页面或接口映射。</p>
      `
    },
    {
      id: "release-notes-2025",
      title: "2025.2-2025.4 上线需求问题",
      date: "2025-04-02",
      updated: "2025-04-02",
      category: "工作记录",
      tags: ["代码问题", "上线"],
      cover: ASSET_BASE + "202412191907536.jpg",
      coverTone: "gold",
      reading: 6,
      heat: 70,
      summary: "阶段性上线问题、询价单分发、静态对象和工作流处理记录。",
      body: `
        <h2>阶段记录</h2>
        <p>记录 2025 年 2 月到 4 月期间遇到的上线需求、业务处理和代码实现问题。</p>
        <p>博客后续会同步更多飞书里的学习内容，保留一份属于自己的长期记录。</p>
      `
    },
    {
      id: "code-issues",
      title: "代码问题",
      date: "2024-12-25",
      updated: "2024-12-25",
      category: "代码质量",
      tags: ["代码问题", "Java"],
      cover: ASSET_BASE + "202412191912600.jpg",
      coverTone: "blue",
      reading: 6,
      heat: 68,
      summary: "标签语句、流式请求、异常处理和代码片段积累。",
      body: `
        <h2>标签语句</h2>
        <p>标签可以标记循环位置，配合 <code>break label</code> 直接退出外层循环，适合处理复杂嵌套流程。</p>
        <h2>流式请求</h2>
        <p>通过输入输出流发送请求和接收 API 数据时，要注意资源关闭、异常捕获和编码处理。</p>
      `
    },
    {
      id: "picbed-record",
      title: "图床记录",
      date: "2024-12-19",
      updated: "2024-12-19",
      category: "图床",
      tags: ["图床"],
      cover: ASSET_BASE + "202412181046717.png",
      coverTone: "red",
      reading: 2,
      heat: 45,
      summary: "记录图床资源、图片上传和 CDN 访问方式。",
      body: `
        <h2>图床记录</h2>
        <p>当前图床仓库为 <code>His-Smile/pic_bed</code>，页面通过 jsDelivr CDN 访问图片资源。</p>
      `
    },
    {
      id: "picbed-build",
      title: "图床生成",
      date: "2024-12-18",
      updated: "2024-12-18",
      category: "图床",
      tags: ["图床", "GitHub Pages"],
      cover: ASSET_BASE + "202412191906130.jpg",
      coverTone: "cyan",
      reading: 5,
      heat: 61,
      summary: "GitHub 图床搭建、图片链接生成和语言学习规划。",
      body: `
        <h2>GitHub 图床</h2>
        <p>先在 GitHub 创建图片仓库，再通过 CDN 链接在博客中引用。优点是部署简单，适合个人博客长期使用。</p>
        <h2>学习规划</h2>
        <p>工作日晚上集中学习，周末安排更长时间做模拟、复盘和薄弱项突破。</p>
      `
    },
    {
      id: "recent-note-1",
      title: "最近记录1",
      date: "2024-12-17",
      updated: "2024-12-17",
      category: "工作记录",
      tags: ["日常", "代码问题"],
      cover: ASSET_BASE + "p1.png",
      coverTone: "violet",
      reading: 4,
      heat: 58,
      summary: "使用流请求 API、接收数据和日常代码片段。",
      body: `
        <h2>请求与响应</h2>
        <p>通过流请求 URL 并获取数据时，要先组装请求体，再处理响应流，最后统一关闭资源。</p>
      `
    },
    {
      id: "daily-issues",
      title: "日常问题",
      date: "2024-12-04",
      updated: "2024-12-04",
      category: "工作记录",
      tags: ["日常", "代码问题"],
      cover: ASSET_BASE + "202412191906825.jpg",
      coverTone: "blue",
      reading: 3,
      heat: 44,
      summary: "日常开发中遇到的问题集合，包含 API、流和业务处理。",
      body: `
        <h2>日常问题</h2>
        <p>这类文章用于快速记录工作中遇到的小问题，后续可以整理成更系统的专题。</p>
      `
    },
    {
      id: "first-blog-feeling",
      title: "第一篇博客有感",
      date: "2024-11-15",
      updated: "2024-11-15",
      category: "生活",
      tags: ["日常", "博客"],
      cover: ASSET_BASE + "202412191912600.jpg",
      coverTone: "gold",
      reading: 3,
      heat: 40,
      summary: "第一篇正式博客的想法，记录搭建博客后的状态。",
      body: `
        <h2>开始记录</h2>
        <p>博客的意义不是一次写完所有东西，而是把问题和成长过程持续留下来。</p>
      `
    },
    {
      id: "my-blog",
      title: "我的博客",
      date: "2024-11-07",
      updated: "2024-11-07",
      category: "博客",
      tags: ["博客", "GitHub Pages"],
      cover: ASSET_BASE + "202412181046717.png",
      coverTone: "red",
      reading: 3,
      heat: 37,
      summary: "博客初始化、主题选择和站点搭建记录。",
      body: `
        <h2>我的博客</h2>
        <p>这是 His-Smile 的起点：用 GitHub Pages 承载内容，用图床仓库存放图片。</p>
      `
    },
    {
      id: "hello-world",
      title: "Hello World",
      date: "2024-11-07",
      updated: "2024-11-07",
      category: "博客",
      tags: ["Hexo", "博客"],
      cover: ASSET_BASE + "202412191907536.jpg",
      coverTone: "cyan",
      reading: 2,
      heat: 30,
      summary: "Hexo 默认第一篇文章，记录站点生成、运行和部署命令。",
      body: `
        <h2>Quick Start</h2>
        <p>Hexo 的基本流程是创建文章、运行本地服务、生成静态文件并部署到远端。</p>
        <pre><code>hexo new "My New Post"
hexo server
hexo generate
hexo deploy</code></pre>
      `
    }
  ],
  photos: [
    { src: ASSET_BASE + "202412181632154.jpg", title: "首页背景", tag: "Hero" },
    { src: ASSET_BASE + "202412191906130.jpg", title: "图床素材 01", tag: "PicBed" },
    { src: ASSET_BASE + "202412191906825.jpg", title: "图床素材 02", tag: "PicBed" },
    { src: ASSET_BASE + "202412191907536.jpg", title: "图床素材 03", tag: "PicBed" },
    { src: ASSET_BASE + "202412191912600.jpg", title: "图床素材 04", tag: "PicBed" },
    { src: ASSET_BASE + "202505301030470.png", title: "学习截图", tag: "Study" },
    { src: ASSET_BASE + "202506061359212.png", title: "数据库笔记", tag: "Study" },
    { src: ASSET_BASE + "202504091641678.png", title: "接口概念", tag: "Java" },
    { src: ASSET_BASE + "202504102313011.png", title: "内部类笔记", tag: "Java" }
  ]
};
