# Checklist

## Installation

- Clone the repository and open `chrome://extensions/`
- Enable *Developer mode* and load this folder as an unpacked extension
- Confirm the icons `icon16.png`, `icon48.png`, `icon128.png` sit at the project root

## Validation

- Open any normal website, click the extension, hit `开始选择`, and hover/click elements
- Ensure a highlighted element and the result banner appear after each click
- Copy the generated text and paste it somewhere to confirm clipboard access

## Documentation sync

- README, QUICKSTART, and EXAMPLES should describe the same workflow and refer to each other
- CHANGELOG.md covers release history for open-source readers
- OPTIMIZATION.md highlights the most important performance/code trade-offs

## 测试建议（中文）

- 打开任意普通网页，点击插件，确认高亮效果稳定
- 点击一个元素后，横幅内容能显示主选择器、候选方案和置信度
- 在 Mac/Win Chrome 中分别验证 `Alt + Click` 选择父元素、`ESC` 退出命令
