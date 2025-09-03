
# Tiptap 深度教程（二）：构建你的第一个编辑器 - 集成指南
## 🚀 第一步：项目环境搭建

### 前置条件检查

在开始之前，请确保您的开发环境满足以下要求：

- **Node.js 版本**：16.x 或更高版本
- **包管理器**：npm 7.x+ 或 yarn 1.22.x+
- **React 项目**：通过 Create React App、Vite 或 Next.js 创建的项目均可

> 💡 **推荐使用 Vite**  
> 相比 Create React App，Vite 提供更快的开发体验和更小的构建包。如果您还没有项目，可以通过 `npm create vite@latest my-tiptap-app -- --template react` 快速创建。

### 核心依赖包安装

进入您的项目根目录，执行以下命令安装 Tiptap 的核心依赖：

```bash
# 使用 npm
npm install @tiptap/react @tiptap/starter-kit

# 使用 yarn  
yarn add @tiptap/react @tiptap/starter-kit

# 使用 pnpm（推荐）
pnpm add @tiptap/react @tiptap/starter-kit
```

### 依赖包详解

让我们了解一下刚才安装的两个核心包的作用：

| 包名 | 作用 | 包含内容 |
|------|------|----------|
| `@tiptap/react` | React 框架集成层 | `useEditor`、`EditorContent`、`EditorProvider` 等核心 Hook 和组件 |
| `@tiptap/starter-kit` | 官方精选扩展集合 | 段落、标题、粗体、斜体、列表、链接等 15+ 常用扩展 |

> 🔍 **StarterKit 包含的扩展一览**  
> - **文本格式**：Bold、Italic、Strike、Code  
> - **段落结构**：Paragraph、Heading、Blockquote  
> - **列表功能**：BulletList、OrderedList、ListItem  
> - **其他功能**：HardBreak、HorizontalRule、History（撤销重做）等

### 可选：安装类型声明（TypeScript 项目）

如果您使用 TypeScript，建议同时安装类型声明文件：

```bash
npm install --save-dev @types/prosemirror-view @types/prosemirror-state
```https://www.google.com/search?q=...) 中，我们深入探讨了 Tiptap 的三大核心设计哲学：基于 ProseMirror 的坚实基础、赋予开发者完全自由的"无头"理念，以及"万物皆扩展"的模块化架构。

理论学习固然重要，但实践出真知。从本章开始，我们将正式踏入实战阶段，通过构建一个完整的富文本编辑器来掌握 Tiptap 的精髓。

## 📋 本章学习目标

完成本章学习后，您将能够：

✅ **环境搭建**：在 React 项目中正确安装和配置 Tiptap  
✅ **快速上手**：使用 `StarterKit` 构建功能完备的基础编辑器  
✅ **UI 定制**：实践"无头"理念，打造个性化工具栏界面  
✅ **性能调优**：掌握核心优化技巧，避免组件重渲染陷阱  
✅ **跨框架应用**：了解在 Vue、Svelte 中的应用要点

> 💡 **适用范围说明**  
> 本文以 React 为主要演示框架，但核心概念（扩展配置、命令链、事件处理）在 Vue、Svelte 等框架中完全通用。文末会提供其他框架的实现要点。)：你的第一个编辑器：集成与性能优化

在 [上一篇文章](https://www.google.com/search?q=...) 中，我们深入探讨了 Tiptap 的三大核心设计哲学：基于 ProseMirror 的坚实基础、赋予开发者完全自由的“无头”理念，以及“万物皆扩展”的模块化架构。

现在，是时候从理论走向实践了。本章将手把手带您完成以下任务：

- 在前端项目（以 React 为例）中安装和集成 Tiptap。
    
- 使用强大的 `StarterKit` 快速构建一个功能齐全的基础编辑器。
    
- 实践“无头”理念，为编辑器添加自定义的工具栏 UI。
    
- 学习关键的性能优化技巧，避免不必要的组件重渲染，确保流畅的用户体验。
    

虽然本文主要使用 React 进行演示，但其核心概念（扩展配置、命令链）对于 Vue 和 Svelte 用户同样适用，我们会在文末进行说明。

## 第一步：项目设置与安装

首先，确保您有一个正在运行的 React 项目（通过 Vite 或 Create React App 创建的均可）。然后，在您的项目目录中，安装 Tiptap 的核心依赖包：

Bash

```
# 使用 npm
npm install @tiptap/react @tiptap/starter-kit

# 使用 yarn
yarn add @tiptap/react @tiptap/starter-kit
```

我们安装了两个核心包：

- `@tiptap/react`: 提供了在 React 中使用 Tiptap 所需的所有钩子 (Hooks) 和组件。
    
- `@tiptap/starter-kit`: 这是一个“全家桶”扩展包，由官方精选和配置，包含了绝大多数富文本编辑器的基础功能（段落、标题、粗体、斜体、列表等）。使用它可以极大地简化初始配置。
    

## 第二步：构建基础编辑器组件

安装完成后，让我们来创建第一个编辑器组件。新建一个文件 `TiptapEditor.jsx`。

在 React 中，我们主要使用 `useEditor` 这个钩子来初始化和管理编辑器的实例。它接收一个配置对象，用于定义编辑器的所有行为。

JavaScript

```
// src/TiptapEditor.jsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const TiptapEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: `
      <h2>
        欢迎来到 Tiptap 深度教程
      </h2>
      <p>
        这是你的第一个 Tiptap 编辑器。你可以直接在这里<b>编辑</b>文字。
      </p>
    `,
  });

  return (
    <EditorContent editor={editor} />
  );
};

export default TiptapEditor;
```

让我们分解一下代码：

1. **`useEditor`**: 这是 Tiptap 的核心钩子。我们向它传入一个对象进行配置。
    
2. **`extensions`**: 这个数组正是“万物皆扩展”理念的体现。我们在这里告诉 Tiptap 要启用哪些功能。目前，我们只使用了 `StarterKit`。
    
3. **`content`**: 这里可以定义编辑器的初始内容，支持 HTML 字符串。
    
4. **`EditorContent`**: 这是 Tiptap 提供的组件，它负责在页面上实际渲染出可供用户编辑的区域。
    

现在，在你的 `App.jsx` 中引入并使用它：

JavaScript

```
// src/App.jsx
import TiptapEditor from './TiptapEditor';
import './styles.css'; // 引入一些基本样式

function App() {
  return (
    <div className="App">
      <h1>Tiptap 编辑器</h1>
      <TiptapEditor />
    </div>
  );
}

export default App;
```

为了让编辑器看起来更像一个编辑器，添加一些基础的 CSS 样式到 `styles.css` 中：

CSS

```
/* styles.css */
.tiptap {
  border: 1px solid #ccc;
  padding: 1rem;
  min-height: 200px;
}

.tiptap:focus {
  outline: 2px solid #0D99FF;
}
```

> Tiptap 会自动为 `EditorContent` 组件渲染的 DOM 元素添加 `.tiptap` 类名。

现在启动您的应用，您应该能看到一个可以正常输入和编辑的基础编辑器了！

## 第三步：添加简单的 UI - 工具栏

拥有一个能打字的框还不够，我们需要一个工具栏来控制文本样式。这正是实践“无头”理念的最佳时机。Tiptap 不提供工具栏，但它提供了所有必要的工具让我们自己来构建。

让我们创建一个 `MenuBar` 组件。

JavaScript

```
// src/MenuBar.jsx
import React from 'react';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="menu-bar">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        Italic
      </button>
       <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        H1
      </button>
       {/* 添加更多按钮... */}
    </div>
  );
};

export default MenuBar;
```

这里有两个关键的 `editor` API 调用：

- **`editor.chain()...run()`**: 这是 Tiptap 的“命令链”。它允许我们将多个操作链接在一起（如 `focus()`），最后通过 `.run()` 执行。`toggleBold()`、`toggleItalic()` 等都是由 `StarterKit` 提供的命令。
    
- **`editor.isActive('...')`**: 这个方法用于检测当前光标或选区是否处于某种激活状态。我们用它来给工具栏按钮添加一个 `is-active` 类，从而实现选中加粗文本时，“Bold”按钮高亮的效果。
    

现在，将 `MenuBar` 集成到我们的 `TiptapEditor` 组件中：

JavaScript

```
// src/TiptapEditor.jsx
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MenuBar from './MenuBar'; // 引入 MenuBar

const TiptapEditor = () => {
  const editor = useEditor({
    // ...配置不变
  });

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TiptapEditor;
```

再添加一点样式：

CSS

```
/* styles.css */
.menu-bar {
  margin-bottom: 1rem;
}

.menu-bar button {
  margin-right: 0.25rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  background-color: white;
}

.menu-bar button.is-active {
  background-color: #0D99FF;
  color: white;
}
```

刷新页面，您现在拥有一个带交互式工具栏的编辑器了！这充分展示了“无头”的威力：Tiptap 负责逻辑，而我们 100% 控制 UI 的外观和行为。

## 第四步：性能优化 - 避免不必要的重渲染

我们的编辑器看起来不错，但它存在一个常见的性能陷阱。

`useEditor` 钩子所处的组件（在我们的例子中是 `TiptapEditor`）会在**每一次**编辑器状态变更时（例如，每一次按键、每一次光标移动）都进行重渲染。这意味着 `MenuBar` 组件也会在每次按键时都跟着重渲染，这对于一个静态的工具栏来说是极大的浪费。

Tiptap 提供了更优雅的解决方案来解耦 UI 和核心状态：`EditorProvider` 和 `useCurrentEditor`。

让我们来重构代码：

1. **修改 `TiptapEditor.jsx`**
    

我们将 `useEditor` 拆分出来，使用 `EditorProvider` 来包裹我们的组件。

JavaScript

```
// src/TiptapEditor.jsx
import { EditorProvider, useCurrentEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

// 1. 将 MenuBar 移动到这里，并使用 useCurrentEditor
const MenuBar = () => {
  const { editor } = useCurrentEditor(); // <-- 使用 useCurrentEditor

  if (!editor) {
    return null;
  }
  // ... MenuBar 的 JSX 代码和之前完全一样
  return (
     <div className="menu-bar">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        Bold
      </button>
      {/* ... 其他按钮 */}
     </div>
  );
};

// 2. TiptapEditor 组件现在是 Provider
const TiptapEditor = () => {
  const extensions = [StarterKit];
  const content = `<p>Hello World!</p>`;

  return (
    // 使用 EditorProvider 包裹所有子组件
    <EditorProvider extensions={extensions} content={content} slotBefore={<MenuBar />}>
      {/* 这里可以留空，或放其他子组件 */}
    </EditorProvider>
  );
};

export default TiptapEditor;
```

> `EditorProvider` 会自动渲染 `EditorContent`，并通过 `slotBefore` 或 `slotAfter` 属性让你方便地插入像菜单栏这样的组件。

**发生了什么变化？**

- `EditorProvider` 现在负责创建和持有 `editor` 实例。
    
- `MenuBar` 组件现在通过 `useCurrentEditor()` 钩子来获取 `editor` 实例。
    
- **关键点**：`useCurrentEditor` **不会**在编辑器状态变更时触发组件的重渲染。它仅仅是获取当前编辑器实例的引用，非常适合用于执行命令和检查状态的 UI 组件。
    

通过这种重构，当您在编辑器中疯狂打字时，只有 `EditorContent` 区域在更新，而 `MenuBar` 组件则保持静默，从而大大提升了应用的性能。

## 给 Vue 和 Svelte 用户的提示

- **Vue 3**: 生态同样非常成熟。您会使用 `@tiptap/vue-3` 包，其 `useEditor` 钩子在组合式 API (Composition API) 中的工作方式与 React 非常相似。`EditorContent` 组件和 `v-model` 也能很好地配合工作。
    
- **Svelte**: 您将直接使用 `@tiptap/core`。通常会在 `onMount` 生命周期钩子中创建 `new Editor(...)` 实例，并将其挂载到一个 DOM 元素上，最后在 `onDestroy` 中销毁它。
    

无论使用何种框架，Tiptap 的核心配置 (`extensions` 数组) 和命令 API (`editor.chain()`) 都是完全一致的。

## 总结与展望

恭喜！您已经成功地从零开始，构建了一个功能基本完备且经过性能优化的 Tiptap 编辑器。您亲身体会了“无头”理念如何赋予您自由，也学会了如何通过 Tiptap 提供的现代 API 来避免性能陷阱。

在本章中，我们仅仅使用了 `StarterKit` 这一个扩展包。然而，Tiptap 的真正威力在于其丰富且独立的扩展生态。

在下一篇文章**《Tiptap 深度教程 (三)：扩展的力量：分类详解与实战》**中，我们将深入探索 `StarterKit` 之外的广阔世界，学习如何集成和使用链接、图片、占位符、代码高亮等更多强大的官方扩展。