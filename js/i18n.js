(function () {
  'use strict';
  var I18N = {
    zh: {
      'site.name': '包装&物流工具箱',
      'hero.badge': '免费 · 无需注册 · 纯前端',
      'hero.title': '把包装设计搬进浏览器',
      'hero.sub': '刀模设计 · 装柜计算 · 标签打印 · Markdown，四款在线工具打开即用',
      'hero.enter': '进入工具箱',
      'hero.news': '查看动态',
      'products.title': '产品矩阵',
      'news.title': '最新动态',
      'news.more': '查看全部 →',
      'card.use': '立即使用 →',
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
      'news.title': 'Latest',
      'news.more': 'View All →',
      'card.use': 'Use Now →',
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
  var MENU_MAP = {
    '首页': 'Home', 'Home': '首页',
    'MD编辑器': 'MD Editor', 'MD Editor': 'MD编辑器',
    '刀模设计': 'DieCut Designer', 'DieCut Designer': '刀模设计',
    '装柜大师': 'Loader Master', 'Loader Master': '装柜大师',
    '在线标签': 'Label Editor', 'Label Editor': '在线标签'
  };
  var STORE = 'siteLang';
  function getLang() { return localStorage.getItem(STORE) === 'en' ? 'en' : 'zh'; }
  function apply() {
    var lang = getLang();
    var nodes = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < nodes.length; i++) {
      var k = nodes[i].getAttribute('data-i18n');
      if (I18N[lang][k] != null) nodes[i].textContent = I18N[lang][k];
    }
    var spans = document.querySelectorAll('.menus_item a.site-page > span, .menus_item span.site-page.group > span');
    for (var j = 0; j < spans.length; j++) {
      var t = spans[j].textContent.trim();
      if (MENU_MAP[t]) spans[j].textContent = MENU_MAP[t];
    }
    var btn = document.getElementById('lang-toggle');
    if (btn) btn.textContent = lang === 'en' ? '中' : 'EN';
    document.documentElement.setAttribute('data-lang', lang);
  }
  function toggle() {
    localStorage.setItem(STORE, getLang() === 'en' ? 'zh' : 'en');
    apply();
  }
  function mount() {
    if (document.getElementById('lang-toggle')) { apply(); return; }
    var btn = document.createElement('button');
    btn.id = 'lang-toggle';
    btn.type = 'button';
    btn.textContent = getLang() === 'en' ? '中' : 'EN';
    btn.setAttribute('aria-label', 'Switch language');
    btn.addEventListener('click', toggle);
    var menus = document.getElementById('menus');
    var toggleMenu = document.getElementById('toggle-menu');
    if (menus && toggleMenu && toggleMenu.parentNode === menus) menus.insertBefore(btn, toggleMenu);
    else if (menus) menus.appendChild(btn);
    else document.body.appendChild(btn);
    apply();
  }
  var css = '#lang-toggle{display:inline-flex;align-items:center;padding:6px 12px;margin-left:6px;background:none;border:none;cursor:pointer;color:var(--font-color,#222);font-size:.92em;font-weight:600;font-family:inherit;line-height:1;transition:color .2s}#lang-toggle:hover{color:#49b1f5}[data-theme=dark] #lang-toggle{color:var(--font-color,#cfd8e3)}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);
  if (document.readyState !== 'loading') mount();
  else document.addEventListener('DOMContentLoaded', mount);
  window.addEventListener('load', apply);
  window.addEventListener('pjax:complete', apply);
  document.addEventListener('pjax:complete', apply);
})();
