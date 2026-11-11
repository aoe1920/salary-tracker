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
  if (!Array.isArray(state.settings.workplaces) || state.settings.workplaces.length === 0) {
    state.settings.workplaces = ['Mặc định'];
  }

  const isOldWp = (w) => {
    if (!w || typeof w !== 'string') return false;
    const clean = w.trim().toLowerCase();
    return clean === 'chính' || clean === 'cơ sở chính' || clean.includes('chin chin');
  };

  let migratedRate = null;
  if (state.settings.workplaceRates && typeof state.settings.workplaceRates === 'object') {
    Object.keys(state.settings.workplaceRates).forEach(k => {
      if (isOldWp(k)) {
        if (migratedRate === null && typeof state.settings.workplaceRates[k] === 'number') {
          migratedRate = state.settings.workplaceRates[k];
        }
        delete state.settings.workplaceRates[k];
      }
    });
  }

  let migratedColor = null;
  if (state.settings.workplaceColors && typeof state.settings.workplaceColors === 'object') {
    Object.keys(state.settings.workplaceColors).forEach(k => {
      if (isOldWp(k)) {
        if (!migratedColor) migratedColor = state.settings.workplaceColors[k];
        delete state.settings.workplaceColors[k];
      }
    });
  }

  state.settings.workplaces = state.settings.workplaces.map(w => isOldWp(w) ? 'Mặc định' : w);
  if (!state.settings.workplaces.includes('Mặc định')) {
    state.settings.workplaces.unshift('Mặc định');
  }
  state.settings.workplaces = Array.from(new Set(state.settings.workplaces.filter(Boolean)));

  if (isOldWp(state.settings.defaultWorkplace) || !state.settings.workplaces.includes(state.settings.defaultWorkplace)) {
    state.settings.defaultWorkplace = 'Mặc định';
  }

  if (Array.isArray(state.weeks)) {
    state.weeks.forEach(w => {
      if (Array.isArray(w.shifts)) {
        w.shifts.forEach(s => {
          if (!s.workplace || isOldWp(s.workplace)) {
            s.workplace = 'Mặc định';
          }
        });
      }
    });
  }

  if (!state.settings.workplaceRates || typeof state.settings.workplaceRates !== 'object') {
    state.settings.workplaceRates = {};
  }
  if (state.settings.workplaceRates['Mặc định'] === undefined) {
    state.settings.workplaceRates['Mặc định'] = migratedRate || Number(state.settings.defaultRate) || 40000;
  }

  if (!state.settings.workplaceColors || typeof state.settings.workplaceColors !== 'object') {
    state.settings.workplaceColors = {};
  }
  if (!state.settings.workplaceColors['Mặc định']) {
    state.settings.workplaceColors['Mặc định'] = migratedColor || '#6366f1';
  }

  if (hasWorkplaces()) {
    if (!state.settings.defaultWorkplace || !state.settings.workplaces.includes(state.settings.defaultWorkplace)) {
      state.settings.defaultWorkplace = state.settings.workplaces[0];
    }
  } else {
    state.settings.defaultWorkplace = 'Mặc định';
  }
  const defWp = getDefaultWorkplace();
  if (defWp && (state.settings.workplaceRates[defWp] === undefined || state.settings.workplaceRates[defWp] === null)) {
    const fallbackRate = Number(state.settings.defaultRate) || (state.weeks[0]?.rate) || 40000;
    state.settings.workplaceRates[defWp] = fallbackRate;
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
  let latest = state.weeks[0];
  let latestDate = latest.startDate || '';
  for (let i = 0; i < state.weeks.length; i++) {
    const w = state.weeks[i];
    if (!w) continue;
    const wDate = w.startDate || '';
    if (wDate && (!latestDate || wDate >= latestDate)) {
      latest = w;
      latestDate = wDate;
    }
  }
  if (!latestDate) {
    latest = state.weeks[state.weeks.length - 1];
  }
  return latest || state.weeks[state.weeks.length - 1];
};

export const getCurrentWeek = () => {
  if (!state.weeks || !Array.isArray(state.weeks) || state.weeks.length === 0) {
    return null;
  }
  return state.weeks.find(w => w.id === state.currentWeekId) || getLatestWeek() || state.weeks[state.weeks.length - 1];
};

