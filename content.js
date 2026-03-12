/**
 * Content Script
 * 注入到页面中，负责元素选择和信息提取
 */

class ElementLocator {
  constructor() {
    this.extractor = new window.ElementExtractor();
    this.detector = new window.FrameworkDetector();
    this.formatter = new window.OutputFormatter();
    this.isActive = false;
    this.highlightedElement = null;
    this.overlay = null;
    this.banner = null;
    this.lastInfo = null;
    this.lastFramework = null;
    this.originalCursor = '';

    this.init();
  }

  init() {
    this.bindMessageListener();
    this.restoreState();
  }

  /**
   * 绑定消息监听
   */
  bindMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      switch (request.action) {
        case 'toggle':
          this.toggle();
          sendResponse({ active: this.isActive });
          break;
        case 'getStatus':
          sendResponse({ active: this.isActive });
          break;
        default:
          sendResponse({ active: this.isActive });
      }
      return true;
    });
  }

  /**
   * 恢复之前的状态
   */
  restoreState() {
    const savedState = localStorage.getItem('element-locator-active');
    if (savedState === 'true') {
      setTimeout(() => {
        this.activate();
      }, 300);
    }
  }

  /**
   * 切换激活状态
   */
  toggle() {
    this.isActive ? this.deactivate() : this.activate();
    this.saveState();
  }

  /**
   * 激活选择模式
   */
  activate() {
    if (this.isActive) return;

    this.isActive = true;
    this.originalCursor = document.body.style.cursor;
    document.body.style.cursor = 'crosshair';

    document.addEventListener('mouseover', this.handleMouseOver, true);
    document.addEventListener('mouseout', this.handleMouseOut, true);
    document.addEventListener('click', this.handleClick, true);
    document.addEventListener('keydown', this.handleKeyDown, true);

    this.showNotification('元素定位器已激活 - 点击元素提取信息，按 ESC 退出；按住 Alt 点击可选择父节点', 3500);
    this.saveState();
  }

  /**
   * 停用选择模式
   */
  deactivate() {
    if (!this.isActive) return;

    this.isActive = false;
    document.body.style.cursor = this.originalCursor || '';

    document.removeEventListener('mouseover', this.handleMouseOver, true);
    document.removeEventListener('mouseout', this.handleMouseOut, true);
    document.removeEventListener('click', this.handleClick, true);
    document.removeEventListener('keydown', this.handleKeyDown, true);

    if (this.highlightedElement) {
      this.highlightedElement.classList.remove('element-locator-highlight');
      this.highlightedElement = null;
    }

    this.saveState();
  }

  /**
   * 检查是否为插件自身元素
   */
  isPluginElement(element) {
    if (!element || typeof element.closest !== 'function') return false;

    return Boolean(
      element.closest('.element-locator-banner') ||
      element.closest('.element-locator-notification')
    );
  }

  /**
   * 从事件中提取 Element
   */
  getEventElement(event) {
    const path = typeof event.composedPath === 'function' ? event.composedPath() : [];

    if (path.length > 0) {
      const fromPath = path.find((item) => item && item.nodeType === Node.ELEMENT_NODE);
      if (fromPath) return fromPath;
    }

    const target = event.target;
    if (target && target.nodeType === Node.ELEMENT_NODE) {
      return target;
    }

    return null;
  }

  /**
   * 判断是否是更适合作为业务定位的节点
   */
  isMeaningfulNode(element) {
    if (!element) return false;

    const tag = element.tagName.toLowerCase();
    const meaningfulTags = ['button', 'a', 'input', 'textarea', 'select', 'label', 'option', 'img'];

    if (meaningfulTags.includes(tag)) return true;
    if (element.id) return true;
    if (element.hasAttribute('name')) return true;
    if (element.hasAttribute('data-testid') || element.hasAttribute('data-test') || element.hasAttribute('data-qa')) return true;
    if (element.hasAttribute('aria-label') || element.hasAttribute('role')) return true;

    const classCount = element.classList ? element.classList.length : 0;
    if (classCount > 0 && classCount <= 4) return true;

    return false;
  }

  /**
   * 纠偏目标节点，避免选到纯展示子节点（icon/span/path 等）
   */
  resolveTargetElement(rawElement, preferParent = false) {
    if (!rawElement) return null;

    let current = rawElement;
    let level = 0;
    const maxLevel = 5;

    while (current && level < maxLevel) {
      if (this.isPluginElement(current)) {
        return null;
      }

      const tag = current.tagName.toLowerCase();
      const isDecorative = ['path', 'svg', 'use', 'i', 'em', 'strong'].includes(tag);

      if (!isDecorative && this.isMeaningfulNode(current)) {
        return preferParent && current.parentElement ? current.parentElement : current;
      }

      current = current.parentElement;
      level += 1;
    }

    return preferParent && rawElement.parentElement ? rawElement.parentElement : rawElement;
  }

  /**
   * 鼠标移入事件处理
   */
  handleMouseOver = (e) => {
    if (!this.isActive) return;

    const rawElement = this.getEventElement(e);
    const target = this.resolveTargetElement(rawElement);
    if (!target || this.isPluginElement(target)) return;

    if (this.highlightedElement && this.highlightedElement !== target) {
      this.highlightedElement.classList.remove('element-locator-highlight');
    }

    target.classList.add('element-locator-highlight');
    this.highlightedElement = target;
  }

  /**
   * 鼠标移出事件处理
   */
  handleMouseOut = (e) => {
    if (!this.isActive) return;

    const rawElement = this.getEventElement(e);
    if (rawElement && rawElement.classList) {
      rawElement.classList.remove('element-locator-highlight');
    }
  }

  /**
   * 点击事件处理
   */
  handleClick = (e) => {
    if (!this.isActive) return;

    const rawElement = this.getEventElement(e);
    const target = this.resolveTargetElement(rawElement, e.altKey);

    if (!target || this.isPluginElement(target)) return;

    e.preventDefault();
    e.stopPropagation();

    const info = this.extractor.extract(target);
    const framework = this.detector.detect(target);
    const output = this.formatter.toMarkdown(info, framework);

    this.lastInfo = info;
    this.lastFramework = framework;
    this.showEditBanner(output);
    this.deactivate();
  }

  /**
   * 键盘事件处理
   */
  handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      this.deactivate();
      this.hideEditBanner();
    }
  }

  /**
   * 保存状态
   */
  saveState() {
    localStorage.setItem('element-locator-active', this.isActive.toString());
  }

  /**
   * 复制文本到剪贴板
   */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    }
  }

  /**
   * 显示可编辑横幅
   */
  showEditBanner(content) {
    this.hideEditBanner();

    const banner = document.createElement('div');
    banner.className = 'element-locator-banner';

    const container = document.createElement('div');

    const header = document.createElement('div');
    header.className = 'element-locator-banner-header';

    const title = document.createElement('span');
    title.className = 'element-locator-banner-title';
    title.textContent = '元素定位信息';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'element-locator-banner-close';
    closeBtn.title = '关闭';
    closeBtn.textContent = '×';

    header.appendChild(title);
    header.appendChild(closeBtn);

    const body = document.createElement('div');
    body.className = 'element-locator-banner-body';

    const textarea = document.createElement('textarea');
    textarea.className = 'element-locator-banner-textarea';
    textarea.spellcheck = false;
    textarea.value = content;

    body.appendChild(textarea);

    const footer = document.createElement('div');
    footer.className = 'element-locator-banner-footer';

    const actions = document.createElement('div');
    actions.className = 'element-locator-banner-actions';

    const formatBtn = document.createElement('button');
    formatBtn.className = 'element-locator-banner-btn element-locator-banner-btn-secondary';
    formatBtn.setAttribute('data-action', 'format');
    formatBtn.textContent = '切换格式';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'element-locator-banner-btn element-locator-banner-btn-primary';
    copyBtn.setAttribute('data-action', 'copy');
    copyBtn.textContent = '复制';

    actions.appendChild(formatBtn);
    actions.appendChild(copyBtn);
    footer.appendChild(actions);

    container.appendChild(header);
    container.appendChild(body);
    container.appendChild(footer);
    banner.appendChild(container);

    document.body.appendChild(banner);
    this.banner = banner;

    closeBtn.addEventListener('click', () => this.hideEditBanner());

    copyBtn.addEventListener('click', async () => {
      await this.copyToClipboard(textarea.value);
      copyBtn.textContent = '已复制';
      setTimeout(() => {
        copyBtn.textContent = '复制';
      }, 2000);
    });

    formatBtn.addEventListener('click', () => {
      const currentText = textarea.value;
      let newFormat;

      if (currentText.includes('**页面信息**')) {
        newFormat = this.formatter.toJSON(this.lastInfo, this.lastFramework);
      } else if (currentText.trim().startsWith('{')) {
        newFormat = this.formatter.toAIFriendly(this.lastInfo, this.lastFramework);
      } else {
        newFormat = this.formatter.toMarkdown(this.lastInfo, this.lastFramework);
      }

      textarea.value = newFormat;
    });

    banner.addEventListener('click', (e) => {
      if (e.target === banner) this.hideEditBanner();
    });

    const escHandler = (e) => {
      if (e.key === 'Escape') {
        this.hideEditBanner();
        document.removeEventListener('keydown', escHandler, true);
      }
    };
    document.addEventListener('keydown', escHandler, true);
  }

  /**
   * 隐藏编辑横幅
   */
  hideEditBanner() {
    if (this.banner?.parentElement) {
      this.banner.parentElement.removeChild(this.banner);
      this.banner = null;
    }
  }

  /**
   * 显示通知提示
   */
  showNotification(message, duration = 0) {
    this.hideNotification();

    const notification = document.createElement('div');
    notification.className = 'element-locator-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    this.overlay = notification;

    if (duration > 0) {
      setTimeout(() => this.hideNotification(), duration);
    }
  }

  /**
   * 隐藏通知提示
   */
  hideNotification() {
    if (this.overlay?.parentElement) {
      this.overlay.parentElement.removeChild(this.overlay);
      this.overlay = null;
    }
  }
}

const elementLocator = new ElementLocator();
