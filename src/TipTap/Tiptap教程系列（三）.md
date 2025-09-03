# Tiptap 深度教程（三）：掌握内容 - 核心扩展全面指南

## 前言回顾

在 [第二章](https://www.google.com/search?q=...) 中，我们成功使用 `StarterKit` 快速搭建了一个功能完备且经过性能优化的富文本编辑器。`StarterKit` 确实是一个极佳的起点，它为我们提供了开箱即用的基础功能。

然而，Tiptap 的真正威力在于其精细的模块化设计和"按需引入"的架构哲学。就像搭建乐高积木一样，你可以精确选择需要的功能模块，避免不必要的代码冗余。

## 为什么要学习独立扩展？

在实际项目开发中，你可能会遇到以下场景：

- **性能优化需求**：项目对包体积有严格要求，需要去除不必要的功能
- **功能定制需求**：需要更精细地控制每个功能的具体行为
- **扩展功能需求**：需要添加 `StarterKit` 中没有包含的高级功能
- **品牌定制需求**：需要深度定制编辑器的外观和交互方式

当遇到这些情况时，深入了解 Tiptap 丰富的独立扩展生态系统就变得至关重要。

## 本章学习目标

通过本章的学习，你将掌握：

- **扩展管理技能**：独立查找、安装和配置 Tiptap 的核心扩展
- **富内容集成**：为编辑器添加链接、图片、语法高亮代码块等多媒体内容
- **用户体验优化**：通过占位符、@提及等交互功能，显著提升编辑器的易用性
- **模块化思维**：培养按需选择功能模块的架构思维教程 (三)：掌握内容：核心扩展全面指南

在 [第二章](https://www.google.com/search?q=...) 中，我们成功地使用 `StarterKit` 快速搭建了一个功能完备且经过性能优化的编辑器。`StarterKit` 是一个极佳的起点，但 Tiptap 的真正威力在于其细粒度的模块化和“按需取用”的哲学。

当您需要更精细地控制功能、优化最终打包体积，或是添加 `StarterKit` 未包含的高级功能时，就需要深入了解 Tiptap 丰富独立的扩展生态系统了。

本章的目标就是带领您超越 `StarterKit`，学习如何：

  * 独立地查找、安装和配置 Tiptap 的核心扩展。
  * 为编辑器添加链接、图片、语法高亮代码块等富内容。
  * 通过占位符、@提及等功能，提升编辑器的用户体验。

## 超越 StarterKit：按需取用的艺术

`StarterKit` 本质上是一个预设的扩展集合。如果我们想完全控制编辑器的功能，第一步就是“解构”它，用一个显式的扩展列表来代替。

一个不使用 `StarterKit` 的基础配置可能像这样：

```jsx
import { useEditor } from '@tiptap/react';

// 核心功能扩展
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import History from '@tiptap/extension-history';

// 常用格式化扩展
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Heading from '@tiptap/extension-heading';
// ...以及其他来自 StarterKit 的扩展

const editor = useEditor({
  extensions: [
    // 基础扩展是必需的
    Document,
    Paragraph,
    Text,
    History,
    // 按需添加功能
    Bold,
    Italic,
    Heading.configure({
      levels: [1, 2, 3], // 只保留 H1, H2, H3
    }),
  ],
  // ...
});
```

这种方式的好处是：

1.  **控制权**：您可以精确地配置每一个扩展。比如上面的 `Heading`，我们通过 `.configure()` 方法，只保留了 1 到 3 级标题。
2.  **性能**：如果您的应用不需要引用 (`Blockquote`) 或水平分割线 (`HorizontalRule`)，那就不必引入它们的扩展包，最终的 JavaScript 打包体积会更小。

理解了这种模式后，添加任何新功能都变得非常简单：找到它、安装它、将它添加到 `extensions` 数组中。

## 核心扩展分类详解

接下来，我们将从 Tiptap 官方的扩展库中挑选几个最具代表性的例子，分类进行详细讲解。

### 1\. 交互式标记 (Interactive Marks)

这类扩展为内联文本添加交互能力。

**代表：`@tiptap/extension-link`**

这个扩展不仅能将文本标记为链接，还能自动识别 URL 并提供丰富的配置。

  * **安装**:

    ```bash
    npm install @tiptap/extension-link
    ```

  * **配置与使用**:

    ```jsx
    import Link from '@tiptap/extension-link';

    const editor = useEditor({
      extensions: [
        // ...其他扩展
        Link.configure({
          openOnClick: true,      // 点击时在新标签页中打开链接
          autolink: true,         // 自动将 URL 字符串转换为链接
          linkOnPaste: true,      // 粘贴时自动转换链接
        }),
      ],
    });
    ```

  * **UI 集成**:
    您需要一个按钮来让用户主动添加或移除链接。通常这需要一个弹窗来输入 URL。

    ```jsx
    // 在你的 MenuBar 组件中
    import { useCallback } from 'react';

    const addLink = useCallback(() => {
      const previousUrl = editor.getAttributes('link').href;
      const url = window.prompt('URL', previousUrl); // 使用 prompt 简化演示

      if (url === null) return; // 用户取消
      if (url === '') { // 用户输入空字符串，则取消链接
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
        return;
      }

      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    // ...
    <button onClick={addLink} className={editor.isActive('link') ? 'is-active' : ''}>
      Add Link
    </button>
    ```

### 2\. 富内容节点 (Rich Content Nodes)

这类扩展允许您在编辑器中插入更复杂的块级内容。

**代表一：`@tiptap/extension-image`**

允许在文档中插入图片。

  * **安装**:

    ```bash
    npm install @tiptap/extension-image
    ```

  * **配置与使用**:
    它通常不需要特殊配置，直接添加到 `extensions` 数组即可。关键在于如何通过 UI 添加图片。

    ```jsx
    // 在你的 MenuBar 组件中
    const addImage = useCallback(() => {
        const url = window.prompt('Enter image URL');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    // ...
    <button onClick={addImage}>Add Image</button>
    ```

**代表二：`@tiptap/extension-code-block-lowlight` (带语法高亮)**

这是一个更高级的例子，展示了 Tiptap 如何与第三方库集成。它使用 [`lowlight`](https://www.google.com/search?q=%5Bhttps://github.com/lowlight/lowlight%5D\(https://github.com/lowlight/lowlight\)) 来实现代码的语法高亮。

  * **安装**:

    ```bash
    npm install @tiptap/extension-code-block-lowlight lowlight
    ```

  * **配置与使用**:
    您需要导入 `lowlight` 实例和您希望支持的语言。

    ```jsx
    import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
    import { lowlight } from 'lowlight/lib/core';
    import javascript from 'highlight.js/lib/languages/javascript';
    import css from 'highlight.js/lib/languages/css';
    // 别忘了引入高亮主题 CSS 文件
    import 'highlight.js/styles/tokyo-night-dark.css';

    // 注册语言
    lowlight.registerLanguage('javascript', javascript);
    lowlight.registerLanguage('css', css);

    const editor = useEditor({
      extensions: [
        // ...其他扩展
        CodeBlockLowlight.configure({
          lowlight,
        }),
      ],
    });
    ```

  * **UI 集成**:

    ```jsx
    // 在你的 MenuBar 组件中
    <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'is-active' : ''}
    >
        Code Block
    </button>
    ```

### 3\. UI 与 UX 增强 (UI & UX Enhancements)

这类扩展专注于改善用户的编辑体验。

**代表：`@tiptap/extension-placeholder`**

当编辑器内容为空时，显示一段占位提示文字。

  * **安装**:

    ```bash
    npm install @tiptap/extension-placeholder
    ```

  * **配置与使用**:
    配置非常直观，通过 CSS 伪元素 `::before` 实现。

    ```jsx
    import Placeholder from '@tiptap/extension-placeholder';

    const editor = useEditor({
      extensions: [
        // ...其他扩展
        Placeholder.configure({
          placeholder: '在这里写下你的奇思妙想…',
        }),
      ],
    });
    ```

    您还需要添加一些 CSS 来让它显示出来：

    ```css
    .tiptap p.is-editor-empty:first-child::before {
      content: attr(data-placeholder);
      float: left;
      color: #adb5bd;
      pointer-events: none;
      height: 0;
    }
    ```

### 4\. 动态与协作功能 (Dynamic & Collaborative Features)

**代表：`@tiptap/extension-mention`**

这是构建类似 Twitter 或 GitHub 的 `@` 用户提及功能的基石。它基于一个更底层的 `suggestion` 工具。

  * **安装**:

    ```bash
    npm install @tiptap/extension-mention
    ```

  * **配置与使用**:
    `Mention` 的配置相对复杂，因为它需要您提供一个建议列表的渲染逻辑。这是一个简化的示例：

    ```jsx
    import Mention from '@tiptap/extension-mention';
    import suggestion from './suggestion'; // 这是一个你需要自己实现的工具函数

    // suggestion.js (简化的建议逻辑)
    // 实际项目中，这里会从 API 获取用户列表并渲染一个下拉菜单
    export default {
        items: ({ query }) => {
            return [
                'Leia', 'Luke', 'Darth', 'Anakin', 'Obi-Wan'
            ].filter(item => item.toLowerCase().startsWith(query.toLowerCase())).slice(0, 5);
        },
        render: () => {
           // ...这里需要返回一个包含渲染建议列表逻辑的 JS 对象
           // 详细实现请参考官方文档，通常会配合一个小型的前端组件
           return {
               onStart: props => { console.log('Suggestion started'); },
               onUpdate: props => { console.log('Suggestion updated'); },
               // ...
           }
        }
    }


    const editor = useEditor({
        extensions: [
            // ...其他扩展
            Mention.configure({
                HTMLAttributes: {
                    class: 'mention',
                },
                suggestion: suggestion,
            }),
        ],
    });
    ```

    `Mention` 扩展完美体现了 Tiptap 的高阶用法，它提供了一个强大的钩子 (`suggestion`)，让开发者可以将复杂的外部数据和 UI（如从服务器获取用户列表并渲染下拉菜单）无缝集成到编辑器体验中。

## 如何寻找更多扩展

探索 Tiptap 功能的最佳途径就是访问其**官方文档的 [Extensions](https://tiptap.dev/docs/editor/extensions) 页面**。那里有所有官方扩展的完整列表、API 文档和使用示例。

## 总结与展望

在本章中，我们真正释放了 Tiptap 模块化架构的威力。通过按需挑选、安装和配置独立的扩展，我们为编辑器添加了链接、图片、语法高亮和占位符等丰富功能，并初窥了 `@mention` 这类动态功能的实现方式。

您现在已经具备了根据任何产品需求，定制化组合 Tiptap 功能的能力。但如果官方扩展依然无法满足您的特殊需求呢？

这正是我们下一章要探讨的主题。在\*\*《Tiptap 深度教程 (四)：终极定制：从零创建你的专属扩展》\*\*中，我们将进入 Tiptap 的“深水区”，学习如何从头开始，创建属于您自己的、独一无二的 Node 和 Mark 扩展。