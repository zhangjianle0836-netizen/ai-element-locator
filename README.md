# AI Element Locator

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Chrome Version](https://img.shields.io/badge/Chrome-88%2B-brightgreen.svg)](https://www.google.com/chrome/)
[![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)](https://github.com/zhangjianle0836-netizen/ai-element-locator)

**A Chrome extension that helps beginners locate broken page elements and send precise context to AI for faster fixes.**

[Why](#why) • [Features](#features) • [Quick Start](#quick-start) • [How It Works](#how-it-works) • [FAQ](#faq)

</div>

---

## Why

AI can generate pages quickly, but beginners often get stuck when the UI still looks wrong.

Typical problems:

- You can see a broken button, layout, card, form, or spacing issue.
- You do not know which selector, component, or file AI should modify.
- You describe the issue vaguely, and AI wastes extra rounds guessing.

`AI Element Locator` solves that gap by turning a click on the page into structured context that AI can use immediately.

It extracts:

- tag, classes, id, text
- stable selectors and fallback selectors
- Vue and React runtime hints when available
- searchable keywords and possible file hints
- formatted output you can paste directly into Claude, ChatGPT, Cursor, or Copilot

---

## Features

- One-click element inspection on real pages
- Stable selector generation with candidate fallback selectors
- Click correction for nested icons, spans, and decorative nodes
- Editable result panel with Markdown, JSON, and AI-friendly output
- Framework detection for Vue and React
- Search keywords and file hints for faster code lookup
- `Alt + Click` support for selecting the parent element
- `ESC` support for exiting selection mode quickly

---

## Quick Start

### Install locally

```bash
git clone git@github.com:zhangjianle0836-netizen/ai-element-locator.git
cd ai-element-locator
```

Then:

1. Open `chrome://extensions/`
2. Enable `Developer mode`
3. Click `Load unpacked`
4. Select this project folder

### Usage flow

1. Open the extension popup
2. Click `开始选择`
3. Hover to confirm the highlighted element
4. Click the target element
5. Copy the generated context
6. Paste it into your AI tool and ask for a fix

---

## How It Works

This extension is designed for beginners using AI to build or refine pages.

Example workflow:

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
The background color is too light and the contrast is poor.

Expected result:
Make the button background darker and improve readability.
```

The goal is simple: reduce back-and-forth and help AI jump closer to the right code on the first try.

More examples: [EXAMPLES.md](./EXAMPLES.md)

---

## Who This Is For

- Beginners using AI to build landing pages, admin panels, forms, and dashboards
- Users who can identify the visual problem but not the exact selector or source file
- Developers who want faster UI debugging and AI-assisted edits

---

## Supported AI Tools

- Claude Code
- ChatGPT
- Cursor
- GitHub Copilot
- Other AI coding assistants

---

## Tech Stack

- JavaScript (ES6+)
- Chrome Extension Manifest V3
- Vue and React runtime hints
- Plain CSS, no UI framework

### Project structure

```text
ai-element-locator/
├── manifest.json
├── popup.html
├── popup.js
├── content.js
├── background.js
├── styles.css
├── utils/
│   ├── extractor.js
│   ├── formatter.js
│   └── framework-detector.js
├── test.html
└── test-simple.html
```

---

## FAQ

<details>
<summary><strong>Why does clicking the extension do nothing on some pages?</strong></summary>

Some browser pages block extensions, including `chrome://extensions/` and parts of the Chrome Web Store. Refresh a normal website and try again.
</details>

<details>
<summary><strong>Why is the selector still not unique?</strong></summary>

Some apps render repeated elements with nearly identical markup. In that case, try a candidate selector with match count `1`, or capture a slightly higher-level parent element with `Alt + Click`.
</details>

<details>
<summary><strong>Why was Vue or React not detected?</strong></summary>

Framework detection is best-effort. Some production builds hide runtime metadata, so framework hints may be missing even when the page was built with Vue or React.
</details>

<details>
<summary><strong>Can beginners use this without knowing CSS selectors?</strong></summary>

Yes. The extension is designed for users who can point out the page problem visually, even if they do not yet know the exact selector, component, or file.
</details>
