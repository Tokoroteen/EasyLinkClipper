document.addEventListener('DOMContentLoaded', () => {
  const toggleTitle = document.getElementById('elc-toggle-title');
  const toggleLink = document.getElementById('elc-toggle-link');
  const toggleTitleLink = document.getElementById('elc-toggle-titlelink');
  const patternInput = document.getElementById('elc-show-pattern');
  const urlExtractInput = document.getElementById('elc-url-extract');
  const colorInputs = document.querySelectorAll('input[name="elc-button-color"]');
  // 設定を復元
  chrome.storage.sync.get({ elcShowTitle: false, elcShowLink: true, elcShowTitleLink: true, elcShowPattern: 'articles', elcUrlExtract: '^(.+/articles/\\d+)', elcButtonColor: 'default' }, (items) => {
    toggleTitle.checked = items.elcShowTitle;
    toggleLink.checked = items.elcShowLink;
    toggleTitleLink.checked = items.elcShowTitleLink;
    patternInput.value = items.elcShowPattern || '';
    urlExtractInput.value = items.elcUrlExtract || '';
    // ボタンカラーの復元
    const selectedColor = items.elcButtonColor || 'default';
    document.getElementById(`elc-color-${selectedColor}`).checked = true;
  });
  // 変更時に保存＋アクティブタブに通知
  function notifyContentScript() {
    chrome.tabs && chrome.tabs.query && chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0] && tabs[0].id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'elc-setting-changed' }, (response) => {
          // エラーを無視（content scriptがない場合など）
          if (chrome.runtime.lastError) {
            // エラーをクリアするために何もしない
          }
        });
      }
    });
  }
  toggleTitle.addEventListener('change', () => {
    chrome.storage.sync.set({ elcShowTitle: toggleTitle.checked }, notifyContentScript);
  });
  toggleLink.addEventListener('change', () => {
    chrome.storage.sync.set({ elcShowLink: toggleLink.checked }, notifyContentScript);
  });
  toggleTitleLink.addEventListener('change', () => {
    chrome.storage.sync.set({ elcShowTitleLink: toggleTitleLink.checked }, notifyContentScript);
  });
  patternInput.addEventListener('input', () => {
    chrome.storage.sync.set({ elcShowPattern: patternInput.value }, notifyContentScript);
  });
  urlExtractInput.addEventListener('input', () => {
    chrome.storage.sync.set({ elcUrlExtract: urlExtractInput.value }, notifyContentScript);
  });
  // ボタンカラーの変更
  colorInputs.forEach(input => {
    input.addEventListener('change', () => {
      chrome.storage.sync.set({ elcButtonColor: input.value }, notifyContentScript);
    });
  });

  // デフォルト設定リセット
  const resetButton = document.getElementById('elc-reset-defaults');
  resetButton.addEventListener('click', () => {
    if (confirm('Reset all settings to default values. Are you sure?')) {
      const defaultSettings = {
        elcShowTitle: false,
        elcShowLink: true,
        elcShowTitleLink: true,
        elcShowPattern: 'articles',
        elcUrlExtract: '^(.+/articles/\\d+)',
        elcButtonColor: 'default'
      };

      chrome.storage.sync.set(defaultSettings, () => {
        // UIを更新
        toggleTitle.checked = defaultSettings.elcShowTitle;
        toggleLink.checked = defaultSettings.elcShowLink;
        toggleTitleLink.checked = defaultSettings.elcShowTitleLink;
        patternInput.value = defaultSettings.elcShowPattern;
        urlExtractInput.value = defaultSettings.elcUrlExtract;
        document.getElementById('elc-color-default').checked = true;

        // コンテンツスクリプトに通知
        notifyContentScript();
      });
    }
  });
});