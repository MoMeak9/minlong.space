import { navbar } from "vuepress-theme-hope"

export default navbar([
  {
    link: "/",
    text: "首页",
    icon: "alias"
  },
  {
    link: "/category/前端",
    text: "分类",
    icon: "categoryselected",
    activeMatch: "^/category/"
  }
])
