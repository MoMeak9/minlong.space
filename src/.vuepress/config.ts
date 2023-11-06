import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "泯泷的个人技术空间",
  description: "前端小白的技术杂谈",
  head: [
    // 关键词
    ['meta', {name: 'keywords', content: '前端博客, vuepress, Vue, React, JavaScript'}],
    ['meta', {charset: 'utf-8'}],
    ['meta', {name: 'viewport', content: 'width=device-width, initial-scale=1.0'}],
    ['meta', {name: 'author', content: '泯泷 Yihui'}],
    // 网站图标
    ['link', {rel: 'icon', href: '/favicon.ico'}],
    // Open Graph (OG) 标签
    ['meta', {property: 'og:type', content: 'website'}],
    ['meta', {property: 'og:url', content: 'https://yihuiblog.top/'}],
    ['meta', {property: 'og:title', content: 'Yihui\'s Blog'}],
    ['meta', {property: 'og:description', content: '前端小白的技术博客'}],
    ['meta', {property: 'og:image', content: 'https://cdn.yihuiblog.top/images/logo-for-blog.jpg'}],
  ],
  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
