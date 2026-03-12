/**
 * 元素信息提取器
 * 负责从 DOM 元素中提取各种定位信息
 */

// 避免重复声明
if (typeof window.ElementExtractor === 'undefined') {

class ElementExtractor {
  constructor() {
    this.STABLE_DATA_ATTRS = [
      'data-testid',
      'data-test',
      'data-qa',
      'data-cy',
      'data-id',
      'data-name'
    ];
  }

  /**
   * 提取元素的基本信息
   * @param {Element} element - DOM 元素
   * @returns {Object} 基本信息对象
   */
  getBasicInfo(element) {
    return {
      tag: element.tagName.toLowerCase(),
      classes: Array.from(element.classList),
      id: element.id || null,
      name: element.getAttribute('name'),
      type: element.getAttribute('type'),
      role: element.getAttribute('role'),
      dataAttrs: this.getDataAttributes(element)
    };
  }

  /**
   * 获取元素的 data-* 属性
   * @param {Element} element - DOM 元素
   * @returns {Object|null} data 属性对象
   */
  getDataAttributes(element) {
    const dataAttrs = {};
    Array.from(element.attributes).forEach((attr) => {
      if (attr.name.startsWith('data-')) {
        dataAttrs[attr.name] = attr.value;
      }
    });
    return Object.keys(dataAttrs).length > 0 ? dataAttrs : null;
  }

  /**
   * 提取元素的文本内容（限制长度）
   * @param {Element} element - DOM 元素
   * @param {number} maxLength - 最大长度
   * @returns {string|null} 文本内容
   */
  getTextContent(element, maxLength = 50) {
    let text = element.textContent || element.innerText || '';
    text = text.trim().replace(/\s+/g, ' ');

    if (text.length > maxLength) {
      text = `${text.substring(0, maxLength)}...`;
    }

    return text || null;
  }

  /**
   * 获取元素的父级路径
   * @param {Element} element - DOM 元素
   * @param {number} depth - 向上查找层级
   * @returns {Array} 父级路径数组
   */
  getParentPath(element, depth = 4) {
    const parents = [];
    let current = element.parentElement;
    let count = 0;

    while (current && current !== document.body && count < depth) {
      const info = {
        tag: current.tagName.toLowerCase(),
        classes: Array.from(current.classList),
        id: current.id || null
      };
      parents.push(info);
      current = current.parentElement;
      count += 1;
    }

    return parents;
  }

  /**
   * 生成 XPath 路径（回退用）
   * @param {Element} element - DOM 元素
   * @returns {string} XPath
   */
  getXPath(element) {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }

    const segments = [];
    let current = element;

    while (current && current.nodeType === Node.ELEMENT_NODE) {
      const tag = current.tagName.toLowerCase();
      let index = 1;
      let sibling = current.previousElementSibling;

      while (sibling) {
        if (sibling.tagName.toLowerCase() === tag) {
          index += 1;
        }
        sibling = sibling.previousElementSibling;
      }

      segments.unshift(`${tag}[${index}]`);
      current = current.parentElement;
    }

    return `/${segments.join('/')}`;
  }

  /**
   * 提供兼容性的 CSS.escape
   * @param {string} value - 原始值
   * @returns {string} 转义值
   */
  escapeCss(value) {
    if (!value) return '';
    if (window.CSS && typeof window.CSS.escape === 'function') {
      return window.CSS.escape(value);
    }

    return value.replace(/([ !"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, '\\\\$1');
  }

  /**
   * 判断 class 是否稳定
   * @param {string} className - class 名称
   * @returns {boolean} 是否稳定
   */
  isStableClass(className) {
    if (!className || className.length < 3) return false;
    if (this.isUtilityClass(className)) return false;

    const noisyPatterns = [
      /^css-[a-z0-9]{5,}$/i,
      /^jsx-[a-z0-9]{5,}$/i,
      /^_[a-z0-9]{5,}$/i,
      /^[a-z]{1,3}[0-9]{3,}$/i,
      /^[a-z0-9]{10,}$/i
    ];

    return !noisyPatterns.some((pattern) => pattern.test(className));
  }

  /**
   * 获取稳定 class（最多 3 个）
   * @param {Element} element - DOM 元素
   * @returns {Array<string>} 稳定 class
   */
  getStableClasses(element) {
    return Array.from(element.classList)
      .filter((className) => this.isStableClass(className))
      .slice(0, 3);
  }

  /**
   * 判断属性值是否可用于定位
   * @param {string|null} value - 属性值
   * @returns {boolean} 是否有效
   */
  isUsableAttrValue(value) {
    if (!value) return false;
    const trimmed = value.trim();
    return trimmed.length > 0 && trimmed.length <= 120;
  }

  /**
   * 统计选择器命中数
   * @param {string} selector - CSS 选择器
   * @returns {number} 命中数
   */
  getMatchCount(selector) {
    if (!selector) return 0;

    try {
      return document.querySelectorAll(selector).length;
    } catch (err) {
      return 0;
    }
  }

  /**
   * 计算 nth-of-type 片段
   * @param {Element} element - DOM 元素
   * @returns {string} 片段
   */
  getNthSegment(element) {
    const tag = element.tagName.toLowerCase();
    const siblings = element.parentElement
      ? Array.from(element.parentElement.children).filter(
        (child) => child.tagName.toLowerCase() === tag
      )
      : [];

    if (siblings.length <= 1) {
      return tag;
    }

    const index = siblings.indexOf(element) + 1;
    return `${tag}:nth-of-type(${index})`;
  }

  /**
   * 生成稳定的 full path 选择器
   * @param {Element} element - DOM 元素
   * @returns {string} CSS 路径
   */
  getFullPathSelector(element) {
    const path = [];
    let current = element;

    while (current && current.nodeType === Node.ELEMENT_NODE && current !== document.body) {
      const tag = current.tagName.toLowerCase();
      if (current.id && this.isUsableAttrValue(current.id)) {
        path.unshift(`#${this.escapeCss(current.id)}`);
        break;
      }

      const stableClasses = this.getStableClasses(current);
      if (stableClasses.length > 0) {
        path.unshift(
          `${tag}.${stableClasses.map((className) => this.escapeCss(className)).join('.')}`
        );
      } else {
        path.unshift(this.getNthSegment(current));
      }
      current = current.parentElement;
    }

    return path.join(' > ');
  }

  /**
   * 生成候选选择器
   * @param {Element} element - DOM 元素
   * @returns {Array<Object>} 候选选择器列表
   */
  buildCandidateSelectors(element) {
    const tag = element.tagName.toLowerCase();
    const stableClasses = this.getStableClasses(element);
    const text = this.getTextContent(element, 30);
    const candidates = [];

    const pushCandidate = (selector, strategy, baseScore) => {
      if (!selector) return;
      const matchCount = this.getMatchCount(selector);
      if (matchCount === 0) return;

      const uniquenessBonus = matchCount === 1 ? 30 : Math.max(0, 12 - matchCount);
      const score = baseScore + uniquenessBonus;
      candidates.push({ selector, strategy, score, matchCount });
    };

    if (this.isUsableAttrValue(element.id)) {
      pushCandidate(`#${this.escapeCss(element.id)}`, 'id', 95);
      pushCandidate(`${tag}#${this.escapeCss(element.id)}`, 'tag+id', 92);
    }

    this.STABLE_DATA_ATTRS.forEach((attr) => {
      const value = element.getAttribute(attr);
      if (this.isUsableAttrValue(value)) {
        pushCandidate(`[${attr}="${this.escapeCss(value)}"]`, attr, 90);
        pushCandidate(`${tag}[${attr}="${this.escapeCss(value)}"]`, `tag+${attr}`, 88);
      }
    });

    const ariaLabel = element.getAttribute('aria-label');
    if (this.isUsableAttrValue(ariaLabel)) {
      pushCandidate(`${tag}[aria-label="${this.escapeCss(ariaLabel)}"]`, 'aria-label', 82);
    }

    const name = element.getAttribute('name');
    if (this.isUsableAttrValue(name)) {
      const type = element.getAttribute('type');
      if (this.isUsableAttrValue(type)) {
        pushCandidate(`${tag}[name="${this.escapeCss(name)}"][type="${this.escapeCss(type)}"]`, 'name+type', 84);
      }
      pushCandidate(`${tag}[name="${this.escapeCss(name)}"]`, 'name', 78);
    }

    if (stableClasses.length > 0) {
      pushCandidate(
        `${tag}.${stableClasses.map((className) => this.escapeCss(className)).join('.')}`,
        'tag+stable-classes',
        76
      );

      pushCandidate(
        `.${this.escapeCss(stableClasses[0])}`,
        'first-stable-class',
        68
      );
    }

    const role = element.getAttribute('role');
    if (this.isUsableAttrValue(role) && text && text.length <= 18) {
      pushCandidate(`${tag}[role="${this.escapeCss(role)}"]`, 'role', 68);
    }

    const fullPath = this.getFullPathSelector(element);
    pushCandidate(fullPath, 'full-path', 62);

    const nthPath = this.getNthPathSelector(element);
    pushCandidate(nthPath, 'nth-path', 58);

    return candidates
      .sort((a, b) => b.score - a.score)
      .filter((item, index, array) => index === array.findIndex((entry) => entry.selector === item.selector));
  }

  /**
   * 生成 nth-of-type 路径（高兜底稳定性）
   * @param {Element} element - DOM 元素
   * @returns {string} nth 路径
   */
  getNthPathSelector(element) {
    const segments = [];
    let current = element;

    while (current && current.nodeType === Node.ELEMENT_NODE && current !== document.body) {
      segments.unshift(this.getNthSegment(current));
      current = current.parentElement;
    }

    return segments.join(' > ');
  }

  /**
   * 计算定位置信度
   * @param {Object|null} best - 最佳候选
   * @returns {number} 置信度 0-100
   */
  calculateConfidence(best) {
    if (!best) return 0;

    if (best.matchCount !== 1) {
      return Math.max(25, Math.min(65, best.score));
    }

    return Math.max(50, Math.min(99, best.score));
  }

  /**
   * 构建定位结果
   * @param {Element} element - DOM 元素
   * @returns {Object} 定位结果
   */
  buildLocator(element) {
    const candidates = this.buildCandidateSelectors(element);
    const best = candidates[0] || null;

    return {
      primarySelector: best ? best.selector : '',
      strategy: best ? best.strategy : 'unknown',
      matchCount: best ? best.matchCount : 0,
      confidence: this.calculateConfidence(best),
      candidates: candidates.slice(0, 3).map((item) => ({
        selector: item.selector,
        strategy: item.strategy,
        matchCount: item.matchCount,
        score: item.score
      })),
      cssPath: best ? best.selector : this.getFullPathSelector(element),
      xpath: this.getXPath(element)
    };
  }

  /**
   * 综合提取元素的所有信息
   * @param {Element} element - DOM 元素
   * @returns {Object} 完整信息对象
   */
  extract(element) {
    const basic = this.getBasicInfo(element);
    const text = this.getTextContent(element);
    const parents = this.getParentPath(element);
    const locator = this.buildLocator(element);

    const keywords = this.generateKeywords(basic, text);

    return {
      ...basic,
      text,
      parents,
      cssPath: locator.cssPath,
      xpath: locator.xpath,
      locator,
      keywords
    };
  }

  /**
   * 生成搜索关键词（过滤工具类，只保留有搜索价值的关键词）
   * @param {Object} basic - 基本信息
   * @param {string|null} text - 文本内容
   * @returns {Array} 关键词数组
   */
  generateKeywords(basic, text) {
    const keywords = new Set();

    basic.classes.forEach((cls) => {
      if (cls.length > 2 && !this.isUtilityClass(cls) && this.isStableClass(cls)) {
        keywords.add(cls);
      }
    });

    if (basic.id) {
      keywords.add(basic.id);
    }

    if (text && text.length > 0 && text.length < 20) {
      keywords.add(text);
    }

    if (basic.dataAttrs) {
      Object.entries(basic.dataAttrs).forEach(([key, value]) => {
        if (key.includes('testid') || key.includes('test') || key.includes('qa')) {
          keywords.add(value);
        }
      });
    }

    if (basic.name) {
      keywords.add(basic.name);
    }

    return Array.from(keywords).slice(0, 6);
  }

  /**
   * 判断是否为工具类（无搜索价值的样式类）
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
      /^(no-select|no-wrap)$/,
      /^(sr-only)$/,
      /^(ant-|el-|van-)/
    ];

    const allPatterns = [
      ...tailwindPatterns,
      ...bootstrapPatterns,
      ...utilityPatterns
    ];

    return allPatterns.some((pattern) => pattern.test(className));
  }
}

window.ElementExtractor = ElementExtractor;

} // end if
