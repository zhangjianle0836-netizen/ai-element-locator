# AI Element Locator

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome Version](https://img.shields.io/badge/Chrome-88%2B-brightgreen.svg)](https://www.google.com/chrome/)
[![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)](https://github.com/zhangjianle0836-netizen/ai-element-locator)

**A Chrome extension for beginners who build pages with AI and need a faster way to point AI to the exact broken element.**

**一个面向新手用户的 Chrome 扩展。用 AI 搭完页面后，如果页面还有样式、布局或交互问题，它可以帮助你快速定位页面元素，并把准确信息发给 AI 继续修改。**

[English](#english) • [中文](#中文) • [Quick Start](#quick-start) • [Examples](./EXAMPLES.md)

</div>

---

## English

### What It Does

AI can generate UI quickly, but beginners often get stuck when the page still looks wrong and they do not know:

- which element AI should modify
- which selector is stable enough
- which component or file is probably related

`AI Element Locator` turns a click on the page into structured context that AI tools can use immediately.

### Core Features

- Inspect any page element with one click
- Generate a primary selector and fallback selector candidates
- Correct accidental clicks on nested icons, spans, and decorative nodes
- Output in Markdown, JSON, and AI-friendly text
- Detect Vue and React hints when available
- Suggest keywords and possible file names
- Support `Alt + Click` to capture the parent element
- Support `ESC` to exit selection mode

### Who It Is For

- Beginners using AI to build landing pages, admin panels, forms, and dashboards
- Users who can see a page problem but do not know the exact selector or source file
- Developers who want faster AI-assisted UI fixes

### Quick Start

```bash
git clone git@github.com:zhangjianle0836-netizen/ai-element-locator.git
cd ai-element-locator
```

1. Open `chrome://extensions/`
2. Enable `Developer mode`
3. Click `Load unpacked`
4. Select this project folder

### Typical Flow

1. Open the extension popup
2. Click `开始选择`
3. Hover to confirm the highlighted element
4. Click the target element
5. Copy the generated context
6. Paste it into Claude, ChatGPT, Cursor, Copilot, or another AI tool
7. Ask AI to fix the exact issue

### Example Prompt

```markdown
I built this page with AI, but this button still looks wrong.

Element info:
- Type: button
- Text: "Submit"
- Main selector: `#login-submit`
- Candidate selector: `button[data-testid="submit-button"]`
- Framework: Vue
- Component: `LoginButton`

Problem:
The button background is too light and hard to read.

Expected result:
Make the background darker and improve contrast.
```

### FAQ

**Why does the extension not work on some pages?**

Some browser pages block extensions, including `chrome://extensions/` and parts of the Chrome Web Store.

**Why is the selector not unique?**

Some apps render repeated elements with nearly identical markup. In that case, try a candidate selector with match count `1`, or use `Alt + Click` to capture a higher-level parent element.

**Can beginners use this without knowing CSS selectors?**

Yes. The extension is designed for users who can point out the visual problem even if they do not know the exact selector, component, or file.

---

## 中文

### 这是做什么的

AI 可以很快生成页面，但新手用户经常卡在最后一步：

- 知道页面哪里有问题，却不知道该让 AI 改哪个元素
- 不知道哪个选择器更稳定
- 不知道大概率对应哪个组件或文件

`AI Element Locator` 的目标就是把“我看到这里有问题”变成“我可以把这个元素的准确信息直接发给 AI”。

### 核心能力

- 一键选择页面元素
- 自动生成主选择器和备选选择器
- 自动纠正误点到图标、`span`、装饰节点的情况
- 支持 Markdown、JSON、AI 友好格式输出
- 在可行时提供 Vue / React 框架线索
- 自动生成搜索关键词和可能的文件名
- 支持 `Alt + 点击` 直接选择父级元素
- 支持 `ESC` 快速退出选择模式

### 适合谁用

- 用 AI 搭建落地页、后台、表单、仪表盘的新手用户
- 能看出页面问题，但还不能准确定位源码位置的用户
- 想减少和 AI 反复沟通成本的开发者

### 快速开始

```bash
git clone git@github.com:zhangjianle0836-netizen/ai-element-locator.git
cd ai-element-locator
```

1. 打开 `chrome://extensions/`
2. 开启右上角 `开发者模式`
3. 点击 `加载已解压的扩展程序`
4. 选择当前项目目录

### 使用流程

1. 打开插件弹窗
2. 点击 `开始选择`
3. 移动鼠标确认高亮是否命中目标
4. 点击目标元素
5. 复制生成的定位信息
6. 粘贴给 Claude、ChatGPT、Cursor、Copilot 或其他 AI 工具
7. 让 AI 根据这些信息继续修改页面

### 提示词示例

```markdown
这个页面是我用 AI 做的，但这个按钮还有问题。

元素信息：
- 类型：按钮
- 文本："提交"
- 主选择器：`#login-submit`
- 备选选择器：`button[data-testid="submit-button"]`
- 框架：Vue
- 组件名：`LoginButton`

问题描述：
按钮背景太浅，可读性差。

期望效果：
把背景颜色加深，并提高对比度。
```

### 相关文档

- [QUICKSTART.md](./QUICKSTART.md)
- [EXAMPLES.md](./EXAMPLES.md)
- [CHANGELOG.md](./CHANGELOG.md)

