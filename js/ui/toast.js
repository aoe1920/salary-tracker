import { escapeHtml } from '../calculator.js';
import { t } from '../i18n.js';

const stripExclamation = (text) => {
  if (typeof text !== 'string') return text;
  return text.replace(/!+/g, '');
};

const spawnPushedExitToast = (toastEl) => {
  if (!toastEl || !toastEl.classList.contains('visible')) return;
  document.querySelectorAll('.toast-capsule.toast-pushed-exit').forEach(el => el.remove());

  const ghost = toastEl.cloneNode(true);
  ghost.removeAttribute('id');
  ghost.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
  ghost.classList.remove('visible');
  ghost.classList.add('toast-pushed-exit');
  ghost.style.display = 'inline-flex';
  ghost.setAttribute('aria-hidden', 'true');

  toastEl.parentNode.insertBefore(ghost, toastEl);
  void ghost.offsetWidth;
  requestAnimationFrame(() => {
    ghost.classList.add('is-exiting');
  });
  setTimeout(() => {
    ghost.remove();
  }, 580);
};

const showToastInternal = (htmlContent, duration, onAfterMount = null) => {
  const toast = document.getElementById('toast');
  if (!toast) return;

  clearTimeout(toast._timer);
  clearTimeout(toast._hideTimer);

  if (toast.classList.contains('visible')) {
    spawnPushedExitToast(toast);
  }

  toast.style.transition = 'none';
  toast.classList.remove('visible');
  toast.innerHTML = htmlContent;
  toast.style.display = 'inline-flex';
  void toast.offsetWidth;
  toast.style.transition = '';

  if (typeof onAfterMount === 'function') {
    onAfterMount(toast);
  }

  requestAnimationFrame(() => {
    toast.classList.add('visible');
  });

  toast._timer = setTimeout(() => {
    toast.classList.remove('visible');
    toast._hideTimer = setTimeout(() => {
      if (!toast.classList.contains('visible')) {
        toast.style.display = 'none';
      }
    }, 640);
  }, duration);
};

export const showToast = (message) => {
  const safeMessage = stripExclamation(message);
  showToastInternal(`<span>${safeMessage}</span>`, 2500);
};

export const showToastWithAction = (message, actionText, actionCallback, duration = 8000) => {
  const safeMessage = stripExclamation(message);
  const cleanActionText = stripExclamation(actionText || t('btn_undo', 'Hoàn tác'));
  const html = `
    <span>${safeMessage}</span>
    <button type="button" class="toast-action-btn" id="btnToastAction" title="${escapeHtml(cleanActionText)}" aria-label="${escapeHtml(cleanActionText)}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
        <path d="M3 3v5h5"></path>
      </svg>
    </button>
  `;
  showToastInternal(html, duration, (toast) => {
    const btn = document.getElementById('btnToastAction');
    if (btn) {
      btn.onclick = () => {
        clearTimeout(toast._timer);
        clearTimeout(toast._hideTimer);
        toast.classList.remove('visible');
        toast._hideTimer = setTimeout(() => {
          if (!toast.classList.contains('visible')) toast.style.display = 'none';
        }, 640);
        if (typeof actionCallback === 'function') actionCallback();
      };
    }
  });
};
