
## 引言

欢迎来到《Tiptap 深度教程》系列的第四篇，也是最具深度的一章。在前几篇教程中，我们探索了如何利用 Tiptap 强大的开箱即用功能和丰富的扩展生态来快速构建编辑器。然而，Tiptap 的真正威力并不仅限于此，它最核心的优势在于其近乎无限的可扩展性 1。当标准功能无法满足您独特的产品需求时，您需要的能力，是创造。

本篇教程将是一次深入 Tiptap 核心的旅程。我们将不再仅仅是 Tiptap 功能的“消费者”，而是成为其功能的“创造者”。我们将一起揭开 Tiptap 扩展系统背后的神秘面纱，赋予您从零开始构建任何可以想象到的编辑器功能的能力。

在这趟旅程中，我们将遵循一条从理论到实践，从基础到专家的学习路径：

- **探究底层原理**：我们将深入剖析 Tiptap 与其底层引擎 ProseMirror 之间的关系，为您建立坚实的理论基础。
    
- **实践创造**：我们将逐行代码，从无到有地创建一个自定义的 `Node`（节点）和一个自定义的 `Mark`（标记），让您亲手体验扩展开发的全过程。
    
- **掌握高级 API**：我们将学习如何通过命令（Commands）、输入规则（Input Rules）和状态管理（Storage）等高级 API，为您的扩展注入强大的交互能力和智能化行为。
    
- **构建终极案例**：最后，我们会将所学知识融会贯-通，构建一个生产级别的、完全交互式的 `@mention`（提及）扩展，以此来巩固和展示您新掌握的终极定制技能。
    

准备好迎接挑战，开启您的 Tiptap 大师之路。

## 第一节：Tiptap 扩展的解剖学：超越基础

在动手编写代码之前，我们必须建立一个清晰且准确的心智模型。理解 Tiptap 扩展的本质、其与底层引擎 ProseMirror 的关系，以及不同类型扩展的职责划分，是进行高级定制的前提。

### ProseMirror 的连接：Tiptap 的引擎室

要真正理解 Tiptap，就必须认识到它是一个“无头（headless）”的编辑器框架，它本身并不提供用户界面，而是专注于编辑器逻辑 2。其强大的功能构建在一个名为 ProseMirror 的工具集之上 4。您可以将 ProseMirror 想象成一个高性能的汽车引擎，而 Tiptap 则是围绕这个引擎精心设计的底盘、传动系统和一套对开发者更友好的驾驶舱（API）。

Tiptap 巧妙地封装了 ProseMirror 的复杂性，提供了更易于理解和使用的 API。然而，当我们需要进行深度定制时，仅仅了解 Tiptap 的 API 是不够的。我们必须深入引擎室，理解 ProseMirror 的核心概念，例如：

- **Schema（模式）**：这是文档的“语法规则”，定义了哪些类型的内容（节点和标记）是合法的，以及它们之间如何嵌套 6。创建自定义
    
    `Node` 或 `Mark` 的本质，就是在修改这个 Schema。
    
- **State（状态）**：一个不可变的（immutable）对象，包含了编辑器的所有信息，包括文档内容、当前选区、激活的标记等 7。编辑器的每一次变更都会产生一个新的 State。
    
- **Plugins（插件）**：它们是 ProseMirror 的“事件监听器”和“行为干预器”，可以观察并响应编辑器的各种变化，实现如协同编辑、输入快捷方式等复杂功能 8。
    

Tiptap 的设计哲学可以看作是一种“渐进式披露”。对于常规需求，您只需使用 Tiptap 的高层 API。但当您需要极致的控制力时，Tiptap 会为您打开通往底层 ProseMirror 的大门。本教程也将遵循这一哲学，从 Tiptap 的便捷 API 开始，逐步深入到更强大的 ProseMirror 概念中。

### Node、Mark 和 Extension：职责明确的三驾马车

Tiptap 的一切皆为扩展，但根据其核心职责，我们可以将其分为三种基本类型 10。理解它们的区别至关重要，因为它决定了您在实现特定功能时应该选择哪种类型的扩展。

- **Nodes（节点）**：它们是构成文档结构的“积木” 11。想象一下，一篇文章由标题、段落、图片、代码块等组成，这些都是节点。节点可以是块级元素（
    
    `block`），如段落（`Paragraph`）；也可以是行内元素（`inline`），如表情符号（`Emoji`）或图片（`Image`）12。它们是文档内容的承载者。
    
- **Marks（标记）**：它们用于为节点内的文本添加“行内样式”或“元数据”，而不会改变文档的结构 14。例如，将一段文字加粗（
    
    `Bold`）、设置为斜体（`Italic`）或添加超链接（`Link`），这些都是通过 Mark 实现的 13。Mark 就像是给文字涂上的高光，它依附于文字，但文字本身依然在段落（Node）中。
    
- **Generic Extensions（通用扩展）**：这类扩展不直接向文档的 Schema 中添加新的内容类型。它们的职责是增强编辑器的功能或行为 10。例如，
    
    `TextAlign` 扩展通过添加命令和属性来控制文本对齐，但它并没有创造一个新的“居中段落”节点 10。其他例子还包括监听编辑器更新事件（
    
    `onUpdate`）、添加全局键盘快捷键或集成复杂的 ProseMirror 插件。
    

为了更清晰地理解这三者的区别，下表提供了一个快速参考：

|类型 (Type)|主要目的 (Primary Purpose)|对 Schema 的影响 (Impact on Schema)|常见示例 (Common Examples)|
|---|---|---|---|
|`Node`|定义文档的结构性内容块。|**修改 Schema**，添加新的内容类型。|`Paragraph`, `Heading`, `Image`, `CodeBlock`|
|`Mark`|为文本添加行内格式或元数据。|**修改 Schema**，添加新的格式类型。|`Bold`, `Italic`, `Link`, `Highlight`|
|`Extension`|增强编辑器功能、行为和交互。|**不修改 Schema**。|`History` (undo/redo), `Placeholder`, `CharacterCount`|

这个表格清晰地揭示了一个核心原则：**Schema 为王**。当您需要定义一种新的内容类型时，您必须选择 `Node` 或 `Mark`。当您只需要添加行为逻辑时，`Extension` 则是正确的选择。这个看似简单的区分，是构建健壮、可维护的自定义扩展的基石。

### 扩展 API：核心 Schema 定义

无论是创建哪种类型的扩展，我们都将从 Tiptap 提供的 `create` 方法开始，例如 `Node.create({})` 或 `Mark.create({})` 4。在这个核心对象中，有几个属性是定义 Schema 的关键：

- **`name`**: 扩展的唯一标识符，必须是字符串。这个名字至关重要，后续的命令调用、状态存储访问都将依赖它 11。
    
- **`group`**: 定义了该节点所属的类别，例如 `'block'` 或 `'inline'` 8。这个属性直接影响到 ProseMirror 的内容表达式如何解析该节点，决定了它能出现在文档的什么位置 6。
    
- **`content`**: 仅用于 `Node` 类型，这是一个“内容表达式”字符串，定义了该节点可以包含哪些子节点。例如，`'inline*'` 表示可以包含零个或多个行内节点，而 `'paragraph+'` 表示必须包含至少一个段落节点 5。这是 ProseMirror Schema 规则的直接体现，也是保证文档结构合法性的关键 19。
    
- **`parseHTML`**: 定义了如何将一段 HTML 代码解析成当前扩展所代表的节点或标记。当用户粘贴内容或从数据库加载 HTML 时，这个函数会被调用，它就像是“输入转换器” 5。
    
- **`renderHTML`**: 定义了如何将编辑器内部状态中的节点或标记渲染成 HTML。当您需要保存文档内容或在只读模式下显示时，这个函数会被调用，它就像是“输出转换器” 5。
    

掌握了这些基础概念，我们就拥有了与 Tiptap 核心对话的语言。接下来，我们将通过亲手实践，将这些理论知识转化为具体的、功能强大的自定义扩展。

## 第二节：从零到 Node：构建一个自定义“Callout”块

理论知识是基础，但真正的掌握源于实践。在本章中，我们将一步步地创建一个功能完整的自定义块级 `Node`——一个“Callout”组件。这种组件在文档中非常常见，用于高亮显示提示、警告或重要信息。通过这个例子，我们将把上一章的概念付诸实践。

### 步骤一：搭建 Node 的骨架

万丈高楼平地起。我们首先要用 `Node.create` 方法定义 Callout 节点的基本结构 10。创建一个新文件

`Callout.js`：

JavaScript

```
import { Node, mergeAttributes } from '@tiptap/core';

export const Callout = Node.create({
  name: 'callout', // 1. 唯一名称
  
  group: 'block', // 2. 属于块级节点组

  content: 'paragraph+', // 3. 内容必须是至少一个段落

  defining: true, // 4. 这是一个定义边界的节点

  //... 更多配置将在这里添加
});
```

让我们来解析这段骨架代码：

1. **`name: 'callout'`**: 为我们的节点提供一个全局唯一的名称 11。
    
2. **`group: 'block'`**: 声明这是一个块级元素，它会独占一行，不能和普通文本混排 11。
    
3. **`content: 'paragraph+'`**: 这是对节点内容最核心的约束。它规定了 Callout 内部必须包含一个或多个段落（`paragraph`）节点 6。这确保了 Callout 内部内容的结构规范，避免了直接在其中放置裸露文本或其他不合规的块级节点。
    
4. **`defining: true`**: 这是一个非常重要的属性。它告诉编辑器，这个节点是一个独立的“定义单元”。这意味着用户的光标无法部分选中 Callout 的内容和外部内容，也无法轻易地通过按回车或删除键将其与其他节点合并或拆分。这对于保持 Callout 结构的完整性至关重要。
    

### 步骤二：序列化（HTML 与编辑器状态的桥梁）

现在我们有了节点的内部定义，但 Tiptap 还不知道如何将它显示为 HTML，也不知道如何从 HTML 中识别它。这就是 `renderHTML` 和 `parseHTML` 的工作 8。

JavaScript

```
// 在 Callout.js 的 Node.create({}) 内部添加

parseHTML() {
  return [
    {
      tag: 'div[data-type="callout"]', // 匹配带有特定属性的 div 标签
    },
  ];
},

renderHTML({ HTMLAttributes }) {
  // 返回一个数组，描述了如何渲染 DOM
  // 'div' 是标签名
  // mergeAttributes 用于合并传入的属性
  // 0 是一个“洞”，表示子内容应该被渲染到这里
  return;
},
```

- `renderHTML` 的逻辑是：当编辑器需要将 `callout` 节点转换为 HTML 时，它会创建一个 `<div>` 标签。我们通过 `mergeAttributes` 确保这个 `div` 拥有一个 `data-type="callout"` 的属性，这是一种最佳实践，用于明确标识自定义节点的类型。`0` 是一个占位符，Tiptap 会自动将节点的子内容（即我们定义的 `paragraph+`）渲染到这个位置 11。
    
- `parseHTML` 的逻辑则相反：当编辑器遇到一个 `div` 标签，并且它正好拥有 `data-type="callout"` 这个属性时，Tiptap 就会知道应该将这个 `div` 及其内容解析成一个 `callout` 节点 8。
    

### 步骤三：添加动态属性

一个静态的 Callout 不够灵活。我们希望能够创建不同类型的 Callout，比如“提示（info）”、“警告（warning）”和“危险（danger）”，并通过 CSS 为它们应用不同的样式。这需要用到属性（Attributes）。

添加属性是一个闭环操作，需要三步：定义、渲染和解析。这体现了属性数据的双向流动性：从编辑器状态到 HTML，再从 HTML 回到编辑器状态。遗漏任何一环都会导致数据在保存或加载时丢失。

1. **定义属性**：使用 `addAttributes` 方法。
    
    JavaScript
    
    ```
    // 在 Node.create({}) 内部添加
    
    addAttributes() {
      return {
        calloutType: {
          default: 'info', // 默认类型是 'info'
        },
      };
    },
    ```
    
    这里我们定义了一个名为 `calloutType` 的属性，并为其设置了默认值 `'info'` 5。
    
2. **渲染属性**：修改 `renderHTML`，将属性值写入 DOM。
    
    JavaScript
    
    ```
    // 修改 renderHTML 方法
    
    renderHTML({ HTMLAttributes }) {
      // HTMLAttributes 中会自动包含 calloutType
      return;
    },
    ```
    
    Tiptap 会自动将 `addAttributes` 中定义的属性（如 `calloutType`）映射到 `HTMLAttributes` 对象中，并以 `data-` 前缀的形式渲染到 HTML 标签上。最终生成的 HTML 会是 `<div data-type="callout" data-callout-type="info">...</div>`。
    
3. **解析属性**：修改 `parseHTML`，从 DOM 中读取属性值。
    
    JavaScript
    
    ```
    // 修改 parseHTML 方法
    
    parseHTML() {
      return [
        {
          tag: 'div[data-type="callout"]',
          getAttrs: (element) => ({
            calloutType: element.getAttribute('data-callout-type'),
          }),
        },
      ];
    },
    ```
    
    我们在解析规则中添加了 `getAttrs` 函数。当匹配到 `div` 标签时，此函数会执行，读取 `data-callout-type` 属性的值，并将其赋值给我们节点状态中的 `calloutType` 属性。
    

现在，我们的 Callout 节点已经具备了动态样式的能力。您可以通过 CSS 选择器 `div[data-callout-type="warning"]` 来为其定义独特的样式。

### 步骤四：创建命令

如果用户只能通过手动编写 HTML 来创建 Callout，那体验就太糟糕了。我们需要提供编程式的接口——命令（Commands），以便通过按钮或其他 UI 元素来操作 Callout 5。

JavaScript

```
// 在 Node.create({}) 内部添加
// 别忘了在文件顶部引入 aclare module '@tiptap/core'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    callout: {
      /**
       * 设置或切换 Callout 块
       */
      toggleCallout: (attributes: { calloutType: string }) => ReturnType,
    }
  }
}

//...

addCommands() {
  return {
    toggleCallout: (attributes) => ({ commands }) => {
      // 使用 toggleBlock 来在段落和 Callout 之间切换
      return commands.toggleBlock(this.name, 'paragraph', attributes);
    },
  };
},
```

我们使用 `addCommands` 方法来定义命令。这里我们创建了一个 `toggleCallout` 命令。我们巧妙地利用了 Tiptap 内置的 `toggleBlock` 命令，它可以智能地在两种块类型之间切换。如果当前选区是段落，它会将其转换为 `callout`；如果已经是 `callout`，则会将其转换回段落。我们还通过 `attributes` 参数，允许在创建 Callout 时动态指定其类型。

通过 TypeScript 的 `declare module`，我们将自定义命令注入到了 Tiptap 的全局命令接口中，这能为我们带来极佳的类型提示和自动补全体验。

### 步骤五：集成到编辑器

最后一步，将我们精心打造的 `Callout` 扩展集成到 Tiptap 编辑器实例中 4。

JavaScript

```
// 在您的编辑器配置文件中
import { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Callout } from './Callout.js'; // 引入我们的扩展

const editor = new Editor({
  extensions:,
  //... 其他配置
});
```

现在，您就可以在您的编辑器 UI 中添加一个按钮，点击时调用 `editor.commands.toggleCallout({ calloutType: 'warning' })`，一个功能齐全、样式可定制的 Callout 块就会出现在您的编辑器中。

通过这个完整的流程，我们不仅创建了一个自定义节点，更重要的是，我们掌握了定义节点结构、处理数据序列化、添加动态属性和创建交互命令的核心方法论。

## 第三节：从零到 Mark：打造一个带颜色的自定义“高亮”

掌握了 `Node` 的创建之后，`Mark` 的创建就变得轻车熟路了。`Mark` 用于实现行内格式，如加粗、链接等。在本章中，我们将创建一个比 Tiptap 内置高亮更强大的版本：一个可以自定义高亮颜色的 `coloredHighlight` 标记。这个过程将巩固我们对属性和命令的理解，并引入新的概念，如键盘快捷键。

### 步骤一：搭建 Mark 的骨架

与 `Node` 类似，我们使用 `Mark.create` 方法开始 10。创建一个新文件

`ColoredHighlight.js`。

JavaScript

```
import { Mark, mergeAttributes } from '@tiptap/core';

export const ColoredHighlight = Mark.create({
  name: 'coloredHighlight', // 1. 唯一名称

  spanning: false, // 2. 默认情况下，标记不能跨越块级节点

  //... 更多配置
});
```

1. **`name: 'coloredHighlight'`**: 同样，一个唯一的名称是必不可少的。
    
2. **`spanning: false`**: 这个属性默认为 `false`，意味着标记不能跨越不同的块级节点。例如，如果用户选中了两个段落的部分文本，应用此标记后，它会分别在两个段落内生效，而不会形成一个单一的、跨越段落边界的标记。在大多数情况下，这是我们期望的行为 15。
    

### 步骤二：序列化与属性

我们的核心需求是能够自定义颜色。这自然需要一个 `color` 属性。与 `Node` 一样，我们需要完成定义、渲染、解析三部曲。

JavaScript

```
// 在 Mark.create({}) 内部添加

addAttributes() {
  return {
    color: {
      default: '#FFFF00', // 默认颜色为黄色
    },
  };
},

parseHTML() {
  return [
    {
      tag: 'mark', // 匹配 <mark> 标签
      getAttrs: (node) => {
        // 从 style 属性中解析背景颜色
        const color = node.style.backgroundColor;
        return color? { color } : {};
      },
    },
  ];
},

renderHTML({ HTMLAttributes }) {
  // HTMLAttributes 将包含 color 属性
  // 我们用它来生成内联样式
  return;
},
```

这里的逻辑比 Callout 节点稍微复杂一些，但原理是相通的：

- **`addAttributes`**: 我们定义了一个 `color` 属性，并给予一个默认的黄色值 14。
    
- **`renderHTML`**: 我们将 `color` 属性的值直接用于生成一个内联 `style`，来设置 `<mark>` 标签的 `background-color` 14。这是实现动态颜色的关键。
    
- **`parseHTML`**: 我们不仅匹配 `<mark>` 标签，还通过 `getAttrs` 函数检查其 `style` 属性。如果找到了 `background-color`，我们就将其值提取出来，赋给我们的 `color` 属性。这样，当用户粘贴带有背景色的高亮文本时，我们的扩展也能正确识别其颜色。
    

### 步骤三：创建一套完整的命令

一个优秀的扩展应该提供一个完整、可预测的编程接口（API），方便 UI 调用。这不仅仅是“让按钮工作”，而是精心设计扩展的外部交互方式。对于高亮标记，我们需要设置、切换和取消三种操作 14。

JavaScript

```
// 在 ColoredHighlight.js 中

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    coloredHighlight: {
      /**
       * 设置高亮并指定颜色
       */
      setHighlight: (attributes: { color: string }) => ReturnType,
      /**
       * 切换高亮状态
       */
      toggleHighlight: (attributes: { color: string }) => ReturnType,
      /**
       * 取消高亮
       */
      unsetHighlight: () => ReturnType,
    }
  }
}

// 在 Mark.create({}) 内部添加
addCommands() {
  return {
    setHighlight: (attributes) => ({ commands }) => {
      return commands.setMark(this.name, attributes);
    },
    toggleHighlight: (attributes) => ({ commands }) => {
      return commands.toggleMark(this.name, attributes);
    },
    unsetHighlight: () => ({ commands }) => {
      return commands.unsetMark(this.name);
    },
  };
},
```

我们再次使用了 Tiptap 内置的命令助手：`setMark`、`toggleMark` 和 `unsetMark`。它们极大地简化了逻辑。通过提供这一整套命令，我们让 UI 层的开发变得异常简单：

- 颜色选择器可以选择一个颜色，然后调用 `editor.commands.setHighlight({ color: '#FFC0CB' })`。
    
- 一个开关按钮可以调用 `editor.commands.toggleHighlight({ color: '#FFFF00' })`。
    
- 一个“清除格式”按钮可以调用 `editor.commands.unsetHighlight()`。
    

通过 `declare module` 再次扩展 TypeScript 接口，我们确保了这套 API 是完全类型安全且具备自动补全的，极大地提升了开发体验 20。

### 步骤四：添加键盘快捷键

为了提升效率，我们可以为最常用的命令绑定键盘快捷键。`addKeyboardShortcuts` 方法让这一切变得简单。

JavaScript

```
// 在 Mark.create({}) 内部添加

addKeyboardShortcuts() {
  return {
    'Mod-Shift-H': () => this.editor.commands.toggleHighlight({ color: this.options.color }),
  };
},
```

这段代码将 `Cmd+Shift+H` (在 Mac 上) 或 `Ctrl+Shift+H` (在 Windows 上) 绑定到了 `toggleHighlight` 命令上 14。当用户按下快捷键时，它会使用我们在

`addAttributes` 中定义的默认颜色来切换高亮。

至此，我们的 `coloredHighlight` 扩展已经完成。它不仅能实现基本的文本高亮，还能自定义颜色，提供了一套完整的命令 API，并支持键盘快捷键。通过这个例子，我们进一步巩固了对 Tiptap 扩展核心概念的理解，并为进入更高级的主题做好了准备。

## 第四节：高级超能力：让你的扩展活起来

我们已经掌握了如何定义扩展的“骨骼”（Schema）和“肌肉”（Commands）。现在，是时候为它们注入“神经系统”了。本章将探索 Tiptap 提供的高级 API，它们能让您的扩展具备动态行为、状态管理和智能自动化能力，从而极大地提升用户体验。

### 使用输入和粘贴规则实现自动化

`addInputRules` 和 `addPasteRules` 是两个极为强大的 UX 增强工具。它们允许扩展监听用户的输入和粘贴行为，并根据预设的模式自动触发相应的操作，例如实现流行的 Markdown 快捷语法 21。

- **`addInputRules`：实时输入转换**
    
    输入规则会在用户键入时实时匹配文本模式。我们将为第二章创建的 `Callout` 节点添加一个输入规则：当用户在新的一行输入 `>>` (大于号加空格) 时，自动将该段落转换为一个 Callout 块。
    
    JavaScript
    
    ```
    // 在 Callout.js 的 Node.create({}) 内部添加
    import { nodeInputRule } from '@tiptap/core';
    
    //...
    addInputRules() {
      return;
    },
    ```
    
    我们使用了 Tiptap 提供的 `nodeInputRule` 帮助函数 21。它接收一个配置对象，
    
    `find` 属性是一个正则表达式，用于匹配触发模式；`type` 属性则指定了匹配成功后要创建的节点类型，`this.type` 在这里就指向 `Callout` 节点本身。现在，用户无需点击任何按钮，只需输入简单的快捷符，就能创建 Callout，效率大增。
    
- **`addPasteRules`：智能粘贴处理**
    
    粘贴规则与输入规则类似，但它作用于用户粘贴内容时。我们将为第三章的 `coloredHighlight` 标记添加一个粘贴规则：当用户粘贴形如 `==被高亮的文本==` 的内容时，自动为其应用高亮标记。
    
    JavaScript
    
    ```
    // 在 ColoredHighlight.js 的 Mark.create({}) 内部添加
    import { markPasteRule } from '@tiptap/core';
    
    //...
    addPasteRules() {
      return;
    },
    ```
    
    这里我们使用了 `markPasteRule` 帮助函数 22。
    
    `find` 正则表达式中的 `g` (global) 标志至关重要，它确保了如果粘贴的内容中有多处匹配，规则会对每一处都生效 22。这个小小的功能，使得从其他支持类似 Markdown 语法的应用（如 Obsidian, Notion）中复制内容到我们的编辑器时，格式能够被无缝保留。
    

### 使用 `addStorage` 管理内部状态

在开发复杂扩展时，我们经常需要存储一些数据。Tiptap 提供了两种状态存储机制：`addAttributes` 和 `addStorage`。理解它们的区别是设计高级扩展的关键。

这是一个关于状态二元性的核心概念：**文档状态 vs. 运行时状态**。

- **`addAttributes`** 用于存储 **文档状态**。这些数据是文档内容的一部分，需要被序列化（保存到 HTML 或 JSON），并在加载时恢复。例如，一个链接的 `href` 地址，或者我们 Callout 的 `calloutType`。这些数据必须是可序列化为 JSON 的简单值。
    
- **`addStorage`** 用于存储 **运行时状态**。这些数据只存在于当前编辑器实例的生命周期中，不会被保存到文档内容里 17。它可以是任何类型的数据，比如一个函数的引用、一个复杂的对象、一个计时器 ID，或者用于分析的计数器。
    

让我们创建一个简单的扩展来演示 `addStorage` 的用法。这个扩展将统计编辑器内容被更新了多少次。

JavaScript

```
import { Extension } from '@tiptap/core';

// 为存储添加 TypeScript 类型，增强代码健壮性
declare module '@tiptap/core' {
  interface ExtensionStorage {
    updateCounter: {
      count: number,
    }
  }
}

export const UpdateCounter = Extension.create({
  name: 'updateCounter',

  addStorage() {
    return {
      count: 0, // 初始化存储
    };
  },

  onUpdate() {
    this.storage.count += 1; // 在每次更新时修改存储
    console.log('Editor updated', this.storage.count, 'times.');
  },
});
```

在这个例子中：

1. 我们使用 `addStorage` 返回一个对象，作为这个扩展的初始状态 18。
    
2. 在 `onUpdate` 生命周期钩子中，我们通过 `this.storage` 访问并修改这个状态 18。
    
3. 这个 `count` 值是临时的，刷新页面后就会重置。
    

我们也可以从扩展外部访问这个存储，只需通过 `editor.storage.extensionName` 18：

JavaScript

```
const count = editor.storage.updateCounter.count;
```

通过 `declare module` 为存储定义类型，可以让我们在访问 `editor.storage.updateCounter` 时获得完整的 TypeScript 类型支持，避免拼写错误和类型滥用 20。

### 扩展的生命周期与副作用

Tiptap 扩展拥有一套丰富的生命周期钩子（Lifecycle Hooks），允许我们在编辑器的关键时刻执行代码，处理副作用 25。

常用的钩子包括：

- `onCreate`: 编辑器实例创建并准备就绪时触发。
    
- `onUpdate`: 编辑器内容发生变化时触发。
    
- `onSelectionUpdate`: 编辑器选区变化时触发。
    
- `onTransaction`: 每一次状态变更（Transaction）发生时触发。这是最底层的变化监听。
    
- `onFocus` / `onBlur`: 编辑器获得或失去焦点时触发。
    
- `onDestroy`: 编辑器实例被销毁前触发，适合用于清理工作。
    

重要陷阱：生命周期钩子中的无限循环

一个常见的错误是在 onUpdate 或 onTransaction 钩子中直接调用 editor.commands 来修改编辑器状态。这会导致一个新的更新事件，从而再次触发钩子，形成一个无限循环，最终导致浏览器崩溃 8。

**错误的做法**：

JavaScript

```
onUpdate({ editor }) {
  // 危险！这会造成无限循环！
  editor.commands.setNode('paragraph'); 
}
```

正确的做法：在事务（Transaction）层面思考

这些钩子通常会提供一个 transaction 对象（简写为 tr）。如果您确实需要在这些钩子中修改状态，您应该直接操作这个 tr 对象，而不是派发一个新的命令。ProseMirror 会将这些修改合并到当前的事务中，从而避免了循环。

JavaScript

```
onTransaction({ transaction }) {
  if (someCondition) {
    // 安全的做法：直接修改当前事务
    transaction.setNodeMarkup(...); 
  }
}
```

虽然直接操作 `tr` 属于更高级的 ProseMirror API，但理解这个原则至关重要：**生命周期钩子是用于“响应”变化的，而不是“创造”新的变化**。

为了帮助您快速查阅这些高级 API，下表总结了它们的核心用途：

|方法 (Method)|目的 (Purpose)|用例 (Use Case Example)|
|---|---|---|
|`addCommands`|定义扩展的编程接口，供 UI 或其他逻辑调用。|`toggleHighlight()` 命令用于切换高亮。|
|`addKeyboardShortcuts`|绑定键盘快捷键到特定命令。|`Mod-B` 绑定到 `toggleBold()` 命令。|
|`addInputRules`|根据用户输入实时转换文本（Markdown 语法）。|输入 `*` 自动创建无序列表。|
|`addPasteRules`|根据粘贴的内容自动转换文本。|粘贴 `(url)` 自动创建链接。|
|`addStorage`|管理扩展的、非持久化的、运行时的内部状态。|存储一个 debounce 函数或用于分析的计数器。|
|`addNodeView`|(高级) 使用框架组件（如 React/Vue）完全自定义节点的渲染和交互。|创建一个带可编辑标题和交互按钮的视频嵌入节点。|
|`addProseMirrorPlugins`|(最高级) 注入底层的 ProseMirror 插件，以获得对编辑器行为的完全控制。|实现提及（Mention）功能的建议弹出框。|

掌握了这些“超能力”，您就拥有了构建几乎任何复杂交互的工具。它们是 Tiptap 便捷 API 和底层 ProseMirror 强大功能之间的桥梁。在下一章，我们将把所有这些能力集于一身，挑战一个终极案例。

## 第五节：终极案例研究：构建一个交互式提及（Mention）扩展

现在，我们将踏上本次教程的顶峰。我们将综合运用前面所有章节学到的知识——`Node` 定义、属性、命令、`Node View` 和 `ProseMirror` 插件——来构建一个功能完整、高度交互、生产级别的 `@mention`（提及或标签）扩展。

这个案例之所以是“终极”，因为它完美地展示了构建复杂 Tiptap 扩展所需的三位一体架构：

1. **数据模型 (`Node`)**：定义“提及”在文档中如何存储。
    
2. **视图渲染 (`Node View`)**：定义“提及”在编辑器中如何显示为一个漂亮的、不可编辑的“胶囊”UI。
    
3. **交互逻辑 (`ProseMirror Plugin`)**：定义当用户输入 `@` 时，如何触发、显示和处理建议列表的弹出框。
    

### 步骤一：架构设计

在动手之前，我们先规划好架构。我们的 `Mention` 扩展将由以下几个部分组成：

1. **`Mention.js`**: 这是扩展的主文件，它将：
    
    - 使用 `Node.create` 定义 `mention` 节点的数据结构。
        
    - 使用 `addNodeView` 将节点的渲染委托给一个 React (或 Vue) 组件。
        
    - 使用 `addProseMirrorPlugins` 注入一个自定义插件来处理建议弹出框的逻辑。
        
2. **`MentionComponent.jsx`**: 一个 React 组件，负责渲染“提及胶囊”的 UI。
    
3. **`suggestion.js`**: 一个辅助文件，包含创建和管理建议弹出框（我们将使用([https://atomiks.github.io/tippyjs/](https://atomiks.github.io/tippyjs/)) 库）的 ProseMirror 插件逻辑。
    

### 步骤二：构建 `Mention` 节点（数据模型）

首先，我们来定义 `mention` 节点本身。它是一个行内（`inline`）节点，用于在文本流中表示一个提及。

JavaScript

```
// Mention.js
import { Node, mergeAttributes } from '@tiptap/core';

export const Mention = Node.create({
  name: 'mention',
  group: 'inline',
  inline: true,
  selectable: false,
  atom: true, // 关键！

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute('data-id'),
        renderHTML: attributes => {
          if (!attributes.id) {
            return {};
          }
          return { 'data-id': attributes.id };
        },
      },
      label: {
        default: null,
        parseHTML: element => element.getAttribute('data-label'),
        renderHTML: attributes => {
          if (!attributes.label) {
            return {};
          }
          return { 'data-label': attributes.label };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: 'span[data-type="mention"]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return;
  },

  //... addNodeView 和 addProseMirrorPlugins 将在这里添加
});
```

这里的关键是 `atom: true`。这个属性告诉 ProseMirror，这个节点是一个不可分割的“原子”单元。用户不能将光标移动到它的内部，也不能编辑它的内容。ProseMirror 会将整个节点的管理权完全交给我们的 `Node View` 5。

`addAttributes` 定义了我们需要存储的数据：被提及用户的唯一 `id` 和显示的 `label`。`renderHTML` 提供了一个简单的后备方案，用于在不支持 JavaScript 的环境中（如发送邮件）也能正确显示提及内容。

### 步骤三：使用 `addNodeView` 进行自定义渲染（视图渲染）

现在，我们要用一个交互式的 React 组件来取代 `renderHTML` 的静态渲染。这就是 `addNodeView` 的用武之地 5。

JavaScript

```
// 在 Mention.js 的 Node.create({}) 内部添加
import { ReactNodeViewRenderer } from '@tiptap/react';
import MentionComponent from './MentionComponent.jsx';

//...
addNodeView() {
  return ReactNodeViewRenderer(MentionComponent);
},
```

`addNodeView` 返回一个 `ReactNodeViewRenderer`（或 `VueNodeViewRenderer`），它将我们的 `MentionComponent` 组件与 `mention` 节点绑定起来 5。

现在，我们来创建 `MentionComponent.jsx`：

JavaScript

```
// MentionComponent.jsx
import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';

export default (props) => {
  return (
    <NodeViewWrapper as="span" className="mention">
      @{props.node.attrs.label}
    </NodeViewWrapper>
  );
};
```

这个组件非常简单。它使用了 Tiptap 提供的 `NodeViewWrapper`，它会渲染一个容器元素（我们指定为 `<span>`），并处理好所有 ProseMirror 需要的 DOM 属性和事件 5。组件通过

`props.node.attrs` 可以访问到我们在 `addAttributes` 中定义的 `id` 和 `label`，从而渲染出我们想要的“胶囊”UI。您可以随意为 `.mention` 类添加 CSS 样式。

### 步骤四：使用 `addProseMirrorPlugins` 实现建议引擎（交互逻辑）

这是最核心、最复杂的部分。当用户输入 `@` 时，我们需要一个弹出框来显示用户列表。Tiptap 的标准 API 无法直接实现这种复杂的、与 UI 紧密耦合的交互，因此我们必须深入底层，编写一个 ProseMirror 插件 8。

这是一个高度简化的实现思路，完整的代码会更长，但核心逻辑如下：

JavaScript

```
// suggestion.js (这是一个简化的逻辑概览)
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import tippy from 'tippy.js';

export const suggestionPlugin = (options) => {
  return new Plugin({
    key: new PluginKey('mention_suggestion'),

    state: {
      init: () => ({ active: false, range: {}, query: '' }),
      apply: (tr, value) => {
        //... 在每次事务中，检查光标前的文本是否匹配触发符，如 /@(\w*)$/
        // 如果匹配，更新插件状态，记录 active=true, range 和 query
        // 如果不匹配，重置状态
        return newValue;
      },
    },

    view: (editorView) => {
      let popup;

      return {
        update: (view, prevState) => {
          const currentState = this.key.getState(view.state);
          const previousState = this.key.getState(prevState);

          // 如果状态从 inactive 变为 active，创建并显示 tippy 弹出框
          if (currentState.active &&!previousState.active) {
            // popup = tippy('body', {...配置... });
            // 在弹出框中渲染用户列表，列表数据可以根据 currentState.query 过滤
          }

          // 如果状态从 active 变为 inactive，销毁弹出框
          if (!currentState.active && previousState.active) {
            // popup.destroy();
          }
        },
        destroy: () => {
          // popup?.destroy();
        },
      };
    },
  });
};
```

这个插件的核心工作流程是：

1. **`state.apply`**: 在每次编辑器状态更新时，检查光标前的文本。如果匹配 `@` 触发符，就更新插件自己的内部状态，记录下触发的位置（`range`）和查询词（`query`）。
    
2. **`view.update`**: 监听插件状态的变化。当状态变为“激活”时，它会创建一个 Tippy.js 弹出框，并根据查询词渲染建议列表。当状态变为“非激活”时，它会销毁弹出框。
    
3. **命令交互**: 在建议列表的 UI 中，当用户点击或回车选择一个用户时，UI 组件会调用一个 Tiptap 命令，例如 `editor.commands.insertContent(...)`，用一个完整的 `mention` 节点替换掉触发文本（如 `@john`）。
    

最后，我们将这个插件集成到我们的 `Mention.js` 扩展中：

JavaScript

```
// 在 Mention.js 的 Node.create({}) 内部添加
import { suggestionPlugin } from './suggestion.js';

//...
addProseMirrorPlugins() {
  return [
    suggestionPlugin({
      editor: this.editor,
      //... 其他配置，如获取用户列表的函数
    }),
  ];
},
```

### 步骤五：最终集成

通过以上步骤，我们已经将数据模型（`Node`）、视图渲染（`Node View`）和交互逻辑（`Plugin`）这三个部分完美地结合在了一个单一的 `Mention.js` 扩展文件中。开发者在使用时，只需像注册任何其他扩展一样，将 `Mention` 添加到编辑器的 `extensions` 数组中，一个功能强大的提及系统就此诞生。

这个案例充分证明了 Tiptap 的分层设计思想。对于简单的需求，您可以使用高层 API；而对于像建议弹出框这样复杂的交互，Tiptap 也为您保留了通往底层 ProseMirror 的通道，让您拥有实现任何功能的终极自由。

## 结论

我们已经走完了一段漫长而收获颇丰的旅程。从剖析 Tiptap 与 ProseMirror 的底层关系，到亲手构建自定义的 `Node` 和 `Mark`；从掌握 `addCommands`、`addInputRules` 等高级 API，到最终将所有知识融会贯-通，构建出一个复杂的、生产级别的 `@mention` 扩展。您现在所拥有的，已经不仅仅是使用 Tiptap 的能力，更是创造和扩展 Tiptap 的能力。

通过本教程的学习，我们揭示了几个关键的、超越代码本身的设计思想：

- **Tiptap 的渐进式披露**：它允许开发者从简单的高层 API 入手，在需要时逐步深入到底层 ProseMirror，实现了易用性与强大功能之间的完美平衡。
    
- **Schema 为王**：我们认识到，创建 `Node` 和 `Mark` 的本质是设计文档的“语法”，这是一种比“添加功能”更深刻的思考方式。
    
- **状态的二元性**：我们区分了需要持久化的“文档状态”（`attributes`）和临时的“运行时状态”（`storage`），这是构建健壮扩展的架构基石。
    
- **高级交互的三位一体**：对于复杂的交互式节点，我们掌握了结合 `atom` 属性、`addNodeView` 和 `addProseMirrorPlugins` 的核心架构模式。
    

掌握了这些知识，您就拥有了解锁 Tiptap 全部潜能的钥匙。您不再受限于 Tiptap 官方或社区提供的扩展，您的编辑器现在是一块真正的画布，而扩展就是您手中的画笔，可以随心所欲地描绘出您产品所需的用户体验 2。

**下一步行动**

- **深入探索**：官方文档永远是最好的老师。我们强烈建议您花时间深入阅读 Tiptap 和 ProseMirror 的官方文档，那里有更详尽的 API 参考和示例 2。
    
- **动手实践**：知识只有在实践中才能真正内化。尝试为您自己的项目构建一个独特的扩展，解决一个实际问题。
    
- **拥抱社区**：Tiptap 拥有一个活跃的社区 4。如果您想将自己的扩展分享给更多人，可以使用官方提供的 CLI 工具
    
    `npm init tiptap-extension` 来快速创建一个标准化的、可发布的扩展项目 4。
    

感谢您跟随本系列教程走到这里。希望这篇深度指南能够成为您在 Tiptap 定制化道路上的坚实基石和灵感源泉。祝您创造愉快！