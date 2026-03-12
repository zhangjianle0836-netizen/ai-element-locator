# ✅ 安装清单

## 📁 文件结构

```
element-locator/
├── manifest.json           ✓ 插件配置文件
├── popup.html              ✓ 弹窗界面
├── popup.js                ✓ 弹窗逻辑
├── content.js              ✓ 内容脚本
├── background.js           ✓ 后台脚本
├── styles.css              ✓ 样式文件
├── icon16.png              ✓ 小图标（16x16）
├── icon48.png              ✓ 中图标（48x48）
├── icon128.png             ✓ 大图标（128x128）
├── utils/
│   ├── extractor.js        ✓ 信息提取器
│   ├── formatter.js        ✓ 格式化器
│   └── framework-detector.js ✓ 框架检测器
├── generate-icons.html     ✓ 图标生成工具（备用）
├── README.md               ✓ 完整文档
├── QUICKSTART.md           ✓ 快速开始指南
└── EXAMPLES.md             ✓ 使用示例

总计：15 个文件
```

---

## 🚀 立即安装

### 方法 1：Chrome 浏览器

1. 打开 Chrome
2. 访问：`chrome://extensions/`
3. 开启"开发者模式"（右上角）
4. 点击"加载已解压的扩展程序"
5. 选择这个文件夹（element-locator）
6. 完成！

### 方法 2：Edge 浏览器

1. 打开 Edge
2. 访问：`edge://extensions/`
3. 后续步骤同 Chrome

---

## ✨ 快速测试

1. 点击 Chrome 工具栏中的插件图标
2. 应该看到一个紫色渐变的弹窗，标题为"🎯 元素定位器"
3. 点击"开始选择"按钮
4. 在任意网页上悬停和点击元素
5. 信息自动复制到剪贴板
6. 粘贴到任何地方查看结果

---

## 📚 文档导航

- **快速开始**：查看 `QUICKSTART.md`
- **完整文档**：查看 `README.md`
- **使用示例**：查看 `EXAMPLES.md`
- **重新生成图标**：在浏览器中打开 `generate-icons.html`

---

## 🎯 与 Claude Code 配合使用

### 标准流程

```
1. 发现问题 → 2. 用插件提取 → 3. 粘贴给 Claude → 4. 描述需求 → 5. 等待解决
```

### 示例提示词

```markdown
【元素定位信息】
（粘贴插件输出的内容）

【问题描述】
（描述你看到的问题）

【期望效果】
（描述你想要的效果）
```

---

## ⚡ 核心功能

✓ **一键提取** - 点击元素即可提取信息
✓ **自动复制** - 信息自动复制到剪贴板
✓ **智能检测** - 自动识别 Vue/React 框架
✓ **多种格式** - Markdown / JSON / AI 友好格式
✓ **友好交互** - 高亮显示、Toast 提示
✓ **快捷操作** - ESC 键退出选择模式

---

## 🛠️ 高级配置

### 修改输出格式

编辑 `content.js`，找到第 107 行：

```javascript
// 默认：Markdown 格式
const output = this.formatter.toMarkdown(info, framework);

// 改为：JSON 格式
const output = this.formatter.toJSON(info, framework);

// 改为：AI 友好格式
const output = this.formatter.toAIFriendly(info, framework);
```

### 调整父级深度

编辑 `utils/extractor.js`，修改 `getParentPath` 的 `depth` 参数：

```javascript
// 默认：向上 3 层
const parents = this.getParentPath(element, 3);

// 改为：向上 5 层
const parents = this.getParentPath(element, 5);
```

---

## 🐛 故障排除

### 问题：插件图标是灰色的

**解决**：检查图标文件是否正确生成

```bash
ls -lh icon*.png
```

应该看到三个图标文件，大小分别为：
- icon16.png：约 200-300 bytes
- icon48.png：约 400-600 bytes
- icon128.png：约 1-2 KB

### 问题：点击插件没有反应

**解决**：刷新页面后重试。某些页面（如 Chrome 商店）可能限制插件运行。

### 问题：无法复制到剪贴板

**解决**：
1. 检查浏览器权限设置
2. 确保使用 http/https 协议（非 file://）
3. 某些网站可能限制剪贴板访问

### 问题：没有检测到框架

**解决**：框架检测依赖应用的实现方式。某些应用可能使用了特殊配置或打包方式。

---

## 📊 文件大小参考

```
manifest.json      ~0.7 KB
popup.html         ~3.5 KB
popup.js           ~2.1 KB
content.js         ~5.0 KB
background.js      ~0.8 KB
styles.css         ~1.2 KB
utils/*.js         ~13.5 KB
图标文件            ~1.6 KB
------------------------
总计               ~28.4 KB
```

---

## 🎉 恭喜！

你的元素定位器插件已经准备就绪！

现在开始使用，提升与 Claude Code 的协作效率吧！ 🚀

---

## 📮 反馈与支持

如有问题或建议，欢迎反馈！

**Made with ❤️ for Claude Code**
Version 1.0.0
