/**
 * Popup Script
 * 控制弹窗界面的交互
 */

document.addEventListener('DOMContentLoaded', function() {
  const toggleBtn = document.getElementById('toggleBtn');
  const statusDot = document.getElementById('statusDot');
  const statusText = document.getElementById('statusText');

  let isActive = false;

  // 初始化
  init();

  function init() {
    bindEvents();
    queryCurrentStatus();
  }

  /**
   * 绑定事件
   */
  function bindEvents() {
    toggleBtn.addEventListener('click', handleToggle);
  }

  /**
   * 查询当前状态
   */
  function queryCurrentStatus() {
    sendMessageToCurrentTab({ action: 'getStatus' }, (response) => {
      updateUI(response?.active || false);
    }, () => {
      updateUI(false);
    });
  }

  /**
   * 处理主按钮点击
   */
  function handleToggle() {
    sendMessageToCurrentTab({ action: 'toggle' }, (response) => {
      updateUI(response?.active || false);
    }, () => {
      // Content script 未加载，尝试注入
      injectContentScript(() => {
        setTimeout(() => {
          sendMessageToCurrentTab({ action: 'toggle' }, (response) => {
            updateUI(response?.active || false);
          });
        }, 200);
      });
    });
  }

  /**
   * 发送消息到当前标签页
   */
  function sendMessageToCurrentTab(message, onSuccess, onError) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) {
        onError?.();
        return;
      }

      chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
        if (chrome.runtime.lastError) {
          onError?.();
        } else {
          onSuccess?.(response);
        }
      });
    });
  }

  /**
   * 注入 content script
   */
  function injectContentScript(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;

      const tabId = tabs[0].id;

      // 先注入 CSS
      chrome.scripting.insertCSS({
        target: { tabId },
        files: ['styles.css']
      }, () => {
        if (chrome.runtime.lastError) return;

        // 再注入 JS
        chrome.scripting.executeScript({
          target: { tabId },
          files: [
            'utils/extractor.js',
            'utils/framework-detector.js',
            'utils/formatter.js',
            'content.js'
          ]
        }, () => {
          if (!chrome.runtime.lastError) {
            callback?.();
          }
        });
      });
    });
  }

  /**
   * 更新 UI 状态
   */
  function updateUI(active) {
    isActive = active;
    toggleBtn.textContent = active ? '停止选择' : '开始选择';
    toggleBtn.classList.toggle('active', active);
    statusDot.classList.toggle('active', active);
    statusText.textContent = active ? '选择模式已激活' : '未激活';
  }
});
