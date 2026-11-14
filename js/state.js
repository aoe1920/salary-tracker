import { WORKPLACE_PALETTES, GUEST_WEEKS_KEY, GUEST_SETTINGS_KEY, LOCAL_CACHE_WEEKS_KEY, LOCAL_CACHE_SETTINGS_KEY } from './config.js';

export const state = {
  currentUser: null,
  weeks: [],
  currentWeekId: null,
  settings: {
    workplaces: ['Mặc định'],
    workplaceRates: {},
    defaultWorkplace: 'Mặc định'
  }
};

export const hasWorkplaces = () => {
  return Array.isArray(state.settings?.workplaces) && state.settings.workplaces.length > 0;
};

export const getDefaultWorkplace = () => {
  if (hasWorkplaces()) {
    if (state.settings?.defaultWorkplace && state.settings.workplaces.includes(state.settings.defaultWorkplace)) {
      return state.settings.defaultWorkplace;
    }
    return state.settings.workplaces[0];
  }
  return '';
};

export const normalizeWorkplacesAndRates = () => {
  if (!state.settings) state.settings = {};
  if (!Array.isArray(state.settings.workplaces)) {
    state.settings.workplaces = [];
  }
  state.settings.workplaces = state.settings.workplaces
    .filter(w => typeof w === 'string' && w.trim().length > 0)
    .map(w => w.trim());
  state.settings.workplaces = Array.from(new Set(state.settings.workplaces));

  if (state.settings.workplaces.length === 0) {
    state.settings.workplaces = ['Mặc định'];
  }

  if (!state.settings.defaultWorkplace || !state.settings.workplaces.includes(state.settings.defaultWorkplace)) {
    state.settings.defaultWorkplace = state.settings.workplaces[0];
  }

  if (!state.settings.workplaceRates || typeof state.settings.workplaceRates !== 'object') {
    state.settings.workplaceRates = {};
  }
  const fallbackRate = Number(state.settings.defaultRate) || (state.weeks?.[0]?.rate) || 25000;
  state.settings.workplaces.forEach(wp => {
    if (state.settings.workplaceRates[wp] === undefined || state.settings.workplaceRates[wp] === null) {
      state.settings.workplaceRates[wp] = fallbackRate;
    }
  });

  if (!state.settings.workplaceColors || typeof state.settings.workplaceColors !== 'object') {
    state.settings.workplaceColors = {};
  }

  if (Array.isArray(state.weeks)) {
    state.weeks.forEach(w => {
      if (Array.isArray(w.shifts)) {
        w.shifts.forEach(s => {
          if (!s.workplace || typeof s.workplace !== 'string' || !s.workplace.trim()) {
            s.workplace = state.settings.defaultWorkplace;
          }
        });
      }
    });
  }
};

export const getWorkplaceColor = (name) => {
  if (!name) return { bg: 'rgba(100, 116, 139, 0.08)', color: '#475569', border: 'rgba(100, 116, 139, 0.2)', fill: '#64748b' };
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  const idx = Math.abs(hash) % WORKPLACE_PALETTES.length;
  return WORKPLACE_PALETTES[idx];
};

export const getWeeksStorageKey = () => {
  if (state.currentUser && state.currentUser.id) {
    return `${LOCAL_CACHE_WEEKS_KEY}_${state.currentUser.id}`;
  }
  return GUEST_WEEKS_KEY;
};

export const getSettingsStorageKey = () => {
  if (state.currentUser && state.currentUser.id) {
    return `${LOCAL_CACHE_SETTINGS_KEY}_${state.currentUser.id}`;
  }
  return GUEST_SETTINGS_KEY;
};

export const getLatestWeek = () => {
  if (!state.weeks || !Array.isArray(state.weeks) || state.weeks.length === 0) {
    return null;
  }
  let latest = state.weeks[state.weeks.length - 1];
  let maxDate = '';
  for (let i = 0; i < state.weeks.length; i++) {
    const w = state.weeks[i];
    if (!w) continue;
    const d = w.startDate || '';
    if (d && (!maxDate || d >= maxDate)) {
      maxDate = d;
      latest = w;
    }
  }
  return latest || state.weeks[state.weeks.length - 1];
};

export const getCurrentWeek = () => {
  if (!state.weeks || !Array.isArray(state.weeks) || state.weeks.length === 0) {
    return null;
  }
  return state.weeks.find(w => w.id === state.currentWeekId) || getLatestWeek() || state.weeks[state.weeks.length - 1];
};

