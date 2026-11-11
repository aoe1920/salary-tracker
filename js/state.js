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
  const oldIdx = state.settings.workplaces.findIndex(w => w === 'Chính' || w === 'Cơ sở chính');
  if (oldIdx !== -1) {
    const oldName = state.settings.workplaces[oldIdx];
    state.settings.workplaces[oldIdx] = 'Mặc định';
    if (state.settings.workplaceRates && state.settings.workplaceRates[oldName] !== undefined) {
      state.settings.workplaceRates['Mặc định'] = state.settings.workplaceRates[oldName];
      delete state.settings.workplaceRates[oldName];
    }
    if (state.settings.defaultWorkplace === oldName) {
      state.settings.defaultWorkplace = 'Mặc định';
    }
    if (Array.isArray(state.weeks)) {
      state.weeks.forEach(w => {
        if (Array.isArray(w.shifts)) {
          w.shifts.forEach(s => {
            if (s.workplace === oldName) s.workplace = 'Mặc định';
          });
        }
      });
    }
  }
  if (!state.settings.workplaceRates || typeof state.settings.workplaceRates !== 'object') {
    state.settings.workplaceRates = {};
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
    const fallbackRate = Number(state.settings.defaultRate) || (state.weeks[0]?.rate) || 0;
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

