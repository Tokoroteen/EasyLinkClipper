// EasyLinkClipper content script

(function() {
  // タイトル候補のセレクタ
  const TITLE_SELECTORS = ['h1', '.page-title'];
  let inserted = false;
  let elcShowLink = true; // "Copy link"ボタン表示
  let elcShowTitleLink = true; // "Copy title & link"ボタン表示
  let elcShowPattern = '';
  let elcUrlExtract = '';
  let elcButtonColor = 'default';

  // storage変更時に反映
  chrome.storage && chrome.storage.onChanged && chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync') {
      if (changes.elcShowLink !== undefined) elcShowLink = changes.elcShowLink.newValue;
      if (changes.elcShowTitleLink !== undefined) elcShowTitleLink = changes.elcShowTitleLink.newValue;
      if (changes.elcShowPattern !== undefined) elcShowPattern = changes.elcShowPattern.newValue;
      if (changes.elcUrlExtract !== undefined) elcUrlExtract = changes.elcUrlExtract.newValue;
      if (changes.elcButtonColor !== undefined) elcButtonColor = changes.elcButtonColor.newValue;
      removeButtons();
      if (shouldShowButtons()) insertButtons();
    }
  });

  // ポップアップからの即時反映用メッセージ受信
  if (chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
      if (msg && msg.type === 'elc-setting-changed') {
        // 設定を再取得して反映
        if (chrome.storage && chrome.storage.sync) {
          chrome.storage.sync.get({ elcShowLink: true, elcShowTitleLink: true, elcShowPattern: 'articles', elcUrlExtract: '^(.+/articles/\\d+)', elcButtonColor: 'default' }, (items) => {
            elcShowLink = items.elcShowLink;
            elcShowTitleLink = items.elcShowTitleLink;
            elcShowPattern = items.elcShowPattern || '';
            elcUrlExtract = items.elcUrlExtract || '';
            elcButtonColor = items.elcButtonColor || 'default';
            removeButtons();
            if (shouldShowButtons()) insertButtons();
          });
        }
      }
    });
  }

  function removeButtons() {
    document.querySelectorAll('.elc-copy-btn').forEach(btn => btn.remove());
    document.querySelectorAll('.elc-button-container').forEach(container => container.remove());
    inserted = false;
  }

  function findTitleElement() {
    for (const selector of TITLE_SELECTORS) {
      const el = document.querySelector(selector);
      if (el && el.offsetParent !== null) return el;
    }
    return null;
  }

  function processUrl(url) {
    if (elcUrlExtract) {
      try {
        const re = new RegExp(elcUrlExtract);
        const m = url.match(re);
        if (m) {
          return m[1] || m[0];
        }
      } catch (e) {
        // 無効な正規表現の場合はそのまま返す
        return url;
      }
    }
    return url;
  }

  function createButton(label, onClick) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = elcButtonColor === 'default' ? 'elc-copy-btn' : `elc-copy-btn elc-color-${elcButtonColor}`;
    btn.textContent = label;
    btn.addEventListener('click', onClick);
    return btn;
  }

  function showToast(copiedText) {
    // 既存のトーストがあれば削除
    const old = document.getElementById('elc-toast');
    if (old) old.remove();
    const toast = document.createElement('div');
    toast.id = 'elc-toast';
    toast.className = 'elc-toast';
    toast.innerHTML = `✅ Copied<br><span>${copiedText}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 1000);
  }

  function shouldShowButtons() {
    if (!(elcShowLink || elcShowTitleLink)) return false;
    if (!elcShowPattern) return true;
    try {
      return new RegExp(elcShowPattern).test(location.href);
    } catch (e) {
      // 無効な正規表現の場合は非表示
      return false;
    }
  }

  function insertButtons() {
    if (!shouldShowButtons()) return;
    if (inserted) return;
    const titleEl = findTitleElement();
    if (!titleEl) return;
    if (titleEl.querySelector('.elc-button-container')) return;

    const url = processUrl(location.href);
    const title = titleEl.textContent.trim();

    // ボタンコンテナを作成
    const buttonContainer = document.createElement('span');
    buttonContainer.className = 'elc-button-container';
    buttonContainer.style.cssText = 'display: inline-flex !important; align-items: center !important; gap: 4px !important; margin-left: 8px !important;';

    if (elcShowLink) {
      const btnLink = createButton('Copy link', async () => {
        await navigator.clipboard.writeText(url);
        showToast(url);
      });
      // margin-leftを削除（コンテナで管理）
      btnLink.style.marginLeft = '0 !important';
      buttonContainer.appendChild(btnLink);
    }
    if (elcShowTitleLink) {
      const btnTitleLink = createButton('Copy title & link', async () => {
        const text = `[${title}](${url})`;
        await navigator.clipboard.writeText(text);
        showToast(text);
      });
      // margin-leftを削除（コンテナで管理）
      btnTitleLink.style.marginLeft = '0 !important';
      buttonContainer.appendChild(btnTitleLink);
    }

    titleEl.appendChild(buttonContainer);
    inserted = true;
  }

  // 初期設定取得→ボタン挿入
  function init() {
    if (chrome.storage && chrome.storage.sync) {
      chrome.storage.sync.get({ elcShowLink: true, elcShowTitleLink: true, elcShowPattern: 'articles', elcUrlExtract: '^(.+/articles/\\d+)', elcButtonColor: 'default' }, (items) => {
        elcShowLink = items.elcShowLink;
        elcShowTitleLink = items.elcShowTitleLink;
        elcShowPattern = items.elcShowPattern || '';
        elcUrlExtract = items.elcUrlExtract || '';
        elcButtonColor = items.elcButtonColor || 'default';
        if (shouldShowButtons()) {
          insertButtons();
        } else {
          removeButtons();
        }
      });
    } else {
      if (shouldShowButtons()) {
        insertButtons();
      } else {
        removeButtons();
      }
    }
  }

  // DOMContentLoaded後に実行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();