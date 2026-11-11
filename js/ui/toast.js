import { escapeHtml } from '../calculator.js';
import { t } from '../i18n.js';

const stripExclamation = (text) => {
  if (typeof text !== 'string') return text;
  return text.replace(/!+/g, '');
};

export const showToast = (message) => {
  const toast = document.getElementById('toast');
  if (!toast) return;
  clearTimeout(toast._timer);
  clearTimeout(toast._hideTimer);
  const safeMessage = stripExclamation(message);
  toast.innerHTML = `<span>${safeMessage}</span>`;
  toast.classList.remove('visible');
  toast.style.display = 'inline-flex';
  void toast.offsetWidth;
  requestAnimationFrame(() => {
    toast.classList.add('visible');
  });
  toast._timer = setTimeout(() => {
    toast.classList.remove('visible');
    toast._hideTimer = setTimeout(() => {
      if (!toast.classList.contains('visible')) {
        toast.style.display = 'none';
      }
    }, 600);
  }, 2500);
};

export const showToastWithAction = (message, actionText, actionCallback, duration = 8000) => {
  const toast = document.getElementById('toast');
  if (!toast) return;
  clearTimeout(toast._timer);
  clearTimeout(toast._hideTimer);
  const safeMessage = stripExclamation(message);
  const cleanActionText = stripExclamation(actionText || t('btn_undo', 'Hoàn tác'));
  toast.innerHTML = `
    <span>${safeMessage}</span>
    <button type="button" class="toast-action-btn" id="btnToastAction" title="${escapeHtml(cleanActionText)}" aria-label="${escapeHtml(cleanActionText)}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
        <path d="M3 3v5h5"></path>
      </svg>
    </button>
  `;
  toast.classList.remove('visible');
  toast.style.display = 'inline-flex';
  void toast.offsetWidth;
  requestAnimationFrame(() => {
    toast.classList.add('visible');
  });

  const btn = document.getElementById('btnToastAction');
  if (btn) {
    btn.onclick = () => {
      clearTimeout(toast._timer);
      clearTimeout(toast._hideTimer);
      toast.classList.remove('visible');
      toast._hideTimer = setTimeout(() => {
        if (!toast.classList.contains('visible')) toast.style.display = 'none';
      }, 600);
      if (typeof actionCallback === 'function') actionCallback();
    };
  }

  toast._timer = setTimeout(() => {
    toast.classList.remove('visible');
    toast._hideTimer = setTimeout(() => {
      if (!toast.classList.contains('visible')) toast.style.display = 'none';
    }, 600);
  }, duration);
};
