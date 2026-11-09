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

const INTERACTIVE_SELECTOR = [
  'button',
  '[role="button"]',
  'a.btn',
  'input[type="button"]',
  'input[type="submit"]',
  'input[type="reset"]',
  'input[type="checkbox"]',
  'input[type="radio"]',
  'summary',
  '.btn',
  '.btn-icon',
  '.btn-primary',
  '.btn-secondary',
  '.btn-danger',
  '.btn-close',
  '.dock-btn',
  '.dock-fab',
  '.dock-item',
  '.nav-btn',
  '.day-btn',
  '.day-pill',
  '.week-item',
  '.week-wheel-item',
  '.tab-btn',
  '.segmented-btn',
  '.chip',
  '.filter-chip',
  '.action-btn',
  '.workplace-item',
  '.workplace-action-btn',
  '.modal-close',
  '.close-btn',
  '.accordion-header',
  '.accordion-trigger',
  '.avatar-option',
  '.avatar-choice',
  '.avatar-card',
  '.avatar-item',
  '.select-option',
  '.dropdown-item',
  '[data-haptic]'
].join(', ');

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
