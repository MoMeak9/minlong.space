import { defineUserConfig } from "vuepress"
import { searchProPlugin } from "vuepress-plugin-search-pro"
import { cut } from "nodejs-jieba"
import * as path from "path"
import theme from "./theme.js"

export default defineUserConfig({
  alias: {
    "@theme-hope/components/PageFooter": path.resolve(__dirname, "./components/PageFooter.vue"),
    "@Waterfall": path.resolve(__dirname, "./components/Waterfall.vue")
  },
  base: "/",
  lang: "zh-CN",
  title: "泯泷的空间",
  description: "前端小白的技术杂谈",
  head: [
    // 关键词
    ["meta", { name: "keywords", content: "前端博客, vuepress, Vue, React, JavaScript" }],
    ["meta", { charset: "utf-8" }],
    ["meta", { name: "viewport", content: "width=device-width, initial-scale=1.0" }],
    ["meta", { name: "author", content: "泯泷 Yihui" }],
    // 网站图标
    ["link", { rel: "icon", href: "/favicon.ico" }],
    // Open Graph (OG) 标签
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:url", content: "https://minlong.space/" }],
    ["meta", { property: "og:title", content: "minlong space" }],
    ["meta", { property: "og:description", content: "前端小白的技术博客" }],
    [
      "meta",
      { property: "og:image", content: "https://cdn.yihuiblog.top/images/logo-for-blog.jpg" }
    ]
  ],
  theme,

  // Enable it with pwa
  // shouldPrefetch: false,

  plugins: [
    searchProPlugin({
      // 索引全部内容
      indexContent: false,
      // 索引标题
      indexTitle: true,
      // 索引描述
      indexDesc: true,
      // 索引正文
      locales: {
        "/": {
          placeholder: "搜索"
        }
      },
      indexOptions: {
        // 使用 nodejs-jieba 进行分词
        tokenize: (text, fieldName) => (fieldName === "id" ? [text] : cut(text, true))
      },
      // 自定义搜索项目 https://vuepress-theme-hope.github.io/v2/search-pro/zh/config.html#customfields
      customFields: [
        {
          name: "category",
          // @ts-ignore
          getter: page => page.frontmatter.category,
          formatter: {
            "/": "分类: $content"
          }
        },
        {
          name: "tag",
          // @ts-ignore
          getter: page => page.frontmatter.tag,
          formatter: {
            "/": "标签: $content"
          }
        }
      ],
      hotKeys: [
        {
          key: "h",
          ctrl: true
        }
      ]
    })
  ]
})
