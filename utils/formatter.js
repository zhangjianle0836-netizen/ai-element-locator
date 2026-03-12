/**
 * 输出格式化器
 * 将提取的元素信息格式化为不同的输出格式
 */

// 避免重复声明
if (typeof window.OutputFormatter === 'undefined') {

class OutputFormatter {
  /**
   * 格式化为 Markdown 格式（人类友好）
   * @param {Object} info - 元素信息
   * @param {Object} framework - 框架信息
   * @returns {string} Markdown 格式的文本
   */
  toMarkdown(info, framework) {
    const locator = info.locator || {};

    let output = '**页面信息**\n';
    output += `- 页面地址：\`${window.location.href}\`\n`;
    output += `- 页面标题：${document.title || '未知'}\n\n`;

    output += '**点击的元素**\n';

    const tagNames = {
      button: '按钮',
      input: '输入框',
      a: '链接',
      div: '容器',
      span: '文本',
      img: '图片',
      form: '表单'
    };
    output += `- 类型：${tagNames[info.tag] || info.tag}\n`;

    if (info.classes.length > 0) {
      output += `- 样式类：${info.classes.map((c) => `\`${c}\``).join(' ')}\n`;
    }

    if (info.id) {
      output += `- ID：\`${info.id}\`\n`;
    }

    if (info.text) {
      output += `- 显示文本：${info.text}\n`;
    }

    if (framework.framework !== '原生') {
      output += `- 框架：${framework.framework}\n`;
      if (framework.componentName) {
        output += `- 组件名：\`${framework.componentName}\`\n`;
      }
    }

    output += '\n**定位结果**\n';
    if (locator.primarySelector) {
      output += `- 主选择器：\`${locator.primarySelector}\`\n`;
      output += `- 策略：${locator.strategy || 'unknown'}\n`;
      output += `- 命中数：${locator.matchCount ?? 0}\n`;
      output += `- 置信度：${locator.confidence ?? 0}/100\n`;
    } else if (info.cssPath) {
      output += `- 主选择器：\`${info.cssPath}\`\n`;
      output += '- 策略：fallback\n';
    }

    if (info.xpath) {
      output += `- XPath：\`${info.xpath}\`\n`;
    }

    if (Array.isArray(locator.candidates) && locator.candidates.length > 0) {
      output += '\n**候选选择器**\n';
      locator.candidates.forEach((candidate, index) => {
        output += `- 方案 ${index + 1}：\`${candidate.selector}\`（${candidate.strategy}, 命中 ${candidate.matchCount}, 评分 ${candidate.score}）\n`;
      });
    }

    if (info.keywords.length > 0) {
      output += '\n**搜索建议**\n';
      output += `- 关键词：${info.keywords.map((k) => `\`${k}\``).join(', ')}\n`;
    }

    if (info.dataAttrs || info.name || info.role) {
      output += '\n**特殊属性**\n';
      if (info.dataAttrs) {
        Object.entries(info.dataAttrs).forEach(([key, value]) => {
          output += `- ${key}：\`${value}\`\n`;
        });
      }
      if (info.name) {
        output += `- name：\`${info.name}\`\n`;
      }
      if (info.role) {
        output += `- role：\`${info.role}\`\n`;
      }
    }

    output += '\n---\n';
    output += '⚠️ **定位提示**：若主选择器命中数不为 1，请优先使用候选方案并补充页面区域、父容器等上下文。\n';

    return output;
  }

  /**
   * 格式化为 JSON 格式（机器友好）
   * @param {Object} info - 元素信息
   * @param {Object} framework - 框架信息
   * @returns {string} JSON 格式的字符串
   */
  toJSON(info, framework) {
    const obj = {
      page: {
        url: window.location.href,
        title: document.title || '未知'
      },
      tag: info.tag,
      classes: info.classes,
      id: info.id,
      text: info.text,
      framework: framework.framework,
      componentName: framework.componentName,
      cssPath: info.cssPath,
      xpath: info.xpath,
      locator: info.locator,
      keywords: info.keywords,
      dataAttrs: info.dataAttrs,
      name: info.name,
      role: info.role,
      type: info.type
    };

    Object.keys(obj).forEach((key) => {
      if (obj[key] === null || obj[key] === undefined) {
        delete obj[key];
      }
    });

    obj._note = '若 locator.matchCount 不为 1，请优先使用 locator.candidates 中命中数为 1 的方案。';

    return JSON.stringify(obj, null, 2);
  }

  /**
   * 格式化为 AI 友好格式（简洁清晰）
   * @param {Object} info - 元素信息
   * @param {Object} framework - 框架信息
   * @returns {string} AI 友好格式的文本
   */
  toAIFriendly(info, framework) {
    const locator = info.locator || {};

    let output = '=== 页面信息 ===\n';
    output += `页面地址: ${window.location.href}\n`;
    output += `页面标题: ${document.title || '未知'}\n\n`;

    output += '=== 元素定位信息 ===\n';
    output += `标签: ${info.tag}\n`;

    if (info.classes.length > 0) {
      output += `Class: .${info.classes.join(' .')}\n`;
    }

    if (info.id) {
      output += `ID: #${info.id}\n`;
    }

    if (info.text) {
      output += `文本: "${info.text}"\n`;
    }

    if (locator.primarySelector || info.cssPath) {
      output += `主选择器: ${locator.primarySelector || info.cssPath}\n`;
    }

    if (info.xpath) {
      output += `XPath: ${info.xpath}\n`;
    }

    if (locator.strategy) {
      output += `定位策略: ${locator.strategy}\n`;
    }

    if (typeof locator.matchCount === 'number') {
      output += `命中数: ${locator.matchCount}\n`;
    }

    if (typeof locator.confidence === 'number') {
      output += `置信度: ${locator.confidence}/100\n`;
    }

    if (framework.framework !== '原生') {
      output += `框架: ${framework.framework}\n`;
      if (framework.componentName) {
        output += `组件: ${framework.componentName}\n`;
      }
    }

    if (info.dataAttrs) {
      const testData = Object.entries(info.dataAttrs)
        .filter(([key]) => key.includes('test') || key.includes('qa'))
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');
      if (testData) {
        output += `测试属性: ${testData}\n`;
      }
    }

    if (Array.isArray(locator.candidates) && locator.candidates.length > 0) {
      output += '\n=== 备选选择器 ===\n';
      locator.candidates.forEach((candidate, index) => {
        output += `${index + 1}. ${candidate.selector} | strategy=${candidate.strategy} | match=${candidate.matchCount} | score=${candidate.score}\n`;
      });
    }

    output += '\n=== 搜索建议 ===\n';
    output += `关键词: ${info.keywords.map((k) => `"${k}"`).join(', ')}\n`;

    const fileHints = this.guessFileName(info, framework);
    if (fileHints.length > 0) {
      output += `文件推测: ${fileHints.join(' / ')}\n`;
    }

    output += '\n=== 定位提示 ===\n';
    output += '优先采用命中数为 1 的选择器；若都不唯一，请补充父容器特征或局部区域信息。\n';

    return output;
  }

  /**
   * 推测可能的文件名
   * @param {Object} info - 元素信息
   * @param {Object} framework - 框架信息
   * @returns {Array} 可能的文件名数组
   */
  guessFileName(info, framework) {
    const hints = [];

    if (framework.componentName) {
      hints.push(`${framework.componentName}.vue`, `${framework.componentName}.jsx`, `${framework.componentName}.tsx`);
    }

    info.classes.forEach((cls) => {
      if (this.isUtilityClass(cls)) return;

      const parts = cls.split('-');
      if (parts.length > 1) {
        const fileName = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');
        hints.push(`${fileName}.vue`, `${fileName}.jsx`, `${fileName}.tsx`);
      }
    });

    if (info.id) {
      const parts = info.id.split('-');
      if (parts.length > 1) {
        const fileName = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');
        hints.push(`${fileName}.vue`, `${fileName}.jsx`, `${fileName}.tsx`);
      }
    }

    if (info.name) {
      hints.push(`${info.name}.vue`, `${info.name}.tsx`);
    }

    return [...new Set(hints)].slice(0, 4);
  }

  /**
   * 判断是否为工具类（CSS 工具类框架）
   * @param {string} className - class 名称
   * @returns {boolean} 是否为工具类
   */
  isUtilityClass(className) {
    const tailwindPatterns = [
      /^(flex|grid|block|inline|hidden)$/,
      /^(p|m|w|h|min|max)-/,
      /^(text|font|leading|tracking)-/,
      /^(bg|border|rounded)-/,
      /^(shadow|opacity|z-)-/,
      /^(hover|focus|active):/,
      /^(transition|duration|ease)-/,
      /^(space|gap)-/,
      /^(items|justify|content)-/,
      /^(overflow|truncate)$/,
      /^(cursor|pointer|select)-/,
      /^(mt|mb|ml|mr|mx|my|pt|pb|pl|pr|px|py)-/
    ];

    const bootstrapPatterns = [
      /^(d-|display-)/,
      /^(text-|bg-|border-)/,
      /^(m|p)(t|b|l|r|x|y)?-/,
      /^(w|h)-/,
      /^(align-|justify-)/,
      /^(float|position-)/,
      /^(visible|invisible)$/,
      /^(shadow|rounded)$/
    ];

    const utilityPatterns = [
      /^(active|disabled|hidden|visible)$/,
      /^(clearfix|container)$/,
      /^(no-select|no-wrap)$/
    ];

    const allPatterns = [
      ...tailwindPatterns,
      ...bootstrapPatterns,
      ...utilityPatterns
    ];

    return allPatterns.some((pattern) => pattern.test(className));
  }
}

window.OutputFormatter = OutputFormatter;

} // end if
