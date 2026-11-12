// Content, navigation, and downloads remain usable without JavaScript.
import { initScrollMotion } from './motion.js';
document.documentElement.classList.add('js');

const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#main-nav');
function closeMenu() {
  menu?.setAttribute('aria-expanded', 'false');
  menu?.setAttribute('aria-label', menu.dataset.openLabel);
  nav?.classList.remove('is-open');
}
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? menu.dataset.closeLabel : menu.dataset.openLabel);
  nav.classList.toggle('is-open', open);
});
nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
    closeMenu(); menu.focus();
  }
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.nav-shell')) closeMenu();
});

for (const group of document.querySelectorAll('[data-tabs]')) {
  const list = group.querySelector('.tab-list');
  const tabs = [...list.querySelectorAll('[data-tab]')];
  const panels = [...group.querySelectorAll('[data-panel]')];
  list.setAttribute('role', 'tablist');
  function activate(tab, focus = false) {
    for (const item of tabs) {
      const active = item === tab;
      item.setAttribute('role', 'tab');
      item.setAttribute('aria-selected', String(active));
      item.setAttribute('aria-controls', `panel-${item.dataset.tab}`);
      item.tabIndex = active ? 0 : -1;
      item.toggleAttribute('data-active', active);
    }
    for (const panel of panels) {
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', `tab-${panel.dataset.panel}`);
      panel.hidden = panel.dataset.panel !== tab.dataset.tab;
      panel.tabIndex = 0;
    }
    if (focus) tab.focus({ preventScroll: true });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', (event) => {
      const direction = document.documentElement.dir === 'rtl' ? -1 : 1;
      let next;
      if (event.key === 'ArrowRight') next = (index + direction + tabs.length) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index - direction + tabs.length) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next !== undefined) { event.preventDefault(); activate(tabs[next], true); }
    });
  });
  activate(tabs[0]);
}

const dialog = document.querySelector('#screenshot-dialog');
let opener;
if (dialog && typeof dialog.showModal === 'function') {
  const image = dialog.querySelector('img');
  document.querySelectorAll('[data-screenshot]').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault(); opener = link;
      image.src = link.href; image.alt = link.querySelector('img').alt;
      dialog.showModal();
    });
  });
  dialog.querySelector('[data-dialog-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => opener?.focus({ preventScroll: true }));
}

document.querySelector('[data-copy]')?.addEventListener('click', async (event) => {
  const button = event.currentTarget;
  const value = document.querySelector('#checksum-value').textContent;
  const status = document.querySelector('.copy-status');
  try {
    await navigator.clipboard.writeText(value);
    status.textContent = button.dataset.success;
  } catch {
    status.textContent = button.dataset.failure;
    const range = document.createRange(); range.selectNodeContents(document.querySelector('#checksum-value'));
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
  }
});

// Keep the reader in the same section when switching languages.
document.querySelectorAll('.languages a').forEach(link => {
  link.addEventListener('click', () => { link.hash = window.location.hash; });
});

initScrollMotion();
