const PATTERNS = {
  light: 15,
  medium: 25,
  heavy: 40,
  success: [15, 45, 20],
  warning: [20, 45, 20],
  danger: [30, 50, 30]
};

let lastHapticTime = 0;
let lastHapticType = '';

export const triggerHaptic = (type = 'light') => {
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return;
  try {
    const now = Date.now();
    const isPriority = type === 'success' || type === 'danger' || type === 'warning' || type === 'heavy';
    if (!isPriority && now - lastHapticTime < 80) {
      return;
    }
    const pattern = PATTERNS[type] || PATTERNS.light;
    navigator.vibrate(pattern);
    lastHapticTime = now;
    lastHapticType = type;
  } catch (e) {
  }
};

const INTERACTIVE_SELECTOR = 'button, [role="button"], a.btn, input[type="button"], input[type="submit"], input[type="checkbox"], input[type="radio"], summary, .btn, .btn-icon, .dock-fab, .dock-btn, .week-wheel-item, .modal-close, [data-haptic]';

let lastHandledElement = null;
let lastHandledTime = 0;

const handleInteractiveTouch = (e) => {
  if (!e.target || typeof e.target.closest !== 'function') return;
  const target = e.target.closest(INTERACTIVE_SELECTOR);
  if (!target) return;
  if (target.disabled || target.hasAttribute('disabled') || target.classList.contains('disabled')) return;

  const hapticSetting = target.getAttribute('data-haptic');
  if (hapticSetting === 'none') return;

  const now = Date.now();
  lastHandledElement = target;
  lastHandledTime = now;

  let type = hapticSetting;
  if (!type) {
    if (target.classList.contains('dock-fab') || target.classList.contains('btn-primary')) {
      type = 'medium';
    } else if (target.classList.contains('btn-danger') || target.classList.contains('danger')) {
      type = 'danger';
    } else {
      type = 'light';
    }
  }

  triggerHaptic(type);
};

const handleClickFallback = (e) => {
  if (!e.target || typeof e.target.closest !== 'function') return;
  const target = e.target.closest(INTERACTIVE_SELECTOR);
  if (!target) return;
  if (target.disabled || target.hasAttribute('disabled') || target.classList.contains('disabled')) return;

  const now = Date.now();
  if (target === lastHandledElement && now - lastHandledTime < 450) {
    return;
  }

  const hapticSetting = target.getAttribute('data-haptic');
  if (hapticSetting === 'none') return;

  lastHandledElement = target;
  lastHandledTime = now;

  let type = hapticSetting;
  if (!type) {
    if (target.classList.contains('dock-fab') || target.classList.contains('btn-primary')) {
      type = 'medium';
    } else if (target.classList.contains('btn-danger') || target.classList.contains('danger')) {
      type = 'danger';
    } else {
      type = 'light';
    }
  }

  triggerHaptic(type);
};

let isGlobalHapticsInitialized = false;

export const initGlobalHaptics = () => {
  if (isGlobalHapticsInitialized) return;
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  isGlobalHapticsInitialized = true;
  document.addEventListener('pointerdown', handleInteractiveTouch, { capture: true, passive: true });
  document.addEventListener('click', handleClickFallback, { capture: true, passive: true });
};

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  initGlobalHaptics();
}

export const clearFieldErrors = (root = document) => {
  if (!root || typeof root.querySelectorAll !== 'function') return;
  root.querySelectorAll('.input-error-shake, .terms-error-shake').forEach((el) => {
    el.classList.remove('input-error-shake', 'terms-error-shake');
  });
};

export const triggerFieldError = (elOrId, { focus = true } = {}) => {
  if (typeof document === 'undefined') return;
  const el = typeof elOrId === 'string' ? document.getElementById(elOrId) : elOrId;
  if (!el) return;

  const isTermsBox = el.id === 'authTermsAgreeBox' || el.classList.contains('auth-terms-agree-box');
  const cls = isTermsBox ? 'terms-error-shake' : 'input-error-shake';

  let target = el;
  if (el.tagName === 'SELECT') {
    const customTrigger = el.parentElement?.querySelector('.custom-select-trigger');
    if (customTrigger) target = customTrigger;
  }

  target.classList.remove(cls);
  void target.offsetWidth;
  target.classList.add(cls);
  triggerHaptic('medium');

  if (!target._errBound) {
    target._errBound = true;
    const clearSelf = () => target.classList.remove(cls);
    el.addEventListener('input', clearSelf);
    el.addEventListener('change', clearSelf);
    if (target !== el) {
      target.addEventListener('click', clearSelf);
    }
  }

  if (focus && typeof el.focus === 'function') {
    el.focus();
  }
};
