# Examples

## English

### Example 1: Fix a button style issue

```markdown
I built this page with AI, but this submit button still looks wrong.

Element info:
- Type: button
- Text: "Submit"
- Main selector: `#login-submit`
- Candidate selector: `button[data-testid="submit-button"]`

Problem:
The button background is too light.

Expected result:
Make the button darker and improve contrast.
```

### Example 2: Fix a broken interaction

```markdown
This add-to-cart button does not respond after click.

Element info:
- Type: button
- Class: `add-to-cart-btn`
- Main selector: `button[data-product-id="12345"]`
- Framework: React

Problem:
Clicking the button does nothing.

Expected result:
Add the product to cart and show a success message.
```

### Example 3: Fix layout spacing

```markdown
These two input fields do not have consistent spacing.

First element:
- Type: input
- Name: `username`

Second element:
- Type: input
- Name: `email`

Problem:
The spacing between the two inputs is inconsistent.

Expected result:
Use the same spacing value for all form inputs.
```

## 中文

### 示例 1：修复按钮样式问题

```markdown
这个页面是我用 AI 做的，但这个提交按钮样式还有问题。

元素信息：
- 类型：按钮
- 文本："提交"
- 主选择器：`#login-submit`
- 备选选择器：`button[data-testid="submit-button"]`

问题描述：
按钮背景颜色太浅。

期望效果：
把按钮颜色加深，并提高可读性。
```

### 示例 2：修复交互失效

```markdown
这个加入购物车按钮点击后没有反应。

元素信息：
- 类型：按钮
- 类名：`add-to-cart-btn`
- 主选择器：`button[data-product-id="12345"]`
- 框架：React

问题描述：
点击后没有任何反馈。

期望效果：
把商品加入购物车，并显示成功提示。
```

### 示例 3：修复布局间距

```markdown
这两个输入框的间距不一致。

第一个元素：
- 类型：输入框
- name：`username`

第二个元素：
- 类型：输入框
- name：`email`

问题描述：
两个输入框之间的间距不统一。

期望效果：
统一表单输入框之间的间距。
```
