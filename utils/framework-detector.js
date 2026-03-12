/**
 * 框架检测器
 * 检测页面使用的框架（Vue/React）并提取组件信息
 */

// 避免重复声明
if (typeof window.FrameworkDetector === 'undefined') {

class FrameworkDetector {
  /**
   * 检测元素是否属于 Vue 应用
   * @param {Element} element - DOM 元素
   * @returns {boolean} 是否为 Vue 元素
   */
  isVue(element) {
    // Vue 2
    if (element.__vue__) {
      return true;
    }
    // Vue 3
    if (element._vnode) {
      return true;
    }
    // 检查父元素
    let parent = element.parentElement;
    while (parent) {
      if (parent.__vue__ || parent._vnode || parent.__vueParentReference) {
        return true;
      }
      parent = parent.parentElement;
    }
    return false;
  }

  /**
   * 检测元素是否属于 React 应用
   * @param {Element} element - DOM 元素
   * @returns {boolean} 是否为 React 元素
   */
  isReact(element) {
    // React 16+ 使用 fiber
    for (const key in element) {
      if (key.startsWith('__reactFiber$') || key.startsWith('__reactInternalInstance$')) {
        return true;
      }
    }
    return false;
  }

  /**
   * 获取 Vue 组件名称
   * @param {Element} element - DOM 元素
   * @returns {string|null} 组件名称
   */
  getVueComponentName(element) {
    // Vue 2
    if (element.__vue__ && element.__vue__.$options) {
      return element.__vue__.$options.name || null;
    }

    // Vue 3 - 查找最近的 Vue 元素
    let current = element;
    while (current) {
      if (current._vnode && current._vnode.type) {
        return current._vnode.type.name || null;
      }
      if (current.__vueParentReference) {
        const component = current.__vueParentReference;
        if (component.type && component.type.name) {
          return component.type.name;
        }
      }
      current = current.parentElement;
    }

    return null;
  }

  /**
   * 获取 React 组件名称
   * @param {Element} element - DOM 元素
   * @returns {string|null} 组件名称
   */
  getReactComponentName(element) {
    for (const key in element) {
      if (key.startsWith('__reactFiber$') || key.startsWith('__reactInternalInstance$')) {
        const fiber = element[key];
        // 遍历 fiber 树查找组件名称
        let currentFiber = fiber;
        while (currentFiber) {
          if (currentFiber.type && typeof currentFiber.type === 'function') {
            return currentFiber.type.displayName || currentFiber.type.name || null;
          }
          currentFiber = currentFiber.return;
        }
      }
    }
    return null;
  }

  /**
   * 综合检测框架和组件信息
   * @param {Element} element - DOM 元素
   * @returns {Object} 框架信息对象
   */
  detect(element) {
    const result = {
      isVue: false,
      isReact: false,
      componentName: null,
      framework: '原生'
    };

    result.isVue = this.isVue(element);
    result.isReact = this.isReact(element);

    if (result.isVue) {
      result.framework = 'Vue';
      result.componentName = this.getVueComponentName(element);
    } else if (result.isReact) {
      result.framework = 'React';
      result.componentName = this.getReactComponentName(element);
    }

    return result;
  }
}

// 导出给其他模块使用
window.FrameworkDetector = FrameworkDetector;

} // end if
