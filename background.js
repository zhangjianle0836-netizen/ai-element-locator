/**
 * Background Script
 * 后台服务工作器
 */

// 监听扩展图标点击
chrome.action.onClicked.addListener((tab) => {
  // 如果没有 popup，可以直接在这里处理点击事件
  // 但我们使用了 popup.html，所以这个监听器不会被触发
});

// 监听来自 content script 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'copy') {
    // 如果需要，可以在这里处理复制操作
    // 但我们在 content script 中已经处理了
  }
});

// 安装或更新时的处理
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('元素定位器已安装');
  } else if (details.reason === 'update') {
    console.log('元素定位器已更新到版本', chrome.runtime.getManifest().version);
  }
});
