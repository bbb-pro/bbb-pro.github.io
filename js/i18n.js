(function () {
  'use strict';

  /* ===================== 双语词典 ===================== */
  var I18N = {
    zh: {
      'site.name': '包装&物流工具箱',
      'hero.badge': '免费 · 无需注册 · 纯前端',
      'hero.title': '把包装设计搬进浏览器',
      'hero.sub': '刀模设计 · 装柜计算 · 标签打印 · Markdown，四款在线工具打开即用',
      'hero.enter': '进入工具箱',
      'hero.news': '查看动态',
      'products.title': '产品矩阵',
      'details.title': '工具详解',
      'about.link': '了解本站与联系方式 →',
      'news.title': '最新动态',
      'news.more': '查看全部 →',
      'card.use': '立即使用 →',
      'search': '搜索',
      'search.placeholder': '搜索文章...',
      'post.back_home': '返回首页',
      'footer.framework': '框架',
      'footer.theme': '主题',
      'footer.custom': '热爱可抵岁月漫长',
      'label-editor.name': '标签编辑器',
      'label-editor.desc': '条码二维码 · 批量套打',
      'loader-master.name': '装柜大师',
      'loader-master.desc': '集装箱 3D 装载计算',
      'diecut.name': '刀模设计',
      'diecut.desc': '纸盒盒型展开设计',
      'lite_MD_editor.name': 'MD 编辑器',
      'lite_MD_editor.desc': '极简 Markdown · 离线可用'
    },
    en: {
      'site.name': 'Packaging & Logistics Toolbox',
      'hero.badge': 'Free · No Sign-up · Pure Frontend',
      'hero.title': 'Move Packaging Design into the Browser',
      'hero.sub': 'DieCut · Load Planning · Label Printing · Markdown — four online tools, ready to use',
      'hero.enter': 'Enter Toolbox',
      'hero.news': 'Latest Updates',
      'products.title': 'Products',
      'details.title': 'Tool details',
      'about.link': 'About this site & contact →',
      'news.title': 'Latest',
      'news.more': 'View All →',
      'card.use': 'Use Now →',
      'search': 'Search',
      'search.placeholder': 'Search articles...',
      'post.back_home': 'Back to Home',
      'footer.framework': 'Framework',
      'footer.theme': 'Theme',
      'footer.custom': 'Love outlasts the long years',
      'label-editor.name': 'Label Editor',
      'label-editor.desc': 'Barcodes & QR · Batch Printing',
      'loader-master.name': 'Loader Master',
      'loader-master.desc': 'Container 3D Load Planning',
      'diecut.name': 'DieCut Designer',
      'diecut.desc': 'Carton Box Layout Design',
      'lite_MD_editor.name': 'Lite MD Editor',
      'lite_MD_editor.desc': 'Minimal Markdown · Offline-ready'
    }
  };

  /* 菜单：中文 → 英文「单向」映射。
     早期版本用了双向映射，导致每次 apply() 都把菜单文本翻转一次，
     与多次触发的 apply() 叠加后出现「正文英文、菜单中文」的错乱。 */
  var MENU_EN = {
    '首页': 'Home',
    'MD编辑器': 'MD Editor',
    '刀模设计': 'DieCut Designer',
    '装柜大师': 'Loader Master',
    '在线标签': 'Label Editor',
    '关于': 'About'
  };

  var STORE = 'siteLang';
  var VERSION = '20261029';

  function getLang() { return localStorage.getItem(STORE) === 'en' ? 'en' : 'zh'; }
  function dict(lang) { return I18N[lang] || I18N.zh; }

  /* ---- 幂等基建：所有译文都从「原始值」推导，而不是在当前 DOM 文本上来回翻转 ---- */

  // 取并缓存元素原始文本（首次调用时记录，之后永远用同一个基准）
  function origText(el, attr) {
    var v = el.getAttribute(attr);
    if (v === null) {
      v = el.textContent;
      el.setAttribute(attr, v);
    }
    return v;
  }

  // 保留原文首尾空白（主题用空格分隔图标与文字，不能丢）
  function wrapSpace(orig, text) {
    var lead = (orig.match(/^\s*/) || [''])[0];
    var trail = (orig.match(/\s*$/) || [''])[0];
    return lead + text + trail;
  }

  function applyText(el, lang) {
    var key = el.getAttribute('data-i18n');
    var d = dict(lang);
    if (!key || d[key] == null) return;
    el.textContent = wrapSpace(origText(el, 'data-i18n-orig'), d[key]);
  }

  // 内联双语文本（用于文章标题等随数据变化的内容）
  // 中文原文优先写在 HTML 文本节点里（无 JS 爬虫也能读到），
  // data-i18n-raw 仅作为显式覆盖；data-i18n-raw-en 为英文版。
  function applyRaw(el, lang) {
    var rawEn = el.getAttribute('data-i18n-raw-en');
    var raw = el.getAttribute('data-i18n-raw');
    if (raw == null) {
      raw = el.getAttribute('data-i18n-raw-orig');
      if (raw === null) {
        raw = el.textContent;
        el.setAttribute('data-i18n-raw-orig', raw);
      }
    }
    el.textContent = (lang === 'en' && rawEn) ? rawEn : raw;
  }

  // 属性翻译：data-i18n-attr="title:some.key,placeholder:other.key"
  function applyAttr(el, lang) {
    var spec = el.getAttribute('data-i18n-attr');
    if (!spec) return;
    var d = dict(lang);
    var pairs = spec.split(',');
    for (var i = 0; i < pairs.length; i++) {
      var p = pairs[i].split(':');
      if (p.length < 2) continue;
      var name = p[0].trim();
      var key = p[1].trim();
      if (!name || d[key] == null) continue;
      el.setAttribute(name, d[key]);
    }
  }

  // 菜单：始终从缓存的中文原文出发，只做单向替换
  function applyMenu(lang) {
    var spans = document.querySelectorAll('.menus_item a.site-page > span, .menus_item span.site-page.group > span');
    for (var i = 0; i < spans.length; i++) {
      var el = spans[i];
      var base = el.getAttribute('data-i18n-base');
      if (base === null) {
        base = el.textContent.trim();
        el.setAttribute('data-i18n-base', base);
      }
      var label = (lang === 'en' && MENU_EN[base]) ? MENU_EN[base] : base;
      el.textContent = ' ' + label;
    }
  }

  /* ---- 标题本地化（幂等：只替换站名片段，替换后结果稳定） ---- */
  function localizeTitle(lang) {
    var zhN = I18N.zh['site.name'];
    var enN = I18N.en['site.name'];
    var target = I18N[lang]['site.name'];
    var t = document.title;
    if (t.indexOf(zhN) >= 0) t = t.split(zhN).join(target);
    else if (t.indexOf(enN) >= 0) t = t.split(enN).join(target);
    if (t !== document.title) document.title = t;
  }

  var titleObs = null;
  var titleObsEl = null;
  function watchTitle() {
    var titleEl = document.querySelector('title');
    if (!titleEl) return;
    if (titleObs && titleObsEl === titleEl) return;
    if (titleObs) titleObs.disconnect();
    titleObsEl = titleEl;
    titleObs = new MutationObserver(function () { localizeTitle(getLang()); });
    titleObs.observe(titleEl, { childList: true, characterData: true, subtree: true });
  }

  /* ---- 切换按钮（每次 apply 都校验存在，pjax 换 DOM 后自动重建并重新绑定事件） ---- */
  function ensureToggle() {
    var btn = document.getElementById('lang-toggle');
    if (btn) return btn;
    btn = document.createElement('button');
    btn.id = 'lang-toggle';
    btn.type = 'button';
    btn.addEventListener('click', toggle);
    var menus = document.getElementById('menus');
    var toggleMenu = document.getElementById('toggle-menu');
    if (menus && toggleMenu && toggleMenu.parentNode === menus) menus.insertBefore(btn, toggleMenu);
    else if (menus) menus.appendChild(btn);
    else document.body.appendChild(btn);
    return btn;
  }

  function updateToggle(lang) {
    var btn = ensureToggle();
    btn.textContent = lang === 'en' ? '中' : 'EN';
    btn.setAttribute('aria-label', lang === 'en' ? 'Switch to Chinese' : 'Switch to English');
    btn.setAttribute('title', lang === 'en' ? '切换到中文' : 'Switch to English');
  }

  /* ---- 主流程 ---- */
  function apply() {
    var lang = getLang();
    var nodes = document.querySelectorAll('[data-i18n],[data-i18n-raw],[data-i18n-attr]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.hasAttribute('data-i18n')) applyText(el, lang);
      if (el.hasAttribute('data-i18n-raw')) applyRaw(el, lang);
      if (el.hasAttribute('data-i18n-attr')) applyAttr(el, lang);
    }
    applyMenu(lang);
    localizeTitle(lang);
    updateToggle(lang);
    watchTitle();
    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'zh-CN');
  }

  function toggle() {
    localStorage.setItem(STORE, getLang() === 'en' ? 'zh' : 'en');
    apply();
  }

  function mount() {
    ensureToggle();
    apply();
  }

  // 合并同一帧内的多次调用，避免 pjax 事件连环触发时反复重排
  var rafId = 0;
  function schedule() {
    if (rafId) return;
    rafId = requestAnimationFrame(function () { rafId = 0; apply(); });
  }

  var css = '#lang-toggle{display:inline-flex;align-items:center;justify-content:center;min-width:44px;height:30px;padding:0 10px;margin-left:8px;background:transparent;border:1px solid var(--font-color,#222);border-radius:15px;cursor:pointer;color:var(--font-color,#222);font-size:.85em;font-weight:600;font-family:inherit;line-height:1;transition:color .2s,border-color .2s}#lang-toggle:hover{color:#49b1f5;border-color:#49b1f5}[data-theme=dark] #lang-toggle{color:var(--font-color,#cfd8e3);border-color:rgba(255,255,255,.25)}';
  var st = document.createElement('style');
  st.textContent = css;
  (document.head || document.documentElement).appendChild(st);

  if (window.__i18nReady) {
    // 脚本被重复加载时只补一次 apply，不重复绑定事件（否则一次点击会切换两次）
    window.__i18nApply();
  } else {
    window.__i18nReady = true;
    window.__i18nApply = apply;

    if (document.readyState !== 'loading') mount();
    else document.addEventListener('DOMContentLoaded', mount);

    // pjax 事件在 document 上冒泡即可，window 重复监听会造成多次 apply
    document.addEventListener('pjax:complete', schedule);
    document.addEventListener('pjax:end', schedule);
    window.addEventListener('load', schedule);
  }

  window.i18nToggle = toggle;
  window.i18nVersion = VERSION;
})();
